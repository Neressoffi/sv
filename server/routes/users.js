import { Router } from 'express'
import { query, queryOne } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { sendPartnerInvitation } from '../lib/email.js'

const router = Router()

router.get('/me', requireAuth, async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    displayName: req.user.display_name || req.user.email.split('@')[0],
    partnerEmail: req.user.partner_email || '',
  })
})

router.put('/me', requireAuth, async (req, res) => {
  try {
    const { partnerEmail, displayName } = req.body
    const updates = []
    const params = []
    const newPartnerEmail = typeof partnerEmail === 'string' ? partnerEmail.trim().toLowerCase() : null
    const previousPartnerEmail = (req.user.partner_email || '').trim().toLowerCase()

    if (newPartnerEmail !== null) {
      updates.push('partner_email = ?')
      params.push(newPartnerEmail)
    }
    if (typeof displayName === 'string') {
      updates.push('display_name = ?')
      params.push(displayName.trim())
    }
    if (updates.length === 0) {
      return res.json({
        id: req.user.id,
        email: req.user.email,
        displayName: req.user.display_name || req.user.email.split('@')[0],
        partnerEmail: req.user.partner_email || '',
      })
    }
    params.push(req.userId)
    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    )
    const user = await queryOne(
      'SELECT id, email, display_name, partner_email FROM users WHERE id = ?',
      [req.userId]
    )
    const result = {
      id: user.id,
      email: user.email,
      displayName: user.display_name || user.email.split('@')[0],
      partnerEmail: user.partner_email || '',
    }

    if (newPartnerEmail) {
      const appUrl = process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:5173'
      const partnerName = user.display_name || user.email.split('@')[0] || 'Ton partenaire'
      const { sent, error: emailError } = await sendPartnerInvitation(newPartnerEmail, partnerName, appUrl)
      result.emailSent = sent
      if (!sent && emailError) result.emailError = emailError
    }

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
