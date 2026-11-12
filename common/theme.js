/* TechPower Harbor concepts — theme + font toggles.
   Load in <head> (no defer) so the stored theme applies before first paint.
   Storage keys are global across concepts; ?theme=dark&font=inter query params override (used by screenshot.sh).
   Notes: html[data-notes="shown|hidden"] shows or hides the "To confirm" tags (common/annotations.css); hidden by default; ?notes=shown shows them. */
(function () {
  var KEY_THEME = 'harbor.theme';
  var KEY_FONT = 'harbor.font';
  var KEY_NOTES = 'harbor.notes';
  var root = document.documentElement;
  var params = new URLSearchParams(location.search);
  /* ?states shows an app page (<html data-app>) as its sheet of drawn states again, with the toolbar: for review and capture */
  if (params.has('states')) root.removeAttribute('data-app');

  function stored(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

  var theme = params.get('theme') || stored(KEY_THEME) || root.getAttribute('data-default-theme') || 'light';
  var font = 'inter';
  var notes = params.get('notes') || stored(KEY_NOTES) || 'hidden';
  if (notes !== 'shown') notes = 'hidden';
  apply();

  function apply() {
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-font', font);
    root.setAttribute('data-notes', notes);
    root.style.colorScheme = theme;
    syncToggles();
    syncBar();
  }
  function ensureInter() {
    if (document.getElementById('hc-inter')) return;
    var link = document.createElement('link');
    link.id = 'hc-inter';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap';
    document.head.appendChild(link);
  }
  function setTheme(next) { theme = next; store(KEY_THEME, next); apply(); }
  function setFont(next) { font = next; store(KEY_FONT, next); apply(); }
  function setNotes(next) { notes = next === 'hidden' ? 'hidden' : 'shown'; store(KEY_NOTES, notes); apply(); }

  /* In-page theme buttons ([data-theme-toggle], opt-in per concept): flip the theme and name the next one. The hub
     follows through the harbor.theme storage event. */
  function syncToggles() {
    var label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-label', label);
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (btn) setTheme(theme === 'dark' ? 'light' : 'dark');
  });
  document.addEventListener('DOMContentLoaded', syncToggles);

  /* ---- fixed toolbar (top-right toggles) ---- */
  var bar, themeBtn, fontBtn;
  function buildBar() {
    if (bar) return;
    var css = document.createElement('style');
    css.textContent =
      '.hc-bar{position:fixed;top:0;left:0;right:0;height:40px;z-index:1000;display:flex;align-items:center;gap:16px;padding:0 16px;' +
      'background:#111214;color:#d4d4d8;font:12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;border-bottom:1px solid #26272b}' +
      '.hc-bar__label{flex:1;display:flex;gap:10px;align-items:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.hc-bar__label strong{color:#fafafa;font-weight:600}' +
      '.hc-bar a,.hc-bar button{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border:1px solid #3f3f46;background:#1c1d21;color:#e4e4e7;font:inherit;cursor:pointer;border-radius:0}' +
      '.hc-bar a:hover,.hc-bar button:hover{background:#26272b}' +
      '.hc-bar button:focus-visible,.hc-bar a:focus-visible{outline:2px solid #0085FC;outline-offset:1px}' +
      '.hc-bar__group{display:flex;gap:6px;align-items:center}.hc-bar__key{color:#71717a;margin-right:2px}' +
      'body{padding-top:40px}';
    document.head.appendChild(css);

    bar = document.createElement('div');
    bar.className = 'hc-bar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Concept viewer controls');
    var isHub = root.hasAttribute('data-hub');
    bar.innerHTML =
      '<div class="hc-bar__label"><strong>TechPower Harbor concepts</strong><span>' + (document.title || '') + '</span></div>' +
      (isHub ? '' : '<a href="../index.html">All concepts</a>') +
      '<div class="hc-bar__group"><span class="hc-bar__key">Theme</span><button type="button" data-hc="theme" aria-live="polite"></button></div>';
    document.body.insertBefore(bar, document.body.firstChild);
    themeBtn = bar.querySelector('[data-hc="theme"]');
    fontBtn = bar.querySelector('[data-hc="font"]');
    themeBtn.addEventListener('click', function () { setTheme(theme === 'dark' ? 'light' : 'dark'); });
    syncBar();
  }
  function syncBar() {
    if (!themeBtn) return;
    themeBtn.textContent = theme === 'dark' ? 'Dark · switch to light' : 'Light · switch to dark';
  }

  /* ---- font availability check: warn if an Aeonik weight failed; the browser falls back to the nearest loaded weight ---- */
  function checkFonts() {
    if (!document.fonts || !document.fonts.load) return;
    var weights = [400, 500, 600, 700];
    Promise.all(weights.map(function (w) {
      return document.fonts.load(w + ' 16px "Aeonik"').then(function (faces) {
        var ok = faces.some(function (f) { return f.weight == w || f.weight === String(w); });
        if (!ok) console.warn('[Harbor fonts] Aeonik weight ' + w + ' is not available; the browser will use the nearest loaded weight.');
        return ok;
      }, function () {
        console.warn('[Harbor fonts] Aeonik weight ' + w + ' failed to load (file missing in ../fonts/?); falling back to nearest available weight.');
        return false;
      });
    })).then(function (results) {
      if (results.every(function (r) { return !r; })) console.warn('[Harbor fonts] No Aeonik weights loaded; using system fallback.');
    });
  }

  /* Inside the hub's preview frame the hub's own sidebar and header replace the toolbar. */
  var embedded = false;
  try { embedded = !!(window.frameElement && window.frameElement.hasAttribute('data-harbor-preview')); } catch (e) {}
  // Inside the hub the page background goes transparent (reset.css), so the app sits straight on the hub's stage.
  if (embedded) root.setAttribute('data-embedded', '');
  /* A page shown as the app itself (<html data-app>) has no toolbar either; its theme switch lives in the product UI. */
  function init() { if (!embedded && !root.hasAttribute('data-app')) buildBar(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.HarborTheme = { setTheme: setTheme, setFont: setFont, setNotes: setNotes, get theme() { return theme; }, get font() { return font; }, get notes() { return notes; } };
})();
