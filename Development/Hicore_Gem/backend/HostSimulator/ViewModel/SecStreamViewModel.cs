using HostSimulator.View;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace HostSimulator.ViewModel
{
    public class SecStreamViewModel : BaseViewModel
    {
        private List<SecsStream> _streams;
        public List<SecsStream> Streams
        {
            get => _streams;
            set { _streams = value; OnPropertyChanged(nameof(Streams)); }
        }

        private SecsStream _selectedStream;
        public SecsStream SelectedStream
        {
            get => _selectedStream;
            set
            {
                _selectedStream = value;
                OnPropertyChanged(nameof(SelectedStream));

                if (SelectedStream.Functions != null && SelectedStream.Functions.Count > 0)
                    SelectedFunction = SelectedStream.Functions[0];
                else
                    SelectedFunction = null;
            }
        }


        private SecsFunction _selectedFunction;
        public SecsFunction SelectedFunction
        {
            get => _selectedFunction;
            set
            {
                _selectedFunction = value;
                OnPropertyChanged(nameof(SelectedFunction));
                OnPropertyChanged(nameof(SelectedFunctionParameters)); // notify tree
            }
        }

        public ObservableCollection<SecsParameter> SelectedFunctionParameters =>
            SelectedFunction?.Parameters;

        public SecStreamViewModel()
        {
            Streams = StreamReader.LoadSecsConfig();
            SelectedStream = Streams[0];
         //    SelectedFunction = Streams[0];
        }


    }
}

