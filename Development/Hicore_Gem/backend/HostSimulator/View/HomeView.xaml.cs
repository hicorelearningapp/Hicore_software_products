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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace HostSimulator.View
{
    public static class ScrollBehaviour
    {
        public static readonly DependencyProperty AutoScrollProperty =
            DependencyProperty.RegisterAttached("AutoScroll", typeof(bool),
                typeof(ScrollBehaviour),
                new PropertyMetadata(false, OnAutoScrollChanged));

        public static bool GetAutoScroll(DependencyObject obj) =>
            (bool)obj.GetValue(AutoScrollProperty);

        public static void SetAutoScroll(DependencyObject obj, bool value) =>
            obj.SetValue(AutoScrollProperty, value);

        private static void OnAutoScrollChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if (d is ListBox listBox && (bool)e.NewValue)
            {
                listBox.Loaded += (s, args) =>
                {
                    if (listBox.Items.Count > 0)
                        listBox.ScrollIntoView(listBox.Items[listBox.Items.Count - 1]);
                };

                listBox.TargetUpdated += (s, args) =>
                {
                    if (listBox.Items.Count > 0)
                        listBox.ScrollIntoView(listBox.Items[listBox.Items.Count - 1]);
                };

                listBox.Items.CurrentChanged += (s, args) =>
                {
                    if (listBox.Items.Count > 0)
                        listBox.ScrollIntoView(listBox.Items[listBox.Items.Count - 1]);
                };
            }
        }
    }


    /// <summary>
    /// Interaction logic for HomeView.xaml
    /// </summary>
    public partial class HomeView : UserControl
    {
        public HomeView()
        {
            InitializeComponent();
            DataContext = ViewModelStore.Instance.homeViewModel;
        }
    }
}
