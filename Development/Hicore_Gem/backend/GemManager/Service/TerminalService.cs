using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Service
{
    public interface ITerminalService
    {
        /// <summary>
        /// Displays a terminal message to the operator (S10F3).
        /// </summary>
        void Display(string message);

        /// <summary>
        /// Indicates whether terminal display is available.
        /// </summary>
        bool IsAvailable { get; }

        /// <summary>
        /// ShowMessage
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="message"></param>
        void ShowMessage(byte tid , string message);

        event Action<string> _displayAction;

    }

    public class TerminalService : ITerminalService
    {

        public bool IsAvailable
        {
            get { return _displayAction != null; }
        }


        public event Action<string> _displayAction;


        public void Display(string message)
        {
            if (!IsAvailable)
                return;

            // Optional: sanitize or limit message length
            _displayAction(message);
        }

        public void ShowMessage(byte tid, string message)
        {
            if(_displayAction != null)
                _displayAction(message);
        }
    }
}
