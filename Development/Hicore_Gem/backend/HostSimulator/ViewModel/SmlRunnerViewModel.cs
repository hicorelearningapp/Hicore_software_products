using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace HostSimulator.ViewModel
{
    public class SmlFileInfo
    {
        public string FileName { get; set; }
        public string FullPath { get; set; }
    }
    public interface IScriptRunner
    {
        Task RunAsync(string smlFilePath);
    }

    public class SmlRunnerViewModel : BaseViewModel
    {
        private readonly IScriptRunner _scriptRunner;
        private readonly string _scriptDir;

        public ObservableCollection<SmlFileInfo> SmlFiles { get; }
            = new ObservableCollection<SmlFileInfo>();

        private SmlFileInfo _selectedSmlFile;
        public SmlFileInfo SelectedSmlFile
        {
            get => _selectedSmlFile;
            set
            {
                _selectedSmlFile = value;
                LoadSelectedFile();
                OnPropertyChanged(nameof(ScriptText));
            }
        }

        private string _scriptText;
        public string ScriptText
        {
            get => _scriptText;
            set
            {
                _scriptText = value;
                IsDirty = true;
                OnPropertyChanged(nameof(ScriptText));
                OnPropertyChanged(nameof(CanSave));
            }
        }

        private bool IsDirty { get; set; }

        public string CurrentFileTitle =>
            SelectedSmlFile?.FileName ?? "New Script (Unsaved)";

        public bool CanSave => IsDirty && SelectedSmlFile != null;
        public bool CanSend => !string.IsNullOrWhiteSpace(ScriptText);

        public ICommand NewScriptCommand { get; }
        public ICommand SaveCommand { get; }
        public ICommand SaveAsCommand { get; }
        public ICommand SendScriptCommand { get; }
        public ICommand RefreshCommand { get; }

        public SmlRunnerViewModel()
        {
            // _scriptRunner = scriptRunner;
            _scriptDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Scripts");

            Directory.CreateDirectory(_scriptDir);



            NewScriptCommand = new RelayCommand(_ => NewScript());
            SaveCommand = new RelayCommand(_ => Save(), _ => CanSave);
            SaveAsCommand = new RelayCommand(_ => SaveAs());
            SendScriptCommand = new RelayCommand(_ => SendScript(), _ => CanSend);
            RefreshCommand = new RelayCommand(_ => LoadSmlFiles());

            LoadSmlFiles();
        }
        private async void SendScript()
        {
            await SendAsync();
        }
        private void LoadSmlFiles()
        {
            SmlFiles.Clear();
            foreach (var file in Directory.GetFiles(_scriptDir, "*.sml"))
            {
                SmlFiles.Add(new SmlFileInfo
                {
                    FileName = Path.GetFileName(file),
                    FullPath = file
                });
            }
        }

        private void LoadSelectedFile()
        {
            if (SelectedSmlFile == null)
            {
                ScriptText = string.Empty;
                return;
            }

            ScriptText = File.ReadAllText(SelectedSmlFile.FullPath);
            IsDirty = false;

            OnPropertyChanged(nameof(CurrentFileTitle));
            OnPropertyChanged(nameof(CanSave));
            OnPropertyChanged(nameof(CanSend));
        }

        private void NewScript()
        {
            SelectedSmlFile = null;
            ScriptText = string.Empty;
            IsDirty = false;

            OnPropertyChanged(nameof(CurrentFileTitle));
        }

        private void Save()
        {
            if (SelectedSmlFile == null)
                return;

            File.WriteAllText(SelectedSmlFile.FullPath, ScriptText);
            IsDirty = false;

            OnPropertyChanged(nameof(CanSave));
        }

        private void SaveAs()
        {
            var dlg = new Microsoft.Win32.SaveFileDialog
            {
                Filter = "SML Files (*.sml)|*.sml",
                InitialDirectory = _scriptDir
            };

            if (dlg.ShowDialog() != true)
                return;

            File.WriteAllText(dlg.FileName, ScriptText);

            SelectedSmlFile = new SmlFileInfo
            {
                FileName = Path.GetFileName(dlg.FileName),
                FullPath = dlg.FileName
            };

            LoadSmlFiles();
            IsDirty = false;

            OnPropertyChanged(nameof(CurrentFileTitle));
            OnPropertyChanged(nameof(CanSave));
        }

        private async Task SendAsync()
        {
            // Save temp if new & unsaved
            var path = SelectedSmlFile?.FullPath;
            if (path == null)
            {
                path = Path.Combine(_scriptDir, "_temp_run.sml");
                File.WriteAllText(path, ScriptText);
            }

            await _scriptRunner.RunAsync(path);
        }
    }
}
