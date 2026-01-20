using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace EquipmentSimulator.ViewModel
{
    public class NavigationItemViewModel
    {
        public string Name { get; }
        public string TargetPage { get; }
        public ICommand NavigateCommand { get; }

        public NavigationItemViewModel(string name, string targetPage, Action<string> navigateAction)
        {
            Name = name;
            TargetPage = targetPage;
            NavigateCommand = new RelayCommand(param =>
            {
                navigateAction(TargetPage);
            });
        }
    }
}
