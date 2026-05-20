/* ============================================================
   AFRICA2KBALL — ADMIN.JS  V23
   Interface d'administration — Supabase ready, Courtside validation
   ============================================================ */

'use strict';

/* ------------------------------------------------------------------
   SUPABASE CONFIG — renseigner uniquement la clé ANON publique
   !! Ne jamais mettre la service_role key ici !!
   ------------------------------------------------------------------ */
var SUPABASE_URL      = 'https://ltwwjhapdxhpkwvpabva.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0d3dqaGFwZHhocGt3dnBhYnZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjMyMjMsImV4cCI6MjA5NDgzOTIyM30.p3aUKEu2qxpygNXiI4BOXdl0VcgDw6OliLls6HbQG84'; /* À renseigner avec la clé anon publique */

var _supabase = null;
function getSupabase() {
  if (_supabase) return _supabase;
  if (!SUPABASE_ANON_KEY) return null;
  try {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch(e) { _supabase = null; }
  return _supabase;
}

/* ------------------------------------------------------------------
   MOCK DATA — à remplacer par appels Supabase quand clé fournie
   ------------------------------------------------------------------ */
var MOCK_MEDIA = [
  { nom: 'Aïssatou Diallo',   email: 'a.diallo@mediasport.fr',    tel: '06 11 22 33 44', org: 'Média Sport',    reseaux: '@mediasport',    statut: 'Confirmé' },
  { nom: 'Karim Ndiaye',      email: 'k.ndiaye@afrobasket.com',   tel: '06 55 66 77 88', org: 'AfroBasket.com', reseaux: '@afrobasket',    statut: 'En attente' },
  { nom: 'Lucie Fontaine',    email: 'l.fontaine@93basket.fr',    tel: '07 10 20 30 40', org: '93 Basket Mag',  reseaux: '@93basketmag',   statut: 'Confirmé' },
  { nom: 'Omar Coulibaly',    email: 'o.coulibaly@bballafrica.io', tel: '06 77 88 99 00', org: 'BBall Africa',   reseaux: '@bballafrica',   statut: 'En attente' },
  { nom: 'Fatou Sarr',        email: 'f.sarr@courriersport.fr',   tel: '07 33 44 55 66', org: 'Courrier Sport', reseaux: '@courriersport', statut: 'Décliné' }
];

var MOCK_COURTSIDE = [
  { id: 1, nom: 'Mamadou Konaté',  email: 'm.konate@mail.com',   message: 'Je suis fan de la première heure !',          statut: 'En attente', date: '10/05/2026' },
  { id: 2, nom: 'Priya Rajesh',    email: 'p.rajesh@mail.com',   message: 'Famille, 2 adultes 1 enfant.',                statut: 'Validé',     date: '11/05/2026' },
  { id: 3, nom: 'Théo Girard',     email: 't.girard@mail.com',   message: 'Coach d\'une équipe participante.',           statut: 'En attente', date: '12/05/2026' },
  { id: 4, nom: 'Binta Diarra',    email: 'b.diarra@mail.com',   message: 'Partenaire de l\'événement.',                 statut: 'Validé',     date: '13/05/2026' },
  { id: 5, nom: 'Lucas Ferreira',  email: 'l.ferreira@mail.com', message: 'Passionné de basket africain depuis 2020.',   statut: 'En attente', date: '15/05/2026' }
];

var MOCK_INVITES = [
  { id: 1, staff: 'Fodie',   guest: 'Souleymane Traoré', email: 's.traore@mail.com',  type: 'VIP',      date: '05/05/2026' },
  { id: 2, staff: 'Samuel',  guest: 'Marie Dupont',      email: 'm.dupont@mail.com',  type: 'Standard', date: '07/05/2026' },
  { id: 3, staff: 'Ornella', guest: 'Ibrahima Sow',      email: 'i.sow@mail.com',     type: 'Courtside',date: '09/05/2026' },
  { id: 4, staff: 'Damien',  guest: 'Camille Benoît',    email: 'c.benoit@mail.com',  type: 'Standard', date: '12/05/2026' }
];

/* ------------------------------------------------------------------
   LISTE OFFICIELLE STAFF — V24
   ------------------------------------------------------------------ */
var STAFF_MEMBERS = ['Fodie', 'Samuel', 'Dawari', 'Abloss', 'Chris', 'Ornella', 'Junior', 'Dylan', 'Damien'];

/* ------------------------------------------------------------------
   KPI CALCULATION
   ------------------------------------------------------------------ */
function computeKPIs() {
  var attenteCourtside  = MOCK_COURTSIDE.filter(function(c){ return c.statut === 'En attente'; });
  var valideCourtside   = MOCK_COURTSIDE.filter(function(c){ return c.statut === 'Validé'; });
  var confirmedMedia    = MOCK_MEDIA.filter(function(m){ return m.statut === 'Confirmé'; });

  return {
    demandesCourtside:    MOCK_COURTSIDE.length,
    courtsideEnAttente:   attenteCourtside.length,
    courtsideValides:     valideCourtside.length,
    mediaInscrits:        MOCK_MEDIA.length,
    mediaConfirmes:       confirmedMedia.length,
    invitesTotal:         MOCK_INVITES.length,
    benevolesInscrits:    0
  };
}

/* ------------------------------------------------------------------
   RENDER KPIs
   ------------------------------------------------------------------ */
function renderKPIs() {
  var kpis = computeKPIs();
  var grid = document.getElementById('kpiGrid');
  if (!grid) return;

  var items = [
    { label: 'Demandes Courtside',      value: kpis.demandesCourtside,  icon: 'star',   note: 'Places limitées · Validation' },
    { label: 'Courtside en attente',    value: kpis.courtsideEnAttente, icon: 'clock',  note: 'À valider ou refuser' },
    { label: 'Courtside validés',       value: kpis.courtsideValides,   icon: 'check',  note: 'Confirmés' },
    { label: 'Médias inscrits',         value: kpis.mediaInscrits,      icon: 'camera', note: kpis.mediaConfirmes + ' confirmés' },
    { label: 'Invités (pass staff)',    value: kpis.invitesTotal,       icon: 'users',  note: 'Via formulaire staff' },
    { label: 'Visiteurs site (7 j.)',   value: '—',                     icon: 'chart',  note: 'Analytics à connecter' },
    { label: 'Demandes bénévoles',      value: kpis.benevolesInscrits,  icon: 'heart',  note: 'Formulaire à brancher' },
    { label: 'Supabase',               value: SUPABASE_ANON_KEY ? '✓ Connecté' : '— À configurer', icon: 'euro', note: 'Clé anon publique' }
  ];

  grid.innerHTML = items.map(function(item) {
    return '<div class="admin-kpi-card">' +
      '<div class="admin-kpi-icon">' + svgIcon(item.icon) + '</div>' +
      '<div class="admin-kpi-body">' +
        '<span class="admin-kpi-value">' + item.value + '</span>' +
        '<span class="admin-kpi-label">' + item.label + '</span>' +
        '<span class="admin-kpi-note">' + item.note + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ------------------------------------------------------------------
   RENDER TABLEAU MÉDIAS
   ------------------------------------------------------------------ */
function renderMediaTable() {
  var tbody = document.getElementById('mediaTableBody');
  if (!tbody) return;

  tbody.innerHTML = MOCK_MEDIA.map(function(m) {
    var cls = m.statut === 'Confirmé' ? 'badge-ok' : (m.statut === 'Décliné' ? 'badge-ko' : 'badge-wait');
    return '<tr>' +
      '<td>' + m.nom + '</td>' +
      '<td><a href="mailto:' + m.email + '">' + m.email + '</a></td>' +
      '<td>' + m.tel + '</td>' +
      '<td>' + m.org + '</td>' +
      '<td>' + m.reseaux + '</td>' +
      '<td><span class="admin-badge ' + cls + '">' + m.statut + '</span></td>' +
      '<td><button class="admin-action-btn" onclick="sendMailTo(\'' + m.email + '\',\'' + m.nom + '\')">✉ Contacter</button></td>' +
    '</tr>';
  }).join('');
}

/* ------------------------------------------------------------------
   RENDER TABLEAU COURTSIDE (demandes validation)
   ------------------------------------------------------------------ */
function renderCourtsideTable() {
  var tbody = document.getElementById('courtsideTableBody');
  if (!tbody) return;

  tbody.innerHTML = MOCK_COURTSIDE.map(function(c, idx) {
    var cls = c.statut === 'Validé' ? 'badge-ok' : (c.statut === 'Refusé' ? 'badge-ko' : 'badge-wait');
    var actions = '';
    if (c.statut === 'En attente') {
      actions =
        '<button class="admin-action-btn btn-ok" onclick="validateCourtside(' + idx + ')">✓ Valider</button> ' +
        '<button class="admin-action-btn btn-ko" onclick="refuseCourtside(' + idx + ')">✗ Refuser</button>';
    } else if (c.statut === 'Validé') {
      actions = '<button class="admin-action-btn" onclick="mailCourtside(\'' + c.email + '\',\'' + c.nom + '\',true)">✉ Envoyer confirm.</button>';
    } else {
      actions = '<button class="admin-action-btn" onclick="mailCourtside(\'' + c.email + '\',\'' + c.nom + '\',false)">✉ Notifier refus</button>';
    }
    return '<tr>' +
      '<td>' + c.nom + '</td>' +
      '<td><a href="mailto:' + c.email + '">' + c.email + '</a></td>' +
      '<td class="text-muted" style="max-width:200px;font-size:.85rem">' + c.message + '</td>' +
      '<td><span class="admin-badge ' + cls + '">' + c.statut + '</span></td>' +
      '<td class="text-muted">' + c.date + '</td>' +
      '<td>' + actions + '</td>' +
    '</tr>';
  }).join('');
}

/* ------------------------------------------------------------------
   RENDER TABLEAU INVITÉS (pass staff)
   ------------------------------------------------------------------ */
function renderInvitesTable() {
  var tbody = document.getElementById('invitesTableBody');
  if (!tbody) return;

  tbody.innerHTML = MOCK_INVITES.map(function(inv) {
    var typeCls = inv.type === 'VIP' ? 'badge-court' : (inv.type === 'Courtside' ? 'badge-court' : 'badge-std');
    return '<tr>' +
      '<td>' + inv.staff + '</td>' +
      '<td>' + inv.guest + '</td>' +
      '<td><a href="mailto:' + inv.email + '">' + inv.email + '</a></td>' +
      '<td><span class="admin-badge ' + typeCls + '">' + inv.type + '</span></td>' +
      '<td class="text-muted">' + inv.date + '</td>' +
      '<td><button class="admin-action-btn" onclick="sendMailTo(\'' + inv.email + '\',\'' + inv.guest + '\')">✉ Contacter</button></td>' +
    '</tr>';
  }).join('');
}

/* ------------------------------------------------------------------
   COURTSIDE — VALIDATE / REFUSE
   ------------------------------------------------------------------ */
function validateCourtside(idx) {
  MOCK_COURTSIDE[idx].statut = 'Validé';
  renderCourtsideTable();
  renderKPIs();
  refreshCourtsideSupabase(MOCK_COURTSIDE[idx].id, 'Validé');
}

function refuseCourtside(idx) {
  MOCK_COURTSIDE[idx].statut = 'Refusé';
  renderCourtsideTable();
  renderKPIs();
  refreshCourtsideSupabase(MOCK_COURTSIDE[idx].id, 'Refusé');
}

function mailCourtside(email, nom, accepted) {
  var subject, body;
  if (accepted) {
    subject = encodeURIComponent('[Africa2KBall] Votre place Courtside est confirmée !');
    body    = encodeURIComponent(
      'Bonjour ' + nom + ',\n\n' +
      'Nous avons le plaisir de vous confirmer votre place Courtside pour l\'édition 3 d\'Africa2KBall !\n\n' +
      'Date : 07 juin 2026\n' +
      'Lieu : Gymnase Lino Ventura, Pavillons-sous-Bois\n\n' +
      'Votre place vous sera réservée à l\'accueil. Présentez-vous avec votre email de confirmation.\n\n' +
      'À très bientôt sur le bord du terrain !\n\n' +
      'L\'équipe Africa2KBall\n' +
      'contact@africa2kball.com'
    );
  } else {
    subject = encodeURIComponent('[Africa2KBall] Votre demande Courtside — réponse');
    body    = encodeURIComponent(
      'Bonjour ' + nom + ',\n\n' +
      'Merci pour votre demande de place Courtside pour l\'édition 3 d\'Africa2KBall.\n\n' +
      'Malheureusement, les places disponibles ont été attribuées et nous ne pouvons pas honorer votre demande cette fois.\n\n' +
      'Vous pouvez toutefois assister au tournoi avec une entrée standard (gratuite).\n' +
      'Rendez-vous le 07 juin 2026 au Gymnase Lino Ventura, Pavillons-sous-Bois.\n\n' +
      'Nous espérons vous voir à la prochaine édition !\n\n' +
      'L\'équipe Africa2KBall\n' +
      'contact@africa2kball.com'
    );
  }
  window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
}

/* ------------------------------------------------------------------
   SUPABASE — REFRESH ASYNC (actif quand clé anon fournie)
   ------------------------------------------------------------------ */
function refreshCourtsideSupabase(id, newStatut) {
  var sb = getSupabase();
  if (!sb) return; /* clé anon non configurée — mode mock uniquement */
  sb.from('ticket_requests')
    .update({ statut: newStatut })
    .eq('id', id)
    .then(function(res) {
      if (res.error) { console.warn('[Africa2KBall] Supabase update error:', res.error.message); }
    });
}

function refreshMediaFromSupabase() {
  var sb = getSupabase();
  if (!sb) return;
  sb.from('media_registrations')
    .select('*')
    .order('created_at', { ascending: false })
    .then(function(res) {
      if (res.error) { console.warn('[Africa2KBall] Supabase media error:', res.error.message); return; }
      if (res.data && res.data.length) {
        MOCK_MEDIA.length = 0;
        res.data.forEach(function(r) { MOCK_MEDIA.push(r); });
        renderMediaTable();
        renderKPIs();
      }
    });
}

function refreshCourtsideListFromSupabase() {
  var sb = getSupabase();
  if (!sb) return;
  sb.from('ticket_requests')
    .select('*')
    .eq('type', 'courtside')
    .order('created_at', { ascending: false })
    .then(function(res) {
      if (res.error) { console.warn('[Africa2KBall] Supabase courtside error:', res.error.message); return; }
      if (res.data && res.data.length) {
        MOCK_COURTSIDE.length = 0;
        res.data.forEach(function(r) { MOCK_COURTSIDE.push(r); });
        renderCourtsideTable();
        renderKPIs();
      }
    });
}

function refreshInvitesFromSupabase() {
  var sb = getSupabase();
  if (!sb) return;
  sb.from('staff_guest_passes')
    .select('*')
    .order('created_at', { ascending: false })
    .then(function(res) {
      if (res.error) { console.warn('[Africa2KBall] Supabase invites error:', res.error.message); return; }
      if (res.data && res.data.length) {
        MOCK_INVITES.length = 0;
        res.data.forEach(function(r) { MOCK_INVITES.push(r); });
        renderInvitesTable();
        renderKPIs();
      }
    });
}

/* ------------------------------------------------------------------
   EMAIL PREPARATION (mailto: uniquement)
   ------------------------------------------------------------------ */
function prepareAdminMail(type) {
  var subject, body;

  if (type === 'confirmation-media') {
    subject = encodeURIComponent('[Africa2KBall] Confirmation accréditation média — Édition 3');
    body    = encodeURIComponent(
      'Bonjour,\n\n' +
      'Nous avons bien reçu votre demande d\'accréditation presse pour l\'édition 3 d\'Africa2KBall.\n\n' +
      'Date : 07 juin 2026\nLieu : Gymnase Lino Ventura, Pavillons-sous-Bois\n\n' +
      'Votre accréditation est confirmée. Nous reviendrons vers vous avec les détails pratiques.\n\n' +
      'L\'équipe Africa2KBall\ncontact@africa2kball.com'
    );
  } else if (type === 'rappel-general') {
    subject = encodeURIComponent('[Africa2KBall] Rappel — J-7 avant le tournoi !');
    body    = encodeURIComponent(
      'Bonjour,\n\n' +
      'Le tournoi Africa2KBall Édition 3 approche !\n\n' +
      'Rendez-vous le 07 juin 2026 au Gymnase Lino Ventura, Pavillons-sous-Bois.\n\n' +
      'À très bientôt,\nL\'équipe Africa2KBall'
    );
  } else if (type === 'confirmation-courtside') {
    subject = encodeURIComponent('[Africa2KBall] Votre place Courtside est confirmée !');
    body    = encodeURIComponent(
      'Bonjour,\n\n' +
      'Nous avons le plaisir de vous confirmer votre place Courtside pour l\'édition 3 d\'Africa2KBall.\n\n' +
      'Date : 07 juin 2026\nLieu : Gymnase Lino Ventura, Pavillons-sous-Bois\n\n' +
      'Votre place vous sera réservée à l\'accueil.\n\n' +
      'L\'équipe Africa2KBall\ncontact@africa2kball.com'
    );
  } else {
    subject = encodeURIComponent('[Africa2KBall] Message de l\'organisation — Édition 3');
    body    = encodeURIComponent(
      'Bonjour,\n\n\n\nL\'équipe Africa2KBall\ncontact@africa2kball.com'
    );
  }

  window.location.href = 'mailto:contact@africa2kball.com?subject=' + subject + '&body=' + body;
}

function sendMailTo(email, nom) {
  var subject = encodeURIComponent('[Africa2KBall] Message de l\'équipe organisatrice');
  var body    = encodeURIComponent('Bonjour ' + nom + ',\n\n\n\nL\'équipe Africa2KBall\ncontact@africa2kball.com');
  window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
}

/* ------------------------------------------------------------------
   SVG ICONS (inline)
   ------------------------------------------------------------------ */
function svgIcon(name) {
  var icons = {
    ticket: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><line x1="9" y1="12" x2="15" y2="12"/></svg>',
    users:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    user:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    star:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    camera: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    chart:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    heart:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    euro:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12M4 14h12M19 6a7 7 0 1 0 0 12A7 7 0 0 0 19 6z"/></svg>',
    check:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    clock:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
  };
  return icons[name] || '';
}

/* ------------------------------------------------------------------
   FILTER TABLE
   ------------------------------------------------------------------ */
function filterTable(inputId, tableId) {
  var input = document.getElementById(inputId);
  var table = document.getElementById(tableId);
  if (!input || !table) return;
  input.addEventListener('input', function() {
    var val = this.value.toLowerCase();
    var rows = table.querySelectorAll('tbody tr');
    rows.forEach(function(row) {
      row.style.display = row.textContent.toLowerCase().indexOf(val) > -1 ? '' : 'none';
    });
  });
}

/* ------------------------------------------------------------------
   SUPABASE STATUS BADGE
   ------------------------------------------------------------------ */
function renderSupabaseBadge() {
  var el = document.getElementById('supabaseBadge');
  if (!el) return;
  if (SUPABASE_ANON_KEY) {
    el.innerHTML = '<span style="color:#22c55e;font-weight:600;">● Supabase configuré</span> — données en direct';
    el.style.background = 'rgba(34,197,94,.08)';
    el.style.borderColor = 'rgba(34,197,94,.25)';
  } else {
    el.innerHTML = '<span style="color:#f59e0b;font-weight:600;">⚠ Supabase non configuré</span> — données de démonstration. Ajoutez <code>SUPABASE_ANON_KEY</code> dans <code>assets/js/admin.js</code>';
    el.style.background = 'rgba(245,158,11,.08)';
    el.style.borderColor = 'rgba(245,158,11,.25)';
  }
}

/* ------------------------------------------------------------------
   BULK GUEST PASS — V24
   Ajout groupé de plusieurs invités en une seule action
   ------------------------------------------------------------------ */
var bulkGuestRows = []; /* tableau des lignes invités en cours */

function renderBulkForm() {
  var wrap = document.getElementById('bulkGuestWrap');
  if (!wrap) return;

  /* Sélecteurs staff et type pass */
  var staffOpts = STAFF_MEMBERS.map(function(s) {
    return '<option value="' + s + '">' + s + '</option>';
  }).join('');

  wrap.innerHTML =
    '<div class="bulk-form-controls">' +
      '<div class="bulk-form-row">' +
        '<div class="bulk-form-group">' +
          '<label>Staff responsable <span style="color:var(--orange)">*</span></label>' +
          '<select id="bulkStaff" class="admin-search-input" style="max-width:220px;padding:9px 12px;">' +
            '<option value="">— Sélectionner —</option>' + staffOpts +
          '</select>' +
        '</div>' +
        '<div class="bulk-form-group">' +
          '<label>Type de pass <span style="color:var(--orange)">*</span></label>' +
          '<select id="bulkPassType" class="admin-search-input" style="max-width:180px;padding:9px 12px;">' +
            '<option value="Standard">Standard</option>' +
            '<option value="Courtside">Courtside</option>' +
            '<option value="VIP">VIP</option>' +
          '</select>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="bulkRowsContainer" style="margin-top:14px;display:flex;flex-direction:column;gap:10px;"></div>' +
    '<div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">' +
      '<button class="admin-action-btn" onclick="addBulkRow()" style="font-size:.85rem;">＋ Ajouter une ligne invité</button>' +
      '<button class="admin-btn" onclick="submitBulkGuests()">Enregistrer tous les invités</button>' +
    '</div>' +
    '<div id="bulkMsg" style="display:none;margin-top:12px;border-radius:8px;padding:12px 16px;font-size:.85rem;"></div>';

  /* Ajouter une première ligne par défaut */
  addBulkRow();
}

function addBulkRow() {
  var container = document.getElementById('bulkRowsContainer');
  if (!container) return;
  var idx = container.children.length;

  var row = document.createElement('div');
  row.className = 'bulk-guest-row';
  row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1.5fr 1fr 1.5fr auto;gap:8px;align-items:center;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;padding:10px 12px;';
  row.dataset.idx = idx;
  row.innerHTML =
    '<input type="text"  class="admin-search-input" placeholder="Nom *"        style="font-size:.82rem;padding:8px 10px;" data-field="nom" />' +
    '<input type="text"  class="admin-search-input" placeholder="Prénom *"     style="font-size:.82rem;padding:8px 10px;" data-field="prenom" />' +
    '<input type="email" class="admin-search-input" placeholder="Email *"      style="font-size:.82rem;padding:8px 10px;" data-field="email" />' +
    '<input type="tel"   class="admin-search-input" placeholder="Téléphone"    style="font-size:.82rem;padding:8px 10px;" data-field="telephone" />' +
    '<input type="text"  class="admin-search-input" placeholder="Message (opt)"style="font-size:.82rem;padding:8px 10px;" data-field="message" />' +
    '<button class="admin-action-btn btn-ko" onclick="removeBulkRow(this)" style="padding:6px 10px;font-size:.8rem;">✕</button>';
  container.appendChild(row);
}

function removeBulkRow(btn) {
  var row = btn.closest('.bulk-guest-row');
  if (row) row.remove();
}

function submitBulkGuests() {
  var staff    = (document.getElementById('bulkStaff')    || {}).value;
  var passType = (document.getElementById('bulkPassType') || {}).value;
  var msgEl    = document.getElementById('bulkMsg');
  var container= document.getElementById('bulkRowsContainer');

  function showMsg(text, ok) {
    if (!msgEl) return;
    msgEl.style.display = 'block';
    msgEl.style.background  = ok ? 'rgba(34,197,94,.1)'  : 'rgba(220,53,69,.1)';
    msgEl.style.border      = ok ? '1px solid rgba(34,197,94,.3)' : '1px solid rgba(220,53,69,.3)';
    msgEl.style.color       = ok ? '#5adc7a' : '#ff7b8a';
    msgEl.textContent       = text;
    setTimeout(function(){ msgEl.style.display = 'none'; }, 5000);
  }

  /* Validation header */
  if (!staff) { showMsg('⚠ Sélectionnez un staff responsable.', false); return; }
  if (!passType) { showMsg('⚠ Sélectionnez un type de pass.', false); return; }

  /* Collecte des lignes */
  var rows = container ? container.querySelectorAll('.bulk-guest-row') : [];
  if (!rows.length) { showMsg('⚠ Ajoutez au moins une ligne invité.', false); return; }

  var guestsToInsert = [];
  var hasError = false;

  rows.forEach(function(row) {
    var nom      = row.querySelector('[data-field="nom"]').value.trim();
    var prenom   = row.querySelector('[data-field="prenom"]').value.trim();
    var email    = row.querySelector('[data-field="email"]').value.trim();
    var tel      = row.querySelector('[data-field="telephone"]').value.trim();
    var message  = row.querySelector('[data-field="message"]').value.trim();

    if (!nom || !prenom || !email) {
      row.style.borderColor = 'rgba(220,53,69,.5)';
      hasError = true;
    } else {
      row.style.borderColor = '';
      guestsToInsert.push({
        guest_nom:       nom,
        guest_prenom:    prenom,
        guest_email:     email,
        guest_telephone: tel   || null,
        invited_by:      staff,
        pass_type:       passType,
        message:         message || null,
        status:          'en_attente'
      });
    }
  });

  if (hasError) { showMsg('⚠ Remplissez Nom, Prénom et Email pour chaque ligne (surlignées en rouge).', false); return; }

  /* Mise à jour du mock local */
  var now = new Date();
  var dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  guestsToInsert.forEach(function(g) {
    MOCK_INVITES.push({
      id:    MOCK_INVITES.length + 1,
      staff: g.invited_by,
      guest: g.guest_prenom + ' ' + g.guest_nom,
      email: g.guest_email,
      type:  g.pass_type,
      date:  dateStr
    });
  });
  renderInvitesTable();
  renderKPIs();

  /* Supabase insert multiple si dispo */
  var sb = getSupabase();
  if (sb) {
    sb.from('staff_guest_passes')
      .insert(guestsToInsert)
      .then(function(res) {
        if (res.error) {
          showMsg('⚠ Enregistrement Supabase partiel : ' + res.error.message, false);
        } else {
          showMsg('✓ ' + guestsToInsert.length + ' invité(s) enregistré(s) dans Supabase.', true);
        }
      });
  } else {
    showMsg(
      '✓ ' + guestsToInsert.length + ' invité(s) préparé(s) en mode démo. Connexion Supabase à configurer pour l\'enregistrement réel.',
      true
    );
  }

  /* Réinitialiser les lignes */
  if (container) container.innerHTML = '';
  addBulkRow();
}

/* ------------------------------------------------------------------
   INIT
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function() {
  renderSupabaseBadge();
  renderKPIs();
  renderMediaTable();
  renderCourtsideTable();
  renderInvitesTable();

  renderBulkForm();

  filterTable('mediaSearch',     'mediaTable');
  filterTable('courtsideSearch', 'courtsideTable');
  filterTable('invitesSearch',   'invitesTable');

  /* Tenter refresh Supabase si clé disponible */
  if (SUPABASE_ANON_KEY) {
    refreshMediaFromSupabase();
    refreshCourtsideListFromSupabase();
    refreshInvitesFromSupabase();
  }

  /* Date de dernière mise à jour */
  var el = document.getElementById('lastUpdate');
  if (el) {
    var now = new Date();
    el.textContent = now.toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }
});
