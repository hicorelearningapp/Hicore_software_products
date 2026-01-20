using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EquipmentSimulator.ViewModel
{
    public static class NavigationTitle
    {
        public const string Home = "Home";
        public const string Messages = "Messages";

        public const string StatusVariable = "Status Variable";
        public const string EquipmentContstant = "Equipment Contstant";
        public const string DataVariable = "Data Variable";
        public const string RemoteCommands = "RemoteCommand";
        public const string Alarms = "AlarmService";
        public const string Events = "Events";
        public const string Recipes = "Recipes";
        public const string Report = "Report";

        public const string TraceData = "Trace Data";
        public const string TerminalMessage = "Terminal Message";


        public const string Settings = "Settings";
    }

    public static class NavigationKeys
    {
        public const string Home = "Home";
        public const string Messages = "Messages";
        public const string StatusVariable = "StatusVariable";
        public const string DataVariable = "Data Variable";

        public const string EquipmentContstant = "EquipmentContstant";
        public const string RemoteCommands = "RemoteCommands";
        public const string Alarms = "AlarmService";
        public const string Recipe = "RecipeService";
        public const string Event = "EventService";
        public const string Report = "ReportService";

        public const string TraceData = "Trace Data";
        public const string TerminalMessage = "Terminal Message";
        public const string Settings = "Settings";
    }

    public class NavigationMenuViewModel : BaseViewModel
    {
        public List<NavigationItemViewModel> MenuItems { get; }

        public NavigationMenuViewModel(Action<string> navigateAction)
        {
            MenuItems = new List<NavigationItemViewModel>
            {
               //  new NavigationItemViewModel(NavigationTitle.Home, NavigationKeys.Home, navigateAction),
                new NavigationItemViewModel(NavigationTitle.Messages, NavigationKeys.Messages, navigateAction),
                new NavigationItemViewModel(NavigationTitle.StatusVariable, NavigationKeys.StatusVariable, navigateAction),
                new NavigationItemViewModel(NavigationTitle.EquipmentContstant, NavigationKeys.EquipmentContstant, navigateAction),
                new NavigationItemViewModel(NavigationTitle.DataVariable, NavigationKeys.DataVariable, navigateAction),
                new NavigationItemViewModel(NavigationTitle.Alarms, NavigationKeys.Alarms, navigateAction),
                new NavigationItemViewModel(NavigationTitle.TraceData, NavigationKeys.TraceData, navigateAction),
                new NavigationItemViewModel(NavigationTitle.RemoteCommands, NavigationKeys.RemoteCommands, navigateAction),
                new NavigationItemViewModel(NavigationTitle.Recipes, NavigationKeys.Recipe, navigateAction),
                new NavigationItemViewModel(NavigationTitle.TerminalMessage, NavigationKeys.TerminalMessage, navigateAction),
                new NavigationItemViewModel(NavigationTitle.Settings, NavigationKeys.Settings, navigateAction),
            };
        }
    }

}
