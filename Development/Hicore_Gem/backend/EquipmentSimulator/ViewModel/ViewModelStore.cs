using GemManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace EquipmentSimulator.ViewModel
{
    public class ViewModelStore
    {
        private static readonly Lazy<ViewModelStore> _instance =
            new Lazy<ViewModelStore>(() => new ViewModelStore());

        public static ViewModelStore Instance => _instance.Value;
    
        public MessageViewModel MessageVM { get; }

        public FooterViewModel FooterVM { get; }

        public HsmsConnectionBarViewModel HsmsConnectionBarVM { get; }

        public AlarmStatusViewModel AlarmStatusVM { get; }

        public VariableViewModel EquipmentConstantVM { get; }

        public VariableViewModel StatusVariableVM { get; }

        public VariableViewModel DataVariableVM { get; }

        public RemoteCommandViewModel RemoteCommandVM { get; }

        public ReportViewModel ReportVM { get; }

        public TerminalMessageViewModel TerminalMessageVM { get; }

        public TraceBrowserViewModel TraceDataVM { get; }

        public RecipeViewModel RecipeVM { get; }    

        public SettingViewModel SettingVM { get; }

        private ViewModelStore()
        {
            // Create all VMs once
            MessageVM = new MessageViewModel();
            FooterVM = new FooterViewModel();
            AlarmStatusVM = new AlarmStatusViewModel();

            EquipmentConstantVM = new VariableViewModel();
            StatusVariableVM = new VariableViewModel();
            DataVariableVM = new VariableViewModel();

            RemoteCommandVM = new RemoteCommandViewModel();
            ReportVM = new ReportViewModel();
            TerminalMessageVM = new TerminalMessageViewModel();
            TraceDataVM = new TraceBrowserViewModel();
            SettingVM   = new SettingViewModel();
            RecipeVM = new RecipeViewModel();
            HsmsConnectionBarVM = new HsmsConnectionBarViewModel();
        }
    }
}
