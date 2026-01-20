namespace GemManager
{
    public interface IDataCollectionState
    {
        bool IsEnabled { get; set; }
    }

    public class DataCollectionState : IDataCollectionState
    {
        public bool IsEnabled { get; set; }

        internal void Enable() => IsEnabled = true;
        internal void Disable() => IsEnabled = false;
    }
}