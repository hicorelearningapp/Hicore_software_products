using HostSimulator.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace HostSimulator.View
{
    /// <summary>
    /// Interaction logic for HsmsSettingsDialog.xaml
    /// </summary>
    public partial class HsmsSettingsDialog : Window
    {
        public HsmsSettingsDialog()
        {
            InitializeComponent();
            var vm = new HsmsSettingsViewModel();

            vm.CloseRequested += () => this.Close();
            DataContext = vm;


        }
    }
}
