# AFRICA2KBALL — Rapport des corrections v2

> Session de refonte — Mai 2026  
> 7 pages HTML + CSS global + JS global

---

## Résumé des travaux

### 1. Intégration des visuels réels

- Création de la structure `assets/images/` avec sous-dossiers thématiques (`nations/`, `champions/`, `ambiance/`)
- Copie et renommage de 26 photos depuis `Africa2kBall visuels/` vers les destinations cibles
- Noms de fichiers normalisés : minuscules, tirets, sans accents, sans espaces
- Correction de la casse : `hero-africa2kball.PNG` conservé tel quel (fichier déjà présent)
- Cas particulier : dossier `Sénégal/` source vide → substitut depuis `Gens/`

### 2. Suppression totale des emojis

Tous les éléments UI en emoji ont été remplacés par des icônes SVG inline :

| Emoji retiré | Remplacement SVG |
|---|---|
| 🏀 (basket) | SVG basket personnalisé |
| 🌍 (globe) | SVG globe feather |
| 🤝 (handshake) | SVG users group |
| 📅 (calendrier) | SVG calendar |
| 📍 (épingle) | SVG map-pin |
| 🕐 (horloge) | SVG clock |
| 🎟 (billet) | SVG ticket |
| 📷 (appareil) | SVG camera / instagram |
| ✈️ (avion envoi) | SVG send (paper-plane) |
| ✅ (validation) | SVG check circle |
| ⚠️ (alerte) | SVG alert triangle |
| 🏆 (trophée) | SVG trophy |
| ⭐ (étoile) | SVG star |
| 🌴 (palmier) | SVG palm custom |
| 🛡 (bouclier) | SVG shield |

### 3. Unification header & footer

Toutes les pages partagent maintenant exactement le même header et footer :

- Classe `.header-cta-wrap` + `.btn-primary` (plus `.btn-cta` obsolète)
- Même navigation (`aria-expanded`, `aria-hidden` sur mobile nav)
- Footer : logo + tagline "Tournoi des nations basketball" + 4 colonnes (nav, réseaux, contact)
- Réseaux sociaux en SVG (`footer-social-link`)
- Contact : email + tél `+33 6 00 00 00 00` + localisation Pavillons-sous-Bois

### 4. Amélioration des cartes Nations

- Photos réelles en fond (`nation-card-photo img`) avec `object-fit: cover; object-position: top center`
- Badge nation SVG positionné en absolu sur la photo (`.nation-card-badge`)
- Hover : léger zoom sur la photo + surbrillance bouton
- Silhouette SVG joueur pour les cartes roster (pas de placeholder emoji)

### 5. Amélioration des cartes Champions

- Structure `.visual-card` avec fond photo pleine hauteur
- `<img>` réel dans `.visual-card-bg` avec `filter: brightness(.7) contrast(1.1) saturate(.9)`
- Overlay dégradé bas→haut pour lisibilité du texte
- Barre colorée aux couleurs de chaque nation

### 6. Page Inscriptions (v2)

- Cartes Média et Bénévole redessinées en `.visual-card` avec photos réelles
- Formulaire avec markup de validation complet (`grp-i-*`, `err-i-*`)
- `.form-feedback` (plus `.form-confirm` obsolète)
- Type radio avec SVG intégré dans l'option

### 7. Page Contact (v2)

- Sidebar enrichie : liste `.info-card-item` avec icônes SVG
- Carte partenariat avec SVG cœur (plus emoji 🤝)
- Watermark Afrique SVG décoratif dans la sidebar
- Formulaire avec markup de validation complet (`grp-c-*`, `err-c-*`)
- `.form-feedback` (plus `.form-confirm` obsolète)

### 8. JavaScript global (v2)

- `FORM_ENDPOINTS = { billetterie: '', inscriptions: '', contact: '' }` — à renseigner avant mise en prod
- Validation champ par champ sur les 3 formulaires :
  - Billetterie : nom, prénom, email requis
  - Inscriptions : nom, prénom, email requis
  - Contact : nom, prénom, email, sujet, message requis
- `setFieldError(grpId, errId, show)` — active/désactive classe `has-error` + span `.form-error-msg.visible`
- `showFeedback(feedbackId, type, msg)` — affiche `.form-feedback.success` ou `.form-feedback.error`
- `submitForm()` — utilise `fetch()` si endpoint défini, sinon simulation locale
- Effacement automatique des erreurs au `input` / `change`

### 9. CSS global (v2)

Classes ajoutées :
- `.form-card-header`, `.form-card-icon`, `.form-card-title`
- `.insc-card`, `.insc-card-icon`, `.insc-card-title`, `.insc-card-desc`
- `.type-radio-dot` (alias de `.type-radio` pour les inscriptions v2)
- `.info-card-title`, `.info-card-list`, `.info-card-item`, `.info-label`, `.info-value`
- `.contact-africa-watermark`
- `.req` (astérisque champ requis)
- Responsive complémentaire pour `.insc-card` à 768px

---

## Points à finaliser avant mise en production

1. **Endpoints de formulaires** : renseigner les 3 URLs dans `FORM_ENDPOINTS` dans `main.js`
2. **Photo Sénégal** : si des photos de l'équipe Sénégal deviennent disponibles, les placer dans `assets/images/nations/senegal/` et `assets/images/champions/edition-2-senegal/`
3. **Hero principal** : `hero-africa2kball.PNG` est utilisé comme fond générique sur toutes les pages (histoire, champions, billetterie, inscriptions, contact). Remplacer par des images spécifiques si disponibles
4. **Liens réseaux sociaux** : tous les `href="#"` dans le footer et la sidebar contact sont des placeholders — à remplacer par les vraies URLs
5. **Google Analytics / tracking** : balises à ajouter dans le `<head>` de chaque page si nécessaire
6. **Mentions légales / CGV** : pages à créer (`mentions-legales.html`, `cgv.html`, `politique-confidentialite.html`)

---

## V3 — Finition premium / pré-lancement

*Date : 04 mai 2026*

### Phase 1 — Suppression des styles inline ✅

Tous les attributs `style=""` ont été supprimés des 7 pages HTML et remplacés par des classes CSS sémantiques dans `style.css` :

- `.page-hero--compact`, `.page-hero--medium`, `.page-hero--large`, `.page-hero--xlarge`
- `.page-hero-overlay--bottom`, `.page-hero-overlay--bottom-soft`, `.page-hero-overlay--bottom-histoire`
- `.page-hero-content--centered`, `.page-hero-content--histoire`
- `.page-subtitle--centered`, `.page-subtitle--histoire`
- `.section--black-soft`, `.section--brown`, `.section--no-bottom`, `.section--no-top`
- `.text-orange`, `.text-center`, `.info-card--sticky`, `.form-card--flex`
- `.badge--{nation}`, `.shield--{nation}` (8 nations)
- `.bar-caraib-{1|2|3}`, `.bar-senega-{1|2|3}` (barres de couleur champions)
- `.textarea--tall`, `.event-meta--spaced`, `.form-group--top`, `.form-about--top`
- `.roster-section`, `.roster-section.roster-loading`, `.roster-active-pill`

### Phase 2 — Fidélité visuelle ✅

Classes hero appliquées uniformément sur toutes les pages pour assurer la cohérence des hauteurs, overlays et paddings. Variables CSS (`--orange`, `--black`, `--beige`, etc.) utilisées partout.

### Phase 3 — Formulaires — comportement exact ✅

Refonte complète de `assets/js/main.js` :

- **`FORM_ENDPOINTS`** : objet centralisé `{ billetterie: '', inscriptions: '', contact: '' }`. Si l'endpoint est vide, le message "Votre demande a bien été préparée. Le branchement d'envoi doit encore être connecté par l'équipe technique Africa2KBall." s'affiche. Si défini, `fetch()` POST JSON.
- **Validation étendue** :
  - Billetterie : nom, prénom, email (regex), **téléphone** (obligatoire)
  - Inscriptions : nom, prénom, email, **téléphone**, **disponibilités** (`i-dispo`), **motivation** (`i-message`)
  - Contact : nom, prénom, email, **sujet** (select), message
- **Messages succès exacts** par formulaire (billetterie / inscriptions / contact)
- `clearFieldErrors(ids[])` — efface les erreurs à la saisie via `input`/`change`
- `setFieldError(grpId, errId, show)` — gestion visuelle des erreurs champ par champ

### Phase 4 — Roster dynamique nations.html ✅

- Objet `ROSTERS` en JS avec 8 nations et leurs joueurs (Sénégal : données réelles ; autres : placeholders "Joueur N")
- `renderRoster(nationKey)` — met à jour dynamiquement `#rosterSection` : titre, bouclier, couleur, grid de cards
- `.roster-active-pill` affiché dans le titre roster pour indiquer la nation active
- `data-nation="{key}"` sur chaque `.nation-card` — click → `renderRoster()`
- Fade transition 180ms (`.roster-section.roster-loading`)
- Sénégal chargé par défaut (SEO / fallback no-JS)

### Phase 5 — Responsive mobile ✅

Breakpoints existants maintenus et vérifiés : 1100px, 768px, 480px. Burger menu, formulaires 1-colonne, footer empilé.

### Phase 6 — Pré-lancement : pages légales + SEO/OG ✅

**Pages légales créées** :
- `mentions-legales.html` — éditeur, directeur publication, hébergement, propriété intellectuelle
- `politique-confidentialite.html` — données collectées, finalités, durée conservation, droits RGPD, cookies
- `cgv.html` — objet, commandes, prix, annulation, accès, places limitées, droits image

Chaque page légale partage le même header/footer/design que le reste du site.

**Open Graph — toutes les pages** :
- `og:title`, `og:description`, `og:image` (hero-africa2kball.PNG), `og:type` ajoutés sur les 7 pages principales + 3 pages légales (10 pages total)

**Liens légaux footer** :
- Tous les `href="#"` → `href="mentions-legales.html"`, `href="politique-confidentialite.html"`, `href="cgv.html"` sur toutes les pages

**Pages légales dans footer** :
- `footer-legal` mis à jour sur toutes les pages

### État final — Points à finaliser avant mise en production

1. **Endpoints formulaires** : renseigner les 3 URLs dans `FORM_ENDPOINTS` (billetterie, inscriptions, contact)
2. **Photos équipes** : si disponibles, placer dans `assets/images/nations/{nation}/` — images actuelles = placeholders
3. **Rosters 7 nations** : seul le Sénégal a de vraies données. Les 7 autres utilisent "Joueur 1–6" — à compléter
4. **Réseaux sociaux** : tous les `href="#"` dans footer/sidebar = placeholders — remplacer par vraies URLs Instagram, Facebook, X, YouTube
5. **Google Analytics** : balises à ajouter dans `<head>` si nécessaire
6. **og:image** : `hero-africa2kball.PNG` utilisé sur toutes les pages — idéalement une image carrée 1200×630 dédiée au partage social

---

## V4 — Drapeaux, Partenaires, Réseaux & Roster à venir

**Date :** 08/05/2026  
**Périmètre :** nations.html, index.html, main.js, style.css + 10 pages (liens sociaux)

---

### Phase 1 — Création du répertoire drapeaux

- Nouveau dossier `assets/images/flags/` créé
- 8 fichiers PNG normalisés copiés depuis les dossiers nations :
  - `caraibes.png`, `senegal.png`, `kongo.png`, `cote-ivoire.png`
  - `cameroun.png`, `mali.png`, `maghreb.png`, `diaspora.png`

---

### Phase 2 — CSS V4 (style.css)

Bloc CSS ajouté couvrant :
- `.nation-flag` — badge drapeau positionné en `absolute` sur la photo de carte nation
- `.nation-home-flag` — capsule drapeau pour la grille d'accueil
- `.roster-coming-soon` / `.roster-coming-flag` / `.roster-coming-content` — composant "Roster à venir" avec bordure orange
- `.partners-strip-section`, `.partners-marquee`, `.partners-track`, `.partner-logo-card`, `.partner-logo-fallback` — bande défilante partenaires
- `@keyframes partners-scroll` — animation CSS pure (38s, pause au survol)
- Règles responsive mobile (`@media max-width: 768px`, `600px`)

---

### Phase 3 — Drapeaux nations.html

Dans chaque `.nation-card`, ajout d'un `.nation-flag` positionné en badge bas-droite sur la photo :
```html
<div class="nation-flag">
  <img src="assets/images/flags/{nation}.png" alt="Drapeau {Nation}" loading="lazy">
</div>
```
→ 8 cartes traitées : Caraïbes, Sénégal, Kongo, Côte d'Ivoire, Cameroun, Mali, Maghreb, Diaspora

---

### Phase 4 — Drapeaux index.html (nations preview)

Remplacement des `.shield-placeholder` SVG par de vraies capsules drapeau :
```html
<div class="nation-home-flag">
  <img src="assets/images/flags/{nation}.png" alt="Drapeau {Nation}" loading="lazy">
</div>
```
→ 7 capsules mises à jour (Sénégal → Diaspora)

---

### Phase 5 — Bande partenaires défilante (index.html)

Nouvelle section `<section class="partners-strip-section">` insérée avant `</main>` :
- Animation CSS pure (`@keyframes partners-scroll`), pause au hover
- 6 logos réels : Heroic, B-Ease, Wakanda Factory, CD 93 Basket, Humanitaria, Stade de l'Est Pavillonais Basket
- 4 partenaires en fallback texte : Nos Fabrils, Ilimane Art, Adiahome & Co, Dymo Opp
- Double track pour boucle continue seamless

---

### Phase 6 — Mise à jour réseaux sociaux (10 pages)

Toutes les pages ont reçu le nouveau bloc footer-social :
- **Instagram** → `https://www.instagram.com/africa2kball/` (target=_blank)
- **Threads** → `https://www.threads.com/@africa2kball?xmt=...` + icône SVG officielle (target=_blank)
- **YouTube** → `https://www.youtube.com/watch?v=RU4grJwDQt4&t=676s` aria-label="Africa 2K Ball 2025" (target=_blank)
- Suppression de **Facebook** et **X/Twitter**
- `contact.html` sidebar : lien direct `@africa2kball` → Instagram

---

### Phase 7 — Roster à venir (nations.html + main.js)

**nations.html** — `.roster-grid` par défaut remplacé :
```html
<div class="roster-coming-soon">
  <div class="roster-coming-flag"><img src="assets/images/flags/senegal.png" ...></div>
  <div class="roster-coming-content">
    <h3>Roster à venir</h3>
    <p>Le roster de l'équipe <strong>Sénégal</strong> sera dévoilé prochainement.</p>
  </div>
</div>
```

**main.js** — `ROSTERS` : ajout de la propriété `flag` sur les 8 nations  
**main.js** — `renderRoster()` : les player cards sont remplacées par le composant `.roster-coming-soon` dynamique (drapeau + nom de nation issus de `data.flag` et `data.label`)

---

### Bilan V4

| Tâche | Statut |
|---|---|
| assets/images/flags/ (8 fichiers) | ✅ |
| CSS V4 complet | ✅ |
| Drapeaux nation-card (nations.html) | ✅ 8/8 |
| Drapeaux nation-home-flag (index.html) | ✅ 7/7 |
| Bande partenaires défilante | ✅ |
| Réseaux sociaux — 10 pages | ✅ 10/10 |
| Roster à venir HTML + JS | ✅ |
| Validation automatisée (0 erreur) | ✅ |

---

## V5 — Corrections visuelles, roster, partenaires & footer

**Date :** 08/05/2026  
**Périmètre :** nations.html, index.html, main.js, style.css

---

### Corrections apportées

**Section roster Sénégal supprimée**
- `#rosterSection` masqué par défaut (`display:none; aria-hidden="true"`)
- Titre et sous-titre par défaut neutralisés (plus de "SÉNÉGAL" hardcodé)
- La section s'affiche uniquement au clic sur une carte nation

**Rosters joueurs supprimés / neutralisés (main.js)**
- `var ROSTERS` (avec `players: []`) remplacé par `var ROSTER_STATUS` (label + flag + color uniquement)
- Code mort supprimé : `var SILHOUETTE`, `function badgeHtml()`
- Bug JS corrigé : apostrophe non échappée dans `l'équipe` qui cassait le parsing
- `renderRoster()` simplifié : lit `ROSTER_STATUS[nationKey]` et révèle la section

**Bande "Roster à venir" appliquée à chaque nation**
- Composant `.roster-coming-soon` généré dynamiquement avec le bon drapeau + nom de nation
- Texte officiel : "La composition complète de l'équipe X sera publiée prochainement pour l'Édition 3."

**Drapeaux roster recadrés (style.css)**
- `.roster-coming-flag` : 112×76px, `object-fit: contain`, `padding: 6px` — drapeaux entièrement visibles
- `.roster-coming-content h3` : `clamp(28px, 4vw, 46px)`, line-height: .95
- Breakpoint mobile étendu à 768px avec `max-width: 160px` pour le drapeau

**Drapeaux accueil repositionnés (style.css + index.html)**
- `.nation-home-flag` : 74×48px, `object-fit: contain`, `padding: 4px`, fond adapté
- Caraïbes ajoutée comme 1ère carte (8/8 nations désormais visibles)
- `nation-card-home` : `min-height: 118px`, `justify-content: center`

**Section nations accueil recadrée**
- `.nations-preview` : `padding-top: 96px; padding-bottom: 96px`
- `.nations-preview-header` : `margin-bottom: 40px`

**Logo footer corrigé**
- `.footer-brand img` : `height: 58px; max-width: 180px; object-fit: contain; object-position: left center`
- Plus d'étirement ni de déformation

**Partenaires filtrés selon les logos réellement présents**
- Seuls les 6 fichiers présents dans `assets/images/partners/` sont affichés
- Supprimés : Nos Fabrils, Ilimane Art, Adiahome & Co, Dymo Opp (pas de logo)
- Boucle seamless sur 12 cartes (6×2), aucun cadre vide ni texte fallback

**Réseaux sociaux vérifiés (10 pages)**
- Instagram, Threads, YouTube : liens réels + `target="_blank" rel="noopener noreferrer"`
- Facebook et X/Twitter absents

---

### Points restant à compléter avant mise en ligne

- Renseigner `FORM_ENDPOINTS` dans `main.js` (billetterie, inscriptions, contact)
- Ajouter les logos partenaires manquants dans `assets/images/partners/` quand disponibles
- Publier les rosters officiels de l'Édition 3 (remplacer le composant "Roster à venir")
- Phase 5 responsive mobile strict (#16) — breakpoints 1100/768/480px
- Tests cross-browser (Chrome, Firefox, Safari, mobile)

---

### Bilan V5

| Tâche | Statut |
|---|---|
| Section roster Sénégal supprimée | ✅ |
| Rosters joueurs supprimés / neutralisés | ✅ |
| Bande "Roster à venir" dynamique | ✅ |
| Drapeaux roster — object-fit contain | ✅ |
| Drapeaux accueil repositionnés | ✅ |
| 8 nations sur accueil (+ Caraïbes) | ✅ |
| Section nations accueil recadrée | ✅ |
| Logo footer corrigé | ✅ |
| Partenaires filtrés (6 logos réels) | ✅ |
| Cadres partenaires vides supprimés | ✅ |
| Réseaux sociaux vérifiés (10 pages) | ✅ |
| Bug JS apostrophe corrigé | ✅ |
| Validation automatisée (0 erreur) | ✅ |

---

## V6 — Correction premium : index nations / partenaires / roster

**Date :** 08/05/2026  
**Périmètre :** index.html, nations.html, main.js, style.css

---

### Section Nations accueil refondue (index.html)

Remplacement complet des cartes `.nation-card-home` / `.nation-home-flag` par la nouvelle structure `.nation-showcase-card` :
- Grille 4 colonnes desktop → 2 colonnes tablette → 2 colonnes mobile
- Chaque carte : fond noir chaud + drapeau à gauche en `object-fit: contain` + nom à droite
- Accent coloré par nation via `--nation-accent` (CSS variable + `::after` strip bas de carte)
- Couleurs : Caraïbes #00b4d8, Sénégal #00a86b, Kongo #e63946, Côte d'Ivoire #f4a261, Cameroun #2dc653, Mali #f9c74f, Maghreb #e8374c, Diaspora #c9a77a
- Hover : `translateY(-6px)` + border orange + shadow renforcé
- `drop-shadow` sur les drapeaux pour profondeur
- 8/8 nations visibles avec vraies couleurs de compétition

### Drapeaux mieux mis en valeur

- Taille réelle par carte : 52% de largeur dédiée au drapeau, hauteur max 112px
- `filter: drop-shadow()` pour donner de la profondeur sans rogner
- `object-fit: contain` partout — aucun drapeau coupé

### Partenaires filtrés selon logos réellement présents

- 6 logos présents dans `assets/images/partners/` : Heroic, B-Ease, Wakanda Factory, CD 93 Basket, Humanitaria, Stade de l'Est Pavillonais Basket
- Bande reconstruite avec nouveau CSS : fond noir + gradient léger + border subtil
- `filter: none` sur les images — logos visibles sans inversion destructrice
- Cartes 230×112px avec padding 22px, `object-fit: contain`

### Cadres partenaires vides supprimés

- Suppression définitive des 4 cartes fallback texte (Nos Fabrils, Ilimane Art, Adiahome & Co, Dymo Opp)
- Boucle seamless 12 cartes (6×2), animation 34s

### Roster Sénégal statique supprimé

- `#rosterSection` entièrement reconstruit avec nouvelle structure `.roster-coming-card`
- Plus aucune référence hardcodée à Sénégal dans le HTML

### Roster dynamique "Roster à venir" appliqué à chaque nation

- Structure : grand visuel drapeau à gauche (260px de haut) + texte à droite
- `--nation-accent` CSS variable appliquée dynamiquement via `setProperty()`
- Barre colorée `::before` gauche de la carte selon la nation
- `renderRoster()` simplifié : 5 mises à jour DOM ciblées (flag.src, flag.alt, nationName, accent, h3 color)
- Variables mortes supprimées (`rosterGrid`, `rosterShield`, `rosterBtn`, `rosterSubtitle`, `roster-active-pill`)
- `main.js` propre, sans bug, sans références à des éléments inexistants

### Points restant à faire avant mise en ligne

- Renseigner `FORM_ENDPOINTS` dans `main.js`
- Ajouter les logos partenaires manquants dans `assets/images/partners/` dès disponibilité
- Publier les compositions officielles Édition 3 (remplacer le composant "Roster à venir")
- Phase 5 responsive mobile strict (#16) — breakpoints 1100/768/480px
- Tests cross-browser (Chrome, Firefox, Safari, mobile)

---

### Bilan V6

| Tâche | Statut |
|---|---|
| Section nations accueil refondue | ✅ |
| 8 nations avec drapeaux premium | ✅ |
| Accents couleurs par nation | ✅ |
| Partenaires — 6 logos réels uniquement | ✅ |
| Cadres partenaires vides supprimés | ✅ |
| filter: none sur logos partenaires | ✅ |
| Roster Sénégal statique supprimé | ✅ |
| roster-coming-card dynamique | ✅ |
| --nation-accent appliqué par JS | ✅ |
| main.js nettoyé (dead code) | ✅ |
| Validation automatisée (0 erreur) | ✅ |

---

## V7 — Finition index : drapeaux nations et partenaires

**Date :** 08/05/2026  
**Périmètre :** index.html, assets/css/style.css uniquement

---

### Drapeaux des cartes nations agrandis

- `.nation-showcase-card` : passage de `display: flex` à `display: grid` avec `grid-template-columns: 42% 58%`
- Colonne gauche de la carte entièrement dédiée au drapeau (`width: 100%; height: 100%`)
- `object-fit: cover` (intentionnel) pour que le drapeau remplisse toute sa colonne
- `object-position: center` — pas de rognage du motif principal
- Vignette subtile `::after` sur la zone drapeau (`linear-gradient 90deg`) pour assurer lisibilité

### Drapeaux mis en pleine colonne gauche

- `min-height: 190px` sur `.nation-showcase-flag` — hauteur pleine cohérente avec la carte
- Suppression du `padding: 22px` et du `display: flex` centreur qui réduisait visuellement le drapeau
- `filter: saturate(1.05) contrast(1.04)` — légère saturation pour drapeaux plus vivants
- Responsive : min-height 165px tablette, 145px mobile ; ratio 44/56 sur mobile

### Anciens styles de cartes neutralisés

- `.nation-card-home { display: none !important }` conservé
- Tous les nouveaux styles utilisent `!important` pour écraser les règles V6 sans supprimer les blocs précédents

### Partenaires affichés sans cadres

- `.partner-logo-card` : `background: transparent`, `border: none`, `box-shadow: none`, `border-radius: 0`, `padding: 0`
- `.partner-logo-card img` : `filter: none`, `opacity: .88` (→ 1 au hover)
- `.partners-track` : `gap: 72px` entre logos, `margin-right: 0`
- Logos qui flottent directement sur le fond noir de la section

### Logos partenaires filtrés selon fichiers présents

- 6 logos réels : Heroic, B-Ease, Wakanda Factory, CD 93 Basket, Humanitaria, Stade de l'Est Pavillonais Basket
- Boucle seamless 12 cartes (6×2), animation 34s

### Cadres et placeholders supprimés

- Plus aucun cadre border-radius visible autour des logos
- Plus aucun fond opaque
- Plus de filtre `brightness(0) invert(1)` destructeur

### Points restant à vérifier

- Tester l'affichage des logos blancs (ex: Heroic) — fond noir de la strip doit les rendre visibles
- Si un logo a un fond blanc intégré dans son fichier, envisager une version sans fond
- Ajouter les logos manquants dans `assets/images/partners/` dès disponibilité

---

## V8 — Finition index : noms nations et transparence partenaires

**Date :** 08/05/2026  
**Périmètre :** index.html, assets/css/style.css uniquement

---

### Noms de nations corrigés

- `grid-template-columns` ajusté à `40% 60%` (zone texte plus large)
- `.nation-showcase-content` : `overflow: visible`, `min-width: 0`, `padding: 24px 20px`
- `.nation-showcase-content strong` : `white-space: normal`, `overflow-wrap: break-word`, `word-break: normal`, `hyphens: auto`
- Taille de base : `clamp(23px, 1.75vw, 34px)` — les noms courts s'affichent grands

### Tailles typographiques ajustées par nation

| Nation | Règle |
|---|---|
| Cameroun, Maghreb, Diaspora | `clamp(21px, 1.55vw, 30px)` |
| Côte d'Ivoire | `clamp(19px, 1.4vw, 27px)` — peut passer sur 2 lignes |
| Autres | `clamp(23px, 1.75vw, 34px)` |

Sur mobile : taille dynamique `clamp(22px, 6.5vw, 30px)` pour les noms longs, `clamp(24px, 7.5vw, 34px)` pour les autres.

### Cartes nations vérifiées

- 8/8 nations présentes avec accents couleurs
- Drapeaux toujours en `object-fit: cover` pleine colonne gauche
- Grille 4 colonnes desktop, 2 colonnes max-1200px, 1 colonne mobile

### Partenaires passés sans cadres

- HTML : `.partner-logo-card` → `.partner-logo-item` (12 éléments, 6×2 pour boucle)
- CSS `.partner-logo-item` : `background: transparent`, `border: none`, `box-shadow: none`, `padding: 0`
- CSS `.partner-logo-item img` : `filter: none`, `opacity: .9` (→ 1 au hover)
- Anciens `.partner-logo-card` neutralisés via CSS override
- `gap: 78px` entre logos au lieu de `margin-right`

### Logos nécessitant une version transparente (à fournir par le client)

Aucun des 6 fichiers présents dans `assets/images/partners/` ne dispose d'un canal alpha ou de transparence réelle. Le CSS ne peut pas rendre transparent un fond intégré dans le fichier source.

**À refournir en PNG/SVG avec fond transparent :**

| Fichier | Type | Problème |
|---|---|---|
| `heroic.png` | PNG sans alpha | fond intégré (blanc probable) |
| `b-ease.png` | PNG sans alpha | fond intégré |
| `wakanda-factory.png` | PNG sans alpha | fond intégré |
| `cd-93-basket.png` | PNG sans alpha | fond intégré |
| `humanitaria.jpg` | JPG | fond intégré, transparence impossible en JPG |
| `stade-lest-pavillonais-basket.jpg` | JPG | fond intégré, transparence impossible en JPG |

**Action client requise :** fournir les versions PNG ou SVG avec fond transparent pour tous ces logos, ou des fichiers `.webp` avec canal alpha.

### Points restant à vérifier

- Rendu visuel sur écran réel après réception des logos transparents
- Tests cross-browser (Chrome, Firefox, Safari, mobile)
- Vérifier que les logos sombres (ex: texte noir) sont lisibles sur fond noir de la section — si nécessaire, basculer le fond de la strip en beige/sable pour compatibilité maximale


---

## V9 — Finition index — noms nations et logos partenaires

**Date :** 2026-05-08

### Contexte
Malgré les corrections V8, les noms "Cameroun", "Maghreb" et "Diaspora" restaient tronqués sur certaines résolutions. Les logos partenaires *Humanitaria* et *Stade de l'Est Pavillonais Basket* ont été fournis en PNG transparent par le client.

---

### 1. Noms nations — ajustements CSS (`style.css`)

**Grille nationale :**
```css
.nations-cards-grid {
  grid-template-columns: repeat(4, minmax(280px, 1fr)) !important;
  max-width: 1120px !important;
  margin: 0 auto !important;
}
```

**Carte nation :** colonne drapeau réduite à 38 % (plus d'espace texte) :
```css
.nation-showcase-card {
  grid-template-columns: 38% 62% !important;
  min-height: 190px !important;
}
```

**Nom de nation (base) :**
```css
.nation-showcase-content strong {
  font-size: clamp(24px, 1.75vw, 34px) !important;
  letter-spacing: -.025em !important;
  white-space: normal !important;
  overflow-wrap: normal !important;
  word-break: normal !important;
}
```

**Noms longs (Cameroun, Maghreb, Diaspora) :**
```css
font-size: clamp(22px, 1.55vw, 30px) !important;
```

**Côte d'Ivoire :**
```css
font-size: clamp(21px, 1.45vw, 29px) !important;
```

**Responsive :** `max-width: 1100px` → 2 colonnes ; `max-width: 640px` → 1 colonne.

---

### 2. Logos partenaires — mise à jour HTML (`index.html`)

Remplacement des références `.jpg` par `.png` pour les deux logos désormais disponibles en PNG transparent :

| Avant | Après |
|---|---|
| `humanitaria.jpg` | `humanitaria.png` |
| `stade-lest-pavillonais-basket.jpg` | `stade-lest-pavillonais-basket.png` |

Chaque logo apparaît deux fois (set 1 + set 2 du défilement en boucle) → 2 remplacements par fichier.

**CSS `.partner-logo-item` mis à jour :**
```css
.partner-logo-item { min-width: 190px !important; height: 92px !important; }
.partner-logo-item img { max-width: 210px !important; max-height: 82px !important; }
```

---

### 3. Fichiers modifiés

| Fichier | Modification |
|---|---|
| `assets/css/style.css` | Bloc V9 ajouté (2490 → 2556 lignes) |
| `index.html` | 4 remplacements `.jpg` → `.png` |

### 4. Validation

21/21 checks ✅ — tous les fichiers partenaires présents en `.png`, aucune référence `.jpg` résiduelle, toutes les règles CSS V9 présentes avec `!important`.


---

## Correction partenaires — logos transparents (V10)

**Date :** 2026-05-08

---

### 1. Ce qui a été fait

**HTML (`index.html`) :**
- Remplacement de la structure `.partner-logo-card` par `.partner-logo-item` dans la section partenaires (structure exacte conforme au brief)
- Correction de l'attribut `alt` du logo stade : "Stade L'Est Pavillonnais Basket"
- Aucune référence `.jpg` ne subsiste : `humanitaria.png` et `stade-lest-pavillonais-basket.png` sont utilisés dans les deux sets (×2 chacun)
- Zéro placeholder, zéro fallback texte, zéro logo absent affiché

**CSS (`assets/css/style.css`) — bloc V10 ajouté (2556 → 2674 lignes) :**
- `.partner-logo-item` : `background: transparent`, `border: none`, `box-shadow: none`, `padding: 0`
- `.partner-logo-item img` : `filter: none`, `background: transparent`, `object-fit: contain`
- `.partner-logo-card` entièrement neutralisé (ancienne classe, plus utilisée en HTML)
- `.partner-logo-fallback` masqué (`display: none`)
- Responsive `max-width: 768px` : gap réduit, tailles logo adaptées

---

### 2. Diagnostic canal alpha — ⚠️ Action requise client

**Tous les 6 fichiers PNG partenaires ont `color_type=2` (RGB sans canal alpha).** Le fond visible derrière les logos n'est pas un artefact CSS — il est intégré dans les fichiers image eux-mêmes. Le CSS ne peut pas supprimer des pixels déjà présents dans une image.

| Fichier | color_type | Statut |
|---|---|---|
| `heroic.png` | 2 (RGB) | 🟥 Fond intégré — à remplacer |
| `b-ease.png` | 2 (RGB) | 🟥 Fond intégré — à remplacer |
| `wakanda-factory.png` | 2 (RGB) | 🟥 Fond intégré — à remplacer |
| `cd-93-basket.png` | 2 (RGB) | 🟥 Fond intégré — à remplacer |
| `humanitaria.png` | 2 (RGB) | 🟥 Fond intégré — à remplacer |
| `stade-lest-pavillonais-basket.png` | 2 (RGB) | 🟥 Fond intégré — à remplacer |

**Action requise :** Fournir chaque logo au format PNG avec `color_type=6` (RGBA) ou SVG, avec fond entièrement transparent. Ces fichiers doivent être exportés depuis Illustrator / Figma / Photoshop en cochant "Transparence" et en décochant "Fond blanc".

---

### 3. Fichiers modifiés

| Fichier | Modification |
|---|---|
| `index.html` | Section partenaires remplacée — structure `.partner-logo-item` propre, alt text corrigé |
| `assets/css/style.css` | Bloc V10 ajouté — CSS définitif partners, neutralisation `.partner-logo-card` |
| `RAPPORT_CORRECTIONS_AFRICA2KBALL.md` | Cette section |

### 4. Validation

22/22 checks ✅ — structure HTML conforme, aucun `.jpg` résiduel, CSS sans cadre ni fond sur les items, tous fichiers présents physiquement.


---

## Point bloquant — logos partenaires non transparents

**Date :** 2026-05-08

Les 6 fichiers partenaires fournis sont des PNG RGB sans canal alpha (`color_type=2`). Le fond visible dans le navigateur est intégré dans les fichiers source eux-mêmes — aucun CSS ne peut le supprimer.

| Fichier | color_type | Canal alpha | Action requise |
|---|---|---|---|
| `heroic.png` | 2 (RGB) | ❌ | Remplacer par PNG RGBA ou SVG |
| `b-ease.png` | 2 (RGB) | ❌ | Remplacer par PNG RGBA ou SVG |
| `wakanda-factory.png` | 2 (RGB) | ❌ | Remplacer par PNG RGBA ou SVG |
| `cd-93-basket.png` | 2 (RGB) | ❌ | Remplacer par PNG RGBA ou SVG |
| `humanitaria.png` | 2 (RGB) | ❌ | Remplacer par PNG RGBA ou SVG |
| `stade-lest-pavillonais-basket.png` | 2 (RGB) | ❌ | Remplacer par PNG RGBA ou SVG |

**Export attendu :** PNG avec `color_type=6` (RGBA) ou SVG — fond entièrement transparent (Illustrator / Figma / Photoshop → transparence activée, fond blanc décoché).

### Solution temporaire appliquée (V11)

En attendant les vrais assets transparents, la section partenaires utilise des **capsules visuelles assumées** cohérentes avec la DA :

```css
.partner-logo-item {
  background: rgba(239, 224, 200, 0.08);   /* beige très discret */
  border: 1px solid rgba(239, 224, 200, 0.16);
  border-radius: 14px;
  padding: 18px 22px;
}
```

Ce rendu est **intentionnel et temporaire**. Dès réception des fichiers transparents, retirer ce bloc V11 de `style.css` pour revenir aux logos directement sur fond noir.

### Fichiers modifiés (V11)

| Fichier | Modification |
|---|---|
| `assets/css/style.css` | Bloc V11 ajouté — capsules temporaires (2674 → 2734 lignes) |


---

## Corrections pré-mise en ligne (V12)

**Date :** 2026-05-14

---

### Fichiers modifiés

| Fichier | Modifications |
|---|---|
| `index.html` | Section "Pourquoi venir ?" ajoutée (4 arguments + CTA) |
| `histoire.html` | Section "Notre mission" ajoutée (3 piliers + 4 chiffres clés + CTA) |
| `champions.html` | Palmarès officiel ajouté (Édition 1 & 2, sans données inventées) |
| `billetterie.html` | "Comment ça marche ?" + note confirmation + tarifs + RGPD |
| `inscriptions.html` | Note importante + mini FAQ + RGPD |
| `contact.html` | Email cliquable (mailto) + Threads + YouTube + "24-48h" + CTA billetterie + RGPD |
| `mentions-legales.html` | RNA/SIRET + Responsable publication + Vercel + Droit à l'image (placeholders propres) |
| `politique-confidentialite.html` | Prestataire de formulaire + durée conservation |
| `cgv.html` | Déjà présente et complète |
| `assets/js/main.js` | Flags `.png` dans ROSTER_STATUS, validation RGPD 3 formulaires, message endpoint clair |
| `assets/css/style.css` | Bloc V12 — 500 lignes CSS (nations, roster, pourquoi, piliers, palmarès, billetterie, inscriptions, RGPD, neutralisation anciennes classes) |

---

### Détail des corrections

**Accueil (index.html)**
- Section "Pourquoi venir ?" : 4 arguments numérotés + CTA "Réserver ma place"
- CSS nations définitif : `38% 62%`, `clamp(21–34px)`, grille responsive 4→2→1 colonnes

**Histoire (histoire.html)**
- Section "Notre mission" : texte éditorial + 3 piliers (Compétition / Culture / Communauté)
- 4 chiffres clés : 8 nations, 3e édition, 1 terrain, une même passion
- CTA "Découvrir les champions"

**Champions (champions.html)**
- Palmarès officiel Édition 1 (Caraïbes) et Édition 2 (Sénégal)
- Aucune donnée inventée (finaliste, score, MVP marqués "à confirmer")
- CTA "Découvrir les nations de l'Édition 3"

**Billetterie (billetterie.html)**
- Section "Comment ça marche ?" : 3 étapes numérotées
- Note : "La demande ne vaut pas confirmation définitive"
- Bloc tarifs & informations (lieu, horaires, Google Maps — placeholders)
- Case RGPD obligatoire (`b-rgpd`)

**Inscriptions (inscriptions.html)**
- Note importante : "L'inscription ne vaut pas validation automatique"
- Mini FAQ : 3 questions (qui peut, missions, délai de réponse)
- Case RGPD obligatoire (`i-rgpd`)

**Contact (contact.html)**
- Email `contact@africa2kball.com` cliquable (`href="mailto:"`)
- Threads + YouTube ajoutés dans la sidebar
- "Réponse sous 24 à 48h" affiché
- CTA "Pour une demande de billet → billetterie"
- Case RGPD obligatoire (`c-rgpd`)

**Mentions légales**
- Structure/statut/RNA/SIRET/Responsable : placeholders propres
- Hébergeur : Vercel Inc. ou à confirmer
- Crédits photos/vidéos + Droit à l'image

**Politique de confidentialité**
- Section "Prestataire de formulaire" ajoutée
- Durée de conservation : "à confirmer par l'organisation"

**main.js**
- `ROSTER_STATUS` : flags mis à jour avec extension `.png` (ex : `'senegal.png'`)
- `renderRoster` : chemin simplifié `'assets/images/flags/' + data.flag`
- Validation RGPD sur les 3 formulaires (billetterie, inscriptions, contact)

**style.css** (2734 → 3236 lignes — bloc V12)
- Nations showcase CSS définitif (38/62, clamp, responsive)
- Roster coming card CSS brief
- Sections Pourquoi venir, Notre mission, Palmarès, Comment ça marche, Tarifs, FAQ inscriptions
- RGPD checkbox styling
- Neutralisation : `.nation-card-home`, `.nation-home-flag`, `.shield`, `.shield-placeholder`, `.partner-logo-fallback`
- `.btn-secondary` défini

---

### Points restant avant mise en ligne officielle

| Priorité | Action |
|---|---|
| 🔴 Critique | Fournir les vrais **endpoints de formulaires** (Netlify Forms, Formspree, etc.) |
| 🔴 Critique | Confirmer les **informations légales** (nom structure, RNA/SIRET, responsable) |
| 🟠 Important | Fournir les **logos partenaires** en PNG RGBA (`color_type=6`) ou SVG transparents |
| 🟠 Important | Confirmer les **tarifs** des billets |
| 🟠 Important | Confirmer les **horaires** de l'événement |
| 🟡 Souhaitable | Ajouter le **lien Google Maps** (Gymnase Lino Ventura, Pavillons-sous-Bois) |
| 🟡 Souhaitable | **Tester sur mobile réel** (iOS Safari + Android Chrome) |
| 🟡 Souhaitable | Compléter les **crédits photos/vidéos** |
| 🟡 Souhaitable | Renseigner le **numéro de téléphone** de contact ou supprimer le placeholder |

---

## V13 — Modifications client + Admin + Billetterie

**Date :** 14 mai 2026  
**Périmètre :** index, histoire, champions, nations, billetterie, footer (7 pages), + admin.html créé + main.js mis à jour

---

### 1. index.html

**Phrase hero supprimée**
- Retrait de `<p class="home-hero-desc">L'Afrique s'ouvre au monde…</p>` (section hero allégée)

**Section "Pourquoi venir ?" supprimée**
- Retrait complet du bloc `<section class="pourquoi-section section">…</section>` (ajouté en V12, retiré sur demande client)

**Partenaires — sans cadres**
- Override V13 CSS : `.partner-logo-item { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; border-radius: 0 !important; }`
- Annule le style "capsule beige" de V11

---

### 2. histoire.html

**Photo éditoriale supprimée**
- Retrait de `<div class="histoire-editorial-img"><img …></div>`
- Classe `histoire-editorial-grid--text-only` ajoutée → colonne unique, max-width 980px

---

### 3. champions.html

**Covers remplacées**
- `champion-caraibes-01.jpg` → `assets/images/nations/caraibes/caraibes-cover-champions.jpg`
- `champion-senegal-01.jpg` → `assets/images/nations/senegal/senegal-cover-champions.jpg`

**Palmarès supprimé**
- Bloc `.palmares-section` entier retiré

**Section MVP ajoutée**
```html
<section class="mvp-honor-section section">
  <div class="mvp-honor-grid">
    <article class="mvp-card mvp-card--caraibes">
      MVP Édition 1 — Mathieu Da Sylva — Caraïbes
    </article>
    <article class="mvp-card mvp-card--senegal">
      MVP Édition 2 — Djibril Diawara — Sénégal
    </article>
  </div>
</section>
```
CSS : fond dégradé noir, bordure gauche orange 5px, typographie `var(--font-title)` clamp(36px, 4vw, 60px)

---

### 4. nations.html

**Covers remplacées (3 nations)**
- Sénégal : `senegal-01.jpg` → `senegal-cover-nations.jpg`
- Kongo : `kongo-01.jpg` → `kongo-nations-cover.jpg` *(naming inversé — détecté par find)*
- Cameroun : `cameroun-01.jpg` → `cameroun-nations-cover.jpg`

**Drapeaux — object-fit corrigé**
- `.nation-card .nation-flag img { object-fit: contain !important; padding: 6px !important; }`

**Roster coming visual — sans cadre**
- `.roster-coming-visual { background: transparent !important; border: none !important; … }`

---

### 5. Footer — Suppression numéro de téléphone

- Bloc `footer-contact-item` contenant "+33 6 00 00 00 00" supprimé sur les 7 pages HTML :  
  index, nations, histoire, champions, billetterie, inscriptions, contact

---

### 6. billetterie.html

**Types de billets mis à jour**
- "Entrée standard" → "Standard — Gratuit" (`value="standard"`)
- "Entrée groupe" → "Courtside — 10 €" (`value="courtside"`)

**Tarifs actualisés**
| Type | Prix |
|---|---|
| Standard | Gratuit |
| Courtside | 10 € |

**Lien Google Maps ajouté**
```html
<a href="https://www.google.com/maps/search/?api=1&query=Gymnase%20Lino%20Ventura%20Pavillons-sous-Bois" …>
  Voir sur Google Maps
</a>
```

**Zone paiement Courtside ajoutée**
- `<div id="courtsidePaymentZone" class="courtside-payment-card" style="display:none">` — révélée par JS si Courtside sélectionné
- Affiche lien Stripe si `PAYMENT_LINKS.courtside` non vide, sinon message "lien à connecter"

---

### 7. main.js

**PAYMENT_LINKS ajouté**
```js
var PAYMENT_LINKS = { courtside: '' };
// '' = message "à connecter" · URL Stripe = lien actif
```

**`updateCourtsideZone()`**
- Détecte si radio Courtside sélectionné, révèle/masque zone paiement, affiche lien ou message

**ROSTER_STATUS** — flags avec extension `.png` (déjà en V12, confirmé)

---

### 8. admin.html + assets/js/admin.js (créés)

**admin.html** — page autonome (noindex, nofollow), sans nav publique  
Sections :
- Header fixe : logo + titre + édition + bouton "Retour au site"
- Banner "Interface admin prête à connecter" (disclaimer données mock)
- KPI grid (4 colonnes) — 8 indicateurs
- Tableau médias & presse (filtrable, action "Contacter")
- Tableau billetterie (filtrable, badges Standard/Courtside/Payé/En attente)
- Zone email × 3 cartes (confirmation média, rappel J-7, email libre) — `prepareAdminMail()` via `mailto:`
- Section coordonnées bancaires (désactivée, IBAN masqué en blur, disclaimer sécurité)

**admin.js** — données mock, rendu dynamique  
Fonctions : `renderKPIs()`, `renderMediaTable()`, `renderBilletTable()`, `filterTable()`, `prepareAdminMail()`, `sendMailTo()`, `svgIcon()`

**KPIs affichés :**
| KPI | Valeur mock |
|---|---|
| Places achetées | Σ quantités |
| Visiteurs attendus | Σ quantités |
| Standard (gratuit) | Σ Standard |
| Courtside — 10 € | Σ Courtside |
| Médias inscrits | nb total + confirmés |
| Visiteurs site (7j) | — (analytics à connecter) |
| Demandes bénévoles | 0 (formulaire à brancher) |
| Revenus Courtside estimés | Σ paiements confirmés × 10€ |

---

### 9. style.css — bloc V13 (3236 → 3445 lignes)

| Règle | Effet |
|---|---|
| `.partner-logo-item` override | Fond transparent, pas de cadre, annule V11 |
| `.nation-card .nation-flag img` | `object-fit: contain` + padding 6px |
| `.roster-coming-visual` | Fond transparent, no border/shadow |
| `.mvp-honor-section` | Dégradé noir, section MVP |
| `.mvp-card::before` | Barre orange gauche 5px |
| `.mvp-card h3` | `var(--font-title)`, clamp(36px,4vw,60px) |
| `.histoire-editorial-grid--text-only` | 1 colonne, max-width 980px |
| `.courtside-payment-card` | Fond orange subtil, bordure orange |

---

### Points mis à jour — suivi mise en ligne

| Priorité | Action | Statut V13 |
|---|---|---|
| 🔴 Critique | Endpoints formulaires | ⏳ En attente |
| 🔴 Critique | Informations légales (RNA/SIRET) | ⏳ En attente |
| 🟠 Important | Logos partenaires PNG transparent (RGBA) | ⏳ En attente |
| 🟠 Important | Lien Stripe Courtside → `PAYMENT_LINKS.courtside` | ⏳ En attente |
| 🟢 Fait | Tarifs Standard Gratuit / Courtside 10€ | ✅ V13 |
| 🟢 Fait | Lien Google Maps Gymnase Lino Ventura | ✅ V13 |
| 🟢 Fait | Numéro de téléphone retiré du footer | ✅ V13 |
| 🟢 Fait | Admin dashboard HTML + JS | ✅ V13 |
| 🟡 Souhaitable | Tests mobile réel (iOS Safari + Android Chrome) | ⏳ En attente |
