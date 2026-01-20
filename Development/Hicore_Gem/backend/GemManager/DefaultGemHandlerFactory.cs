using HSMSLib;
using System.Collections.Generic;

namespace GemManager
{
    public enum CommandSource
    {
        Host,
        Equipment,
        Internal
    }

    public class GemCommandResult
    {
        public bool Success { get; }
        public string ErrorCode { get; }
        public string ErrorMessage { get; }
        public Dictionary<string, object> Data { get; }

        private GemCommandResult(
            bool success,
            Dictionary<string, object> data = null,
            string errorCode = null,
            string errorMessage = null)
        {
            Success = success;
            ErrorCode = errorCode;
            ErrorMessage = errorMessage;
            Data = data ?? new Dictionary<string, object>();
        }

        // Success Result
        public static GemCommandResult Ok(Dictionary<string, object> data = null)
        {
            return new GemCommandResult(true, data ?? new Dictionary<string, object>());
        }

        // Failure Result
        public static GemCommandResult Fail(string errorCode, string errorMessage)
        {
            return new GemCommandResult(false, null, errorCode, errorMessage);
        }
    }

    public class GemCommandRequest
    {
        /// <summary>
        /// SxFy command name (e.g., "S1F1", "S2F41").
        /// Used to find the correct handler.
        /// </summary>
        public string CommandName { get; }

        /// <summary>
        /// SECS Stream number.
        /// </summary>
        public int Stream { get; }

        /// <summary>
        /// SECS Function number.
        /// </summary>
        public int Function { get; }

        /// <summary>
        /// HSMS transaction ID (System Bytes).
        /// </summary>
        public int TransactionId { get; }

        /// <summary>
        /// ID of host that sent the command (optional).
        /// </summary>
        public string HostId { get; }

        /// <summary>
        /// Key-value parameters extracted from the SECS message.
        /// e.g. VIDs, RCMD name, RCMD arguments, etc.
        /// </summary>
        public Dictionary<string, object> Parameters { get; }

        /// <summary>
        /// Raw SECS message coming from the HSMS layer.
        /// Useful for advanced handlers.
        /// </summary>
        public SecsMessage RawMessage { get; }

        public GemCommandRequest(
            string commandName,
            int stream,
            int function,
            int transactionId,
            string hostId,
            Dictionary<string, object> parameters,
            SecsMessage rawMessage = null)
        {
            CommandName = commandName;
            Stream = stream;
            Function = function;
            TransactionId = transactionId;
            HostId = hostId;
            Parameters = parameters ?? new Dictionary<string, object>();
            RawMessage = rawMessage;
        }
    }


}
