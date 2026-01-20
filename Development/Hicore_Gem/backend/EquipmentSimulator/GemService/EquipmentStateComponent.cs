using GemManager;
using GemManager.Interface;
using HSMSLib;
using System;
using System.Net.Http.Headers;

namespace EquipmentSimulator
{
    public class EquipmentStateComponent : IEquipmentStateComponent
    {
        private EquipmentControlState _controlState = EquipmentControlState.Offline;
        private EquipmentProcessState _processState = EquipmentProcessState.Idle;

        public bool IsOnline
        {
            get
            {
                return _controlState == EquipmentControlState.OnlineLocal || _controlState == EquipmentControlState.OnlineRemote;
            }
        }

        public bool IsRemote
        {
            get
            {
                return _controlState == EquipmentControlState.OnlineRemote;
            }
        }


        // 🔔 Raised whenever control or process state changes
        public event Action StateChanged;

        // ============================
        // CONTROL STATE (externally settable)
        // ============================
        public EquipmentControlState ControlState
        {
            get => _controlState;
            set
            {
                if (_controlState == value)
                    return;

                _controlState = value;
                StateChanged?.Invoke();
            }
        }


        // ============================
        // PROCESS STATE (equipment-owned)
        // ============================
        public EquipmentProcessState ProcessState
        {
            get => _processState;
            set
            {
                if (_processState == value)
                    return;

                _processState = value;
                StateChanged?.Invoke();
            }
        }
      
        public bool CanGoOnlineLocal()
        {
          if (ControlState == EquipmentControlState.OnlineLocal)
                return false;

            if (ProcessState != EquipmentProcessState.Idle)
                return false;

            return true;
        }

        public bool CanGoOnlineRemote()
        {
            if (ControlState == EquipmentControlState.OnlineLocal)
                return true;

            return false;
        }

        public bool GoOnlineLocal()
        {
            if(CanGoOnlineLocal())
            {
                ControlState = EquipmentControlState.OnlineLocal;
                return true;
            }

            return false;
        }


        public bool GoOnlineRemote()
        {
            if (CanGoOnlineRemote())
            {
                ControlState = EquipmentControlState.OnlineRemote;
                return true;
            }

            return false;
        }


        public bool CanGoOnRemote()
        {
            if (ControlState == EquipmentControlState.OnlineLocal)
                return true;

            return false;
        }

        public bool GoRemote()
        {
            if (CanGoOnRemote())
            {
                ControlState = EquipmentControlState.OnlineRemote;
                return true;
            }

            return false;
        }

        public bool GoOffline()
        {
            if (ControlState == EquipmentControlState.Offline)
                return false;

            ControlState = EquipmentControlState.Offline;

            return true;
        }

        // ============================
        // PROCESS TRANSITIONS
        // ============================

        public void StartProcess()
        {
            if (_processState != EquipmentProcessState.Idle)
                return;

            _processState = EquipmentProcessState.Running;
            StateChanged?.Invoke();
        }

        public void PauseProcess()
        {
            if (_processState != EquipmentProcessState.Running)
                return;

            _processState = EquipmentProcessState.Paused;
            StateChanged?.Invoke();
        }

        public void ResumeProcess()
        {
            if (_processState != EquipmentProcessState.Paused)
                return;

            _processState = EquipmentProcessState.Running;
            StateChanged?.Invoke();
        }

        public void StopProcess()
        {
            if (_processState == EquipmentProcessState.Idle)
                return;

            _processState = EquipmentProcessState.Idle;
            StateChanged?.Invoke();
        }

        public void AbortProcess()
        {
            _processState = EquipmentProcessState.Aborted;
            StateChanged?.Invoke();
        }
    }

}
