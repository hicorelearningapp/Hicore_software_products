using GemManager;
using GemManager.Handlers;
using System.Collections.Generic;


namespace EquipmentSimulator
{
    public sealed class PpSelectCommandHandler : IRemoteCommandHandler
    {
        private readonly IRecipeComponent _recipes;

        public PpSelectCommandHandler(IRecipeComponent recipes)
        {
            _recipes = recipes;
        }

        public string CommandName => "PPSELECT";

        public bool Validate(
            IReadOnlyDictionary<string, object> parameters,
            out byte ack)
        {
            ack = 0;

            if (!parameters.TryGetValue("PPID", out var v))
            {
                ack = 2;
                return false;
            }

            var ppid = v as string;
            if (string.IsNullOrEmpty(ppid))
            {
                ack = 2;
                return false;
            }

            if (!_recipes.Exists(ppid))
            {
                ack = 4;
                return false;
            }

            return true;
        }

        public bool Execute(
            IReadOnlyDictionary<string, object> parameters,
            out byte ack)
        {
            ack = 0;
            _recipes.SelectRecipe((string)parameters["PPID"]);
            return true;
        }
    }
}
