using EquipmentSimulator.Config;
using GemManager;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;


namespace EquipmentSimulator
{
    public sealed class RecipeComponent : IRecipeComponent
    {
        private readonly Dictionary<string, byte[]> _recipes = new Dictionary<string, byte[]>();

        private readonly string _recipeRootPath = @"C:\temp\recipes\";
        private string _selectedRecipe;

        public event Action<string> RecipeCreated;
        public event Action<string> RecipeStored;
        public event Action<string> RecipeDeleted;
        public event Action<string> SelectedRecipeChanged;

        // ===============================
        // Constructor (startup load)
        // ===============================
        public RecipeComponent()
        {
            //  = recipeRootPath
             //   ?? throw new ArgumentNullException(nameof(recipeRootPath));

            LoadFromDirectory();
        }

        // ===============================
        // Startup loader
        // ===============================
        private void LoadFromDirectory()
        {
            _recipes.Clear();

            Directory.CreateDirectory(_recipeRootPath);

            foreach (var file in Directory.GetFiles(_recipeRootPath))
            {
                var recipeId = Path.GetFileName(file);
                _recipes[recipeId] = File.ReadAllBytes(file);
            }

            // Auto-select first recipe (optional but realistic)
            _selectedRecipe = _recipes.Keys.FirstOrDefault();
        }

        // ===============================
        // Discovery
        // ===============================
        public IReadOnlyList<string> GetRecipeList()
            => _recipes.Keys.ToList();

        public bool Exists(string recipeId)
            => _recipes.ContainsKey(recipeId);

        // ===============================
        // Data access
        // ===============================
        public byte[] GetRecipeBody(string recipeId)
        {
            if (!_recipes.TryGetValue(recipeId, out var body))
                throw new InvalidOperationException($"Recipe '{recipeId}' not found");

            return body;
        }

        // ===============================
        // Create / Save / Delete
        // ===============================
        public void CreateRecipe(string recipeId, byte[] initialBody)
        {
            if (Exists(recipeId))
                throw new InvalidOperationException("Recipe already exists");

            var path = GetRecipePath(recipeId);

            File.WriteAllBytes(path, initialBody ?? Array.Empty<byte>());
            _recipes[recipeId] = initialBody ?? Array.Empty<byte>();

            RecipeCreated?.Invoke(recipeId);
        }

        public void StoreRecipe(string recipeId, byte[] body)
        {
            if (string.IsNullOrWhiteSpace(recipeId))
                throw new ArgumentException("Invalid recipe id");

            var path = GetRecipePath(recipeId);

            File.WriteAllBytes(path, body ?? Array.Empty<byte>());
            _recipes[recipeId] = body ?? Array.Empty<byte>();

            RecipeStored?.Invoke(recipeId);
        }

        public void DeleteRecipe(string recipeId)
        {
            if (!Exists(recipeId))
                return;

            var path = GetRecipePath(recipeId);

            if (File.Exists(path))
                File.Delete(path);

            _recipes.Remove(recipeId);

            if (_selectedRecipe == recipeId)
                _selectedRecipe = null;

            RecipeDeleted?.Invoke(recipeId);
        }

        // ===============================
        // Selection
        // ===============================
        public void SelectRecipe(string recipeId)
        {
            if (!Exists(recipeId))
                throw new InvalidOperationException("Invalid recipe");

            _selectedRecipe = recipeId;
            SelectedRecipeChanged?.Invoke(recipeId);
        }

        public string GetSelectedRecipe()
            => _selectedRecipe;

        // ===============================
        // Helpers
        // ===============================
        private string GetRecipePath(string recipeId)
            => Path.Combine(_recipeRootPath, recipeId);

        public byte[] UploadRecipe(string recipeId)
        {
            if (string.IsNullOrWhiteSpace(recipeId))
                throw new ArgumentException("Invalid recipe id");

            if (!_recipes.TryGetValue(recipeId, out var body))
                throw new InvalidOperationException($"Recipe '{recipeId}' not found");

            // Return a copy to avoid accidental mutation
            return body.ToArray();
        }

        public void DownloadRecipe(string recipeId, byte[] body)
        {
            if (string.IsNullOrWhiteSpace(recipeId))
                throw new ArgumentException("Invalid recipe id");

            if (body == null)
                body = Array.Empty<byte>();

            // Persist to disk
            var path = GetRecipePath(recipeId);
            File.WriteAllBytes(path, body);

            // Update in-memory cache
            _recipes[recipeId] = body;

            // Notify listeners (GUI / GEM)
            RecipeStored?.Invoke(recipeId);
        }

    }

}
