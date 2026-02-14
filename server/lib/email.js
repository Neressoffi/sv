import nodemailer from 'nodemailer'
import { Resend } from 'resend'

const appName = process.env.APP_NAME || 'Souvenirs à Deux'

function escapeHtml(s) {
  if (!s) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildEmailContent(partnerName, appUrl, toEmail) {
  const subject = `${partnerName} t'invite à jouer sur ${appName} ❤️`
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; font-family: 'Segoe UI', sans-serif; background:#fff1f2; color:#4a044e;">
  <div style="max-width:480px; margin:0 auto; padding:24px;">
    <p style="font-size:18px;">Salut,</p>
    <p style="font-size:16px; line-height:1.5;">
      <strong>${escapeHtml(partnerName)}</strong> t'invite à participer au jeu sur <strong>${escapeHtml(appName)}</strong>.
    </p>
    <p style="font-size:16px; line-height:1.5;">
      Tu pourras voir des photos souvenirs et répondre à des questions qu'il ou elle a préparées pour toi.
    </p>
    <p style="margin:28px 0;">
      <a href="${escapeHtml(appUrl)}" style="display:inline-block; padding:14px 28px; background:#be185d; color:white; text-decoration:none; font-weight:600; border-radius:12px; font-size:16px;">
        Rejoindre l'application →
      </a>
    </p>
    <p style="font-size:14px; color:#9d174d;">
      Si tu n'as pas encore de compte, crée-en un avec cette adresse email. Sinon, connecte-toi et va dans « Souvenirs » pour voir les quiz qui t'attendent.
    </p>
    <p style="font-size:14px; color:#888; margin-top:32px;">
      À très vite sur ${escapeHtml(appName)} 💕
    </p>
  </div>
</body>
</html>
  `.trim()
  const text = `
Salut,

${partnerName} t'invite à participer au jeu sur ${appName}.

Tu pourras voir des photos souvenirs et répondre à des questions qu'il ou elle a préparées pour toi.

Rejoins l'application ici : ${appUrl}

Si tu n'as pas encore de compte, crée-en un avec cette adresse email. Sinon, connecte-toi et va dans « Souvenirs » pour voir les quiz qui t'attendent.

À très vite sur ${appName} 💕
  `.trim()
  return { subject, html, text }
}

/**
 * Envoi via Resend (une clé API, très fiable).
 * Définir RESEND_API_KEY et EMAIL_FROM (ex: notifications@tondomaine.com ou onboarding@resend.dev pour test).
 */
async function sendViaResend(toEmail, partnerName, appUrl) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || process.env.RESEND_EMAIL_FROM
  if (!apiKey || !from) {
    return { sent: false, error: 'Resend : définir RESEND_API_KEY et EMAIL_FROM dans server/.env' }
  }
  const { subject, html, text } = buildEmailContent(partnerName, appUrl, toEmail)
  try {
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from: `${appName} <${from}>`,
      to: [toEmail],
      subject,
      html,
      text,
    })
    if (error) {
      console.error('Resend error:', error)
      return { sent: false, error: error.message || JSON.stringify(error) }
    }
    return { sent: true }
  } catch (err) {
    console.error('Resend exception:', err)
    return { sent: false, error: err.message || String(err) }
  }
}

/**
 * Envoi via SMTP (Gmail, Outlook, etc.).
 * Gmail : SMTP_USER = ton@gmail.com, SMTP_PASSWORD = mot de passe d'application (pas le mot de passe du compte).
 */
function getSmtpTransporter() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD
  if (!host || !user || !pass) return null
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const isGmail = host.toLowerCase().includes('gmail')
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
    ...(isGmail && port === 587
      ? { tls: { rejectUnauthorized: true }, debug: false }
      : {}),
  })
}

async function sendViaSmtp(toEmail, partnerName, appUrl) {
  const transporter = getSmtpTransporter()
  if (!transporter) {
    return { sent: false, error: 'SMTP non configuré : définir SMTP_HOST, SMTP_USER et SMTP_PASSWORD dans server/.env' }
  }
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER
  const { subject, html, text } = buildEmailContent(partnerName, appUrl, toEmail)
  try {
    await transporter.sendMail({
      from: `"${appName}" <${from}>`,
      to: toEmail,
      subject,
      text,
      html,
    })
    return { sent: true }
  } catch (err) {
    console.error('SMTP erreur:', err.message || err)
    const msg = err.message || String(err)
    let hint = ''
    if (msg.includes('Invalid login') || msg.includes('Username and Password not accepted')) {
      hint = ' (Gmail : utilise un mot de passe d’application, pas ton mot de passe du compte. Voir https://support.google.com/accounts/answer/185833)'
    }
    return { sent: false, error: msg + hint }
  }
}

/**
 * Envoie un email d'invitation à la partenaire.
 * Priorité : SMTP (Gmail) si configuré → envoi à n'importe qui.
 * Sinon Resend si clé définie (avec domaine vérifié pour envoyer à d'autres).
 */
export async function sendPartnerInvitation(toEmail, partnerName, appUrl) {
  if (!toEmail || !toEmail.includes('@')) {
    return { sent: false, error: 'Adresse email invalide' }
  }
  const smtpOk = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
  if (smtpOk) {
    return sendViaSmtp(toEmail, partnerName, appUrl)
  }
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(toEmail, partnerName, appUrl)
  }
  return { sent: false, error: 'Configurer SMTP (Gmail) ou Resend dans server/.env. Gmail : SMTP_HOST, SMTP_USER, SMTP_PASSWORD (mot de passe d\'application).' }
}
