using System;

namespace HSMSLib
{
    [Serializable]
    public class TimeoutOccurredEventArgs : MarshalByRefObject
    {
        private TimeoutType timeoutType;
        private int timeoutVal;

        public override object InitializeLifetimeService()
        {
            return null;
        }

        public TimeoutOccurredEventArgs(TimeoutType timeoutType, int timeoutVal)
        {
            this.timeoutType = timeoutType;
            this.timeoutVal = timeoutVal;
        }

        public TimeoutType TimeoutType
        {
            get { return timeoutType; }
        }

        public int TimeoutVal
        {
            get { return timeoutVal; }
        }
    }

}
