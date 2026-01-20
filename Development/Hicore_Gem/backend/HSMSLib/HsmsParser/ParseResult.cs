using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.HsmsParser
{
    // File: ParseResult.cs
    internal sealed class ParseResult
    {
        public bool Success { get; }
        public string ErrorText { get; }
        public int ErrorLineNumber { get; }
        public int ErrorCharNumber { get; }

        public ParseResult(bool success)
        {
            Success = success;
        }

        public ParseResult(string errorText, int errorLineNumber, int errorCharNumber)
        {
            Success = false;
            ErrorText = errorText;
            ErrorLineNumber = errorLineNumber;
            ErrorCharNumber = errorCharNumber;
        }
    }

}
