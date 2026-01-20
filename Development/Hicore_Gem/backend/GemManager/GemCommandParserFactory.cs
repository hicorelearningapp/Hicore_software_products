using GemManager.Parsers;
using HSMSLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager
{
    public interface IGemCommandParser
    {
        /// <summary>
        /// SxFy name this parser supports (e.g., "S1F3", "S6F11")
        /// </summary>
        string CommandName { get; }

        /// <summary>
        /// Extract semantic parameters from a raw SECS message
        /// </summary>
        Dictionary<string, object> Parse(SecsMessage message);
    }

    public class GemCommandParserFactory
    {
        private readonly Dictionary<string, IGemCommandParser> _parsers;

        public GemCommandParserFactory(IEnumerable<IGemCommandParser> parsers)
        {
            _parsers = parsers.ToDictionary(p => p.CommandName);
        }

        public GemCommandParserFactory()
        {
            _parsers = new Dictionary<string, IGemCommandParser>();

            RegisterAll();
           
        }

        public void RegisterAll()
        {
            // ================= STREAM 1 =================
            Register(new S1F3Parser());
            Register(new S1F11Parser());
            Register(new S1F13Parser());

            // ================= STREAM 2 =================
            Register(new S2F1Parser());
            Register(new S2F3Parser());
            Register(new S2F5Parser());
            Register(new S2F13Parser());
            Register(new S2F15Parser());
            Register(new S2F23Parser());
            Register(new S2F29Parser());
            Register(new S2F31Parser());
            Register(new S2F33Parser());
            Register(new S2F35Parser());
            Register(new S2F37Parser());
            Register(new S2F41Parser());

            // ================= STREAM 3 =================
            Register(new S3F1Parser());
            Register(new S3F3Parser());
            Register(new S3F5Parser());

            // ================= STREAM 4 =================
            Register(new S4F1Parser());

            // ================= STREAM 5 =================
            Register(new S5F3Parser());
            Register(new S5F5Parser());

            // ================= STREAM 6 =================
            
            Register(new S6F1Parser());

            Register(new S6F3Parser());
            Register(new S6F5Parser());

            Register(new S6F15Parser());
            Register(new S6F19Parser());
            Register(new S6F23Parser());

            // ================= STREAM 7 =================
            Register(new S7F1Parser());
            Register(new S7F3Parser());
            Register(new S7F5Parser());
            Register(new S7F17Parser());

            // ================= STREAM 10 =================
            Register(new S10F1Parser());
            Register(new S10F3Parser());

            // ================= STREAM 12 =================
            Register(new S12F1Parser());
        }
        private readonly object _lock = new object();

        public void Register(IGemCommandParser parser)
        {

            if (parser == null)
                throw new ArgumentNullException(nameof(parser));

            if (string.IsNullOrWhiteSpace(parser.CommandName))
                throw new ArgumentException("Parser CommandName cannot be null or empty");

            lock (_lock)
            {
                _parsers[parser.CommandName] = parser;
            }

        }

        public IGemCommandParser Get(string commandName)
        {
            if (string.IsNullOrWhiteSpace(commandName))
                return null;

            lock (_lock)
            {
                IGemCommandParser parser;
                _parsers.TryGetValue(commandName, out parser);
                return parser;
            }
        }

        /// <summary>
        /// Optional: check if parser exists
        /// </summary>
        public bool Contains(string commandName)
        {
            lock (_lock)
            {
                return _parsers.ContainsKey(commandName);
            }
        }
    }
}
