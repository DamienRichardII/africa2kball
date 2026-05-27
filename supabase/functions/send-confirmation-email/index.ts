// ============================================================
// Africa2KBall — Supabase Edge Function
// send-confirmation-email
// Déclenchée par Database Webhook INSERT sur :
//   - public.ticket_requests
//   - public.media_registrations
//   - public.staff_guest_passes
// Envoie un email personnalisé via Resend.
// Aucune clé secrète dans le code — uniquement Deno.env.get()
// ============================================================

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL");
const REPLY_TO = Deno.env.get("REPLY_TO") || "af2kball@gmail.com";

// ── Helpers ──────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  return String(value).replace(/[<>&"]/g, (c) => {
    const map: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
    };
    return map[c] ?? c;
  });
}

function normalize(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// ── Template base ─────────────────────────────────────────────

function baseTemplate(opts: {
  prenom: string;
  nom: string;
  subject: string;
  tagline: string;
  statusBadge: string;
  statusColor: string;
  recap: { label: string; value: string }[];
  bodyExtra?: string;
  alertHtml?: string;
}): { subject: string; html: string } {
  const {
    prenom,
    nom,
    subject,
    tagline,
    statusBadge,
    statusColor,
    recap,
    bodyExtra = "",
    alertHtml = "",
  } = opts;

  const recapRows = recap
    .map(
      (r) =>
        `<tr>
          <td style="padding:6px 12px 6px 0;color:#a0845c;font-size:14px;white-space:nowrap;vertical-align:top;">${escapeHtml(r.label)}</td>
          <td style="padding:6px 0;color:#f0e6d3;font-size:14px;vertical-align:top;">${escapeHtml(r.value)}</td>
        </tr>`
    )
    .join("");

  const alertBlock = alertHtml
    ? `<div style="margin:24px 0 0;padding:14px 16px;background:#3a2000;border-left:3px solid #e8821a;border-radius:4px;font-size:13px;color:#f0c070;line-height:1.6;">
        ${alertHtml}
      </div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:32px 16px;">
  <tr>
    <td align="center">
      <table width="100%" style="max-width:560px;background:#1a1208;border-radius:8px;overflow:hidden;border:1px solid #2e1f00;">

        <!-- Header -->
        <tr>
          <td style="background:#e8821a;padding:20px 28px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#0d0d0d;letter-spacing:1px;">AFRICA2KBALL</p>
            <p style="margin:4px 0 0;font-size:12px;color:#3a1800;letter-spacing:2px;text-transform:uppercase;">Édition 3 — 07 juin 2026</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 28px 0;">
            <p style="margin:0 0 18px;font-size:16px;color:#f0e6d3;">Bonjour <strong>${escapeHtml(prenom)}</strong>,</p>
            <p style="margin:0 0 22px;font-size:15px;color:#c8b89a;line-height:1.7;">${tagline}</p>

            <!-- Status badge -->
            <div style="display:inline-block;margin:0 0 24px;padding:6px 14px;background:${statusColor};border-radius:20px;font-size:12px;font-weight:700;color:#0d0d0d;letter-spacing:1px;text-transform:uppercase;">
              ${escapeHtml(statusBadge)}
            </div>

            <!-- Recap table -->
            <table cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #2e1f00;margin-top:4px;">
              ${recapRows}
            </table>

            ${alertBlock}
            ${bodyExtra}
          </td>
        </tr>

        <!-- Event info -->
        <tr>
          <td style="padding:24px 28px 0;">
            <div style="background:#0d0d0d;border-radius:6px;padding:14px 16px;border:1px solid #2e1f00;">
              <p style="margin:0 0 8px;font-size:11px;color:#a0845c;text-transform:uppercase;letter-spacing:1px;">Infos événement</p>
              <p style="margin:0;font-size:14px;color:#f0e6d3;line-height:1.8;">
                📅 <strong>07 juin 2026</strong><br/>
                📍 <strong>Gymnase Lino Ventura</strong>, Pavillons-sous-Bois<br/>
                🏀 Africa2KBall — Édition 3
              </p>
            </div>
          </td>
        </tr>

        <!-- Reply-to notice -->
        <tr>
          <td style="padding:22px 28px 0;">
            <p style="margin:0;font-size:13px;color:#7a6a55;line-height:1.6;">
              Pour toute question, répondez directement à cet email — notre équipe vous répondra dès que possible.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:22px 28px 28px;border-top:1px solid #2e1f00;margin-top:20px;">
            <p style="margin:20px 0 4px;font-size:12px;color:#5a4a35;text-align:center;">
              Africa2KBall — af2kball@gmail.com
            </p>
            <p style="margin:0;font-size:11px;color:#3a2a1a;text-align:center;">
              Cet email a été envoyé automatiquement suite à votre demande.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  return { subject, html };
}

// ── Templates individuels ─────────────────────────────────────

function buildStandardTicketEmail(
  record: Record<string, unknown>
): { subject: string; html: string } {
  const prenom = escapeHtml(record.prenom, "");
  const nom = escapeHtml(record.nom, "");
  const quantity = Number(record.quantity) || 1;

  return baseTemplate({
    prenom,
    nom,
    subject: "Demande de billet Standard reçue — Africa2KBall Édition 3",
    tagline:
      "Votre demande de billet Standard pour Africa2KBall Édition 3 a bien été enregistrée. L'entrée Standard est gratuite.",
    statusBadge: "Demande reçue",
    statusColor: "#4caf50",
    recap: [
      { label: "Nom", value: `${prenom} ${nom}` },
      { label: "Type", value: "Standard" },
      { label: "Quantité", value: String(quantity) },
      { label: "Statut", value: "Demande reçue" },
    ],
    alertHtml:
      "Conservez cet email — il pourra vous être demandé à l'entrée le jour de l'événement.",
  });
}

function buildCourtsideTicketEmail(
  record: Record<string, unknown>
): { subject: string; html: string } {
  const prenom = escapeHtml(record.prenom, "");
  const nom = escapeHtml(record.nom, "");
  const quantity = Number(record.quantity) || 1;

  return baseTemplate({
    prenom,
    nom,
    subject: "Demande Courtside reçue — Africa2KBall Édition 3",
    tagline:
      "Votre demande de place Courtside pour Africa2KBall Édition 3 a bien été enregistrée.",
    statusBadge: "En attente de validation",
    statusColor: "#e8821a",
    recap: [
      { label: "Nom", value: `${prenom} ${nom}` },
      { label: "Type", value: "Courtside" },
      { label: "Quantité", value: String(quantity) },
      { label: "Statut", value: "En attente de validation" },
    ],
    alertHtml:
      "Les places Courtside sont <strong>gratuites, limitées et soumises à validation</strong> par l'équipe Africa2KBall.<br/>" +
      "Cet email confirme uniquement la réception de votre demande. Vous recevrez un second message si votre accès Courtside est validé.",
  });
}

function buildVipTicketEmail(
  record: Record<string, unknown>
): { subject: string; html: string } {
  const prenom = escapeHtml(record.prenom, "");
  const nom = escapeHtml(record.nom, "");
  const quantity = Number(record.quantity) || 1;

  return baseTemplate({
    prenom,
    nom,
    subject: "Demande VIP reçue — Africa2KBall Édition 3",
    tagline:
      "Votre demande de pass VIP pour Africa2KBall Édition 3 a bien été enregistrée.",
    statusBadge: "En attente de validation",
    statusColor: "#e8821a",
    recap: [
      { label: "Nom", value: `${prenom} ${nom}` },
      { label: "Type", value: "VIP" },
      { label: "Quantité", value: String(quantity) },
      { label: "Statut", value: "En attente de validation" },
    ],
    alertHtml:
      "Les pass VIP sont réservés aux invités, partenaires et profils validés par l'organisation.<br/>" +
      "Cet email confirme uniquement la réception de votre demande. La validation finale est effectuée par l'équipe Africa2KBall.",
  });
}

function buildInviteTicketEmail(
  record: Record<string, unknown>
): { subject: string; html: string } {
  const prenom = escapeHtml(record.prenom, "");
  const nom = escapeHtml(record.nom, "");
  const invitedBy = record.invited_by ? escapeHtml(record.invited_by) : null;

  const recap: { label: string; value: string }[] = [
    { label: "Nom", value: `${prenom} ${nom}` },
    { label: "Type", value: "Pass invité" },
    { label: "Statut", value: "En attente de validation" },
  ];
  if (invitedBy) {
    recap.splice(2, 0, { label: "Invité par", value: invitedBy });
  }

  return baseTemplate({
    prenom,
    nom,
    subject: "Demande Pass Invité reçue — Africa2KBall Édition 3",
    tagline:
      "Votre demande de pass invité pour Africa2KBall Édition 3 a bien été enregistrée.",
    statusBadge: "En attente de validation",
    statusColor: "#e8821a",
    recap,
    alertHtml:
      "Les pass invités sont soumis à validation par l'organisation.<br/>" +
      "Cet email confirme uniquement la réception de votre demande.",
  });
}

function buildMediaAccreditationEmail(
  record: Record<string, unknown>
): { subject: string; html: string } {
  const prenom = escapeHtml(record.prenom, "");
  const nom = escapeHtml(record.nom, "");
  const organisation = escapeHtml(record.organisation, "Non renseigné");
  const social = escapeHtml(record.social_links, "Non renseigné");

  return baseTemplate({
    prenom,
    nom,
    subject:
      "Demande d'accréditation média reçue — Africa2KBall Édition 3",
    tagline:
      "Votre demande d'accréditation média pour Africa2KBall Édition 3 a bien été reçue. L'équipe étudiera votre dossier et reviendra vers vous après validation.",
    statusBadge: "En attente de validation",
    statusColor: "#e8821a",
    recap: [
      { label: "Nom", value: `${prenom} ${nom}` },
      { label: "Organisation / média", value: organisation },
      { label: "Réseaux sociaux", value: social },
      { label: "Statut", value: "En attente de validation" },
    ],
    alertHtml:
      "Cet email confirme uniquement la réception de votre demande d'accréditation. Aucune validation définitive n'est acquise à ce stade.",
  });
}

function buildVolunteerEmail(
  record: Record<string, unknown>
): { subject: string; html: string } {
  const prenom = escapeHtml(record.prenom, "");
  const nom = escapeHtml(record.nom, "");
  const dispos = escapeHtml(record.disponibilites, "Non renseigné");

  return baseTemplate({
    prenom,
    nom,
    subject: "Inscription bénévole reçue — Africa2KBall Édition 3",
    tagline:
      "Votre inscription bénévole pour Africa2KBall Édition 3 a bien été reçue. Merci pour votre envie de contribuer à l'organisation de l'événement !",
    statusBadge: "En attente de validation",
    statusColor: "#e8821a",
    recap: [
      { label: "Nom", value: `${prenom} ${nom}` },
      { label: "Disponibilités", value: dispos },
      { label: "Statut", value: "En attente de validation" },
    ],
    alertHtml:
      "L'équipe Africa2KBall reviendra vers vous après étude de votre inscription.<br/>" +
      "Cet email confirme uniquement la réception de votre candidature bénévole.",
  });
}

function buildFallbackEmail(
  record: Record<string, unknown>
): { subject: string; html: string } {
  const prenom = escapeHtml(record.prenom, "");
  const nom = escapeHtml(record.nom, "");

  return baseTemplate({
    prenom,
    nom,
    subject: "Demande reçue — Africa2KBall Édition 3",
    tagline:
      "Votre demande a bien été reçue par l'équipe Africa2KBall. L'équipe reviendra vers vous si une validation ou une précision est nécessaire.",
    statusBadge: "Reçue",
    statusColor: "#4caf50",
    recap: [
      { label: "Nom", value: `${prenom} ${nom}` },
      { label: "Statut", value: "Reçue" },
    ],
  });
}

// ── Routeur principal ─────────────────────────────────────────

function buildEmail(
  table: string,
  record: Record<string, unknown>
): { subject: string; html: string } {
  if (table === "ticket_requests") {
    const type = normalize(record.ticket_type);
    if (type === "standard") return buildStandardTicketEmail(record);
    if (type === "courtside") return buildCourtsideTicketEmail(record);
    if (type === "vip") return buildVipTicketEmail(record);
    if (type === "invite" || type === "invité" || type === "invitee")
      return buildInviteTicketEmail(record);
    if (type === "media" || type === "média")
      return buildMediaAccreditationEmail(record);
    // Type inconnu dans ticket_requests → fallback
    return buildFallbackEmail(record);
  }

  if (table === "media_registrations") {
    const type = normalize(record.type_inscription);
    if (type === "media" || type === "média")
      return buildMediaAccreditationEmail(record);
    if (type === "benevole" || type === "bénévole")
      return buildVolunteerEmail(record);
    return buildFallbackEmail(record);
  }

  if (table === "staff_guest_passes") {
    const passType = normalize(record.pass_type);
    if (passType === "vip") return buildVipTicketEmail(record);
    if (passType === "courtside") return buildCourtsideTicketEmail(record);
    return buildInviteTicketEmail(record);
  }

  // Table inconnue
  return buildFallbackEmail(record);
}

// ── Serveur principal ─────────────────────────────────────────

serve(async (req: Request) => {
  try {
    // Méthode
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    // Secrets requis
    if (!RESEND_API_KEY) {
      console.error("[Africa2KBall] RESEND_API_KEY manquante dans les secrets Supabase.");
      return json({ error: "RESEND_API_KEY missing" }, 500);
    }
    if (!FROM_EMAIL) {
      console.error("[Africa2KBall] FROM_EMAIL manquant dans les secrets Supabase.");
      return json({ error: "FROM_EMAIL missing" }, 500);
    }

    // Payload webhook Supabase
    let payload: Record<string, unknown>;
    try {
      payload = await req.json();
    } catch {
      return json({ error: "Invalid JSON payload" }, 400);
    }

    const table = String(payload.table ?? "");
    const record = payload.record as Record<string, unknown> | undefined;

    if (!record) {
      console.warn("[Africa2KBall] Payload sans record:", JSON.stringify(payload));
      return json({ error: "Missing record in payload" }, 400);
    }

    if (!record.email || typeof record.email !== "string") {
      console.warn("[Africa2KBall] Record sans email:", JSON.stringify(record));
      return json({ error: "Missing or invalid email in record" }, 400);
    }

    console.log(`[Africa2KBall] Traitement table=${table} email=${record.email}`);

    // Construction email
    const emailData = buildEmail(table, record);

    // Envoi via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [record.email as string],
        reply_to: REPLY_TO,
        subject: emailData.subject,
        html: emailData.html,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error(
        `[Africa2KBall] Resend error status=${resendResponse.status}:`,
        errorText
      );
      return json(
        { error: "Resend failed", status: resendResponse.status, details: errorText },
        500
      );
    }

    const resendData = await resendResponse.json();
    console.log(
      `[Africa2KBall] Email envoyé OK — table=${table} to=${record.email} id=${
        (resendData as Record<string, unknown>).id ?? "?"
      }`
    );

    return json({ success: true, table, to: record.email, resend_id: (resendData as Record<string, unknown>).id }, 200);
  } catch (error) {
    console.error("[Africa2KBall] Erreur inattendue:", error);
    return json({ error: String(error) }, 500);
  }
});
