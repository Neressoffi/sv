import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createSouvenir } from '../lib/souvenirs'
import Card from '../components/Card'
import Button from '../components/Button'
import { IconCamera, IconX } from '../components/Icons'

const DEFAULT_QUESTIONS = [
  'Te rappelles-tu ce moment ?',
  'Où a été prise cette photo ?',
  'Quelle était la date (ou l’année) ?',
]

export default function AddSouvenir() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS.map((text) => ({ text })))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const partnerEmail = profile?.partnerEmail?.trim()
  const hasPartner = !!partnerEmail

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choisis une image (JPG, PNG, etc.).')
      return
    }
    setError('')
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const addQuestion = () => setQuestions((q) => [...q, { text: '' }])
  const updateQuestion = (i, text) => {
    setQuestions((q) => q.map((item, j) => (j === i ? { ...item, text } : item)))
  }
  const removeQuestion = (i) => {
    setQuestions((q) => q.filter((_, j) => j !== i))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!photoFile || !hasPartner) {
      setError(hasPartner ? 'Ajoute une photo.' : 'Indique l’email de ta partenaire dans Profil.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await createSouvenir({
        forPartnerEmail: partnerEmail,
        photoFile,
        questions,
      })
      navigate('/souvenirs')
    } catch (err) {
      setError(err.message || 'Erreur lors de l’envoi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-rose-800">Ajouter un souvenir</h1>

      {!hasPartner && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-amber-800 text-sm">
            Va dans <strong>Profil</strong> et indique l’email de ta partenaire pour pouvoir lui envoyer des souvenirs.
          </p>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-4">
          <label className="block text-sm font-medium text-rose-800 mb-2">Photo</label>
          <div className="border-2 border-dashed border-pink-200 rounded-xl p-6 text-center bg-pink-50/50">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onFileChange}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer block">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Aperçu"
                  className="max-h-48 mx-auto rounded-lg object-contain"
                />
              ) : (
                <span className="flex flex-col items-center gap-2 text-pink-500">
                  <IconCamera size={40} strokeWidth={1.5} />
                  Choisir une photo
                </span>
              )}
            </label>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-rose-800">Questions pour ta moitié</label>
            <Button type="button" variant="ghost" className="text-sm" onClick={addQuestion}>
              + Ajouter
            </Button>
          </div>
          <ul className="space-y-2">
            {questions.map((q, i) => (
              <li key={i} className="flex gap-2">
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestion(i, e.target.value)}
                  placeholder="Ex: Te rappelles-tu ce moment ?"
                  className="flex-1 rounded-xl border border-pink-200 px-3 py-2 text-sm text-rose-900 focus:ring-2 focus:ring-rose-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeQuestion(i)}
                  className="text-pink-400 hover:text-rose-600 touch-target p-2 rounded-lg transition-colors"
                  aria-label="Supprimer"
                >
                  <IconX size={20} />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-xl p-3">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading || !hasPartner}>
          {loading ? 'Envoi...' : 'Créer le souvenir'}
        </Button>
      </form>
    </div>
  )
}
