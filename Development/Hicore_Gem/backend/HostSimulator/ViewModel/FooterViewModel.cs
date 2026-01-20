using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Threading;

namespace HostSimulator.ViewModel
{
    internal class FooterViewModel : BaseViewModel
    {
        private DispatcherTimer _timer;
        private DateTime _currentDateTime;

        public FooterViewModel()
        {
            _timer = new DispatcherTimer();
            _timer.Interval = TimeSpan.FromSeconds(1);
            _timer.Tick += (s, e) =>
            {
                CurrentDateTime = DateTime.Now;
            };
            _timer.Start();

        }

        public DateTime CurrentDateTime
        {
            get => _currentDateTime;
            set
            {
                if (_currentDateTime != value)
                {
                    _currentDateTime = value;
                    OnPropertyChanged(nameof(CurrentDateTime));
                    OnPropertyChanged(nameof(CurrentDate));
                    OnPropertyChanged(nameof(CurrentTime));

                }
            }
        }
        public string CurrentDate => _currentDateTime.ToString("dd-MMM-yyyy");
        public string CurrentTime => _currentDateTime.ToString("hh:mm:ss tt");

    }
}
