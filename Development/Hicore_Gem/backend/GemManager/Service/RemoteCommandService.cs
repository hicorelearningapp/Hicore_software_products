using GemManager.Handlers;
using GemManager.Interface;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using static GemManager.GemRecipeInfo;

namespace GemManager
{
    public class CommandParameter
    {
        public string Name { get; set; }     // CPNAME
        public string Type { get; set; }     // A, U1, U2, etc.
        public string Value { get; set; }    // CPVAL
    }

    public class RemoteCommandRecord
    {
        public DateTime Time { get; set; }
        public string CommandName { get; set; }
        public string Source { get; set; }   // HOST / LOCAL
        public int Hcack { get; set; }
        public string ResultMessage { get; set; }

        public ObservableCollection<CommandParameter> Parameters { get; }
            = new ObservableCollection<CommandParameter>();
    }


    public interface IRemoteCommandHistoryService
    {
        IReadOnlyList<RemoteCommandRecord> History { get; }
        void Add(RemoteCommandRecord record);
        
        event Action OnHistoryUpdated;
    }

    public class RemoteCommandHistoryService : IRemoteCommandHistoryService
    {
        private readonly List<RemoteCommandRecord> _history =
            new List<RemoteCommandRecord>();

        public IReadOnlyList<RemoteCommandRecord> History
            => _history.AsReadOnly();

        public event Action OnHistoryUpdated;


        public void Add(RemoteCommandRecord record)
        {
            _history.Add(record);
            OnHistoryUpdated?.Invoke();
        }
    }


    public interface IRemoteCommandService
    {
        IReadOnlyCollection<string> GetSupportedCommands();

        void RegisterHandler(IRemoteCommandHandler handler);

        byte Execute(
            string commandName,
            IReadOnlyDictionary<string, object> parameters);

    }

    public class RemoteCommandService : IRemoteCommandService
    {
        private readonly IEquipmentStateComponent _equipmentStateComponent;
       //  private readonly IControlStateManager _control;
        private readonly IRemoteCommandHistoryService _history;

        public RemoteCommandService(IEquipmentStateComponent equipmentStateComponent, IRemoteCommandHistoryService history)
        {
            _equipmentStateComponent = equipmentStateComponent;
            _history = history;
        }

        private readonly Dictionary<string, IRemoteCommandHandler> _handlers =
            new Dictionary<string, IRemoteCommandHandler>(
                StringComparer.OrdinalIgnoreCase);

        public IReadOnlyCollection<string> GetSupportedCommands()
            => _handlers.Keys.ToList();

        public void RegisterHandler(IRemoteCommandHandler handler)
        {
            if (handler == null)
                throw new ArgumentNullException(nameof(handler));

            _handlers[handler.CommandName] = handler;
        }

        public byte Execute(
            string commandName,
            IReadOnlyDictionary<string, object> parameters)
        {
            byte ack;


            var record = new RemoteCommandRecord
            {
                Time = DateTime.Now,
                CommandName = commandName,
                Source = "HOST"
            };

            foreach (var p in parameters)
            {
                record.Parameters.Add(new CommandParameter
                {
                    Name = p.Key,
                    Type = p.Value?.GetType().Name,
                    Value = p.Value?.ToString()
                });
            }


            if (string.IsNullOrWhiteSpace(commandName) || !_handlers.TryGetValue(commandName, out var handler))
            {
                ack = 1; // Command not supported
                record.Hcack = ack;
                record.ResultMessage = "Command not supported";
                _history.Add(record);
                return ack;
            }

            if(!_equipmentStateComponent.IsOnline)
            {
                ack = 3; // Cannot perform now
                record.Hcack = ack;
                record.ResultMessage = "Equipment not online or not remote";
                _history.Add(record);
                return ack;
            }
        
            // -------------------------
            // 1️⃣ Validate
            // -------------------------
            if (!handler.Validate(parameters, out ack))
            {
                record.Hcack = ack;
                record.ResultMessage = "Validation failed";
                _history.Add(record);
                return ack;
            }

            // -------------------------
            // 2️⃣ Execute
            // -------------------------
            if (!handler.Execute(parameters, out ack))
            {
                record.Hcack = ack;
                record.ResultMessage = "Execution failed";
                _history.Add(record);
                return ack;
            }

            ack = 0;
            record.Hcack = ack;
            record.ResultMessage = "Accepted";

            _history.Add(record);
            return 0; // Accepted
        }
    }

}