using System;

namespace HSMSLib
{
    [Serializable]
    public class TrafficMessageLoggedEventArgs : EventArgs
    {
        private string Description;
        private string message;
        public TrafficMessageLoggedEventArgs(string message, string Description)
        {
            this.message = message;
            this.Description = Description;

        }
        public string description
        {
            get { return Description; }
        }
        public string Message
        {
            get { return message; }
        }
    }

}
