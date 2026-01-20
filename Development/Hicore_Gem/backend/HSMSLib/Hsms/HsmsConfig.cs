using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Xml.Serialization;


namespace HSMSLib
{
    /// <summary>
    /// Represents Entity Types. Entity Type is used to configure the software to run as the equipment
    /// or the host.
    /// </summary>
    [Serializable]
    public enum HsmsEntityType
    {
        /// <summary>
        /// Entity acts as Host.
        /// </summary>
        Host = 0,
        /// <summary>
        /// Entity acts as Equipment.
        /// </summary>
        Equipment = 1
    }

    /// <summary>
    /// Represents the various HSMS Timeouts.
    /// </summary>
    public enum TimeoutType
    {
        /// <summary>
        /// Reply Timeout.
        /// </summary>
        T3,
        /// <summary>
        /// Connection Separation Timeout.
        /// </summary>
        T5,
        /// <summary>
        /// Control Transaction Timeout.
        /// </summary>
        T6,
        /// <summary>
        /// NOT SELECTED Timeout.
        /// </summary>
        T7,
        /// <summary>
        /// Network Intercharacter Timeout.
        /// </summary>
        T8
    }

    [Serializable]
    public enum HsmsEntityMode
    {
        Passive = 0,
        Active = 1
    }

    [Serializable]
    public class HsmsConfig
    {
        HsmsEntityType entityType;
        HsmsEntityMode entityMode;
        ushort deviceId;

        int t3Timeout;
        int t5Timeout;
        int t6Timeout;
        int t7Timeout;

        ActiveEntityConfig activeEntityConfig;
        PassiveEntityConfig passiveEntityConfig;

        public HsmsConfig()
        {
        }

        public HsmsEntityType EntityType
        {
            get { return entityType; }
            set { entityType = value; }
        }

        public HsmsEntityMode EntityMode
        {
            get { return entityMode; }
            set { entityMode = value; }
        }

        public ushort DeviceId
        {
            get { return deviceId; }
            set { deviceId = value; }
        }

        public int T3Timeout
        {
            get { return t3Timeout; }
            set { t3Timeout = value; }
        }

        public int T5Timeout
        {
            get { return t5Timeout; }
            set { t5Timeout = value; }
        }

        public int T6Timeout
        {
            get { return t6Timeout; }
            set { t6Timeout = value; }
        }

        public int T7Timeout
        {
            get { return t7Timeout; }
            set { t7Timeout = value; }
        }

        public PassiveEntityConfig PassiveEntityConfig
        {
            get { return passiveEntityConfig; }
            set { passiveEntityConfig = value; }
        }

        public ActiveEntityConfig ActiveEntityConfig
        {
            get { return activeEntityConfig; }
            set { activeEntityConfig = value; }
        }

        public static HsmsConfig DeserializeFromXml(string filename)
        {
            using (FileStream fs = new FileStream(filename, FileMode.Open))
            {
                return (HsmsConfig)new XmlSerializer(typeof(HsmsConfig)).Deserialize(fs);
            }
        }

        public static void SerializeToXml(string filename, HsmsConfig config)
        {
            using (FileStream fs = new FileStream(filename, FileMode.Create))
            {
                new XmlSerializer(typeof(HsmsConfig)).Serialize(fs, config);
            }
        }

        public void SerializeToXml(string filename)
        {
            SerializeToXml(filename, this);
        }

        public static HsmsConfig GetDefault()
        {
            HsmsConfig config = new HsmsConfig();
            config.entityType = HsmsEntityType.Equipment;
            config.entityMode = HsmsEntityMode.Passive;
            config.deviceId = 0;
            config.t3Timeout = 45;
            config.t5Timeout = 10;
            config.t6Timeout = 5;
            config.t7Timeout = 5;

            PassiveEntityConfig pConfig = new PassiveEntityConfig();
            pConfig.HostName = "127.0.0.1";
            pConfig.Port = 5001;

            config.passiveEntityConfig = pConfig;

            ActiveEntityConfig aConfig = new ActiveEntityConfig();
            aConfig.HostName = "127.0.0.1";
            aConfig.Port = 5001;

            config.activeEntityConfig = aConfig;

            return config;
        }
    }

    [Serializable]
    public class ActiveEntityConfig
    {
        string hostName = "127.0.0.1";
        int port = 5001;

        public string HostName
        {
            get { return hostName; }
            set { hostName = value; }
        }

        public int Port
        {
            get { return port; }
            set { port = value; }
        }
    }

    [Serializable]
    public class PassiveEntityConfig
    {
        string hostName = "127.0.0.1";
        int port = 5001;

        public string HostName
        {
            get { return hostName; }
            set { hostName = value; }
        }

        public int Port
        {
            get { return port; }
            set { port = value; }
        }
    }


    public enum HsmsMode
    {
        Active,
        Passive
    }

    //public class HsmsConfig
    //{
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    public HsmsConfig() { }

    //    /// <summary>
    //    /// HsmsMode
    //    /// </summary>
    //    public HsmsMode Mode { get; set; } = HsmsMode.Passive;

    //    // Passive listening mode (equipment)
    //    public string LocalIp { get; set; } = "0.0.0.0";

    //    /// <summary>
    //    /// Port
    //    /// </summary>
    //    public int Port { get; set; } = 5000;

    //    // Active connection mode (host)

    //    /// <summary>
    //    /// RemoteIp
    //    /// </summary>
    //    public string RemoteIp { get; set; }

    //    /// <summary>
    //    /// RemotePort
    //    /// </summary>
    //    public int RemotePort { get; set; }

    //    // HSMS Timers
    //    public int T3 { get; set; } = 45000;   // Reply timeout

    //    /// <summary>
    //    /// T5 Time out
    //    /// </summary>
    //    public int T5 { get; set; } = 30000;   // LinkTest interval

    //    /// <summary>
    //    /// T6 Timeout
    //    /// </summary>
    //    public int T6 { get; set; } = 5000;    // LinkTest response

    //    /// <summary>
    //    /// T7 Timeout 
    //    /// </summary>
    //    public int T7 { get; set; } = 10000;   // Select response

    //    /// <summary>
    //    /// T8 Timeout 
    //    /// </summary>
    //    public int T8 { get; set; } = 600000;  // No activity timeout

    //    // Optional
    //    public ushort DeviceId { get; set; } = 0;

    //    /// <summary>
    //    /// AutoReconnect
    //    /// </summary>
    //    public bool AutoReconnect { get; set; } = true;

    //    /// <summary>
    //    /// EnableLogging
    //    /// </summary>
    //    public bool EnableLogging { get; set; } = true;

    //    /// <summary>
    //    /// LogPath
    //    /// </summary>
    //    public string LogPath { get; set; } = "logs/hsms.log";


    //    /// <summary>
    //    /// Loads HSMS config from JSON file.
    //    /// </summary>
    //    public static HsmsConfig Load(string filePath = "hsms_config.json")
    //    {
    //        if (!File.Exists(filePath))
    //            throw new FileNotFoundException($"HSMS config file not found: {filePath}");

    //        var json = File.ReadAllText(filePath);
    //        return JsonSerializer.Deserialize<HsmsConfig>(json)
    //               ?? throw new Exception("Failed to parse HSMS configuration.");
    //    }

    //}
}
