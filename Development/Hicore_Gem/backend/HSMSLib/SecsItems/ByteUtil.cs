using System;
using System.Collections;
using System.Collections.Generic;

public static class ByteUtil
{
    /// <summary>
    /// Returns the minimal big-endian byte array representing the unsigned length.
    /// SECS-II uses 1..3 length bytes for item content lengths.
    /// </summary>
    public static byte[] GetLengthAsByteArray(int length)
    {
        if (length < 0)
            throw new ArgumentOutOfRangeException(nameof(length));

        if (length <= 0xFF)
        {
            return new byte[] { (byte)(length & 0xFF) };
        }
        else if (length <= 0xFFFF)
        {
            return new byte[]
            {
                (byte)((length >> 8) & 0xFF),
                (byte)(length & 0xFF)
            };
        }
        else if (length <= 0xFFFFFF)
        {
            return new byte[]
            {
                (byte)((length >> 16) & 0xFF),
                (byte)((length >> 8) & 0xFF),
                (byte)(length & 0xFF)
            };
        }
        else
        {
            throw new ArgumentOutOfRangeException(nameof(length), "Length too large (max 3 bytes supported).");
        }
    }

    /// <summary>
    /// Big-endian 2-byte representation of short (I2).
    /// </summary>
    public static byte[] GetByteArray(short value)
    {
        return new byte[]
        {
            (byte)((value >> 8) & 0xFF),
            (byte)(value & 0xFF)
        };
    }

    /// <summary>
    /// Big-endian 2-byte representation of ushort (U2).
    /// </summary>
    public static byte[] GetByteArray(ushort value)
    {
        return new byte[]
        {
            (byte)((value >> 8) & 0xFF),
            (byte)(value & 0xFF)
        };
    }

    /// <summary>
    /// Big-endian 4-byte representation of int (I4).
    /// </summary>
    public static byte[] GetByteArray(int value)
    {
        return new byte[]
        {
            (byte)((value >> 24) & 0xFF),
            (byte)((value >> 16) & 0xFF),
            (byte)((value >> 8) & 0xFF),
            (byte)(value & 0xFF)
        };
    }

    /// <summary>
    /// Big-endian 4-byte representation of uint (U4).
    /// </summary>
    public static byte[] GetByteArray(uint value)
    {
        return new byte[]
        {
            (byte)((value >> 24) & 0xFF),
            (byte)((value >> 16) & 0xFF),
            (byte)((value >> 8) & 0xFF),
            (byte)(value & 0xFF)
        };
    }

    /// <summary>
    /// Convert ArrayList of bytes to byte[].
    /// If the ArrayList contains boxed bytes (System.Byte).
    /// </summary>
    public static byte[] ToByteArray(ArrayList list)
    {
        if (list == null) return new byte[0];
        var buffer = new byte[list.Count];
        for (int i = 0; i < list.Count; i++)
        {
            buffer[i] = Convert.ToByte(list[i]);
        }
        return buffer;
    }

    /// <summary>
    /// Element-wise comparison of two ArrayLists. Works for boxed primitive types.
    /// </summary>
    public static bool ArrayListCompare(ArrayList a, ArrayList b)
    {
        if (ReferenceEquals(a, b)) return true;
        if (a == null || b == null) return false;
        if (a.Count != b.Count) return false;

        for (int i = 0; i < a.Count; i++)
        {
            var ai = a[i];
            var bi = b[i];

            if (ai == null && bi == null) continue;
            if (ai == null || bi == null) return false;

            if (!ai.Equals(bi)) return false;
        }

        return true;
    }

    /// <summary>
    /// Helper to turn an IList (of bytes) into byte[].
    /// </summary>
    public static byte[] ToByteArray(IList list)
    {
        if (list == null) return new byte[0];
        var buffer = new byte[list.Count];
        for (int i = 0; i < list.Count; i++)
        {
            buffer[i] = Convert.ToByte(list[i]);
        }
        return buffer;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="array"></param>
    /// <param name="start"></param>
    /// <param name="lengthBytesCount"></param>
    /// <returns></returns>
    public static int GetByteArrayAsLength(byte[] array, int start, int lengthBytesCount)
    {
        int val = 0;
        for (int i = start; i < (start + lengthBytesCount); ++i)
        {
            val <<= 8;
            val |= array[i];
        }

        return val;
    }
}
