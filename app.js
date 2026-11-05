(function () {
  var C = window.MM || {};

  // Fill text placeholders: <span data-mm="dateLong"></span>
  document.querySelectorAll('[data-mm]').forEach(function (el) {
    var v = C[el.getAttribute('data-mm')];
    if (v !== undefined && v !== '') el.textContent = v;
  });

  // Links: <a data-link="vipCheckoutUrl">
  document.querySelectorAll('[data-link]').forEach(function (el) {
    var v = C[el.getAttribute('data-link')];
    if (v) { el.href = v; }
    else { el.setAttribute('data-missing', 'true'); }
  });

  // Hide blocks that need a link we don't have yet
  document.querySelectorAll('[data-needs]').forEach(function (el) {
    if (!C[el.getAttribute('data-needs')]) el.style.display = 'none';
  });

  // Videos
  document.querySelectorAll('[data-video]').forEach(function (el) {
    var url = C[el.getAttribute('data-video')];
    if (url) {
      el.innerHTML = '<iframe src="' + url + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    }
  });

  // Calendar links
  function fmt(iso) { return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function calLinks(title, startISO, endISO, details) {
    var s = fmt(startISO), e = fmt(endISO);
    var g = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) +
      '&dates=' + s + '/' + e + '&details=' + encodeURIComponent(details);
    var o = 'https://outlook.live.com/calendar/0/deeplink/compose?subject=' + encodeURIComponent(title) +
      '&startdt=' + encodeURIComponent(startISO) + '&enddt=' + encodeURIComponent(endISO) + '&body=' + encodeURIComponent(details);
    var ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:' + s + '\nDTEND:' + e +
      '\nSUMMARY:' + title + '\nDESCRIPTION:' + details + '\nEND:VEVENT\nEND:VCALENDAR';
    var a = 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics);
    return { google: g, outlook: o, apple: a };
  }
  document.querySelectorAll('[data-cal]').forEach(function (wrap) {
    if (!C.startISO) return;
    var vip = wrap.getAttribute('data-cal') === 'vip';
    var l = calLinks(
      vip ? '2027 Marketing Map Workshop + VIP Implementation Session' : '2027 Marketing Map Workshop (Live)',
      C.startISO, vip ? (C.vipEndISO || C.endISO) : C.endISO,
      'Your Zoom link is in your confirmation email. Questions: info@salesgenius.co'
    );
    wrap.querySelector('[data-c="google"]').href = l.google;
    wrap.querySelector('[data-c="outlook"]').href = l.outlook;
    var ap = wrap.querySelector('[data-c="apple"]');
    ap.href = l.apple; ap.setAttribute('download', 'marketing-map-workshop.ics');
  });

  // Registration modal
  var modal = document.getElementById('reg');
  if (modal) {
    document.querySelectorAll('[data-open]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); modal.classList.add('open'); var f = modal.querySelector('input[name="first_name"]'); if (f) f.focus(); });
    });
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.classList.contains('close')) modal.classList.remove('open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('open'); });

    var form = modal.querySelector('form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = form.querySelector('.err'); err.textContent = '';
      var data = new FormData(form);
      var email = (data.get('email') || '').trim();
      if (!data.get('first_name') || !/^\S+@\S+\.\S+$/.test(email)) { err.textContent = 'Please add your first name and a valid email.'; return; }
      var btn = form.querySelector('button[type="submit"] .main'); btn.textContent = 'Saving your seat...';

      var body = new URLSearchParams(data).toString();
      var jobs = [fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })];
      if (C.ghlWebhookUrl) {
        var payload = {}; data.forEach(function (v, k) { payload[k] = v; });
        payload.event = C.dateLong; payload.source = 'marketing-map-registration';
        jobs.push(fetch(C.ghlWebhookUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }));
      }
      try { sessionStorage.setItem('mm_name', data.get('first_name')); } catch (x) {}
      Promise.allSettled(jobs).then(function () { window.location.href = '/vip'; });
    });
  }

  // Personalize with first name if we have it
  var nameEls = document.querySelectorAll('[data-name]');
  if (nameEls.length) {
    var n = ''; try { n = sessionStorage.getItem('mm_name') || ''; } catch (x) {}
    nameEls.forEach(function (el) { if (n) el.textContent = n + ', y'; });
  }
})();
