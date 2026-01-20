using HSMSLib.HsmsParser;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Threading;

namespace HSMSLib
{
    public delegate void TimeoutOccurredEventHandler(object sender, TimeoutOccurredEventArgs e);
    public delegate void MessageReceivedEventHandler(object sender, MessageReceivedEventArgs e);
    public delegate void TrafficMessageLoggedEventHandler(object sender, TrafficMessageLoggedEventArgs e);
    public delegate void DisplayMessageCountEventHandler(object sender, DisplayMessageCountEventArgs e);

    public abstract class HsmsEntity : IDisposable
    {
        // ---------- events ----------
        public event EventHandler<MessageReceivedEventArgs> MessageReceived;
        public event EventHandler<TimeoutOccurredEventArgs> TimeoutOccurred;
        public event EventHandler<TrafficMessageLoggedEventArgs> TrafficMessageLogged;

        // ---------- state ----------
        private readonly object _sync = new object();
        private ClientHandler _clientHandler;
        private readonly List<T3Timer> _outstandingMessageTimers = new List<T3Timer>();

        private Thread _communicatorThread;
        private CancellationTokenSource _cts = new CancellationTokenSource();   

        private HsmsReceiver _receiver;

        private readonly HsmsStateMachine _stateMachine = new HsmsStateMachine();
        private readonly TimerManager _timerManager;

        private ushort _deviceId;
        private HsmsEntityType _entityType;

        // communicator signals
        private readonly AutoResetEvent _communicationBrokeEvent = new AutoResetEvent   (false);
        private readonly AutoResetEvent _stopThreadEvent = new AutoResetEvent(false);
        private readonly AutoResetEvent _communicationAttemptFailedEvent = new AutoResetEvent(false);

        protected HsmsEntity()
        {
            _timerManager = new TimerManager(this);
            _stateMachine.HsmsStateChanged += _stateMachine_HsmsStateChanged;
        }

        private void _stateMachine_HsmsStateChanged(object sender, HsmsStateChangedEventArgs e)
        {
            HsmsConnectionState connectionState= MapToConnectionState(e.NewState.State);

            ConnectionStateChanged?.Invoke(this, connectionState);
        }

        public event EventHandler<HsmsConnectionState> ConnectionStateChanged;


        private static HsmsConnectionState MapToConnectionState(HsmsInternalState state)
        {
            switch (state)
            {
                case HsmsInternalState.Selected:
                    return HsmsConnectionState.Selected;

                case HsmsInternalState.NotSelected:
                    return HsmsConnectionState.NotSelected;

                case HsmsInternalState.NotConnected:
                    return HsmsConnectionState.NotConnected;

                default:
                    return HsmsConnectionState.NotConnected;
            }
        }


        private void HsmsStateMachine_StateChanged(object sender, StateChangedEventArgs e)
        {
            // Cast from base type
            var newHsmsState = e.NewState as HsmsProtocolState;
            if (newHsmsState == null)
                return;

            HsmsInternalState internalState = newHsmsState.State;

            HsmsConnectionState guiState =
                MapToConnectionState(internalState);

            // 🔔 Notify GUI
            ConnectionStateChanged?.Invoke(this, guiState);
        }

        public HsmsStateMachine StateMachine => _stateMachine;
        internal TimerManager TimerManager => _timerManager;
        public ushort DeviceID => _deviceId;
        public HsmsEntityType EntityType => _entityType;

        // ---------- lifecycle ----------
        public virtual void Start()
        {
            _stateMachine.Initialize();
            StartCommunicatorThread();
        }

        public void Stop()
        {
            try { _cts.Cancel(); } catch { }
            _stopThreadEvent.Set();

            CleanupCommunications();
            _timerManager.ResetAll();
            DropConnection();
        }

        // ---------- factory ----------
        public static HsmsEntity Create(HsmsConfig config)
        {
            HsmsEntity entity = null;

            if (config.EntityMode == HsmsEntityMode.Active)
            {
                entity = new ActiveHsmsEntity(config.ActiveEntityConfig.HostName, config.ActiveEntityConfig.Port);
            }
            else
            {
                entity = new PassiveHsmsEntity(config.PassiveEntityConfig.HostName, config.PassiveEntityConfig.Port);
            }

            entity._deviceId = config.DeviceId;
            entity._entityType = config.EntityType;

            entity.TimerManager.T5.TimeOut = config.T5Timeout * 1000;
            entity.TimerManager.T6.TimeOut = config.T6Timeout * 1000;
            entity.TimerManager.T7.TimeOut = config.T7Timeout * 1000;
            entity.TimerManager.T3Timeout = config.T3Timeout * 1000;

            return entity;
        }

        // ---------- abstract comm ----------
        protected abstract TcpClient StartCommunications();
        protected abstract void ResetCommunications();
        protected abstract void InitializeCommunications();
        protected abstract void CleanupCommunications();

        // ---------- connection ----------
        protected void HandleClient(TcpClient tcpClient)
        {
            lock (_sync)
            {
                _clientHandler = new ClientHandler(tcpClient);

                if(tcpClient.Connected)
                {
                    _stateMachine.GoNotSelected(new StateChangeArgs(this, null));

                }
                else
                {
                    _stateMachine.GoNotConnected(new StateChangeArgs(this, null));
                }

                _receiver = new HsmsReceiver(
                    () => _clientHandler,
                    OnMessageReceived,
                    () =>
                    {
                        PerformConnectionBreakupActions();
                        _communicationBrokeEvent.Set();

                        // IMPORTANT: move HSMS back to NotConnected
                  //      _stateMachine.GoNotConnected(
                    //        new StateChangeArgs(this, null));
                    },
                    _cts.Token
                );

                _receiver.Start();
            }
        }

        internal void DropConnection()
        {
            lock (_sync)
            {
                try { _clientHandler?.Shutdown(); } catch { }
                _clientHandler = null;
            }
        }

        internal void OnT3Timeout()
        {
            // HSMS rule: re-enter Selected on T3 timeout
            _stateMachine.GoSelectedFromSelected(this);
        }

        public HsmsMessage SendSecsMessage(
                byte stream,
                byte function,
                bool waitBit,
                SecsItem body,
                string messageName = "")
        {
            if (body == null)
                body = new ListItem();   // empty list if no body

            // Build HSMS Data Message
            HsmsMessage message = HsmsDataMessage.Create(
                messageName: messageName,
                stream: stream,
                function: function,
                isWaitBitSet: waitBit,
                item: body,
                deviceId: this.DeviceID
            );

            // Send using standard HSMS send
            SendMessage(message);

            return message;
        }

        internal void PerformConnectionBreakupActions()
        {
            if (_stateMachine.IsConnected)
                _stateMachine.GoNotConnected(new StateChangeArgs(this, null));

            _timerManager.Reset();
        }

        // ---------- sender (UNCHANGED) ----------
        public void SendMessage(HsmsMessage message)
        {
            if (message.MessageHeader.SessionId == 0)
                message.MessageHeader.SessionId = _deviceId;

            message.BeforeSendMessage(this);

            lock (_sync)
            {
                if (_clientHandler == null)
                    throw new InvalidOperationException("No connection");

                _clientHandler.SendMessage(message.GetBytes());
            }

            message.PrintHexaDecimal();
        }


        // ===================== VALIDATION =====================
        private bool IsValidDeviceId(ushort id) => id == _deviceId;

        private static bool IsValidStream(byte stream) => stream <= 63;

        private static bool IsValidFunction(byte stream, byte function)
        {
            if (stream == 0) return function == 0;
            return function >= 1 && function <= 63;
        }

        // ===================== S9Fx =====================
        private void SendS9F1(HsmsMessage m) => SendS9(m, 1);
        private void SendS9F3(HsmsMessage m) => SendS9(m, 3);
        private void SendS9F5(HsmsMessage m) => SendS9(m, 5);

        private void SendS9(HsmsMessage m, byte fn)
        {
            var bin = new BinaryItem(m.MessageHeader.GetBytes());
            SendMessage(HsmsDataMessage.Create("", 9, fn, true, bin, _deviceId));
        }

        // ---------- receive ----------
        protected void OnMessageReceived(HsmsMessage message)
        {
            message.ProcessMessage(this);

        
            if (!message.MessageHeader.IsControlMessage)
            {
                if(!IsValidDeviceId(message.MessageHeader.SessionId))
                {
                    SendS9F1(message);
                    return;
                }

                if (!IsValidStream(message.MessageHeader.Stream))
                {
                    SendS9F3(message);
                    return;
                }

                if (!IsValidFunction(message.MessageHeader.Stream, message.MessageHeader.Function))
                {
                    SendS9F5(message);
                    return;
                }

                MessageReceived?.Invoke(this, new MessageReceivedEventArgs(message));
            }
        }

        // ---------- transaction timers ----------
        internal void AddTransactionTimer(T3Timer timer)
        {
            lock (_outstandingMessageTimers)
                _outstandingMessageTimers.Add(timer);
        }

        internal void RemoveTransactionTimer(T3Timer timer)
        {
            lock (_outstandingMessageTimers)
                _outstandingMessageTimers.Remove(timer);
        }

        internal void RemoveAllTransactionTimers()
        {
            lock (_outstandingMessageTimers)
            {
                foreach (var t in _outstandingMessageTimers)
                    t.Dispose();
                _outstandingMessageTimers.Clear();
            }
        }

        internal T3Timer[] GetTransactionTimers()
        {
            lock (_outstandingMessageTimers)
                return _outstandingMessageTimers.ToArray();
        }

      

        private void SendS9F7(HsmsMessage msg)
        {
            var mhead = new BinaryItem(msg.MessageHeader.GetBytes());
            SendMessage(HsmsDataMessage.Create("", 9, 7, true, mhead, _deviceId));
        }

        // ---------- communicator ----------
        private void StartCommunicatorThread()
        {
            _communicatorThread = new Thread(CommunicatorThread)
            {
                IsBackground = true,
                Name = "HsmsCommunicator"
            };
            _communicatorThread.Start();
        }

        private void CommunicatorThread()
        {
            var waits = new WaitHandle[]
            {
                _stopThreadEvent,
                _communicationAttemptFailedEvent,
                _communicationBrokeEvent
            };

            InitializeCommunications();

            while (!_cts.IsCancellationRequested)
            {
                TcpClient client = null;

                try { client = StartCommunications(); }
                catch { _communicationAttemptFailedEvent.Set(); }

                if (client != null)
                    HandleClient(client);

                int idx = WaitHandle.WaitAny(waits);
                if (waits[idx] == _stopThreadEvent)
                    break;

                ResetCommunications();
            }
        }

        public void Dispose()
        {
            Stop();
            _receiver?.Dispose();
            RemoveAllTransactionTimers();
        }

        private void FireTrafficMessageLoggedEventHandler(string message, string description)
        {
            var handler = TrafficMessageLogged;
            if (handler == null) return;

            var args = new TrafficMessageLoggedEventArgs(message, description);
            Delegate[] delegates = handler.GetInvocationList();
            var toRemove = new List<Delegate>();

            foreach (TrafficMessageLoggedEventHandler h in delegates)
            {
                try
                {
                    h(this, args);
                }
                catch (AppDomainUnloadedException)
                {
                    toRemove.Add(h);
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Trace.WriteLine(ex.ToString());
                }
            }

            // Intentionally not removing delegates (same as your original code)
        }

        private void FireTimeoutOccurredEventHandler(TimerBase timer)
        {
            var handler = TimeoutOccurred;
            if (handler == null) return;

            var args = new TimeoutOccurredEventArgs(timer.TimeoutType, timer.TimeOut);
            Delegate[] delegates = handler.GetInvocationList();
            var toRemove = new List<Delegate>();

            foreach (TimeoutOccurredEventHandler h in delegates)
            {
                try
                {
                    h(this, args);
                }
                catch (AppDomainUnloadedException)
                {
                    toRemove.Add(h);
                }
                catch (Exception ex)
                {
                    Logger.Instance.Log(ex.Message, MessageType.Other);
                }
            }
        }

        // ---------- timer callbacks ----------
        internal void OnTimeoutOccurred(TimerBase timer)
        {
            if (timer == null) return;

            int timeoutInSeconds = timer.TimeOut / 1000;

            Logger.Instance.Log(
                "Timeout " + timer.TimeoutType +
                " (" + timeoutInSeconds + " Seconds) occurred.",
                MessageType.Other);

            FireTimeoutOccurredEventHandler(timer);

            if (timer.TimeoutType == TimeoutType.T3)
            {
                var msg = ((T3Timer)timer).DataMessage.MessageHeader.ToString();
                FireTrafficMessageLoggedEventHandler(
                    msg,
                    timer.TimeoutType + " TimeOut");
            }
        }
    }
}
