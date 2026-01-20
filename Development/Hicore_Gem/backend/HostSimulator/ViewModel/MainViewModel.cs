using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Input;

namespace HostSimulator.ViewModel
{
    public class ViewModelStore
    {
        private static readonly Lazy<ViewModelStore> _instance =
            new Lazy<ViewModelStore>(() => new ViewModelStore());

        public static ViewModelStore Instance => _instance.Value;


        public HomeViewModel homeViewModel { get; set; }
        public MessageViewModel MessageViewVM { get; set; }

        public SmlRunnerViewModel SmlRunnerViewVM { get; set; }

        public ViewModelStore()
        {
            homeViewModel = new HomeViewModel();
            MessageViewVM = new MessageViewModel();

            SmlRunnerViewVM = new SmlRunnerViewModel();

    }

}

    internal class MainViewModel: BaseViewModel
    {
        private readonly Dictionary<string, BaseViewModel> _pageFactory;

        public MainViewModel()
        {
            _pageFactory = new Dictionary<string, BaseViewModel>()
            {
                { NavigationKeys.Home,            ViewModelStore.Instance.homeViewModel },
                { NavigationKeys.Messages,        ViewModelStore.Instance.MessageViewVM },
                { NavigationKeys.SvidStatus,      new StatusVariableStatusViewModel() },
                { NavigationKeys.RemoteCommands,  new RemoteCommandViewModel() },
                { NavigationKeys.Alarms,          new AlarmViewModel() },
                { NavigationKeys.Ecid,            new EquipmentConstantStatusViewModel() },
                { NavigationKeys.Recipes,         new RecipeViewModel() },
                { NavigationKeys.Settings,        new SettingViewModel() },
                { NavigationKeys.Script,          new ScriptEngineViewModel() },
                { NavigationKeys.Sml,             ViewModelStore.Instance.SmlRunnerViewVM},

                

            };

            hsmsConnectionBarViewModel = new HsmsConnectionBarViewModel();
            NavigationViewModel = new NavigationMenuViewModel(Navigate);
            CurrentPageViewModel = _pageFactory[NavigationKeys.Home];
            FooterPageViewModel = new FooterViewModel();
        }

        // Top bar (IP, Port, Connect/Disconnect, HSMS dropdown)
        public HsmsConnectionBarViewModel hsmsConnectionBarViewModel { get; set; }

        // Navigation menu (left side)
        public NavigationMenuViewModel NavigationViewModel { get; set; }

        // Main screen (Home, Messages, Alarms, etc.)
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

    }
}
