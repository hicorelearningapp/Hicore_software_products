using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
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

    public class SecsStream
    {
        public string StreamId { get; set; }
        public string Description { get; set; }
        public List<SecsFunction> Functions { get; set; }
    }

    public class SecsFunction
    {
        public int FunctionId { get; set; }
        public string Name { get; set; }
        public bool IsPrimary { get; set; }
        public ObservableCollection<SecsParameter> Parameters { get; set; }
    }

    public class SecsParameter
    {
        public string Name { get; set; }
        public string DataType { get; set; }
        public object Value { get; set; }
        public List<SecsParameter> Children { get; set; }
    }

    public static class StreamReader
    {
        public static List<SecsStream> LoadSecsConfig()
        {
            string configFile = System.IO.Path.Combine(AppContext.BaseDirectory, "Config", "secs_streams.json");

            if (!File.Exists(configFile))
                throw new FileNotFoundException($"SECS config file not found: {configFile}");

            string json = File.ReadAllText(configFile);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                ReadCommentHandling = JsonCommentHandling.Skip,
                AllowTrailingCommas = true,
                IncludeFields = false // set to true if your models use fields instead of properties
            };

            return JsonSerializer.Deserialize<List<SecsStream>>(json, options)
                   ?? new List<SecsStream>();
        }
    }

    public class ShowValueConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            // Show value only when there are NO children
            int count = System.Convert.ToInt32(value);
            return count == 0 ? Visibility.Visible : Visibility.Collapsed;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
            => throw new NotImplementedException();
    }


    /// <summary>
    /// Interaction logic for SecsParameterTreeView.xaml
    /// </summary>
    public partial class SecsParameterTreeView : UserControl
    {
        public SecsParameterTreeView()
        {
            InitializeComponent();
           //  Parameters = StreamReader.LoadSecsConfig();

            DataContext = this;
        }

        public List<SecsParameter> Parameters
        {
            get => (List<SecsParameter>)GetValue(ParametersProperty);
            set => SetValue(ParametersProperty, value);
        }

        public static readonly DependencyProperty ParametersProperty =
            DependencyProperty.Register(
                nameof(Parameters),
                typeof(List<SecsParameter>),
                typeof(SecsParameterTreeView),
                new PropertyMetadata(null)
            );
    }
}
