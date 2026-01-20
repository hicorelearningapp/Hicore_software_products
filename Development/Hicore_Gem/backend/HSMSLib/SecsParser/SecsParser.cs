using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib
{
   public enum SecsFormat : byte
    {
        List = 0x00,

        Binary = 0x01,
        Boolean = 0x19,
        ASCII = 0x10,
        JIS8 = 0x11,

        I1 = 0x06,
        I2 = 0x07,
        I4 = 0x09,
        I8 = 0x0A,

        F4 = 0x08,
        F8 = 0x0B,

        U1 = 0x02,
        U2 = 0x03,
        U4 = 0x05,
        U8 = 0x0C
    }


    public static class SecsValueParser
    {
        public static byte ParseU1(SecsItem item)
        {

            // Default value
            byte result = 0;

            var u1 = item as U1Item;
            if (u1 == null || u1.ItemCount == 0)
            {
                return result;
            }

            byte value = u1.GetValue();

            // Optional range check (non-fatal)
            if (value == 0 || value == 1)
            {
                result = value;
            }

            return result;
        }


        public static List<uint> ParseU4List(SecsItem body)
        {
            var result = new List<uint>();

            var li = body as ListItem;

            if (li == null)
            {
                return result;
            }

            for (int i = 0; i < li.Count; i++)
            {
                if (li[i] is U4Item u4)
                {
                    uint[] values = (uint[])u4.GetContents();
                    result.AddRange(values);
                }
            }

            return result;
        }

        public static string ParseAscii(SecsItem body)
        {
            if (body is AsciiItem a)
                return a.GetValue();

            throw new InvalidOperationException("Expected ASCII item for PPID");
        }


        public static List<ushort> ParseU2List(SecsItem body)
        {
            var result = new List<ushort>();

            var li = body as ListItem;

            if (li == null)
            {
                return result;
            }

            for (int i = 0; i < li.Count; i++)
            {
                if (li[i] is U2Item u2)
                {
                    ushort[] values = (ushort[])u2.GetContents();
                    result.AddRange(values);
                }
            }

            return result;
        }

     }

    public class SecsParser
    {
        public SecsItem Parse(byte[] buffer)
        {
            var (item, used) = ParseItem(buffer, 0);
            return item;
        }

        private (SecsItem Item, int Used) ParseItem(byte[] buf, int pos)
        {
            if (buf == null) throw new ArgumentNullException(nameof(buf));
            if (pos < 0 || pos >= buf.Length) throw new Exception("ParseItem: beyond buffer");

            // first byte = format(6) | lengthCode(2)
            byte fb = buf[pos];

            // Correct format extraction: top 6 bits shifted
            SecsFormat format = (SecsFormat)((fb & 0xFC) >> 2);

            // number of length bytes = (low2bits) + 1
            int numLenBytes = (fb & 0x03) + 1;
            if (numLenBytes < 1 || numLenBytes > 3)
                throw new Exception($"Invalid SECS length field size: {numLenBytes}");

            // ensure length bytes available
            if (pos + 1 + numLenBytes > buf.Length)
                throw new Exception("SECS message truncated (missing length bytes)");

            // read big-endian length
            int length = 0;
            for (int i = 0; i < numLenBytes; i++)
                length = (length << 8) | (buf[pos + 1 + i] & 0xFF);

            int dataPos = pos + 1 + numLenBytes;
            int endPos = dataPos + length;

            // Quick bounds check for non-LIST types
            if (format != SecsFormat.List)
            {
                if (endPos > buf.Length)
                    throw new Exception("SECS message truncated (missing payload bytes)");
                byte[] val = new byte[length];
                if (length > 0) Buffer.BlockCopy(buf, dataPos, val, 0, length);
                return (CreatePrimitive(format, val), endPos - pos);
            }

            // --------------------------
            // LIST: two possible vendor conventions:
            //  - SEMI E5: length = number of child items
            //  - Some vendors: length = byte-length of the children (non-standard)
            // We'll try standard first, then fallback to byte-length parsing.
            // --------------------------
            // Helper: parse as "count-of-items"
            (SecsItem Item, int Used) tryParseAsCount()
            {
                var items = new List<SecsItem>();
                int cursor = dataPos;
                int itemsParsed = 0;

                try
                {
                    while (itemsParsed < length)
                    {
                        if (cursor >= buf.Length)
                            throw new Exception("SECS message truncated while parsing LIST children (count-mode)");

                        var (child, used) = ParseItem(buf, cursor);
                        if (used <= 0) throw new Exception("Parser error: child used length is zero (count-mode)");
                        items.Add(child);
                        cursor += used;
                        itemsParsed++;
                        if (cursor > buf.Length) throw new Exception("SECS message truncated while parsing LIST children (count-mode)");
                    }

                    // success — ensure we didn't overshoot unexpected bytes for count-mode
                    return (new ListItem(items), cursor - pos);
                }
                catch (Exception ex)
                {
                    // bubble up to caller so we can attempt fallback
                    throw new Exception($"Count-mode LIST parse failed: {ex.Message}", ex);
                }
            }

            // Helper: parse as "byte-length"
            (SecsItem Item, int Used) tryParseAsByteLength()
            {
                // Here `length` means number of bytes that belong to the list payload
                int byteEnd = dataPos + length;
                if (byteEnd > buf.Length) throw new Exception("SECS message truncated (LIST byte-length mode)");

                var items = new List<SecsItem>();
                int cursor = dataPos;

                while (cursor < byteEnd)
                {
                    var (child, used) = ParseItem(buf, cursor);
                    if (used <= 0) throw new Exception("Parser error: child used length is zero (byte-length mode)");
                    items.Add(child);
                    cursor += used;
                    if (cursor > byteEnd) throw new Exception("SECS LIST overflow: children exceed declared byte-length");
                }

                // success
                return (new ListItem(items), byteEnd - pos);
            }

            // Try standard (count) first
            try
            {
                return tryParseAsCount();
            }
            catch (Exception countEx)
            {
                // If count-mode fails because of truncated payload or mismatch, attempt byte-length fallback.
                // Provide diagnostic info in exception if fallback also fails.
                try
                {
                    return tryParseAsByteLength();
                }
                catch (Exception byteEx)
                {
                    // Build helpful debug message: show a short hex dump of the problematic region
                    int dumpStart = Math.Max(0, pos);
                    int dumpEnd = Math.Min(buf.Length, Math.Min(pos + 128, buf.Length));
                    int dumpLen = dumpEnd - dumpStart;
                    var small = new byte[dumpLen];
                    Array.Copy(buf, dumpStart, small, 0, dumpLen);
                    string hex = BitConverter.ToString(small);

                    throw new Exception(
                        $"LIST parse failed in both count-mode and byte-length-mode.\n" +
                        $"pos={pos}, formatByte=0x{fb:X2}, numLenBytes={numLenBytes}, rawLength={length}\n" +
                        $"count-mode error: {countEx.Message}\n" +
                        $"byte-length-mode error: {byteEx.Message}\n" +
                        $"buffer-dump (up to 128 bytes): {hex}"
                    );
                }
            }
        }

        private SecsItem CreatePrimitive(SecsFormat fmt, byte[] val)
        {
            // Helper: return bytes in big-endian form if Binary numeric interpretation needed
            // For BitConverter (which on little-endian machines expects little-endian), we reverse the array
            byte[] rev(int size)
            {
                if (val == null) return new byte[size];
                if (val.Length == size) return val.Reverse().ToArray();
                // If multiple elements present (arrays), we will take the first element for single-value items
                if (val.Length >= size)
                    return val.Take(size).Reverse().ToArray();
                // pad with zeros on the left to reach requested size
                var tmp = new byte[size];
                Array.Copy(val, 0, tmp, size - val.Length, val.Length);
                return tmp.Reverse().ToArray();
            }

            switch (fmt)
            {
                case SecsFormat.ASCII:
                    return new AsciiItem(Encoding.ASCII.GetString(val ?? new byte[0]));

                case SecsFormat.Binary:
                    return new BinaryItem(val ?? new byte[0]);

                case SecsFormat.I1:
                    // signed 8-bit, may be multiple elements — return first element as before
                    if (val == null || val.Length == 0) return new I1Item(0);
                    return new I1Item((sbyte)val[0]);

                case SecsFormat.I2:
                    {
                        var b = rev(2);
                        short v = BitConverter.ToInt16(b, 0);
                        return new I2Item(v);
                    }

                case SecsFormat.I4:
                    {
                        var b = rev(4);
                        int v = BitConverter.ToInt32(b, 0);
                        return new I4Item(v);
                    }
                case SecsFormat.I8:
                    {
                        var b = rev(8);
                        long v = BitConverter.ToInt64(b, 0);
                        return new I8Item(v);
                    }
                case SecsFormat.U1:
                    if (val == null || val.Length == 0) return new U1Item(0);
                    return new U1Item(val[0]);

                case SecsFormat.U2:
                    {
                        var b = rev(2);
                        ushort v = BitConverter.ToUInt16(b, 0);
                        return new U2Item(v);
                    }

                case SecsFormat.U4:
                    {
                        var b = rev(4);
                        uint v = BitConverter.ToUInt32(b, 0);
                        return new U4Item(v);
                    }

                case SecsFormat.F4:
                    {
                        var b = rev(4);
                        float v = BitConverter.ToSingle(b, 0);
                        return new F4Item(v);
                    }

                case SecsFormat.F8:
                    {
                        var b = rev(8);
                        double v = BitConverter.ToDouble(b, 0);
                        return new F8Item(v);
                    }

                case SecsFormat.Boolean:
                    {
                        // Each byte represents one BOOLEAN (0 = false, 1 = true)
                        if (val == null || val.Length == 0)
                            return new BooleanItem(false);

                        bool[] values = val.Select(b =>
                        {
                            if (b != 0 && b != 1)
                                throw new FormatException($"Invalid BOOLEAN value: {b}");
                            return b == 1;
                        }).ToArray();

                        return new BooleanItem(values);
                    }

                default:
                    throw new NotSupportedException($"Unsupported SECS format: {fmt}");
            }
        }
    }
}



