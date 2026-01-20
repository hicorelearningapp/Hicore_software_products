using EquipmentSimulator.GemService;
using EquipmentSimulator.ViewModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace EquipmentSimulator
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        public static IApplicationRuntime Runtime { get; private set; }

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // ✅ Create runtime ONCE
            Runtime = new ApplicationRuntime();

            var mainWindow = new MainWindow
            {
                DataContext = new MainViewModel(Runtime.Gem)
            };

            mainWindow.Show();
        }
    }
}
