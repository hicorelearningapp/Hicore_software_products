using System;
using System.Collections.Generic;

namespace GemManager
{
    public enum MaterialState : byte
    {
        Unknown = 0,
        Waiting = 1,
        Processing = 2,
        Completed = 3,
        Aborted = 4
    }

    public class MaterialInfo
    {
        public string MaterialId { get; set; }
        public MaterialState State { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Recipe { get; set; }
        public string AbortReason { get; set; }
        public string Location {  get; set; }   
    }


    public interface IMaterialService
    {
        void RegisterMaterial(string materialId);

        void StartProcessing(string materialId, string recipe);

        void CompleteProcessing(string materialId);

        void AbortProcessing(string materialId, string reason);

        byte GetMaterialState(string materialId);

        string GetCurrentMaterialId();

        string GetCurrentRecipe();

        byte MoveMaterial(string materialId, string toLocation);

    }

    public class MaterialService : IMaterialService
    {
        private readonly Dictionary<string, MaterialInfo> _materials =
            new Dictionary<string, MaterialInfo>();

        private string _currentMaterialId;

        public void RegisterMaterial(string materialId)
        {
            if (!_materials.ContainsKey(materialId))
            {
                _materials[materialId] = new MaterialInfo
                {
                    MaterialId = materialId,
                    State = MaterialState.Waiting
                };
            }
        }

        public void StartProcessing(string materialId, string recipe)
        {
            RegisterMaterial(materialId);

            var m = _materials[materialId];
            m.State = MaterialState.Processing;
            m.StartTime = DateTime.Now;
            m.Recipe = recipe;

            _currentMaterialId = materialId;
        }

        public void CompleteProcessing(string materialId)
        {
            if (!_materials.ContainsKey(materialId))
                return;

            var m = _materials[materialId];
            m.State = MaterialState.Completed;
            m.EndTime = DateTime.Now;

            if (_currentMaterialId == materialId)
                _currentMaterialId = null;
        }

        public void AbortProcessing(string materialId, string reason)
        {
            if (!_materials.ContainsKey(materialId))
                return;

            var m = _materials[materialId];
            m.State = MaterialState.Aborted;
            m.AbortReason = reason;
            m.EndTime = DateTime.Now;

            if (_currentMaterialId == materialId)
                _currentMaterialId = null;
        }

        public byte GetMaterialState(string materialId)
        {
            if (_materials.ContainsKey(materialId))
                return (byte)_materials[materialId].State;

            return (byte)MaterialState.Unknown;
        }

        public string GetCurrentMaterialId()
        {
            return _currentMaterialId;
        }

        public string GetCurrentRecipe()
        {
            if (_currentMaterialId == null)
                return "";

            return _materials[_currentMaterialId].Recipe;
        }

        public byte MoveMaterial(string materialId, string toLocation)
        {
            if (!_materials.ContainsKey(materialId))
                return 1; // Invalid material

            var m = _materials[materialId];

            if (m.State == MaterialState.Processing)
                return 3; // Cannot move

            m.Location = toLocation;
            return 0; // OK
        }
    }

}
