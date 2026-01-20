using GemManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace EquipmentSimulator.ViewModel
{
    public class GemVariableViewModel : BaseViewModel
    {
        private readonly GemVariable _model;

        public GemVariableViewModel(GemVariable model)
        {
            _model = model;
        }

        public uint Vid => _model.VariableId;
        public string Name => _model.Name;
        public GemVariableRole Role => _model.Role;
        public GemDataType DataType => _model.DataType;
        public GemVariableAccess Access => _model.Access;
        public string Unit => _model.Unit;
        public string Description => _model.Description;

        public bool IsReadOnly => Access == GemVariableAccess.ReadOnly;

        public object Value
        {
            get => _model.GetValue();
            set
            {
                if (IsReadOnly)
                    return;

                _model.SetValue(value);
                OnPropertyChanged(nameof(Value));
            }
        }

    

        /// <summary>
        /// Call this when GEM engine updates the variable internally
        /// </summary>
        public void Refresh()
        {
            OnPropertyChanged(nameof(Value));
        }

        public override string ToString()
            => $"{Vid} - {Name} = {Value}";
    }

}
