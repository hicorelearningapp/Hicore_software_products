using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GemManager
{
    public class S5F1Handler : GemCommandHandler
    {
        public override string CommandName => "S5F1";

        public S5F1Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            return Task.FromResult(
            GemCommandResult.Fail(
                errorCode: "S9F3",
                errorMessage: "Illegal S5F1 received from host (Alarm Report is equipment→host only)"
            )
            );
        }
    }

    public class S5F3Handler : GemCommandHandler
    {
        public override string CommandName => "S5F3";

        public S5F3Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {  
            // Read ALEN from request
           // Expected: <U1>
            byte alen = Convert.ToByte(req.Parameters["ALCD"]);

            bool enable = alen == 1;

            // Tell AlarmService
            Runtime.AlarmService.SetAlarmReportingEnabled(enable);

            // ACKC5 = 0 (Accepted)
            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ACKC5", (byte)0 }
                })
            );
        }
    }


    // =============================================================
    //  S5F5  Alarm List Request
    // =============================================================
    public class S5F5Handler : GemCommandHandler
    {
        public override string CommandName => "S5F5";

        public S5F5Handler(IGemFacade runtime) : base(runtime) { }

        public override Task<GemCommandResult> ExecuteAsync(GemCommandRequest req)
        {
            // Get ACTIVE alarms from equipment
            var activeAlarms = Runtime.AlarmService.GetAlarmList()
                .Where(a => a.State == GemAlarmState.Set)
                .ToList();

            // Build SECS list
            var alarmList = new ListItem();

            foreach (var alarm in activeAlarms)
            {
                var alarmItem = new ListItem();
                alarmItem.AddItem(new U2Item((ushort)alarm.AlarmId));
                alarmItem.AddItem(new U1Item(1)); // ALCD = 1 (SET)
                alarmItem.AddItem(new AsciiItem(alarm.Description));

                alarmList.AddItem(alarmItem);
            }

            return Task.FromResult(
                GemCommandResult.Ok(new Dictionary<string, object>
                {
                { "ALARM_LIST", alarmList }
                })
            );
        }
    }
}
