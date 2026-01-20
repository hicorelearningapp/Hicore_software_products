using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HostSimulator.ViewModel
{
    public class StatusVariableModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string DataType { get; set; }
        public string Description { get; set; }
    }


    internal class StatusVariableStatusViewModel : BaseViewModel
    {
        public ObservableCollection<StatusVariableModel> StatusVariableList { get; set; }

        public StatusVariableStatusViewModel()
        {
            StatusVariableList = new ObservableCollection<StatusVariableModel>()
            {
                new StatusVariableModel () { ID = 1000, Name = "ChamberTemp" , DataType="F4", Description ="Chamber Temp", Value = "200" },
                new StatusVariableModel () { ID = 1001, Name = "VacuumPressure" ,DataType="F4", Description ="Vacuum Pressure", Value = "201"},
                new StatusVariableModel () { ID = 1002, Name = "PM Temperature" ,DataType="F4", Description ="PM Temperature", Value = "202"},
                new StatusVariableModel () { ID = 1003, Name = "Chamber Pressure" , DataType="F4", Description ="Chamber Pressure", Value = "202"},
                new StatusVariableModel () { ID = 1004, Name = "Home Status Pos", DataType="As", Description ="Home Status Pos", Value = "P1"},
            };
        }
    }
}
