/* ============================================================
   MARKETING MAP FUNNEL SETTINGS
   The page shows the NEXT upcoming run automatically (it switches
   once a run's VIP session has ended). To test a specific run, add
   ?run=dec9 (or nov25 / jan6) to the URL.

   Keep these in step with the GHL custom values in the folder
   "Marketing Map (update each run)".
   ============================================================ */

// One entry per workshop date
var MM_RUNS = [
  {
    id: "nov25",
    topBarDate: "Wednesday, Nov 25 @ 12pm EST",
    dateLong: "Wednesday, November 25",
    startISO: "2026-11-25T12:00:00-05:00",   // workshop start
    endISO: "2026-11-25T13:30:00-05:00",     // workshop end
    vipEndISO: "2026-11-25T15:00:00-05:00"   // VIP session end (page switches to the next run after this)
  },
  {
    id: "dec9",
    topBarDate: "Wednesday, Dec 9 @ 12pm EST",
    dateLong: "Wednesday, December 9",
    startISO: "2026-12-09T12:00:00-05:00",
    endISO: "2026-12-09T13:30:00-05:00",
    vipEndISO: "2026-12-09T15:00:00-05:00"
  },
  {
    id: "jan6",
    topBarDate: "Wednesday, Jan 6 @ 12pm EST",
    dateLong: "Wednesday, January 6",
    startISO: "2027-01-06T12:00:00-05:00",
    endISO: "2027-01-06T13:30:00-05:00",
    vipEndISO: "2027-01-06T15:00:00-05:00"
  }
];

// Settings shared by every run
var MM_SHARED = {
  timeRange: "12:00 to 1:30pm EST",
  vipTime: "2:00pm EST",

  // Seats shown on the VIP page
  vipSeats: 32,
  vipSeatsWas: 50,

  // Links
  zoomUrl: "https://us06web.zoom.us/j/86527415299",        // workshop + VIP (same link as the STC Sprint)
  vipCheckoutUrl: "https://buy.stripe.com/bJebJ143D7ZRare2FZ2Ji1g", // $97 VIP (same as GHL "Marketing Map Upgrade Link")
  groupUrl: "",                                              // attendee group link (box hides itself when empty)
  ghlWebhookUrl: "https://services.leadconnectorhq.com/hooks/zpjvSoJ3TMkdq8pcj7VJ/webhook-trigger/5a1315fd-216a-4225-b1d8-618057c7684c", // GHL: MM 01 | Registration Intake
  privacyUrl: "https://www.salesgenius.co/privacy-policy",
  termsUrl: "https://www.salesgenius.co/termsofservice",

  // Videos: paste a Vimeo or YouTube EMBED url, e.g. https://player.vimeo.com/video/123456
  registrationVideoUrl: "",
  vipVideoUrl: ""
};

// Pick the run to show
(function () {
  var pick = null, q = (location.search.match(/[?&]run=([^&]+)/) || [])[1];
  if (q) pick = MM_RUNS.filter(function (r) { return r.id === q; })[0] || null;
  if (!pick) {
    var now = Date.now();
    pick = MM_RUNS.filter(function (r) { return new Date(r.vipEndISO).getTime() > now; })[0] || MM_RUNS[MM_RUNS.length - 1];
  }
  window.MM = Object.assign({}, MM_SHARED, pick, { runId: pick.id });
})();
