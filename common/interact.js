/* Shared prototype interactions, loaded by content.js after HARBOR.mount() on every concept page.
   Everything keys off classes the concepts already render, so no concept markup changes:
   1. Model picker   .model-select opens the approved models (unavailable ones say why). Skipped where data-toggle wires its own (07).
   2. Ask → answer   a suggestion, a matching list item or the composer (Enter / Send) plays the page's own conversation state:
                     the prompt, a short "Searching…" step, then the answer. Follow-ups append; New chat restores the empty state.
   3. Record types   the segmented control shows Administrative actions and the Disclosure report in their own tables.
   4. Record drawer  View (or a row click) opens the record; Previous / Next, J / K, Esc; focus returns to the row. Skipped where a
                     drawer already exists (07's reason-gated drawer).
   5. Date range     the Date button opens presets and a two-month calendar; Apply writes the range into the button and filters
                     the AI interactions table (the sample log holds Sep 16 only, so other ranges show an empty state).
                     Every change fires harbor:daterange on document; HARBOR.setDateRange({s, e}) sets it from page code (13's chart).
   6. Filter bar     where the bar has a Reset button (01–07): search (Enter) and Blocked only filter the AI interactions
                     rows; Reset clears them and puts the date back to Sep 16. 11 and 12 run their own filters.
   Answers are scripted, not generated: the same prompt always gives the same result, so reviews and screenshots repeat. */
(function () {
  'use strict';
  if (!window.HARBOR) return;
  var H = window.HARBOR, chat = H.chat, act = H.activity, models = (H.m1 && H.m1.models) || [];
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var uid = 0;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function icon(n, s) { return H.icon(n, s || 16); }
  function $$(sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); }
  function norm(s) { return String(s || '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function visible(el) { return !!(el && el.getClientRects().length); }
  function nameOf(email) { return email.split('@')[0].split('.').map(function (p) { return p.charAt(0).toUpperCase() + p.slice(1); }).join(' '); }

  /* ================= 1. Model picker ================= */
  var menu = null, menuBtn = null;
  function closeMenu(restore) {
    if (!menu) return;
    menu.remove(); menu = null;
    if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); if (restore) menuBtn.focus(); }
  }
  /* the label is the button's first non-empty text node, wherever it sits (some concepts lead with an icon) */
  function labelNode(btn) { var w = document.createTreeWalker(btn, NodeFilter.SHOW_TEXT, null), n; while ((n = w.nextNode())) if (n.textContent.trim()) return n; return null; }
  function currentModel(btn) { var n = labelNode(btn); return (n ? n.textContent : btn.textContent).trim(); }
  function setModel(btn, name) { var n = labelNode(btn); if (n) n.textContent = n.textContent.replace(n.textContent.trim(), name); else btn.prepend(name + ' '); }
  function openMenu(btn) {
    closeMenu(false);
    menuBtn = btn;
    var cur = currentModel(btn), id = 'hx-menu-' + (++uid);
    menu = document.createElement('div');
    menu.className = 'hx-menu';
    menu.innerHTML = '<div class="hx-menu__head"><span>Approved models</span><span class="hx-menu__note">A chat keeps its model</span></div>' +
      '<div role="listbox" id="' + id + '" aria-label="Choose a model">' + models.map(function (m) {
        var on = m.name === cur, off = !!m.unavailable;
        return '<div class="hx-opt" role="option" aria-selected="' + on + '"' + (off ? ' aria-disabled="true"' : '') + ' tabindex="-1" data-name="' + esc(m.name) + '">' +
          '<span class="hx-opt__name">' + esc(m.name) + '</span><span class="hx-opt__check">' + (on ? icon('check', 16) : '') + '</span>' +
          '<span class="hx-opt__line">' + esc(off ? m.unavailable : m.line) + '</span></div>';
      }).join('') + '</div>';
    document.body.appendChild(menu);
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-controls', id);
    var r = btn.getBoundingClientRect(), h = menu.offsetHeight;
    menu.style.left = Math.max(8, Math.min(r.right - 320, innerWidth - 328)) + 'px';
    menu.style.top = (r.top > h + 16 ? r.top - h - 6 : r.bottom + 6) + 'px';
    (menu.querySelector('[aria-selected="true"]') || menu.querySelector('.hx-opt:not([aria-disabled])')).focus();
  }
  function pickModel(opt) {
    if (opt.getAttribute('aria-disabled') === 'true') return;
    setModel(menuBtn, opt.getAttribute('data-name'));
    closeMenu(true);
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.model-select');
    if (btn && !btn.hasAttribute('data-toggle')) { e.preventDefault(); if (menu && menuBtn === btn) closeMenu(true); else openMenu(btn); return; }
    if (menu) {
      var opt = e.target.closest('.hx-opt');
      if (opt && menu.contains(opt)) { pickModel(opt); return; }
      if (!menu.contains(e.target)) closeMenu(false);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (!menu) return;
    var opts = $$('.hx-opt', menu), i = opts.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); opts[Math.min(opts.length - 1, i + 1)].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); opts[Math.max(0, i - 1)].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); opts[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); opts[opts.length - 1].focus(); }
    else if ((e.key === 'Enter' || e.key === ' ') && i >= 0) { e.preventDefault(); pickModel(opts[i]); }
    else if (e.key === 'Tab') closeMenu(false);
  });
  addEventListener('scroll', function () { closeMenu(false); }, true);
  addEventListener('resize', function () { closeMenu(false); });

  /* ================= 2. Ask → answer ================= */
  var ANSWERS = {
    'what are our 2026 goals?': {
      intro: 'The 2026 planning folder sets four company goals, from the January strategy memo.',
      body: '<ol class="hx-list"><li><strong>Grow managed AI workspaces</strong> to 12 agency customers, up from 5.</li>' +
        '<li><strong>Keep every workload in-region</strong> on Amazon Bedrock, with no customer data leaving customer accounts.</li>' +
        '<li><strong>Cut onboarding</strong> for a new agency to two weeks.</li><li><strong>Reach SOC 2 Type II</strong> by the end of Q3.</li></ol>'
    },
    'list accounts with no activity in the last 30 days': {
      intro: 'Four workspace accounts have had no sign-in or AI activity since August 17.',
      body: '<div class="table-wrap"><table class="data-table data-table--reply"><thead><tr><th scope="col">Account</th><th scope="col">Unit</th><th scope="col">Last active</th></tr></thead><tbody>' +
        [['jordan.blake@techpower.com', 'Operations', 'Aug 9'], ['casey.nguyen@techpower.com', 'Finance', 'Aug 2'], ['riley.adams@techpower.com', 'Engineering', 'Jul 28'], ['morgan.lee@techpower.com', 'Operations', 'Never']]
          .map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table></div>'
    }
  };
  function generic(prompt) {
    return {
      intro: 'I searched SharePoint, OneDrive and Outlook for “' + esc(prompt) + '”. These are the closest matches you can open:',
      body: '<ul class="hx-list">' + (chat.sources || []).map(function (s) { return '<li><strong>' + esc(s.name) + '</strong> · ' + esc(s.where) + '</li>'; }).join('') + '</ul>'
    };
  }

  var conv = $$('.state').filter(function (s) { return s.querySelector('.msg--user') && s.querySelector('.msg--assistant'); })[0];
  var srcApp = conv && conv.querySelector('.app') ? conv.querySelector('.app').cloneNode(true) : null;
  var srcPrompt = srcApp ? norm((srcApp.querySelector('.msg--user .msg__body') || srcApp.querySelector('.msg--user')).textContent) : '';
  var empties = $$('.state').filter(function (s) { return s !== conv && s.querySelector('.app .composer') && !s.querySelector('.msg--user'); }).slice(0, 1);
  var suggestionTexts = (chat.suggestions || []).map(function (s) { return s.text; });
  var actionTexts = (chat.actions || []).map(function (a) { return a.text; });

  function uniqueIds(root) {
    var map = {}, n = ++uid;
    $$('[id]', root).forEach(function (el) { map[el.id] = el.id + '-hx' + n; el.id = map[el.id]; });
    $$('[for],[aria-controls],[aria-labelledby],[aria-describedby],[data-toggle]', root).forEach(function (el) {
      ['for', 'aria-controls', 'aria-labelledby', 'aria-describedby', 'data-toggle'].forEach(function (a) {
        var v = el.getAttribute(a); if (v) el.setAttribute(a, v.split(' ').map(function (x) { return map[x] || x; }).join(' '));
      });
    });
    /* SVG paint and clip references (the brandmark's gradients) follow their renamed ids, or the mark loses its fill */
    $$('[fill^="url(#"],[stroke^="url(#"],[clip-path^="url(#"],[mask^="url(#"]', root).forEach(function (el) {
      ['fill', 'stroke', 'clip-path', 'mask'].forEach(function (a) {
        var v = el.getAttribute(a), m = v && /^url\(#([^)]+)\)$/.exec(v); if (m && map[m[1]]) el.setAttribute(a, 'url(#' + map[m[1]] + ')');
      });
    });
  }
  function setModelText(node, model) {
    $$('.msg__meta, .msg__time', node).forEach(function (m) { m.textContent = m.textContent.replace(/Claude Sonnet 4\.6|Claude Haiku 4\.5|GPT-OSS 120B|GPT-5/, model); });
  }
  function fillAnswer(asst, prompt) {
    if (norm(prompt) === srcPrompt) return;
    var a = ANSWERS[norm(prompt)] || generic(prompt), body = asst.querySelector('.msg__body') || asst;
    var p = body.querySelector('p');
    if (p) p.innerHTML = a.intro; else body.insertAdjacentHTML('afterbegin', '<p>' + a.intro + '</p>');
    var tw = body.querySelector('.table-wrap');
    if (tw) tw.outerHTML = a.body; else (p || body.firstChild).insertAdjacentHTML('afterend', a.body);
    $$('.msg__aside', body).forEach(function (x) { x.remove(); });
  }
  function scrollDown(app) { var sc = app.querySelector('.main__scroll') || app.querySelector('.thread'); if (sc) sc.scrollTop = sc.scrollHeight; }

  /* play one exchange into a thread: the user's message now, the answer after a short retrieval step */
  function play(app, prompt) {
    var tpl = srcApp, user = tpl.querySelector('.msg--user').cloneNode(true), asst = tpl.querySelector('.msg--assistant').cloneNode(true);
    var ub = user.querySelector('.msg__body') || user.querySelector('p') || user; ub.textContent = prompt;
    fillAnswer(asst, prompt);
    var btn = app.querySelector('.model-select'); if (btn) setModelText(asst, currentModel(btn));
    uniqueIds(user); uniqueIds(asst);
    var thread = (app.querySelector('.msg--user') || app.querySelector('.hx-anchor')).parentElement;
    var anchor = $$('.msg', thread).pop();
    anchor.after(user);
    var typing = document.createElement('div');
    typing.className = 'hx-typing'; typing.setAttribute('role', 'status');
    typing.innerHTML = icon('search', 16) + '<span>Searching SharePoint, OneDrive and Outlook</span><span class="hx-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
    user.after(typing);
    scrollDown(app);
    setTimeout(function () {
      typing.replaceWith(asst);
      asst.classList.add('hx-reveal');
      scrollDown(app);
    }, reduce ? 250 : 1100);
  }

  /* the empty state becomes the page's own conversation layout, holding only this exchange */
  function startConversation(state, prompt) {
    var app = state.querySelector('.app'), live = srcApp.cloneNode(true);
    uniqueIds(live);
    var thread = live.querySelector('.msg--user').parentElement;
    $$('.msg', thread).forEach(function (m) { m.remove(); });
    $$('[data-slot="deleted-msg"]', live).forEach(function (m) { m.innerHTML = ''; });
    var keep = document.createElement('span'); keep.className = 'msg hx-anchor'; keep.hidden = true; thread.prepend(keep);
    var oldBtn = app.querySelector('.model-select'), newBtn = live.querySelector('.model-select');
    if (oldBtn && newBtn) setModel(newBtn, currentModel(oldBtn));
    /* the conversation's own heading (09's pane title, for one) names this chat, not the sample one */
    $$('h1, h2, .pane__title, .crumbs__current', live).forEach(function (h) { if (norm(h.textContent) === srcPrompt) h.textContent = prompt.length > 64 ? prompt.slice(0, 61) + '\u2026' : prompt; });
    app.replaceWith(live);
    var label = state.querySelector('.state__label');
    if (label && !label.querySelector('.hx-live-note')) label.insertAdjacentHTML('beforeend', '<span class="hx-live-note">· live: New chat starts over</span>');
    play(live, prompt);
    var ta = live.querySelector('.composer__input, textarea'); if (ta) ta.focus({ preventScroll: true });
  }

  function ask(app, prompt) {
    prompt = String(prompt || '').trim();
    if (!prompt || !srcApp) return;
    var state = app.closest('.state');
    if (app.querySelector('.msg--user') || app.querySelector('.hx-anchor')) play(app, prompt);
    else if (state) startConversation(state, prompt);
  }

  if (srcApp) {
    var originals = empties.map(function (s) { return { state: s, app: s.querySelector('.app').cloneNode(true) }; });
    document.addEventListener('submit', function (e) {
      var form = e.target.closest && e.target.closest('.composer');
      var app = form && form.closest('.app');
      if (!app || !app.closest('.state')) return;
      e.preventDefault();
      var ta = form.querySelector('textarea, input[type="text"]');
      if (!ta || !ta.value.trim()) { if (ta) ta.focus(); return; }
      var text = ta.value; ta.value = '';
      ask(app, text);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
      var ta = e.target.closest && e.target.closest('.composer textarea');
      if (!ta) return;
      e.preventDefault();
      if (ta.form && ta.form.requestSubmit) ta.form.requestSubmit(); else if (ta.form) ta.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
    document.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('a, button, [role="button"]');
      if (!el || el.closest('.model-select, .hx-menu, .composer')) return;
      var app = el.closest('.app'), state = el.closest('.state');
      if (!app || !state) return;
      var text = norm(el.textContent);
      /* New chat restores the untouched empty state */
      if ((text.indexOf('new chat') === 0 || norm(el.getAttribute('aria-label')) === 'new chat') && app.querySelector('.hx-anchor')) {
        var o = originals.filter(function (x) { return x.state === state; })[0];
        if (o) { e.preventDefault(); var fresh = o.app.cloneNode(true); app.replaceWith(fresh); var l = state.querySelector('.hx-live-note'); if (l) l.remove(); var ta = fresh.querySelector('textarea'); if (ta) ta.focus({ preventScroll: true }); }
        return;
      }
      if (empties.indexOf(state) < 0 && !app.querySelector('.hx-anchor')) return;
      var hit = suggestionTexts.filter(function (t) { return text.indexOf(norm(t)) >= 0; })[0];
      if (hit) { e.preventDefault(); ask(app, hit); return; }
      var action = actionTexts.filter(function (t) { return text === norm(t); })[0];
      if (action) {
        e.preventDefault();
        var area = app.querySelector('.composer textarea');
        if (area) { area.value = action + ': '; area.focus(); area.setSelectionRange(area.value.length, area.value.length); }
      }
    });
  }

  /* ================= 3. Record types ================= */
  var ADMIN = [
    ['09/16 18:02', 'Dan Mitchell', 'Changed a budget threshold', 'Finance unit', '$30.00 → $40.00 a month'],
    ['09/16 17:40', 'Dan Mitchell', 'Viewed a transcript', 'evt_01J8ZK4T7Q', 'Reason: policy review · Ticket T-0142'],
    ['09/16 16:05', 'Lee Okafor', 'Exported Activity', 'AI interactions · Sep 16', 'CSV, 174 records'],
    ['09/16 14:51', 'Dan Mitchell', 'Disabled a model', 'GPT-5 · Engineering', 'Budget threshold reached'],
    ['09/16 11:22', 'Sam Reyes', 'Updated a connector', 'SharePoint', 'Added site: Partnerships'],
    ['09/16 10:08', 'Dan Mitchell', 'Invited users', 'Operations', '3 users'],
    ['09/15 17:44', 'Dan Mitchell', 'Changed a role', 'priya.natarajan@techpower.com', 'Member → Unit admin'],
    ['09/15 09:30', 'Dan Mitchell', 'Changed retention', 'Activity records', 'Kept per the agency records policy']
  ];
  var REPORTS = [
    ['Public records request PRR-2026-114', 'Aug 1 – Aug 31', 'Dan Mitchell', 'ok', 'Ready'],
    ['Council briefing: AI spend', 'Sep 1 – Sep 15', 'Lee Okafor', 'ok', 'Ready'],
    ['Quarterly AI use summary, Q3', 'Jul 1 – Sep 30', 'Scheduled', 'warn', 'Generating']
  ];
  function altTable(kind) {
    var head, rows, foot;
    if (kind === 1) {
      head = ['Time', 'Admin', 'Action', 'Target', 'Details'];
      rows = ADMIN.map(function (r) { return '<tr><td class="num">' + r[0] + '</td><td>' + esc(r[1]) + '</td><td><strong>' + esc(r[2]) + '</strong></td><td class="' + (/^evt_/.test(r[3]) ? 'hx-mono' : '') + '">' + esc(r[3]) + '</td><td class="hx-wrap">' + esc(r[4]) + '</td></tr>'; });
      foot = 'Showing <strong>1–8</strong> of <strong>8</strong> administrative actions';
    } else {
      head = ['Report', 'Period', 'Requested by', 'Status', ''];
      rows = REPORTS.map(function (r) { return '<tr><td><strong>' + esc(r[0]) + '</strong></td><td class="num">' + r[1] + '</td><td>' + esc(r[2]) + '</td><td><span class="badge hx-' + r[3] + '">' + r[4] + '</span></td><td>' + (r[3] === 'ok' ? '<a class="link link--action" href="#">Download</a>' : '<span class="muted">—</span>') + '</td></tr>'; });
      foot = '3 reports · reports hold metadata only; a transcript still needs a recorded reason';
    }
    return '<div class="table-wrap hx-alt"><table class="data-table"><thead><tr>' + head.map(function (h) { return '<th scope="col">' + (h ? esc(h) : '<span class="sr-only">Actions</span>') + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table></div>' +
      '<p class="hx-foot hx-alt-foot">' + foot + '</p>';
  }
  $$('[data-slot="segments"]').forEach(function (seg) {
    var scope = seg.closest('.state') || document;
    var tbody = scope.querySelector('[data-slot^="activity-rows"]');
    var wrap = tbody && tbody.closest('.table-wrap');
    if (!wrap) return;
    /* everything that belongs to the AI interactions view: table, pager, result footers, the 12 chart and chips */
    var aiOnly = [wrap].concat($$('.pager, .records__foot, .timeline, .chips, .result', scope).filter(function (x) { return !seg.contains(x); }));
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('.segment');
      if (!b) return;
      var all = $$('.segment', seg), i = all.indexOf(b);
      all.forEach(function (x) { var on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      $$('.hx-alt, .hx-alt-foot', scope).forEach(function (x) { x.remove(); });
      aiOnly.forEach(function (x) {
        if (i === 0) { x.classList.remove('hx-hidden'); }
        else x.classList.add('hx-hidden');
      });
      if (i > 0) {
        wrap.insertAdjacentHTML('afterend', altTable(i));
        var foot = wrap.parentNode.querySelector('.hx-alt-foot');
        if (foot && wrap.parentNode.classList.contains('records')) foot.style.borderTop = '1px solid var(--color-border-card, var(--color-border))';
      }
    });
  });

  /* ================= 4. Record drawer ================= */
  var SUFFIX = ['2M9C', '3H1D', '3V8E', '4T7Q', '5B2R', '5K6S', '6P0T', '7D4U', '7X3V', '8F5W'];
  var IPS = ['10.40.12.7 · Olympia HQ', '10.40.18.22 · Olympia HQ', '10.52.3.140 · Tacoma office', '10.40.12.31 · Olympia HQ'];
  var drawer = null, scrim = null, opener = null, curRow = null, curRows = null;

  function record(i) {
    var r = act.rows[i], d = act.detail || {};
    var haiku = parseFloat(r.cost.slice(1)) > 0 && parseFloat(r.cost.slice(1)) < 0.015;
    var model = r.checks === 'blocked' ? (d.model || 'Claude Sonnet 4.6') + ' · not called' : haiku ? 'Claude Haiku 4.5' : 'Claude Sonnet 4.6';
    var tin = 900 + (i * 173) % 900, cost = parseFloat(r.cost.slice(1));
    var tout = r.checks === 'blocked' ? 0 : Math.max(120, Math.round((cost - tin * (haiku ? 1e-6 : 3e-6)) / (haiku ? 5e-6 : 15e-6)));
    var outcome = {
      blocked: ['Refused before the model was called.', 'Matched ' + (d.policy || 'DLP rule HR-03 · bulk export of personal data') + '.'],
      withheld: ['The model answered, but the response was withheld.', 'Matched response policy RP-07 · personnel matters.'],
      sanitized: ['Protected text was masked before the model was called; the rest was answered.', 'Masking rule PII-02 · 2 phone numbers.']
    }[r.checks] || ['Answered' + (r.tools.length ? ' with ' + r.tools.length + (r.tools.length > 1 ? ' tools' : ' tool') : ' without tools') + '.', ''];
    return { r: r, id: 'evt_01J8ZK' + SUFFIX[i % SUFFIX.length], model: model, tokens: tin.toLocaleString('en-US') + ' in · ' + tout.toLocaleString('en-US') + ' out', outcome: outcome, ip: IPS[i % IPS.length] };
  }
  function rowsOf(tbody) { return $$('tr', tbody); }
  function openRecord(tr, from) {
    var tbody = tr.parentNode, rows = rowsOf(tbody), i = rows.indexOf(tr);
    if (i < 0 || i >= act.rows.length) return;
    curRows = rows; curRow = tr;
    if (!drawer) {
      opener = from || tr.querySelector('a, button') || tr;
      scrim = document.createElement('div'); scrim.className = 'hx-scrim';
      drawer = document.createElement('aside'); drawer.className = 'hx-drawer';
      drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'true'); drawer.setAttribute('aria-labelledby', 'hx-drawer-title');
      /* inside the row's app frame, under its header, like every side panel there; without a frame, below the fixed
         concept bar (theme.js) */
      var app = tr.closest('.app'), head = app && app.querySelector('.app__header'), top;
      if (app) {
        app.append(scrim, drawer); scrim.classList.add('hx-in-frame'); drawer.classList.add('hx-in-frame');
        top = head ? head.offsetTop + head.offsetHeight : 0;
      } else {
        document.body.append(scrim, drawer);
        var bar = document.querySelector('.hc-bar'); top = bar && visible(bar) ? bar.getBoundingClientRect().bottom : 0;
      }
      drawer.style.top = top + 'px'; scrim.style.top = top + 'px';
      scrim.addEventListener('click', closeRecord);
    }
    $$('tr.hx-current, tr.is-selected', tbody).forEach(function (x) { x.classList.remove('hx-current', 'is-selected'); x.removeAttribute('aria-selected'); });
    tr.classList.add('hx-current'); tr.setAttribute('aria-selected', 'true');
    var rec = record(i), r = rec.r;
    var tone = r.checks === 'sanitized' ? 'warn' : r.checks ? 'danger' : '';
    drawer.innerHTML =
      /* identity in the bar, like every 13 drawer: name and time on line 1, status and event id on line 2. No pager in the bar
         (it crowded it): J / K still step through the records from the keyboard */
      '<div class="hx-drawer__bar"><header class="hx-drawer__head"><h2 class="hx-drawer__title" id="hx-drawer-title">' + esc(nameOf(r.user)) + ' · ' + esc(r.time) + '</h2>' +
        '<div class="hx-drawer__tags">' + (r.checks ? '<span class="badge badge--' + (tone === 'warn' ? 'warn' : 'danger') + '">' + esc(r.checks) + '</span>' : '<span class="badge hx-ok">answered</span>') + '<span class="hx-mono">' + rec.id + '</span></div></header>' +
        '<button type="button" class="hx-icon-btn hx-export" aria-label="Export record" title="Export record">' + icon('export', 16) + '</button>' +
        '<button type="button" class="hx-icon-btn hx-close" aria-label="Close record" aria-keyshortcuts="Escape" title="Close (Esc)">' + icon('close', 16) + '</button></div>' +
      '<div class="hx-drawer__scroll">' +
        '<section><h3 class="hx-caps">Prompt</h3><blockquote class="hx-quote' + (tone ? ' is-' + tone : '') + '">' + esc(r.prompt) + '</blockquote></section>' +
        '<section><h3 class="hx-caps">Outcome</h3><p class="hx-outcome">' + esc(rec.outcome[0]) + (rec.outcome[1] ? ' ' + esc(rec.outcome[1]) : '') + '</p></section>' +
        '<section><h3 class="hx-caps">Record</h3><dl class="hx-dl">' +
          [['User', esc(r.user)], ['Department', esc(r.dept)], ['Model', esc(rec.model)], ['Tokens', '<span class="num">' + rec.tokens + '</span>'], ['Cost', '<span class="num">' + esc(r.cost) + '</span>'],
           ['Tools', r.tools.length ? r.tools.map(function (t) { return '<span class="hx-mono">' + esc(t) + '</span>'; }).join('<br>') : '<span class="muted">None</span>'],
           ['Source', esc(rec.ip)], ['Retention', esc((act.detail && act.detail.retention) || 'Per the agency records policy')]]
            .map(function (x) { return '<dt>' + x[0] + '</dt><dd>' + x[1] + '</dd>'; }).join('') + '</dl></section>' +
      '</div>' +
      /* decisions in the footer, right-aligned with the primary last, like every drawer; Export is a utility, so it is an
         icon in the bar instead of a third button competing with Mark reviewed */
      '<div class="hx-drawer__foot"><button type="button" class="btn btn--secondary btn--sm">Open ticket</button><button type="button" class="btn btn--primary btn--sm">Mark reviewed</button></div>';
    drawer.querySelector('.hx-close').addEventListener('click', closeRecord);
    tr.scrollIntoView({ block: 'nearest' });
    if (from !== 'keep') drawer.querySelector('.hx-close').focus();
  }
  function step(d) {
    var shown = curRows.filter(visible), i = shown.indexOf(curRow), next = shown[i + d];
    if (!next) return;
    openRecord(next, 'keep');
    drawer.querySelector('.hx-close').focus();
  }
  function closeRecord() {
    if (!drawer) return;
    drawer.remove(); scrim.remove(); drawer = scrim = null;
    var back = curRow && (curRow.querySelector('.link--action, a') || curRow);
    if (back && visible(back)) back.focus(); else if (opener && opener.focus) opener.focus();
  }
  var hasOwnDrawer = !!document.querySelector('[data-slot="m1-event-drawer"]');
  if (!hasOwnDrawer) {
    $$('[data-slot^="activity-rows"]').forEach(function (tbody) { rowsOf(tbody).forEach(function (tr) { tr.classList.add('hx-row'); }); });
    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      var tr = e.target.closest('[data-slot^="activity-rows"] tr');
      if (!tr) return;
      if (e.target.closest('input, label, .checkbox') && !e.target.closest('.link--action')) return;
      e.preventDefault();
      openRecord(tr, e.target.closest('a, button') || tr);
    });
    document.addEventListener('keydown', function (e) {
      if (!drawer) return;
      if (e.key === 'Escape') { e.preventDefault(); closeRecord(); return; }
      if (/input|textarea|select/i.test(e.target.tagName)) return;
      if (e.key === 'j' || e.key === 'J') { e.preventDefault(); step(1); }
      else if (e.key === 'k' || e.key === 'K') { e.preventDefault(); step(-1); }
      else if (e.key === 'Tab') {
        var f = $$('button:not([disabled]), a[href]', drawer).filter(visible);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
        else if (!drawer.contains(document.activeElement)) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ================= 5. Date range ================= */
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var TODAY = new Date(2026, 8, 16), FIRST = new Date(2026, 5, 18);   /* the sample "today"; the log keeps 90 days */
  function day(y, m, d) { return new Date(y, m, d); }
  function add(d, n) { return day(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function same(a, b) { return !!a && !!b && a.getTime() === b.getTime(); }
  function clampDay(d) { return d < FIRST ? FIRST : d > TODAY ? TODAY : d; }
  function key(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function fmt(d) { return MONTHS[d.getMonth()] + ' ' + d.getDate(); }
  function fmtRange(r) {
    if (same(r.s, r.e)) return fmt(r.s);
    return r.s.getMonth() === r.e.getMonth() ? fmt(r.s) + ' – ' + r.e.getDate() : fmt(r.s) + ' – ' + fmt(r.e);
  }
  function span(r) { return Math.round((r.e - r.s) / 864e5) + 1; }
  var PRESETS = [
    { label: 'Today', r: function () { return { s: TODAY, e: TODAY }; } },
    { label: 'Yesterday', r: function () { var y = add(TODAY, -1); return { s: y, e: y }; } },
    { label: 'Last 7 days', r: function () { return { s: add(TODAY, -6), e: TODAY }; } },
    { label: 'Last 30 days', r: function () { return { s: add(TODAY, -29), e: TODAY }; } },
    { label: 'This month', r: function () { return { s: day(2026, 8, 1), e: TODAY }; } },
    { label: 'Last month', r: function () { return { s: day(2026, 7, 1), e: day(2026, 7, 31) }; } }
  ];

  var cal = null, calBtn = null, sel = null, hover = null, view = null, focusDay = null;
  function isDateBtn(b) {
    if (b.matches('.date-btn, .filters__range')) return true;
    if (b.matches('.filter-btn[aria-haspopup="dialog"]')) return !!b.querySelector('[data-icon="calendar"], .icon--calendar') || /\bdate\b/i.test(b.textContent);
    return b.matches('.chipbtn') && /^\s*[A-Z][a-z]{2} \d{1,2}\b/.test(b.textContent);
  }
  function rangeOf(b) { return b._hxRange || { s: TODAY, e: TODAY }; }
  /* the shown value: .filter-btn__value where there is one, else the button's own text (08 keeps its ", 2026") */
  function writeValue(b, r) {
    var v = b.querySelector('.filter-btn__value'), text = fmtRange(r);
    if (v) { v.textContent = text; return; }
    var n = labelNode(b); if (!n) return;
    var year = /,\s*\d{4}/.test(n.textContent) ? ', 2026' : '';
    n.textContent = n.textContent.replace(n.textContent.trim(), text + year);
  }

  function monthHTML(y, m) {
    var first = day(y, m, 1), lead = first.getDay(), days = day(y, m + 1, 0).getDate();
    var h = '<div class="hx-cal__month"><div class="hx-cal__mname" id="hx-m-' + y + '-' + m + '">' + MONTHS_LONG[m] + ' ' + y + '</div>' +
      '<table class="hx-cal__grid" role="grid" aria-labelledby="hx-m-' + y + '-' + m + '"><thead><tr>' +
      DOW.map(function (d) { return '<th scope="col" abbr="' + d + '">' + d + '</th>'; }).join('') + '</tr></thead><tbody><tr>';
    for (var i = 0; i < lead; i++) h += '<td role="gridcell" class="hx-cal__pad"></td>';
    for (var d = 1; d <= days; d++) {
      var dt = day(y, m, d), col = (lead + d - 1) % 7;
      var s = sel.s, e = sel.e || (sel.s && hover && hover > sel.s ? hover : null);
      var start = same(dt, s), end = e ? same(dt, e) : start, inside = s && e && dt > s && dt < e;
      var off = dt < FIRST || dt > TODAY;
      var cls = ['hx-cal__cell'];
      if (start || end || inside) cls.push('is-band');
      if (start) cls.push('is-start'); if (end) cls.push('is-end');
      if (!sel.e && e && (inside || end) && !start) cls.push('is-preview');
      h += '<td role="gridcell" class="' + cls.join(' ') + '"' + (start || end || inside ? ' aria-selected="true"' : '') + '>' +
        '<button type="button" class="hx-day' + (same(dt, TODAY) ? ' is-today' : '') + '" data-day="' + key(dt) + '" tabindex="' + (same(dt, focusDay) ? '0' : '-1') + '"' +
        (off ? ' disabled aria-disabled="true"' : '') +
        ' aria-label="' + DOW[dt.getDay()] + ' ' + MONTHS_LONG[m] + ' ' + d + (same(dt, TODAY) ? ', today' : '') + (start ? ', range start' : '') + (end && !start ? ', range end' : '') + '">' + d + '</button></td>';
      if (col === 6 && d < days) h += '</tr><tr>';
    }
    return h + '</tr></tbody></table></div>';
  }
  function renderCal() {
    var left = day(view.getFullYear(), view.getMonth() - 1, 1), two = innerWidth >= 640;
    var r = sel.e ? sel : null, active = r && PRESETS.filter(function (p) { var q = p.r(); return same(q.s, r.s) && same(q.e, r.e); })[0];
    cal.innerHTML =
      '<div class="hx-cal__presets" role="group" aria-label="Quick ranges">' + PRESETS.map(function (p, i) {
        return '<button type="button" class="hx-cal__preset" data-preset="' + i + '" aria-pressed="' + (p === active) + '">' + p.label + '</button>';
      }).join('') + '</div>' +
      '<div class="hx-cal__main"><div class="hx-cal__nav">' +
        '<button type="button" class="hx-icon-btn hx-prev" data-nav="-1" aria-label="Previous month"' + ((two ? left : view) <= FIRST ? ' disabled' : '') + '>' + icon('chevron') + '</button>' +
        '<button type="button" class="hx-icon-btn hx-next" data-nav="1" aria-label="Next month"' + (view.getMonth() >= TODAY.getMonth() && view.getFullYear() >= TODAY.getFullYear() ? ' disabled' : '') + '>' + icon('chevron') + '</button></div>' +
        '<div class="hx-cal__months">' + (two ? monthHTML(left.getFullYear(), left.getMonth()) : '') + monthHTML(view.getFullYear(), view.getMonth()) + '</div>' +
        '<div class="hx-cal__foot"><span class="hx-cal__sum" aria-live="polite">' +
          (sel.e ? esc(fmtRange(sel)) + ' <span class="hx-cal__days">· ' + span(sel) + (span(sel) === 1 ? ' day' : ' days') + '</span>' : 'Pick an end date') + '</span>' +
          '<button type="button" class="btn btn--secondary" data-cal="cancel">Cancel</button>' +
          '<button type="button" class="btn btn--primary" data-cal="apply"' + (sel.s ? '' : ' disabled') + '>Apply</button></div>' +
      '</div>';
  }
  function placeCal() {
    if (!cal) return;
    var r = calBtn.getBoundingClientRect(), w = cal.offsetWidth, h = cal.offsetHeight;
    var top = r.bottom + 6; if (top + h > innerHeight - 8 && r.top - h - 6 > 8) top = r.top - h - 6;
    cal.style.top = Math.max(8, top) + 'px';
    cal.style.left = Math.max(8, Math.min(r.left, innerWidth - w - 8)) + 'px';
  }
  function focusCal() { var b = cal.querySelector('.hx-day[tabindex="0"]') || cal.querySelector('.hx-day:not([disabled])'); if (b) b.focus(); }
  function openCal(btn) {
    closeCal(false); closeMenu(false);
    calBtn = btn;
    var r = rangeOf(btn); sel = { s: r.s, e: r.e }; hover = null; focusDay = r.e;
    view = day(r.e.getFullYear(), r.e.getMonth(), 1);
    cal = document.createElement('div');
    cal.className = 'hx-cal';
    cal.setAttribute('role', 'dialog');
    cal.setAttribute('aria-label', 'Choose a date range');
    renderCal();
    document.body.appendChild(cal);
    btn.setAttribute('aria-expanded', 'true');
    placeCal(); focusCal();
  }
  function closeCal(restore) {
    if (!cal) return;
    cal.remove(); cal = null;
    calBtn.setAttribute('aria-expanded', 'false');
    if (restore) calBtn.focus();
  }
  function applyCal() {
    var r = { s: sel.s, e: sel.e || sel.s };
    calBtn._hxRange = r;
    /* the same range shows on every Date button on the page (the Chat page stacks two states) */
    $$('button').filter(isDateBtn).forEach(function (b) { b._hxRange = r; writeValue(b, r); });
    filterByDate(r);
    closeCal(true);
  }
  /* every sample record is from Sep 16: a range without it empties the AI interactions table and says why */
  function filterByDate(r) {
    var hit = r.s <= TODAY && r.e >= TODAY;
    $$('[data-slot^="activity-rows"]').forEach(function (tbody) {
      var old = tbody.querySelector('.hx-empty'); if (old) old.remove();
      rowsOf(tbody).forEach(function (tr) { tr.classList.toggle('hx-out', !hit); });
      if (hit) return;
      var cols = (tbody.closest('table') || tbody).querySelectorAll('thead th').length || 8;
      var tr = document.createElement('tr');
      tr.className = 'hx-empty';
      tr.innerHTML = '<td colspan="' + cols + '"><strong>No AI interactions ' + (same(r.s, r.e) ? 'on ' + fmt(r.s) : 'between ' + fmt(r.s) + ' and ' + fmt(r.e)) + '.</strong> ' +
        'This sample log holds Sep 16 only. <button type="button" class="link hx-date-today">Show today</button></td>';
      tbody.appendChild(tr);
    });
    $$('.pager, .records__foot').forEach(function (x) { x.classList.toggle('hx-out', !hit); });
    document.dispatchEvent(new CustomEvent('harbor:daterange', { detail: { s: r.s, e: r.e } }));
  }
  H.setDateRange = function (r) {
    sel = { s: r.s, e: r.e };
    $$('button').filter(isDateBtn).forEach(function (b) { b._hxRange = sel; writeValue(b, sel); });
    filterByDate(sel);
  };
  function moveFocus(d) {
    d = clampDay(d); focusDay = d;
    var left = day(view.getFullYear(), view.getMonth() - (innerWidth >= 640 ? 1 : 0), 1), right = day(view.getFullYear(), view.getMonth() + 1, 0);
    if (d < left) view = day(view.getFullYear(), view.getMonth() - 1, 1);
    if (d > right) view = day(d.getFullYear(), d.getMonth(), 1);
    renderCal(); focusCal();
  }
  function parseDay(k) { var p = k.split('-'); return day(+p[0], +p[1] - 1, +p[2]); }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var today = e.target.closest('.hx-date-today');
    if (today) { e.preventDefault(); var r = { s: TODAY, e: TODAY }; calBtn = calBtn || $$('button').filter(isDateBtn)[0]; sel = r; $$('button').filter(isDateBtn).forEach(function (b) { b._hxRange = r; writeValue(b, r); }); filterByDate(r); return; }
    var btn = e.target.closest('button');
    if (cal && cal.contains(e.target)) {
      if (!btn) return;
      if (btn.hasAttribute('data-preset')) { var q = PRESETS[+btn.getAttribute('data-preset')].r(); sel = { s: q.s, e: q.e }; focusDay = q.e; view = day(q.e.getFullYear(), q.e.getMonth(), 1); renderCal(); cal.querySelector('[data-preset="' + btn.getAttribute('data-preset') + '"]').focus(); }
      else if (btn.hasAttribute('data-nav')) { view = day(view.getFullYear(), view.getMonth() + +btn.getAttribute('data-nav'), 1); renderCal(); var nb = cal.querySelector('[data-nav="' + btn.getAttribute('data-nav') + '"]'); (nb.disabled ? cal.querySelector('[data-nav]:not([disabled])') || nb : nb).focus(); }
      else if (btn.getAttribute('data-cal') === 'cancel') closeCal(true);
      else if (btn.getAttribute('data-cal') === 'apply') applyCal();
      else if (btn.hasAttribute('data-day')) {
        var d = parseDay(btn.getAttribute('data-day'));
        /* first pick starts a range; the second ends it, in either direction */
        if (!sel.s || sel.e) sel = { s: d, e: null }; else sel = d < sel.s ? { s: d, e: sel.s } : { s: sel.s, e: d };
        hover = null; focusDay = d; renderCal(); focusCal();
      }
      return;
    }
    if (btn && isDateBtn(btn)) { e.preventDefault(); if (cal && calBtn === btn) closeCal(true); else openCal(btn); return; }
    if (cal) closeCal(false);
  });
  document.addEventListener('mouseover', function (e) {
    if (!cal || !sel.s || sel.e || !e.target.closest) return;
    var b = e.target.closest('.hx-day:not([disabled])'), d = b ? parseDay(b.getAttribute('data-day')) : null;
    if (same(d, hover)) return;
    hover = d;
    /* repaint only the band so the pointer keeps its target */
    $$('.hx-cal__cell', cal).forEach(function (td) {
      var x = td.querySelector('.hx-day'); if (!x) return;
      var dt = parseDay(x.getAttribute('data-day')), inPrev = d && d > sel.s && dt > sel.s && dt <= d;
      td.classList.toggle('is-band', same(dt, sel.s) || !!inPrev);
      td.classList.toggle('is-preview', !!inPrev);
      td.classList.toggle('is-end', !!d && same(dt, d) && d > sel.s);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (!cal) return;
    if (e.key === 'Escape') { e.preventDefault(); closeCal(true); return; }
    var b = e.target.closest && e.target.closest('.hx-day');
    if (b && cal.contains(b)) {
      var d = parseDay(b.getAttribute('data-day')), n = null;
      if (e.key === 'ArrowLeft') n = add(d, -1); else if (e.key === 'ArrowRight') n = add(d, 1);
      else if (e.key === 'ArrowUp') n = add(d, -7); else if (e.key === 'ArrowDown') n = add(d, 7);
      else if (e.key === 'Home') n = add(d, -d.getDay()); else if (e.key === 'End') n = add(d, 6 - d.getDay());
      else if (e.key === 'PageUp') n = day(d.getFullYear(), d.getMonth() - 1, d.getDate());
      else if (e.key === 'PageDown') n = day(d.getFullYear(), d.getMonth() + 1, d.getDate());
      if (n) { e.preventDefault(); moveFocus(n); return; }
    }
    if (e.key === 'Tab') {
      var f = $$('button:not([disabled])', cal).filter(function (x) { return !x.classList.contains('hx-day') || x.tabIndex === 0; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  window.addEventListener('resize', function () { if (cal) { renderCal(); placeCal(); } });
  document.addEventListener('scroll', placeCal, true);

  /* ================= 6. Filter bar: search, Blocked only, Reset ================= */
  function barOf(t) { var f = t && t.closest && t.closest('form.filters'); return f && f.querySelector('.filters__reset') ? f : null; }
  /* the rows this bar filters: the nearest activity table above it in the page */
  function bodiesFor(form) {
    for (var el = form.parentElement; el; el = el.parentElement) {
      var b = $$('[data-slot^="activity-rows"], [data-slot="m1-activity-rows"]', el); if (b.length) return b;
    }
    return [];
  }
  function applyBar(form) {
    var q = norm((form.querySelector('input[type="search"]') || {}).value);
    var cb = form.querySelector('input[type="checkbox"]'), blockedOnly = !!(cb && cb.checked);
    bodiesFor(form).forEach(function (tbody) {
      var old = tbody.querySelector('.hx-nomatch'); if (old) old.remove();
      var rows = rowsOf(tbody).filter(function (tr) { return !tr.classList.contains('hx-empty'); }), shown = 0;
      rows.forEach(function (tr) {
        var ok = (!q || norm(tr.textContent).indexOf(q) >= 0) &&
          (!blockedOnly || tr.classList.contains('is-blocked') || $$('.badge, .chip, .status', tr).some(function (b) { return norm(b.textContent) === 'blocked'; }));
        tr.classList.toggle('hx-filt', !ok);
        if (ok && !tr.classList.contains('hx-out')) shown++;
      });
      /* the date filter's own empty state wins when the range itself has no records */
      if (shown || rows.some(function (tr) { return tr.classList.contains('hx-out'); })) return;
      var cols = (tbody.closest('table') || tbody).querySelectorAll('thead th').length || 8;
      var tr = document.createElement('tr');
      tr.className = 'hx-empty hx-nomatch';
      tr.innerHTML = '<td colspan="' + cols + '"><strong>No records match these filters.</strong> <button type="button" class="link hx-bar-reset">Reset filters</button></td>';
      tbody.appendChild(tr);
    });
  }
  function resetBar(form) {
    /* the native reset has cleared the search and the checkbox; put the date back and show every row */
    var r = { s: TODAY, e: TODAY };
    sel = r;
    $$('button').filter(isDateBtn).forEach(function (b) { b._hxRange = r; writeValue(b, r); });
    filterByDate(r);
    applyBar(form);
  }
  document.addEventListener('submit', function (e) { var f = barOf(e.target); if (f) { e.preventDefault(); applyBar(f); } });
  document.addEventListener('change', function (e) { if (e.target.type === 'checkbox') { var f = barOf(e.target); if (f) applyBar(f); } });
  /* clearing the search (typing it empty or the field's own clear button) shows the rows again without Enter */
  document.addEventListener('input', function (e) { if (e.target.type === 'search' && !e.target.value) { var f = barOf(e.target); if (f) applyBar(f); } });
  document.addEventListener('reset', function (e) { var f = barOf(e.target); if (f) setTimeout(function () { resetBar(f); }, 0); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.hx-bar-reset'); if (!b) return;
    var form = $$('form.filters').filter(function (f) { return f.querySelector('.filters__reset') && bodiesFor(f).some(function (t) { return t.contains(b); }); })[0];
    if (form) { form.reset(); var s = form.querySelector('input[type="search"]'); if (s) s.focus(); }
  });
})();
