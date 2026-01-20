using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace HSMSLib
{
    public interface ISecsEndpoint
    {
        void SendSecsMessage(SecsMessage msg);

        void SendMessage(
            byte stream,
            byte function,
            bool waitBit,
            SecsItem body,
            string messageName = ""
        );

        event Action<SecsMessage> SecsMessageReceived;
        event Action<SecsMessage> SecsMessageSent;

        void Cleanup();
    }

    // =========================================================
    // SECS Adapter (HSMS <-> SECS boundary)
    // =========================================================
    public sealed class SecsAdapter : ISecsEndpoint
    {
        private readonly HsmsEntity _hsms;
        private readonly SecsMessageLogger _logger;

        public event Action<SecsMessage> SecsMessageReceived;
        public event Action<SecsMessage> SecsMessageSent;

        public SecsAdapter(HsmsEntity hsms, SecsMessageLogger logger)
        {
            _hsms = hsms ?? throw new ArgumentNullException(nameof(hsms));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            _hsms.MessageReceived += OnHsmsMessageReceived;
        }

        // -----------------------------------------------------
        // RX PATH : HSMS -> SECS
        // -----------------------------------------------------
        private void OnHsmsMessageReceived(object sender, MessageReceivedEventArgs e)
        {
            if (e?.Message == null)
                return;

            var msg = SecsMessage.FromHsms(e.Message);

            msg.ReceivedAt = DateTimeOffset.UtcNow;
            msg.Direction = SecsDirection.RX;

            // Record FIRST (GUI/logging must see everything)
            _logger.Record(msg);

            // Notify observers safely (never break HSMS thread)
            try
            {
                SecsMessageReceived?.Invoke(msg);
            }
            catch (Exception ex)
            {
                // log exception, but never throw
                System.Diagnostics.Debug.WriteLine(ex);
            }
        }

        // -----------------------------------------------------
        // TX PATH : SECS -> HSMS
        // -----------------------------------------------------
        public void SendSecsMessage(SecsMessage msg)
        {
            if (msg == null)
                throw new ArgumentNullException(nameof(msg));

            msg.SentAt = DateTimeOffset.UtcNow;
            msg.Direction = SecsDirection.TX;

            // Record BEFORE send
            _logger.Record(msg);

            // Convert to HSMS and send
            _hsms.SendSecsMessage(
                (byte)msg.Stream,
                (byte)msg.Function,
                msg.HasReply,
                msg.Body
            );

            // Notify observers safely
            try
            {
                SecsMessageSent?.Invoke(msg);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex);
            }
        }

        // -----------------------------------------------------
        // Convenience send (SxFy builder)
        // -----------------------------------------------------
        public void SendMessage(
            byte stream,
            byte function,
            bool waitBit,
            SecsItem body,
            string messageName = "")
        {
            // SECS rule: empty list => null body
            if (body is ListItem list && list.ItemCount == 0)
                body = null;

            var msg = new SecsMessage
            {
                Stream = stream,
                Function = function,
                Body = body
            };

            msg.Header.DeviceId = _hsms.DeviceID;
            msg.Header.IsPrimary = true;
            msg.Header.IsWaitBitSet = waitBit;

            SendSecsMessage(msg);
        }

        // -----------------------------------------------------
        // Cleanup
        // -----------------------------------------------------
        public void Cleanup()
        {
            _hsms.MessageReceived -= OnHsmsMessageReceived;
        }
    }
  }
