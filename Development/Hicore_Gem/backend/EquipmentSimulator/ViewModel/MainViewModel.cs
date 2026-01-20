using GemManager;
using HSMSLib;
using System.Collections.Generic;
using System.Windows.Input;

namespace EquipmentSimulator.ViewModel
{
    public class MainViewModel : BaseViewModel
    {
        private readonly Dictionary<string, BaseViewModel> _pageFactory;

        private readonly IGemFacade _gem;
        private void WireGemEvents()
        {
            _gem.SecsMessageReceived += _gem_SecsMessageReceived;
            _gem.SecsMessageSent += _gem_SecsMessageSent;
        }

        private Dictionary<string, BaseViewModel> CreatePageFactory()
        {
            return new Dictionary<string, BaseViewModel>
                {
                    { NavigationKeys.Messages, ViewModelStore.Instance.MessageVM },
                    { NavigationKeys.Alarms, ViewModelStore.Instance.AlarmStatusVM },
                    { NavigationKeys.EquipmentContstant, ViewModelStore.Instance.EquipmentConstantVM },
                    { NavigationKeys.StatusVariable, ViewModelStore.Instance.StatusVariableVM },
                    { NavigationKeys.DataVariable, ViewModelStore.Instance.DataVariableVM },
                    { NavigationKeys.Recipe, ViewModelStore.Instance.RecipeVM },
                    { NavigationKeys.RemoteCommands, ViewModelStore.Instance.RemoteCommandVM },
                    { NavigationKeys.Report, ViewModelStore.Instance.ReportVM },
                    { NavigationKeys.TraceData, ViewModelStore.Instance.TraceDataVM },
                    { NavigationKeys.TerminalMessage, ViewModelStore.Instance.TerminalMessageVM },
                    { NavigationKeys.Settings, ViewModelStore.Instance.SettingVM },
                };
        }

        private void InitializeViewModels()
        {
            var store = ViewModelStore.Instance;

            store.HsmsConnectionBarVM.SetState(
                ConnectServer,
                _gem.Equipment.EquipmentStateComponent,
                _gem.AlarmService,
                _gem.CommStateManager);

            store.EquipmentConstantVM.SetVariable(
                _gem.Equipment.VariableComponent, GemVariableRole.EC);

            store.StatusVariableVM.SetVariable(
                _gem.Equipment.VariableComponent, GemVariableRole.SV);

            store.DataVariableVM.SetVariable(
                _gem.Equipment.VariableComponent, GemVariableRole.DV);

            store.AlarmStatusVM.SetAlarms(
                _gem.Equipment.AlarmComponent);

            store.TraceDataVM.SetTraceService(
                _gem.TraceService,
                _gem.Equipment.VariableComponent);

            store.TerminalMessageVM.SetTerminalService(
                _gem.TerminalService);

            store.RecipeVM.SetServices(
                _gem.Equipment.RecipeComponent,
                _gem.Equipment.EquipmentStateComponent);

            store.RemoteCommandVM.SetServices(_gem.RemoteCommandService, _gem.RemoteCommandHistoryService);
        }

        private void InitializeNavigation()
        {
            NavigationViewModel = new NavigationMenuViewModel(Navigate);
            CurrentPageViewModel = ViewModelStore.Instance.MessageVM;
            FooterPageViewModel = ViewModelStore.Instance.FooterVM;
            HsmsConnectionBarViewModel = ViewModelStore.Instance.HsmsConnectionBarVM;
        }
        private void InitializeStartupState()
        {
            ConnectServer();
        }
        public MainViewModel(IGemFacade gem)
        {
            _gem = gem;

            WireGemEvents();

            _pageFactory = CreatePageFactory();

            InitializeViewModels();
            InitializeNavigation();
            InitializeStartupState();
        }

        // Top bar (IP, Port, Connect/Disconnect, HSMS dropdown)
        public HsmsConnectionBarViewModel HsmsConnectionBarViewModel { get; set; }

        // Navigation menu (left side)
        public NavigationMenuViewModel NavigationViewModel { get; set; }



        private BaseViewModel _currentPageViewModel;
        public BaseViewModel CurrentPageViewModel
        {
            get => _currentPageViewModel;
            set
            {
                _currentPageViewModel = value;
                OnPropertyChanged(nameof(CurrentPageViewModel));
            }
        }

        public FooterViewModel FooterPageViewModel { get; set; }

        public ICommand NavigateCommand { get; }


        private void Navigate(string page)
        {
            if (_pageFactory.TryGetValue(page, out var vm))
            {
                CurrentPageViewModel = vm;
            }

            OnPropertyChanged(nameof(CurrentPageViewModel));
        }


        private void ConnectServer()
        {
            ViewModelStore.Instance.MessageVM.AddMessage("Gem Started..Waiting for Host Connnection");

            _gem.StartServer();
        }

        private void _gem_SecsMessageSent(SecsMessage obj)
        {
            ViewModelStore.Instance.MessageVM.AddMessage(obj.SentAt.ToString() + " => " + obj.ToString() + "=>" + obj.Body.ToString());
        }

        private void _gem_SecsMessageReceived(SecsMessage obj)
        {
            ViewModelStore.Instance.MessageVM.AddMessage(obj.ReceivedAt.ToString() + " => "+ obj.ToString()  + "=>" + obj.Body.ToString()) ;
        }
    }
}
