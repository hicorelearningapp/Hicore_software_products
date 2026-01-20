using GemManager;
using GemManager.Interface;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace GemManager
{

    public enum LoggerLevel
    {
        Debug = 0,   // Most detailed logs (development & deep troubleshooting)
        Info = 1,    // Normal operational logs (recommended default)
        Warn = 2,    // Something unexpected but not fatal
        Error = 3    // Failures and exceptions
    }

    public class FileLogger : ILogger
    {

        private readonly object _lock = new object();
        private readonly string _logDirectory;
        private readonly LoggerLevel _minLevel;
        private string _currentLogFile;

        public FileLogger(string directory = "C:\\temp\\Gemlogs", LoggerLevel minLevel = LoggerLevel.Debug)
        {
            _logDirectory = directory;
            _minLevel = minLevel;

            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            UpdateLogFile();
        }

        private void UpdateLogFile()
        {
            string date = DateTime.Now.ToString("yyyy-MM-dd");
            _currentLogFile = Path.Combine(_logDirectory, $"gem_{date}.log");
        }

        private void Write(LoggerLevel level, string message)
        {
            if (level < _minLevel)
                return;

            lock (_lock)
            {
                // Rotate file daily
                UpdateLogFile();

                string line = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] [{level}] {message}";
                File.AppendAllText(_currentLogFile, line + Environment.NewLine);
            }
        }

        public void Info(string message) => Write(LoggerLevel.Info, message);
        public void Warn(string message) => Write(LoggerLevel.Warn, message);
        public void Debug(string message) => Write(LoggerLevel.Debug, message);

        public void Error(string message, Exception ex = null)
        {
            Write(LoggerLevel.Error, message);
            if (ex != null)
                Write(LoggerLevel.Error, ex.ToString());
        }
    }

}
