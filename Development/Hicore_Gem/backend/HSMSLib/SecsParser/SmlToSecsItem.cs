using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib
{
    public static class SecsItemFactory
    {
        /// <summary>
        /// Create a SECS-II item from a format string (A, U2, L, B, etc.) and a text value.
        /// </summary>
        public static SecsItem FromString(string format, string text)
        {
            if (format == null)
                throw new ArgumentNullException("format");

            format = format.Trim().ToUpperInvariant();

            switch (format)
            {
                case "L":
                    return new ListItem();

                case "A":
                    return new AsciiItem(text ?? "");

                case "B":
                    return new BinaryItem(ParseBinary(text));

                case "U1":
                    return new U1Item(ParseU1(text));

                case "U2":
                    {
                        ushort[] values = Split(text).Select(v => ushort.Parse(v)).ToArray();
                        return new U2Item(values);
                    }

                case "U4":
                    {
                        uint[] values = Split(text).Select(v => uint.Parse(v)).ToArray();
                        return new U4Item(values);
                    }

                case "I1":
                    {
                        sbyte[] values = Split(text).Select(v => sbyte.Parse(v)).ToArray();
                        return new I1Item(values);
                    }

                case "I2":
                    {
                        short[] values = Split(text).Select(v => short.Parse(v)).ToArray();
                        return new I2Item(values);
                    }

                case "I4":
                    {
                        int[] values = Split(text).Select(v => int.Parse(v)).ToArray();
                        return new I4Item(values);
                    }


                case "I8":
                    {
                        long[] values = Split(text).Select(v => long.Parse(v)).ToArray();
                        return new I8Item(values);
                    }

                    
                case "F4":
                    {
                        float[] values = Split(text)
                            .Select(v => float.Parse(v, CultureInfo.InvariantCulture))
                            .ToArray();

                        return new F4Item(values);
                    }

                case "F8":
                    {
                        double[] values = Split(text)
                            .Select(v => double.Parse(v, CultureInfo.InvariantCulture))
                            .ToArray();

                        return new F8Item(values);
                    }

                case "BOOLEAN":
                    {
                        bool[] values = Split(text)
                            .Select(v => v == "1")
                            .ToArray();

                        return new BooleanItem(values);
                    }

                default:
                    throw new Exception("Unsupported SECS format: " + format);
            }
        }

        public static SecsItem FromObject(object value)
        {
            if (value == null)
                return new AsciiItem("");

            switch (value)
            {
                case byte b:
                    return new U1Item(new[] { b });

                case ushort u2:
                    return new U2Item(new[] { u2 });

                case uint u4:
                    return new U4Item(new[] { u4 });

                case sbyte i1:
                    return new I1Item(new[] { i1 });

                case short i2:
                    return new I2Item(new[] { i2 });

                case int i4:
                    return new I4Item(new[] { i4 });

                case long i8:
                    return new I8Item(new[] { i8 });

                case float f4:
                    return new F4Item(new[] { f4 });

                case double f8:
                    return new F8Item(new[] { f8 });

                case bool b:
                    return new BooleanItem(new[] { b });

                case string s:
                    return new AsciiItem(s);

                default:
                    return new AsciiItem(value.ToString());
            }
        }


        private static string[] Split(string text)
        {
            return string.IsNullOrWhiteSpace(text)
                ? Array.Empty<string>()
                : text.Split(new[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries);
        }


        /// <summary>
        /// Converts hex string ("0A FF 2C") into byte[].
        /// </summary>
        private static byte[] ParseBinary(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return Array.Empty<byte>();

            string[] parts = text
                .Split(new char[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries);

            return parts
                .Select(p =>
                {
                    string v = p.StartsWith("0x", StringComparison.OrdinalIgnoreCase)
                        ? p.Substring(2)
                        : p;

                    return byte.Parse(v, NumberStyles.HexNumber, CultureInfo.InvariantCulture);
                })
                .ToArray();
        }


        private static byte[] ParseU1(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return Array.Empty<byte>();


            byte[] values = text
                .Split(new[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(v => byte.Parse(v, CultureInfo.InvariantCulture))
                .ToArray();

            return values;
        }
    }

    public static class SmlToSecsItem
    {
        public static SecsItem Parse(string sml)
        {
            List<string> lines = Normalize(sml);
            int i = 0;
            return ParseItem(lines, ref i, 0);
        }

        private static List<string> Normalize(string text)
        {
            return text.Replace("\r", "")
                       .Split('\n')
                       .Where(l => !string.IsNullOrWhiteSpace(l))
                       .Select(l => l.TrimEnd())
                       .ToList();
        }

        private static SecsItem ParseItem(List<string> lines, ref int i, int indent)
        {
            if (i >= lines.Count)
                throw new Exception("Unexpected end");

            int actualIndent = CountSpaces(lines[i]);
            if (actualIndent != indent)
                throw new Exception("Indent mismatch: " + lines[i]);

            string line = lines[i].Trim();
            i++;

            string[] parts = line.Split(new char[] { ' ' }, 2);
            string code = parts[0].ToUpperInvariant();
            string arg = parts.Length > 1 ? parts[1].Trim() : "";

            if (code == "L")
            {
                ListItem list = new ListItem();

                while (i < lines.Count && CountSpaces(lines[i]) > indent)
                {
                    SecsItem child = ParseItem(lines, ref i, indent + 2);
                    list.AddItem(child);
                }
                return list;
            }
            else
            {
                return SecsItemFactory.FromString(code, ExtractValue(code, arg));
            }
        }

        private static string ExtractValue(string code, string arg)
        {
            if (code == "A")
            {
                if (arg.StartsWith("\"") && arg.EndsWith("\""))
                    return arg.Substring(1, arg.Length - 2);
            }
            return arg;
        }

        private static int CountSpaces(string s)
        {
            int c = 0;
            while (c < s.Length && s[c] == ' ')
                c++;
            return c;
        }
    }
}
