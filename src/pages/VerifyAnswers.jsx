import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getSouvenir, getAnswer, setVerified } from '../lib/souvenirs'
import { getPhotoUrl } from '../api/client'
import Card from '../components/Card'
import Button from '../components/Button'
import { IconCheckCircle } from '../components/Icons'

export default function VerifyAnswers() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [souvenir, setSouvenir] = useState(null)
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([getSouvenir(id), getAnswer(id)]).then(([s, a]) => {
      setSouvenir(s)
      setAnswer(a)
      setLoading(false)
    })
  }, [id])

  const markVerified = async () => {
    setSaving(true)
    try {
      await setVerified(id, true)
      setAnswer((a) => (a ? { ...a, verifiedByCreator: true } : a))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-12 text-center text-rose-500">Chargement...</div>
  if (!souvenir) return <div className="py-12 text-center text-rose-600">Souvenir introuvable.</div>

  const questions = souvenir.questions || []
  const answers = answer?.answers || {}
  const hasAnswers = Object.keys(answers).length > 0
  const verified = answer?.verifiedByCreator

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-rose-800">Vérifier les réponses</h1>
      <Card className="p-0 overflow-hidden">
        <img
          src={getPhotoUrl(souvenir.photoURL)}
          alt="Souvenir"
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="p-4 space-y-4">
          {!hasAnswers ? (
            <p className="text-pink-600">Ta partenaire n’a pas encore répondu aux questions.</p>
          ) : (
            <>
              <p className="text-sm text-rose-700">
                Vérifie les réponses de ta moitié et valide si tout est bon.
              </p>
              <ul className="space-y-3">
                {questions.map((q, i) => (
                  <li key={i} className="border-b border-pink-100 pb-3 last:border-0">
                    <p className="font-medium text-rose-800">{q.text}</p>
                    <p className="text-pink-600 mt-1">{answers[i] ?? '—'}</p>
                  </li>
                ))}
              </ul>
              {!verified && (
                <Button onClick={markVerified} disabled={saving} className="w-full flex items-center justify-center gap-2">
                  {saving ? 'Enregistrement...' : (
                    <>
                      <IconCheckCircle size={20} />
                      Valider les réponses
                    </>
                  )}
                </Button>
              )}
              {verified && (
                <p className="flex items-center justify-center gap-2 text-rose-600 font-medium">
                  <IconCheckCircle size={22} className="text-rose-500" />
                  Réponses validées
                </p>
              )}
            </>
          )}
          <Button variant="secondary" onClick={() => navigate('/souvenirs')} className="w-full">
            Retour aux souvenirs
          </Button>
        </div>
      </Card>
    </div>
  )
}
