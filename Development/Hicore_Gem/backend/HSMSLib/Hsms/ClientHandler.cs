using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib
{
    public class ClientHandler : IDisposable
    {
        private readonly TcpClient _tcpClient;
        private readonly NetworkStream _stream;
        private bool _disposed;

        public ClientHandler(TcpClient tcpClient)
        {
            if (tcpClient == null)
                throw new ArgumentNullException(nameof(tcpClient));

            _tcpClient = tcpClient;
            _tcpClient.LingerState = new LingerOption(false, 0);

            _stream = _tcpClient.GetStream();
        }

        /// <summary>
        /// Sends an HSMS message over TCP.
        /// </summary>
        internal void SendMessage(byte[] data)
        {
            if (_disposed)
                throw new ObjectDisposedException(nameof(ClientHandler));

            if (data == null)
                throw new ArgumentNullException(nameof(data));

            _stream.Write(data, 0, data.Length);
            _stream.Flush();
        }

        /// <summary>
        /// Shutdown connection gracefully.
        /// </summary>
        internal void Shutdown()
        {
            Dispose();
        }

        /// <summary>
        /// Reads ONE complete HSMS message:
        /// - First 4 bytes = message length
        /// - Then body of "messageLength" bytes
        /// </summary>
        public byte[] GetMessage()
        {
            if (_disposed)
                throw new ObjectDisposedException(nameof(ClientHandler));

            byte[] lengthBytes = ReadExact(4);
            uint messageLength = HsmsMessage.GetMessageLength(
                lengthBytes[0], lengthBytes[1], lengthBytes[2], lengthBytes[3]);

            byte[] bodyBytes = ReadExact((int)messageLength);

            // Merge header + body
            var result = new byte[4 + messageLength];
            Buffer.BlockCopy(lengthBytes, 0, result, 0, 4);
            Buffer.BlockCopy(bodyBytes, 0, result, 4, (int)messageLength);



            // 🔥 ADD THESE FOUR LINES HERE
            Debug.WriteLine(">>> Received lengthBytes: " + BitConverter.ToString(lengthBytes));
            Debug.WriteLine(">>> messageLength (from header) = " + messageLength);
            Debug.WriteLine(">>> bodyBytes Length (actual read) = " + bodyBytes.Length);
            Debug.WriteLine(">>> bodyBytes = " + BitConverter.ToString(bodyBytes));

            return result;
        }

        private byte[] ReadExact(int count)
        {
            byte[] buffer = new byte[count];
            int offset = 0;

            while (offset < count)
            {
                int read = _stream.Read(buffer, offset, count - offset);

                if (read == 0)
                {
                    // NO MORE DATA WILL COME. Socket is closed or the frame is incomplete.
                    throw new IOException("Remote host closed connection or message incomplete.");
                }

                offset += read;
            }

            return buffer;
        }

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;

            try { _stream.Close(); } catch { }
            try { _tcpClient.Close(); } catch { }
        }
    }
}
