
using GemManager.Interface;
using HSMSLib;
using HSMSLib.SecsItems;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static GemManager.GemRecipeInfo;

namespace GemManager
{
    public class GemEvent
    {
        // ---- Identity ----
        public uint Ceid { get; set; }
        public string Name { get; set; }

        // ---- Runtime state ----
        public bool Enabled { get; set; }   // controlled by S2F37

        // ---- Report linkage ----
        public List<uint> ReportIds { get; } = new List<uint>();

        public GemEvent(uint ceid, string name)
        {
            Ceid = ceid;
            Name = name;
            Enabled = false;   // GEM default
        }


    }

    public interface IEventReportService
    {
        // ---- Equipment definitions ----
        void RegisterEvent(uint ceid, string name);
        IEnumerable<GemEvent> GetAllEvents();
        bool IsEventKnown(uint ceid);

        // ---- S2F33 ----
        void DefineReport(uint rptid, IEnumerable<uint> vids);
        bool LinkReport(uint ceid, uint rptid);

        bool DeleteAllReports();
        

        // ---- S2F37 ----
        bool EnableEvent(uint ceid);
        bool DisableEvent(uint ceid);
        bool IsEventEnabled(uint ceid);

        bool UpdateAllEvents(bool status);

        // ---- Runtime ----
        Task SendEventAsync(uint ceid);
    }



    public class EventReportService : IEventReportService
    {
        private readonly Dictionary<uint, GemEvent> _events = new Dictionary<uint, GemEvent>();
        private readonly Dictionary<uint, List<uint>> _ceidReports = new Dictionary<uint, List<uint>>();
        private readonly Dictionary<uint, List<uint>> _reportVids = new Dictionary<uint, List<uint>>();

       
        private readonly IStatusService _status;
        private readonly IGemInterface _equipment;
        private readonly IGemFacade _gemEngine;


        public EventReportService(IGemFacade gemEngine, IGemInterface  equipment, IStatusService status)
        {
            _gemEngine = gemEngine;
            _status = status;
            _equipment = equipment;


            // 🔑 One-time pull of equipment event definitions
            foreach (var ev in equipment.EventComponent.GetDefinedEvents())
            {
                _events[ev.Ceid] = new GemEvent(ev.Ceid, ev.Name);
            }

        }

        // -------------------------------
        // Equipment → GEM (definitions)
        // -------------------------------
        public void RegisterEvent(uint ceid, string name)
        {
            _events[ceid] = new GemEvent(ceid, name);
        }

        public IEnumerable<GemEvent> GetAllEvents()
            => _events.Values;

        public bool IsEventKnown(uint ceid)
            => _events.ContainsKey(ceid);

        // -------------------------------
        // S2F33 – Define Report
        // -------------------------------
        public void DefineReport(uint rptid, IEnumerable<uint> vids)
        {
            _reportVids[rptid] = vids.ToList();
        }

        public bool LinkReport(uint ceid, uint rptid)
        {
            if (!_events.ContainsKey(ceid))
                return false;

            if (!_ceidReports.TryGetValue(ceid, out var list))
                _ceidReports[ceid] = list = new List<uint>();

            if (!list.Contains(rptid))
                list.Add(rptid);

            return true;
        }

        public bool DeleteAllReports()
        {
            _reportVids.Clear();
            return true;
        }

        // -------------------------------
        // S2F37 – Enable / Disable Event
        // -------------------------------

        public bool UpdateAllEvents(bool status)
        {
            foreach(var ceids in _events)
            {
                GemEvent gemEvent = ceids.Value;

                // Perform your update logic here
                gemEvent.Enabled = status;
            }
            return true;
        }
        public bool EnableEvent(uint ceid)
        {
            if (!_events.TryGetValue(ceid, out var ev))
                return false;

            ev.Enabled = true;
            return true;
        }

        public bool DisableEvent(uint ceid)
        {
            if (!_events.TryGetValue(ceid, out var ev))
                return false;

            ev.Enabled = false;
            return true;
        }

        public bool IsEventEnabled(uint ceid)
            => _events.TryGetValue(ceid, out var ev) && ev.Enabled;

        // -------------------------------
        // S6F11 – Send Event Report
        // -------------------------------
        public Task SendEventAsync(uint ceid)
        {
            if (!IsEventEnabled(ceid))
                return Task.CompletedTask;

            if (!_ceidReports.TryGetValue(ceid, out var rptIds))
                return Task.CompletedTask;

            var rptList = new ListItem();

            foreach (var rptId in rptIds)
            {
                var vidList = new ListItem();

                List<uint> vids;
                if (!_reportVids.TryGetValue(rptId, out vids))
                    vids = new List<uint>();

                foreach (var vid in vids)
                {
                    vidList.AddItem(
                        SecsValueBuilder.Build(_status.Get((int)vid))
                    );
                }

                rptList.AddItem(new ListItem(new SecsItem[]
                {
                new U4Item(rptId),
                vidList
                }));
            }

            var body = new ListItem(new SecsItem[]
            {
            new U4Item(ceid),
            rptList
            });

            _gemEngine.SendMessage(6, 11, false, body);

            return Task.CompletedTask;
        }
    }
}