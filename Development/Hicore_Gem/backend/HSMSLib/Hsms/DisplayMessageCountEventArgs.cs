using System;

namespace HSMSLib
{
    [Serializable]
    public class DisplayMessageCountEventArgs : EventArgs
    {
        private int messageCount;
        private int MaxLimit;
        private string LicenseType;
        public DisplayMessageCountEventArgs(int messageCount, string LicenseType, int MaxLimit)
        {
            this.messageCount = messageCount;
            this.LicenseType = LicenseType;
            this.MaxLimit = MaxLimit;

        }
        public string Licensetype
        {
            get { return LicenseType; }
        }
        public int MessageCount
        {
            get { return messageCount; }
        }
        public int Maxlimit
        {
            get { return MaxLimit; }
        }
    }

}
