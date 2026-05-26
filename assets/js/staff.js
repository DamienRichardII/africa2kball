/* ============================================================
   AFRICA2KBALL — STAFF.JS  V23
   Espace staff : login + formulaire pass invité
   ============================================================ */

'use strict';

/* ------------------------------------------------------------------
   SUPABASE CONFIG — identique à admin.js
   JAMAIS de service_role key ici
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
   AUTH — Login staff côté frontend (protection légère)
   Identifiant : "staff"  |  Code : "93"
   ------------------------------------------------------------------ */
var STAFF_LOGIN    = 'staff';
var STAFF_CODE     = '93';
var SESSION_KEY    = 'a2kb_staff_session';

var sessionPassList = []; /* passes enregistrés pendant la session */

function handleLogin(e) {
  e.preventDefault();
  var id   = document.getElementById('staffId').value.trim();
  var code = document.getElementById('staffCode').value.trim();

  if (id === STAFF_LOGIN && code === STAFF_CODE) {
    /* Stocker session en mémoire uniquement */
    sessionPassList = [];
    showDashboard(id);
  } else {
    var errEl = document.getElementById('loginError');
    errEl.style.display = 'block';
    setTimeout(function() { errEl.style.display = 'none'; }, 3500);
  }
}

function showDashboard(staffName) {
  document.getElementById('loginScreen').style.display     = 'none';
  document.getElementById('staffDashboard').style.display  = 'block';
  document.getElementById('staffLogoutBtn').style.display  = 'inline-flex';

  var badge = document.getElementById('staffNameBadge');
  if (badge) {
    badge.textContent = staffName.charAt(0).toUpperCase() + staffName.slice(1);
  }

  renderPassesList();
}

function staffLogout() {
  document.getElementById('loginScreen').style.display    = 'block';
  document.getElementById('staffDashboard').style.display = 'none';
  document.getElementById('staffLogoutBtn').style.display = 'none';
  document.getElementById('staffId').value   = '';
  document.getElementById('staffCode').value = '';
  sessionPassList = [];
}

/* ------------------------------------------------------------------
   GUEST PASS FORM
   ------------------------------------------------------------------ */
function handleGuestPass(e) {
  e.preventDefault();

  var firstName  = document.getElementById('guestFirstName').value.trim();
  var lastName   = document.getElementById('guestLastName').value.trim();
  var email      = document.getElementById('guestEmail').value.trim();
  var phone      = document.getElementById('guestPhone').value.trim();
  var passType   = document.querySelector('input[name="passType"]:checked');
  var staffMember= document.getElementById('guestStaff').value;
  var note       = document.getElementById('guestNote').value.trim();
  var sendEmail  = document.getElementById('sendEmail').checked;

  var successEl  = document.getElementById('guestPassSuccess');
  var errorEl    = document.getElementById('guestPassError');

  /* Validation */
  if (!firstName || !lastName || !email || !passType || !staffMember) {
    errorEl.style.display = 'block';
    setTimeout(function() { errorEl.style.display = 'none'; }, 3500);
    return;
  }

  var now = new Date();
  var dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  var newPass = {
    guest:  firstName + ' ' + lastName,
    email:  email,
    phone:  phone,
    type:   passType.value,
    staff:  staffMember,
    note:   note,
    date:   dateStr
  };

  /* Ajouter en session */
  sessionPassList.push(newPass);
  renderPassesList();

  /* Supabase insert si disponible */
  savePassToSupabase(newPass);

  /* Email optionnel */
  if (sendEmail) {
    sendGuestConfirmationEmail(firstName + ' ' + lastName, email, passType.value);
  }

  /* Reset form */
  document.getElementById('guestPassForm').reset();
  document.getElementById('passStandard').checked = true;

  /* Feedback */
  successEl.style.display = 'block';
  setTimeout(function() { successEl.style.display = 'none'; }, 4000);
}

/* ------------------------------------------------------------------
   RENDER LISTE PASSES (session en cours)
   ------------------------------------------------------------------ */
function renderPassesList() {
  var list    = document.getElementById('staffPassesList');
  var counter = document.getElementById('passCount');

  if (counter) {
    counter.textContent = sessionPassList.length + ' pass' + (sessionPassList.length !== 1 ? 's' : '');
  }

  if (!sessionPassList.length) {
    list.innerHTML = '<p style="color:var(--muted); font-size:.85rem; text-align:center; padding:10px 0;">Aucun pass enregistré pour cette session.</p>';
    return;
  }

  var typeClass = function(t) {
    if (t === 'VIP')       return 'pb-vip';
    if (t === 'Courtside') return 'pb-court';
    return 'pb-standard';
  };

  var typeIcon = function(t) {
    if (t === 'VIP')       return '🏆';
    if (t === 'Courtside') return '⭐';
    return '🎫';
  };

  list.innerHTML = sessionPassList.slice().reverse().map(function(p) {
    return '<div class="staff-pass-item">' +
      '<div class="pi-icon">' + typeIcon(p.type) + '</div>' +
      '<div class="pi-body">' +
        '<div class="pi-name">' + esc(p.guest) + '</div>' +
        '<div class="pi-meta">' + esc(p.email) + ' · Staff : ' + esc(p.staff) + ' · ' + p.date + '</div>' +
      '</div>' +
      '<span class="staff-pass-badge ' + typeClass(p.type) + '">' + p.type + '</span>' +
    '</div>';
  }).join('');
}

/* ------------------------------------------------------------------
   EMAIL CONFIRMATION INVITÉ (mailto:)
   ------------------------------------------------------------------ */
function sendGuestConfirmationEmail(nomComplet, email, passType) {
  var subject = encodeURIComponent('[Africa2KBall] Votre invitation — Édition 3');
  var body    = encodeURIComponent(
    'Bonjour ' + nomComplet + ',\n\n' +
    'Vous êtes invité(e) à l\'édition 3 du tournoi Africa2KBall !\n\n' +
    '📅 Date : 07 juin 2026\n' +
    '📍 Lieu : Gymnase Lino Ventura, Pavillons-sous-Bois\n' +
    '🎫 Type de pass : ' + passType + '\n\n' +
    'Présentez-vous à l\'accueil avec cet email de confirmation. Un membre du staff vous y attendra.\n\n' +
    'À très bientôt !\n\n' +
    'L\'équipe Africa2KBall\n' +
    'af2kball@gmail.com'
  );
  window.open('mailto:' + encodeURIComponent(email) + '?subject=' + subject + '&body=' + body, '_blank');
}

/* ------------------------------------------------------------------
   SUPABASE — INSERT PASS (actif quand clé fournie)
   ------------------------------------------------------------------ */
function savePassToSupabase(passData) {
  var sb = getSupabase();
  if (!sb) return;
  sb.from('staff_guest_passes')
    .insert([{
      staff_member: passData.staff,
      guest_name:   passData.guest,
      guest_email:  passData.email,
      guest_phone:  passData.phone  || null,
      pass_type:    passData.type,
      note:         passData.note   || null
    }])
    .then(function(res) {
      if (res.error) {
        console.warn('[Africa2KBall] Supabase insert error:', res.error.message);
      }
    });
}

/* ------------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------------ */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ------------------------------------------------------------------
   INIT
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function() {
  /* Le dashboard est caché par défaut — l'affichage login est géré par handleLogin */
  /* Rien à initialiser tant qu'on n'est pas connecté */
});
