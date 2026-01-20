using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib
{

    public enum MessageType
    {
        HsmsControl,
        HsmsData,
        ScriptData,
        Other
    }

    public enum TimeStampFormatType
    {
        None,
        DateOnly,
        DateandTime,
        TimeInMilliseconds,
        TimeInMicroseconds
    }

    public class MessageLoggedEventArgs : EventArgs
    {
        public MessageLoggedEventArgs(string message, MessageType type)
        {
            Message = message;
            MessageType = type;
        }

        public string Message { get; private set; }
        public MessageType MessageType { get; private set; }
    }

    public delegate void MessageLoggedEventHandler(object sender, MessageLoggedEventArgs e);

    /// <summary>
    /// Thread-safe global logger singleton.
    /// </summary>
    public sealed class Logger
    {
        private static readonly Logger _instance = new Logger();
        private readonly object _sync = new object();

        public static Logger Instance { get { return _instance; } }

        public static event MessageLoggedEventHandler MessageLogged;

        public TimeStampFormatType TimeStampFormat { get; set; }

        private Logger()
        {
            // Default timestamp format
            TimeStampFormat = TimeStampFormatType.DateandTime;
        }

        public void Log(string message, MessageType type)
        {
            string formatted = ApplyTimestamp(message);
            FireMessageLogged(formatted, type);
        }

        public void Log(string message)
        {
            Log(message, MessageType.Other);
        }

        public string GetTime()
        {
            return ApplyTimestamp(null);
        }

        public void Logmessage(string message)
        {
            FireMessageLogged(message, MessageType.Other);
        }

        // ------------------ Helpers ------------------

        private string ApplyTimestamp(string msg)
        {
            string ts;

            switch (TimeStampFormat)
            {
                case TimeStampFormatType.None:
                    ts = "";
                    break;

                case TimeStampFormatType.DateOnly:
                    ts = DateTime.Now.ToString("yy/MM/dd ");
                    break;

                case TimeStampFormatType.DateandTime:
                    ts = DateTime.Now.ToString("yy/MM/dd HH:mm:ss ");
                    break;

                case TimeStampFormatType.TimeInMilliseconds:
                    ts = DateTime.Now.ToString("yy/MM/dd HH:mm:ss:fff ");
                    break;

                case TimeStampFormatType.TimeInMicroseconds:
                    ts = DateTime.Now.ToString("yy/MM/dd HH:mm:ss:ffffff ");
                    break;

                default:
                    ts = DateTime.Now.ToString("yy/MM/dd HH:mm:ss ");
                    break;
            }

            return msg == null ? ts : ts + msg;
        }

        private void FireMessageLogged(string message, MessageType msgType)
        {
            var handler = MessageLogged;
            if (handler == null)
                return;

            var args = new MessageLoggedEventArgs(message, msgType);
            Delegate[] delegates = handler.GetInvocationList();

            var toRemove = new System.Collections.Generic.List<Delegate>();

            foreach (MessageLoggedEventHandler h in delegates)
            {
                try
                {
                    h(this, args);
                }
                catch (AppDomainUnloadedException)
                {
                    toRemove.Add(h);
                }
                catch (Exception ex)
                {
                    // Never log inside the logger → avoid recursion.
                    System.Diagnostics.Trace.WriteLine(ex);
                }
            }

            // unsubscribe handlers that failed
            foreach (var d in toRemove)
                MessageLogged -= (MessageLoggedEventHandler)d;
        }
    }

    /// <summary>
    /// Writes log messages to a file.
    /// </summary>
    public class FileLogger : IDisposable
    {
        private TextWriter _writer;

        public FileLogger(string logFilePath)
        {
            try
            {
                _writer = new StreamWriter(logFilePath, true);
            }
            catch (UnauthorizedAccessException ex)
            {
                System.Diagnostics.Trace.WriteLine(ex);
                _writer = null;
            }
        }

        public void Initialize()
        {
            Logger.MessageLogged += OnMessageLogged;
        }

        private void OnMessageLogged(object sender, MessageLoggedEventArgs e)
        {
            if (_writer == null) return;

            try
            {
                _writer.WriteLine(e.Message);
                _writer.Flush();
            }
            catch (ObjectDisposedException)
            {
                // file already closed
            }
        }

        public void Close()
        {
            Dispose(true);
        }

        public void Dispose()
        {
            Dispose(true);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                Logger.MessageLogged -= OnMessageLogged;

                if (_writer != null)
                {
                    try { _writer.Close(); }
                    catch { }

                    _writer = null;
                }

                GC.SuppressFinalize(this);
            }
        }

        ~FileLogger()
        {
            Dispose(false);
        }
    }
}


