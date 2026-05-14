/* ============================================================
   AFRICA2KBALL — ADMIN.JS
   Interface d'administration — données mock (prêt à connecter)
   ============================================================ */

'use strict';

/* ------------------------------------------------------------------
   MOCK DATA — à remplacer par des appels API/Airtable/Sheets
   ------------------------------------------------------------------ */
var MOCK_MEDIA = [
  { nom: 'Aïssatou Diallo',   email: 'a.diallo@mediasport.fr',    tel: '06 11 22 33 44', org: 'Média Sport',       reseaux: '@mediasport',    statut: 'Confirmé' },
  { nom: 'Karim Ndiaye',      email: 'k.ndiaye@afrobasket.com',   tel: '06 55 66 77 88', org: 'AfroBasket.com',    reseaux: '@afrobasket',    statut: 'En attente' },
  { nom: 'Lucie Fontaine',    email: 'l.fontaine@93basket.fr',    tel: '07 10 20 30 40', org: '93 Basket Mag',     reseaux: '@93basketmag',   statut: 'Confirmé' },
  { nom: 'Omar Coulibaly',    email: 'o.coulibaly@bballafrica.io', tel: '06 77 88 99 00', org: 'BBall Africa',      reseaux: '@bballafrica',   statut: 'En attente' },
  { nom: 'Fatou Sarr',        email: 'f.sarr@courriersport.fr',   tel: '07 33 44 55 66', org: 'Courrier Sport',    reseaux: '@courriersport', statut: 'Décliné' }
];

var MOCK_BILLETS = [
  { nom: 'Mamadou Konaté',   email: 'm.konate@mail.com',    type: 'Courtside', qte: 2, montant: '20 €', paiement: 'Payé',        date: '02/05/2026' },
  { nom: 'Priya Rajesh',     email: 'p.rajesh@mail.com',    type: 'Standard',  qte: 4, montant: 'Gratuit', paiement: 'S/O',      date: '03/05/2026' },
  { nom: 'Théo Girard',      email: 't.girard@mail.com',    type: 'Courtside', qte: 1, montant: '10 €', paiement: 'Payé',        date: '05/05/2026' },
  { nom: 'Binta Diarra',     email: 'b.diarra@mail.com',    type: 'Standard',  qte: 2, montant: 'Gratuit', paiement: 'S/O',      date: '07/05/2026' },
  { nom: 'Lucas Ferreira',   email: 'l.ferreira@mail.com',  type: 'Courtside', qte: 3, montant: '30 €', paiement: 'En attente',  date: '09/05/2026' }
];

/* ------------------------------------------------------------------
   KPI CALCULATION
   ------------------------------------------------------------------ */
function computeKPIs() {
  var courtside = MOCK_BILLETS.filter(function(b){ return b.type === 'Courtside'; });
  var standard  = MOCK_BILLETS.filter(function(b){ return b.type === 'Standard'; });
  var paidCourt = courtside.filter(function(b){ return b.paiement === 'Payé'; });
  var revenu    = paidCourt.reduce(function(acc, b){ return acc + (b.qte * 10); }, 0);
  var confirmedMedia = MOCK_MEDIA.filter(function(m){ return m.statut === 'Confirmé'; });

  return {
    placesAchetees:   MOCK_BILLETS.reduce(function(a, b){ return a + b.qte; }, 0),
    visiteurs:        MOCK_BILLETS.reduce(function(a, b){ return a + b.qte; }, 0),
    standards:        standard.reduce(function(a, b){ return a + b.qte; }, 0),
    courtside:        courtside.reduce(function(a, b){ return a + b.qte; }, 0),
    mediaInscrits:    MOCK_MEDIA.length,
    mediaConfirmes:   confirmedMedia.length,
    benevolesInscrits: 0,
    revenuCourtside:  revenu
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
    { label: 'Places achetées',          value: kpis.placesAchetees,   icon: 'ticket',   note: 'Toutes catégories' },
    { label: 'Visiteurs attendus',        value: kpis.visiteurs,        icon: 'users',    note: 'Estimation cumulée' },
    { label: 'Standard (gratuit)',        value: kpis.standards,        icon: 'user',     note: 'Entrées gratuites' },
    { label: 'Courtside — 10 €',          value: kpis.courtside,        icon: 'star',     note: 'Billets premium' },
    { label: 'Médias inscrits',           value: kpis.mediaInscrits,    icon: 'camera',   note: kpis.mediaConfirmes + ' confirmés' },
    { label: 'Visiteurs site (7 j.)',     value: '—',                   icon: 'chart',    note: 'Analytics à connecter' },
    { label: 'Demandes bénévoles',        value: kpis.benevolesInscrits, icon: 'heart',   note: 'Formulaire à brancher' },
    { label: 'Revenus Courtside estimés', value: kpis.revenuCourtside + ' €', icon: 'euro', note: 'Paiements confirmés' }
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
   RENDER TABLEAU BILLETTERIE
   ------------------------------------------------------------------ */
function renderBilletTable() {
  var tbody = document.getElementById('billetTableBody');
  if (!tbody) return;

  tbody.innerHTML = MOCK_BILLETS.map(function(b) {
    var cls = b.paiement === 'Payé' ? 'badge-ok' : (b.paiement === 'S/O' ? 'badge-muted' : 'badge-wait');
    var typeCls = b.type === 'Courtside' ? 'badge-court' : 'badge-std';
    return '<tr>' +
      '<td>' + b.nom + '</td>' +
      '<td><a href="mailto:' + b.email + '">' + b.email + '</a></td>' +
      '<td><span class="admin-badge ' + typeCls + '">' + b.type + '</span></td>' +
      '<td class="text-center">' + b.qte + '</td>' +
      '<td>' + b.montant + '</td>' +
      '<td><span class="admin-badge ' + cls + '">' + b.paiement + '</span></td>' +
      '<td class="text-muted">' + b.date + '</td>' +
    '</tr>';
  }).join('');
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
      'Date : 07 juin 2026\n' +
      'Lieu : Gymnase Lino Ventura, Pavillons-sous-Bois\n\n' +
      'Votre accréditation est confirmée. Nous reviendrons vers vous avec les détails pratiques.\n\n' +
      'L\'équipe Africa2KBall\n' +
      'contact@africa2kball.com'
    );
  } else if (type === 'rappel-general') {
    subject = encodeURIComponent('[Africa2KBall] Rappel — J-7 avant le tournoi !');
    body    = encodeURIComponent(
      'Bonjour,\n\n' +
      'Le tournoi Africa2KBall Édition 3 approche !\n\n' +
      'Rendez-vous le 07 juin 2026 au Gymnase Lino Ventura, Pavillons-sous-Bois.\n\n' +
      'À très bientôt,\n' +
      'L\'équipe Africa2KBall'
    );
  } else {
    subject = encodeURIComponent('[Africa2KBall] Message de l\'organisation — Édition 3');
    body    = encodeURIComponent(
      'Bonjour,\n\n' +
      '\n\n' +
      'L\'équipe Africa2KBall\n' +
      'contact@africa2kball.com'
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
    euro:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12M4 14h12M19 6a7 7 0 1 0 0 12A7 7 0 0 0 19 6z"/></svg>'
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
   INIT
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function() {
  renderKPIs();
  renderMediaTable();
  renderBilletTable();
  filterTable('mediaSearch', 'mediaTable');
  filterTable('billetSearch', 'billetTable');

  /* Date de dernière mise à jour */
  var el = document.getElementById('lastUpdate');
  if (el) {
    var now = new Date();
    el.textContent = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
});
