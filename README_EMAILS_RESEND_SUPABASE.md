# README — Emails automatiques Africa2KBall
## Supabase Edge Function + Resend

---

## Architecture

```
Formulaire site (billetterie / inscriptions)
        ↓
Supabase Table (INSERT)
        ↓
Database Webhook INSERT
        ↓
Edge Function : send-confirmation-email
        ↓
Resend API
        ↓
Email automatique → destinataire
```

Aucune clé Resend ne transite par le frontend ni par GitHub.
Les secrets sont stockés uniquement dans Supabase Edge Functions Secrets.

---

## Fichier de la function

```
supabase/functions/send-confirmation-email/index.ts
```

---

## Secrets requis dans Supabase

Les 3 secrets doivent être configurés dans :
**Supabase Dashboard → Settings → Edge Functions → Secrets**

| Nom du secret | Description |
|---|---|
| `RESEND_API_KEY` | Clé API Resend (re_xxxxxxxx) |
| `FROM_EMAIL` | Adresse expéditeur autorisée dans Resend (ex: `Africa2KBall <noreply@africa2kball.com>`) |
| `REPLY_TO` | Adresse de réponse (ex: `af2kball@gmail.com`) |

**Ne jamais écrire les valeurs dans ce fichier ni dans le code.**

Pour vérifier la présence des secrets (sans afficher leurs valeurs) :
```bash
supabase secrets list
```

---

## Déploiement

### Prérequis

- Supabase CLI installé : https://supabase.com/docs/guides/cli
- Projet lié au projet Supabase cible

### Depuis le dossier racine du projet

```bash
cd "C:\Users\HP-15\OneDrive\Bureau\OneDrive\Documents\Africa2kball - site"
```

### 1. Vérifier la version CLI

```bash
supabase --version
```

### 2. Lier au projet Supabase (si pas déjà fait)

```bash
supabase link --project-ref ltwwjhapdxhpkwvpabva
```

### 3. Vérifier les secrets

```bash
supabase secrets list
```

Vérifier la présence de : `RESEND_API_KEY`, `FROM_EMAIL`, `REPLY_TO`

### 4. Déployer la function

```bash
supabase functions deploy send-confirmation-email --no-verify-jwt
```

> `--no-verify-jwt` est **obligatoire** : la function est appelée par les Database Webhooks Supabase, pas par un utilisateur connecté.

### URL de la function après déploiement

```
https://ltwwjhapdxhpkwvpabva.supabase.co/functions/v1/send-confirmation-email
```

---

## Templates disponibles

| Table | Valeur champ | Template |
|---|---|---|
| `ticket_requests` | `ticket_type = standard` | Billet Standard |
| `ticket_requests` | `ticket_type = courtside` | Courtside |
| `ticket_requests` | `ticket_type = vip` | VIP |
| `ticket_requests` | `ticket_type = invite` | Pass Invité |
| `ticket_requests` | `ticket_type = media` | Accréditation Média |
| `media_registrations` | `type_inscription = media` | Accréditation Média |
| `media_registrations` | `type_inscription = benevole` | Inscription Bénévole |
| `staff_guest_passes` | `pass_type = vip` | VIP |
| `staff_guest_passes` | `pass_type = courtside` | Courtside |
| `staff_guest_passes` | autre | Pass Invité |
| Toute autre table/type | — | Fallback générique |

---

## Webhooks Supabase à créer

**Dashboard : Database → Webhooks → Create webhook**

### Webhook 1 — Billetterie

| Champ | Valeur |
|---|---|
| Name | `ticket_requests_email_confirmation` |
| Table | `ticket_requests` |
| Events | `INSERT` |
| Type | HTTP Request |
| Method | POST |
| URL | `https://ltwwjhapdxhpkwvpabva.supabase.co/functions/v1/send-confirmation-email` |
| Headers | `Content-Type: application/json` |

### Webhook 2 — Inscriptions Média / Bénévoles

| Champ | Valeur |
|---|---|
| Name | `media_registrations_email_confirmation` |
| Table | `media_registrations` |
| Events | `INSERT` |
| Type | HTTP Request |
| Method | POST |
| URL | `https://ltwwjhapdxhpkwvpabva.supabase.co/functions/v1/send-confirmation-email` |
| Headers | `Content-Type: application/json` |

### Webhook 3 — Pass Invités Staff (optionnel)

| Champ | Valeur |
|---|---|
| Name | `staff_guest_passes_email_confirmation` |
| Table | `staff_guest_passes` |
| Events | `INSERT` |
| Type | HTTP Request |
| Method | POST |
| URL | `https://ltwwjhapdxhpkwvpabva.supabase.co/functions/v1/send-confirmation-email` |
| Headers | `Content-Type: application/json` |

> Ce webhook est optionnel. Ne le créer que si la table `staff_guest_passes` est active.

---

## Tests manuels avant webhooks

Tester la function directement avec curl **avant** de créer les webhooks.

### Test Standard

```bash
curl -X POST "https://ltwwjhapdxhpkwvpabva.supabase.co/functions/v1/send-confirmation-email" \
  -H "Content-Type: application/json" \
  -d "{\"table\":\"ticket_requests\",\"record\":{\"nom\":\"Test\",\"prenom\":\"Damien\",\"email\":\"af2kball@gmail.com\",\"ticket_type\":\"standard\",\"quantity\":1,\"status\":\"en_attente\"}}"
```

### Test Courtside

```bash
curl -X POST "https://ltwwjhapdxhpkwvpabva.supabase.co/functions/v1/send-confirmation-email" \
  -H "Content-Type: application/json" \
  -d "{\"table\":\"ticket_requests\",\"record\":{\"nom\":\"Test\",\"prenom\":\"Damien\",\"email\":\"af2kball@gmail.com\",\"ticket_type\":\"courtside\",\"quantity\":1,\"status\":\"en_attente\"}}"
```

### Test Média

```bash
curl -X POST "https://ltwwjhapdxhpkwvpabva.supabase.co/functions/v1/send-confirmation-email" \
  -H "Content-Type: application/json" \
  -d "{\"table\":\"media_registrations\",\"record\":{\"nom\":\"Test\",\"prenom\":\"Damien\",\"email\":\"af2kball@gmail.com\",\"type_inscription\":\"media\",\"organisation\":\"Test Media\",\"social_links\":\"@test\",\"status\":\"en_attente\"}}"
```

### Test Bénévole

```bash
curl -X POST "https://ltwwjhapdxhpkwvpabva.supabase.co/functions/v1/send-confirmation-email" \
  -H "Content-Type: application/json" \
  -d "{\"table\":\"media_registrations\",\"record\":{\"nom\":\"Test\",\"prenom\":\"Damien\",\"email\":\"af2kball@gmail.com\",\"type_inscription\":\"benevole\",\"disponibilites\":\"Toute la journée\",\"status\":\"en_attente\"}}"
```

### Résultat attendu

```json
{ "success": true, "table": "ticket_requests", "to": "af2kball@gmail.com", "resend_id": "..." }
```

---

## Checklist de validation complète

```
[ ] supabase functions deploy exécuté sans erreur
[ ] URL function répond (POST) en status 200
[ ] Test manuel Standard → email reçu
[ ] Test manuel Courtside → email reçu, mention "places limitées"
[ ] Test manuel Média → email reçu, mention "en attente de validation"
[ ] Test manuel Bénévole → email reçu
[ ] Webhook ticket_requests créé dans Supabase Dashboard
[ ] Webhook media_registrations créé dans Supabase Dashboard
[ ] Demande Standard depuis https://africa2kball.com/billetterie.html → email reçu
[ ] Demande Courtside depuis le site → email reçu
[ ] Inscription Média depuis https://africa2kball.com/inscriptions.html → email reçu
[ ] Inscription Bénévole depuis le site → email reçu
[ ] FROM_EMAIL correct dans les emails reçus
[ ] reply-to = af2kball@gmail.com
[ ] Aucun email ne confirme une validation définitive
[ ] Vérifier le dossier SPAM
[ ] Aucune clé Resend visible dans GitHub
```

---

## Procédure de debug

En cas d'erreur :

**Supabase Dashboard → Edge Functions → send-confirmation-email → Logs**

| Message dans les logs | Cause | Solution |
|---|---|---|
| `RESEND_API_KEY missing` | Secret absent | Ajouter via `supabase secrets set RESEND_API_KEY=re_xxx` |
| `FROM_EMAIL missing` | Secret absent | Ajouter via `supabase secrets set FROM_EMAIL="..."` |
| `Resend failed` | Refus Resend | Vérifier domaine autorisé, clé API active, limite d'envoi |
| `Missing record or email` | Payload webhook incorrect | Vérifier la config du webhook (table, event INSERT) |
| `Invalid JSON payload` | Webhook mal configuré | Vérifier header `Content-Type: application/json` |

---

## Règles de sécurité

- La clé `RESEND_API_KEY` ne doit **jamais** apparaître dans le code source.
- La clé `RESEND_API_KEY` ne doit **jamais** être committée dans Git.
- La clé `service_role` Supabase ne doit **jamais** être utilisée côté frontend.
- Seule la clé `anon` publique est utilisée dans `main.js`.

---

## Limites actuelles

- Les emails INSERT confirment uniquement la **réception** de la demande.
- La validation définitive reste gérée manuellement depuis l'admin.
- Aucun email automatique sur `UPDATE status = 'valide'` pour l'instant.

---

## Évolution future

Ajouter un second webhook sur **UPDATE** pour envoyer un email de confirmation définitive :

```
Event: UPDATE
Condition: NEW.status = 'valide' AND OLD.status != 'valide'
→ Edge Function send-validation-email
```

---

*Dernière mise à jour : V32 — 27 mai 2026*
