
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HostSimulator.ViewModel
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

    public class EquipmentConstantStatusViewModel : BaseViewModel
    {
        public ObservableCollection<EquipmentStatusModel> EquipmentList { get; set; }
      

        public EquipmentConstantStatusViewModel()
        {


            EquipmentList = new ObservableCollection<EquipmentStatusModel>()
            {
                new EquipmentStatusModel () { No = 1, Description = "Home Pos 1", Min = 1, Max = 1000, Default = 1, Value = 100, Unit="Step" },
                new EquipmentStatusModel () { No = 2, Description = "Home Pos 2", Min = 1, Max = 1000, Default = 1, Value = 200, Unit="Step" },
                new EquipmentStatusModel () { No = 3, Description = "Home Pos 3", Min = 1, Max = 1000, Default = 1, Value = 300, Unit="Step" },
                new EquipmentStatusModel () { No = 4, Description = "Home Pos 4", Min = 1, Max = 1000, Default = 1, Value = 400, Unit="Step" },
                new EquipmentStatusModel () { No = 6, Description = "Home Pos 5", Min = 1, Max = 1000, Default = 1, Value = 500, Unit="Step" },
            };
            
        }

    }
}
