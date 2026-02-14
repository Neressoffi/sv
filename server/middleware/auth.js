import jwt from 'jsonwebtoken'
import { queryOne } from '../db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

/** Middleware: exige un utilisateur connecté. Met req.user et req.userId. */
export async function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' })
  }
  const payload = verifyToken(token)
  if (!payload?.userId) {
    return res.status(401).json({ error: 'Token invalide' })
  }
  const user = await queryOne(
    'SELECT id, email, display_name, partner_email, created_at FROM users WHERE id = ?',
    [payload.userId]
  )
  if (!user) {
    return res.status(401).json({ error: 'Utilisateur introuvable' })
  }
  req.userId = user.id
  req.user = user
  next()
}
