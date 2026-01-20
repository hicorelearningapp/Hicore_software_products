using GemManager;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace EquipmentSimulator.ViewModel
{
    public class EquipmentStatusModel
    {
        public int No { get; set; }
        public string Description { get; set; }
        public double Value { get; set; }
        public string Unit { get; set; }
        public double Min { get; set; }
        public double Max { get; set; }
        public double Default { get; set; }
    }


    public class VariableViewModel : BaseViewModel
    {
        public string Title { get; set; }

        public ObservableCollection<GemVariableViewModel> Variables { get; set; }

        private IVariableComponent _variableComponent;

        public void SetVariable(IVariableComponent variableComponent, GemVariableRole role)
        {
            Title = role.ToString();

            _variableComponent = variableComponent;

            Variables = new ObservableCollection<GemVariableViewModel>(
                variableComponent.GetAllVariables().Where(v => v.Role == role).ToList().Select(va => new GemVariableViewModel(va))
            );

            OnPropertyChanged(nameof(Variables));

            // Subscribe for live updates
            _variableComponent.OnVariableChanged += OnVariableChanged;
        }


        private void OnVariableChanged(uint vid, object value)
        {
            // If called from background thread → marshal to UI thread
            if (!Application.Current.Dispatcher.CheckAccess())
            {
                Application.Current.Dispatcher.BeginInvoke(
                    new Action(() => OnVariableChanged(vid, value)));
                return;
            }

            // Now we are on UI thread
            var vm = Variables.FirstOrDefault(v => v.Vid == vid);
            vm?.Refresh();
        }

        public void Dispose()
        {
            if (_variableComponent != null)
                _variableComponent.OnVariableChanged -= OnVariableChanged;
        }
    }
}
