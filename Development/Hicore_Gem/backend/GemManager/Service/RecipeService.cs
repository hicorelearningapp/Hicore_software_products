using GemManager.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using static GemManager.GemRecipeInfo;

namespace GemManager
{
    public enum RecipeResult
    {
        Success,
        InvalidFormat,
        PermissionDenied,
        StorageError
    }

    public interface IRecipeService
    {
        // ------------------------------------------------------------
        // S7F1 / S7F2 – Recipe Directory
        // ------------------------------------------------------------
        IReadOnlyList<string> GetRecipeList();

        // ------------------------------------------------------------
        // S7F3 / S7F4 – Download Recipe (Host → Equipment)
        // ------------------------------------------------------------
        bool DownloadRecipe(string recipeId, byte[] body);

        // ------------------------------------------------------------
        // S7F5 / S7F6 – Upload Recipe (Equipment → Host)
        // ------------------------------------------------------------
        byte[] UploadRecipe(string recipeId);

        // ------------------------------------------------------------
        // Recipe Selection (PP-SELECT)
        // ------------------------------------------------------------
        void SelectRecipe(string recipeId);

        // ------------------------------------------------------------
        // Optional (S7F17 / maintenance)
        // ------------------------------------------------------------
        void DeleteRecipe(string recipeId);
    }

    public class RecipeService : IRecipeService
    {
        private readonly IGemInterface _equipment;
        private readonly ILogger _logger;

        public RecipeService(IGemInterface equipment, ILogger logger)
        {
            _equipment = equipment ?? throw new ArgumentNullException(nameof(equipment));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // ------------------------------------------------------------
        // S7F1 / S7F2 – Recipe Directory
        // ------------------------------------------------------------
        public IReadOnlyList<string> GetRecipeList()
        {
            _logger.Info("[S7F1] Recipe directory request");
            return _equipment.RecipeComponent.GetRecipeList();
        }

        // ------------------------------------------------------------
        // S7F3 / S7F4 – Download Recipe (Host → Equipment)
        // ------------------------------------------------------------
        public bool DownloadRecipe(string recipeId, byte[] body)
        {
            _logger.Info($"[S7F3] Download recipe: {recipeId}");

            if (string.IsNullOrWhiteSpace(recipeId))
                return false;

            _equipment.RecipeComponent.DownloadRecipe(recipeId, body);

            return true;
        }


        // ------------------------------------------------------------
        // S7F5 / S7F6 – Upload Recipe (Equipment → Host)
        // ------------------------------------------------------------
        public byte[] UploadRecipe(string recipeId)
        {
            _logger.Info($"[S7F5] Upload recipe: {recipeId}");

            if (string.IsNullOrWhiteSpace(recipeId))
                return null;

            return _equipment.RecipeComponent.UploadRecipe(recipeId);
        }

        // ------------------------------------------------------------
        // PP-SELECT – Recipe Selection
        // ------------------------------------------------------------
        public void SelectRecipe(string recipeId)
        {
            _logger.Info($"[PP-SELECT] Select recipe: {recipeId}");

            if (string.IsNullOrWhiteSpace(recipeId))
                throw new ArgumentException("Invalid recipe ID", nameof(recipeId));

            _equipment.RecipeComponent.SelectRecipe(recipeId);
        }

        // ------------------------------------------------------------
        // S7F17 – Delete Recipe (Optional)
        // ------------------------------------------------------------
        public void DeleteRecipe(string recipeId)
        {
            _logger.Info($"[S7F17] Delete recipe: {recipeId}");

            if (string.IsNullOrWhiteSpace(recipeId))
                return;

            _equipment.RecipeComponent.DeleteRecipe(recipeId);
        }
    }
}