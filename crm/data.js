/* TechPower CRM prototype · sample data.
   Everything here is invented. No company, person, domain or figure comes from the live CRM, and nothing is reused
   from the Harbor concepts' sample organisation. Domains use the reserved .example TLD and phones the 555-01xx range,
   so no value can point at a real organisation or person.
   The prototype's "today" is fixed (CRM_DATA.today), so dates, overdue counts and screenshots repeat run to run.
   Load before crm.js. */
(function () {
  'use strict';

  var TODAY = '2026-11-09';   /* a Monday */

  /* ---------- people who use the CRM ---------- */
  var REPS = [
    { id: 'jr', name: 'Jamie Rourke', role: 'admin', email: 'jamie.rourke', manager: null, status: 'active', you: true, created: '2025-03-10' },
    { id: 'ps', name: 'Priya Sandhu', role: 'sales_manager', email: 'priya.sandhu', manager: null, status: 'active', created: '2025-03-10' },
    { id: 'mb', name: 'Marcus Bell', role: 'sales_rep', email: 'marcus.bell', manager: 'ps', status: 'active', created: '2025-04-02' },
    { id: 'er', name: 'Elena Ruiz', role: 'sales_rep', email: 'elena.ruiz', manager: 'ps', status: 'active', created: '2025-04-02' },
    { id: 'tb', name: 'Tom Becker', role: 'sales_rep', email: 'tom.becker', manager: 'ps', status: 'active', created: '2025-06-16' },
    { id: 'no', name: 'Nina Osei', role: 'biz_dev_rep', email: 'nina.osei', manager: 'ps', status: 'active', created: '2025-09-08' },
    { id: 'sw', name: 'Sam Whitley', role: 'biz_dev_rep', email: 'sam.whitley', manager: 'ps', status: 'active', created: '2026-01-12' },
    { id: 'lk', name: 'Lena Kovac', role: 'sales_rep', email: 'lena.kovac', manager: 'ps', status: 'deactivated', created: '2025-06-16' }
  ];
  /* sign-ins that aren't people, shown only on Users with a Test badge as today; kept out of REPS so they never appear
     as an owner, a rep filter or a reassign choice */
  var TEST_USERS = [
    { id: 'qa', name: 'QA Test Rep', role: 'sales_rep', email: 'qa.test', manager: 'ps', status: 'active', test: true, created: '2026-10-05' }
  ];
  /* technical staff (live's Engineer role): they sign in, own their records and join calls, but don't sell, so like the test
     users they're listed on Users only, never as an owner, a rep filter or a reassign choice */
  var ENGINEERS = [
    { id: 'dk', name: 'Dana Kim', role: 'engineer', email: 'dana.kim', manager: null, status: 'active', created: '2026-02-23' },
    { id: 'rv', name: 'Ravi Varma', role: 'engineer', email: 'ravi.varma', manager: null, status: 'deactivated', created: '2025-08-04' }
  ];
  /* human labels (audit M2), in live's order */
  var ROLES = { admin: 'Admin', sales_manager: 'Sales Manager', biz_dev_rep: 'Biz Dev Rep', sales_rep: 'Sales Rep', engineer: 'Engineer' };
  var DOMAIN = 'techpower.example';

  /* ---------- accounts ---------- */
  var VERTICALS = ['Government', 'Education', 'Healthcare', 'Utilities', 'Manufacturing', 'Transportation'];
  /* the vendors an account already buys from (the Uses vendor filter and the record's Vendors tab); fictional names */
  var VENDORS = ['Keelside Networks', 'Northgate Telecom', 'Saltmarsh Security', 'Tollan Cloud'];
  var ACCOUNTS = [
    { id: 'a01', name: 'Halvorsen Logistics', domain: 'halvorsen-logistics.example', city: 'Tulsa', state: 'OK', vertical: 'Transportation', revenue: 48000000, employees: 420, tags: ['Mid-Market'], vendors: ['Keelside Networks'], owner: 'mb', created: '2026-02-11' },
    { id: 'a02', name: 'Brightwater Utility District', domain: 'brightwater-ud.example', city: 'Fort Collins', state: 'CO', vertical: 'Utilities', revenue: 112000000, employees: 960, tags: ['Mid-Market', 'Gov'], vendors: ['Northgate Telecom', 'Tollan Cloud'], owner: 'er', created: '2025-09-30' },
    { id: 'a03', name: 'Pine Hollow School District', domain: 'pinehollow-sd.example', city: 'Lubbock', state: 'TX', vertical: 'Education', revenue: 86000000, employees: 1350, tags: ['Enterprise', 'Gov'], vendors: ['Keelside Networks'], owner: 'tb', created: '2025-06-02' },
    { id: 'a04', name: 'Meridian County', domain: 'meridian-county.example', city: 'Las Cruces', state: 'NM', vertical: 'Government', revenue: 230000000, employees: 2100, tags: ['Gov', 'Enterprise'], vendors: ['Saltmarsh Security'], owner: 'mb', created: '2026-04-19' },
    { id: 'a05', name: 'Corvid Fabrication', domain: 'corvid-fab.example', city: 'Little Rock', state: 'AR', vertical: 'Manufacturing', revenue: 27500000, employees: 185, tags: ['SMB'], vendors: [], owner: 'er', created: '2026-07-08' },
    { id: 'a06', name: 'Saint Alder Health', domain: 'saintalder.example', city: 'Shreveport', state: 'LA', vertical: 'Healthcare', revenue: 310000000, employees: 3400, tags: ['Enterprise'], vendors: ['Northgate Telecom'], owner: 'tb', created: '2026-01-23' },
    { id: 'a07', name: 'Redstone Transit Authority', domain: 'redstone-transit.example', city: 'Amarillo', state: 'TX', vertical: 'Transportation', revenue: 64000000, employees: 610, tags: ['Mid-Market', 'DFW CIO/CTO Happy Hour'], vendors: ['Keelside Networks', 'Saltmarsh Security'], owner: 'mb', created: '2025-11-14' },
    { id: 'a08', name: 'Quarry Lake Community College', domain: 'quarrylake-cc.example', city: 'Norman', state: 'OK', vertical: 'Education', revenue: 41000000, employees: 520, tags: [], vendors: [], owner: 'er', created: '2026-05-27' },
    { id: 'a09', name: 'Tamsin Water Works', domain: 'tamsin-water.example', city: 'Pueblo', state: 'CO', vertical: 'Utilities', revenue: 19800000, employees: 140, tags: ['SMB'], vendors: ['Tollan Cloud'], owner: 'tb', created: '2025-08-05' },
    { id: 'a10', name: 'Ostrander Precision', domain: 'ostrander-precision.example', city: 'Wichita', state: 'KS', vertical: 'Manufacturing', revenue: 73000000, employees: 690, tags: ['Mid-Market'], vendors: [], owner: 'mb', created: '2026-03-02' },
    { id: 'a11', name: 'City of Granite Falls', domain: 'granitefalls-city.example', city: 'Granite Falls', state: 'TX', vertical: 'Government', revenue: 52000000, employees: 480, tags: ['Gov'], vendors: [], owner: 'er', created: '2026-08-16' },
    { id: 'a12', name: 'Lowell Valley Clinics', domain: 'lowellvalley.example', city: 'Baton Rouge', state: 'LA', vertical: 'Healthcare', revenue: 95000000, employees: 870, tags: [], vendors: ['Northgate Telecom'], owner: 'tb', created: '2025-12-09' },
    { id: 'a13', name: 'Fenwick Freight Lines', domain: 'fenwick-freight.example', city: 'Joplin', state: 'MO', vertical: 'Transportation', revenue: 36000000, employees: 300, tags: ['Mid-Market'], vendors: [], owner: 'mb', created: '2026-09-21' },
    { id: 'a14', name: 'Harrow Ridge ISD', domain: 'harrowridge-isd.example', city: 'Abilene', state: 'TX', vertical: 'Education', revenue: 58000000, employees: 940, tags: [], vendors: [], owner: 'er', created: '2026-06-30' },
    { id: 'a15', name: 'Vantor Electric Cooperative', domain: 'vantor-coop.example', city: 'Enid', state: 'OK', vertical: 'Utilities', revenue: 128000000, employees: 760, tags: ['Mid-Market'], vendors: ['Keelside Networks', 'Tollan Cloud'], owner: 'tb', created: '2025-07-17' },
    { id: 'a16', name: 'Kestrel Components', domain: 'kestrel-components.example', city: 'Fort Smith', state: 'AR', vertical: 'Manufacturing', revenue: 22000000, employees: 160, tags: ['SMB'], vendors: [], owner: 'mb', created: '2026-10-28' }
  ];

  /* an account's vendor relationships, as the live Edit account form keeps them: the vendor and how the account relates to
     it, from the live form's list (Customer first, its default). The vendors above are ones each account buys from today.
     Contacts have no vendor relationships in live. */
  var VENDOR_TYPES = ['Customer', 'Partner', 'Competitor', 'Prospect'];
  ACCOUNTS.forEach(function (a) { a.vendors = a.vendors.map(function (v) { return { vendor: v, type: 'Customer' }; }); });

  /* ---------- contacts ---------- */
  var CONTACTS = [
    { id: 'c01', name: 'Grace Lindqvist', title: 'IT Director', account: 'a01', email: 'g.lindqvist', phone: '(555) 010-2231', owner: 'mb', dm: true, called: true, tags: [], created: '2026-02-12' },
    { id: 'c02', name: 'Owen Prescott', title: 'Network Manager', account: 'a01', email: 'o.prescott', phone: '(555) 010-2240', owner: 'mb', dm: false, called: false, tags: [], created: '2026-03-04' },
    { id: 'c03', name: 'Hana Moreau', title: 'CIO', account: 'a02', email: 'h.moreau', phone: '(555) 010-3302', owner: 'er', dm: true, called: true, tags: [], created: '2025-10-02' },
    { id: 'c04', name: 'Dmitri Volkov', title: 'Technology Coordinator', account: 'a03', email: 'd.volkov', phone: '(555) 010-4410', owner: 'tb', dm: false, called: true, tags: [], created: '2025-06-09' },
    { id: 'c05', name: 'Rachel Abernathy', title: 'Superintendent', account: 'a03', email: 'r.abernathy', phone: '(555) 010-4401', owner: 'tb', dm: true, called: false, tags: ['DFW CIO/CTO Happy Hour'], created: '2025-06-09' },
    { id: 'c06', name: 'Luis Carrasco', title: 'County IT Manager', account: 'a04', email: 'l.carrasco', phone: '(555) 010-5120', owner: 'mb', dm: true, called: true, tags: [], created: '2026-04-21' },
    { id: 'c07', name: 'Imani Brooks', title: 'Plant Operations Lead', account: 'a05', email: 'i.brooks', phone: '(555) 010-6033', owner: 'er', dm: false, called: false, tags: [], created: '2026-07-10' },
    { id: 'c08', name: 'Peter Haldane', title: 'VP Information Systems', account: 'a06', email: 'p.haldane', phone: '(555) 010-7015', owner: 'tb', dm: true, called: true, tags: [], created: '2026-01-26' },
    { id: 'c09', name: 'Aiko Tanabe', title: 'Systems Administrator', account: 'a07', email: 'a.tanabe', phone: '(555) 010-8122', owner: 'mb', dm: false, called: true, tags: ['DFW CIO/CTO Happy Hour'], created: '2025-11-18' },
    { id: 'c10', name: 'Victor Ndlovu', title: 'Dean of Technology', account: 'a08', email: 'v.ndlovu', phone: '(555) 010-9004', owner: 'er', dm: true, called: false, tags: [], created: '2026-05-29' },
    { id: 'c11', name: 'Claire Ashby', title: 'General Manager', account: 'a09', email: 'c.ashby', phone: '(555) 011-0210', owner: 'tb', dm: true, called: true, tags: [], created: '2025-08-07' },
    { id: 'c12', name: 'Rafael Santos', title: 'IT Manager', account: 'a10', email: 'r.santos', phone: '(555) 011-1307', owner: 'mb', dm: false, called: false, tags: [], created: '2026-11-02' },
    { id: 'c13', name: 'Joanna Pike', title: 'City Administrator', account: 'a11', email: 'j.pike', phone: '(555) 011-2018', owner: 'er', dm: true, called: true, tags: [], created: '2026-08-18' },
    { id: 'c14', name: 'Benedict Mwangi', title: 'Director of IT Security', account: 'a12', email: 'b.mwangi', phone: '(555) 011-3125', owner: 'tb', dm: true, called: false, tags: [], created: '2025-12-11' },
    { id: 'c15', name: 'Sofia Lindgren', title: 'Operations Manager', account: 'a13', email: 's.lindgren', phone: '(555) 011-4009', owner: 'mb', dm: false, called: true, tags: [], created: '2026-09-23' },
    { id: 'c16', name: 'Ezra Whitcombe', title: 'Technology Director', account: 'a14', email: 'e.whitcombe', phone: '(555) 011-5116', owner: 'er', dm: true, called: false, tags: [], created: '2026-07-01' }
  ];

  /* each contact's own address, phones and emails, as the live Edit contact form keeps them. The address starts at the
     account's city; phones and emails are lists with a type and exactly one primary. c.phone and c.email stay as the
     primary ones, which the list, the search and the record header read. */
  var STATE_NAMES = { AR: 'Arkansas', CO: 'Colorado', KS: 'Kansas', LA: 'Louisiana', MO: 'Missouri', NM: 'New Mexico', OK: 'Oklahoma', TX: 'Texas' };
  var ZIP_PREFIX = { AR: '722', CO: '805', KS: '672', LA: '711', MO: '648', NM: '880', OK: '741', TX: '791' };
  var STREETS = ['Main Street', 'Commerce Drive', 'Oak Avenue', 'Industrial Parkway'];
  var PHONE_TYPES = ['work', 'mobile', 'home', 'other'], EMAIL_TYPES = ['work', 'personal', 'other'];
  var EXTRA_PHONES = { c03: [{ number: '(555) 019-4471', ext: '', type: 'mobile', primary: false }], c06: [{ number: '(555) 010-5100', ext: '214', type: 'work', primary: false }] };
  var EXTRA_EMAILS = { c03: [{ address: 'hana.moreau@pm.example', type: 'personal', primary: false }] };
  CONTACTS.forEach(function (c, i) {
    var a = ACCOUNTS.filter(function (x) { return x.id === c.account; })[0];
    c.address = { street: (120 + i * 37) + ' ' + STREETS[i % STREETS.length], street2: i % 3 === 0 ? 'Suite ' + (100 + i * 10) : '',
      city: a.city, state: a.state, zip: ZIP_PREFIX[a.state] + String(10 + i * 7).slice(-2), country: 'United States' };
    c.phones = [{ number: c.phone, ext: '', type: 'work', primary: true }].concat(EXTRA_PHONES[c.id] || []);
    c.emails = [{ address: c.email + '@' + a.domain, type: 'work', primary: true }].concat(EXTRA_EMAILS[c.id] || []);
  });

  /* ---------- pipeline: the live CRM's six stages, numbered as the live board numbers them. full is the live name;
     name is a short one for menus, filters and the Dashboard rows. Labels show the long name, as today, until audit M7 is
     decided (CRM.stage in crm.js). The ids predate the live names and stay so links and filters keep working.
     Closed holds won and lost deals, so it is not open pipeline (closed: true). ---------- */
  var STAGES = [
    { id: 'lead', name: 'Prospect', full: 'Prospect Stage' },
    { id: 'discovery', name: 'Not qualified', full: 'Potential Future Project (Not Qualified)' },
    { id: 'qualified', name: 'BANT', full: 'BANT Qualification (Budget, Authority, Need, Timeline)' },
    { id: 'proposal', name: 'Proposal', full: 'Quote/Proposal in Development' },
    { id: 'negotiation', name: 'Pricing finalized', full: 'Solution Refined/Pricing Finalized >50% Chance of Winning' },
    { id: 'closed', name: 'Closed', full: 'Closed (Won/Lost)', closed: true }
  ];
  /* originator: who sourced the deal (often a Biz Dev rep); outcome: open, won or lost */
  var OPPS = [
    { id: 'o01', title: 'Network refresh', account: 'a01', owner: 'mb', stage: 'discovery', amount: 185000, close: '2026-12-18', renewal: false, recurrence: 'One-time', campaign: null, originator: 'no', coowners: [], tags: ['Mid-Market'], outcome: 'open', updated: '2026-10-27T11:20' },
    { id: 'o02', title: 'Managed SOC, 3 years', account: 'a02', owner: 'er', stage: 'negotiation', amount: 640000, close: '2026-11-27', renewal: true, recurrence: 'Multi-year', campaign: null, originator: 'er', coowners: ['tb'], tags: ['Gov'], notes: 'Hana wants 24/7 coverage for the SCADA network included. Board vote on the budget is Nov 20.', outcome: 'open', updated: '2026-11-04T16:10' },
    { id: 'o03', title: 'Chromebook fleet support', account: 'a03', owner: 'tb', stage: 'closed', amount: 96000, close: '2026-11-06', renewal: true, recurrence: 'Annual', campaign: null, originator: 'tb', coowners: [], tags: ['Gov'], outcome: 'won', updated: '2026-11-06T13:40' },
    { id: 'o04', title: 'County data center move', account: 'a04', owner: 'mb', stage: 'proposal', amount: 1250000, close: '2027-02-26', renewal: false, recurrence: 'One-time', campaign: null, originator: 'sw', coowners: ['ps'], tags: ['Gov'], outcome: 'open', updated: '2026-11-03T15:05' },
    { id: 'o05', title: 'Plant floor Wi-Fi', account: 'a05', owner: 'er', stage: 'lead', amount: 42000, close: '2027-01-15', renewal: false, recurrence: 'One-time', campaign: null, originator: 'no', coowners: [], tags: ['SMB'], outcome: 'open', updated: '2026-10-21T09:05' },
    { id: 'o06', title: 'EHR backup and recovery', account: 'a06', owner: 'tb', stage: 'qualified', amount: 360000, close: '2027-01-29', renewal: false, recurrence: 'One-time', campaign: null, originator: 'sw', coowners: ['mb'], tags: ['Enterprise'], outcome: 'open', updated: '2026-10-30T16:44' },
    { id: 'o07', title: 'Fare system cloud migration', account: 'a07', owner: 'mb', stage: 'proposal', amount: 275000, close: '2026-11-03', renewal: false, recurrence: 'One-time', campaign: null, originator: 'mb', coowners: [], tags: ['Mid-Market'], outcome: 'open', updated: '2026-10-19T14:22' },
    { id: 'o08', title: 'Campus firewall upgrade', account: 'a08', owner: 'er', stage: 'discovery', amount: 88000, close: '2026-12-11', renewal: false, recurrence: 'One-time', campaign: null, originator: 'no', coowners: [], tags: [], outcome: 'open', updated: '2026-10-28T10:48' },
    { id: 'o09', title: 'SCADA support renewal', account: 'a09', owner: 'tb', stage: 'negotiation', amount: 54000, close: '2026-10-30', renewal: true, recurrence: 'Annual', campaign: null, originator: 'tb', coowners: [], tags: ['SMB'], outcome: 'open', updated: '2026-10-24T15:30' },
    { id: 'o10', title: 'ERP hosting', account: 'a10', owner: 'mb', stage: 'qualified', amount: 410000, close: '2027-03-12', renewal: false, recurrence: 'Monthly', campaign: null, originator: 'mb', coowners: [], tags: ['Mid-Market'], outcome: 'open', updated: '2026-11-02T11:05' },
    { id: 'o11', title: 'Public Wi-Fi, 12 sites', account: 'a11', owner: 'er', stage: 'lead', amount: 120000, close: '2027-02-05', renewal: false, recurrence: 'One-time', campaign: null, originator: 'sw', coowners: [], tags: ['Gov'], outcome: 'open', updated: '2026-10-15T08:50' },
    { id: 'o12', title: 'Clinic VoIP rollout', account: 'a12', owner: 'tb', stage: 'closed', amount: 158000, close: '2026-11-09', renewal: false, recurrence: 'One-time', campaign: null, originator: 'tb', coowners: [], tags: [], outcome: 'won', updated: '2026-11-09T09:15' },
    { id: 'o13', title: 'Fleet telematics integration', account: 'a13', owner: 'mb', stage: 'discovery', amount: 67000, close: '2027-01-08', renewal: false, recurrence: 'One-time', campaign: null, originator: 'no', coowners: [], tags: ['Mid-Market'], outcome: 'open', updated: '2026-10-22T13:12' },
    { id: 'o14', title: 'Classroom AV refresh', account: 'a14', owner: 'er', stage: 'proposal', amount: 212000, close: '2026-12-04', renewal: false, recurrence: 'One-time', campaign: 'm1', originator: 'er', coowners: [], tags: [], outcome: 'open', updated: '2026-11-05T10:02' },
    { id: 'o15', title: 'Managed print renewal', account: 'a15', owner: 'tb', stage: 'closed', amount: 38500, close: '2026-11-02', renewal: true, recurrence: 'Annual', campaign: null, originator: 'tb', coowners: [], tags: ['Mid-Market'], outcome: 'lost', updated: '2026-11-02T17:25' },
    { id: 'o16', title: 'OT security assessment', account: 'a16', owner: 'mb', stage: 'lead', amount: 24000, close: '2027-01-22', renewal: false, recurrence: 'One-time', campaign: null, originator: 'sw', coowners: [], tags: ['SMB'], outcome: 'open', updated: '2026-10-12T10:30' }
  ];

  /* ---------- tasks: today, recent overdue (≤ 7 days), older overdue, upcoming, no due date (audit H7). Live's fields:
     priority (low / medium / high / urgent) and status (pending unless set: progress, done, cancelled) ---------- */
  var TASKS = [
    { id: 't01', title: 'Call Grace about the network survey', priority: 'high', rel: ['contact', 'c01'], owner: 'jr', due: '2026-11-09' },
    { id: 't02', title: 'Send the SOC pricing sheet', priority: 'medium', rel: ['opportunity', 'o02'], owner: 'jr', due: '2026-11-09' },
    { id: 't03', title: 'Prep the Pine Hollow renewal call', priority: 'high', rel: ['opportunity', 'o03'], owner: 'jr', due: '2026-11-09' },
    { id: 't04', title: 'Follow up on the county RFP questions', priority: 'urgent', rel: ['account', 'a04'], owner: 'jr', due: '2026-11-09' },
    { id: 't05', title: 'Confirm Thursday demo with Saint Alder', priority: 'medium', rel: ['contact', 'c08'], owner: 'jr', due: '2026-11-09' },
    { id: 't06', title: 'Chase the signed SCADA renewal', priority: 'urgent', rel: ['opportunity', 'o09'], owner: 'jr', due: '2026-11-06' },
    { id: 't07', title: 'Update the fare system proposal', priority: 'medium', status: 'progress', rel: ['opportunity', 'o07'], owner: 'jr', due: '2026-11-05' },
    { id: 't08', title: 'Intro email to the new IT manager', priority: 'low', rel: ['contact', 'c12'], owner: 'jr', due: '2026-11-04' },
    { id: 't09', title: 'Log notes from the Brightwater call', priority: 'low', rel: ['account', 'a02'], owner: 'jr', due: '2026-11-03' },
    { id: 't10', title: 'Second touch: Quarry Lake', priority: 'medium', rel: ['contact', 'c10'], owner: 'jr', due: '2026-09-18' },
    { id: 't11', title: 'Second touch: Harrow Ridge', priority: 'low', rel: ['contact', 'c16'], owner: 'jr', due: '2026-08-27' },
    { id: 't12', title: 'Send case study to Corvid', priority: 'medium', rel: ['account', 'a05'], owner: 'jr', due: '2026-07-14' },
    { id: 't13', title: 'Quarterly check-in: Vantor', priority: 'medium', rel: ['account', 'a15'], owner: 'jr', due: '2026-11-10' },
    { id: 't14', title: 'Draft the ERP hosting SOW', priority: 'high', rel: ['opportunity', 'o10'], owner: 'jr', due: '2026-11-12' },
    { id: 't15', title: 'Book a site walk at Granite Falls', priority: 'low', rel: ['account', 'a11'], owner: 'jr', due: '2026-11-16' },
    { id: 't16', title: 'Read the county IT strategy PDF', priority: 'low', rel: ['account', 'a04'], owner: 'jr', due: null }
  ];
  /* list totals beyond the sample rows, for counts and pagers */
  var TOTALS = {
    accounts: 2418, contacts: 9730, openOpps: 186, pipeline: 14820000,
    /* deals by stage, [deals, value]; the open stages sum to openOpps and pipeline. Closed is won and lost deals, with its
       split by outcome as the live Closed column shows it (the rest of Closed has no outcome set yet) */
    byStage: { lead: [58, 2100000], discovery: [44, 3000000], qualified: [31, 3400000], proposal: [25, 3600000], negotiation: [28, 2720000], closed: [50, 1900000] },
    closedBy: { won: [41, 1600000], lost: [6, 70000] },
    /* open pipeline by owner, [deals, value]; also sums to openOpps and pipeline */
    byOwner: { mb: [62, 5900000], er: [54, 4300000], tb: [47, 3100000], ps: [13, 1200000], no: [6, 180000], sw: [4, 140000] },
    tasks: { today: 5, overdueRecent: 4, overdueOlder: 1287, upcoming: 23, noDate: 61, done: 14 },
    activitiesThisWeek: 47,   /* since Monday 00:00, all reps */
    calls: 6418, activityLog: 15904   /* all dates, all reps: the Calls & Activity pagers */
  };

  /* ---------- calls, newest first: who was called, by whom, and what PhoneBurner recorded for it, as today's Calls tab:
     disp (the disposition), answered (who picked up: dm decision maker, gk gatekeeper, '' nobody or not known), secs
     (talk time in seconds; a voicemail has one too), note. Whether a call connected follows from its disposition
     (DISPOSITIONS). Each call also appears in ACTIVITY. ---------- */
  var CALLS = [
    { id: 'k01', contact: 'c06', rep: 'mb', at: '2026-11-09T09:42', disp: 'interested', answered: 'dm', secs: 372, note: 'Walked through the move timeline; wants the proposal by Friday.' },
    { id: 'k02', contact: 'c01', rep: 'no', at: '2026-11-09T09:20', disp: 'vm', answered: '', secs: 65, note: 'Left a voicemail about the network survey.' },
    { id: 'k03', contact: 'c09', rep: 'mb', at: '2026-11-09T09:05', disp: 'unavailable', answered: 'gk', secs: 124, note: 'Front desk took a message for the IT lead.' },
    { id: 'k04', contact: 'c15', rep: 'mb', at: '2026-11-09T08:51', disp: 'na', answered: '', secs: 31, note: '' },
    { id: 'k05', contact: 'c13', rep: 'sw', at: '2026-11-06T11:20', disp: 'vm', answered: '', secs: 52, note: 'Will try again on Tuesday.' },
    { id: 'k06', contact: 'c04', rep: 'tb', at: '2026-11-06T10:34', disp: 'interested', answered: 'dm', secs: 680, note: 'Renewal terms agreed in principle; sending the paperwork.' },
    { id: 'k07', contact: 'c11', rep: 'tb', at: '2026-11-06T09:12', disp: 'interested', answered: 'dm', secs: 248, note: 'Signed SCADA renewal promised by Wednesday.' },
    { id: 'k08', contact: 'c14', rep: 'tb', at: '2026-11-05T15:40', disp: 'notint', answered: 'gk', secs: 75, note: '' },
    { id: 'k09', contact: 'c10', rep: 'er', at: '2026-11-05T14:02', disp: 'wrong', answered: '', secs: 12, note: '' },
    { id: 'k10', contact: 'c16', rep: 'no', at: '2026-11-05T11:15', disp: 'interested', answered: 'dm', secs: 580, note: 'Booked an AV walkthrough for Nov 12.' },
    { id: 'k11', contact: 'c03', rep: 'er', at: '2026-11-04T16:25', disp: 'interested', answered: 'dm', secs: 842, note: 'Reviewed the SOC scope; pricing to follow by email.' },
    { id: 'k12', contact: 'c12', rep: 'mb', at: '2026-11-04T10:48', disp: 'vm', answered: '', secs: 48, note: '' }
  ];
  /* PhoneBurner's dispositions, as today's Calls tab shows them (in sentence case): [label, connected, badge tone].
     Interested is assumed: today's sample showed only calls that went nowhere. */
  var DISPOSITIONS = {
    interested: ['Interested', true, 'ok'], notint: ['Not interested', true, 'neutral'], unavailable: ['Unavailable', true, 'outline'],
    wrong: ['Wrong number', true, 'outline'], vm: ['Live voicemail', false, 'outline'], na: ['No answer', false, 'outline']
  };
  /* the Biz Dev panel's split of calls (who answered is dm or gk) */
  var OUTCOMES = { dm: 'Decision maker', gk: 'Gatekeeper', vm: 'Voicemail', na: 'No answer' };

  /* ---------- sequences: follow-up cadences. A rep's first call enrols a contact in the default sequence, and each touch
     becomes a task on the rep's Tasks page on its day. Counts are contacts: active now, completed, and exited (left early);
     meeting, deal and manual split exited by reason (a meeting booked, a deal won or lost, removed by a rep), so they add
     up to no more than exited. isActive: off means it enrols no one new.
     steps: the touches, each [working day, type, task title, notes]; day 1 is the day of enrolment; types are in TOUCH_TYPES ---------- */
  var TOUCH_TYPES = { call: 'Call', voicemail: 'Voicemail', email: 'Email' };
  var SEQUENCES = [
    { id: 'q1', name: 'New lead outreach', isDefault: true, isActive: true, active: 142, completed: 388, exited: 61, meeting: 30, deal: 12, manual: 19,
      desc: 'Every first call starts here. Book a meeting within the first two weeks.',
      steps: [[1, 'call', 'Day 1: Call', ''], [1, 'voicemail', 'Day 1: Leave voicemail', ''], [3, 'email', 'Day 3: Send email', ''], [6, 'call', 'Day 6: Call', ''],
        [9, 'email', 'Day 9: Send email', 'Reply to the email chain to follow up.'], [13, 'call', 'Day 13: Call', 'If no answer, leave one more voicemail, then stop.']] },
    { id: 'q2', name: 'Renewal reminder', isActive: true, active: 28, completed: 96, exited: 9, meeting: 2, deal: 4, manual: 3,
      desc: 'For accounts whose contract ends in the next 90 days.',
      steps: [[1, 'email', 'Day 1: Renewal heads-up', ''], [8, 'call', 'Day 8: Check-in call', ''], [22, 'email', 'Day 22: Send the renewal quote', 'Attach the quote from the opportunity.']] },
    { id: 'q3', name: 'E-rate window', isActive: true, active: 57, completed: 120, exited: 18, meeting: 9, deal: 4, manual: 5,
      desc: 'For school districts and libraries before the E-rate filing window closes.',
      steps: [[1, 'email', 'Day 1: E-rate timeline for this year', ''], [3, 'call', 'Day 3: Discovery call', ''], [10, 'email', 'Day 10: Filing checklist', ''], [17, 'call', 'Day 17: Book a site walkthrough', '']] },
    { id: 'q4', name: 'Event follow-up', isActive: false, active: 0, completed: 74, exited: 12, meeting: 6, deal: 2, manual: 4,
      desc: 'For contacts met at a TechPower event. Start the day after the event.',
      steps: [[1, 'email', 'Day 1: Thanks for stopping by', ''], [3, 'call', 'Day 3: Call', ''], [3, 'voicemail', 'Day 3: Leave voicemail', '']] }
  ];

  /* ---------- meetings: booked with a contact by a rep. outcome: as live's Log meeting, scheduled (shown "Pending": not
     happened yet), held, noshow, rescheduled or cancelled; plus qualified (held, and the contact is a real prospect), which
     live counts but doesn't offer as an outcome. Today is Monday Nov 9, so "this week" is Nov 9–15.
     at: when it takes place (Meetings page); set: the day it was booked (Biz Dev's meetings set);
     accepted: a qualified meeting that sales took on (Biz Dev's Sales accepted) ---------- */
  var MEET_OUTCOMES = { scheduled: 'Pending', held: 'Held', qualified: 'Qualified', noshow: 'No show', rescheduled: 'Rescheduled', cancelled: 'Cancelled' };
  var MEETINGS = [
    { id: 'g01', contact: 'c13', rep: 'er', at: '2026-11-09T15:00', set: '2026-11-02', outcome: 'scheduled', note: 'Fiber options for city hall.' },
    { id: 'g02', contact: 'c06', rep: 'mb', at: '2026-11-09T09:00', set: '2026-11-03', outcome: 'qualified', note: 'Wants a quote for three county sites.' },
    { id: 'g03', contact: 'c12', rep: 'mb', at: '2026-11-09T08:30', set: '2026-11-04', outcome: 'noshow', note: '' },
    { id: 'g04', contact: 'c08', rep: 'tb', at: '2026-11-10T11:00', set: '2026-11-05', outcome: 'scheduled', note: 'Backup and recovery review.' },
    { id: 'g05', contact: 'c03', rep: 'er', at: '2026-11-12T15:30', set: '2026-11-04', outcome: 'scheduled', note: 'Walk through the SOC scope.' },
    { id: 'g06', contact: 'c16', rep: 'no', at: '2026-11-12T14:00', set: '2026-11-05', outcome: 'scheduled', note: 'E-rate discovery with the district tech team.' },
    { id: 'g07', contact: 'c01', rep: 'mb', at: '2026-11-17T09:30', set: '2026-11-06', outcome: 'scheduled', note: 'Network survey on site.' },
    { id: 'g08', contact: 'c10', rep: 'sw', at: '2026-11-19T13:00', set: '2026-11-09', outcome: 'scheduled', note: '' },
    { id: 'g09', contact: 'c04', rep: 'tb', at: '2026-11-06T10:00', set: '2026-10-29', outcome: 'held', note: 'Walked through the switch refresh.' },
    { id: 'g10', contact: 'c11', rep: 'tb', at: '2026-11-05T14:00', set: '2026-10-27', outcome: 'qualified', note: 'Renewal, plus a backup add-on.' },
    { id: 'g11', contact: 'c15', rep: 'sw', at: '2026-11-04T11:00', set: '2026-10-28', outcome: 'noshow', note: '' },
    { id: 'g12', contact: 'c14', rep: 'no', at: '2026-11-03T15:00', set: '2026-10-26', outcome: 'qualified', accepted: true, note: 'Security assessment for two clinics.' },
    { id: 'g13', contact: 'c09', rep: 'mb', at: '2026-11-02T10:30', set: '2026-10-20', outcome: 'held', note: 'Not ready until the next budget year.' },
    { id: 'g14', contact: 'c05', rep: 'tb', at: '2026-10-28T13:00', set: '2026-10-14', outcome: 'qualified', accepted: true, note: 'Board approved the network refresh.' },
    { id: 'g15', contact: 'c07', rep: 'er', at: '2026-10-22T09:00', set: '2026-10-12', outcome: 'noshow', note: '' },
    { id: 'g16', contact: 'c02', rep: 'mb', at: '2026-10-15T11:30', set: '2026-10-06', outcome: 'held', note: 'Intro call with the network team.' }
  ];

  /* ---------- goals: one period per month. For each rep, a goal and an actual per measure, in GOAL_METRICS order (name under its group's heading, full on its own):
     call activity (dials, conversations, emails sent), meetings (scheduled, held, qualified, good) and opportunities
     (created, qualified, won). noshow is each rep's no shows, for the show rate. A null goal isn't set: Biz Dev reps
     have no goal for opps won, since sales closes them.
     November is the current month, 9 days in. Biz Dev reps (no, sw) dial more than sales reps. November's call actuals
     match Biz Dev; its meetings count the Meetings list as Biz Dev does (scheduled on the day booked; held, qualified
     and no show on the day they took place; good is a qualified meeting sales took on, Biz Dev's Sales accepted); its
     opps won match Reports' won this month. ---------- */
  var GOAL_GROUPS = [{ id: 'calls', name: 'Call activity' }, { id: 'meetings', name: 'Meetings' }, { id: 'opps', name: 'Opportunities' }];
  var GOAL_METRICS = [
    { id: 'dials', name: 'Dials', group: 'calls' }, { id: 'convos', name: 'Conversations', group: 'calls' }, { id: 'emails', name: 'Emails sent', group: 'calls' },
    { id: 'mset', name: 'Scheduled', full: 'Meetings scheduled', group: 'meetings' }, { id: 'mheld', name: 'Held', full: 'Meetings held', group: 'meetings' }, { id: 'mqual', name: 'Qualified', full: 'Qualified meetings', group: 'meetings' }, { id: 'mgood', name: 'Good', full: 'Good meetings', group: 'meetings' },
    { id: 'ocreated', name: 'Created', full: 'Opps created', group: 'opps' }, { id: 'oqual', name: 'Qualified', full: 'Opps qualified', group: 'opps' }, { id: 'owon', name: 'Won', full: 'Opps won', group: 'opps' }
  ];
  var GOALS = [
    { id: '2026-09',
      goal:   { mb: [400, 80, 200, 8, 6, 3, 2, 4, 3, 2], er: [400, 80, 200, 8, 6, 3, 2, 4, 3, 2], tb: [400, 80, 200, 8, 6, 3, 2, 4, 3, 2],
                no: [800, 120, 300, 12, 9, 5, 3, 6, 4, null], sw: [800, 120, 300, 12, 9, 5, 3, 6, 4, null] },
      actual: { mb: [432, 85, 190, 9, 7, 4, 2, 5, 3, 2], er: [388, 92, 214, 7, 6, 3, 2, 3, 3, 1], tb: [351, 61, 176, 5, 4, 2, 1, 3, 2, 2],
                no: [846, 131, 288, 14, 10, 6, 4, 7, 4, 0], sw: [702, 98, 251, 10, 7, 3, 2, 4, 2, 0] },
      noshow: { mb: 2, er: 1, tb: 1, no: 3, sw: 2 } },
    { id: '2026-10',
      goal:   { mb: [400, 80, 200, 8, 6, 3, 2, 4, 3, 2], er: [400, 80, 200, 8, 6, 3, 2, 4, 3, 2], tb: [400, 80, 200, 8, 6, 3, 2, 4, 3, 2],
                no: [800, 120, 300, 12, 9, 5, 3, 6, 4, null], sw: [800, 120, 300, 12, 9, 5, 3, 6, 4, null] },
      actual: { mb: [410, 78, 205, 8, 6, 3, 2, 4, 3, 2], er: [402, 88, 231, 9, 7, 4, 3, 5, 4, 2], tb: [377, 70, 182, 6, 5, 3, 2, 4, 3, 1],
                no: [812, 117, 305, 13, 11, 5, 3, 6, 5, 0], sw: [755, 109, 270, 11, 8, 4, 2, 5, 3, 0] },
      noshow: { mb: 1, er: 1, tb: 1, no: 2, sw: 2 } },
    { id: '2026-11',
      goal:   { mb: [420, 85, 200, 8, 6, 3, 2, 4, 3, 2], er: [420, 85, 220, 8, 6, 3, 2, 4, 3, 2], tb: [400, 80, 200, 8, 6, 3, 2, 4, 3, 2],
                no: [800, 120, 300, 12, 9, 5, 3, 6, 4, null], sw: [750, 110, 280, 12, 9, 5, 3, 6, 4, null] },
      actual: { mb: [131, 24, 58, 3, 2, 1, 0, 3, 2, 2], er: [142, 31, 70, 2, 0, 0, 0, 3, 2, 1], tb: [96, 15, 41, 1, 2, 1, 0, 3, 3, 3],
                no: [268, 44, 97, 1, 1, 1, 1, 4, 2, 0], sw: [221, 30, 84, 1, 0, 0, 0, 2, 1, 0] },
      noshow: { mb: 1, er: 0, tb: 0, no: 0, sw: 1 } }
  ];

  /* ---------- Biz Dev: PhoneBurner calls per period, by rep: [decision maker, gatekeeper, voicemail, no answer,
     talk minutes, emails sent]. Calls are the four outcomes added up; connected is decision maker + gatekeeper.
     This month matches the Goals actuals for November (dials, conversations = connected, emails sent).
     Today, all reps make 30 calls and send 11 emails by mid-morning, within the Dashboard's 47 activities since Monday.
     It's Monday, so this week so far is today. ---------- */
  var BIZ_TODAY = { mb: [1, 1, 2, 3, 8, 2], er: [0, 1, 2, 3, 1, 3], tb: [0, 0, 1, 2, 0, 1], no: [1, 1, 3, 4, 6, 3], sw: [1, 0, 2, 2, 4, 2] };
  var BIZDEV = {
    today: BIZ_TODAY,
    week: BIZ_TODAY,
    month: { mb: [15, 9, 48, 59, 162, 58], er: [20, 11, 50, 61, 214, 70], tb: [8, 7, 36, 45, 88, 41], no: [26, 18, 101, 123, 301, 97], sw: [17, 13, 84, 107, 196, 84] }
  };

  /* ---------- closed deals per Reports period, by owner: [won, won value, lost]. Today is Monday morning, so nothing
     has closed this week yet. Month is Nov 1-9; quarter is Q4, from Oct 1. ---------- */
  var CLOSED = {
    week:    { mb: [0, 0, 0], er: [0, 0, 0], tb: [0, 0, 0], ps: [0, 0, 0], no: [0, 0, 0], sw: [0, 0, 0] },
    month:   { mb: [2, 310000, 1], er: [1, 145000, 2], tb: [3, 186000, 1], ps: [0, 0, 0], no: [0, 0, 1], sw: [0, 0, 0] },
    quarter: { mb: [6, 980000, 3], er: [5, 720000, 4], tb: [8, 610000, 2], ps: [1, 240000, 0], no: [0, 0, 2], sw: [1, 45000, 1] }
  };

  /* ---------- campaigns: a goal, the reps working it and a follow-up sequence, as live's campaign page.
     byRep: [opportunities, won, amount, calls] per rep, as live's Progress by rep and Call activity; the campaign's
     figures are the sums. pipeline: open value; wonValue: value of the won ones; lost: how many were lost
     (the rest of the count is open). createdBy: the rep who made it. script: a title, then sections headed in capitals,
     as live's call scripts. ---------- */
  var CAMPAIGNS = [
    { id: 'm1', name: 'E-rate push: school districts', status: 'active', start: '2026-10-01', end: '2026-12-19', sequence: 'q3', pipeline: 610000, wonValue: 95000, lost: 0, createdBy: 'ps',
      goal: 'Book 20 discovery meetings with district technology directors before the E-rate filing window opens.',
      background: 'Most districts in the region refresh network gear on the E-rate cycle. Last year we joined too late and lost three districts to vendors already on their bid lists.',
      script: 'E-rate discovery call\n\nMAIN SCRIPT\nHi {first name}, this is {rep} from TechPower. We help districts like {account} plan E-rate funded network upgrades.\nAre you planning any Category 2 work for next school year?\n\nIF THEY SAY YES\nWho else is involved in choosing a vendor?\n\nIF THEY SAY NO\nWhen does your current equipment come up for refresh?\n\nCLOSE\nCould we book 20 minutes next week to walk through last year\'s filings?',
      expectations: 'Two discovery meetings a week across the team is realistic.',
      byRep: { er: [3, 1, 300000, 312], tb: [2, 0, 285000, 268], no: [1, 0, 120000, 191] } },
    { id: 'm2', name: 'County cloud migration', status: 'active', start: '2026-09-15', end: '2027-01-29', sequence: 'q1', pipeline: 1840000, wonValue: 0, lost: 0, createdBy: 'jr',
      goal: 'Open 5 qualified opportunities with county IT departments planning a data center exit.',
      background: 'Three counties announced data center consolidation this year. Budgets are set in January, so conversations need to start in the fall.',
      script: 'County data center exit\n\nMAIN SCRIPT\nHi {first name}, {rep} from TechPower. Several counties near you are moving out of their own data centers.\nIs that on your roadmap?\n\nIF THEY ASK: "WHY NOW?"\nBudgets are set in January, so plans made this fall get funded next year.\n\nCLOSE\nCould I send a one-page migration plan from a county your size?',
      expectations: 'One qualified opportunity every two weeks.',
      byRep: { mb: [2, 0, 1240000, 244], sw: [1, 0, 600000, 175] } },
    { id: 'm3', name: 'Utility OT security assessments', status: 'active', start: '2026-11-02', end: '2027-02-26', sequence: 'q1', pipeline: 0, wonValue: 0, lost: 0, createdBy: 'ps',
      goal: 'Sell 4 OT security assessments to utilities and co-ops.',
      background: 'New state reporting rules for utility control systems take effect next year. Most co-ops have no assessment on file.',
      script: 'OT assessment intro\n\nMAIN SCRIPT\nHi {first name}, {rep} with TechPower. The new reporting rules ask for an OT security assessment.\nDo you have one on file?\n\nIF THEY SAY: "WE ALREADY HAVE A VENDOR"\nThat\'s fine. We can review their assessment against the new rules.\n\nCLOSE\nCould we schedule a 30-minute scoping call?',
      expectations: 'One scoping call a week once the new rules are published.',
      byRep: { tb: [0, 0, 0, 38], sw: [0, 0, 0, 52], no: [0, 0, 0, 27] } },
    { id: 'm4', name: 'Healthcare backup and recovery', status: 'closed', start: '2026-05-04', end: '2026-08-28', sequence: 'q1', pipeline: 520000, wonValue: 240000, lost: 1, createdBy: 'jr',
      goal: 'Book 10 meetings with hospital IT leaders about backup and recovery.',
      background: 'Two ransomware incidents at regional clinics put recovery plans on every board agenda this spring.',
      script: 'Recovery plan check-in\n\nMAIN SCRIPT\nHi {first name}, {rep} from TechPower. After this spring\'s incidents, many clinics are re-testing recovery plans.\nWhen did you last run a full restore?\n\nCLOSE\nCould we compare notes for 20 minutes?',
      expectations: 'One meeting a week; hospital IT teams are slow to call back.',
      byRep: { tb: [2, 1, 760000, 286], mb: [1, 0, 130000, 231] } },
    { id: 'm5', name: 'Spring manufacturing Wi-Fi', status: 'closed', start: '2026-03-02', end: '2026-05-29', sequence: 'q4', pipeline: 162000, wonValue: 88000, lost: 0, createdBy: 'ps',
      goal: 'Open 3 plant floor Wi-Fi opportunities after the regional manufacturing expo.',
      background: 'We met about 100 plant managers at the expo in February. Most asked about coverage on the plant floor.',
      script: 'Expo follow-up\n\nMAIN SCRIPT\nHi {first name}, {rep} from TechPower. We met at the expo in February.\nIs plant floor coverage still a problem?\n\nCLOSE\nCould we do a quick site survey?',
      expectations: 'A site survey every week while expo contacts are warm.',
      byRep: { er: [1, 1, 88000, 205], mb: [1, 0, 162000, 188] } }
  ];

  /* ---------- activity: human labels, not system keys (audit M2). The first eight are the Dashboard's recent activity;
     the rest fill out the Calls & Activity log, which sorts by time. ---------- */
  var ACTIVITY = [
    { id: 'v01', type: 'call', who: 'mb', rel: ['contact', 'c06'], at: '2026-11-09T09:42', text: 'Call · interested · 6:12' },
    { id: 'v02', type: 'stage', who: 'tb', rel: ['opportunity', 'o12'], at: '2026-11-09T09:15', text: 'Moved to Closed, won' },
    { id: 'v03', type: 'email', who: 'er', rel: ['contact', 'c03'], at: '2026-11-09T08:58', text: 'Email sent · SOC pricing' },
    { id: 'v04', type: 'meeting', who: 'no', rel: ['account', 'a14'], at: '2026-11-06T16:30', text: 'Meeting booked for Nov 12' },
    { id: 'v05', type: 'updated', who: 'mb', rel: ['account', 'a10'], at: '2026-11-06T14:05', text: 'Updated' },
    { id: 'v06', type: 'call', who: 'sw', rel: ['contact', 'c13'], at: '2026-11-06T11:20', text: 'Call · live voicemail · 0:52' },
    { id: 'v07', type: 'note', who: 'tb', rel: ['account', 'a06'], at: '2026-11-05T17:48', text: 'Note added' },
    { id: 'v08', type: 'stage', who: 'er', rel: ['opportunity', 'o14'], at: '2026-11-05T10:02', text: 'Moved to Proposal' },
    { id: 'v09', type: 'call', who: 'no', rel: ['contact', 'c01'], at: '2026-11-09T09:20', text: 'Call · live voicemail · 1:05' },
    { id: 'v10', type: 'call', who: 'mb', rel: ['contact', 'c09'], at: '2026-11-09T09:05', text: 'Call · unavailable · 2:04' },
    { id: 'v11', type: 'call', who: 'mb', rel: ['contact', 'c15'], at: '2026-11-09T08:51', text: 'Call · no answer · 0:31' },
    { id: 'v12', type: 'call', who: 'tb', rel: ['contact', 'c04'], at: '2026-11-06T10:34', text: 'Call · interested · 11:20' },
    { id: 'v13', type: 'call', who: 'tb', rel: ['contact', 'c11'], at: '2026-11-06T09:12', text: 'Call · interested · 4:08' },
    { id: 'v14', type: 'call', who: 'tb', rel: ['contact', 'c14'], at: '2026-11-05T15:40', text: 'Call · not interested · 1:15' },
    { id: 'v15', type: 'call', who: 'er', rel: ['contact', 'c10'], at: '2026-11-05T14:02', text: 'Call · wrong number · 0:12' },
    { id: 'v16', type: 'call', who: 'no', rel: ['contact', 'c16'], at: '2026-11-05T11:15', text: 'Call · interested · 9:40' },
    { id: 'v17', type: 'email', who: 'er', rel: ['contact', 'c03'], at: '2026-11-04T17:10', text: 'Email sent · SOC scope notes' },
    { id: 'v18', type: 'call', who: 'er', rel: ['contact', 'c03'], at: '2026-11-04T16:25', text: 'Call · interested · 14:02' },
    { id: 'v19', type: 'call', who: 'mb', rel: ['contact', 'c12'], at: '2026-11-04T10:48', text: 'Call · live voicemail · 0:48' },
    { id: 'v20', type: 'note', who: 'jr', rel: ['account', 'a04'], at: '2026-11-04T09:30', text: 'Note added' },
    { id: 'v21', type: 'updated', who: 'mb', rel: ['opportunity', 'o04'], at: '2026-11-03T15:05', text: 'Updated' },
    { id: 'v22', type: 'created', who: 'mb', rel: ['contact', 'c12'], at: '2026-11-02T13:30', text: 'Created' },
    { id: 'v23', type: 'conversation', who: 'tb', rel: ['account', 'a06'], at: '2026-11-06T13:10', text: 'Conversation · backup needs, at the health IT summit' },
    { id: 'v24', type: 'task', who: 'er', rel: ['contact', 'c03'], at: '2026-11-05T09:40', text: 'Task completed · Send the SOC pricing' },
    { id: 'v25', type: 'task', who: 'mb', rel: ['opportunity', 'o04'], at: '2026-11-03T11:20', text: 'Task completed · Book the site survey' }
  ];

  /* ---------- General, Tools and Admin pages ---------- */
  /* documents: a file, as live keeps it: linked to a contact, an account or an opportunity, or to nothing (rel null), with
     tags. Its kind is its extension (CRM.fileBadge); there is no document type. kb: size in kilobytes */
  var DOCUMENTS = [
    { id: 'd01', file: 'E-rate filing checklist 2027.xlsx', rel: ['account', 'a14'], by: 'no', tags: [], kb: 63.8, date: '2026-11-06' },
    { id: 'd02', file: 'Brightwater SOC proposal v3.pdf', rel: ['opportunity', 'o02'], by: 'er', tags: ['Enterprise'], kb: 2365.4, date: '2026-11-04' },
    { id: 'd09', file: 'Call notes, Hana Moreau.txt', rel: ['contact', 'c03'], by: 'er', tags: [], kb: 3.9, date: '2026-11-03' },
    { id: 'd03', file: 'Pine Hollow renewal quote.pdf', rel: ['opportunity', 'o03'], by: 'tb', tags: ['SMB'], kb: 186.7, date: '2026-11-02' },
    { id: 'd04', file: 'County data center move, proposal.docx', rel: ['opportunity', 'o04'], by: 'mb', tags: ['Gov'], kb: 948.2, date: '2026-10-30' },
    { id: 'd05', file: 'Saint Alder backup review.pptx', rel: ['account', 'a06'], by: 'tb', tags: ['Enterprise'], kb: 8740.1, date: '2026-10-26' },
    { id: 'd10', file: 'Halvorsen MDF closet photos.zip', rel: ['account', 'a01'], by: 'mb', tags: [], kb: 14336.5, date: '2026-10-24' },
    { id: 'd06', file: 'Meridian County RFP 2026-114.pdf', rel: ['account', 'a04'], by: 'mb', tags: ['Gov'], kb: 5120.3, date: '2026-10-21' },
    { id: 'd07', file: 'Redstone fare system SOW draft.docx', rel: ['opportunity', 'o07'], by: 'mb', tags: ['Gov'], kb: 412.6, date: '2026-10-19' },
    { id: 'd11', file: 'TechPower capability statement.pdf', rel: null, by: 'ps', tags: [], kb: 1204.9, date: '2026-09-15' },
    { id: 'd08', file: 'Vantor master services agreement.pdf', rel: ['account', 'a15'], by: 'tb', tags: ['Mid-Market'], kb: 1630.2, date: '2025-07-22' }
  ];

  /* tags: how many records carry each, across all records (not only the sample rows) */
  /* each tag has a colour, as in the live CRM; the CRM shows it as a dot in the chip (TAG_COLORS, crm.css --tag-*) */
  var TAG_COLORS = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink', 'gray'];   /* the picker's order, as live's */
  var TAGS = [
    { id: 'g-happyhour', color: 'pink', name: 'DFW CIO/CTO Happy Hour', contacts: 46, accounts: 12, opps: 0, created: '2026-04-14' },
    { id: 'g-enterprise', color: 'green', name: 'Enterprise', contacts: 0, accounts: 138, opps: 22, created: '2025-03-12' },
    { id: 'g-gov', color: 'purple', name: 'Gov', contacts: 0, accounts: 205, opps: 31, created: '2025-03-12' },
    { id: 'g-midmarket', color: 'blue', name: 'Mid-Market', contacts: 0, accounts: 344, opps: 18, created: '2025-03-12' },
    { id: 'g-smb', color: 'orange', name: 'SMB', contacts: 0, accounts: 517, opps: 9, created: '2025-03-12' }
  ];

  /* territories: accounts that match a state, vertical and (optionally) subvertical are routed to the assigned reps.
     tag: made from the state and vertical as live's ("CA-Providers"), shown in monospace */
  var TERRITORIES = [
    { id: 'tr1', tag: 'TX-Education', state: 'TX', vertical: 'Education', sub: 'School district', users: ['er', 'no'] },
    { id: 'tr2', tag: 'TX-Government', state: 'TX', vertical: 'Government', sub: 'City', users: ['mb'] },
    { id: 'tr3', tag: 'OK-Utilities', state: 'OK', vertical: 'Utilities', sub: 'Electric cooperative', users: ['tb', 'sw'] },
    { id: 'tr4', tag: 'CO-Utilities', state: 'CO', vertical: 'Utilities', sub: 'Water', users: ['er'] },
    { id: 'tr5', tag: 'LA-Healthcare', state: 'LA', vertical: 'Healthcare', sub: 'Hospital', users: ['tb'] },
    { id: 'tr6', tag: 'NM-Government', state: 'NM', vertical: 'Government', sub: 'County', users: ['mb', 'sw'] },
    { id: 'tr7', tag: 'AR-Manufacturing', state: 'AR', vertical: 'Manufacturing', sub: null, users: ['mb', 'er'] },
    { id: 'tr8', tag: 'KS-Manufacturing', state: 'KS', vertical: 'Manufacturing', sub: null, users: [] }
  ];
  var SUBVERTICALS = ['City', 'County', 'School district', 'Higher education', 'Hospital', 'Clinic', 'Electric cooperative', 'Water'];

  /* custom fields, per record type: the same ones the record drawers show in their Custom Fields tab */
  var FIELD_TYPES = { text: 'Text', number: 'Number', date: 'Date', checkbox: 'Checkbox', dropdown: 'Dropdown' };   /* live's five, in live's order */
  var FIELDS = [
    { id: 'cf1', entity: 'account', name: 'Fiscal year end', type: 'date' },
    { id: 'cf2', entity: 'account', name: 'Current IT provider', type: 'text' },
    { id: 'cf3', entity: 'contact', name: 'Preferred contact', type: 'dropdown', options: ['Phone', 'Email', 'Text message'] },
    { id: 'cf4', entity: 'opportunity', name: 'Contract term', type: 'dropdown', options: ['One-time', '12 months', '36 months'] },
    { id: 'cf5', entity: 'opportunity', name: 'Competitor', type: 'text' }
  ];

  /* audit log, as live's: every action on an account, contact or opportunity, newest first. Activities (calls, emails,
     notes…) are logged with their own text; a create or update as "Created account: <name>", with no before and after
     (live doesn't keep them). An archive is an update ("Archived contact"), and so is a stage move, as on Calls & Activity.
     ref: the record in the sample data, where it is one; the name is kept as it was, so an archived record still reads */
  var AUDIT_TYPES = { call: 'Call', email: 'Email', meeting: 'Meeting', note: 'Note', stage: 'Stage change', task: 'Task completed',
    conversation: 'Conversation', created: 'Created', updated: 'Updated' };   /* live's nine, in live's order */
  var RECORD_TYPES = { account: 'Account', contact: 'Contact', opportunity: 'Opportunity' };
  var AUDIT = [
    { id: 'u01', at: '2026-11-09T09:42', who: 'mb', type: 'call', entity: 'contact', ref: 'c06', name: 'Luis Carrasco', text: 'Call · interested · 6:12' },
    { id: 'u02', at: '2026-11-09T09:15', who: 'tb', type: 'updated', entity: 'opportunity', ref: 'o12', name: 'Clinic VoIP rollout', text: 'Updated opportunity: Clinic VoIP rollout' },
    { id: 'u03', at: '2026-11-09T08:58', who: 'er', type: 'email', entity: 'contact', ref: 'c03', name: 'Hana Moreau', text: 'Sent the SOC pricing and asked who signs off on 24/7 coverage.' },
    { id: 'u04', at: '2026-11-09T08:32', who: 'jr', type: 'note', entity: 'contact', ref: 'c13', name: 'Joanna Pike', text: 'Owner reassigned' },
    { id: 'u05', at: '2026-11-06T16:30', who: 'no', type: 'meeting', entity: 'account', ref: 'a14', name: 'Harrow Ridge ISD', text: 'Meeting booked for Nov 12' },
    { id: 'u06', at: '2026-11-06T14:05', who: 'mb', type: 'updated', entity: 'account', ref: 'a10', name: 'Ostrander Precision', text: 'Updated account: Ostrander Precision' },
    { id: 'u07', at: '2026-11-06T13:10', who: 'tb', type: 'conversation', entity: 'account', ref: 'a06', name: 'Saint Alder Health', text: 'Backup needs, at the health IT summit' },
    { id: 'u08', at: '2026-11-06T11:48', who: 'er', type: 'updated', entity: 'contact', name: 'Dana Whitford', text: 'Archived contact' },
    { id: 'u09', at: '2026-11-05T10:02', who: 'er', type: 'updated', entity: 'opportunity', ref: 'o14', name: 'Classroom AV refresh', text: 'Updated opportunity: Classroom AV refresh' },
    { id: 'u10', at: '2026-11-05T09:40', who: 'er', type: 'task', entity: 'contact', ref: 'c03', name: 'Hana Moreau', text: 'Send the SOC pricing' },
    { id: 'u11', at: '2026-11-04T09:31', who: 'jr', type: 'updated', entity: 'account', ref: 'a04', name: 'Meridian County', text: 'Updated account: Meridian County' },
    { id: 'u12', at: '2026-11-03T15:05', who: 'mb', type: 'updated', entity: 'opportunity', ref: 'o04', name: 'County data center move', text: 'Updated opportunity: County data center move' },
    { id: 'u13', at: '2026-11-02T13:30', who: 'mb', type: 'created', entity: 'contact', ref: 'c12', name: 'Rafael Santos', text: 'Created contact: Rafael Santos' },
    { id: 'u14', at: '2026-10-30T16:44', who: 'ps', type: 'updated', entity: 'opportunity', ref: 'o06', name: 'EHR backup and recovery', text: 'Updated opportunity: EHR backup and recovery' },
    { id: 'u15', at: '2026-10-28T10:20', who: 'sw', type: 'created', entity: 'account', ref: 'a16', name: 'Kestrel Components', text: 'Created account: Kestrel Components' }
  ];
  TOTALS.audit = 34960;      /* all dates, all users, as live: the Audit Log count and pager (50 a page) */
  TOTALS.documents = 1236;   /* every document: the Documents pager */

  window.CRM_DATA = {
    testUsers: TEST_USERS, engineers: ENGINEERS, documents: DOCUMENTS, tagList: TAGS, tagColors: TAG_COLORS, territories: TERRITORIES, subverticals: SUBVERTICALS,
    fields: FIELDS, fieldTypes: FIELD_TYPES, audit: AUDIT, auditTypes: AUDIT_TYPES, recordTypes: RECORD_TYPES,
    today: TODAY, reps: REPS, roles: ROLES, domain: DOMAIN, verticals: VERTICALS, vendors: VENDORS, vendorTypes: VENDOR_TYPES, phoneTypes: PHONE_TYPES, emailTypes: EMAIL_TYPES, stateNames: STATE_NAMES,
    accounts: ACCOUNTS, contacts: CONTACTS, stages: STAGES, opps: OPPS, tasks: TASKS, activity: ACTIVITY, totals: TOTALS,
    calls: CALLS, dispositions: DISPOSITIONS, outcomes: OUTCOMES, sequences: SEQUENCES, touchTypes: TOUCH_TYPES, campaigns: CAMPAIGNS,
    meetings: MEETINGS, meetOutcomes: MEET_OUTCOMES, goals: GOALS, goalMetrics: GOAL_METRICS, goalGroups: GOAL_GROUPS, closed: CLOSED, bizdev: BIZDEV
  };
})();
