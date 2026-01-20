using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib.HsmsParser
{

    [Serializable]
    public sealed class TextParsingFailedException : Exception
    {
        public int LineNumber { get; }
        public int CharNumber { get; }

        public TextParsingFailedException(string message, int lineNumber, int charNumber)
            : base($"{message} (Line {lineNumber}, Char {charNumber})")
        {
            LineNumber = lineNumber;
            CharNumber = charNumber;
        }

        // For wrapping other exceptions while preserving line/char information
        public TextParsingFailedException(string message, int lineNumber, int charNumber, Exception inner)
            : base($"{message} (Line {lineNumber}, Char {charNumber})", inner)
        {
            LineNumber = lineNumber;
            CharNumber = charNumber;
        }

        // Serialization constructor
        private TextParsingFailedException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
            LineNumber = info.GetInt32(nameof(LineNumber));
            CharNumber = info.GetInt32(nameof(CharNumber));
        }

        // Serialization support
        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            base.GetObjectData(info, context);
            info.AddValue(nameof(LineNumber), LineNumber);
            info.AddValue(nameof(CharNumber), CharNumber);
        }
    }

    [Serializable]
    public sealed class UnknownDataTypeException : Exception
    {
        public string DataType { get; }

        public UnknownDataTypeException(string dataType)
            : base($"Unknown SECS/HSMS Data Type: '{dataType}'")
        {
            DataType = dataType;
        }

        public UnknownDataTypeException(string dataType, Exception inner)
            : base($"Unknown SECS/HSMS Data Type: '{dataType}'", inner)
        {
            DataType = dataType;
        }

        // Serialization constructor
        private UnknownDataTypeException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
            DataType = info.GetString(nameof(DataType));
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            base.GetObjectData(info, context);
            info.AddValue(nameof(DataType), DataType);
        }
    }

    internal sealed class StringParser
    {
        private readonly string _text;
        private int _index;
        private int _lineNumber;
        private int _charNumber;

        private readonly Stack<BackTrackInfo> _backtrack = new Stack<BackTrackInfo>();
        private static readonly char[] _whiteSpace = new[] { ' ', '\r', '\n', '\t' };

        internal StringParser(string text)
        {
            _text = text ?? throw new ArgumentNullException(nameof(text));
            _index = 0;
            _lineNumber = 0;
            _charNumber = 0;
        }

        public static HsmsMessage[] Parse(byte[] secsData)
        {
            ByteParser byteParser = new ByteParser(secsData);
            try
            {
                return byteParser.Parse();
            }
            catch (Exception ex)
            {
                throw new ByteParsingFailedException(byteParser.Index);
            }
        }

        internal HsmsMessage[] Parse()
        {
            var messages = new List<HsmsMessage>();

            SkipWhiteSpaceAndComments();
            while (!IsEndOfText())
            {
                messages.Add(ParseMessage());
                SkipWhiteSpaceAndComments();
            }

            return messages.ToArray();
        }

        #region Savepoint/Backtrack
        private sealed class BackTrackInfo
        {
            public int Index { get; }
            public int Line { get; }
            public int Char { get; }
            public BackTrackInfo(int idx, int line, int ch)
            {
                Index = idx; Line = line; Char = ch;
            }
        }

        public void CreateSavePoint() => _backtrack.Push(new BackTrackInfo(_index, _lineNumber, _charNumber));
        public void ClearSavePoint() { if (_backtrack.Count > 0) _backtrack.Pop(); }
        public void BackTrack()
        {
            if (_backtrack.Count == 0) throw new InvalidOperationException("No savepoint");
            var b = _backtrack.Pop();
            _index = b.Index;
            _lineNumber = b.Line;
            _charNumber = b.Char;
        }
        #endregion

        private bool IsEndOfText() => _index >= _text.Length;

        private char Peek()
        {
            SkipWhiteSpaceAndComments();
            if (IsEndOfText()) TriggerHitEOFException();
            return _text[_index];
        }

        private char GetNextChar()
        {
            SkipWhiteSpaceAndComments();
            if (IsEndOfText()) TriggerHitEOFException();

            char c = _text[_index++];
            if (c == '\n') { _lineNumber++; _charNumber = 0; }
            else { _charNumber++; }
            return c;
        }

        private char GetNextCharRaw()
        {
            if (IsEndOfText()) TriggerHitEOFException();
            char c = _text[_index++];
            if (c == '\n') { _lineNumber++; _charNumber = 0; } else { _charNumber++; }
            return c;
        }

        private void SkipWhiteSpaceAndComments()
        {
            while (true)
            {
                // skip whitespace
                while (_index < _text.Length && Array.IndexOf(_whiteSpace, _text[_index]) >= 0)
                {
                    if (_text[_index] == '\n') { _lineNumber++; _charNumber = 0; } else { _charNumber++; }
                    _index++;
                }

                if (_index >= _text.Length) return;

                // line comments starting with '*' or '//' (legacy in your parser)
                if (_text[_index] == '*')
                {
                    // skip until newline
                    while (_index < _text.Length && _text[_index] != '\n') _index++;
                    continue;
                }
                if (_text[_index] == '/' && _index + 1 < _text.Length && _text[_index + 1] == '/')
                {
                    _index += 2;
                    while (_index < _text.Length && _text[_index] != '\n') _index++;
                    continue;
                }
                // block comment /* ... */
                if (_text[_index] == '/' && _index + 1 < _text.Length && _text[_index + 1] == '*')
                {
                    _index += 2;
                    while (_index + 1 < _text.Length && !(_text[_index] == '*' && _text[_index + 1] == '/'))
                    {
                        if (_text[_index] == '\n') { _lineNumber++; _charNumber = 0; }
                        else { _charNumber++; }
                        _index++;
                        if (_index >= _text.Length) TriggerParsingFailedException("*/");
                    }
                    if (_index + 1 < _text.Length) _index += 2;
                    continue;
                }

                break;
            }
        }

        #region Parse primitives & helpers

        private void TriggerHitEOFException()
        {
            throw new TextParsingFailedException("Unexpected end of file", _lineNumber + 1, _charNumber);
        }

        private void TriggerParsingFailedException(string expected)
        {
            string got = _index < _text.Length ? _text[_index].ToString() : "EOF";
            string message = $"Expected {expected}, Got {got}";
            throw new TextParsingFailedException(message, _lineNumber + 1, _charNumber);
        }

        private ParseResult TriggerFailureParseResult(string expected)
        {
            string got = _index < _text.Length ? _text[_index].ToString() : "EOF";
            string exceptionText = $"Expected {expected}, Got {got}";
            return new ParseResult(exceptionText, _lineNumber + 1, _charNumber);
        }

        private void AssertNextNonWhiteSpaceCharIs(char c, bool ignoreCase = false)
        {
            char actual = GetNextNonWhiteSpaceChar();
            if (ignoreCase)
            {
                if (char.ToUpperInvariant(actual) != char.ToUpperInvariant(c)) TriggerParsingFailedException(c.ToString());
            }
            else
            {
                if (actual != c) TriggerParsingFailedException(c.ToString());
            }
        }

        private char GetNextNonWhiteSpaceChar()
        {
            SkipWhiteSpaceAndComments();
            return GetNextCharRaw();
        }

        private char PeekNextNonWhiteSpaceChar()
        {
            SkipWhiteSpaceAndComments();
            if (IsEndOfText()) TriggerHitEOFException();
            return _text[_index];
        }

        #endregion

        private HsmsMessage ParseMessage()
        {
            CreateSavePoint();

            // Try to parse message name or SxFy notation
            string messageName = ParseTextToken(); // may return empty if SxFy used
            ParseResult res = ExpectNextNonWhiteSpaceCharToBe(':');

            byte stream = 0, function = 0;
            bool isWaitBitSet = false;

            if (!res.Success)
            {
                // restore and parse SxFy
                BackTrack();
                ParseStreamAndFunction(out stream, out function);
            }
            else
            {
                // Name present; still parse SxFy after ':'
                // consume colon already consumed by ExpectNext...
                ParseStreamAndFunction(out stream, out function);
                ClearSavePoint();
            }

            isWaitBitSet = ParseWBit();

            SecsItem item = null;
            CreateSavePoint();
            var itemParseResult = ParseItem(out item);
            if (!itemParseResult.Success)
            {
                BackTrack();
            }
            else
            {
                ClearSavePoint();
            }

            AssertNextNonWhiteSpaceCharIs('.', ignoreCase: false);

            // If messageName empty, build from SxFy
            if (string.IsNullOrEmpty(messageName))
                messageName = $"S{stream}F{function}";

            // create HsmsDataMessage (device id left 0 — caller can overwrite)
            return HsmsDataMessage.Create(messageName, stream, function, isWaitBitSet, item, 0x0);
        }

        private ParseResult ExpectNextNonWhiteSpaceCharToBe(char c)
        {
            char ch = PeekNextNonWhiteSpaceChar();
            if (ch != c) return TriggerFailureParseResult(c.ToString());
            // consume
            GetNextChar();
            return new ParseResult(true);
        }

        private string ParseTextToken()
        {
            SkipWhiteSpaceAndComments();
            var sb = new StringBuilder();

            while (!IsEndOfText())
            {
                char c = _text[_index];
                if (char.IsLetterOrDigit(c) || c == '_')
                {
                    sb.Append(c);
                    _index++;
                    if (c == '\n') { _lineNumber++; _charNumber = 0; } else { _charNumber++; }
                }
                else break;
            }

            return sb.ToString();
        }

        private void ParseStreamAndFunction(out byte stream, out byte function)
        {
            bool quoted = false;
            if (PeekNextNonWhiteSpaceChar() == '\'')
            {
                GetNextNonWhiteSpaceChar(); // consume opening quote
                quoted = true;
            }

            AssertNextNonWhiteSpaceCharIs('S', ignoreCase: true);
            stream = (byte)ParseInteger();

            AssertNextNonWhiteSpaceCharIs('F', ignoreCase: true);
            function = (byte)ParseInteger();

            if (quoted)
            {
                AssertNextNonWhiteSpaceCharIs('\'');
            }
        }

        private bool ParseWBit()
        {
            char ch = PeekNextNonWhiteSpaceChar();
            if (char.ToUpperInvariant(ch) == 'W')
            {
                GetNextChar(); // consume W
                return true;
            }
            return false;
        }

        public ParseResult ParseItem(out SecsItem SecsItem)
        {
            SecsItem = null;
            ParseResult r = ExpectNextNonWhiteSpaceCharToBe('<');
            if (!r.Success) return r;

            string dataType;
            try
            {
                dataType = ParseTextToken().ToUpperInvariant();
                SecsParser secsParser = new SecsParser();
               //  var itemParser = SecsItemParserFactory.CreateItemParser(dataType);
              //   SecsItem = secsParser.Parse(this);
                return new ParseResult(true);
            }
            catch (UnknownDataTypeException)
            {
                TriggerParsingFailedException("Unknown ItemType");
                return new ParseResult("Unknown ItemType", _lineNumber + 1, _charNumber);
            }
        }

        public int ParseInteger()
        {
            SkipWhiteSpaceAndComments();
            var sb = new StringBuilder();
            if (_index < _text.Length && (_text[_index] == '+' || _text[_index] == '-'))
            {
                sb.Append(_text[_index++]);
                _charNumber++;
            }

            bool found = false;
            while (_index < _text.Length && char.IsDigit(_text[_index]))
            {
                sb.Append(_text[_index++]);
                _charNumber++;
                found = true;
            }

            if (!found) TriggerParsingFailedException("Number");
            return int.Parse(sb.ToString());
        }

        public double ParseDouble()
        {
            string part1 = ParseTextToken();
            if (string.IsNullOrEmpty(part1)) TriggerParsingFailedException("Number");
            if (PeekNextNonWhiteSpaceChar() != '.') return double.Parse(part1);
            // consume '.'
            GetNextNonWhiteSpaceChar();
            string part2 = ParseTextToken();
            return double.Parse(part1 + "." + part2);
        }

        public ParseResult ParseHex(out byte[] hex)
        {
            hex = Array.Empty<byte>();
            var r = ExpectNextNonWhiteSpaceCharToBe('0');
            if (!r.Success) return r;
            char c = GetNextNonWhiteSpaceChar();
            if (char.ToUpperInvariant(c) != 'X') return TriggerFailureParseResult("x");
            return ParseHexWithoutPrefix(out hex);
        }

        public ParseResult ParseHexWithoutPrefix(out byte[] hexValues)
        {
            hexValues = Array.Empty<byte>();
            string text = ParseTextToken();
            if (text.Length % 2 != 0) text = "0" + text;
            int len = text.Length / 2;
            var result = new byte[len];
            for (int i = 0, j = 0; i < text.Length; i += 2, j++)
            {
                string cur = text.Substring(i, 2);
                if (!byte.TryParse(cur, System.Globalization.NumberStyles.AllowHexSpecifier, null, out var b))
                {
                    if (cur == "00")
                    {
                        hexValues = new byte[] { 0 };
                        return new ParseResult(true);
                    }
                    return TriggerFailureParseResult("Hex Value");
                }
                result[j] = b;
            }
            hexValues = result;
            return new ParseResult(true);
        }

        public ParseResult ParseBoolean(out byte[] hexValues)
        {
            hexValues = null;

            CreateSavePoint();
            char c = PeekNextNonWhiteSpaceChar();

            if (c == '0')
            {
                GetNextNonWhiteSpaceChar();
                if (char.ToUpperInvariant(PeekNextNonWhiteSpaceChar()) == 'X')
                {
                    GetNextNonWhiteSpaceChar();
                    return ParseHexWithoutPrefix(out hexValues);
                }
                hexValues = new byte[] { 0 };
            }
            else if (c == '1')
            {
                GetNextNonWhiteSpaceChar();
                hexValues = new byte[] { 1 };
            }
            else if (char.ToUpperInvariant(c) == 'F')
            {
                string text = ParseTextToken();
                if (text.Equals("FALSE", StringComparison.OrdinalIgnoreCase)) hexValues = new byte[] { 0 };
                else if (text.Equals("F", StringComparison.OrdinalIgnoreCase)) hexValues = new byte[] { 0 };
                else return TriggerFailureParseResult("0/1 or T/F or TRUE/FALSE");
            }
            else if (char.ToUpperInvariant(c) == 'T')
            {
                string text = ParseTextToken();
                if (text.Equals("TRUE", StringComparison.OrdinalIgnoreCase)) hexValues = new byte[] { 1 };
                else if (text.Equals("T", StringComparison.OrdinalIgnoreCase)) hexValues = new byte[] { 1 };
                else return TriggerFailureParseResult("0/1 or T/F or TRUE/FALSE");
            }
            else
            {
                return TriggerFailureParseResult("0/1 or T/F or TRUE/FALSE");
            }

            return new ParseResult(true);
        }

        private ParseResult ParseWidth(out int width)
        {
            width = 0;
            var r = ExpectNextNonWhiteSpaceCharToBe('/');
            if (!r.Success) return r;
            width = ParseInteger();
            return new ParseResult(true);
        }

        public ParseResult ParseItemCount(out int itemCount, out int itemWidth)
        {
            itemCount = 0; itemWidth = 0;
            var r = ExpectNextNonWhiteSpaceCharToBe('[');
            if (!r.Success) return r;

            CreateSavePoint();
            var widthRes = ParseWidth(out itemWidth);
            bool widthPresent;
            if (!widthRes.Success)
            {
                BackTrack();
                itemCount = ParseInteger();
                widthPresent = false;
            }
            else
            {
                widthPresent = true;
                ClearSavePoint();
            }

            if (!widthPresent)
            {
                CreateSavePoint();
                var widthRes2 = ParseWidth(out itemWidth);
                if (!widthRes2.Success) BackTrack();
                else ClearSavePoint();
            }

            AssertNextNonWhiteSpaceCharIs(']');
            return new ParseResult(true);
        }

        private static bool IsWhiteSpace(char c) => Array.IndexOf(_whiteSpace, c) >= 0;

        internal int CurrentLineNumber => _lineNumber;
        internal int CurrentCharNumber => _charNumber;
    }

}
