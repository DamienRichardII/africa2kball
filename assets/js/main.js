/* ============================================================
   AFRICA2KBALL — main.js v3
   ============================================================ */

/* --- ENDPOINTS — renseigner avant mise en prod --- */
var FORM_ENDPOINTS = {
  billetterie:  '',   /* Remplacé par insert Supabase direct — voir submitBilletterieSupabase() */
  inscriptions: '',
  contact:      ''
};

/* ============================================================
   SUPABASE — Configuration V27
   Clé anon publique uniquement — ne jamais exposer service_role
   ============================================================ */
var SUPABASE_URL      = 'https://ltwwjhapdxhpkwvpabva.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0d3dqaGFwZHhocGt3dnBhYnZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjMyMjMsImV4cCI6MjA5NDgzOTIyM30.p3aUKEu2qxpygNXiI4BOXdl0VcgDw6OliLls6HbQG84'; /* anon publique — jamais service_role */

var _a2kbSupabase = null;

function getA2KBSupabase() {
  if (_a2kbSupabase) return _a2kbSupabase;
  if (!window.supabase) {
    console.error('[Africa2KBall] Supabase CDN non chargé.');
    return null;
  }
  if (!SUPABASE_ANON_KEY) {
    console.error('[Africa2KBall] SUPABASE_ANON_KEY manquante.');
    return null;
  }
  try {
    _a2kbSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return _a2kbSupabase;
  } catch (error) {
    console.error('[Africa2KBall] Erreur initialisation Supabase:', error);
    return null;
  }
}

/* Alias pour compatibilité inscriptions */
function getSupabaseClient() { return getA2KBSupabase(); }

async function submitBilletterieToSupabase(payload) {
  var sb = getA2KBSupabase();
  if (!sb) {
    throw new Error('Supabase non configuré ou CDN non chargé.');
  }

  /* Log diagnostic payload — V28 */
  console.log('[Africa2KBall] Payload ticket_requests:', payload);

  /* SANS .select() — RLS anon autorise INSERT mais pas SELECT
     .select() ajouterait Prefer: return=representation → 400 refus */
  var result = await sb
    .from('ticket_requests')
    .insert([payload]);

  if (result.error) {
    /* Log détaillé pour diagnostic Supabase */
    console.error('[Africa2KBall] Insert ticket_requests error full:', {
      message: result.error.message,
      details: result.error.details,
      hint:    result.error.hint,
      code:    result.error.code,
      full:    result.error
    });
    throw result.error;
  }
  return true; /* insert réussi — pas de data retournée (return=minimal) */
}

async function submitInscriptionsSupabase(payload) {
  var sb = getA2KBSupabase();
  if (!sb) throw new Error('Supabase non disponible.');
  /* Table media_registrations — accepte média ET bénévole via type_inscription */
  /* SANS .select() — RLS anon autorise INSERT mais pas SELECT */
  console.log('[Africa2KBall] Payload media_registrations:', payload);
  var result = await sb
    .from('media_registrations')
    .insert([payload]);
  if (result.error) {
    console.error('[Africa2KBall] Insert media_registrations error full:', {
      message: result.error.message,
      details: result.error.details,
      hint:    result.error.hint,
      code:    result.error.code,
      full:    result.error
    });
    throw result.error;
  }
  return true;
}


/* --- PAIEMENT COURTSIDE — désactivé, Courtside est gratuit (V23) --- */
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
   MENU BURGER — V19 (is-open + open sur burger ET menu)
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  /* Fallback : data-attribute en priorité, id en secours */
  var menuToggle = document.querySelector('[data-mobile-menu-toggle]') || document.getElementById('burger');
  var mobileMenu = document.querySelector('[data-mobile-header-menu]')  || document.getElementById('mobileNav');

  if (!menuToggle || !mobileMenu) return;

  function closeMenu() {
    /* Menu nav */
    mobileMenu.classList.remove('is-open');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    /* Burger */
    menuToggle.classList.remove('is-open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    /* Body */
    document.body.classList.remove('mobile-menu-open');
  }

  function openMenu() {
    /* Menu nav */
    mobileMenu.classList.add('is-open');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    /* Burger */
    menuToggle.classList.add('is-open');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    /* Body */
    document.body.classList.add('mobile-menu-open');
  }

  /* Clic sur le burger — preventDefault + stopPropagation pour éviter
     que le document listener referme le menu immédiatement */
  menuToggle.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (mobileMenu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /* Fermeture au clic sur un lien du menu mobile */
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* Fermeture au clic en dehors du menu */
  document.addEventListener('click', function (e) {
    if (mobileMenu.classList.contains('is-open') &&
        !mobileMenu.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  /* Fermeture à l'agrandissement de la fenêtre (desktop) */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  /* Fermeture via touche Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
});

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
   COURTSIDE INFO — affichage bloc informatif (Courtside gratuit)
   ============================================================ */
(function () {
  var types    = document.querySelectorAll('#ticketTypes .ticket-type');
  var infoZone = document.getElementById('courtsideInfoZone');
  if (!types.length || !infoZone) return;

  function updateCourtsideInfo() {
    var selected = document.querySelector('#ticketTypes input[type="radio"]:checked');
    var isCourt  = selected && selected.value === 'courtside';
    infoZone.style.display = isCourt ? '' : 'none';
  }

  types.forEach(function (label) {
    label.addEventListener('click', function () {
      setTimeout(updateCourtsideInfo, 50);
    });
  });

  updateCourtsideInfo();
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
   FORMULAIRE BILLETTERIE — V27
   Insert direct dans Supabase — table ticket_requests
   Handler async — ne dépend PLUS de submitForm() ni de FORM_ENDPOINTS
   ============================================================ */
(function () {
  var form = document.getElementById('formBilletterie');
  if (!form) return;
  var feedbackId = 'feedbackBilletterie';

  function resetFormUI() {
    form.reset();
    var countInput = document.getElementById('ticketCount');
    if (countInput) countInput.value = 1;
    var types = document.querySelectorAll('#ticketTypes .ticket-type');
    if (types.length) {
      types.forEach(function (l) { l.classList.remove('selected'); });
      types[0].classList.add('selected');
      var radio = types[0].querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    }
    var infoZone = document.getElementById('courtsideInfoZone');
    if (infoZone) infoZone.style.display = 'none';
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearFeedback(feedbackId);

    /* --- Validation --- */
    var nom    = document.getElementById('b-nom');
    var prenom = document.getElementById('b-prenom');
    var email  = document.getElementById('b-email');
    var tel    = document.getElementById('b-tel');
    var valid  = true;

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

    /* --- Collecte des données — V28 --- */

    /* ticket_type : valeurs exactes Supabase (lowercase) */
    var ticketTypeMap = { standard: 'standard', courtside: 'courtside', media: 'media', invite: 'invite' };
    var ticketTypeInput = form.querySelector('input[name="ticket_type"]:checked');
    var rawType = ticketTypeInput ? ticketTypeInput.value.toLowerCase().trim() : 'standard';
    var ticketType = ticketTypeMap[rawType] || 'standard';

    /* quantity : integer ≥ 1 strictement */
    var ticketCount = document.getElementById('ticketCount');
    var rawQty = ticketCount ? parseInt(ticketCount.value, 10) : 1;
    var quantity = Number.isFinite(rawQty) && rawQty >= 1 ? rawQty : 1;

    /* message : null si vide (pas de chaîne vide) */
    var messageEl = document.getElementById('b-message');
    var messageVal = messageEl ? messageEl.value.trim() : '';

    var payload = {
      nom:         nom.value.trim(),
      prenom:      prenom.value.trim(),
      email:       email.value.trim(),
      telephone:   tel.value.trim(),
      ticket_type: ticketType,
      quantity:    quantity,
      message:     messageVal !== '' ? messageVal : null,
      rgpd:        true,
      status:      'en_attente'
    };

    /* --- Anti-double-submit --- */
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'ENVOI EN COURS...';
    }

    try {
      /* --- Insert Supabase réel --- */
      await submitBilletterieToSupabase(payload);

      if (ticketType === 'courtside') {
        showFeedback(feedbackId, 'success',
          'Votre demande Courtside a bien été enregistrée. Les places Courtside sont gratuites, limitées et soumises à validation par l’équipe Africa2KBall.');
      } else {
        showFeedback(feedbackId, 'success',
          'Votre demande de billet a bien été enregistrée. L’équipe Africa2KBall reviendra vers vous rapidement.');
      }
      resetFormUI();

    } catch (error) {
      console.error('[Africa2KBall] Erreur insert billetterie:', error);
      showFeedback(feedbackId, 'error',
        'Une erreur est survenue lors de l’enregistrement de votre demande. Merci de réessayer ou de contacter l’équipe Africa2KBall.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtn.dataset.originalText ||
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Envoyer ma demande';
      }
    }
  });

  clearFieldErrors(['b-nom','b-prenom','b-email','b-tel','b-rgpd']);
})();

/* ============================================================
   FORMULAIRE INSCRIPTIONS — V26
   Insert direct dans Supabase — table media_registrations
   Gère : média ET bénévole (champ type_inscription)
   ============================================================ */
(function () {
  var form = document.getElementById('formInscriptions');
  if (!form) return;
  var feedbackId = 'feedbackInscriptions';

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

    /* Collecte des données */
    var typeInscInput = document.querySelector('#typeSelectorInscription input[type="radio"]:checked');
    var typeInscription = typeInscInput ? typeInscInput.value : 'media'; /* 'media' ou 'benevole' */
    var org     = (document.getElementById('i-org')    || {}).value || '';
    var social  = (document.getElementById('i-social') || {}).value || '';

    var payload = {
      nom:              nom.value.trim(),
      prenom:           prenom.value.trim(),
      email:            email.value.trim(),
      telephone:        tel.value.trim(),
      type_inscription: typeInscription,
      organisation:     org.trim()   || null,
      social_links:     social.trim() || null,
      disponibilites:   dispo.value.trim() || null,
      message:          msg.value.trim(),
      rgpd:             true,
      status:           'en_attente'
    };

    /* Désactiver bouton pendant envoi */
    var submitBtn = form.querySelector('.btn-submit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi en cours…'; }

    /* Insert Supabase */
    submitInscriptionsSupabase(payload).then(function () {
      var msgOk = typeInscription === 'benevole'
        ? 'Votre inscription bénévole a bien été enregistrée. L\'équipe Africa2KBall reviendra vers vous après étude de votre demande.'
        : 'Votre demande d\'accréditation média a bien été enregistrée. L\'équipe Africa2KBall reviendra vers vous après étude de votre dossier.';
      showFeedback(feedbackId, 'success', msgOk);
      form.reset();
      /* Réinitialiser le sélecteur de type */
      var types = document.querySelectorAll('#typeSelectorInscription .type-option');
      if (types.length) {
        types.forEach(function(l){ l.classList.remove('selected'); });
        types[0].classList.add('selected');
        var radio = types[0].querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      }
    }).catch(function (err) {
      console.error('[Africa2KBall] Erreur Supabase inscriptions:', err);
      showFeedback(feedbackId, 'error',
        'Une erreur est survenue lors de l\'enregistrement de votre inscription. Merci de réessayer ou de contacter l\'équipe Africa2KBall.');
    }).finally(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Envoyer mon inscription';
      }
    });
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
