
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using HSMSLib.SecsHsms;
using HSMSLib.SecsItems;

namespace HSMSLib
{
    public static partial class MessageBuilder
    {
        // ---------------------------------------------------------------------
        // TID GENERATOR (Thread-safe)
        // ---------------------------------------------------------------------

        private static ushort _tidCounter = 1;
        private static readonly object _tidLock = new object();

        private static ushort NextTID()
        {
            lock (_tidLock)
            {
                if (_tidCounter == ushort.MaxValue)
                    _tidCounter = 1;

                return _tidCounter++;
            }
        }

        // ---------------------------------------------------------------------
        // SYSTEM BYTES GENERATOR (4 bytes)
        // ---------------------------------------------------------------------

        private static readonly RNGCryptoServiceProvider _rng = new RNGCryptoServiceProvider();

        private static byte[] NextSystemBytes()
        {
            var bytes = new byte[4];
            _rng.GetBytes(bytes);
            return bytes;
        }


        /// <summary>
        /// Build a SECS message by parsing SML text body into SecsItem.
        /// </summary>
        public static SecsMessage BuildFromSml(byte stream, byte function, string smlBody)
        {
            if (string.IsNullOrWhiteSpace(smlBody))
                throw new Exception("SML body is empty.");

            var body = SecsStringParser.Parse(smlBody);

            var header = new MessageHeader
            {
                Stream = stream,
                Function = function,
                IsPrimary = true,
                IsWaitBitSet = true,
                TID = NextTID(),
                SystemBytes = NextSystemBytes()
            };

            return new SecsMessage
            {
                Header = header,
                Body = body
            };
        }
    }

    public static class SecsStringParser
    {
        public static SecsItem Parse(string sml)
        {
            if (string.IsNullOrWhiteSpace(sml))
                throw new Exception("SML input is empty.");

            var lines = Normalize(sml);
            if (lines.Count == 0)
                return new ListItem(); // < >

            int index = 0;
            return ParseItem(lines, ref index, 0);
        }

        private static List<string> Normalize(string sml)
        {
            return sml
                .Replace("\r", "")
                .Replace("\t", "  ")
                .Split('\n')
                .Select(RemoveComment)
                .Select(l => l.TrimEnd())
                .Where(l => !string.IsNullOrWhiteSpace(l))
                .Where(l => l.Trim() != ">")
                .ToList();
        }

        private static string RemoveComment(string line)
        {
            int idx = line.IndexOf("/*");
            return idx >= 0 ? line.Substring(0, idx) : line;
        }

        private static SecsItem ParseItem(List<string> lines, ref int idx, int expectedIndent)
        {
            string raw = lines[idx];
            int actualIndent = CountIndent(raw);

            if (actualIndent < expectedIndent)
                throw new Exception($"Indent error at line {idx + 1}: {raw}");

            string line = raw.Trim();

            if(line.StartsWith("<"))
            {
                line = line.Substring(1);
            }
            
            if(line.EndsWith(">"))
            {
                line = line.Substring(0,line.Length - 1).Trim();

            }
            // Remove < >
            if (line.StartsWith("<") && line.EndsWith(">"))
                line = line.Substring(1, line.Length - 2).Trim();

            // ✅ EMPTY MESSAGE OR EMPTY LIST
            if (line.Length == 0)
            {
                idx++;
                return new ListItem();
            }

            string format;
            string remainder = "";

            int space = line.IndexOf(' ');
            if (space > 0)
            {
                format = line.Substring(0, space).ToUpperInvariant();
                remainder = line.Substring(space + 1).Trim();

                int square = remainder.IndexOf(']');
                if(square != -1)
                    remainder = remainder.Substring(square + 1);

            }
            else
            {
                format = line.ToUpperInvariant();
            }

            idx++;

            // LIST
            if (format.StartsWith("L"))
            {
                ListItem list = new ListItem();

                while (idx < lines.Count && CountIndent(lines[idx]) > actualIndent)
                {
                    var child = ParseItem(lines, ref idx, actualIndent + 2);
                    if (child != null)
                        list.AddItem(child);
                }

                return list;
            }

            // PRIMITIVE
            string value = ExtractValue(remainder);
            return SecsItemFactory.FromString(format, value);
        }
        private static string ExtractValue(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return "";

            input = input.Trim();

            // Remove [count] or [...]
            if (input.StartsWith("["))
            {
                int end = input.IndexOf(']');
                if (end >= 0)
                    input = input.Substring(end + 1).Trim();
            }

            // BOOLEAN
            if (input.Equals("TRUE", StringComparison.OrdinalIgnoreCase))
                return "1";
            if (input.Equals("FALSE", StringComparison.OrdinalIgnoreCase))
                return "0";

            // Remove quotes
            if ((input.StartsWith("'") && input.EndsWith("'")) ||
                (input.StartsWith("\"") && input.EndsWith("\"")))
            {
                return input.Substring(1, input.Length - 2);
            }

            return input;
        }

        private static int CountIndent(string line)
        {
            int count = 0;
            foreach (char c in line)
            {
                if (c == ' ')
                    count++;
                else
                    break;
            }
            return count;
        }
    }

}
