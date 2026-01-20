using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager.Interface
{
    public interface ILogger
    {
        void Info(string message);
        void Warn(string message);
        void Error(string message, Exception ex = null);
        void Debug(string message);
    }
}
