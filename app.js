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

// ===== Holiday theme: string lights + snow =====
(function () {
  var colors = ['#ff4d4d', '#ffd84d', '#3ecf6e', '#4da6ff', '#ffd84d'];
  var bar = document.createElement('div'); bar.className = 'lights'; bar.setAttribute('aria-hidden', 'true');
  var n = Math.max(14, Math.round(window.innerWidth / 34));
  for (var i = 0; i < n; i++) {
    var b = document.createElement('span');
    b.style.setProperty('--c', colors[i % colors.length]);
    b.style.setProperty('--d', (Math.random() * 2.4).toFixed(2) + 's');
    bar.appendChild(b);
  }
  var top = document.querySelector('.topbar');
  if (top) top.insertAdjacentElement('afterend', bar); else document.body.insertBefore(bar, document.body.firstChild);

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var c = document.createElement('canvas'); c.id = 'snow'; c.setAttribute('aria-hidden', 'true');
  document.body.appendChild(c);
  var ctx = c.getContext('2d'), W, H, flakes = [];
  function size() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  size(); window.addEventListener('resize', size);
  // Keep snow in the side gutters, away from the headline and copy
  function gutter() { return W >= 900 ? Math.max(60, (W - 820) / 2) : 26; }
  function spawnX() { var g = gutter(); return Math.random() < .5 ? Math.random() * g : W - Math.random() * g; }
  var count = window.innerWidth < 600 ? 12 : 36;
  for (var j = 0; j < count; j++) { var x0 = spawnX(); flakes.push({ x: x0, b: x0, y: Math.random() * H, r: Math.random() * 2 + .6, s: Math.random() * .5 + .2, w: Math.random() * Math.PI * 2 }); }
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.6)';
    for (var k = 0; k < flakes.length; k++) {
      var f = flakes[k];
      f.y += f.s; f.w += .01; f.x = f.b + Math.sin(f.w) * 8;
      if (f.y > H + 5) { f.y = -5; f.b = spawnX(); }
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(loop);
  })();
})();
