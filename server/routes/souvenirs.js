import { Router } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import fs from 'fs'
import { query, queryOne } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', 'uploads', 'souvenirs')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(uploadsDir, String(req.userId))
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename(req, file, cb) {
    const safe = Date.now() + '_' + (file.originalname || 'photo').replace(/[^a-zA-Z0-9.-]/g, '_')
    cb(null, safe)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype?.startsWith('image/')) {
      return cb(new Error('Seules les images sont acceptées'))
    }
    cb(null, true)
  },
})

const router = Router()

function toSouvenir(row) {
  if (!row) return null
  const questions = typeof row.questions === 'string' ? JSON.parse(row.questions) : row.questions
  return {
    id: row.id,
    createdBy: row.created_by,
    forPartnerEmail: row.for_partner_email,
    photoURL: row.photo_url,
    questions: Array.isArray(questions) ? questions : [],
    createdAt: row.created_at,
  }
}

// Créer un souvenir (multipart: photo + JSON fields)
router.post('/', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ error: 'Photo requise' })
    }
    const forPartnerEmail = (req.body.forPartnerEmail || '').trim().toLowerCase()
    if (!forPartnerEmail) {
      return res.status(400).json({ error: 'Email du partenaire requis' })
    }
    let questions = []
    try {
      questions = typeof req.body.questions === 'string' ? JSON.parse(req.body.questions) : req.body.questions
    } catch {}
    if (!Array.isArray(questions)) questions = []
    questions = questions.filter((q) => q?.text?.trim()).map((q) => ({ text: String(q.text).trim() }))
    if (questions.length === 0) {
      questions = [{ text: 'Te rappelles-tu ce moment ?' }]
    }
    const photoUrl = '/uploads/souvenirs/' + req.userId + '/' + path.basename(file.path)
    const result = await query(
      'INSERT INTO souvenirs (created_by, for_partner_email, photo_url, questions) VALUES (?, ?, ?, ?)',
      [req.userId, forPartnerEmail, photoUrl, JSON.stringify(questions)]
    )
    const row = await queryOne('SELECT * FROM souvenirs WHERE id = ?', [result.insertId])
    res.status(201).json(toSouvenir(row))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Erreur serveur' })
  }
})

// Mes souvenirs créés
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const rows = await query(
      'SELECT * FROM souvenirs WHERE created_by = ? ORDER BY created_at DESC',
      [req.userId]
    )
    res.json(rows.map(toSouvenir))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Souvenirs reçus (for_partner_email = mon email)
router.get('/received', requireAuth, async (req, res) => {
  try {
    const email = (req.user.email || '').trim().toLowerCase()
    if (!email) return res.json([])
    const rows = await query(
      'SELECT * FROM souvenirs WHERE for_partner_email = ? ORDER BY created_at DESC',
      [email]
    )
    res.json(rows.map(toSouvenir))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Un souvenir par id (vérifier accès)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' })
    const row = await queryOne('SELECT * FROM souvenirs WHERE id = ?', [id])
    if (!row) return res.status(404).json({ error: 'Souvenir introuvable' })
    const email = (req.user.email || '').trim().toLowerCase()
    const isCreator = row.created_by === req.userId
    const isPartner = row.for_partner_email === email
    if (!isCreator && !isPartner) {
      return res.status(403).json({ error: 'Accès refusé' })
    }
    res.json(toSouvenir(row))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Envoyer les réponses au quiz
router.post('/:id/answers', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' })
    const row = await queryOne('SELECT * FROM souvenirs WHERE id = ?', [id])
    if (!row) return res.status(404).json({ error: 'Souvenir introuvable' })
    const email = (req.user.email || '').trim().toLowerCase()
    if (row.for_partner_email !== email) {
      return res.status(403).json({ error: 'Seul le partenaire peut répondre' })
    }
    const answers = req.body.answers || {}
    await query(
      `INSERT INTO souvenir_answers (souvenir_id, answered_by, answers, verified_by_creator)
       VALUES (?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE answered_by = VALUES(answered_by), answers = VALUES(answers), answered_at = CURRENT_TIMESTAMP`,
      [id, req.userId, JSON.stringify(answers)]
    )
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Voir les réponses : créateur (détail) ou partenaire (statut pour les cartes "Reçus")
router.get('/:id/answers', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' })
    const row = await queryOne('SELECT * FROM souvenirs WHERE id = ?', [id])
    if (!row) return res.status(404).json({ error: 'Souvenir introuvable' })
    const email = (req.user.email || '').trim().toLowerCase()
    const isCreator = row.created_by === req.userId
    const isPartner = row.for_partner_email === email
    if (!isCreator && !isPartner) {
      return res.status(403).json({ error: 'Accès refusé' })
    }
    const answer = await queryOne('SELECT * FROM souvenir_answers WHERE souvenir_id = ?', [id])
    if (!answer) return res.json(null)
    const answers = typeof answer.answers === 'string' ? JSON.parse(answer.answers) : answer.answers
    res.json({
      answeredBy: answer.answered_by,
      answers,
      answeredAt: answer.answered_at,
      verifiedByCreator: Boolean(answer.verified_by_creator),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.put('/:id/answers/verify', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' })
    const row = await queryOne('SELECT * FROM souvenirs WHERE id = ?', [id])
    if (!row) return res.status(404).json({ error: 'Souvenir introuvable' })
    if (row.created_by !== req.userId) {
      return res.status(403).json({ error: 'Seul le créateur peut vérifier' })
    }
    const existing = await queryOne('SELECT 1 FROM souvenir_answers WHERE souvenir_id = ?', [id])
    if (!existing) {
      return res.status(400).json({ error: 'Aucune réponse à valider' })
    }
    await query(
      'UPDATE souvenir_answers SET verified_by_creator = 1 WHERE souvenir_id = ?',
      [id]
    )
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
