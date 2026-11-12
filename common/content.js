/* TechPower Harbor concepts — shared content data + renderers.
   Every concept page uses the same data so only the visual language differs.
   Pages mark slots with data-slot="…" and icons with data-icon="…"; HARBOR.mount() fills them. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ brand (geometry copied verbatim from ../assets/*.svg) */
  var WORDMARK_PATH = 'M390.786 114.833C409.049 114.833 420.244 127.794 421.912 141.934L422.305 144.978H408.46L407.97 142.228C406.398 132.9 399.721 126.321 389.115 126.321H388.919C377.333 126.321 369.379 134.079 369.379 149.396V151.459C369.379 166.874 377.333 174.632 388.919 174.632H389.115C399.721 174.632 406.398 168.053 407.97 158.725L408.46 155.975H422.305L421.912 159.019C420.243 173.159 408.068 186.121 390.098 186.121H388.429C369.379 186.121 355.533 173.355 355.533 151.263V149.69C355.533 127.5 370.165 114.833 389.115 114.833H390.786ZM604.658 114.832C623.904 114.832 638.436 127.5 638.436 149.691V151.262C638.436 173.355 623.904 186.121 604.658 186.121H603.086C583.841 186.121 569.309 173.355 569.309 151.262V149.691C569.309 127.5 583.841 114.832 603.086 114.832H604.658ZM670.158 165.304L684.888 119.546H699.026L713.756 165.304L727.503 116.109H741.25L721.807 184.845H707.471L691.956 136.239L676.441 184.845H662.106L642.664 116.109H656.51L670.158 165.304ZM288.167 126.91H263.913V184.844H250.166V126.91H225.912V116.109H288.167V126.91ZM347.577 126.91H311.05V144.781H345.123V154.993H311.05V173.945H347.577V184.844H297.5V116.109H347.577V126.91ZM445.873 143.112H480.143V116.109H493.791V184.844H480.143V154.404H445.873V184.844H432.225V116.109H445.873V143.112ZM534.25 116.109C550.747 116.109 560.86 123.474 560.86 139.676C560.86 155.975 550.747 163.34 534.25 163.34H519.424V184.844H505.775V116.109H534.25ZM798.399 126.91H761.872V144.781H795.945V154.993H761.872V173.944H798.399V184.844H748.322V116.109H798.399V126.91ZM840.527 116.109C856.336 116.109 866.154 124.063 866.154 138.202C866.154 148.61 860.067 155.189 851.131 157.644L869.002 184.844H853.391L837.482 160.393H822.852V184.844H809.203V116.109H840.527ZM603.873 126.321C591.501 126.321 583.152 133.587 583.152 149.396V151.557C583.152 167.268 591.501 174.632 603.873 174.632C616.245 174.632 624.592 167.268 624.592 151.557V149.396C624.592 133.587 616.245 126.321 603.873 126.321ZM519.424 152.44H533.661C542.303 152.44 547.213 148.611 547.213 139.97V139.381C547.213 130.74 542.303 126.91 533.661 126.91H519.424V152.44ZM822.852 149.593H839.054C847.694 149.593 852.407 145.665 852.407 138.398V138.006C852.407 130.739 847.694 126.811 839.054 126.811H822.852V149.593Z';
  var MARK_IN_LOGOTYPE = 'M206.381 100.306H170.115L124.177 146.243V182.51L155.701 151.044L206.381 100.306ZM124.177 189.768V206.732L167.705 163.204V146.252L124.177 189.768ZM162.862 100.318L136.266 126.913H100L126.595 100.318H162.862Z';
  var MARK_PATH = 'M258.145 75.5302H195.891L117.034 154.386V216.641L171.147 162.627L258.145 75.5302ZM117.034 229.101V258.222L191.754 183.502V154.402L117.034 229.101ZM183.439 75.5507L137.785 121.203H75.5312L121.184 75.5507H183.439Z';

  var STOPS = '<stop offset="0.0807" stop-color="#00217C"/><stop offset="0.2358" stop-color="#0042DB"/><stop offset="0.4815" stop-color="#006DF6"/><stop offset="0.6847" stop-color="#0085FC"/><stop offset="0.9333" stop-color="#01C8FA"/>';
  var uid = 0;

  /* Logotype: TechPower wordmark in currentColor + gradient brandmark. viewBox tightened to the artwork bounds (100,100 → 869,207). */
  function logotype() {
    var id = 'hb-lt-' + (++uid);
    return '<svg class="lockup__logotype" viewBox="100 100 769 107" role="img" aria-label="TechPower">' +
      '<defs><linearGradient id="' + id + '" x1="153.5" y1="211.848" x2="130.385" y2="82.5855" gradientUnits="userSpaceOnUse">' + STOPS + '</linearGradient>' +
      '<mask id="' + id + '-m" maskUnits="userSpaceOnUse" x="100" y="100" width="107" height="107"><path d="' + MARK_IN_LOGOTYPE + '" fill="#fff"/></mask></defs>' +
      '<path d="' + WORDMARK_PATH + '" fill="currentColor"/>' +
      '<g mask="url(#' + id + '-m)"><rect x="100" y="100.306" width="107" height="107" fill="url(#' + id + ')"/></g></svg>';
  }
  /* Brandmark alone (empty-state hero, avatar-size uses). viewBox tightened to 75.53 → 259.2. */
  function brandmark(cls) {
    var id = 'hb-bm-' + (++uid);
    return '<svg class="' + (cls || 'brandmark') + '" viewBox="75.53 75.53 183.68 183.68" role="img" aria-label="TechPower Harbor">' +
      '<defs><linearGradient id="' + id + '" x1="167.369" y1="267.003" x2="127.69" y2="45.1118" gradientUnits="userSpaceOnUse">' + STOPS + '</linearGradient>' +
      '<mask id="' + id + '-m" maskUnits="userSpaceOnUse" x="75" y="75" width="184" height="184"><path d="' + MARK_PATH + '" fill="#fff"/></mask></defs>' +
      '<g mask="url(#' + id + '-m)"><rect x="75.5312" y="75.5302" width="183.676" height="183.676" fill="url(#' + id + ')"/></g></svg>';
  }
  function lockup() {
    return logotype() + '<span class="lockup__product">Harbor<sup class="lockup__tm">™</sup></span>';
  }

  /* ------------------------------------------------------------------ icons: inline SVG, 1.5px stroke, currentColor */
  var ICON_PATHS = {
    attach: '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
    send: '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    'chevron-left': '<path d="M15 18l-6-6 6-6"/>',
    'chevron-right': '<path d="M9 6l6 6-6 6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    close: '<path d="M18 6L6 18M6 6l12 12"/>',
    export: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    /* three extras used only by the suggestion tiles and the "New chat" button */
    plus: '<path d="M12 5v14M5 12h14"/>',
    document: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h8"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    /* nav rail icons (concept 04 only) */
    usage: '<path d="M3 20h18"/><path d="M6 16V9M11 16V5M16 16v-6M21 16V8"/>',
    connectors: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    budgets: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"/>',
    tickets: '<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M13 6v12"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    /* concepts 06–09 */
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.14L4 20l1-4.4A8 8 0 1 1 21 12z"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    table: '<rect x="3" y="4" width="18" height="16"/><path d="M3 10h18M3 15h18M9 4v16"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
    word: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 12l1.5 5 2.5-4 2.5 4L16 12"/>',
    lock: '<rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    archive: '<rect x="3" y="4" width="18" height="5"/><path d="M5 9v11h14V9M10 13h4"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    eye: '<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3.1 3.9M6.5 6.6A17 17 0 0 0 2.5 12s3.5 7 9.5 7a9.6 9.6 0 0 0 4.4-1.1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'
  };
  function icon(name, size) {
    var s = size || 16;
    return '<svg class="icon icon--' + name + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON_PATHS[name] || '') + '</svg>';
  }

  /* ------------------------------------------------------------------ content */
  var chat = {
    greeting: 'Hello, Dan.',
    subtitle: 'Ask anything: general questions or your company data.',
    suggestions: [
      { icon: 'document', tag: 'Documents', text: 'Summarize the latest partner status tracker', hint: 'Reads Partner status tracker.xlsx' },
      { icon: 'flag', tag: 'Strategy', text: 'What are our 2026 goals?', hint: 'Searches the 2026 planning folder' },
      { icon: 'users', tag: 'Directory', text: 'List accounts with no activity in the last 30 days', hint: 'Checks the workspace user list' }
    ],
    /* quick actions (concepts 06–09): the use cases named at kickoff */
    actions: [
      { icon: 'document', text: 'Summarize a document' },
      { icon: 'pen', text: 'Draft a reply' },
      { icon: 'table', text: 'Analyse a spreadsheet' },
      { icon: 'word', text: 'Export to Word' }
    ],
    /* files the answer was grounded in (closed-loop: only the organisation's own systems) */
    sources: [
      { name: 'Partner status tracker.xlsx', where: 'SharePoint · Partnerships', meta: 'Updated Sep 16 · Sheet “Active”' },
      { name: 'Q3 partner review.docx', where: 'OneDrive · Dan Mitchell', meta: 'Updated Sep 12' },
      { name: 'Litware SOC 2 request.msg', where: 'Outlook · Procurement', meta: 'Received Sep 10' }
    ],
    /* history with previews (concept 09 inbox layout) */
    recentRich: [
      { title: 'Summarize the latest partner status tracker', snippet: 'Five active partners: two on track, one at risk…', time: '18:48', model: 'Sonnet 4.6' },
      { title: 'Draft a reply to the CHP procurement question', snippet: 'Here is a draft that confirms data stays in-region…', time: '15:47', model: 'Sonnet 4.6' },
      { title: 'IAM permissions the workspace reads', snippet: 'The workspace reads three Graph scopes: Files.Read…', time: '14:10', model: 'GPT-5' },
      { title: 'Q3 vendor invoice reconciliation', snippet: 'Matched 41 of 44 invoices; three need a PO number…', time: 'Yesterday', model: 'Sonnet 4.6' },
      { title: 'Onboarding checklist for civilian staff', snippet: 'A 12-step checklist grouped by first day, first week…', time: 'Yesterday', model: 'Haiku 4.5' },
      { title: 'Translate the records-request FAQ to Spanish', snippet: 'Traducción completa de las 14 preguntas…', time: 'Mon', model: 'Sonnet 4.6' },
      { title: 'Compare 2025 and 2026 travel policies', snippet: 'Per-diem rose 6%; pre-approval now required for…', time: 'Mon', model: 'GPT-5' },
      { title: 'Meeting notes: Bedrock cost review', snippet: 'Decisions: cap stays at $30; review in October…', time: 'Sep 12', model: 'Sonnet 4.6' }
    ],
    /* deleted messages are retained, not removed (kickoff 5:25): a designed state, not a bug */
    deleted: { label: 'Message deleted by Dan Mitchell · 09/16 18:52', note: 'Retained as an agency record under the records policy. May remain accessible to authorized records staff.' },
    composerPlaceholder: 'Ask anything…',
    model: 'Claude Sonnet 4.6',
    footer: 'Private to your organization. Runs on Amazon Bedrock inside your AWS account.',
    recent: [
      'Summarize the latest partner status tracker',
      'Draft a reply to the CHP procurement question',
      'IAM permissions the workspace reads',
      'Q3 vendor invoice reconciliation',
      'Onboarding checklist for civilian staff',
      'Translate the records-request FAQ to Spanish',
      'Compare 2025 and 2026 travel policies',
      'Meeting notes: Bedrock cost review',
      'Explain the budget alert thresholds',
      'Format the fleet maintenance table',
      'Accounts with no activity in 30 days',
      'Rewrite the ticket escalation email'
    ],
    deletedLabel: 'Deleted',
    deletedCount: 3,
    reportProblem: 'Report a problem',
    userMessage: 'Summarize the latest partner status tracker',
    replyIntro: 'Here is a summary of the latest partner status tracker (updated September 16), covering the five active partners.',
    partnerColumns: ['Partner', 'Status', 'Key Activity', 'Next Steps', 'Owner'],
    partners: [
      { partner: 'Northwind Systems', status: 'On track', tone: 'ok', activity: 'Integration testing completed for the records API', next: 'Schedule go-live review', owner: 'Dan Mitchell' },
      { partner: 'Contoso Logistics', status: 'At risk', tone: 'warn', activity: 'Contract renewal delayed by legal review', next: 'Escalate to procurement by 09/20', owner: 'Zach Alleman' },
      { partner: 'Fabrikam Analytics', status: 'On track', tone: 'ok', activity: 'Delivered the Q3 usage dashboard', next: 'Confirm Q4 scope', owner: 'Priya Natarajan' },
      { partner: 'Litware Security', status: 'Blocked', tone: 'danger', activity: 'Awaiting SOC 2 report', next: 'Follow up with vendor compliance', owner: 'Maria Gomez' },
      { partner: 'Adatum Training', status: 'Complete', tone: 'neutral', activity: 'Civilian staff onboarding sessions delivered', next: 'Close out and archive', owner: 'Dan Mitchell' }
    ]
  };

  var spend = {
    title: 'Spend by department',
    subtitle: 'This month, live',
    departments: [
      { name: 'Engineering', used: '$2.2504', cap: '$15.00', pct: 15 },
      { name: 'Finance', used: '$2.7590', cap: '$15.00', pct: 18.4 }
    ],
    capTitle: 'Workspace cap',
    cap: [
      { label: 'actual AWS bill', used: '$4.60', cap: '$30.00', pct: 15.3 },
      { label: 'live estimate', used: '$5.0094', cap: '$30.00', pct: 16.7 }
    ],
    link: 'Why these two differ',
    /* workforce view: an employee sees their own allowance, not every department's spend */
    personal: { label: 'Your AI allowance', used: '$0.84', cap: '$5.00', pct: 16.8, note: 'Resets Oct 1' }
  };

  var activity = {
    title: 'Admin console',
    subtitle: 'Every AI interaction and every administrative action: who did what, when, what it cost, and what was refused.',
    tabs: ['Usage', 'Users', 'Connectors', 'Budgets', 'Tickets', 'Activity'],
    activeTab: 'Activity',
    segments: ['AI interactions', 'Administrative actions', 'Disclosure report'],
    result: { showing: 150, total: 174 },
    pager: { from: 1, to: 10, total: 174, page: 1, pages: 18 },
    columns: ['Time', 'User', 'Dept', 'Cost', 'Checks', 'Tools', 'Prompt', ''],
    kpis: [
      { label: 'AI interactions', value: '174', note: 'Sep 16, all departments' },
      { label: 'Blocked by policy', value: '1', note: '1 needs review', tone: 'danger' },
      { label: 'Spend today', value: '$0.4157', note: 'of $30.00 workspace cap' },
      { label: 'Active users', value: '6', note: 'of 42 licensed' }
    ],
    selected: 3,
    detail: {
      id: 'evt_01J8ZK4T7Q',
      model: 'Claude Sonnet 4.6',
      tokens: '1,204 in · 0 out',
      policy: 'DLP rule HR-03 · bulk export of personal data',
      outcome: 'Refused before the model was called',
      retention: 'Per the agency records policy',
      ip: '10.40.12.7 · Olympia HQ'
    },
    rows: [
      { time: '09/16 18:48', user: 'dan.mitchell@techpower.com', dept: 'Finance', cost: '$0.1694', checks: null, tools: ['m365_search_files', 'm365_read_workbook ×2'], prompt: 'Summarize the latest partner status tracker' },
      { time: '09/16 18:16', user: 'zach.alleman@techpower.com', dept: 'Finance', cost: '$0.0171', checks: 'sanitized', tools: ['m365_search_files', 'm365_read_document ×3'], prompt: 'Document the IAM permissions the workspace reads' },
      { time: '09/16 17:52', user: 'priya.natarajan@techpower.com', dept: 'Engineering', cost: '$0.0428', checks: null, tools: ['m365_search_files'], prompt: 'What are our 2026 goals?' },
      { time: '09/16 17:31', user: 'maria.gomez@techpower.com', dept: 'Finance', cost: '$0.0000', checks: 'blocked', tools: [], prompt: 'Export every employee’s home address and salary to a spreadsheet I can email externally' },
      { time: '09/16 16:58', user: 'dan.mitchell@techpower.com', dept: 'Finance', cost: '$0.0913', checks: null, tools: ['m365_search_files', 'm365_read_workbook'], prompt: 'List accounts with no activity in the last 30 days' },
      { time: '09/16 16:20', user: 'lee.okafor@techpower.com', dept: 'Engineering', cost: '$0.0062', checks: null, tools: [], prompt: 'Explain the difference between the actual AWS bill and the live estimate on the spend panel, and tell me which one the finance team should use when reconciling the monthly workspace cap against the invoice' },
      { time: '09/16 15:47', user: 'zach.alleman@techpower.com', dept: 'Finance', cost: '$0.0239', checks: 'withheld', tools: ['m365_search_files', 'm365_read_document'], prompt: 'Draft a reply to the CHP procurement question about data residency' },
      { time: '09/16 15:05', user: 'sam.reyes@techpower.com', dept: 'Operations', cost: '$0.0117', checks: null, tools: ['m365_search_files ×2'], prompt: 'Compare the 2025 and 2026 travel policies' },
      { time: '09/16 14:33', user: 'priya.natarajan@techpower.com', dept: 'Engineering', cost: '$0.0581', checks: 'sanitized', tools: ['m365_read_workbook ×4'], prompt: 'Format the fleet maintenance table by vendor' },
      { time: '09/16 13:58', user: 'maria.gomez@techpower.com', dept: 'Finance', cost: '$0.0203', checks: null, tools: ['m365_search_files', 'm365_read_document ×2'], prompt: 'Rewrite the ticket escalation email for a non-technical audience' }
    ]
  };

  /* ------------------------------------------------------------------ renderers */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function toolsCell(r) { return r.tools.length ? '<ul class="tools">' + r.tools.map(function (t) { return '<li class="chip chip--mono">' + esc(t) + '</li>'; }).join('') + '</ul>' : '<span class="muted">—</span>'; }
  /* Checks use the refusal stages: blocked and withheld are policy stops (danger), sanitized means protected text was masked and the rest sent (warn). Only blocked rows take the row tint and the Blocked only filter. */
  function checkBadge(c) { return '<span class="badge badge--' + (c === 'sanitized' ? 'warn' : 'danger') + '">' + esc(c) + '</span>'; }
  function checksCell(r) { return r.checks ? checkBadge(r.checks) : '<span class="muted">—</span>'; }
  function userName(email) { return email.split('@')[0].split('.').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' '); }
  function initials(email) { return userName(email).split(' ').map(function (w) { return w.charAt(0); }).join(''); }

  var render = {
    lockup: function () { return lockup(); },
    /* ---------- concepts 06–09 ---------- */
    'suggestion-cards': function () {
      return chat.suggestions.map(function (s) {
        return '<li><button type="button" class="s-card"><span class="s-card__tag">' + esc(s.tag) + '</span><span class="s-card__title">' + esc(s.text) + '</span><span class="s-card__hint">' + esc(s.hint) + '</span><span class="s-card__cta">Ask this ' + icon('arrow', 16) + '</span></button></li>';
      }).join('');
    },
    'suggestion-list': function () {
      return chat.suggestions.map(function (s) {
        return '<li><button type="button" class="s-row">' + icon(s.icon, 16) + '<span class="s-row__text">' + esc(s.text) + '</span><span class="s-row__hint">' + esc(s.hint) + '</span></button></li>';
      }).join('');
    },
    actions: function () {
      return chat.actions.map(function (a) { return '<button type="button" class="action">' + icon(a.icon, 16) + '<span>' + esc(a.text) + '</span></button>'; }).join('');
    },
    sources: function () {
      return chat.sources.map(function (f, i) {
        return '<li class="source"><span class="source__num num">' + (i + 1) + '</span><span class="source__body"><span class="source__name">' + esc(f.name) + '</span><span class="source__where">' + esc(f.where) + '</span><span class="source__meta">' + esc(f.meta) + '</span></span></li>';
      }).join('');
    },
    'recent-rich': function () {
      return chat.recentRich.map(function (t, i) {
        return '<li><a class="thread-item' + (i === 0 ? ' is-active' : '') + '" href="#"' + (i === 0 ? ' aria-current="page"' : '') + '><span class="thread-item__top"><span class="thread-item__title">' + esc(t.title) + '</span><span class="thread-item__time num">' + esc(t.time) + '</span></span><span class="thread-item__snippet">' + esc(t.snippet) + '</span><span class="thread-item__model">' + esc(t.model) + '</span></a></li>';
      }).join('');
    },
    'deleted-msg': function () {
      return '<div class="msg-deleted" role="note">' + icon('archive', 16) + '<span class="msg-deleted__body"><span class="msg-deleted__label">' + esc(chat.deleted.label) + '</span><span class="msg-deleted__note">' + esc(chat.deleted.note) + '</span></span></div>';
    },
    'personal-usage': function () {
      var u = spend.personal;
      return '<div class="usage"><div class="usage__meta"><span class="usage__label">' + esc(u.label) + '</span><span class="usage__value num">' + esc(u.used) + ' <span class="usage__cap">/ ' + esc(u.cap) + '</span></span></div>' +
        '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + u.pct + '" aria-label="' + esc(u.label) + '"><span class="progress__fill" style="width:' + u.pct + '%"></span></div><span class="usage__note">' + esc(u.note) + '</span></div>';
    },
    kpis: function () {
      return activity.kpis.map(function (k) {
        return '<div class="kpi' + (k.tone ? ' kpi--' + k.tone : '') + '"><span class="kpi__label">' + esc(k.label) + '</span><span class="kpi__value num">' + esc(k.value) + '</span><span class="kpi__note">' + esc(k.note) + '</span></div>';
      }).join('');
    },
    'activity-list': function () {
      return activity.rows.map(function (r, i) {
        var sel = i === activity.selected;
        return '<li><a class="event' + (sel ? ' is-selected' : '') + (r.checks === 'blocked' ? ' is-blocked' : '') + '" href="#"' + (sel ? ' aria-current="true"' : '') + '>' +
          '<span class="event__avatar" aria-hidden="true">' + esc(initials(r.user)) + '</span>' +
          '<span class="event__main"><span class="event__top"><span class="event__user">' + esc(userName(r.user)) + '</span><span class="event__dept">' + esc(r.dept) + '</span>' + (r.checks ? checkBadge(r.checks) : '') + '</span>' +
          '<span class="event__prompt">' + esc(r.prompt) + '</span></span>' +
          '<span class="event__side"><span class="event__time num">' + esc(r.time.split(' ')[1]) + '</span><span class="event__cost num">' + esc(r.cost) + '</span></span></a></li>';
      }).join('');
    },
    'event-detail': function () {
      var r = activity.rows[activity.selected], d = activity.detail;
      function row(k, v, cls) { return '<div class="detail__row"><dt>' + esc(k) + '</dt><dd' + (cls ? ' class="' + cls + '"' : '') + '>' + v + '</dd></div>'; }
      return '<div class="detail__head"><span class="detail__kicker">AI interaction</span><h2 class="detail__title">' + esc(userName(r.user)) + ' · ' + esc(r.time) + '</h2>' +
        '<div class="detail__status"><span class="badge badge--danger">' + icon('shield', 14) + 'Blocked by policy</span><span class="detail__id num">' + esc(d.id) + '</span></div></div>' +
        '<section class="detail__section"><h3 class="detail__label">Prompt</h3><blockquote class="detail__prompt">' + esc(r.prompt) + '</blockquote></section>' +
        '<section class="detail__section"><h3 class="detail__label">Outcome</h3><p class="detail__outcome">' + esc(d.outcome) + '. Matched ' + esc(d.policy) + '.</p></section>' +
        '<section class="detail__section"><h3 class="detail__label">Record</h3><dl class="detail__grid">' +
          row('User', esc(r.user)) + row('Department', esc(r.dept)) + row('Model', esc(d.model)) + row('Tokens', esc(d.tokens), 'num') +
          row('Cost', esc(r.cost), 'num') + row('Source', esc(d.ip)) + row('Retention', esc(d.retention)) +
        '</dl></section>' +
        '<div class="detail__actions"><button type="button" class="btn btn--primary">Mark reviewed</button><button type="button" class="btn btn--secondary">Open ticket</button><button type="button" class="btn btn--ghost">' + icon('export', 16) + 'Export record</button></div>';
    },
    brandmark: function (el) { return brandmark(el.getAttribute('data-class') || 'brandmark'); },
    recent: function () {
      return chat.recent.map(function (t, i) {
        return '<li><a class="sidebar__item' + (i === 0 ? ' is-active' : '') + '" href="#" ' + (i === 0 ? 'aria-current="page"' : '') + '><span class="sidebar__item-text">' + esc(t) + '</span></a></li>';
      }).join('');
    },
    suggestions: function () {
      return chat.suggestions.map(function (s) {
        return '<li><button type="button" class="suggestion"><span class="suggestion__tile">' + icon(s.icon, 18) + '</span><span class="suggestion__text">' + esc(s.text) + '</span><span class="suggestion__chev">' + icon('chevron', 16) + '</span></button></li>';
      }).join('');
    },
    'partner-table': function () {
      return '<table class="data-table data-table--reply"><thead><tr>' +
        chat.partnerColumns.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') +
        '</tr></thead><tbody>' +
        chat.partners.map(function (p) {
          return '<tr><td class="cell--strong">' + esc(p.partner) + '</td><td><span class="status status--' + p.tone + '">' + esc(p.status) + '</span></td><td>' + esc(p.activity) + '</td><td>' + esc(p.next) + '</td><td>' + esc(p.owner) + '</td></tr>';
        }).join('') + '</tbody></table>';
    },
    spend: function () {
      function row(label, used, cap, pct, sub) {
        return '<div class="spend__row"><div class="spend__meta"><span class="spend__label">' + esc(label) + '</span><span class="spend__value num">' + esc(used) + ' <span class="spend__cap">/ ' + esc(cap) + '</span>' + (sub ? ' <span class="spend__sub">' + esc(sub) + '</span>' : '') + '</span></div>' +
          '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="' + esc(label) + '"><span class="progress__fill" style="width:' + pct + '%"></span></div></div>';
      }
      return '<div class="panel__section"><h2 class="panel__title">' + esc(spend.title) + '</h2><p class="panel__subtitle">' + esc(spend.subtitle) + '</p>' +
        spend.departments.map(function (d) { return row(d.name, d.used, d.cap, d.pct); }).join('') + '</div>' +
        '<div class="panel__section"><h2 class="panel__title">' + esc(spend.capTitle) + '</h2>' +
        spend.cap.map(function (c) { return row(c.label, c.used, c.cap, c.pct); }).join('') +
        '<a class="link" href="#">' + esc(spend.link) + '</a></div>';
    },
    tabs: function () {
      return activity.tabs.map(function (t) {
        var active = t === activity.activeTab;
        return '<a class="tab' + (active ? ' is-active' : '') + '" href="#" role="tab" aria-selected="' + active + '">' + esc(t) + '</a>';
      }).join('');
    },
    'tabs-rail': function () {
      var icons = { Usage: 'usage', Users: 'users', Connectors: 'connectors', Budgets: 'budgets', Tickets: 'tickets', Activity: 'activity' };
      return '<div class="rail__label">Admin console</div>' + activity.tabs.map(function (t) {
        var active = t === activity.activeTab;
        return '<a class="rail__item' + (active ? ' is-active' : '') + '" href="#" ' + (active ? 'aria-current="page"' : '') + '>' + icon(icons[t] || 'info', 18) + '<span>' + esc(t) + '</span></a>';
      }).join('');
    },
    segments: function (el) {
      /* data-count="N" keeps only the first N (07 lists Disclosure report in its nav instead) */
      var n = el && el.hasAttribute('data-count') ? parseInt(el.getAttribute('data-count'), 10) : activity.segments.length;
      return activity.segments.slice(0, n).map(function (s, i) {
        return '<button type="button" class="segment' + (i === 0 ? ' is-active' : '') + '" data-label="' + esc(s) + '" aria-pressed="' + (i === 0) + '">' + esc(s) + '</button>';
      }).join('');
    },
    'result-bar': function () {
      var r = activity.result;
      return '<span class="result__text">Showing <span class="num">' + r.showing + '</span> of <span class="num">' + r.total + '</span> matching records</span>';
    },
    /* record count and page controls under the activity table */
    pager: function (el) {
      var g = activity.pager;
      var pages = [1, 2, 3, null, g.pages].map(function (n) {
        if (n === null) return '<span class="pager__gap" aria-hidden="true">…</span>';
        var cur = n === g.page;
        return '<button type="button" class="pager__btn num' + (cur ? ' is-current' : '') + '"' + (cur ? ' aria-current="page"' : '') + ' aria-label="Page ' + n + '">' + n + '</button>';
      }).join('');
      var text = '<span class="pager__text">Showing <span class="num">' + g.from + '–' + g.to + '</span> of <span class="num">' + g.total + '</span> matching records</span>';
      /* data-rows adds a rows-per-page select next to the count (01 drops "Max rows" from its filters) */
      if (el && el.hasAttribute('data-rows')) text = '<span class="pager__meta">' + text +
        '<span class="pager__rows"><label for="pager-rows">Rows per page</label><span class="input-wrap"><select class="select pager__select num" id="pager-rows">' +
        [10, 25, 50, 150].map(function (n) { return '<option' + (n === g.to - g.from + 1 ? ' selected' : '') + '>' + n + '</option>'; }).join('') +
        '</select>' + icon('chevron', 14) + '</span></span></span>';
      return text +
        '<span class="pager__pages">' +
          '<button type="button" class="pager__btn" aria-label="Previous page"' + (g.page === 1 ? ' disabled' : '') + '>' + icon('chevron-left', 16) + '</button>' +
          pages +
          '<button type="button" class="pager__btn" aria-label="Next page"' + (g.page === g.pages ? ' disabled' : '') + '>' + icon('chevron-right', 16) + '</button>' +
        '</span>';
    },
    'activity-head': function () {
      return '<tr>' + activity.columns.map(function (c, i) {
        var cls = ['col-time', 'col-user', 'col-dept', 'col-cost', 'col-checks', 'col-tools', 'col-prompt', 'col-action'][i];
        return '<th scope="col" class="' + cls + '">' + (c ? esc(c) : '<span class="sr-only">Actions</span>') + '</th>';
      }).join('') + '</tr>';
    },
    'activity-rows': function (el) {
      /* data-selected="N" on the tbody marks row N as the one open in a detail drawer (concepts 06–09) */
      var selected = el && el.hasAttribute('data-selected') ? parseInt(el.getAttribute('data-selected'), 10) : -1;
      return activity.rows.map(function (r, i) {
        var tools = toolsCell(r), checks = checksCell(r);
        var cls = (r.checks === 'blocked' ? 'is-blocked' : '') + (i === selected ? ' is-selected' : '');
        return '<tr' + (cls.trim() ? ' class="' + cls.trim() + '"' : '') + (i === selected ? ' aria-selected="true"' : '') + '>' +
          '<td class="col-time num">' + esc(r.time) + '</td>' +
          '<td class="col-user"><span class="user">' + esc(r.user) + '</span></td>' +
          '<td class="col-dept">' + esc(r.dept) + '</td>' +
          '<td class="col-cost num">' + esc(r.cost) + '</td>' +
          '<td class="col-checks">' + checks + '</td>' +
          '<td class="col-tools">' + tools + '</td>' +
          '<td class="col-prompt"><span class="prompt" title="' + esc(r.prompt) + '">' + esc(r.prompt) + '</span></td>' +
          '<td class="col-action"><a class="link link--action" href="#">View</a></td></tr>';
      }).join('');
    },
    'activity-rows-selectable': function () {
      /* concept 04: same rows with a leading checkbox column */
      return activity.rows.map(function (r, i) {
        var tools = r.tools.length ? '<ul class="tools">' + r.tools.map(function (t) { return '<li class="chip chip--mono">' + esc(t) + '</li>'; }).join('') + '</ul>' : '<span class="muted">—</span>';
        var checks = checksCell(r);
        return '<tr' + (r.checks === 'blocked' ? ' class="is-blocked"' : '') + '>' +
          '<td class="col-select"><input type="checkbox" class="checkbox" aria-label="Select row ' + (i + 1) + '"></td>' +
          '<td class="col-time num">' + esc(r.time) + '</td>' +
          '<td class="col-user"><span class="user">' + esc(r.user) + '</span></td>' +
          '<td class="col-dept">' + esc(r.dept) + '</td>' +
          '<td class="col-cost num">' + esc(r.cost) + '</td>' +
          '<td class="col-checks">' + checks + '</td>' +
          '<td class="col-tools">' + tools + '</td>' +
          '<td class="col-prompt"><span class="prompt" title="' + esc(r.prompt) + '">' + esc(r.prompt) + '</span></td>' +
          '<td class="col-action"><a class="link link--action" href="#">View</a></td></tr>';
      }).join('');
    },
    'activity-head-selectable': function () {
      return '<tr><th scope="col" class="col-select"><input type="checkbox" class="checkbox" aria-label="Select all rows"></th>' + activity.columns.map(function (c, i) {
        var cls = ['col-time', 'col-user', 'col-dept', 'col-cost', 'col-checks', 'col-tools', 'col-prompt', 'col-action'][i];
        return '<th scope="col" class="' + cls + '">' + (c ? esc(c) : '<span class="sr-only">Actions</span>') + '</th>';
      }).join('') + '</tr>';
    }
  };

  /* ==================================================================
     Milestone 1 (concept 07): policy states, model choice, unit status, audit drawer.
     Additive only: concepts 01–06, 08 and 09 never reference m1-* slots, data-m1-icon or the data-toggle / data-gate wiring.
     Source: reports/final-recommendations.md §2 (M1), §3 (Gaps 1–6, "Recommended" rows), §6 (open questions Q1–Q21).
     Two annotation kinds (styled by common/annotations.css, not by the concept):
       confirmTag()  a recommended default the client still has to confirm ("To confirm · Qn"); hidden by the hub toggle.
       placeholder() a decision the report leaves open; always visible.
     ================================================================== */
  var M1_ICONS = {
    alert: '<path d="M12 3l9.5 17H2.5z"/><path d="M12 10v4M12 17.5h.01"/>',
    pause: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
    copy: '<rect x="9" y="9" width="11" height="11"/><path d="M5 15V5a1 1 0 0 1 1-1h9"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/>',
    eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3.1 3.9M6.5 6.6A17 17 0 0 0 2.5 12s3.5 7 9.5 7a9.6 9.6 0 0 0 4.4-1.1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    signout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"/><path d="M10 16l-4-4 4-4M6 12h10"/>',
    hold: '<rect x="4" y="10" width="16" height="11"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/>'
  };
  function m1Icon(name, size) {
    if (!M1_ICONS[name]) return icon(name, size);
    var s = size || 16;
    return '<svg class="icon icon--' + name + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + M1_ICONS[name] + '</svg>';
  }
  function confirmTag(q, what, inline) { return '<span class="confirm-tag' + (inline ? ' confirm-tag--inline' : '') + '" title="Recommended default, to confirm with the client (' + q + ')">To confirm · ' + esc(q) + (what ? ' ' + esc(what) : '') + '</span>'; }
  /* slot: neutral text that stands in for the value when review notes are hidden ("[date]"); without it the note just disappears */
  function placeholder(q, title, body, inline, slot) {
    if (inline) return '<span class="placeholder placeholder--inline" role="note" title="Placeholder: client decision ' + esc(q) + (title ? ', ' + esc(title) : '') + '"><span class="placeholder__title">' + esc(q) + ' placeholder</span>' + (body || '') + '</span>' + (slot ? '<span class="placeholder-slot">[' + esc(slot) + ']</span>' : '');
    return '<span class="placeholder" role="note"><span class="placeholder__title">Placeholder · client decision (' + esc(q) + ')' + (title ? ': ' + esc(title) : '') + '</span>' + (body || '') + '</span>';
  }

  var m1 = {
    tenant: 'Washington State Patrol',
    records: { lead: 'Conversations are kept as agency records under' },
    scopeNote: { title: 'Where this answer came from', body: 'Harbor searched SharePoint, OneDrive and Outlook and cited the files below.' },
    /* #4: the employee sees their own unit's status, not department spend (Q8 to confirm) */
    unit: {
      name: 'Finance', period: 'This month',
      states: {
        normal: { pct: 18, label: 'Within your unit’s budget', note: '18% of this month’s unit budget used' },
        soft: { pct: 82, tone: 'warn', label: 'Your unit is close to its budget threshold', note: 'Some models may become unavailable for your unit.' },
        routed: { pct: 100, tone: 'warn', label: 'Claude Sonnet 4.6 is unavailable for your unit', note: 'Its budget threshold was reached. Other approved models are still available.' },
        stopped: { pct: 100, tone: 'danger', label: 'Harbor is unavailable for your unit', note: 'The unit budget limit was reached.' }
      }
    },
    /* #5: plain-language model descriptions; the model ID is secondary detail */
    models: [
      { name: 'Claude Sonnet 4.6', id: 'anthropic.claude-sonnet-4-6', line: 'Long documents, careful drafting and analysis.' },
      { name: 'Claude Haiku 4.5', id: 'anthropic.claude-haiku-4-5', line: 'Fast and lower cost for short questions and summaries.' },
      { name: 'GPT-5', id: 'openai.gpt-5', line: 'General reasoning and spreadsheet maths.', unavailable: 'Unavailable for your unit because its budget threshold was reached.' },
      { name: 'GPT-OSS 120B', id: 'openai.gpt-oss-120b', line: 'Open-weight model for general questions.' }
    ],
    retrieval: { sources: 3, searched: 'SharePoint, OneDrive, Outlook', cited: 3 },
    /* Gap 1: stage-specific refusal copy (input blocked / sanitized / response withheld are different events) */
    refusal: {
      blocked: { tone: 'policy', icon: 'shield', title: 'Request blocked before it reached the answering model', body: 'Your message matched an agency policy, so it was not sent to the answering model.', actions: ['review', 'allowed', 'over'], record: true, category: true },
      sanitized: { tone: 'policy', icon: 'shield', title: 'Part of your request was masked before it reached the model', body: 'Harbor masked protected text and sent the rest. The answer below is based on the masked request.', actions: ['allowed', 'review'], record: true, category: true },
      withheld: { tone: 'policy', icon: 'eyeoff', title: 'The AI response was withheld under agency policy', body: 'The model processed your request, but its response is not shown.', actions: ['review', 'over'], record: true, category: true },
      failure: { tone: 'tech', icon: 'alert', title: 'Harbor couldn’t get an answer', body: 'A technical problem stopped this request. This is not a policy decision.', actions: ['retry'], ref: 'REQ-8F2K-41', retryNote: 'Retrying sends the request again and may count toward your unit’s usage.' },
      'review-sent': { tone: 'done', icon: 'check', title: 'Review request submitted', body: 'The request links to this event; your message text is not copied into it.', ref: 'Ticket T-0142 · Open', reviewNextQ: true },
      'review-unavailable': { tone: 'policy', icon: 'info', title: 'Review isn’t available for this event', body: '', reviewQ: true }
    },
    /* Gap 3: a chat keeps its model (Q13 to confirm); eligibility is checked at every submission */
    boundary: {
      soft: { title: 'Your unit has used 82% of its budget threshold for Claude Sonnet 4.6', body: 'If the threshold is reached, this model becomes unavailable for your unit and you’ll be offered a new chat on an eligible model.' },
      route: { title: 'Claude Sonnet 4.6 is currently unavailable for your unit because its budget threshold was reached', body: 'This chat stays on Claude Sonnet 4.6. Start a new chat with Claude Haiku 4.5 to continue.', next: 'Claude Haiku 4.5' },
      stop: { title: 'Harbor is unavailable for your unit because the unit budget limit was reached', body: 'You can’t send messages on any model.', recoveryQ: true },
      'no-eligible': { title: 'No eligible model is available for your unit right now', body: 'Every approved model has reached its budget threshold for your unit.' }
    },
    /* Gap 2: reader anatomy (Claude) with Codex's wording ("Sections viewed", not "Read") */
    memo: {
      title: 'Memorandum of Expectations', version: 'Version 3', effective: 'Effective October 1, 2026', viewed: 4,
      sections: ['Purpose and scope', 'Approved uses', 'Information you must not enter', 'Records and retention', 'Monitoring and access to transcripts', 'Data sources and permissions', 'Models and costs', 'Reporting problems', 'Acknowledgement'],
      current: 4,
      body: ['Every conversation in Harbor is an agency record. Authorized records staff may review conversations, including messages you remove from your own history, under the agency records policy.', 'How long each kind of record is kept is set by the agency records policy, not by Harbor.']
    },
    /* Gap 5: reason categories for transcript access */
    reasons: ['Records request', 'Policy review', 'Ticket investigation', 'Legal hold or disclosure', 'Other'],
    access: { ref: 'PDR-2026-0417', purpose: 'Policy review', by: 'Dan Mitchell', at: '09/16 18:02 PDT', auditRef: 'AUD-5521' },
    /* Gap 4: unit limits with explicit local limit vs roll-up labels */
    budget: {
      period: 'Monthly · October 2026',
      units: [
        { name: 'Washington State Patrol', depth: 0, type: 'Agency limit', limit: '$30.00', used: '$5.01', pct: 17 },
        { name: 'Office of the Chief', depth: 1, type: 'Roll-up only', limit: '—', used: '$5.01', pct: null, note: 'Sum of its units; no limit of its own' },
        { name: 'Engineering', depth: 2, type: 'Local limit', limit: '$15.00', used: '$2.25', pct: 15 },
        { name: 'Finance', depth: 2, type: 'Local limit', limit: '$15.00', used: '$2.76', pct: 18 },
        { name: 'Operations', depth: 2, type: 'Local limit', limit: '$5.00', used: '$0.00', pct: 0 },
        { name: 'Records Unit', depth: 2, type: 'Uses agency limit', limit: '—', used: '$0.00', pct: null, draft: true }
      ],
      overAllocation: 'Unit limits total $35.00, more than the $30.00 agency limit. This is allowed. Check it is intended.',
      scope: 'the agency limit covers 12 active units; draft units are excluded'
    }
  };

  function q7History() {
    return placeholder('Q7', 'deleted messages', 'Whether employees see removed messages here, in the thread, or not at all is not decided. No “Deleted” area is shown until the client chooses.');
  }
  function m1Actions(keys) {
    var map = {
      review: '<button type="button" class="btn btn--secondary btn--sm">Request review</button>',
      allowed: '<button type="button" class="btn btn--ghost btn--sm">What’s allowed</button>',
      over: '<button type="button" class="btn btn--ghost btn--sm">Start over</button>',
      retry: '<button type="button" class="btn btn--secondary btn--sm">' + m1Icon('refresh', 14) + 'Retry</button>'
    };
    return (keys || []).map(function (k) { return map[k]; }).join('');
  }
  function railBtn(href, label, iconName, active, extra) {
    return '<a class="rail__btn' + (active ? ' is-active' : '') + '" href="' + href + '" aria-label="' + label + '" title="' + label + '"' + (active ? ' aria-current="page"' : '') + (extra || '') + '>' + icon(iconName, 20) + '</a>';
  }

  var m1Render = {
    /* shared frame parts for concept 07 states */
    'm1-rail': function (el) {
      var admin = el.getAttribute('data-active') === 'admin';
      return '<span class="rail__mark" aria-hidden="true"></span>' +
        railBtn('chat.html', 'Chat', 'chat', !admin) + railBtn('chat.html', 'History', 'history', false) + railBtn('activity.html', 'Admin console', 'shield', admin) +
        '<span class="rail__spacer"></span>' +
        '<button type="button" class="rail__btn" aria-label="Report a problem" title="Report a problem">' + icon('flag', 20) + '</button>' +
        '<button type="button" class="avatar" aria-label="Account menu, Dan Mitchell">DM</button>';
    },
    'm1-history': function (el) {
      var active = el.hasAttribute('data-active') ? parseInt(el.getAttribute('data-active'), 10) : -1;
      var groups = [['Today', 0, 3], ['Yesterday', 3, 5], ['Earlier this month', 5, 12]];
      return groups.map(function (g) {
        return '<div class="hist__group"><div class="hist__label caps">' + g[0] + '</div><ul class="hist__list">' +
          chat.recent.slice(g[1], g[2]).map(function (t, i) {
            var on = g[1] + i === active;
            return '<li><a class="hist__item' + (on ? ' is-active' : '') + '" href="#"' + (on ? ' aria-current="page"' : '') + '><span class="hist__text">' + esc(t) + '</span></a></li>';
          }).join('') + '</ul></div>';
      }).join('') +
      '<div class="hist__deleted" data-note>' + q7History() + '</div>';
    },
    /* the history list's Q7 placeholder on its own, for concepts with their own history markup (06) */
    'm1-deleted-group': function () { return q7History(); },
    'm1-records-line': function () {
      return '<p class="records-line">' + m1Icon('archive', 14) + '<span>' + esc(m1.records.lead) + ' ' + placeholder('Q17', 'policy name', 'records policy name', true, 'records policy') + '.</span></p>';
    },
    'm1-scope-note': function () {
      return '<div class="scope-note">' + icon('lock', 16) + '<span><strong>' + esc(m1.scopeNote.title) + '</strong>' + esc(m1.scopeNote.body) + '</span></div>' +
        '<div class="scope-ph" data-note>' + placeholder('Q20', 'answer boundary', 'Whether answers may also draw on the model’s general knowledge, how that is labelled, and what permission guarantee Harbor states about sources.') + '</div>';
    },
    /* #4 spend panel: own unit status with threshold / stop states */
    'm1-unit-status': function (el) {
      var key = el.getAttribute('data-state') || 'normal', s = m1.unit.states[key];
      return '<div class="unit' + (s.tone ? ' unit--' + s.tone : '') + '">' +
        '<div class="unit__head"><span class="unit__label">Your unit · ' + esc(m1.unit.name) + '</span>' + (key === 'normal' ? confirmTag('Q8', 'spend view') : '') + '</div>' +
        '<p class="unit__status">' + (s.tone ? m1Icon(s.tone === 'danger' ? 'pause' : 'alert', 14) : '') + '<span>' + esc(s.label) + '</span></p>' +
        '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + s.pct + '" aria-label="' + esc(m1.unit.name) + ' unit budget used"><span class="progress__fill" style="width:' + s.pct + '%"></span></div>' +
        '<span class="unit__note">' + esc(s.note) + '</span>' +
        '<span class="unit__reset">Resets ' + placeholder('Q14', 'reset date', 'date, if the period defines one', true, 'date') + '</span></div>';
    },
    /* #4 the same unit status in 06's site-style stat markup (.usage), so 06 needs no new CSS */
    'm1-unit-usage': function (el) {
      var key = el.getAttribute('data-state') || 'normal', s = m1.unit.states[key];
      return '<div class="usage"><div class="usage__meta"><span class="usage__label">Your unit · ' + esc(m1.unit.name) + (key === 'normal' ? ' ' + confirmTag('Q8', '', true) : '') + '</span>' +
        '<span class="usage__value num">' + s.pct + '% <span class="usage__cap">of unit budget</span></span></div>' +
        '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + s.pct + '" aria-label="' + esc(m1.unit.name) + ' unit budget used"><span class="progress__fill" style="width:' + s.pct + '%"></span></div>' +
        '<span class="usage__note">' + esc(s.label) + '</span>' +
        '<span class="usage__note">Resets ' + placeholder('Q14', 'reset date', 'date, if the period defines one', true, 'date') + '</span></div>';
    },
    /* #5 model picker; Gap 3 disabled-with-reason entries */
    'm1-model-menu': function (el) {
      var current = el.getAttribute('data-current') || 'Claude Sonnet 4.6';
      return '<div class="mmenu__head"><span class="caps">Approved models</span><span class="mmenu__note">A chat keeps its model ' + confirmTag('Q13') + '</span></div>' +
        '<ul class="mmenu__list" role="listbox" aria-label="Choose a model">' + m1.models.map(function (m) {
          var on = m.name === current, off = !!m.unavailable;
          return '<li role="option" class="mopt' + (on ? ' is-current' : '') + (off ? ' is-disabled' : '') + '" aria-selected="' + on + '"' + (off ? ' aria-disabled="true"' : ' tabindex="-1"') + '>' +
            '<span class="mopt__top"><span class="mopt__name">' + esc(m.name) + '</span>' + (on ? m1Icon('check', 16) : '') + '</span>' +
            '<span class="mopt__line">' + esc(off ? m.unavailable : m.line) + '</span>' +
            '<span class="mopt__id">' + esc(m.id) + '</span></li>';
        }).join('') + '</ul>';
    },
    /* #6 real retrieval status and answer actions */
    'm1-retrieval': function () {
      var r = m1.retrieval;
      return '<div class="retrieval">' + icon('search', 14) + '<span>Searched ' + esc(r.searched) + ' · <strong class="num">' + r.cited + '</strong> files cited</span></div>';
    },
    'm1-answer-actions': function () {
      return '<div class="answer-actions" role="group" aria-label="Answer actions">' +
        '<button type="button" class="btn btn--ghost btn--sm">' + m1Icon('copy', 14) + 'Copy</button>' +
        '<button type="button" class="btn btn--ghost btn--sm">' + icon('export', 14) + 'Export</button>' +
        '<button type="button" class="btn btn--ghost btn--sm">' + icon('flag', 14) + 'Report</button>' +
        '<span class="next-badge">Export flow: next milestone</span></div>';
    },
    /* Gap 1 refusal states */
    'm1-refusal': function (el) {
      var key = el.getAttribute('data-stage') || 'blocked', r = m1.refusal[key];
      var body = r.body ? '<p class="refusal__body">' + esc(r.body) + '</p>' : '';
      if (r.category) body += '<p class="refusal__cat">Category: ' + placeholder('Q11', '', 'shown only where the category label is not itself sensitive', true, 'category') + '</p>';
      if (r.reviewNextQ) body += placeholder('Q11', 'after a review request', 'Who reviews, whether the requester hears back, and what can change as a result.', true);
      if (r.reviewQ) body += placeholder('Q11', 'reviews', 'Which categories accept a review, and whether a review can overturn a block, is not decided. This state shows the copy slot only.');
      return '<div class="refusal refusal--' + r.tone + '" role="status">' +
        '<span class="refusal__icon">' + m1Icon(r.icon, 16) + '</span>' +
        '<div class="refusal__main"><p class="refusal__title">' + esc(r.title) + '</p>' + body +
        (r.retryNote ? '<p class="refusal__note">' + esc(r.retryNote) + '</p>' : '') +
        (r.actions ? '<div class="refusal__actions">' + m1Actions(r.actions) + '</div>' : '') +
        ((r.record || r.ref) ? '<p class="refusal__meta">' + (r.record ? 'This event is kept in agency records.' : '') + (r.ref ? '<span class="num">' + esc(r.ref) + '</span>' : '') + '</p>' : '') +
        '</div></div>';
    },
    'm1-masked-msg': function () {
      return '<div class="msg msg--user msg--masked"><div class="msg__body"><span class="masked" aria-label="Message text hidden">Message text hidden</span></div></div>';
    },
    /* Gap 3 model boundary */
    'm1-boundary': function (el) {
      var key = el.getAttribute('data-kind') || 'route', b = m1.boundary[key];
      var reset = key === 'soft' ? '' : '<p class="boundary__reset">Access returns ' + placeholder('Q13', 'reset date', 'date, only if the budget period provides one', true, 'date') + '</p>';
      if (b.recoveryQ) reset += placeholder('Q13', 'during a hard stop', 'Whether history stays readable, and what restores access (period reset, a raised limit, or an administrator).', true);
      var tone = key === 'soft' ? 'warn' : (key === 'route' ? 'info' : 'danger');
      var actions = '';
      if (key === 'route') actions = '<div class="boundary__actions"><button type="button" class="btn btn--primary btn--sm">' + icon('plus', 14) + 'Start a new chat with ' + esc(b.next) + '</button><button type="button" class="btn btn--ghost btn--sm">Choose another model</button></div><p class="boundary__fine">The new chat starts blank. Nothing from this conversation is carried over. ' + confirmTag('Q13', 'one model per chat') + '</p>';
      if (key === 'stop' || key === 'no-eligible') actions = '<div class="boundary__actions" data-note>' + placeholder('Q14', 'who to contact', 'Route to the unit’s Harbor administrator or support, once defined.', true) + '</div>';
      return '<div class="boundary boundary--' + tone + '" role="status"><span class="boundary__icon">' + m1Icon(key === 'soft' ? 'alert' : (key === 'route' ? 'info' : 'pause'), 16) + '</span>' +
        '<div class="boundary__main"><p class="boundary__title">' + esc(b.title) + '</p><p class="boundary__body">' + esc(b.body) + '</p>' + reset + actions + '</div></div>';
    },
    /* Gap 2 Memorandum gate */
    'm1-memo-reader': function () {
      var m = m1.memo;
      return '<div class="memo">' +
        '<header class="memo__head"><a class="lockup" href="#" aria-label="TechPower Harbor">' + lockup() + '</a>' +
          '<button type="button" class="btn btn--ghost btn--sm">' + m1Icon('signout', 14) + 'Sign out</button></header>' +
        '<div class="memo__body">' +
          '<nav class="memo__toc" aria-label="Sections"><p class="caps">Sections viewed <span class="num">' + m.viewed + ' of ' + m.sections.length + '</span></p><ol>' +
            m.sections.map(function (s, i) {
              var seen = i < m.viewed, cur = i === m.current - 1;
              return '<li class="toc__item' + (seen ? ' is-seen' : '') + (cur ? ' is-current' : '') + '"' + (cur ? ' aria-current="true"' : '') + '><span class="toc__mark">' + (seen ? m1Icon('check', 14) : '<span class="num">' + (i + 1) + '</span>') + '</span>' + esc(s) + '</li>';
            }).join('') + '</ol></nav>' +
          '<article class="memo__doc"><p class="caps">' + esc(m.version) + ' · ' + esc(m.effective) + '</p>' +
            '<h1 class="memo__title">' + esc(m.title) + '</h1>' +
            '<p class="memo__intro">Before you use Harbor, view each section and sign. ' + confirmTag('Q12', 're-sign on next request') + '</p>' +
            '<h2 class="memo__h2"><span class="num">' + m.current + '.</span> ' + esc(m.sections[m.current - 1]) + '</h2>' +
            m.body.map(function (p) { return '<p class="memo__p">' + esc(p) + '</p>'; }).join('') +
            '<div class="memo__ph">' + placeholder('Q12', 'accessible equivalent', 'What replaces “scroll the full document” for keyboard and screen-reader users is not decided.') + '</div>' +
            '<a class="link link--sm" href="#">' + m1Icon('download', 14) + ' Download PDF</a>' +
          '</article></div>' +
        '<footer class="memo__foot"><span class="memo__progress">Sections viewed <strong class="num">' + m.viewed + ' of ' + m.sections.length + '</strong>. Sign becomes available after the last section.</span>' +
          placeholder('Q12', 'typed name', 'Whether a typed name is required beyond Microsoft sign-in.', true) +
          '<span class="memo__btns"><button type="button" class="btn btn--ghost">Sign out</button><button type="button" class="btn btn--primary" disabled aria-disabled="true">Sign and enter workspace</button></span></footer>' +
      '</div>';
    },
    'm1-memo-variant': function (el) {
      var k = el.getAttribute('data-kind');
      var v = {
        changed: ['info', 'The Memorandum changed since you signed', 'Version 3 replaces version 2. Sections 4 and 7 changed and are highlighted. Sign again to continue; your next request is held until you do.'],
        superseded: ['warn', 'A newer version was published while you were reading', 'Your progress on version 3 can’t be used. Open version 4 to continue. Nothing was signed.'],
        network: ['danger', 'Your signature wasn’t confirmed', 'The connection dropped before Harbor confirmed it. Try again: you won’t be signed twice.']
      }[k];
      return '<div class="boundary boundary--' + v[0] + '" role="status"><span class="boundary__icon">' + m1Icon(v[0] === 'info' ? 'info' : 'alert', 16) + '</span><div class="boundary__main"><p class="boundary__title">' + esc(v[1]) + '</p><p class="boundary__body">' + esc(v[2]) + '</p>' +
        (k === 'network' ? '<div class="boundary__actions"><button type="button" class="btn btn--primary btn--sm">' + m1Icon('refresh', 14) + 'Try again</button></div>' : '') +
        (k === 'changed' ? '<div class="boundary__actions"><button type="button" class="btn btn--primary btn--sm">Review changes</button></div><p class="boundary__fine">Point-of-use gating (only when a changed feature is used) is an option for the client to choose. ' + confirmTag('Q12') + '</p>' : '') +
        '</div></div>';
    },
    /* #10 agency paused (kill switch, employee side) */
    'm1-paused': function () {
      return '<div class="paused" role="status"><span class="paused__icon">' + m1Icon('pause', 20) + '</span>' +
        '<h2 class="paused__title">Harbor is paused for your agency</h2>' +
        '<p class="paused__body">An administrator paused Harbor. You can’t send messages while it is paused. This is not caused by your account or your unit’s budget.</p>' +
        placeholder('Q19', 'while paused', 'What happens to history, exports and in-flight answers, and who can restore access, is not decided. No restore time is shown.') +
        '<div class="paused__next">' + placeholder('Q19', 'support route', 'Contact details for the agency’s Harbor administrator.', true, 'support contact') + '</div></div>';
    },
    /* Gap 6: confirmation copy agreed in round 2; the employee-side default stays open (Q7) */
    'm1-delete-confirm': function () {
      var id = 'm1-del-' + (++uid);
      return '<div class="dialog" role="dialog" aria-modal="false" aria-labelledby="' + id + '"><h3 class="dialog__title" id="' + id + '">Remove this message from your chat?</h3>' +
        '<p class="dialog__body">Retained agency records are handled under ' + placeholder('Q17', 'policy name', 'records policy name', true, 'records policy') + ' and may remain accessible to authorized records staff.</p>' +
        '<div class="dialog__actions"><button type="button" class="btn btn--secondary btn--sm">Cancel</button><button type="button" class="btn btn--primary btn--sm">Remove from my chat</button></div></div>';
    },
    'm1-deleted-employee': function () {
      return placeholder('Q7', 'what the employee sees after removing a message', '<ul><li><strong>Option A:</strong> an in-thread marker where the message was.</li><li><strong>Option B:</strong> no marker; the message disappears from the employee’s view.</li></ul>Both keep the agency record. Not built until the client chooses; a screenshot of today’s deleted state is requested.');
    },
    /* Gap 5 + #8: role-aware Activity list, metadata only for roles without content access */
    'm1-activity-head': function () {
      return '<tr><th scope="col" class="col-time">Time (PDT)</th><th scope="col" class="col-user">User</th><th scope="col" class="col-dept">Unit</th><th scope="col" class="col-cost">Cost</th><th scope="col" class="col-checks">Checks</th><th scope="col" class="col-prompt">Content</th></tr>';
    },
    'm1-activity-rows': function (el) {
      var selected = el && el.hasAttribute('data-selected') ? parseInt(el.getAttribute('data-selected'), 10) : -1;
      return activity.rows.map(function (r, i) {
        var cls = (r.checks === 'blocked' ? 'is-blocked' : '') + (i === selected ? ' is-selected' : '');
        return '<tr' + (cls.trim() ? ' class="' + cls.trim() + '"' : '') + (i === selected ? ' aria-selected="true"' : '') + '>' +
          '<td class="col-time num">' + esc(r.time) + '</td>' +
          '<td class="col-user"><span class="user">' + esc(userName(r.user)) + '</span></td>' +
          '<td class="col-dept">' + esc(r.dept) + '</td>' +
          '<td class="col-cost num">' + esc(r.cost) + '</td>' +
          '<td class="col-checks">' + checksCell(r) + '</td>' +
          '<td class="col-prompt"><span class="protected">' + icon('lock', 14) + 'Protected · open the record</span></td></tr>';
      }).join('');
    },
    /* #8 record drawer grouped When / Who / What / Where; Gap 5 reason gate before content */
    'm1-event-drawer': function (el) {
      var gate = el.getAttribute('data-gate') || 'closed';
      var r = activity.rows[activity.selected], d = activity.detail, a = m1.access;
      var ref = el.getAttribute('data-ref') || a.ref, purpose = el.getAttribute('data-purpose') || a.purpose;
      function row(k, v, cls) { return '<div class="detail__row"><dt>' + esc(k) + '</dt><dd' + (cls ? ' class="' + cls + '"' : '') + '>' + v + '</dd></div>'; }
      function group(title, rows) { return '<section class="detail__section"><h3 class="detail__label">' + title + '</h3><dl class="detail__grid">' + rows + '</dl></section>'; }
      var head = '<div class="detail__head"><span class="detail__kicker">AI interaction</span><h2 class="detail__title" tabindex="-1">' + esc(userName(r.user)) + ' · ' + esc(r.time) + '</h2>' +
        '<div class="detail__status"><span class="badge badge--danger">' + icon('shield', 14) + 'Blocked before the model</span><span class="detail__id num">' + esc(d.id) + '</span></div></div>';
      var roleQ = '<div class="detail__role">' + placeholder('Q16', 'metadata by role', 'Which roles see email, unit, policy, source and hold status before the content gate is not decided. This drawer shows a role with full metadata access; content stays gated for every role.') + '</div>';
      var meta = roleQ + group('When', row('Occurred', '09/16/2026 17:31:04 PDT', 'num')) +
        group('Who', row('User', esc(userName(r.user)) + '<span class="detail__sub">' + esc(r.user) + '</span>') + row('Unit', esc(r.dept))) +
        group('What', row('Outcome', 'Request blocked before it reached the answering model') + row('Policy', esc(d.policy)) + row('Model', esc(d.model) + ' <span class="detail__sub">not called</span>') + row('Cost', esc(r.cost), 'num')) +
        group('Where', row('Source', esc(d.ip))) +
        '<section class="detail__section"><h3 class="detail__label">Record</h3><dl class="detail__grid">' + row('Retention', placeholder('Q17', '', 'effective period by record type', true, 'retention period')) + row('Legal hold', '<span class="hold">' + m1Icon('hold', 14) + 'Not on hold</span> ' + placeholder('Q17', '', 'who may see hold status', true)) + '</dl></section>';
      var body = '';
      if (gate === 'closed') {
        body = '<section class="gate"><h3 class="detail__label">Transcript</h3><p class="gate__text">' + icon('lock', 14) + '<span>Content is protected. Viewing it records your name and a reason.</span></p>' +
          '<div class="detail__actions"><button type="button" class="btn btn--primary" data-gate-action="form">View transcript</button><button type="button" class="btn btn--secondary" data-gate-action="form">' + icon('export', 16) + 'Export record</button></div></section>';
      } else if (gate === 'form') {
        var gid = 'm1-gate-' + (++uid);
        body = '<form class="gate gate--form" novalidate aria-labelledby="' + gid + '"><h3 class="gate__title" id="' + gid + '" tabindex="-1">Why are you opening this transcript?</h3>' +
          '<p class="gate__text">Your access reason will be recorded. Your existing permissions determine which content you can view.</p>' +
          '<label class="field"><span class="field__label">Purpose</span><select class="select" name="purpose" required>' + m1.reasons.map(function (x) { return '<option' + (x === purpose ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('') + '</select></label>' +
          '<label class="field"><span class="field__label">Reference ID</span><input class="input" name="ref" id="' + gid + '-ref" value="' + esc(ref) + '" required autocomplete="off"></label>' +
          '<label class="field"><span class="field__label">Note <span class="field__opt">optional</span></span><textarea class="input input--area" rows="2">Reviewing a blocked bulk-export request.</textarea></label>' +
          placeholder('Q16', 'reason scope', 'Whether one reason covers further records for the same case, for how long, and whether reference IDs are validated, is not decided. Today every content access asks again.') +
          '<div class="detail__actions"><button type="submit" class="btn btn--primary" data-gate-action="submit">Record reason and view</button><button type="button" class="btn btn--ghost" data-gate-action="closed">Cancel</button></div></form>';
      } else if (gate === 'recording') {
        body = '<section class="gate"><p class="gate__text" role="status">' + m1Icon('refresh', 14) + '<span>Recording your access…</span></p></section>';
      } else if (gate === 'failed') {
        body = '<section class="gate gate--failed" role="alert"><h3 class="gate__title">Access couldn’t be recorded, so the transcript isn’t shown</h3>' +
          '<p class="gate__text"><span>Nothing was revealed. Try again; if it keeps failing, contact support with reference <span class="num">' + esc(a.auditRef) + '</span>.</span></p>' +
          '<div class="detail__actions"><button type="button" class="btn btn--primary" data-gate-action="submit">' + m1Icon('refresh', 16) + 'Try again</button></div></section>';
      } else {
        body = '<section class="gate gate--open"><div class="access-banner">' + icon('lock', 14) + '<span>Accessed under <strong class="num">' + esc(ref) + '</strong> · ' + esc(purpose) + '<span class="detail__sub">Recorded ' + esc(a.at) + ' by ' + esc(a.by) + '. Listed in Administrative actions.</span></span></div>' +
          '<h3 class="gate__title" tabindex="-1">Transcript</h3><div class="transcript">' +
            '<div class="tline"><span class="tline__who">' + esc(userName(r.user)) + ' <span class="num">17:31</span></span><blockquote class="detail__prompt">' + esc(r.prompt) + '</blockquote></div>' +
            '<div class="tline tline--system">' + icon('shield', 14) + '<span>Blocked before the model · ' + esc(d.policy) + '</span></div></div>' +
          '<div class="detail__actions"><button type="button" class="btn btn--primary">Mark reviewed</button><button type="button" class="btn btn--secondary">Open ticket</button><button type="button" class="btn btn--ghost">' + icon('export', 16) + 'Export record</button></div></section>';
      }
      if (el.hasAttribute('data-compact')) meta = '<p class="detail__compact">When, Who, What, Where and Record as in State 1.</p>';
      return head + meta + body;
    },
    /* Gap 6 admin side: tombstone row in a revealed transcript */
    'm1-tombstone-admin': function () {
      return '<div class="transcript">' +
        '<div class="tline"><span class="tline__who">Dan Mitchell <span class="num">18:48</span></span><blockquote class="detail__prompt">Summarize the latest partner status tracker</blockquote></div>' +
        '<div class="tline tline--tomb">' + icon('archive', 14) + '<span><strong>Removed from the employee’s history</strong> by Dan Mitchell · <span class="num">09/16 18:52 PDT</span><span class="detail__sub">Retained agency record. Content shown because access was recorded under <span class="num">' + esc(m1.access.ref) + '</span>.</span></span></div>' +
        '<div class="tline"><span class="tline__who">Dan Mitchell <span class="num">18:50</span></span><blockquote class="detail__prompt">Also add Litware’s contract value from the procurement folder</blockquote></div>' +
        '<div class="tline tline--meta"><span class="hold hold--on">' + m1Icon('hold', 14) + 'Legal hold</span> badge for a record under hold (state to design) ' + placeholder('Q17', '', 'who may see hold status and the retention end', true) + '</div></div>';
    },
    /* Gap 4 budgets key state */
    'm1-budget-units': function () {
      var b = m1.budget;
      return '<div class="budget__bar"><span class="pill">' + esc(b.period) + '</span>' + placeholder('Q14', 'timezone', 'Which timezone the period uses.', true) + '</div>' +
        '<div class="notice notice--warn" role="status">' + m1Icon('alert', 16) + '<span>' + esc(b.overAllocation) + ' ' + confirmTag('Q14', 'over-allocation allowed') + '</span></div>' +
        '<div class="table-wrap"><table class="data-table data-table--budget"><thead><tr><th scope="col">Unit</th><th scope="col">Limit type</th><th scope="col" class="col-cost">Monthly limit</th><th scope="col" class="col-cost">Used</th><th scope="col">Status</th></tr></thead><tbody>' +
        b.units.map(function (u) {
          var status = u.draft ? '<span class="status status--neutral">Draft · excluded</span>' : (u.pct === null ? '<span class="muted">' + esc(u.note || '—') + '</span>' : '<span class="status status--ok">Within limit · <span class="num">' + u.pct + '%</span></span>');
          return '<tr><td><span class="unit-name" style="--depth:' + u.depth + '">' + esc(u.name) + '</span></td><td><span class="ltype ltype--' + u.type.split(' ')[0].toLowerCase() + '">' + esc(u.type) + '</span></td><td class="col-cost num">' + esc(u.limit) + '</td><td class="col-cost num">' + esc(u.used) + '</td><td>' + status + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<p class="budget__scope">' + icon('users', 14) + '<span>Scope: ' + esc(b.scope) + '</span> ' + placeholder('Q15', '', 'whether units added later are included', true) + '</p>' +
        placeholder('Q14', 'agency rules (soft notify / route / hard stop)', 'The rules table ships after the client defines precedence: whether parent limits are enforceable caps or roll-ups, allocated or shared, and whether per-user overrides exist.');
    }
  };
  for (var m1Key in m1Render) render[m1Key] = m1Render[m1Key];

  /* Opt-in interaction wiring (concept 07; 06 may reuse data-toggle). No other concept uses these attributes.
     data-toggle="id"   toggles .is-open on #id and aria-expanded on every toggle for it. Non-modal: focus moves in on open
                        and back to the element that opened it on close (Escape or any toggle). Static demo menus (.mmenu--static) ignore Escape.
     role="option"      in a .mmenu: Arrow/Home/End move, Enter/Space or click selects, updates the trigger label and closes.
     data-gate-action   steps the transcript gate (closed → form → recording → revealed | failed). The reason form is validated
                        and the recorded purpose and reference are what the revealed banner shows. */
  var wired = false;
  function wire() {
    if (wired) return; wired = true;
    var openers = {};
    function setOpen(t, open, opener) {
      if (!t) return;
      t.classList.toggle('is-open', open);
      document.querySelectorAll('[data-toggle="' + t.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
      if (open) {
        if (opener && !t.contains(opener)) openers[t.id] = opener;
        var f = t.querySelector('[role="option"][aria-selected="true"]:not([aria-disabled]), [role="option"]:not([aria-disabled]), a, button:not([disabled]), input, select, textarea');
        if (f) f.focus();
        return;
      }
      var back = openers[t.id]; delete openers[t.id];
      if (!back || !back.offsetParent) back = [].slice.call(document.querySelectorAll('[data-toggle="' + t.id + '"]')).filter(function (b) { return !t.contains(b) && b.offsetParent; })[0];
      var at = document.activeElement;
      if (back && (!at || at === document.body || at === back || t.contains(at))) back.focus();
    }
    function options(menu) { return [].slice.call(menu.querySelectorAll('[role="option"]:not([aria-disabled])')); }
    function choose(opt) {
      var menu = opt.closest('.mmenu');
      menu.querySelectorAll('[role="option"]').forEach(function (o) {
        var on = o === opt;
        o.setAttribute('aria-selected', on ? 'true' : 'false'); o.classList.toggle('is-current', on);
        var chk = o.querySelector('.icon--check'); if (chk && !on) chk.remove();
        if (on && !chk) o.querySelector('.mopt__top').insertAdjacentHTML('beforeend', m1Icon('check', 16));
      });
      var trigger = document.querySelector('[data-toggle="' + menu.id + '"]');
      if (trigger && trigger.firstChild && trigger.firstChild.nodeType === 3) trigger.firstChild.textContent = opt.querySelector('.mopt__name').textContent + ' ';
      if (!menu.classList.contains('mmenu--static')) { setOpen(menu, false); if (trigger) trigger.focus(); }
    }
    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      var btn = e.target.closest('[data-toggle]');
      if (btn) { e.preventDefault(); var t = document.getElementById(btn.getAttribute('data-toggle')); if (t) setOpen(t, !t.classList.contains('is-open'), btn); return; }
      var opt = e.target.closest('.mmenu [role="option"]');
      if (opt) { if (!opt.hasAttribute('aria-disabled')) choose(opt); return; }
      var g = e.target.closest('[data-gate-action]');
      if (g && !(g.type === 'submit' && g.form)) { e.preventDefault(); gateTo(g.closest('[data-slot="m1-event-drawer"]'), g.getAttribute('data-gate-action')); }
    });
    document.addEventListener('submit', function (e) {
      var slot = e.target.closest && e.target.closest('[data-slot="m1-event-drawer"]');
      if (!slot) return;
      e.preventDefault();
      var form = e.target, ref = form.querySelector('[name="ref"]'), purpose = form.querySelector('[name="purpose"]');
      var err = form.querySelector('.field__error'); if (err) err.remove();
      ref.removeAttribute('aria-invalid');
      if (!ref.value.trim()) {
        ref.setAttribute('aria-invalid', 'true');
        ref.insertAdjacentHTML('afterend', '<span class="field__error" id="' + ref.id + '-err" role="alert">Enter the reference for this access, such as a records request or ticket number.</span>');
        ref.setAttribute('aria-describedby', ref.id + '-err');
        ref.focus();
        return;
      }
      slot.setAttribute('data-ref', ref.value.trim());
      slot.setAttribute('data-purpose', purpose.value);
      gateTo(slot, 'submit');
    });
    document.addEventListener('keydown', function (e) {
      var opt = e.target.closest && e.target.closest('.mmenu [role="option"]');
      if (opt && /^(ArrowDown|ArrowUp|Home|End|Enter| )$/.test(e.key)) {
        e.preventDefault();
        if (e.key === 'Enter' || e.key === ' ') { if (!opt.hasAttribute('aria-disabled')) choose(opt); return; }
        var list = options(opt.closest('.mmenu')), i = list.indexOf(opt);
        var next = e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : e.key === 'ArrowDown' ? Math.min(list.length - 1, i + 1) : Math.max(0, i - 1);
        list[next].focus();
        return;
      }
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.is-open[id]:not(.mmenu--static)').forEach(function (t) { setOpen(t, false); });
    });
    function gateTo(slot, state) {
      if (!slot) return;
      if (state === 'submit') { state = 'recording'; setTimeout(function () { gateTo(slot, slot.getAttribute('data-gate-next') || 'revealed'); }, 700); }
      slot.setAttribute('data-gate', state);
      slot.innerHTML = render['m1-event-drawer'](slot);
      mountIcons(slot);
      var focusEl = slot.querySelector('.gate [tabindex="-1"], .gate__title, [role="status"], [role="alert"]') || slot.querySelector('.detail__title');
      if (focusEl) { if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1'); focusEl.focus(); }
    }
  }
  function mountIcons(rootEl) {
    var icons = rootEl.querySelectorAll('[data-icon]');
    for (var j = 0; j < icons.length; j++) icons[j].innerHTML = icon(icons[j].getAttribute('data-icon'), parseInt(icons[j].getAttribute('data-size') || '16', 10));
    var m1i = rootEl.querySelectorAll('[data-m1-icon]');
    for (var n = 0; n < m1i.length; n++) m1i[n].innerHTML = m1Icon(m1i[n].getAttribute('data-m1-icon'), parseInt(m1i[n].getAttribute('data-size') || '16', 10));
  }

  function mount(scope) {
    var rootEl = scope || document;
    var slots = rootEl.querySelectorAll('[data-slot]');
    for (var i = 0; i < slots.length; i++) {
      var el = slots[i], name = el.getAttribute('data-slot');
      if (render[name]) el.innerHTML = render[name](el);
    }
    var icons = rootEl.querySelectorAll('[data-icon]');
    for (var j = 0; j < icons.length; j++) {
      var ie = icons[j];
      ie.innerHTML = icon(ie.getAttribute('data-icon'), parseInt(ie.getAttribute('data-size') || '16', 10));
    }
    var texts = rootEl.querySelectorAll('[data-text]');
    for (var k = 0; k < texts.length; k++) {
      var te = texts[k], path = te.getAttribute('data-text').split('.'), v = window.HARBOR;
      for (var p = 0; p < path.length; p++) v = v ? v[path[p]] : undefined;
      if (v !== undefined) te.textContent = v;
    }
    var m1i = rootEl.querySelectorAll('[data-m1-icon]');
    for (var n = 0; n < m1i.length; n++) m1i[n].innerHTML = m1Icon(m1i[n].getAttribute('data-m1-icon'), parseInt(m1i[n].getAttribute('data-size') || '16', 10));
    if (rootEl.querySelector('[data-toggle], [data-gate-action]')) wire();
    if (!scope) loadInteract();
  }

  /* Shared prototype interactions (model picker, ask → answer, record types, record drawer) load once after the first full mount.
     A page can opt out with window.HARBOR_STATIC = true before content.js runs. */
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/content\.js(\?.*)?$/, '') || '../common/';
  var interactLoaded = false;
  function loadInteract() {
    if (interactLoaded || window.HARBOR_STATIC) return;
    interactLoaded = true;
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = BASE + 'interact.css'; document.head.appendChild(l);
    var s = document.createElement('script'); s.src = BASE + 'interact.js'; document.body.appendChild(s);
  }

  window.HARBOR = { chat: chat, spend: spend, activity: activity, m1: m1, icon: icon, m1Icon: m1Icon, lockup: lockup, brandmark: brandmark, render: render, mount: mount };
})();
