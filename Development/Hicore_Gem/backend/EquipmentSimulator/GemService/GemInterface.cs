using System;
using EquipmentSimulator.Config;
using GemManager;



namespace EquipmentSimulator
{
    public enum EquipmentRunMode
    {
        RealEquipment,
        Simulation
    }

    public class GemInterface : IGemInterface
    {
        // ============================================================
        // Capability exposure
        // ============================================================
        public IEquipmentStateComponent EquipmentStateComponent { get; }
        public IVariableComponent VariableComponent { get; }
        public IAlarmComponent AlarmComponent { get; }
        public IRecipeComponent RecipeComponent { get; }
        public ICarrierComponent CarrierComponent { get; }
        public IEventComponent EventComponent { get; }
        public IRemoteCommandComponent RemoteCommandComponent { get; }
        public IDiagnosticComponent DiagnosticComponent { get; }

        // ============================================================
        // Config & identity
        // ============================================================
        private readonly EquipmentConfigManager _configManager;

        public GemInterface()
        {
            // 1. Load config (equipment choice)
            _configManager = new EquipmentConfigManager();

            // 2. Create components
            EquipmentStateComponent = new EquipmentStateComponent();
            
            VariableComponent = new VariableComponent();
            
            AlarmComponent = new AlarmComponent();
            
            RecipeComponent = new RecipeComponent();
            
            CarrierComponent = new CarrierComponent();
            
            EventComponent = new EventComponent();
            
            RemoteCommandComponent = new RemoteCommandComponent();
            
            DiagnosticComponent = new DiagnosticsComponent();

            // 3. Apply initial config
            ApplyConfig(_configManager.CurrentConfig);

            // 4. Hot reload (optional)
            _configManager.OnConfigReloaded += ApplyConfig;
        }

        // ============================================================
        // Identity & time
        // ============================================================
        public string GetEquipmentId() => _configManager.CurrentConfig.EquipmentId;
        public string GetModelName() => _configManager.CurrentConfig.ModelName;
        public string GetSoftwareRevision() => _configManager.CurrentConfig.SoftwareRevision;

        public DateTime GetEquipmentTime() => DateTime.Now;
        public void SetEquipmentTime(DateTime time) 
        {

        }

        // ============================================================
        // Communication lifecycle
        // ============================================================
        public void OnCommunicationEstablished()
        {
            // e.g. reset alarms, resend states, etc.
        }

        public void OnCommunicationLost(string reason)
        {
            // e.g. log, freeze states
        }

        // ============================================================
        // Config → Components
        // ============================================================
        private void ApplyConfig(EquipmentConfig config)
        {
            // ---- EquipmentStateComponent defaults
            EquipmentStateComponent.ControlState = Parse<EquipmentControlState>(config.ControlState);

            EquipmentStateComponent.ProcessState = Parse<EquipmentProcessState>(config.ProcessState);

            // ---- VariableComponent
            ((VariableComponent)VariableComponent).LoadFromConfig(config);

            // ---- AlarmService
            ((AlarmComponent)AlarmComponent).LoadFromConfig(config);

            // ---- CarrierComponent
            ((CarrierComponent)CarrierComponent).LoadFromConfig(config);
        }

        private static T Parse<T>(string value) where T : struct
        {
            T result;
            Enum.TryParse(value, true, out result);
            return result;
        }
    }
}
