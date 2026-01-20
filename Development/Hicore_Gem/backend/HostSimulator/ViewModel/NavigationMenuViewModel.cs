using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace HostSimulator.ViewModel
{
    public static class NavigationTitle
    {
        public const string Home = "Home";
        public const string Messages = "Messages";
        public const string SvidStatus = "SVID Status";
        public const string RemoteCommands = "Remote Commands";
        public const string Alarms = "Alarms";
        public const string Events = "Events & Reports";
        public const string Ecid = "ECID Constants";
        public const string Recipes = "Recipes";
        public const string Sml = "SML Editor";
        public const string Script = "Script Engine";
       //  public const string AI = "AI Assistant";
        public const string Settings = "Settings";
    }

    public static class NavigationKeys
    {
        public const string Home = "Home";
        public const string Messages = "Messages";
        public const string SvidStatus = "SvidStatus";
        public const string RemoteCommands = "RemoteCommands";
        public const string Alarms = "Alarms";
        public const string Events = "Events";
        public const string Ecid = "Ecid";
        public const string Recipes = "Recipes";
        public const string Sml = "Sml";
        public const string Script = "Script";
     //    public const string AI = "AI";
        public const string Settings = "Settings";
    }


    internal class NavigationMenuViewModel : BaseViewModel
    {
        public List<NavigationItemViewModel> MenuItems { get; }

        public NavigationMenuViewModel(Action<string> navigateAction)
        {
            MenuItems = new List<NavigationItemViewModel>
            {
                new NavigationItemViewModel(NavigationTitle.Home, NavigationKeys.Home, navigateAction),
                new NavigationItemViewModel(NavigationTitle.Messages, NavigationKeys.Messages, navigateAction),
                new NavigationItemViewModel(NavigationTitle.SvidStatus, NavigationKeys.SvidStatus, navigateAction),
                new NavigationItemViewModel(NavigationTitle.RemoteCommands, NavigationKeys.RemoteCommands, navigateAction),
                new NavigationItemViewModel(NavigationTitle.Alarms, NavigationKeys.Alarms, navigateAction),
                new NavigationItemViewModel(NavigationTitle.Events, NavigationKeys.Events, navigateAction),
                new NavigationItemViewModel(NavigationTitle.Ecid, NavigationKeys.Ecid, navigateAction),
                new NavigationItemViewModel(NavigationTitle.Recipes, NavigationKeys.Recipes, navigateAction),
                new NavigationItemViewModel(NavigationTitle.Sml, NavigationKeys.Sml, navigateAction),
                new NavigationItemViewModel(NavigationTitle.Script, NavigationKeys.Script, navigateAction),
                new NavigationItemViewModel(NavigationTitle.Settings, NavigationKeys.Settings, navigateAction),
            };
        }
    }
}
