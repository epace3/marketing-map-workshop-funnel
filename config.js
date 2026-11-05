/* ============================================================
   MARKETING MAP FUNNEL SETTINGS
   Change these for each run (Nov, Dec, Jan). Every page reads
   from this file, so dates and links only live in one place.
   ============================================================ */
window.MM = {
  // Event details
  topBarDate: "Wednesday, Nov 25 @ 12pm EST",
  dateLong: "Wednesday, November 25",
  timeRange: "12:00 to 1:00pm EST",
  vipTime: "1:00pm EST",
  startISO: "2026-11-25T12:00:00-05:00",   // workshop start
  endISO: "2026-11-25T13:00:00-05:00",     // workshop end
  vipEndISO: "2026-11-25T13:45:00-05:00",  // VIP session end

  // Seats shown on the VIP page
  vipSeats: 32,
  vipSeatsWas: 50,

  // Links (paste these in when ready)
  vipCheckoutUrl: "",        // $97 VIP checkout (GHL or Stripe)
  groupUrl: "",              // attendee group link
  ghlWebhookUrl: "",         // optional: GHL inbound webhook to push registrations into GHL
  privacyUrl: "",            // privacy policy page
  termsUrl: "",              // terms page

  // Videos: paste a Vimeo or YouTube EMBED url, e.g. https://player.vimeo.com/video/123456
  registrationVideoUrl: "",
  vipVideoUrl: ""
};
