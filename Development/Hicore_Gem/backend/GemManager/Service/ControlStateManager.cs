using GemManager.Interface;
using System;
using static GemManager.GemRecipeInfo;

namespace GemManager
{
    /*  public enum GemControlState
    {
        Offline,        // GEM not active
        OnlineLocal,    // GEM active, local operator controls
        OnlineRemote    // GEM active, host controls
    }

  public interface IControlStateManager
    {
        GemControlState ControlState { get; }
        bool IsOnline { get; }
        bool IsRemote { get; }

        bool RequestOnline();      // from S1F17
        void GoOffline();          // from S1F15
        void SetLocal();
        void SetRemote();

        event Action StateChanged;
    }


    public sealed class ControlStateManager : IControlStateManager
    {
        private readonly ICommunicationStateManager _comm;

        public GemControlState ControlState { get; private set; }
            = GemControlState.Offline;

        public bool IsOnline => ControlState != GemControlState.Offline;
        public bool IsRemote => ControlState == GemControlState.OnlineRemote;

        public event Action StateChanged;

        public ControlStateManager(ICommunicationStateManager comm)
        {
            _comm = comm;
            _comm.StateChanged += OnCommStateChanged;
        }

        private void OnCommStateChanged()
        {
            // 🔴 GEM lost → force Offline
            if (!_comm.IsCommunicating && ControlState != GemControlState.Offline)
            {
                ControlState = GemControlState.Offline;
                StateChanged?.Invoke();
            }
        }

        public bool RequestOnline()
        {
            // Called by S1F17

            if (!_comm.IsCommunicating)
                return false;

            if (ControlState != GemControlState.Offline)
                return true;

            ControlState = GemControlState.OnlineLocal; // default
            StateChanged?.Invoke();
            return true;
        }

        public void GoOffline()
        {
            if (ControlState == GemControlState.Offline)
                return;

            ControlState = GemControlState.Offline;
            StateChanged?.Invoke();
        }

        public void SetLocal()
        {
            if (ControlState == GemControlState.Offline)
                return;

            ControlState = GemControlState.OnlineLocal;
            StateChanged?.Invoke();
        }

        public void SetRemote()
        {
            if (ControlState == GemControlState.Offline)
                return;

            ControlState = GemControlState.OnlineRemote;
            StateChanged?.Invoke();
        }
    }
  */
}