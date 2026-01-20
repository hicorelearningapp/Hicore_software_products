using GemManager;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace EquipmentSimulator.ViewModel
{
    public sealed class RecipeListItemViewModel
    {
        public string RecipeId { get; }

        public RecipeListItemViewModel(string recipeId)
        {
            RecipeId = recipeId;
        }
    }

    public sealed class RecipeViewModel : BaseViewModel
    {
        private IRecipeComponent _recipeComponent;
        private IEquipmentStateComponent _equipmentState;

        public ObservableCollection<RecipeListItemViewModel> Recipes { get; } = new ObservableCollection<RecipeListItemViewModel>();


        private RecipeListItemViewModel _selectedRecipe;
        public RecipeListItemViewModel SelectedRecipe
        {
            get => _selectedRecipe;
            set
            {
                _selectedRecipe = value;
                OnPropertyChanged();
                LoadRecipeText();
            }
        }

        private string _recipeText;
        public string RecipeText
        {
            get => _recipeText;
            set
            {
                _recipeText = value;
                OnPropertyChanged();
                IsDirty = true;
            }
        }

        private bool _isEditing;
        public bool IsReadOnlyMode => !_isEditing;

        private bool _isDirty;
        public bool IsDirty
        {
            get => _isDirty;
            private set
            {
                _isDirty = value;
                OnPropertyChanged();
            }
        }

        public string SelectedRecipeId => SelectedRecipe?.RecipeId;

        // RemoteCommandService
        public ICommand EditCommand { get; }
        public ICommand SaveCommand { get; }
        public ICommand CancelCommand { get; }
        public ICommand SelectCommand { get; }
        public ICommand DeleteCommand { get; } 

        public RecipeViewModel()
        {
            EditCommand = new RelayCommand(_ => BeginEdit(), _ => CanEdit());
            SaveCommand = new RelayCommand(_ => Save(), _ => CanSave());
            CancelCommand = new RelayCommand(_ => CancelEdit());
            SelectCommand = new RelayCommand(_ => SelectRecipe());
            DeleteCommand = new RelayCommand(_ => DeleteRecipe());
        }

        public void SetServices(
            IRecipeComponent recipeComponent,
            IEquipmentStateComponent equipmentState)
        {
            _recipeComponent = recipeComponent;
            _equipmentState = equipmentState;
            _recipeComponent.RecipeStored += _recipeComponent_RecipeStored;

            LoadRecipes();
        }
        public RecipeViewModel(
            IRecipeComponent recipeComponent,
            IEquipmentStateComponent equipmentState)
        {
            _recipeComponent = recipeComponent;
            _equipmentState = equipmentState;

            EditCommand = new RelayCommand(_ => BeginEdit(), _ => CanEdit());
            SaveCommand = new RelayCommand(_ => Save(), _ => CanSave());
            CancelCommand = new RelayCommand(_ => CancelEdit());
            SelectCommand = new RelayCommand(_ => SelectRecipe());
            DeleteCommand = new RelayCommand(_ => DeleteRecipe());

            _recipeComponent.RecipeStored += _recipeComponent_RecipeStored;

            LoadRecipes();
        }

        private void _recipeComponent_RecipeStored(string obj)
        {
            LoadRecipes();
        }

        private void LoadRecipes()
        {
            Recipes.Clear();
            foreach (var id in _recipeComponent.GetRecipeList())
                Recipes.Add(new RecipeListItemViewModel(id));

            var selected = _recipeComponent.GetSelectedRecipe();
            SelectedRecipe = Recipes.FirstOrDefault(r => r.RecipeId == selected);
        }

        private void LoadRecipeText()
        {
            if (SelectedRecipe == null)
            {
                RecipeText = "";
                return;
            }

            var body = _recipeComponent.GetRecipeBody(SelectedRecipe.RecipeId);
            RecipeText = Encoding.ASCII.GetString(body);
            IsDirty = false;
        }

        private bool CanEdit()
            => _equipmentState.ProcessState == EquipmentProcessState.Idle;

        private void BeginEdit()
        {
            _isEditing = true;
            OnPropertyChanged(nameof(IsReadOnlyMode));
        }

        private bool CanSave()
            => _isEditing && IsDirty;

        private void Save()
        {
            var bytes = Encoding.ASCII.GetBytes(RecipeText);
            _recipeComponent.StoreRecipe(SelectedRecipe.RecipeId, bytes);

            _isEditing = false;
            IsDirty = false;
            OnPropertyChanged(nameof(IsReadOnlyMode));
        }

        private void CancelEdit()
        {
            _isEditing = false;
            LoadRecipeText();
            OnPropertyChanged(nameof(IsReadOnlyMode));
        }

        private void SelectRecipe()
        {
            if (IsDirty)
                return; // block select if unsaved edits

            //_remoteCommands.Execute(
            //    "PPSELECT",
            //    new Dictionary<string, object>
            //    {
            //        ["PPID"] = SelectedRecipe.RecipeId
            //    });
        }

        private void DeleteRecipe()
        {
            _recipeComponent.DeleteRecipe(SelectedRecipe.RecipeId);
            LoadRecipes();
        }


        // LoadRecipes();

    }

}
