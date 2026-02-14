import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import multer from 'multer'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import souvenirRoutes from './routes/souvenirs.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = parseInt(process.env.PORT || '3001', 10)

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/souvenirs', souvenirRoutes)

app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: 'mysql' })
})

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Fichier trop volumineux (max 10 Mo)' })
  }
  console.error(err)
  res.status(500).json({ error: err.message || 'Erreur serveur' })
})

app.listen(PORT, () => {
  console.log('API Souvenirs à Deux sur http://localhost:' + PORT)
})
