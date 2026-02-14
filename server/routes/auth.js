import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { queryOne, query } from '../db.js'
import { signToken } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body
    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit faire au moins 6 caractères' })
    }
    const normalizedEmail = email.trim().toLowerCase()
    const existing = await queryOne('SELECT id FROM users WHERE email = ?', [normalizedEmail])
    if (existing) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' })
    }
    const password_hash = await bcrypt.hash(password, 10)
    const result = await query(
      'INSERT INTO users (email, password_hash, display_name, partner_email) VALUES (?, ?, ?, ?)',
      [normalizedEmail, password_hash, displayName?.trim() || null, '']
    )
    const userId = result.insertId
    const token = signToken({ userId })
    res.status(201).json({
      user: {
        id: userId,
        email: normalizedEmail,
        displayName: displayName?.trim() || normalizedEmail.split('@')[0],
        partnerEmail: '',
      },
      token,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' })
    }
    const normalizedEmail = email.trim().toLowerCase()
    const user = await queryOne(
      'SELECT id, email, password_hash, display_name, partner_email FROM users WHERE email = ?',
      [normalizedEmail]
    )
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }
    const token = signToken({ userId: user.id })
    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name || user.email.split('@')[0],
        partnerEmail: user.partner_email || '',
      },
      token,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
