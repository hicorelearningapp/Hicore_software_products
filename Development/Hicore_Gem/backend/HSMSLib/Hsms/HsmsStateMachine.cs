using HSMSLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib
{
    [Serializable]
    public enum HsmsConnectionState
    {
        NotConnected,
        NotSelected,
        Selected
    }

  
    [Serializable]
    public enum GemCommunicationState
    {
        Disabled,
        Established
    }


    [Serializable]
    public enum HsmsInternalState
    {
        Super,
        NotConnected,
        Connected,
        NotSelected,
        Selected
    }

    [Serializable]
    public abstract class HsmsProtocolState : HierarchicalState
    {
        protected HsmsProtocolState(HierarchicalStateMachine machine)
            : base(machine)
        {
        }

        public abstract HsmsInternalState State { get; }
    }


    public class SuperState : HsmsProtocolState
    {
        public SuperState(HierarchicalStateMachine machine)
            : base(machine)
        {
        }

        protected internal override Type GetResultingState(object obj, object parameter)
        {
            if ((int)obj == 1)
                return typeof(NotConnectedState);

            return null;
        }

        public override HsmsInternalState State => HsmsInternalState.Super;
    }

    public class NotConnectedState : HsmsProtocolState
    {
        public NotConnectedState(HierarchicalStateMachine machine)
            : base(machine)
        {
        }

        protected internal override Type GetResultingState(object obj, object parameter)
        {
            if ((int)obj == 2)
                return typeof(NotSelectedState);

            return null;
        }

        public override HsmsInternalState State => HsmsInternalState.NotConnected;
    }

    public class ConnectedState : HsmsProtocolState
    {
        public ConnectedState(HierarchicalStateMachine machine)
            : base(machine)
        {
        }

        // No transitions handled here (only children)
        protected internal override Type GetResultingState(object obj, object parameter)
        {
            return null;
        }

        public override HsmsInternalState State => HsmsInternalState.Connected;
    }

    public class NotSelectedState : HsmsProtocolState
    {
        public NotSelectedState(HierarchicalStateMachine machine)
            : base(machine)
        {
        }

        protected internal override void OnEntry(object parameter)
        { 

            // TODO ....

            //HsmsEntity entity = ((StateChangeArgs)parameter).HsmsEntity;

            //// Active side sends Select.req automatically
            //if (entity is ActiveHsmsEntity)
            //{
            //    try { entity.SendMessage(SelectRequestMessage.Create()); }
            //    catch (Exception) { /* ignore */ }
            //}

            //entity.TimerManager.T7.Start();
        }

        protected internal override void OnExit(object parameter)
        {
            //HsmsEntity entity = ((StateChangeArgs)parameter).HsmsEntity;
            //entity.TimerManager.T7.Cancel();
        }

        protected internal override Type GetResultingState(object obj, object parameter)
        {
            switch ((int)obj)
            {
                case 3: return typeof(SelectedState);
                case 4: return typeof(NotConnectedState);
            }

            return null;
        }

        public override HsmsInternalState State => HsmsInternalState.NotSelected;
    }

    public class SelectedState : HsmsProtocolState
    {
        public SelectedState(HierarchicalStateMachine machine)
            : base(machine)
        {
        }

        protected internal override Type GetResultingState(object obj, object parameter)
        {
            switch ((int)obj)
            {
                case 5: return typeof(NotConnectedState);
                case 6: return typeof(SelectedState); // self-transition
            }
            return null;
        }

        public override HsmsInternalState State => HsmsInternalState.Selected;
    }


    public delegate void HsmsStateChangedEventHandler(object sender, HsmsStateChangedEventArgs e);

    public class HsmsStateMachine : HierarchicalStateMachine
    {
        private readonly object _sync = new object();
        public event HsmsStateChangedEventHandler HsmsStateChanged;

        public HsmsStateMachine()
        {
        }

        public void Initialize()
        {
            lock (_sync)
            {
                base.StateChanged += HsmsStateMachine_StateChanged; ;

                // Create hierarchy
                var super = new SuperState(this);

                var notConnected = new NotConnectedState(this);

                var connected = new ConnectedState(this);
                var notSelected = new NotSelectedState(this);
                var selected = new SelectedState(this);

                connected.AddSubState(notSelected);
                connected.AddSubState(selected);

                super.AddSubState(notConnected);
                super.AddSubState(connected);

                base.Initialize(super);

                // Initial state
                ChangeState(1, null);
            }
        }

   
        // ---------------------------
        // HsmsInternalState Helper Properties
        // ---------------------------

        public bool IsSelected
        {
            get
            {
                lock (_sync) { return CurrentState is SelectedState; }
            }
        }

        public bool IsNotSelected
        {
            get
            {
                lock (_sync) { return CurrentState is NotSelectedState; }
            }
        }

        public bool IsConnected
        {
            get
            {
                lock (_sync) { return IsSelected || IsNotSelected; }
            }
        }

        // ---------------------------
        // HsmsInternalState Change Commands
        // ---------------------------

        public void GoNotConnected(object parameter)
        {
            lock (_sync)
            {
                // Old logic had two different transitions (4 and 5)
                int transitionId = IsSelected ? 5 : 4;
                ChangeState(transitionId, parameter);
            }
        }

        public void GoSelectedFromSelected(object parameter)
        {
            lock (_sync)
            {
                ChangeState(6, parameter);
            }
        }

        public void GoSelected(object parameter)
        {
            lock (_sync)
            {
                ChangeState(3, parameter);
            }
        }

        public void GoNotSelected(object parameter)
        {
            lock (_sync)
            {
                ChangeState(2, parameter);
            }
        }

        // ---------------------------
        // Event Handling
        // ---------------------------

        private void HsmsStateMachine_StateChanged(object sender, StateChangedEventArgs e)
        {
            lock (_sync)
            {
                 OnHsmsStateChanged((HsmsProtocolState)e.OldState, (HsmsProtocolState)e.NewState);
            }
        }
		
		protected virtual void OnHsmsStateChanged(HsmsProtocolState oldState, HsmsProtocolState newState)
        {
            HsmsStateChanged?.Invoke(this, new HsmsStateChangedEventArgs(oldState, newState));
        }
    }

    [Serializable]
    public class HsmsStateChangedEventArgs : EventArgs
    {
        public HsmsProtocolState OldState { get; }
        public HsmsProtocolState NewState { get; }

        public HsmsStateChangedEventArgs(HsmsProtocolState oldState, HsmsProtocolState newState)
        {
            OldState = oldState;
            NewState = newState;
        }
    }

}
