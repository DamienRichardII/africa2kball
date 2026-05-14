/* ============================================================
   AFRICA2KBALL — main.js v3
   ============================================================ */

/* --- ENDPOINTS — renseigner avant mise en prod --- */
var FORM_ENDPOINTS = {
  billetterie:  '',
  inscriptions: '',
  contact:      ''
};


/* --- PAIEMENT COURTSIDE --- */
var PAYMENT_LINKS = {
  courtside: '' /* Renseigner avec l'URL Stripe Payment Link avant mise en ligne */
};
/* ============================================================
   STATUT ROSTERS — Édition 3 (compositions à venir)
   ============================================================ */
var ROSTER_STATUS = {
  caraibes:  { label: 'Caraïbes',      flag: 'caraibes.png',    accent: '#00b4d8' },
  senegal:   { label: 'Sénégal',       flag: 'senegal.png',     accent: '#00a86b' },
  kongo:     { label: 'Kongo',         flag: 'kongo.png',       accent: '#e63946' },
  cdi:       { label: "Côte d'Ivoire", flag: 'cote-ivoire.png', accent: '#f4a261' },
  cameroun:  { label: 'Cameroun',      flag: 'cameroun.png',    accent: '#2dc653' },
  mali:      { label: 'Mali',          flag: 'mali.png',        accent: '#f9c74f' },
  maghreb:   { label: 'Maghreb',       flag: 'maghreb.png',     accent: '#e8374c' },
  diaspora:  { label: 'Diaspora',      flag: 'diaspora.png',    accent: '#c9a77a' }
};

/* ============================================================
   MENU BURGER
   ============================================================ */
(function () {
  var burger    = document.getElementById('burger');
  var mobileNav = document.getElementById('mobileNav');
  if (!burger || !mobileNav) return;

  burger.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
  });

  document.addEventListener('click', function (e) {
    if (!burger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  });
})();

/* ============================================================
   COMPTEUR BILLETS (billetterie.html)
   ============================================================ */
(function () {
  var minusBtn   = document.getElementById('ticketMinus');
  var plusBtn    = document.getElementById('ticketPlus');
  var countInput = document.getElementById('ticketCount');
  if (!minusBtn || !plusBtn || !countInput) return;

  function updateCount(delta) {
    var val = parseInt(countInput.value, 10) + delta;
    val = Math.max(1, Math.min(20, val));
    countInput.value = val;
    minusBtn.disabled = val <= 1;
    plusBtn.disabled  = val >= 20;
  }

  minusBtn.addEventListener('click', function () { updateCount(-1); });
  plusBtn.addEventListener('click',  function () { updateCount(1);  });
})();

/* ============================================================
   SÉLECTION TYPE DE BILLET (billetterie.html)
   ============================================================ */
(function () {
  var types = document.querySelectorAll('#ticketTypes .ticket-type');
  if (!types.length) return;

  types.forEach(function (label) {
    label.addEventListener('click', function () {
      types.forEach(function (l) { l.classList.remove('selected'); });
      label.classList.add('selected');
      var radio = label.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
})();


/* ============================================================
   PAIEMENT COURTSIDE — détection + affichage zone paiement
   ============================================================ */
(function () {
  var types = document.querySelectorAll('#ticketTypes .ticket-type');
  var paymentZone = document.getElementById('courtsidePaymentZone');
  var paymentAction = document.getElementById('courtsidePaymentAction');
  if (!types.length || !paymentZone) return;

  function updateCourtsideZone() {
    var selected = document.querySelector('#ticketTypes input[type="radio"]:checked');
    var isCourt = selected && selected.value === 'courtside';
    paymentZone.style.display = isCourt ? '' : 'none';
    if (!paymentAction) return;
    if (isCourt) {
      if (PAYMENT_LINKS.courtside) {
        paymentAction.innerHTML =
          '<a href="' + PAYMENT_LINKS.courtside + '" target="_blank" rel="noopener noreferrer" class="btn-primary courtside-pay-btn">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' +
          'Payer mon accès Courtside — 10 €</a>';
      } else {
        paymentAction.innerHTML =
          '<p class="courtside-pay-pending">Le lien de paiement Courtside doit encore être connecté par l'équipe Africa2KBall.</p>';
      }
    }
  }

  types.forEach(function (label) {
    label.addEventListener('click', function () {
      setTimeout(updateCourtsideZone, 50);
    });
  });

  updateCourtsideZone();
})();

/* ============================================================
   SÉLECTION TYPE INSCRIPTION (inscriptions.html)
   ============================================================ */
(function () {
  var selector = document.getElementById('typeSelectorInscription');
  if (!selector) return;

  var options = selector.querySelectorAll('.type-option');
  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      options.forEach(function (o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      var radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
})();

/* ============================================================
   ROSTER DYNAMIQUE (nations.html)
   ============================================================ */
(function () {
  var rosterSection = document.getElementById('rosterSection');
  if (!rosterSection) return;

  var nationCards = document.querySelectorAll('.nation-card[data-nation]');
  if (!nationCards.length) return;

  /* Éléments du roster (présents dans le HTML initial) */

  function renderRoster(nationKey) {
    var data = ROSTER_STATUS[nationKey];
    if (!data) return;

    /* Active card highlight */
    nationCards.forEach(function (c) { c.classList.remove('active-nation'); });
    var activeCard = document.querySelector('.nation-card[data-nation="' + nationKey + '"]');
    if (activeCard) activeCard.classList.add('active-nation');

    /* Reveal section */
    rosterSection.style.display = '';
    rosterSection.removeAttribute('aria-hidden');

    /* Loading transition */
    rosterSection.classList.add('roster-loading');

    setTimeout(function () {
      /* Update flag */
      var flagEl = document.getElementById('rosterFlag');
      if (flagEl) {
        flagEl.src = 'assets/images/flags/' + data.flag;
        flagEl.alt = 'Drapeau ' + data.label;
      }

      /* Update nation name */
      var nameEl = document.getElementById('rosterNationName');
      if (nameEl) nameEl.textContent = data.label.toUpperCase();

      /* Apply accent colour */
      var card = document.getElementById('rosterCard');
      if (card) card.style.setProperty('--nation-accent', data.accent);

      /* Update h3 color */
      var h3 = rosterSection.querySelector('.roster-coming-copy h3');
      if (h3) h3.style.color = data.accent;

      rosterSection.classList.remove('roster-loading');
    }, 140);
  }

  /* Événements clic sur les cartes nation */
  nationCards.forEach(function (card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function () {
      var key = card.getAttribute('data-nation');
      renderRoster(key);
      /* Scroll vers le roster */
      setTimeout(function () {
        rosterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 220);
    });

    /* Accessibilité clavier sur les boutons "Voir le roster" */
    var btn = card.querySelector('.nation-card-btn');
    if (btn) {
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    }
  });

  /* Afficher Sénégal par défaut (déjà dans le HTML) */
  var activeCard = document.querySelector('.nation-card[data-nation="senegal"]');
  if (activeCard) {
    activeCard.classList.add('active-nation');
    var btn = activeCard.querySelector('.nation-card-btn');
    if (btn) btn.classList.add('active');
  }
  /* Ajouter la pilule Sénégal */
  if (rosterTitle && rosterTitle.parentNode) {
    var pill = document.createElement('span');
    pill.className = 'roster-active-pill';
    pill.textContent = 'Sénégal';
    rosterTitle.parentNode.insertBefore(pill, rosterTitle);
  }
})();

/* ============================================================
   UTILITAIRES VALIDATION
   ============================================================ */
function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

function setFieldError(grpId, errId, show) {
  var grp = document.getElementById(grpId);
  var err = document.getElementById(errId);
  if (grp) grp.classList.toggle('has-error', show);
  if (err) err.classList.toggle('visible', show);
  return !show;
}

function clearFeedback(feedbackId) {
  var fb = document.getElementById(feedbackId);
  if (!fb) return;
  fb.className = 'form-feedback';
  fb.textContent = '';
}

function showFeedback(feedbackId, type, msg) {
  var fb = document.getElementById(feedbackId);
  if (!fb) return;
  fb.className = 'form-feedback ' + type;
  fb.textContent = msg;
  fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearFieldErrors(ids) {
  ids.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() {
        var grp = document.getElementById('grp-' + id);
        var err = document.getElementById('err-' + id);
        if (grp) grp.classList.remove('has-error');
        if (err) err.classList.remove('visible');
      });
      el.addEventListener('change', function() {
        var grp = document.getElementById('grp-' + id);
        var err = document.getElementById('err-' + id);
        if (grp) grp.classList.remove('has-error');
        if (err) err.classList.remove('visible');
      });
    }
  });
}

/* ============================================================
   SOUMISSION GÉNÉRIQUE
   ============================================================ */
function submitForm(endpoint, formData, feedbackId, msgPending, msgSuccess, onSuccess) {
  if (!endpoint) {
    /* Endpoint non branché — message transparent */
    showFeedback(feedbackId, 'success',
      'Votre demande a bien été préparée. Le branchement d\'envoi doit encore être connecté par l\'équipe technique Africa2KBall.');
    if (onSuccess) onSuccess();
    return;
  }

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData))
  })
    .then(function (res) {
      if (res.ok) {
        showFeedback(feedbackId, 'success', msgSuccess);
        if (onSuccess) onSuccess();
      } else {
        showFeedback(feedbackId, 'error',
          'Une erreur est survenue. Merci de réessayer ou de contacter l\'équipe Africa2KBall directement.');
      }
    })
    .catch(function () {
      showFeedback(feedbackId, 'error',
        'Une erreur est survenue. Merci de réessayer ou de contacter l\'équipe Africa2KBall directement.');
    });
}

/* ============================================================
   FORMULAIRE BILLETTERIE
   Champs obligatoires : Nom, Prénom, Email, Téléphone, Nb billets, Type
   ============================================================ */
(function () {
  var form = document.getElementById('formBilletterie');
  if (!form) return;
  var feedbackId = 'feedbackBilletterie';
  var MSG_SUCCESS = 'Votre demande de billets a bien été envoyée. L\'équipe Africa2KBall reviendra vers vous rapidement.';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearFeedback(feedbackId);

    var nom     = document.getElementById('b-nom');
    var prenom  = document.getElementById('b-prenom');
    var email   = document.getElementById('b-email');
    var tel     = document.getElementById('b-tel');
    var valid   = true;

    if (!nom    || !nom.value.trim())          { setFieldError('grp-b-nom',    'err-b-nom',    true);  valid = false; }
    else setFieldError('grp-b-nom',    'err-b-nom',    false);

    if (!prenom || !prenom.value.trim())       { setFieldError('grp-b-prenom', 'err-b-prenom', true);  valid = false; }
    else setFieldError('grp-b-prenom', 'err-b-prenom', false);

    if (!email  || !isValidEmail(email.value)) { setFieldError('grp-b-email',  'err-b-email',  true);  valid = false; }
    else setFieldError('grp-b-email',  'err-b-email',  false);

    if (!tel || !tel.value.trim())             { setFieldError('grp-b-tel',    'err-b-tel',    true);  valid = false; }
    else setFieldError('grp-b-tel',    'err-b-tel',    false);

    var rgpd_b = document.getElementById('b-rgpd');
    if (!rgpd_b || !rgpd_b.checked) { setFieldError('grp-b-rgpd', 'err-b-rgpd', true); valid = false; }
    else setFieldError('grp-b-rgpd', 'err-b-rgpd', false);

    if (!valid) return;

    submitForm(
      FORM_ENDPOINTS.billetterie,
      new FormData(form),
      feedbackId,
      '',
      MSG_SUCCESS,
      function () {
        form.reset();
        var countInput = document.getElementById('ticketCount');
        if (countInput) countInput.value = 1;
        var firstType = document.querySelector('#ticketTypes .ticket-type');
        if (firstType) {
          document.querySelectorAll('#ticketTypes .ticket-type').forEach(function (l) { l.classList.remove('selected'); });
          firstType.classList.add('selected');
          var radio = firstType.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        }
      }
    );
  });

  clearFieldErrors(['b-nom','b-prenom','b-email','b-tel','b-rgpd']);
})();

/* ============================================================
   FORMULAIRE INSCRIPTIONS
   Champs obligatoires : Nom, Prénom, Email, Téléphone, Type, Disponibilités, Message
   ============================================================ */
(function () {
  var form = document.getElementById('formInscriptions');
  if (!form) return;
  var feedbackId = 'feedbackInscriptions';
  var MSG_SUCCESS = 'Votre inscription a bien été envoyée. Merci de rejoindre l\'aventure Africa2KBall.';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearFeedback(feedbackId);

    var nom    = document.getElementById('i-nom');
    var prenom = document.getElementById('i-prenom');
    var email  = document.getElementById('i-email');
    var tel    = document.getElementById('i-tel');
    var dispo  = document.getElementById('i-dispo');
    var msg    = document.getElementById('i-message');
    var valid  = true;

    if (!nom    || !nom.value.trim())          { setFieldError('grp-i-nom',    'err-i-nom',    true);  valid = false; }
    else setFieldError('grp-i-nom',    'err-i-nom',    false);

    if (!prenom || !prenom.value.trim())       { setFieldError('grp-i-prenom', 'err-i-prenom', true);  valid = false; }
    else setFieldError('grp-i-prenom', 'err-i-prenom', false);

    if (!email  || !isValidEmail(email.value)) { setFieldError('grp-i-email',  'err-i-email',  true);  valid = false; }
    else setFieldError('grp-i-email',  'err-i-email',  false);

    if (!tel || !tel.value.trim())             { setFieldError('grp-i-tel',    'err-i-tel',    true);  valid = false; }
    else setFieldError('grp-i-tel',    'err-i-tel',    false);

    if (!dispo || !dispo.value.trim())         { setFieldError('grp-i-dispo',  'err-i-dispo',  true);  valid = false; }
    else setFieldError('grp-i-dispo',  'err-i-dispo',  false);

    if (!msg || !msg.value.trim())             { setFieldError('grp-i-msg',    'err-i-msg',    true);  valid = false; }
    else setFieldError('grp-i-msg',    'err-i-msg',    false);

    var rgpd_i = document.getElementById('i-rgpd');
    if (!rgpd_i || !rgpd_i.checked) { setFieldError('grp-i-rgpd', 'err-i-rgpd', true); valid = false; }
    else setFieldError('grp-i-rgpd', 'err-i-rgpd', false);

    if (!valid) return;

    submitForm(
      FORM_ENDPOINTS.inscriptions,
      new FormData(form),
      feedbackId,
      '',
      MSG_SUCCESS,
      function () { form.reset(); }
    );
  });

  clearFieldErrors(['i-nom','i-prenom','i-email','i-tel','i-dispo','i-message','i-rgpd']);
})();

/* ============================================================
   FORMULAIRE CONTACT
   Champs obligatoires : Nom, Prénom, Email, Sujet, Message
   ============================================================ */
(function () {
  var form = document.getElementById('formContact');
  if (!form) return;
  var feedbackId = 'feedbackContact';
  var MSG_SUCCESS = 'Votre message a bien été envoyé. L\'équipe Africa2KBall vous répondra rapidement.';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearFeedback(feedbackId);

    var nom     = document.getElementById('c-nom');
    var prenom  = document.getElementById('c-prenom');
    var email   = document.getElementById('c-email');
    var sujet   = document.getElementById('c-sujet');
    var message = document.getElementById('c-message');
    var valid   = true;

    if (!nom    || !nom.value.trim())          { setFieldError('grp-c-nom',     'err-c-nom',     true); valid = false; }
    else setFieldError('grp-c-nom',     'err-c-nom',     false);

    if (!prenom || !prenom.value.trim())       { setFieldError('grp-c-prenom',  'err-c-prenom',  true); valid = false; }
    else setFieldError('grp-c-prenom',  'err-c-prenom',  false);

    if (!email  || !isValidEmail(email.value)) { setFieldError('grp-c-email',   'err-c-email',   true); valid = false; }
    else setFieldError('grp-c-email',   'err-c-email',   false);

    if (!sujet  || !sujet.value)               { setFieldError('grp-c-sujet',   'err-c-sujet',   true); valid = false; }
    else setFieldError('grp-c-sujet',   'err-c-sujet',   false);

    if (!message || !message.value.trim())     { setFieldError('grp-c-message', 'err-c-message', true); valid = false; }
    else setFieldError('grp-c-message', 'err-c-message', false);

    var rgpd_c = document.getElementById('c-rgpd');
    if (!rgpd_c || !rgpd_c.checked) { setFieldError('grp-c-rgpd', 'err-c-rgpd', true); valid = false; }
    else setFieldError('grp-c-rgpd', 'err-c-rgpd', false);

    if (!valid) return;

    submitForm(
      FORM_ENDPOINTS.contact,
      new FormData(form),
      feedbackId,
      '',
      MSG_SUCCESS,
      function () { form.reset(); }
    );
  });

  clearFieldErrors(['c-nom','c-prenom','c-email','c-sujet','c-message','c-rgpd']);
})();
