using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using HSMSLib;
using HSMSLib.SecsItems;


namespace HostSimulator
{
     public sealed class HostSimulatorApp
    {
        // -------------------------
        // Singleton Instance
        // -------------------------
        private static readonly Lazy<HostSimulatorApp> _instance =
            new Lazy<HostSimulatorApp>(() => new HostSimulatorApp());

        public static HostSimulatorApp Instance => _instance.Value;

        // -------------------------
        // Internal Fields
        // -------------------------
        public ActiveHsmsEntity Hsms { get; private set; }

        public SecsAdapter Secs { get; private set; }
        public SecsMessageLogger Logger { get; private set; }



        private string _equipmentIp = "127.0.0.1";
        private int _equipmentPort = 5001;

        private bool _started = false;


        private HostSimulatorApp()
        {
            
        }

        // public event EventHandler<MessageReceivedEventArgs> MessageReceived;

        //  public Action<string> OnSecSendMessageEvent;

        public event Action<SecsMessage> SecsMessageReceived;
        public event Action<SecsMessage> SecsMessageSent;


        // -------------------------
        // Init configuration
        // -------------------------
        public void Configure(string equipmentIp, int port)
        {
            _equipmentIp = equipmentIp;
            _equipmentPort = port;
        }

        // -------------------------
        // Start HSMS Active connection
        // -------------------------
        public void Start()
        {
            if (_started) return;

            Hsms = new ActiveHsmsEntity(_equipmentIp, _equipmentPort);

            // 🔑 Subscribe BEFORE Start()
            Hsms.ConnectionStateChanged += Hsms_ConnectionStateChanged;


            // 2. Logger (shared with GUI)
            Logger = new SecsMessageLogger(2000);

            // 3. SECS Adapter
            Secs = new SecsAdapter(Hsms, Logger);

            Secs.SecsMessageReceived += OnSecsMessageReceived;
            Secs.SecsMessageSent += OnSecsMessageSent;


            // Begin connection thread
            Hsms.Start();

            _started = true;
            Console.WriteLine($"[HOST] HSMS Active started → {_equipmentIp}:{_equipmentPort}");
        }

        private void Hsms_ConnectionStateChanged(object sender, HsmsConnectionState state)
        {
            Console.WriteLine($"[HOST] HSMS → {state}");

            if (state == HsmsConnectionState.NotSelected)
            {
                Console.WriteLine("[HOST] Sending SelectRequest");
                Hsms.SendMessage(SelectRequestMessage.Create());

                SendS1F1();
            }
        }

        public void Disconnect()
        {
            if (Hsms == null)
                return;

            Console.WriteLine("[HOST] User requested Disconnect");

            // 1️⃣ Graceful deselect if selected
            if (Hsms.StateMachine.IsSelected)
            {
                Console.WriteLine("[HOST] Sending DeselectRequest");
                Hsms.SendMessage(DeselectRequestMessage.Create());
            }

            // 2️⃣ Close TCP and stop HSMS
            Hsms.Stop();   // triggers socket close + NotConnected

            _started = false;
            Console.WriteLine("[HOST] HSMS stopped");
        }


        private void OnSecsMessageReceived(SecsMessage msg)
        {
            string label = msg.IsPrimary
                ? "[HOST RX Primary]"
                : "[HOST RX Secondary]";

            Console.WriteLine($"{label} {msg}");

            SecsMessageReceived?.Invoke( msg );
        }

        private void OnSecsMessageSent(SecsMessage obj)
        {
            SecsMessageSent?.Invoke(obj);
        }
      
        // -------------------------
        // Utility: Generic send
        // -------------------------
        public void Send(byte stream, byte function, bool waitBit, SecsItem body = null)
        {
            if (Hsms == null)
            {
                Console.WriteLine("[HOST ERROR] Cannot send — HSMS not started.");
                return;
            }

            // 🔴 IMPORTANT: Convert empty list to null (SECS rule)
            if (body is ListItem list && list.ItemCount == 0)
            {
                body = null;
            }

            Secs.SendMessage(stream, function, waitBit, body);
            string log = $"[HOST TX] S{stream}F{function} {(waitBit ? "W" : "")}";
            Console.WriteLine($"[HOST TX] S{stream}F{function} {(waitBit ? "W" : "")}");
        }


        public (byte stream, byte function) ParseSxFy(string sxfy)
        {
            if (string.IsNullOrWhiteSpace(sxfy))
                throw new ArgumentException("SxFy string is empty.");

            sxfy = sxfy.Trim().ToUpperInvariant();

            if (!sxfy.StartsWith("S") || !sxfy.Contains("F"))
                throw new FormatException("Invalid SxFy format.");

            int fIndex = sxfy.IndexOf('F');

            string sPart = sxfy.Substring(1, fIndex - 1);
            string fPart = sxfy.Substring(fIndex + 1);

            if (!byte.TryParse(sPart, out byte stream))
                throw new FormatException("Invalid stream number.");

            if (!byte.TryParse(fPart, out byte function))
                throw new FormatException("Invalid function number.");

            return (stream, function);
        }

        public void Send(string selectedCommand, string commandbody)
        {
            var (stream, function) = ParseSxFy(selectedCommand);

            SecsItem secitem = SecsStringParser.Parse(commandbody);
            Send(stream, function, true, secitem);
        }
        // -------------------------
        // Common Host Functions
        // -------------------------

        // S1F1 — Are You There?
        public void SendS1F1()
        {
            Send(1, 1, true, new ListItem());
        }

        // S1F13 — Establish Communication
        public void SendS1F13()
        {
            Send(1, 13, true, new ListItem());
        }

        // S2F41 — Remote Command
        public void SendS2F41(string rcmd, Dictionary<string, string> parameters)
        {
            var list = new ListItem();
            list.AddItem(new AsciiItem(rcmd));

            var paramList = new ListItem();
            foreach (var p in parameters)
            {
                var pair = new ListItem();
                pair.AddItem(new AsciiItem(p.Key));
                pair.AddItem(new AsciiItem(p.Value));
                paramList.AddItem(pair);
            }

            list.AddItem(paramList);

            Send(2, 41, true, list);
        }

        // S1F3 — Request VIDs
        public void SendS1F3(params ushort[] vids)
        {
            var list = new ListItem();
            foreach (ushort vid in vids)
                list.AddItem(new U2Item(vid));

            Send(1, 3, true, list);
        }
    }

}
