using System;

namespace HSMSLib
{
    [Serializable]
    public class MessageReceivedEventArgs : EventArgs
    {
        private HsmsMessage message;
        public MessageReceivedEventArgs(HsmsMessage message)
        {
            this.message = message;
        }

        public HsmsMessage Message
        {
            get { return message; }
        }
    }

}
