using GemManager.Interface;
using HSMSLib;
using System;
using static GemManager.GemRecipeInfo;

namespace GemManager
{
    public interface ICommunicationStateManager
    {
        HsmsConnectionState HsmsConnectionState { get; set; }

        GemCommunicationState GemCommState { get; }
        bool IsCommunicating { get; }

        void OnCommAccepted();
           
        event Action StateChanged;
    }

    public sealed class CommunicationStateManager : ICommunicationStateManager
    {
        private readonly HsmsEntity _hsms;
        private readonly IGemInterface _equipment;

        public GemCommunicationState GemCommState { get; private set; }
            = GemCommunicationState.Disabled;

        public bool IsCommunicating =>
            GemCommState == GemCommunicationState.Established;

        public HsmsConnectionState HsmsConnectionState { get; set; }

        public event Action StateChanged;

        public CommunicationStateManager(HsmsEntity hsms, IGemInterface equipment)
        {
            _hsms = hsms ?? throw new ArgumentNullException(nameof(hsms));
            _equipment = equipment;
            _hsms.StateMachine.HsmsStateChanged += OnHsmsStateChanged;
        }
        public void OnCommAccepted()
        {
            if (HsmsConnectionState != HsmsConnectionState.Selected)
                return;

            if (GemCommState == GemCommunicationState.Established)
                return;

            GemCommState = GemCommunicationState.Established;
            StateChanged?.Invoke();

        }

        private void OnHsmsStateChanged(
            object sender,
            HsmsStateChangedEventArgs e)
        {
            var oldGemState = GemCommState;
            var newState = e.NewState.State;


            switch (e.NewState.State)
            {
                case HsmsInternalState.Selected:
                    HsmsConnectionState = HsmsConnectionState.Selected;
                    break;

                case HsmsInternalState.NotSelected:
                    HsmsConnectionState = HsmsConnectionState.NotSelected;
                    break;

                case HsmsInternalState.NotConnected:
                default:
                    HsmsConnectionState = HsmsConnectionState.NotConnected;
                    break;
            }

            // HSMS loss may FORCE GEM offline
            if (HsmsConnectionState != HsmsConnectionState.Selected)
            {
                _equipment.OnCommunicationLost("HSMS not selected");
                GemCommState = GemCommunicationState.Disabled;
            }

            StateChanged?.Invoke();

        }
    }
}