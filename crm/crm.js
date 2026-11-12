/* TechPower CRM prototype · shared shell, formatters and behaviour.
   Started from 13-combined/console.js: the helpers (esc, icons, who, meter, row menu), the in-frame drawer with its focus
   trap, the segmented and search filters and [data-clone] states are kept as they are there. The admin rail and the
   Harbor sample organisation are replaced by the CRM's own navigation (audit H1/H2) and CRM_DATA (data.js).
   Load order: ../common/content.js (with window.HARBOR_STATIC = true first), data.js, crm.js. A page renders its own
   content from CRM.data, then calls CRM.boot(), which copies [data-clone] states, fills [data-crm-header] and [data-rail],
   runs HARBOR.mount() for [data-icon], and wires the shared behaviours. */
(function () {
  'use strict';
  var H = window.HARBOR, D = window.CRM_DATA;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $$(sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); }
  function pct(a, b) { return b ? Math.round(a / b * 1000) / 10 : 0; }

  /* ---------------- icons the shared set lacks (same 24 grid, 1.5 stroke, square corners, currentColor) ---------------- */
  var CICONS = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 9v12h14V9"/>',
    building: '<rect x="4" y="3" width="16" height="18"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    board: '<rect x="3" y="4" width="5" height="16"/><rect x="10" y="4" width="5" height="11"/><rect x="17" y="4" width="4" height="7"/>',
    megaphone: '<path d="M3 10v4h4l8 5V5L7 10z"/><path d="M19 9a4 4 0 0 1 0 6"/>',
    steps: '<circle cx="5" cy="6" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h3a2 2 0 0 1 2 2v2M14 12h3a2 2 0 0 1 2 2v2"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    task: '<rect x="3" y="3" width="18" height="18"/><path d="M8 12l3 3 5-6"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    plug: '<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>',
    tag: '<path d="M3 12V3h9l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    mail: '<rect x="3" y="5" width="18" height="14"/><path d="M3 7l9 6 9-6"/>',
    pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.9-4M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4"/>',
    signout: '<path d="M10 4H4v16h6"/><path d="M15 8l4 4-4 4M19 12H9"/>'
  };
  function cicon(name, size) {
    var s = size || 16;
    if (!CICONS[name]) return H.icon(name, s);
    return '<svg class="icon icon--' + name + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + CICONS[name] + '</svg>';
  }

  /* ---------------- formats: one app format, set here rather than by the browser's language (audit H4, H5) ----------------
     date:  "Jul 1" in the current year, "Jul 1, 2027" otherwise.  stamp: "Nov 6, 5:10 AM".
     money: "$250,000" in tables.  moneyShort: "$1.3M", "$360k" on cards and figures. */
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function parse(iso) { var p = String(iso).split(/[-T:]/); return new Date(+p[0], p[1] - 1, +p[2], +(p[3] || 0), +(p[4] || 0)); }
  var TODAY = parse(D.today);
  function date(iso) {
    if (!iso) return '';
    var d = parse(iso), s = MONTHS[d.getMonth()] + ' ' + d.getDate();
    return d.getFullYear() === TODAY.getFullYear() ? s : s + ', ' + d.getFullYear();
  }
  function time(d) { var h = d.getHours(), m = d.getMinutes(); return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h < 12 ? 'AM' : 'PM'); }
  function stamp(iso) { return date(iso) + ', ' + time(parse(iso)); }
  /* whole days from today: negative is past (overdue), 0 is today */
  function days(iso) { return Math.round((parse(iso.slice(0, 10)) - TODAY) / 864e5); }
  function day(iso) { var n = days(iso); return n === 0 ? 'Today' : n === -1 ? 'Yesterday' : n === 1 ? 'Tomorrow' : date(iso); }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function moneyShort(n) {
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return '$' + Math.round(n / 1e3) + 'k';
    return '$' + n;
  }
  function count(n) { return n.toLocaleString('en-US'); }

  /* ---------------- lookups ---------------- */
  function index(list) { var m = {}; list.forEach(function (x) { m[x.id] = x; }); return m; }
  var BY = { rep: index(D.reps), account: index(D.accounts), contact: index(D.contacts), opportunity: index(D.opps), stage: index(D.stages) };
  var PAGE = { account: 'accounts.html', contact: 'contacts.html', opportunity: 'opportunities.html' };
  function rep(id) { return BY.rep[id]; }
  function me() { return D.reps.filter(function (r) { return r.you; })[0]; }
  /* a related record as a real link with its own address (audit H3, M4) */
  function recordLink(rel) {
    var x = BY[rel[0]][rel[1]]; if (!x) return '';
    return '<a class="link link--quiet" href="' + PAGE[rel[0]] + '?record=' + x.id + '">' + esc(x.name || x.title) + '</a>';
  }
  /* a file's kind is its extension, as live shows it: a badge before the name, coloured by family (PDF, Word and text,
     Excel, PowerPoint; images, ZIP and the rest grey). There is no document type beyond it. */
  var EXT_TONE = { pdf: 'danger', doc: 'info', docx: 'info', txt: 'info', rtf: 'info', xls: 'ok', xlsx: 'ok', csv: 'ok', ppt: 'warn', pptx: 'warn' };
  function fileExt(name) { var m = /\.([a-z0-9]+)$/i.exec(name); return m ? m[1].toLowerCase() : ''; }
  function fileBadge(name) { var x = fileExt(name); return '<span class="badge badge--' + (EXT_TONE[x] || 'neutral') + ' file-ext" aria-hidden="true">' + esc(x.toUpperCase() || 'FILE') + '</span>'; }
  /* a stage as the CRM labels it today: the long name where there is one. Audit M7 (not decided yet) would show the short
     name, with the long one in a tooltip; switch it here. */
  function stage(id) { var s = BY.stage[id]; return s ? s.full || s.name : ''; }
  function initials(n) { return n.split(' ').map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase(); }

  /* ---------------- navigation: a left sidebar in five groups; the footer-only pages join it (audit H1, H2) ----------------
     The badge on Tasks counts what is due today plus overdue from the last 7 days, never the stale backlog (audit H7). */
  var NAV = [
    ['Sales', [['dashboard', 'Dashboard', 'home'], ['accounts', 'Accounts', 'building'], ['contacts', 'Contacts', 'user'], ['opportunities', 'Opportunities', 'board']]],
    ['Outreach', [['campaigns', 'Campaigns', 'megaphone'], ['sequences', 'Sequences', 'steps'], ['calls', 'Calls & Activity', 'phone'], ['meetings', 'Meetings', 'calendar'], ['tasks', 'Tasks', 'task']]],
    ['Insights', [['biz-dev', 'Biz Dev', 'trend'], ['goals', 'Goals', 'target'], ['reports', 'Reports', 'usage']]],
    ['General', [['documents', 'Documents', 'document'], ['phoneburner', 'PhoneBurner', 'plug']], 'end'],
    ['Tools', [['import', 'Import', 'upload'], ['tags', 'Tags', 'tag']]],
    ['Admin', [['users', 'Users', 'users'], ['territories', 'Territories', 'map'], ['custom-fields', 'Custom Fields', 'sliders'], ['audit-log', 'Audit Log', 'history']], null, 'admin']
  ];
  function taskBadge() { var t = D.totals.tasks; return t.today + t.overdueRecent; }
  /* The rail: the lockup at the top, the collapse toggle as a round handle on the rail's right edge (as Salesforce, Quicken
     and Wix place it), then the work groups,
     which scroll if the frame is too short, then General, Tools and Admin pinned at the bottom. The work groups have plain
     headings (Attio, HubSpot, Pipedrive and Zoho do not fold theirs); only the bottom three fold on their heading, and
     they start folded, so the rail shows 12 items, not 20, and the set-up pages are one click away. The active page's
     group is always open. Collapsed to 64px, it is a column of icons: the 12 work pages, each label kept in the link for
     screen readers and shown as a tooltip, then one More button (⋯) in place of the bottom groups. Its menu opens beside
     the rail and lists their pages under the same headings, so the column stays at 13 icons, not 20. u: whose rail (role decides the Admin group). */
  function rail(active, u) {
    var role = (u || me()).role, groups = NAV.filter(function (g) { return !g[3] || g[3] === role; });
    var end = groups.map(function (g) { return g[2]; }).indexOf('end'), open = storedGroups(), rid = 'rg' + (++railSeq);   /* rails are drawn after the frames are copied, so each needs its own ids */
    function group(g, i) {
      var id = rid + '-' + g[0].toLowerCase(), has = g[1].some(function (n) { return n[0] === active; }), folds = i >= end;
      var shown = !folds || has || (g[0] in open ? open[g[0]] : false);
      return '<div class="rail__group' + (shown ? '' : ' is-folded') + '" data-group="' + g[0] + '">' +
        (folds ? '<button type="button" class="rail__label" data-rail-fold aria-expanded="' + shown + '" aria-controls="' + id + '">' + g[0] + cicon('chevron', 12) + '</button>'
               : '<span class="rail__label">' + g[0] + '</span>') +
        '<div class="rail__items" id="' + id + '" role="group" aria-label="' + g[0] + '">' + g[1].map(function (n) {
          var on = n[0] === active, badge = n[0] === 'tasks' ? taskBadge() : 0;
          return '<a class="rail__item' + (on ? ' is-active' : '') + '" href="' + n[0] + '.html"' + (on ? ' aria-current="page"' : '') +
            ' data-tip="' + esc(n[1]) + (badge ? ' · ' + badge + ' due' : '') + '">' + cicon(n[2], 18) + '<span>' + esc(n[1]) + '</span>' +
            (badge ? '<span class="rail__count num" aria-label="' + badge + ' due">' + badge + '</span>' : '') + '</a>';
        }).join('') + '</div></div>';
    }
    return '<div class="rail__top">' + lockupLink() + '</div>' +
      '<button type="button" class="rail__toggle" data-rail-toggle aria-keyshortcuts="[" aria-label="Collapse sidebar" data-tip="Collapse sidebar · [">' + cicon('chevron', 14) + '</button>' +
      '<div class="rail__scroll">' + groups.slice(0, end).map(group).join('') + '</div>' +
      '<div class="rail__end">' + groups.slice(end).map(function (g, i) { return group(g, end + i); }).join('') +
        '<button type="button" class="rail__item rail__more' + (groups.slice(end).some(function (g) { return g[1].some(function (n) { return n[0] === active; }); }) ? ' is-active' : '') +
        '" data-menu="rail-more" data-key="' + (u || me()).id + '" data-active="' + active + '" aria-haspopup="menu" aria-expanded="false" aria-label="More pages" data-tip="More">' + cicon('more', 18) + '</button></div>';
  }
  /* the collapsed rail's More menu: the bottom groups this user can see, each under its heading */
  function railMoreMenu(btn) {
    var role = (BY.rep[btn.dataset.key] || me()).role, groups = NAV.filter(function (g) { return !g[3] || g[3] === role; });
    return groups.slice(groups.map(function (g) { return g[2]; }).indexOf('end')).map(function (g) {
      return { group: g[0], items: g[1].map(function (n) { return { id: 'nav-' + n[0], label: n[1], icon: n[2], href: n[0] + '.html', current: n[0] === btn.dataset.active }; }) };
    });
  }
  /* which groups the user opened or closed, in this browser */
  var GROUPS_KEY = 'crm.rail.groups', railSeq = 0;
  function storedGroups() { try { return JSON.parse(localStorage.getItem(GROUPS_KEY)) || {}; } catch (e) { return {}; } }
  function foldGroup(btn, save) {
    var g = btn.closest('.rail__group'), open = g.classList.toggle('is-folded') === false;
    btn.setAttribute('aria-expanded', open);
    if (save) { var s = storedGroups(); s[g.dataset.group] = open; try { localStorage.setItem(GROUPS_KEY, JSON.stringify(s)); } catch (e) {} }
  }
  /* while the profile (and so the role) loads: placeholder rows at full height, so the rail doesn't jump from 8 to 12
     items as it does today. Nothing in it is a link yet. */
  function railLoading() {
    var W = [64, 52, 58, 70, 48, 60, 56, 66, 50, 62, 54, 68, 58, 50];
    function rows(n, from) {
      var h = '<span class="skel skel--label"></span>';
      for (var i = 0; i < n; i++) h += '<span class="rail__item rail__item--skel"><span class="skel skel--icon"></span><span class="skel skel--text" style="--w:' + W[(from + i) % W.length] + '%"></span></span>';
      return '<div class="rail__group">' + h + '</div>';
    }
    return '<span class="sr-only" role="status">Loading navigation</span>' +
      '<div class="rail__top">' + lockupLink() + '</div><span class="rail__toggle" aria-hidden="true">' + cicon('chevron', 14) + '</span>' +   /* the brand and the handle are known before the profile is */
      '<div class="rail__scroll" aria-hidden="true">' + rows(4, 0) + rows(5, 4) + rows(3, 9) + '</div>' +
      '<div class="rail__end" aria-hidden="true">' + rows(2, 1) + rows(2, 6) + '</div>';
  }

  /* collapsed or not: one class on the frame. The live frame remembers the choice in this browser and starts collapsed
     below 1280px when no choice is stored */
  var RAIL_KEY = 'crm.rail';
  function setRail(app, collapsed, save) {
    app.classList.toggle('is-rail-collapsed', collapsed);
    $$('[data-rail-toggle]', app).forEach(function (b) {
      var t = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
      b.setAttribute('aria-label', t); b.dataset.tip = t + ' · [';
    });
    hideTip();
    if (save) try { localStorage.setItem(RAIL_KEY, collapsed ? 'collapsed' : 'expanded'); } catch (e) {}
  }
  function storedRail() { try { return localStorage.getItem(RAIL_KEY); } catch (e) { return null; } }

  /* tooltip for the collapsed rail: to the right of the item, after 300ms on hover (at once when moving from item to
     item, or on keyboard focus); Esc hides it. It repeats the link's own text, so it is aria-hidden. */
  var tipEl = null, tipTimer = 0, tipLast = 0;
  function drawTip(item) {
    var app = item.closest('.app'), t = document.createElement('div');
    t.className = 'tip'; t.setAttribute('aria-hidden', 'true'); t.textContent = item.dataset.tip;
    app.appendChild(t);
    var a = app.getBoundingClientRect(), r = item.getBoundingClientRect(), railEl = item.closest('.rail'), rl = railEl && railEl.getBoundingClientRect();
    if (rl && item.matches('.rail__item')) { t.style.left = (rl.right - a.left + 8) + 'px'; t.style.top = (r.top - a.top + r.height / 2) + 'px'; }   /* beside the rail */
    else { t.classList.add('tip--below'); t.style.left = (r.left - a.left + r.width / 2) + 'px'; t.style.top = (r.bottom - a.top + 8) + 'px'; }   /* the edge handle and icon buttons: below, centred */
    return t;
  }
  /* a user's toggle animates the width; drawn states and the remembered choice on load don't */
  function toggleRail(app, save) {
    closeMenu();   /* the More menu belongs to the collapsed rail */
    app.classList.add('is-rail-moving');
    setTimeout(function () { app.classList.remove('is-rail-moving'); }, 200);
    setRail(app, !app.classList.contains('is-rail-collapsed'), save);
  }
  function showTip(item, now) {
    clearTimeout(tipTimer);
    if (item.matches('.rail__item') && !item.closest('.app.is-rail-collapsed')) return;   /* rail links show their label as text while expanded; every other [data-tip] is an icon */
    if (item.getAttribute('aria-expanded') === 'true') return;   /* its menu is open in the tooltip's place */
    var go = function () { hideTip(true); tipEl = drawTip(item); tipEl._item = item; };
    if (now || Date.now() - tipLast < 300) go(); else tipTimer = setTimeout(go, 300);
  }
  function hideTip(keepTime) {
    clearTimeout(tipTimer);
    if (tipEl) { tipEl.remove(); tipEl = null; if (!keepTime) tipLast = Date.now(); }
  }

  /* the lockup lives at the top of the rail (navigation plan, header pass H-B): logotype + CRM when expanded, the
     brandmark alone when collapsed. It links to the Dashboard, as the logo does today. */
  function lockup() {
    return H.lockup().replace(/<span class="lockup__product">[\s\S]*$/, '<span class="lockup__product">CRM</span>') +
      H.brandmark('lockup__mark').replace('role="img" aria-label="TechPower Harbor"', 'aria-hidden="true"');
  }
  function lockupLink() { return '<a class="lockup" href="dashboard.html" aria-label="TechPower CRM, Dashboard">' + lockup() + '</a>'; }

  /* ---------------- header, over the content column only: search with its shortcut shown (audit M9), account menu ---------------- */
  function header(u) {
    u = u || me();
    return '<button type="button" class="hsearch" data-palette aria-keyshortcuts="Meta+K"><span class="hsearch__icon">' + H.icon('search', 16) + '</span>' +
        '<span class="hsearch__text">Search accounts, contacts, opportunities</span><kbd class="kbd">⌘K</kbd></button>' +
      '<div class="app__header-actions">' +
        '<button type="button" class="avatar" data-menu="account" data-key="' + u.id + '" aria-haspopup="menu" aria-expanded="false" aria-label="Account menu, ' + esc(u.name) + '">' + initials(u.name) + '</button>' +
      '</div>';
  }
  /* account menu, as today: name, email and role; Admin (admins only) and PhoneBurner; Sign out. The theme moves here
     from the header, as a two-way switch on one row. */
  function accountMenu(btn) {
    var u = BY.rep[btn.dataset.key] || me(), th = (window.HarborTheme && window.HarborTheme.theme) || document.documentElement.getAttribute('data-theme');
    return [
      { head: '<span class="avatar avatar--md" aria-hidden="true">' + initials(u.name) + '</span><span class="menu__who"><span class="menu__name">' + esc(u.name) + '</span>' +
        '<span class="menu__email">' + esc(u.email + '@' + D.domain) + '</span><span class="badge badge--outline">' + esc(D.roles[u.role]) + '</span></span>' },
      { sep: true },
      u.role === 'admin' ? { id: 'acct-admin', label: 'Admin', icon: 'users', href: 'users.html' } : null,
      { id: 'acct-phoneburner', label: 'PhoneBurner', icon: 'plug', href: 'phoneburner.html' },
      { sep: true },
      { seg: 'Theme', items: [{ id: 'acct-dark', label: 'Dark', checked: th === 'dark' }, { id: 'acct-light', label: 'Light', checked: th !== 'dark' }] },
      { sep: true },
      { id: 'acct-signout', label: 'Sign out', icon: 'signout' }
    ].filter(Boolean);
  }

  /* ---------------- shared cell renderers ---------------- */
  function who(name, sub, title) { return '<span class="who"' + (title ? ' title="' + esc(title) + '"' : '') + '><span class="who__name">' + esc(name) + '</span>' + (sub ? '<span class="who__dept">' + sub + '</span>' : '') + '</span>'; }
  function person(id) { var r = rep(id); return r ? '<span class="item"><span class="avatar avatar--sm" aria-hidden="true">' + initials(r.name) + '</span><span>' + esc(r.name) + '</span></span>' : '<span class="dash">—</span>'; }
  /* a tag's colour: the one the tag keeps (D.tagList), else one picked from its name, so a new tag has a steady colour too */
  function tagColor(name) {
    var t = D.tagList.filter(function (g) { return g.name === name; })[0], h = 0;
    if (t && t.color) return t.color;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
    return D.tagColors[h % D.tagColors.length];
  }
  function tagDot(name, color) { return '<span class="tag-dot tag-dot--' + (color || tagColor(name)) + '" aria-hidden="true"></span>'; }
  /* each item is a tag's name, or { name, color } where the page keeps its own copy of the tags (Tags) */
  function tags(list) { return (list || []).map(function (t) { var n = t.name || t; return '<span class="badge badge--outline badge--tag">' + tagDot(n, t.color) + esc(n) + '</span>'; }).join(' '); }
  /* a list's tag column: the first tag, then "+N" the same size, on one line; the rest show on hover or focus */
  function tagCell(list) {
    if (!(list || []).length) return '<span class="dash">—</span>';
    var rest = list.slice(1);
    return '<span class="tag-cell">' + tags(list.slice(0, 1)) + (rest.length ? '<span class="badge badge--outline tag-cell__more" tabindex="0" data-tip="' + esc(rest.join(', ')) +
      '" aria-label="And ' + rest.length + ' more: ' + esc(rest.join(', ')) + '">+' + rest.length + '</span>' : '') + '</span>';
  }
  /* fill: bar length when it differs from the value read out (a bar scaled to the largest row); defaults to p */
  function meter(p, tone, fill) { return '<span class="meter' + (tone ? ' meter--' + tone : '') + '" role="img" aria-label="' + p + '%"><span class="meter__fill" style="--p:' + Math.min(fill == null ? p : fill, 100) + '"></span></span>'; }
  function meterCell(p, tone, fill) { return '<span class="meter-cell">' + meter(p, tone, fill) + '<span class="meter-cell__pct">' + Math.round(p) + '%</span></span>'; }
  /* open pipeline by stage (Dashboard, Reports): each stage links to the board, where it is a column;
     the figure is the stage's share of open value, the bar is scaled to the largest stage so the stages differ visibly.
     The short stage name keeps every row on one line; the long name, where there is one, is its title (board labels: M7) */
  /* T: totals to draw, the book's own by default (Reports passes them without the opportunity errors) */
  function pipeRows(T) {
    T = T || D.totals;
    var open = D.stages.filter(function (s) { return !s.closed; });
    var max = Math.max.apply(null, open.map(function (s) { return T.byStage[s.id][1]; }));
    return {
      rows: open.map(function (s) {
        var n = T.byStage[s.id];
        return '<tr><td><a class="link link--quiet" href="opportunities.html"' + (s.full ? ' title="' + esc(s.full) + '"' : '') + '>' + esc(s.name) + '</a></td>' +
          '<td class="cell--right num">' + n[0] + '</td><td class="cell--right num">' + moneyShort(n[1]) + '</td>' +
          '<td title="' + moneyShort(n[1]) + ' of ' + moneyShort(T.pipeline) + ' open value">' + meterCell(pct(n[1], T.pipeline), null, pct(n[1], max)) + '</td></tr>';
      }).join(''),
      total: '<tr><th scope="row">Total</th><td class="cell--right num">' + T.openOpps + '</td><td class="cell--right num">' + moneyShort(T.pipeline) + '</td><td></td></tr>'
    };
  }
  function menuBtn(label) { return '<button type="button" class="row-menu" aria-label="' + esc(label) + '" aria-haspopup="menu">' + H.icon('more', 16) + '</button>'; }
  /* a ⋯ row menu for one record: CRM.menus[menu] items, crm:menu carries the row's key */
  function rowMenu(menu, key, label) { return '<button type="button" class="row-menu" data-menu="' + menu + '" data-key="' + key + '" aria-haspopup="menu" aria-label="More actions for ' + esc(label) + '">' + cicon('more', 16) + '</button>'; }
  /* the same CRM.menus[menu] items as buttons in the row, for a short list nobody should have to open a menu to find;
     each fires crm:menu as its menu item would, so the page's handler stays the same.
     An item with disabled: true stays in place, greyed, so the buttons line up row to row; its note says why, and it fires nothing */
  function rowActions(menu, key, label) {
    return '<span class="row-actions">' + CRM.menus[menu].map(function (it) {
      var act = it.disabled ? ' aria-disabled="true" title="' + esc(it.note || '') + '"' : ' data-row-action="' + it.id + '" data-key="' + key + '"';
      return '<button type="button" class="btn btn--ghost btn--sm' + (it.danger ? ' row-actions__danger' : '') + '"' + act + ' aria-label="' + esc(it.label + ' ' + label + (it.disabled && it.note ? '. ' + it.note : '')) + '">' + esc(it.label) + '</button>';
    }).join('') + '</span>';
  }

  /* ---------------- form fields in a drawer: label, control, hint, and an error line shown by validate() ----------------
     o: { req, hint, error, attr }. A required control carries aria-required="true"; its error line explains the fix. */
  function field(id, label, control, o) {
    o = o || {};
    return '<div class="field"' + (o.attr || '') + '><label class="field__label" for="' + id + '">' + label + (o.req ? '<span class="field__req" aria-hidden="true">*</span>' : '') + '</label>' + control +
      (o.hint ? '<span class="field__hint" id="' + id + '-hint">' + o.hint + '</span>' : '') +
      (o.error ? '<p class="field__error" id="' + id + '-err">' + cicon('alert', 14) + '<span>' + o.error + '</span></p>' : '') + '</div>';
  }
  function input(id, value, extra) { return '<input class="input" id="' + id + '" value="' + esc(value || '') + '"' + (extra || '') + '>'; }
  /* a record's tags in a form: the chosen ones as chips with ×, and a list of the existing tags (checkboxes, a search
     at the top, "Create tag" when the search matches none) opened from the field. Picking from the list keeps one
     spelling per tag, so filters and the Tags page don't split. The values are the chips' data-tag.
     The same control picks people (peopleField: Additional owners): a chip per rep, the value is the rep's id, the list
     is the reps the field offers (data-people), and there is nothing to create. */
  function tagChip(name, label, plain) {
    label = label || name;
    return '<span class="filter-btn__chip tagfield__chip" data-tag="' + esc(name) + '">' + (plain ? '' : tagDot(name)) + '<span class="filter-btn__chip-text" title="' + esc(label) + '">' + esc(label) + '</span>' +
      '<button type="button" class="filter-btn__x" data-untag aria-label="Remove ' + esc(label) + '">' + cicon('close', 12) + '</button></span>';
  }
  function chipFor(fieldEl, v) { return fieldEl.dataset.people != null ? tagChip(v, rep(v).name, true) : tagChip(v); }
  function pickField(id, menu, hint, chips, attr) {
    return '<div class="tagfield" data-hint="' + hint + '"' + (attr || '') + '><span class="tagfield__chips">' + chips + '</span>' +
      '<button type="button" class="tagfield__open" id="' + id + '" data-menu="' + menu + '" aria-haspopup="menu" aria-expanded="false">' +
      '<span class="tagfield__hint">' + (chips ? '' : hint) + '</span>' + cicon('chevron', 16) + '</button></div>';
  }
  function tagField(id, chosen) { return pickField(id, 'tagpick', 'Choose tags', (chosen || []).map(function (n) { return tagChip(n); }).join('')); }
  /* offer: the rep ids to list; chosen: the ones picked */
  function peopleField(id, chosen, offer) {
    return pickField(id, 'peoplepick', 'Choose people', (chosen || []).map(function (r) { return tagChip(r, rep(r).name, true); }).join(''), ' data-people="' + offer.join(' ') + '"');
  }
  /* a related record picked by its type, as live's New task and Upload document: Related to (None, Contact, Account,
     Opportunity), then the record, a select that opens the Dropdown with a search box (as Log activity's Contact). With
     no type the record waits, disabled, as live's does; a new type swaps its records and its label (the listener below).
     The values are [data-rel="type"] and [data-rel="rec"]. */
  var REL_TYPES = [['', 'None'], ['contact', 'Contact'], ['account', 'Account'], ['opportunity', 'Opportunity']];
  var REL_SEARCH = { contact: 'Search contacts', account: 'Search accounts', opportunity: 'Search opportunities' };
  function relRecords(ent) {
    if (ent === 'contact') return D.contacts.map(function (c) { return [c.id, c.name + ' · ' + BY.account[c.account].name]; });
    if (ent === 'account') return D.accounts.map(function (a) { return [a.id, a.name]; });
    return D.opps.map(function (o) { return [o.id, o.title + ' · ' + BY.account[o.account].name]; });
  }
  function relOptions(ent, value) {
    return '<option value="" hidden data-placeholder' + (value ? '' : ' selected') + '>' + (ent ? REL_SEARCH[ent] : 'Choose a type first') + '</option>' +
      (ent ? relRecords(ent).map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === value ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') : '');
  }
  function relLabel(ent) { return ent ? REL_TYPES.filter(function (t) { return t[0] === ent; })[0][1] : 'Record'; }
  function relFields(id, ent, rec) {
    ent = ent || '';
    return '<div class="frow">' + field(id + '-ent', 'Related to', select(id + '-ent', REL_TYPES, ent, ' data-rel="type"')) +
      field(id + '-rec', '<span data-rel="label">' + relLabel(ent) + '</span>', '<span class="input-wrap"><select class="select" id="' + id + '-rec" data-rel="rec"' +
        (ent ? ' data-search="' + REL_SEARCH[ent] + '"' : ' disabled') + '>' + relOptions(ent, rec) + '</select>' + cicon('chevron', 16) + '</span>') + '</div>';
  }
  document.addEventListener('change', function (e) {
    var t = e.target; if (!t.matches('[data-rel="type"]')) return;
    var row = t.closest('.frow'), rec = row.querySelector('[data-rel="rec"]');
    rec.innerHTML = relOptions(t.value, ''); rec.disabled = !t.value;
    if (t.value) rec.dataset.search = REL_SEARCH[t.value]; else delete rec.dataset.search;
    row.querySelector('[data-rel="label"]').textContent = relLabel(t.value);
  });
  function tagsOf(fieldEl) { return $$('.tagfield__chip', fieldEl).map(function (c) { return c.dataset.tag; }); }
  function setTag(fieldEl, name, on) {
    var has = tagsOf(fieldEl).indexOf(name) >= 0, chips = fieldEl.querySelector('.tagfield__chips');
    if (on && !has) chips.insertAdjacentHTML('beforeend', chipFor(fieldEl, name));
    if (!on && has) $$('.tagfield__chip', fieldEl).filter(function (c) { return c.dataset.tag === name; })[0].remove();
    fieldEl.querySelector('.tagfield__hint').textContent = tagsOf(fieldEl).length ? '' : fieldEl.dataset.hint;   /* with chips the hint goes: the whole field opens the list */
  }
  /* the list narrows as you type; "Create tag" shows while no tag has exactly that name */
  /* a menu's search box narrows its list as you type. Ticked boxes stay in view, so what is chosen never vanishes behind a
     query. The tag list's box (data-create) offers to create the tag when no name matches exactly; any other list says
     "No matches". Enter picks the first match (keydown, wire) */
  function matches(it, ql) { return it.textContent.trim().toLowerCase().indexOf(ql) >= 0; }
  function searchMenu(inp) {
    var m = inp.closest('.menu'), q = inp.value.trim(), ql = q.toLowerCase(), exact = false, hits = 0;
    $$('[role^="menuitem"]:not(.menu__create)', m).forEach(function (it) {
      var hit = !ql || matches(it, ql), kept = it.getAttribute('role') === 'menuitemcheckbox' && it.getAttribute('aria-checked') === 'true';
      it.hidden = !hit && !kept; if (hit) hits++;
      if (it.textContent.trim().toLowerCase() === ql) exact = true;
    });
    $$('.menu__sep', m).forEach(function (s) { s.hidden = !!ql; });
    if (inp.dataset.create) {
      var cr = m.querySelector('.menu__create');
      if (!cr) { m.insertAdjacentHTML('beforeend', '<button type="button" role="menuitem" class="menu__item menu__create" tabindex="-1">' + cicon('plus', 16) + '<span></span></button>'); cr = m.querySelector('.menu__create'); }
      cr.hidden = !q || exact; cr.dataset.action = 'tagnew:' + q; cr.querySelector('span').textContent = 'Create tag \u201c' + q + '\u201d';
    } else {
      var no = m.querySelector('.menu__empty');
      if (!no) { m.insertAdjacentHTML('beforeend', '<p class="menu__empty" role="status">No matches</p>'); no = m.querySelector('.menu__empty'); }
      no.hidden = !ql || hits > 0;
    }
    if (m._btn) placeMenu(m);
  }
  /* Owner in a record form: only an admin moves a record to another owner, as in the live forms; the admin's own name is
     marked "(you)". Anyone else sees who owns it. ownerId: the record's owner, or none for a new record (the viewer) */
  function ownerField(id, ownerId) {
    var u = me(), o = ownerId ? rep(ownerId) : u;
    if (u.role !== 'admin') return '<div class="field"><span class="field__label">Owner</span><span class="field__value">' + person(o.id) + '</span><span class="field__hint">An admin can change the owner.</span></div>';
    return field(id, 'Owner', '<span class="input-wrap"><select class="select" id="' + id + '" aria-describedby="' + id + '-hint">' +
      D.reps.filter(function (r) { return r.status === 'active' || r.id === o.id; }).map(function (r) {
        return '<option value="' + r.id + '"' + (r.id === o.id ? ' selected' : '') + '>' + esc(r.name) + (r.id === u.id ? ' (you)' : '') + '</option>';
      }).join('') + '</select>' + cicon('chevron', 16) + '</span>', { hint: 'Only admins can change the owner.' });
  }
  /* ---------- Phones and Emails (live Edit contact) and Vendor relationships (live Edit account): one control for all of them. Each
     is the list it holds, then a line to add one: the value, its type, and for phones an extension. Adding a value already
     listed updates it rather than listing it twice; Enter in the value adds it; each row has its own Remove. Phones and
     emails keep exactly one Primary: the first one is primary, ticking Primary on a new one moves it there, and removing
     the primary passes it to the next. The rows are drawn from their items, kept as JSON on each row. ---------- */
  var MULTI = {
    phone: { title: 'Phones', empty: 'No phone yet.', add: 'Add phone', field: 'number', label: 'Phone number', ph: '+1 555 123 4567', attr: ' type="tel" autocomplete="tel"',
      types: D.phoneTypes, primary: true, ext: true,
      check: function (v) { return v.replace(/\D/g, '').length >= 7 ? '' : 'Enter a phone number with at least 7 digits.'; },
      same: function (it) { return it.number.replace(/\D/g, '') + '|' + (it.ext || ''); },
      show: function (it) { return '<span class="num">' + esc(it.number) + '</span>' + (it.ext ? ' <span class="muted">ext.</span> <span class="num">' + esc(it.ext) + '</span>' : ''); } },
    email: { title: 'Emails', empty: 'No email yet.', add: 'Add email', field: 'address', label: 'Email address', ph: 'person@company.com', attr: ' type="email" autocomplete="email"',
      types: D.emailTypes, primary: true,
      check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter an email address, like name@company.com.'; },
      same: function (it) { return it.address.toLowerCase(); }, show: function (it) { return esc(it.address); } },
    vendor: { title: 'Vendor relationships', empty: 'No vendor relationships yet.', add: 'Add', field: 'vendor', label: 'Vendor name', ph: 'Vendor name', attr: ' autocomplete="off"',
      types: D.vendorTypes, known: D.vendors,
      same: function (it) { return it.vendor.toLowerCase(); }, show: function (it) { return esc(it.vendor); } }
  };
  function multiRows(kind, items) {
    var m = MULTI[kind];
    return items.map(function (it) {
      return '<li class="multi__row" data-item="' + esc(JSON.stringify(it)) + '"><span class="multi__value">' + m.show(it) + '</span>' +
        '<span class="multi__type">' + esc(it.type) + '</span>' + (it.primary ? '<span class="badge badge--ok">Primary</span>' : '') +
        '<button type="button" class="btn btn--ghost btn--sm btn--icon" data-multi-remove aria-label="Remove ' + esc(it[m.field]) + '">' + cicon('close', 16) + '</button></li>';
    }).join('');
  }
  function multiGroup(kind, id, items) {
    var m = MULTI[kind];
    return '<fieldset class="fgroup multi" data-multi="' + kind + '"><legend class="fgroup__title">' + m.title + '</legend>' +
      '<ul class="multi__list" aria-label="' + m.title + '"' + (items.length ? '' : ' hidden') + '>' + multiRows(kind, items) + '</ul>' +
      '<p class="multi__empty"' + (items.length ? ' hidden' : '') + '>' + m.empty + '</p>' +
      '<div class="multi__add multi__add--' + kind + '">' +
        '<input class="input multi__val" id="' + id + '" placeholder="' + m.ph + '" aria-label="' + m.label + '" aria-describedby="' + id + '-err"' + m.attr +
          (m.known ? ' list="' + id + '-known"' : '') + ' data-multi-value>' +
        (m.known ? '<datalist id="' + id + '-known">' + m.known.map(function (v) { return '<option value="' + esc(v) + '">'; }).join('') + '</datalist>' : '') +
        (m.ext ? '<input class="input multi__ext" placeholder="ext." aria-label="Extension" inputmode="numeric" data-multi-ext>' : '') +
        '<span class="input-wrap multi__kind"><select class="select" aria-label="' + (kind === 'vendor' ? 'Relationship' : 'Type') + '" data-multi-type>' +
          m.types.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('') + '</select>' + cicon('chevron', 16) + '</span>' +
        (m.primary ? '<label class="check multi__primary"><input type="checkbox" class="checkbox" data-multi-primary' + (items.length ? '' : ' checked') + '> Primary</label>' : '') +
        '<button type="button" class="btn btn--secondary multi__go" data-multi-add>' + m.add + '</button>' +
      '</div>' +
      '<p class="multi__error" id="' + id + '-err" hidden></p></fieldset>';
  }
  function multiItems(g) { return [].map.call(g.querySelectorAll('.multi__row'), function (li) { return JSON.parse(li.dataset.item); }); }
  function multiDraw(g, items) {
    var ul = g.querySelector('.multi__list'), pr = g.querySelector('[data-multi-primary]');
    ul.innerHTML = multiRows(g.dataset.multi, items);
    ul.hidden = !items.length; g.querySelector('.multi__empty').hidden = !!items.length;
    if (pr) pr.checked = !items.length;   /* the first one added is the primary; after that, ticking it is a choice */
  }
  function multiAdd(g) {
    var m = MULTI[g.dataset.multi], val = g.querySelector('[data-multi-value]'), v = val.value.trim(), err = g.querySelector('.multi__error');
    var problem = !v ? 'Enter a ' + m.label.toLowerCase() + ' first.' : m.check ? m.check(v) : '';
    val.setAttribute('aria-invalid', problem ? 'true' : 'false'); err.hidden = !problem; err.textContent = problem;
    if (problem) { val.focus(); return; }
    var items = multiItems(g), it = { type: g.querySelector('[data-multi-type]').value }, ext = g.querySelector('[data-multi-ext]');
    it[m.field] = v; if (ext) it.ext = ext.value.trim();
    if (m.primary) it.primary = !items.length || g.querySelector('[data-multi-primary]').checked;
    var at = items.map(m.same).indexOf(m.same(it));
    if (m.primary && it.primary) items.forEach(function (x) { x.primary = false; });
    if (at >= 0) { if (m.primary && !it.primary) it.primary = items[at].primary; items[at] = it; } else items.push(it);
    if (m.primary && !items.some(function (x) { return x.primary; })) items[0].primary = true;
    multiDraw(g, items);
    val.value = ''; if (ext) ext.value = ''; val.focus();
  }
  /* number field with chevrons in place of the browser's spinner. The chevrons are for the pointer only: the field's
     arrow keys do the same, so they stay out of the tab order and out of the accessibility tree */
  function stepper(inputHtml) {
    function b(dir, name) { return '<button type="button" class="stepper__btn stepper__btn--' + name + '" tabindex="-1" aria-hidden="true" data-stepper="' + dir + '">' + cicon('chevron', 12) + '</button>'; }
    return '<span class="stepper">' + inputHtml + '<span class="stepper__btns">' + b(1, 'up') + b(-1, 'down') + '</span></span>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-stepper]'); if (!b) return;
    var inp = b.closest('.stepper').querySelector('.input');
    if (+b.dataset.stepper > 0) inp.stepUp(); else inp.stepDown();
    inp.focus();
    inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true }));
  });

  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-multi-add]');
    if (add) { multiAdd(add.closest('[data-multi]')); return; }
    var rm = e.target.closest('[data-multi-remove]');
    if (rm) {   /* focus moves to the Remove of the row now in its place, or the value field when none is left, so it isn't lost with the row */
      var g = rm.closest('[data-multi]'), rows = [].slice.call(g.querySelectorAll('.multi__row')), i = rows.indexOf(rm.closest('li')), items = multiItems(g);
      var gone = items.splice(i, 1)[0];
      if (gone.primary && items.length) items[0].primary = true;
      multiDraw(g, items);
      var left = g.querySelectorAll('[data-multi-remove]');
      (left.length ? left[Math.min(i, left.length - 1)] : g.querySelector('[data-multi-value]')).focus();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.closest('.multi__add') && e.target.matches('input')) { e.preventDefault(); multiAdd(e.target.closest('[data-multi]')); }
  });
  /* options: [value, label] pairs, or plain strings used as both */
  function select(id, options, value, extra) {
    return '<span class="input-wrap"><select class="select" id="' + id + '"' + (extra || '') + '>' + options.map(function (o) {
      var v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o;
      return '<option value="' + esc(v) + '"' + (v === value ? ' selected' : '') + '>' + esc(l) + '</option>';
    }).join('') + '</select>' + cicon('chevron', 16) + '</span>';
  }
  /* a select opens the library's Dropdown (.menu, Option Radio: the check on the right, the list closes on the choice), not
     the browser's own list. The <select> stays the field and holds the value, so its label, required check and change
     listeners work as before; only the list is ours. The chosen option has focus when the list opens. */
  function selectItems(sel) {
    /* a disabled option stays in the list, greyed and not choosable, so it's clear why it can't be picked; data-note says why ("Has goals") */
    return $$('option', sel).filter(function (o) { return !o.hidden; }).map(function (o) { return { id: 'opt:' + o.index, label: o.textContent, checked: o.selected, disabled: o.disabled, note: o.dataset.note }; });
  }
  function choose(sel, i) {
    if (sel.selectedIndex === i) return;
    sel.selectedIndex = i;
    sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true }));
  }
  /* required controls left empty get their error line and aria-invalid; focus goes to the first one. Returns true when all are filled */
  function validate(scope, focus) {
    var bad = $$('[aria-required="true"]', scope).filter(function (c) {
      var empty = c.type === 'file' ? !c.files.length && !c.dataset.chosen : !String(c.value).trim();
      var f = c.closest('.field'); if (f) f.classList.toggle('is-invalid', empty);
      c.setAttribute('aria-invalid', empty ? 'true' : 'false');
      return empty;
    });
    if (bad.length && focus) bad[0].focus();
    return !bad.length;
  }

  /* ---------------- toast: the result of an action, with Undo where it can be taken back (audit H6, H7) ---------------- */
  function toast(app, text, undo, opts) {
    var old = app.querySelector('.toast'); if (old) old.remove();
    var el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status');
    el.innerHTML = '<span class="toast__text">' + esc(text) + '</span>' + (undo ? '<button type="button" class="toast__undo">Undo</button>' : '');
    app.appendChild(el);
    /* a state drawn with the toast showing keeps it; a live one leaves after 5 seconds */
    var timer = opts && opts.sticky ? 0 : setTimeout(function () { el.remove(); }, 5000);
    if (undo) el.querySelector('.toast__undo').addEventListener('click', function () { clearTimeout(timer); el.remove(); undo(); });
    return el;
  }

  /* ---------------- row menu: secondary and destructive actions leave the row (audit H6) ----------------
     A button with data-menu="<name>" (the ⋯ row menu, or a toolbar button such as Reschedule) opens the items in
     CRM.menus[name]; choosing one fires crm:menu on the button
     with { action, key }, and the page does the work. Arrow keys move, Esc closes and returns focus to the button. */
  var openMenuEl = null;
  /* a list longer than this gets a search box at its top: a filter's options, a select's Dropdown, the tag list */
  var LONG_LIST = 8;
  function closeMenu(refocus) {
    if (!openMenuEl) return;
    var b = openMenuEl._btn, at = openMenuEl._anchor || b; openMenuEl.remove(); openMenuEl = null;
    b.setAttribute('aria-expanded', 'false'); if (refocus) at.focus();
    b.dispatchEvent(new CustomEvent('crm:menu-close', { bubbles: true, detail: { button: b } }));   /* a page can tidy up after a list closes */
  }
  function openMenu(btn, opts) {
    opts = opts || {};
    closeMenu();
    hideTip();
    var app = btn.closest('.app'), m = document.createElement('div'), isSel = btn.matches('select'), def = isSel ? selectItems(btn) : CRM.menus[btn.dataset.menu] || [];
    m.className = 'menu menu--' + (isSel ? 'select' : btn.dataset.menu); m.setAttribute('role', 'menu');
    m.setAttribute('aria-label', btn.getAttribute('aria-label') || (btn.labels && btn.labels[0] ? btn.labels[0].textContent : ''));
    var items = typeof def === 'function' ? def(btn) : def;
    /* data-search: a record picker, which has a box at any length, in its own words ("Search contact by name…") */
    /* data-search="off": a known short set that runs past the limit (the twelve months) */
    if (isSel && btn.dataset.search !== 'off' && (items.length > LONG_LIST || btn.dataset.search)) items = [{ search: btn.dataset.search || 'Search', top: true }].concat(items);
    m.innerHTML = items.map(menuItem).join('');
    app.appendChild(m);
    m._btn = btn; m._anchor = opts.anchor; btn.setAttribute('aria-expanded', 'true');   /* anchor: where a button's list hangs when the button itself is folded away (a bulk action in the ⋯ menu) */
    placeMenu(m);
    if (m.querySelector('.menu__search--top')) m.style.width = m.offsetWidth + 'px';   /* the list keeps its width as a search narrows it */
    if (opts.focus === false) return m;   /* drawn open in a static state: not tracked, so clicks elsewhere leave it */
    openMenuEl = m; (m.querySelector('.menu__search--top .menu__search-input') || (isSel && m.querySelector('[aria-checked="true"]')) || m.querySelector('[role^="menuitem"]')).focus();
    return m;
  }
  /* under its button: a filter button's list hangs from its left edge, like a select; a ⋯ or account menu from its right edge.
     Called again after a toggle, since a wider value on the button can re-wrap the filter bar under the open list */
  function placeMenu(m) {
    var btn = m._btn, fb = btn.closest('.filter-btn, .tagfield, .input-wrap'), a = btn.closest('.app').getBoundingClientRect(), r = (fb || m._anchor || btn).getBoundingClientRect();
    if (btn.closest('.rail')) {   /* the rail's More menu: beside the rail, growing up from the button's bottom edge */
      m.style.left = (btn.closest('.rail').getBoundingClientRect().right - a.left + 8) + 'px'; m.style.bottom = (a.bottom - r.bottom) + 'px'; return;
    }
    if (fb && fb.matches('.tagfield, .input-wrap')) m.style.minWidth = r.width + 'px';   /* a tag or select list is as wide as its field */
    /* under the button; above it when the frame ends first and there is more room above (a field low in a drawer) */
    var mh = m.offsetHeight, below = a.bottom - r.bottom - 8, above = r.top - a.top - 8;
    m.style.top = (mh > below && above > below ? r.top - a.top - 4 - mh : r.bottom - a.top + 4) + 'px';
    if (fb || btn.closest('.bulkbar--float')) m.style.left = (r.left - a.left) + 'px'; else m.style.right = (a.right - r.right) + 'px';   /* a list's floating bulk bar too: its buttons are mid-list, not at the right edge */
  }
  /* a menu entry: an action (default), a link (href), a choice (checked: true / false, inside a labelled group),
     a toggle (multi: true, checked: true / false; a multi-select filter, choosing keeps the menu open),
     a switch (seg: the label on the left, the choices as one segmented control on the right; choosing keeps the menu open),
     a separator, or a heading block that isn't focusable (the account menu's name and role) */
  var menuSeq = 0;
  function menuItem(it) {
    if (it.sep) return '<div class="menu__sep" role="separator"></div>';
    if (it.search) return '<div class="menu__search' + (it.top ? ' menu__search--top' : '') + '" role="presentation">' + cicon(it.icon || 'search', 16) + '<input type="text" class="menu__search-input" placeholder="' + esc(it.search) + '" aria-label="' + esc(it.search) + '" autocomplete="off"' + (it.create ? ' data-create="tag"' : '') + '></div>';
    if (it.head) return '<div class="menu__head" role="presentation">' + it.head + '</div>';
    if (it.group) {
      var gid = 'mg' + (++menuSeq);
      return '<div role="group" aria-labelledby="' + gid + '"><div class="menu__label" id="' + gid + '">' + esc(it.group) + '</div>' + it.items.map(menuItem).join('') + '</div>';
    }
    if (it.seg) {
      var sid = 'mg' + (++menuSeq);
      return '<div class="menu__row" role="group" aria-labelledby="' + sid + '"><span class="menu__row-label" id="' + sid + '">' + esc(it.seg) + '</span><span class="segmented">' +
        it.items.map(function (s) {
          return '<button type="button" role="menuitemradio" aria-checked="' + s.checked + '" class="segment' + (s.checked ? ' is-active' : '') + '" data-action="' + s.id + '" data-label="' + esc(s.label) + '" tabindex="-1">' + esc(s.label) + '</button>';
        }).join('') + '</span></div>';
    }
    var cls = 'menu__item' + (it.danger ? ' menu__item--danger' : '') + (it.warn ? ' menu__item--warn' : ''), body = (it.icon ? cicon(it.icon, 16) : '') + '<span>' + esc(it.label) + '</span>';
    if (it.href) return '<a role="menuitem" class="' + cls + (it.current ? ' is-current' : '') + '" href="' + it.href + '"' + (it.current ? ' aria-current="page"' : '') + ' data-action="' + it.id + '" tabindex="-1">' + body + '</a>';
    if (it.checked != null) {
      /* a toggle shows a checkbox on the left (drawn by CSS from aria-checked); a choice shows a check mark on the right of the chosen one */
      if (it.multi) return '<button type="button" role="menuitemcheckbox" aria-checked="' + it.checked + '" class="' + cls + '" data-action="' + it.id + '" tabindex="-1"><span class="menu__box" aria-hidden="true"></span>' + (it.dot ? tagDot(it.label) : '') + '<span>' + esc(it.label) + '</span></button>';
      return '<button type="button" role="menuitemradio" aria-checked="' + it.checked + '" class="' + cls + '" data-action="' + it.id + '" tabindex="-1"' + (it.disabled ? ' aria-disabled="true"' : '') + '><span>' + esc(it.label) + '</span>' +
        (it.note ? '<span class="menu__note">' + esc(it.note) + '</span>' : '') + '<span class="menu__check">' + (it.checked ? cicon('check', 16) : '') + '</span></button>';
    }
    return '<button type="button" role="menuitem" class="' + cls + '" data-action="' + it.id + '" tabindex="-1">' + body + '</button>';
  }

  /* ---------------- confirm: Delete asks first and names what goes (audit H6) ----------------
     A modal over the frame: what will be deleted, that it can't be undone, Cancel and the destructive button.
     Focus starts on Cancel, so Enter alone never deletes; Tab stays inside; Esc, Cancel or the scrim close it and return
     focus to the button that opened it. o: { title, body, action, onConfirm }. opts.focus false draws it for a static state. */
  var dlgSeq = 0;
  function confirmDialog(app, o, opts) {
    var from = document.activeElement, id = 'dlg' + (++dlgSeq);
    var scrim = document.createElement('div'); scrim.className = 'dialog-scrim';
    var d = document.createElement('div');
    d.className = 'dialog'; d.setAttribute('role', 'alertdialog'); d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-labelledby', id + '-t'); d.setAttribute('aria-describedby', id + '-b');
    d.innerHTML = '<h2 class="dialog__title" id="' + id + '-t">' + esc(o.title) + '</h2>' +
      '<p class="dialog__body" id="' + id + '-b">' + o.body + '</p>' +
      '<div class="dialog__foot"><button type="button" class="btn btn--secondary" data-dialog-cancel>Cancel</button>' +
      '<button type="button" class="btn btn--danger" data-dialog-ok>' + esc(o.action) + '</button></div>';
    app.appendChild(scrim); app.appendChild(d);
    function close() { scrim.remove(); d.remove(); if (from && from.focus && document.contains(from)) from.focus(); }
    scrim.addEventListener('click', close);
    d.querySelector('[data-dialog-cancel]').addEventListener('click', close);
    d.querySelector('[data-dialog-ok]').addEventListener('click', function () { scrim.remove(); d.remove(); o.onConfirm(); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      if (e.key === 'Tab') { var b = $$('button', d), i = b.indexOf(document.activeElement); e.preventDefault(); b[(i + (e.shiftKey ? -1 : 1) + b.length) % b.length].focus(); }
    });
    if (!(opts && opts.focus === false)) d.querySelector('[data-dialog-cancel]').focus();
    return d;
  }

  /* ---------------- form dialog: a short create / edit form (a few fields) in the confirm dialog's frame ----------------
     A form that fits on one screen is quicker in a modal than in a side sheet: it stays in the middle of the eye line and
     has no empty column below. o: { title, sub, body (the fields' HTML), action, onSubmit(d) }; onSubmit returns false to
     keep it open (a field to fix). Enter submits; Esc, Cancel or the scrim close it and return focus to the opener.
     Tab stays inside: a radio group is one stop (its checked radio), as the browser does. opts.focus false draws it for a
     static state; opts.from is the button to return to. Returns the dialog; d.close() closes it. */
  function formDialog(app, o, opts) {
    opts = opts || {};
    var from = opts.from || document.activeElement, id = 'dlg' + (++dlgSeq);
    var scrim = document.createElement('div'); scrim.className = 'dialog-scrim';
    var d = document.createElement('form');
    d.className = 'dialog dialog--form'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.noValidate = true;
    d.setAttribute('aria-labelledby', id + '-t'); if (o.sub) d.setAttribute('aria-describedby', id + '-b');
    d.innerHTML = '<h2 class="dialog__title" id="' + id + '-t">' + esc(o.title) + '</h2>' +
      (o.sub ? '<p class="dialog__body" id="' + id + '-b">' + o.sub + '</p>' : '') +
      '<div class="dialog__fields">' + o.body + '</div>' +
      '<div class="dialog__foot"><button type="button" class="btn btn--ghost" data-dialog-cancel>Cancel</button>' +
      '<button type="submit" class="btn btn--primary">' + esc(o.action) + '</button></div>';
    app.appendChild(scrim); app.appendChild(d);
    d.close = function (refocus) { scrim.remove(); d.remove(); if (refocus !== false && from && from.focus && document.contains(from)) from.focus(); };
    scrim.addEventListener('click', function () { d.close(); });
    d.querySelector('[data-dialog-cancel]').addEventListener('click', function () { d.close(); });
    d.addEventListener('submit', function (e) { e.preventDefault(); if (o.onSubmit(d) !== false) d.close(false); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); d.close(); }
      if (e.key === 'Tab') {
        var f = $$('input:not([type="radio"]), input[type="radio"]:checked, select, textarea, button:not(:disabled)', d), i = f.indexOf(document.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    if (opts.focus !== false) (d.querySelector('[data-autofocus]') || d.querySelector('input, select, textarea, button')).focus();
    return d;
  }

  /* ---------------- search: today's command palette, opened by the header field or ⌘K on any page ----------------
     As today: one field, at least 2 characters, Esc closes. Results weren't seen in discovery, so assumed: contacts,
     accounts and opportunities (the placeholder's three), grouped by type in that order (audit M9 asks for groups),
     at most 5 per type, the match marked, each a link to the record's URL (audit H3).
     The field is a combobox: ↑ ↓ move through the results, Enter opens one, focus stays in the field. */
  var PAL_MAX = 5, palSeq = 0;
  var PAL_TYPES = [
    ['contact', 'Contacts', 'user', function () { return D.contacts; }, function (c) { return [c.name, c.title + ' · ' + BY.account[c.account].name]; }],
    ['account', 'Accounts', 'building', function () { return D.accounts; }, function (a) { return [a.name, a.vertical + ' · ' + a.city + ', ' + a.state]; }],
    ['opportunity', 'Opportunities', 'board', function () { return D.opps; }, function (o) { return [o.title, BY.account[o.account].name + ' · ' + stage(o.stage) + ' · ' + moneyShort(o.amount)]; }]
  ];
  /* the match, marked wherever it falls in the name or the line under it */
  function mark(text, q) {
    var i = text.toLowerCase().indexOf(q);
    return i < 0 ? esc(text) : esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }
  function searchAll(q) {
    return PAL_TYPES.map(function (t) {
      var hits = t[3]().filter(function (x) { return t[4](x).join(' ').toLowerCase().indexOf(q) >= 0; });
      return { type: t, hits: hits };
    }).filter(function (g) { return g.hits.length; });
  }
  function palette(app, opts) {
    opts = opts || {};
    var from = document.activeElement, id = 'pal' + (++palSeq), active = 0;
    var scrim = document.createElement('div'); scrim.className = 'dialog-scrim';
    var p = document.createElement('div');
    p.className = 'palette'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-modal', 'true'); p.setAttribute('aria-label', 'Search');
    p.innerHTML = '<div class="palette__bar">' + H.icon('search', 18) +
        '<input class="palette__input" type="text" role="combobox" aria-expanded="false" aria-autocomplete="list" aria-controls="' + id + '-list" ' +
          'aria-label="Search contacts, accounts, opportunities" placeholder="Search contacts, accounts, opportunities…" autocomplete="off" spellcheck="false">' +
        '<kbd class="kbd">Esc</kbd></div>' +
      '<div class="palette__body" data-pal-body></div>' +
      '<p class="sr-only" role="status" data-pal-status></p>';
    app.appendChild(scrim); app.appendChild(p);
    var input = p.querySelector('input'), body = p.querySelector('[data-pal-body]'), status = p.querySelector('[data-pal-status]');
    function options() { return $$('[role="option"]', p); }
    function setActive(i) {
      var o = options(); if (!o.length) { input.removeAttribute('aria-activedescendant'); return; }
      active = (i + o.length) % o.length;
      o.forEach(function (x, j) { x.setAttribute('aria-selected', j === active ? 'true' : 'false'); });
      input.setAttribute('aria-activedescendant', o[active].id);
      o[active].scrollIntoView({ block: 'nearest' });
    }
    function draw() {
      var q = input.value.trim().toLowerCase(), n = 0;
      if (q.length < 2) {
        body.innerHTML = '<p class="palette__hint">Type at least 2 characters to search.</p>';
        input.setAttribute('aria-expanded', 'false'); status.textContent = ''; setActive(0); return;
      }
      var groups = searchAll(q);
      if (!groups.length) {
        body.innerHTML = '<p class="palette__hint">Nothing matches “' + esc(input.value.trim()) + '”. Check the spelling, or try part of a name.</p>';
        input.setAttribute('aria-expanded', 'false'); status.textContent = 'No results'; setActive(0); return;
      }
      var more = false;
      body.innerHTML = '<div class="palette__list" id="' + id + '-list" role="listbox" aria-label="Results">' + groups.map(function (g, gi) {
        var t = g.type, shown = g.hits.slice(0, PAL_MAX); if (shown.length < g.hits.length) more = true;
        return '<div class="palette__group" role="group" aria-labelledby="' + id + '-g' + gi + '">' +
          '<div class="palette__label" id="' + id + '-g' + gi + '"><span>' + t[1] + '</span><span class="num">' + (shown.length < g.hits.length ? shown.length + ' of ' + g.hits.length : g.hits.length) + '</span></div>' +
          shown.map(function (x) {
            var f = t[4](x);
            return '<a class="palette__item" role="option" id="' + id + '-o' + (n++) + '" aria-selected="false" tabindex="-1" href="' + PAGE[t[0]] + '?record=' + x.id + '">' +
              '<span class="palette__icon">' + cicon(t[2], 16) + '</span><span class="palette__text"><span class="palette__name">' + mark(f[0], q) + '</span>' +
              '<span class="palette__meta">' + mark(f[1], q) + '</span></span></a>';
          }).join('') + '</div>';
      }).join('') + '</div>' + (more ? '<p class="palette__foot">Keep typing to narrow the results.</p>' : '');
      input.setAttribute('aria-expanded', 'true');
      status.textContent = n + (n === 1 ? ' result' : ' results');
      setActive(opts.active || 0); opts.active = 0;
    }
    function close() { scrim.remove(); p.remove(); if (from && from.focus && document.contains(from)) from.focus(); }
    input.addEventListener('input', function () { draw(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setActive(active + (e.key === 'ArrowDown' ? 1 : -1)); }
      else if (e.key === 'Enter') { var o = options()[active]; if (o) { e.preventDefault(); location.href = o.href; } }
      else if (e.key === 'Tab') e.preventDefault();   /* the field is the only stop; results are reached with the arrows */
    });
    p.addEventListener('mousemove', function (e) { var o = e.target.closest('[role="option"]'); if (o) setActive(options().indexOf(o)); });
    scrim.addEventListener('click', close);
    input.value = opts.query || '';
    draw();
    if (opts.focus !== false) input.focus();
    return p;
  }

  /* ---------------- record addresses: each open record has a URL (audit H3) ----------------
     Only the frame marked data-url (the live state) syncs. Opening a record adds a history entry, so Back closes it;
     Prev / Next replace that entry, so Back doesn't step through every record seen; a shared ?record= link opens it. */
  function recordParam() { return new URLSearchParams(location.search).get('record'); }
  function setRecordUrl(key, mode) {
    var u = new URL(location.href), pushed = mode === 'push' || !!(history.state && history.state.crmPushed);
    if (key) u.searchParams.set('record', key); else u.searchParams.delete('record');
    history[mode === 'push' ? 'pushState' : 'replaceState']({ crmRecord: key || null, crmPushed: key ? pushed : false }, '', u);
  }
  function syncs(sheet) { return sheet.hasAttribute('data-record') && !!sheet.closest('.app[data-url]'); }
  /* a record opens from a table row or a board card: any [data-open] element with data-key */
  var REC = '[data-open]';
  /* the same record can show in two views (board and list); use the one on screen */
  function findRecord(app, key) {
    var all = $$(REC + '[data-key="' + key + '"]', app);
    return all.filter(function (x) { return x.getClientRects().length; })[0] || all[0] || null;
  }
  /* Prev / Next reflect where the record sits among the rows still shown */
  function siblings(tr) { return $$(REC, tr.parentNode).filter(function (r) { return !r.hidden; }); }
  function syncSteps(sheet, tr) {
    var rows = siblings(tr), i = rows.indexOf(tr);
    $$('[data-step]', sheet).forEach(function (b) { var j = i + +b.dataset.step; b.disabled = j < 0 || j >= rows.length; });
  }

  /* ---------------- behaviours (from 13's console.js) ---------------- */
  var openSheet = null, opener = null;
  function sheetParts(sheet) { var app = sheet.closest('.app'); return { app: app, scrim: app.querySelector('.sheet-scrim') }; }
  /* the drawer's identity (title, sub line, tags) is written as a <header> at the top of the body and lifted into the bar */
  function liftHead(sheet) {
    var bar = sheet.querySelector('.sheet__bar'), head = sheet.querySelector('.sheet__scroll > header');
    if (!bar || !head) return;
    bar.replaceChild(head, bar.firstElementChild);
    var sub = head.querySelector('.sheet__sub'); if (sub) sub.title = sub.textContent;
  }
  function showSheet(sheet, opts) {
    opts = opts || {};
    $$('.sheet', sheet.closest('.app')).forEach(function (s) { if (s !== sheet) s.hidden = true; });
    var p = sheetParts(sheet);
    if (opts.fill) opts.fill(sheet);
    liftHead(sheet);
    sheet.hidden = false; if (p.scrim) p.scrim.hidden = false;
    if (opts.focus !== false) {
      opener = opts.from || document.activeElement; openSheet = sheet;
      var f = sheet.querySelector('[data-autofocus]') || sheet.querySelector('.sheet__close');
      if (f) f.focus();
    }
  }
  function hideSheet(sheet) {
    var p = sheetParts(sheet);
    sheet.hidden = true; if (p.scrim) p.scrim.hidden = true;
    $$(REC + '.is-selected', p.app).forEach(function (tr) { tr.classList.remove('is-selected'); });
    if (openSheet === sheet) { openSheet = null; if (opener && opener.focus) opener.focus(); }
  }

  function emptyRow(tbody, show, text) {
    var old = tbody.querySelector('.is-empty-row'); if (old) old.remove();
    if (!show) return;
    var cols = tbody.closest('table').querySelectorAll('thead th').length;
    var tr = document.createElement('tr'); tr.className = 'is-empty-row';
    tr.innerHTML = '<td colspan="' + cols + '" class="cell--muted">' + text + '</td>';
    tbody.appendChild(tr);
  }
  /* ---------------- bulk selection (audit M6) ----------------
     A list with a [data-bulkbar] as its last child: ticking rows floats the bar at the foot of the list, as live, over the
     rows and pinned to the bottom of the window while the list scrolls (crm.css .bulkbar--float); the filters stay. The page gives the bar its actions and reads the ticked rows with CRM.picked(app).
     A row that leaves the list (filtered out, archived) loses its tick, so an action never reaches a row out of sight. */
  function pickBox(tr) { return tr.querySelector('.col-check .checkbox'); }
  function picked(app) { return $$('tbody tr[data-key]', app).filter(function (tr) { return !tr.hidden && pickBox(tr) && pickBox(tr).checked; }); }
  function syncPicked(app) {
    var bar = app.querySelector('[data-bulkbar]'); if (!bar) return;
    var boxes = $$('tbody tr[data-key]', app).filter(function (tr) { if (tr.hidden && pickBox(tr)) pickBox(tr).checked = false; return !tr.hidden && pickBox(tr); }).map(pickBox);
    var n = boxes.filter(function (b) { return b.checked; }).length, all = app.querySelector('thead .col-check .checkbox');
    all.checked = !!boxes.length && n === boxes.length; all.indeterminate = n > 0 && n < boxes.length;
    bar.hidden = !n; bar.parentNode.classList.toggle('has-picked', n > 0);
    bar.querySelector('[data-selection]').innerHTML = n ? '<strong>' + n + ' selected</strong>' : '';
    /* a page whose action label counts the ticked rows (Contacts' Call N contacts) redraws it on this */
    bar.dispatchEvent(new CustomEvent('crm:picked', { bubbles: true, detail: { rows: picked(app) } }));
    if (n) fitBar(bar);
  }
  /* the bar stays one row: when the list is narrower than the bar, its actions fold, last first, into a ⋯ menu before
     Clear, so Archive goes first and the lead action (btn--primary), the count and Clear never fold. The menu lists the
     folded actions in the bar's order; one with its own list (Assign owner) opens that list from the ⋯ button. */
  var BAR_GUTTER = 16;   /* the bar keeps this much of the list showing at each side */
  function barActions(bar) { return $$('.btn--ghost:not(.bulkbar__clear):not(.bulkbar__more)', bar); }
  function fitBar(bar) {
    var more = bar.querySelector('.bulkbar__more');
    if (!more) {
      $$('.bulkbar__sep', bar).pop().insertAdjacentHTML('beforebegin', '<button type="button" class="btn btn--ghost btn--sm btn--icon bulkbar__more" data-menu="bulk-more" aria-haspopup="menu" aria-expanded="false" aria-label="More actions" data-tip="More" hidden>' + cicon('more', 16) + '</button>');
      more = bar.querySelector('.bulkbar__more');
      new ResizeObserver(function () { if (!bar.hidden) fitBar(bar); }).observe(bar.parentNode);
    }
    var acts = barActions(bar), room = bar.parentNode.clientWidth - 2 * BAR_GUTTER;
    acts.forEach(function (b) { b.hidden = false; }); more.hidden = true;
    if (bar.offsetWidth <= room) return;
    more.hidden = false;
    for (var i = acts.length - 1; i >= 0 && bar.offsetWidth > room; i--) acts[i].hidden = true;
  }
  function bulkMoreMenu(btn) {
    var items = [];
    barActions(btn.closest('[data-bulkbar]')).forEach(function (b, i) {
      if (!b.hidden) return;
      var danger = b.classList.contains('bulkbar__danger');
      if (danger && items.length) items.push({ sep: true });
      var ic = b.querySelector('[data-cicon], [data-icon]');
      items.push({ id: 'bulkmore:' + i, label: b.textContent.trim(), icon: ic && (ic.dataset.cicon || ic.dataset.icon), danger: danger });
    });
    return items;
  }
  document.addEventListener('crm:menu', function (e) {
    if (e.detail.action.indexOf('bulkmore:') !== 0) return;
    var more = e.detail.button, b = barActions(more.closest('[data-bulkbar]'))[+e.detail.action.slice(9)];
    if (b.dataset.menu) openMenu(b, { anchor: more }); else b.click();
  });
  function clearPicked(app) { $$('.col-check .checkbox', app).forEach(function (b) { b.checked = false; }); syncPicked(app); }
  /* a bulk action on the ticked rows: change(tr) makes the edit and returns how to take it back (nothing when the row
     already had it), redraw(tr) repaints the row's cells, text(n) is the toast, which offers Undo */
  function bulk(app, text, change, redraw, opts) {
    var scope = app.closest('.state'), rows = picked(app), undo = [];
    rows.forEach(function (tr) { var u = change(tr); if (u) undo.push(u); if (redraw) redraw(tr); });
    clearPicked(app); filterRows(scope);
    toast(app, text(rows.length), function () { undo.forEach(function (u) { u(); }); if (redraw) rows.forEach(redraw); filterRows(scope); }, opts);
  }

  /* rows match the segmented value (data-seg on the row, space separated), the search text, and the page's own
     filter buttons when it set scope._rowTest(tr) (with scope._clearFilters() to reset them) */
  function filterRows(scope) {
    var tbody = scope.querySelector('tbody[data-filterable]'); if (!tbody) return;
    var seg = scope.querySelector('.segmented[data-seg-filter] .segment.is-active');
    var v = seg ? seg.dataset.value : 'all';
    var q = ((scope.querySelector('input[data-search]') || {}).value || '').trim().toLowerCase();
    var shown = 0;
    $$('tr[data-seg]', tbody).forEach(function (tr) {
      var ok = !tr.classList.contains('is-archived') && (v === 'all' || (' ' + tr.dataset.seg + ' ').indexOf(' ' + v + ' ') >= 0) && (!q || tr.textContent.toLowerCase().indexOf(q) >= 0) &&
        (!scope._rowTest || scope._rowTest(tr));
      tr.hidden = !ok;
      if (ok) shown++;
    });
    var what = scope.querySelector('input[data-search]') ? (scope._rowTest ? 'search and filters' : 'search') : 'filters';   /* Documents has filters, no search */
    emptyRow(tbody, !shown, 'Nothing matches. <button type="button" class="link-btn" data-clear-filters>Clear the ' + what + '</button>');
    var n = scope.querySelector('[data-shown]'); if (n) n.textContent = shown;
    document.dispatchEvent(new CustomEvent('crm:filtered', { detail: { scope: scope, value: v, query: q, shown: shown } }));
    $$('.app', scope).forEach(syncPicked);
  }

  /* ---------------- filter bar (navigation plan, filter bar F2) ----------------
     filterBar(app, name, { record, filters }) draws the fields into the bar's [data-render="filter-btns"] and wires them.
     filters: { key: { label, multi, opts: [[id, label]], def, noAny, toggles, search, test(record, value, all), sort: { optId: compare } } }.
     search: the placeholder of a search box at the top of the list, for a list of records (companies, accounts) that runs to
     thousands live; any list past LONG_LIST options gets one too.
     A toggles field (toggles: true) is a "Show" menu of on/off switches, as live's checkboxes: its test runs even with
     nothing on (what is off stays hidden) and gets every field's value as a third argument; the button shows how many are
     on. A toggles field and a sort field sit apart at the bar's end: they set what the list shows and its order, the
     fields before them narrow it. A menu option with warn: true shows in the warning colour.
     Every field is always in the bar, on the fields' row under the search: there is no "+ Filter".
     A multi-select field is a checkbox list that stays open (a record matches any of the values); a single-select is a
     radio list that closes on the choice; def is a single-select's starting value, noAny a single-select with no "Any"
     (a sort). A single-select shows its value as text in the button; a multi-select shows its first value as a chip,
     the rest as +N with their names in a tooltip. Each drawn frame
     keeps its own choices on its section (scope._f); filterRows reads scope._rowTest, the empty row's link calls
     scope._clearFilters, and "Clear all" shows with two or more fields active. */
  var BARS = {}, barsWired = false;
  function filterBar(app, name, cfg) {
    BARS[name] = cfg;
    var keys = Object.keys(cfg.filters);
    function fieldHtml(k) {
      var f = cfg.filters[k];
      return '<div class="filter-btn filter-btn--field" data-filter="' + k + '" data-bar="' + name + '">' +
        '<button type="button" class="filter-btn__open" data-menu="' + name + '-' + k + '" aria-haspopup="menu" aria-expanded="false" aria-label="' + esc(f.label) + '"><span class="filter-btn__label">' + esc(f.label) + '</span><span class="filter-btn__value">' + (f.toggles ? '' : 'Any') + '</span>' + H.icon('chevron', 16) + '</button>' +
        '<span class="filter-btn__chips"></span>' +
        '<button type="button" class="filter-btn__clear" data-unpick="' + k + ':any" aria-label="Clear ' + esc(f.label) + '" hidden>' + H.icon('close', 14) + '</button></div>';
    }
    function atEnd(k) { return cfg.filters[k].sort || cfg.filters[k].toggles; }
    var narrow = keys.filter(function (k) { return !atEnd(k); }), order = keys.filter(atEnd);
    $$('[data-render="filter-btns"]', app).forEach(function (el) {
      /* two rows (crm.css): the search and the end group (Show, Sort) on top, the filter fields on a full-width row below */
      el.innerHTML = '<span class="filters__fields">' + narrow.map(fieldHtml).join('') +
        '<button type="button" class="link-btn filters__clear-all" data-clear-all hidden>Clear all</button></span>' +
        (order.length ? '<span class="filters__end">' + order.map(fieldHtml).join('') + '</span>' : '');
    });
    keys.forEach(function (k) {
      var f = cfg.filters[k];
      /* a long list, or one of records (search: its placeholder), opens with a search box; ticked values come first */
      var long = !f.toggles && (f.search || f.opts.length > LONG_LIST), srch = long ? [{ search: f.search || 'Search', top: true }] : [];
      CRM.menus[name + '-' + k] = function (btn) {
        var v = barState(btn.closest('.state'))[k];
        if (f.multi || f.toggles) {
          var opts = long ? f.opts.filter(function (o) { return v.indexOf(o[0]) >= 0; }).concat(f.opts.filter(function (o) { return v.indexOf(o[0]) < 0; })) : f.opts;
          return srch.concat(opts.map(function (o) { return { id: k + ':' + o[0], label: o[1], multi: true, checked: v.indexOf(o[0]) >= 0, warn: o[2] === 'warn' }; }))
            .concat(v.length && !f.toggles ? [{ sep: true }, { id: k + ':any', label: 'Clear' }] : []);
        }
        return srch.concat(f.noAny ? [] : [{ id: k + ':any', label: 'Any', checked: v === 'any' }]).concat(f.opts.map(function (o) { return { id: k + ':' + o[0], label: o[1], checked: v === o[0] }; }));
      };
    });
    if (!barsWired) { barsWired = true; wireBars(); }
  }
  function barCfg(scope) { var el = scope.querySelector('[data-bar]'); return el && BARS[el.dataset.bar]; }
  function barState(scope) {
    var cfg = barCfg(scope), keys = Object.keys(cfg.filters);
    if (!scope._f) {
      scope._f = {}; keys.forEach(function (k) { var f = cfg.filters[k]; scope._f[k] = f.multi || f.toggles ? [] : (f.def || 'any'); });
      scope._rowTest = function (tr) {
        var r = cfg.record(tr.dataset.key);
        return keys.every(function (k) { var f = cfg.filters[k], v = scope._f[k]; return !f.test || (!f.toggles && (f.multi ? !v.length : v === 'any')) || f.test(r, v, scope._f); });
      };
      scope._clearFilters = function () { scope._f = null; barState(scope); drawBar(scope); };
    }
    return scope._f;
  }
  function chosenOf(scope, k) { var f = barCfg(scope).filters[k], v = barState(scope)[k]; return f.opts.filter(function (o) { return f.multi || f.toggles ? v.indexOf(o[0]) >= 0 : v === o[0]; }); }
  /* the field shows what is chosen as chips; "Any" and the chevron while nothing is chosen. Only the chips re-render:
     the opener stays, so an open list keeps its button. A sort field reorders the rows. */
  function drawBar(scope) {
    var cfg = barCfg(scope); if (!cfg) return;
    var keys = Object.keys(cfg.filters), active = 0, st = barState(scope);
    keys.forEach(function (k) {
      var f = cfg.filters[k], fld = scope.querySelector('[data-filter="' + k + '"]'), chosen = chosenOf(scope, k);
      if (chosen.length && !f.noAny && !f.toggles) active++;
      if (f.toggles) {   /* "Show": the count of switches on, no chips */
        fld.querySelector('.filter-btn__value').textContent = chosen.length ? String(chosen.length) : '';
        fld.querySelector('.filter-btn__open').setAttribute('aria-label', f.label + (chosen.length ? ', ' + chosen.length + ' on' : ''));
        fld.querySelector('.filter-btn__clear').hidden = true;
        return;
      }
      if (!f.multi) {   /* a single-select: label + value text in the button, like "Outcome Open", no chip; "Any" in its list resets it */
        fld.querySelector('.filter-btn__value').textContent = chosen.length ? chosen[0][1] : (f.noAny ? '' : 'Any');
        fld.classList.remove('is-on');
        fld.querySelector('.filter-btn__chips').innerHTML = '';
        fld.querySelector('.filter-btn__clear').hidden = true;
        return sortRows();
      }
      fld.classList.toggle('is-on', chosen.length > 0);   /* is-on hides "Any" and the chevron */
      var rest = chosen.slice(1).map(function (o) { return o[1]; });
      fld.querySelector('.filter-btn__chips').innerHTML = chosen.slice(0, 1).map(function (o) {
        return '<span class="filter-btn__chip"><span class="filter-btn__chip-text" title="' + esc(o[1]) + '">' + esc(o[1]) + '</span>' +
          '<button type="button" class="filter-btn__x" data-unpick="' + k + ':' + esc(o[0]) + '" aria-label="Remove ' + esc(o[1]) + '">' + H.icon('close', 12) + '</button></span>';
      }).join('') + (rest.length ? '<span class="filter-btn__chip filter-btn__chip--more" tabindex="0" data-tip="' + esc(rest.join(', ')) + '" aria-label="And ' + rest.length + ' more: ' + esc(rest.join(', ')) + '">+' + rest.length + '</span>' : '');
      fld.querySelector('.filter-btn__clear').hidden = !(f.multi && chosen.length > 1);
      sortRows();
      function sortRows() {
        if (!f.sort || !f.sort[st[k]]) return;
        var tbody = scope.querySelector('tbody[data-filterable]'), cmp = f.sort[st[k]];
        if (tbody) $$('tr[data-seg]', tbody).sort(function (a, b) { return cmp(cfg.record(a.dataset.key), cfg.record(b.dataset.key)); }).forEach(function (tr) { tbody.appendChild(tr); });
      }
    });
    scope.querySelector('[data-clear-all]').hidden = active < 2;
  }
  function unpick(scope, k, val) {
    var f = barCfg(scope).filters[k], st = barState(scope);
    st[k] = f.multi ? (val === 'any' ? [] : st[k].filter(function (x) { return x !== val; })) : 'any';
    drawBar(scope); filterRows(scope);
  }
  function wireBars() {
    document.addEventListener('click', function (e) {
      var ca = e.target.closest('[data-clear-all]');
      if (ca) { var cs = ca.closest('.state'); cs._clearFilters(); filterRows(cs); cs.querySelector('[data-filter] .filter-btn__open').focus(); return; }
      var x = e.target.closest('[data-unpick]'); if (!x) return;
      var p = x.dataset.unpick.split(':'), k = p.shift(), scope = x.closest('.state');
      unpick(scope, k, p.join(':'));
      scope.querySelector('[data-filter="' + k + '"] .filter-btn__open').focus();
    });
    document.addEventListener('crm:menu', function (e) {
      var scope = e.target.closest('.state'), cfg = scope && barCfg(scope); if (!cfg) return;
      var p = e.detail.action.split(':'), k = p.shift(), val = p.join(':');
      if (!(k in cfg.filters)) return;
      var f = cfg.filters[k], st = barState(scope);
      if (!f.multi && !f.toggles) st[k] = val;
      else if (val === 'any') st[k] = [];
      else if (e.detail.checked) st[k].push(val);
      else st[k] = st[k].filter(function (x) { return x !== val; });
      drawBar(scope); filterRows(scope);
    });
  }
  /* a drawn state with filters chosen (data-filters="vertical:Education,Government state:TX") and one list open (data-show-filter) */
  function drawBarState(app) {
    var scope = app.closest('.state'), cfg = barCfg(scope), st = barState(scope);
    app.dataset.filters.split(' ').forEach(function (pair) { var p = pair.split(':'); st[p[0]] = cfg.filters[p[0]].multi || cfg.filters[p[0]].toggles ? p[1].split(',') : p[1]; });
    drawBar(scope); filterRows(scope);
  }

  /* mode: 'push' (default) adds a history entry, 'replace' swaps it (Prev / Next), 'none' follows the URL (Back, a shared link) */
  function openRow(tr, mode, opts) {
    var app = tr.closest('.app'), sheet = app.querySelector('#' + tr.dataset.open);
    if (!sheet) return;
    $$(REC + '.is-selected', app).forEach(function (x) { x.classList.remove('is-selected'); });
    tr.classList.add('is-selected');
    var key = tr.dataset.open.replace(/-s\d+$/, '');
    /* focus returns to the row, or to a card's name link (the card itself is not a tab stop) */
    var from = tr.tabIndex >= 0 ? tr : tr.querySelector('a[data-record-link]') || tr;
    showSheet(sheet, { from: from, focus: !(opts && opts.focus === false), fill: CRM.fill[key] && function (s) { CRM.fill[key](s, tr.dataset.key, tr); } });
    syncSteps(sheet, tr);
    if (syncs(sheet) && mode !== 'none' && recordParam() !== tr.dataset.key) setRecordUrl(tr.dataset.key, mode === 'replace' ? 'replace' : 'push');
  }
  /* closing by ✕, Esc or the scrim: a record opened in this tab goes Back (popstate hides it); one opened from a link
     drops ?record= in place. A form opened over a record returns to that record. */
  function closeSheet(sheet) {
    var app = sheet.closest('.app');
    if (syncs(sheet) && recordParam()) {
      if (history.state && history.state.crmPushed) { history.back(); return; }
      setRecordUrl(null, 'replace');
    }
    hideSheet(sheet);
    if (!sheet.hasAttribute('data-record') && app.hasAttribute('data-url') && recordParam()) {
      var tr = findRecord(app, recordParam()); if (tr) openRow(tr, 'none');
    }
  }

  function wire() {
    document.addEventListener('click', function (e) {
      var t = e.target;
      var ra = t.closest('[data-row-action]');
      if (ra) { ra.dispatchEvent(new CustomEvent('crm:menu', { bubbles: true, detail: { action: ra.dataset.rowAction, key: ra.dataset.key, button: ra } })); return; }
      /* menus: an item does its action; a click anywhere else closes the open menu */
      /* a switch inside a menu (the theme): the choice applies and the menu stays open */
      var ms = t.closest('.menu .segment');
      if (ms) {
        var sb = ms.closest('.menu')._btn;
        sb.dispatchEvent(new CustomEvent('crm:menu', { bubbles: true, detail: { action: ms.dataset.action, key: sb.dataset.key, button: sb } }));
        return;
      }
      var mi = t.closest('.menu__item');
      if (mi) {
        var m = mi.closest('.menu'), b = m._btn;
        if (mi.getAttribute('aria-disabled') === 'true') return;   /* a disabled option: seen, not chosen */
        /* a toggle (multi-select filter): the check flips in place and the menu stays open for the next one */
        if (mi.getAttribute('role') === 'menuitemcheckbox') {
          var on = mi.getAttribute('aria-checked') !== 'true';
          mi.setAttribute('aria-checked', on ? 'true' : 'false');
          b.dispatchEvent(new CustomEvent('crm:menu', { bubbles: true, detail: { action: mi.dataset.action, checked: on, key: b.dataset.key, button: b } }));
          placeMenu(m);
          return;
        }
        if (m === openMenuEl) closeMenu(true); else m.remove();
        if (b.matches('select')) { choose(b, +mi.dataset.action.slice(4)); return; }   /* a select's option: the field takes the value */
        b.dispatchEvent(new CustomEvent('crm:menu', { bubbles: true, detail: { action: mi.dataset.action, key: b.dataset.key, button: b } }));
        return;
      }
      if (t.closest('.menu')) return;   /* the search box or the padding of an open list: keep it open */
      var ut = t.closest('[data-untag]');
      if (ut) {
        var utf = ut.closest('.tagfield'), utn = ut.closest('.tagfield__chip').dataset.tag;
        closeMenu(); setTag(utf, utn, false); utf.querySelector('.tagfield__open').focus(); return;
      }
      var tfe = t.closest('.tagfield');
      if (tfe && !t.closest('button')) { var tfb = tfe.querySelector('.tagfield__open'); if (openMenuEl && openMenuEl._btn === tfb) closeMenu(true); else openMenu(tfb); return; }
      var ps = t.closest('[data-palette]');
      if (ps) { palette(ps.closest('.app')); return; }
      var rt = t.closest('[data-rail-toggle]');
      if (rt) { closeMenu(); var ra = rt.closest('.app'); toggleRail(ra, ra.id === 'app-1'); return; }
      var rf = t.closest('[data-rail-fold]');
      if (rf) { closeMenu(); foldGroup(rf, rf.closest('.app').id === 'app-1'); return; }
      var sl = t.closest('select.select');
      if (sl) { if (!sl.disabled) { if (openMenuEl && openMenuEl._btn === sl) closeMenu(true); else openMenu(sl); } return; }
      var mb = t.closest('[data-menu]');
      if (mb) { if (openMenuEl && openMenuEl._btn === mb) closeMenu(true); else openMenu(mb); return; }
      closeMenu();
      /* a record name is a real link: a plain click opens the drawer here, ⌘ / Ctrl / Shift-click keeps the browser's behaviour */
      var ln = t.closest('a[data-record-link]');
      if (ln && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) && e.button === 0) {
        var lr = ln.closest(REC); if (lr) { e.preventDefault(); openRow(lr); return; }
      }
      /* Prev / Next in a record drawer */
      var st = t.closest('[data-step]');
      if (st) {
        var cur = st.closest('.app').querySelector(REC + '.is-selected'); if (!cur) return;
        var rows = siblings(cur), nx = rows[rows.indexOf(cur) + +st.dataset.step];
        if (nx) { openRow(nx, 'replace'); if (!st.disabled) st.focus(); }
        return;
      }
      /* tabs inside a drawer or page: one panel shows */
      var tb = t.closest('.tab[role="tab"]');
      if (tb) { selectTab(tb); return; }
      var sw = t.closest('.switch');
      if (sw && !sw.disabled) { sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); sw.dispatchEvent(new CustomEvent('crm:switch', { bubbles: true })); return; }
      var sg = t.closest('.segmented .segment');
      if (sg && !sg.matches('a') && sg.getAttribute('aria-disabled') !== 'true') {   /* a disabled view (Map) keeps its tooltip, so it is not a disabled button */
        var group = sg.closest('.segmented');
        $$('.segment', group).forEach(function (b) { var on = b === sg; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        if (group.hasAttribute('data-seg-filter')) filterRows(group.closest('.state'));
        group.dispatchEvent(new CustomEvent('crm:segment', { bubbles: true, detail: { value: sg.dataset.value } }));
        return;
      }
      var bc = t.closest('[data-bulk-clear]');
      if (bc) { var ba = bc.closest('.app'); clearPicked(ba); ba.querySelector('thead .col-check .checkbox').focus(); return; }
      var clr = t.closest('[data-clear-filters]');
      if (clr) {
        var sc = clr.closest('.state'), s = sc.querySelector('input[data-search]'), fo = sc.querySelector('[data-filter] .filter-btn__open');
        if (s) s.value = '';
        if (sc._clearFilters) sc._clearFilters(); filterRows(sc);
        if (s || fo) (s || fo).focus();   /* the link goes with the empty row: focus lands on the search, or on the first filter where there is none */
        return;
      }
      var cl = t.closest('[data-sheet-close]') || (t.classList.contains('sheet-scrim') ? t : null);
      if (cl) { var sh = cl.closest('.sheet') || cl.closest('.app').querySelector('.sheet:not([hidden])'); if (sh) closeSheet(sh); return; }
      var op = t.closest('[data-sheet-open]');
      if (op) {
        e.preventDefault();
        var target = op.closest('.app').querySelector('#' + op.dataset.sheetOpen), k = op.dataset.sheetOpen.replace(/-s\d+$/, '');
        if (target) showSheet(target, { from: op, fill: CRM.fill[k] && function (sheet) { CRM.fill[k](sheet, op.dataset.key, op); } });
        return;
      }
      var row = t.closest(REC);
      if (row && !t.closest('button, a, input, select, label')) openRow(row);
    });
    /* a press on a select keeps the browser's list shut; the click opens the Dropdown */
    document.addEventListener('mousedown', function (e) {
      var s = e.target.closest && e.target.closest('select.select');
      if (s && !s.disabled && e.button === 0) { e.preventDefault(); s.focus(); }
    });
    /* bulk selection: the header box ticks every row in the list, then the bar follows */
    document.addEventListener('change', function (e) {
      var b = e.target, app = b.matches('.data-table .col-check .checkbox') && b.closest('.app');
      if (!app || !app.querySelector('[data-bulkbar]')) return;
      if (b.closest('thead')) $$('tbody tr[data-key]', app).forEach(function (tr) { if (!tr.hidden && pickBox(tr)) pickBox(tr).checked = b.checked; });
      syncPicked(app);
    });
    document.addEventListener('keydown', function (e) {
      /* ⌘K / Ctrl+K opens search in the live frame, from anywhere on the page */
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        var live = document.getElementById('app-1') || document.querySelector('.app');
        if (live && !live.querySelector(':scope > .palette')) { closeMenu(); palette(live); }
        return;
      }
      if (openMenuEl && openMenuEl.contains(e.target)) {
        /* the arrows move through the items and a search box, wherever it sits (top of a long list, foot of a short one) */
        var its = $$('[role^="menuitem"], .menu__search-input', openMenuEl).filter(function (x) { return !x.hidden; }), at = its.indexOf(e.target);
        var srch = openMenuEl.querySelector('.menu__search-input');
        if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
        else if (e.target === srch && e.key === 'Enter') {   /* the first option that matches (not a ticked one kept in view); Create only when none does */
          e.preventDefault();
          var ql = srch.value.trim().toLowerCase();
          var hit = $$('[role="menuitemcheckbox"], [role="menuitemradio"]', openMenuEl).filter(function (x) { return !x.hidden && matches(x, ql); })[0], cr = openMenuEl.querySelector('.menu__create:not([hidden])');
          if (srch.value.trim() && (hit || cr)) (hit || cr).click();
        }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (its.length) its[(at + (e.key === 'ArrowDown' ? 1 : -1) + its.length) % its.length].focus(); }
        else if (srch && e.target !== srch && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && e.key !== ' ') srch.focus();   /* typing on the list goes to the search */
        else if (!srch && e.key.length === 1 && e.key !== ' ' && !e.metaKey && !e.ctrlKey && !e.altKey) {   /* a letter: the next item starting with it, as a native list does */
          var ch = e.key.toLowerCase();
          for (var j = 1; j <= its.length; j++) { var c = its[(at + j) % its.length]; if (c.textContent.trim().toLowerCase().indexOf(ch) === 0) { c.focus(); break; } }
        }
        else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.matches('.segment')) {   /* within a switch */
          var sgs = $$('.segment', e.target.parentNode); e.preventDefault(); sgs[(sgs.indexOf(e.target) + (e.key === 'ArrowRight' ? 1 : -1) + sgs.length) % sgs.length].focus();
        }
        else if (e.key === 'Tab') closeMenu();
        return;
      }
      /* a select: Space, Enter or an arrow opens the Dropdown in place of the browser's list */
      if (e.target.matches && e.target.matches('select.select') && [' ', 'Enter', 'ArrowDown', 'ArrowUp'].indexOf(e.key) >= 0 && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openMenu(e.target); return; }
      if (e.target.matches && e.target.matches('.tab[role="tab"]') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        var tabs = $$('.tab[role="tab"]', e.target.closest('[role="tablist"]')), ti = tabs.indexOf(e.target);
        var nt = tabs[(ti + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; selectTab(nt); nt.focus(); e.preventDefault(); return;
      }
      if (e.key === 'Escape' && tipEl) { hideTip(); return; }
      /* [ collapses or expands the live frame's rail, unless the key is typed into a field or a drawer or search is open */
      if (e.key === '[' && !e.metaKey && !e.ctrlKey && !e.altKey && !openSheet && !(e.target.closest && e.target.closest('input, textarea, select, [contenteditable]'))) {
        var lf = document.getElementById('app-1');
        if (lf && lf.querySelector('[data-rail-toggle]') && !lf.querySelector(':scope > .palette')) { e.preventDefault(); toggleRail(lf, true); }
        return;
      }
      if (e.key === 'Escape' && openSheet) { e.preventDefault(); closeSheet(openSheet); return; }
      var row = e.target.closest && e.target.closest(REC);
      if (row && e.target === row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openRow(row); }
      if (e.key === 'Tab' && openSheet) {
        var f = $$('button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex="0"]', openSheet).filter(function (x) { return x.getClientRects().length; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    /* tooltips for icon-only controls (the collapsed rail, the edge handle, icon segments): hover (with the delay) and
       keyboard focus (at once) */
    document.addEventListener('mouseover', function (e) {
      var it = e.target.closest && e.target.closest('[data-tip]');
      if (it && (!tipEl || tipEl._item !== it)) showTip(it);
    });
    document.addEventListener('mouseout', function (e) {
      var it = e.target.closest && e.target.closest('[data-tip]');
      if (it && !it.contains(e.relatedTarget)) hideTip();
    });
    document.addEventListener('focusin', function (e) { if (e.target.matches('[data-tip]') && e.target.matches(':focus-visible')) showTip(e.target, true); });
    document.addEventListener('focusout', function (e) { if (e.target.matches('[data-tip]')) hideTip(); });
    /* account menu: the theme choice and Sign out (Admin and PhoneBurner are links) */
    /* the tag list: a tick adds or removes the chip; Create adds the tag to the list of tags and to this record */
    document.addEventListener('crm:menu', function (e) {
      var a = e.detail.action, tf = e.detail.button.closest('.tagfield'); if (!tf) return;
      if (a.indexOf('tagpick:') === 0) setTag(tf, a.slice(8), e.detail.checked);
      if (a.indexOf('peoplepick:') === 0) setTag(tf, a.slice(11), e.detail.checked);
      if (a.indexOf('tagnew:') === 0) {
        var nm = a.slice(7);
        if (!D.tagList.some(function (g) { return g.name.toLowerCase() === nm.toLowerCase(); })) D.tagList.push({ id: 'g-new-' + D.tagList.length, name: nm, contacts: 0, accounts: 0, opps: 0, created: D.today });
        setTag(tf, nm, true); tf.querySelector('.tagfield__open').focus();
      }
    });
    document.addEventListener('input', function (e) { if (e.target.matches('.menu__search-input')) searchMenu(e.target); });
    document.addEventListener('crm:menu', function (e) {
      var a = e.detail.action, app = e.detail.button.closest('.app');
      if (a === 'acct-dark' || a === 'acct-light') {
        if (window.HarborTheme) window.HarborTheme.setTheme(a.slice(5));
        /* every drawn account menu follows, the open one and the static states */
        $$('.menu--account .segment').forEach(function (s) { var on = s.dataset.action === a; s.classList.toggle('is-active', on); s.setAttribute('aria-checked', on ? 'true' : 'false'); });
      }
      if (a === 'acct-signout') toast(app, 'Sign out isn’t part of the prototype. In the CRM it ends the session and opens Sign in.');
    });
    document.addEventListener('input', function (e) { if (e.target.matches('input[data-search]')) filterRows(e.target.closest('.state')); });
    document.addEventListener('submit', function (e) { if (e.target.closest('.console, .sheet')) e.preventDefault(); });
    /* Back / Forward: the URL decides whether a record is open */
    window.addEventListener('popstate', function () {
      var app = document.querySelector('.app[data-url]'); if (!app) return;
      var key = recordParam(), sheet = app.querySelector('.sheet[data-record]');
      if (key) { var tr = findRecord(app, key); if (tr) openRow(tr, 'none'); }
      else if (sheet && !sheet.hidden) hideSheet(sheet);
    });
  }
  function selectTab(tab) {
    $$('.tab[role="tab"]', tab.closest('[role="tablist"]')).forEach(function (x) {
      var on = x === tab, panel = document.getElementById(x.getAttribute('aria-controls'));
      x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1;
      if (panel) panel.hidden = !on;
    });
  }

  /* copy a state's frame into another state; ids get a suffix so every label still points at its own field */
  function cloneStates() {
    $$('[data-clone]').forEach(function (slot, n) {
      var src = document.getElementById(slot.dataset.clone); if (!src) return;
      var copy = src.cloneNode(true), sfx = '-s' + (n + 2);
      copy.removeAttribute('id'); copy.removeAttribute('data-url');   /* only the live frame owns the URL */
      $$('[id]', copy).forEach(function (el) { el.id += sfx; });
      $$('label[for]', copy).forEach(function (el) { el.htmlFor += sfx; });
      $$('[aria-controls], [aria-labelledby], [aria-describedby], [data-sheet-open], [data-open]', copy).forEach(function (el) {
        ['aria-controls', 'aria-labelledby', 'aria-describedby'].forEach(function (a) { if (el.getAttribute(a)) el.setAttribute(a, el.getAttribute(a).split(' ').map(function (x) { return x + sfx; }).join(' ')); });
        if (el.dataset.sheetOpen) el.dataset.sheetOpen += sfx;
        if (el.dataset.open) el.dataset.open += sfx;
      });
      slot.replaceWith(copy);
      for (var k in slot.dataset) if (k !== 'clone') copy.dataset[k] = slot.dataset[k];
      copy.dataset.clonedFrom = slot.dataset.clone;
      if (slot.dataset.showSheet) copy.dataset.showSheet = slot.dataset.showSheet + sfx;
    });
  }

  /* ---------------- From / To date filters (calls, activity log, audit log) ----------------
     The button opens the browser's date picker: a hidden <input type="date"> sits along the field's foot, so the picker
     drops from the field. The chosen day shows in the app's format (H4) and a × clears it. From can't pass To, nor To
     come before From: the picker greys those days. A change fires crm:dates on the field; a page reads the range of its
     filter group with dateRange(scope) as ISO days ('' is any) and tests a record's stamp with inRange. */
  function dateFilters(labels) {
    return labels.map(function (l) {
      return '<div class="filter-btn filter-btn--field filter-btn--date" data-date-filter="' + l.toLowerCase() + '">' +
        '<button type="button" class="filter-btn__open" data-date-open aria-haspopup="dialog" aria-label="' + l + ', any date"><span class="filter-btn__label">' + l + '</span><span class="filter-btn__value">Any date</span>' + cicon('calendar', 16) + '</button>' +
        '<input type="date" class="filter-btn__date" tabindex="-1" aria-hidden="true">' +
        '<button type="button" class="filter-btn__clear" data-date-clear aria-label="Clear ' + l + '" hidden>' + H.icon('close', 14) + '</button></div>';
    }).join('');
  }
  function dateRange(scope) {
    function v(k) { var i = scope.querySelector('[data-date-filter="' + k + '"] .filter-btn__date'); return i ? i.value : ''; }
    return { from: v('from'), to: v('to') };
  }
  function inRange(iso, r) { var d = iso.slice(0, 10); return (!r.from || d >= r.from) && (!r.to || d <= r.to); }
  /* quiet: set without firing crm:dates, for a page that clears its filters and redraws itself */
  function setDate(fld, iso, quiet) {
    var inp = fld.querySelector('.filter-btn__date'), l = fld.querySelector('.filter-btn__label').textContent, grp = fld.closest('.filters');
    inp.value = iso || '';
    fld.classList.toggle('is-set', !!inp.value);
    fld.querySelector('.filter-btn__value').textContent = inp.value ? date(inp.value) : 'Any date';
    fld.querySelector('[data-date-open]').setAttribute('aria-label', l + ', ' + (inp.value ? date(inp.value) : 'any date'));
    fld.querySelector('[data-date-clear]').hidden = !inp.value;
    var r = dateRange(grp), from = grp.querySelector('[data-date-filter="from"] .filter-btn__date'), to = grp.querySelector('[data-date-filter="to"] .filter-btn__date');
    if (from) from.max = r.to;
    if (to) to.min = r.from;
    if (!quiet) fld.dispatchEvent(new CustomEvent('crm:dates', { bubbles: true, detail: r }));
  }
  /* a form's date (Log activity): the same picker behind a field that reads "Nov 12, 2026"; the input carries the ISO day.
     With no day (Log meeting, as live) it reads "Choose a date" in the placeholder's colour */
  function longDate(iso) { var d = parse(iso); return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); }
  function nativePicker(id, type, value, text, empty, icon, label) {
    return '<span class="input-wrap date-field"><button type="button" class="input date-field__btn' + (value ? '' : ' is-empty') + '" id="' + id + '" data-date-open aria-haspopup="dialog" aria-label="' + label + ', ' + (value ? text : 'not set') + '">' + (value ? text : empty) + '</button>' + cicon(icon, 16) +
      '<input type="' + type + '" class="date-field__input" tabindex="-1" aria-hidden="true" value="' + (value || '') + '" data-label="' + label + '"></span>';
  }
  function dateField(id, iso, label) { return nativePicker(id, 'date', iso, iso && longDate(iso), 'Choose a date', 'calendar', label); }
  /* a form's time: the browser's time picker behind a field that reads "10:15 AM"; the input carries "10:15" */
  function clockText(hhmm) { var p = hhmm.split(':'), h = +p[0]; return (h % 12 || 12) + ':' + p[1] + (h < 12 ? ' AM' : ' PM'); }
  function timeField(id, hhmm, label) { return nativePicker(id, 'time', hhmm, hhmm && clockText(hhmm), 'Choose a time', 'clock', label); }
  document.addEventListener('click', function (e) {
    var open = e.target.closest('[data-date-open]'), clear = e.target.closest('[data-date-clear]');
    if (open) {
      var inp = open.parentNode.querySelector('input[type="date"], input[type="time"]');
      try { inp.showPicker(); } catch (err) { inp.focus(); }   /* no showPicker: the field takes typing */
    } else if (clear) {
      var fld = clear.closest('[data-date-filter]');
      setDate(fld, ''); fld.querySelector('[data-date-open]').focus();
    }
  });
  document.addEventListener('change', function (e) {
    if (e.target.matches('.filter-btn__date')) setDate(e.target.closest('[data-date-filter]'), e.target.value);
    if (e.target.matches('.date-field__input') && e.target.value) {
      var btn = e.target.parentNode.querySelector('.date-field__btn'), txt = e.target.type === 'time' ? clockText(e.target.value) : longDate(e.target.value);
      btn.textContent = txt; btn.setAttribute('aria-label', e.target.dataset.label + ', ' + txt); btn.classList.remove('is-empty');
    }
  });

  var CRM = {
    data: D, by: BY, rep: rep, me: me, recordLink: recordLink, stage: stage, fileExt: fileExt, fileBadge: fileBadge, relFields: relFields,
    esc: esc, pct: pct, icon: cicon, initials: initials, who: who, person: person, tags: tags, tagCell: tagCell, meter: meter, meterCell: meterCell, pipeRows: pipeRows, menuBtn: menuBtn, rowMenu: rowMenu, rowActions: rowActions,
    field: field, input: input, select: select, stepper: stepper, validate: validate, multiGroup: multiGroup, ownerField: ownerField, tagField: tagField, peopleField: peopleField, tagsOf: tagsOf,
    date: date, stamp: stamp, day: day, days: days, money: money, moneyShort: moneyShort, count: count,
    dateFilters: dateFilters, dateField: dateField, timeField: timeField, dateRange: dateRange, inRange: inRange, setDate: setDate,
    rail: rail, header: header, toast: toast, confirm: confirmDialog, formDialog: formDialog, palette: palette, menus: {}, openMenu: openMenu, picked: picked, clearPicked: clearPicked, syncPicked: syncPicked, bulk: bulk, openRow: openRow, selectTab: selectTab,
    fill: {}, show: showSheet, hide: hideSheet, close: closeSheet, filter: filterRows, filterBar: filterBar,
    boot: function () {
      cloneStates();
      /* a frame can be drawn as another user (data-as="<rep id>"): their rail and account menu */
      function frameUser(el) { var app = el.closest('.app'); return app && app.dataset.as ? BY.rep[app.dataset.as] : me(); }
      $$('[data-crm-header]').forEach(function (el) { el.innerHTML = header(frameUser(el)); });
      $$('[data-rail]').forEach(function (el) {
        var loading = el.closest('[data-rail-loading]');
        el.innerHTML = loading ? railLoading() : rail(el.dataset.rail, frameUser(el));
        if (loading) el.setAttribute('aria-busy', 'true');
      });
      H.mount();
      /* the sidebar's drawn states, and the live frame as this browser left it */
      $$('.app[data-rail-collapsed]').forEach(function (app) { setRail(app, true); });
      /* a drawn state with named groups open (data-rail-open="Admin Tools") */
      $$('.app[data-rail-open]').forEach(function (app) {
        app.dataset.railOpen.split(' ').forEach(function (g) { var b = app.querySelector('.rail__group.is-folded[data-group="' + g + '"] [data-rail-fold]'); if (b) foldGroup(b); });
      });
      var lf = document.getElementById('app-1'), pref = storedRail();
      if (lf && lf.querySelector('[data-rail-toggle]') && (pref ? pref === 'collapsed' : window.innerWidth < 1280)) setRail(lf, true);
      $$('[data-cicon]').forEach(function (el) { el.innerHTML = cicon(el.dataset.cicon, parseInt(el.dataset.size || '16', 10)); });
      $$('.state').forEach(function (s) { drawBar(s); });   /* filter bars: each field shows its starting value */
      $$('.app[data-filters]').forEach(drawBarState);
      $$('.state').forEach(function (s) { if (s.querySelector('tbody[data-filterable]')) filterRows(s); });
      /* states that show a drawer open: the drawer is drawn without taking focus */
      $$('[data-show-sheet]').forEach(function (app) {
        var sheet = app.querySelector('#' + app.dataset.showSheet); if (!sheet) return;
        var key = app.dataset.showSheet.replace(/-s\d+$/, '');
        var row = app.dataset.key && findRecord(app, app.dataset.key);
        if (row) row.classList.add('is-selected');
        showSheet(sheet, { focus: false, fill: CRM.fill[key] && function (s) { CRM.fill[key](s, app.dataset.key, row); } });
        if (row) syncSteps(sheet, row);
      });
      wire();
      /* drawn after the page has laid out, so the tooltip and the menu sit where they would on hover and click */
      $$('.app[data-show-tip]').forEach(function (app) { var it = app.querySelector('.rail a[href="' + app.dataset.showTip + '.html"]'); if (it) drawTip(it); });
      $$('.app[data-show-account]').forEach(function (app) { openMenu(app.querySelector('[data-menu="account"]'), { focus: false }); });
      $$('.app[data-show-tags]').forEach(function (app) {
        var m = openMenu(app.querySelector('.sheet:not([hidden]) .tagfield__open'), { focus: false }), q = m.querySelector('.menu__search-input');
        if (app.dataset.showTags) { q.value = app.dataset.showTags; searchMenu(q); }   /* typed into the search */
      });
      $$('.app[data-show-filter]').forEach(function (app) { openMenu(app.querySelector('[data-filter="' + app.dataset.showFilter + '"] .filter-btn__open'), { focus: false }); });
      /* a shared ?record= link opens that record in the live frame */
      var live = document.querySelector('.app[data-url]'), rk = recordParam();
      if (live && rk) { var lr = findRecord(live, rk); if (lr) openRow(lr, 'none'); }
    }
  };
  CRM.menus.account = accountMenu;
  CRM.menus.tagpick = function (btn) {
    var on = tagsOf(btn.closest('.tagfield'));
    var items = D.tagList.map(function (g) { return { id: 'tagpick:' + g.name, label: g.name, multi: true, dot: true, checked: on.indexOf(g.name) >= 0 }; });
    /* a short list shows whole, with a box to create a tag at its foot; past 8 tags a search at the top finds or creates one */
    return D.tagList.length > LONG_LIST ? [{ search: 'Find or create a tag', top: true, create: true }].concat(items) : items.concat([{ sep: true }, { search: 'Create a tag', icon: 'plus', create: true }]);
  };
  /* the people a people field offers, in its order; a tick adds or removes the chip */
  CRM.menus.peoplepick = function (btn) {
    var f = btn.closest('.tagfield'), on = tagsOf(f);
    return f.dataset.people.split(' ').map(function (r) { return { id: 'peoplepick:' + r, label: rep(r).name, multi: true, checked: on.indexOf(r) >= 0 }; });
  };
  CRM.menus['rail-more'] = railMoreMenu;
  CRM.menus['bulk-more'] = bulkMoreMenu;
  window.CRM = CRM;
})();
