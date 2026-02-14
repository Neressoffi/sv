import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getSouvenir, getAnswer, setAnswers } from '../lib/souvenirs'
import { getPhotoUrl } from '../api/client'
import Card from '../components/Card'
import Button from '../components/Button'

export default function SouvenirQuiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [souvenir, setSouvenir] = useState(null)
  const [answers, setAnswersState] = useState({})
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    getSouvenir(id).then((s) => {
      setSouvenir(s)
      if (!s) setLoading(false)
    })
    getAnswer(id).then((a) => {
      if (a?.answers) setAnswersState(a.answers)
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await setAnswers(id, answers)
      navigate('/souvenirs')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="py-12 text-center text-rose-500">Chargement...</div>
  if (!souvenir) return <div className="py-12 text-center text-rose-600">Souvenir introuvable.</div>

  const questions = souvenir.questions || []

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-rose-800">Quiz souvenir</h1>
      <Card className="p-0 overflow-hidden">
        <img
          src={getPhotoUrl(souvenir.photoURL)}
          alt="Souvenir"
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="p-4">
          <p className="text-sm text-pink-600 mb-4">
            Réponds aux questions de ton partenaire. Il ou elle vérifiera tes réponses ensuite.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {questions.map((q, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-rose-800 mb-1">
                  {q.text}
                </label>
                <input
                  type="text"
                  value={answers[i] ?? ''}
                  onChange={(e) => setAnswersState((a) => ({ ...a, [i]: e.target.value }))}
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 text-rose-900 focus:ring-2 focus:ring-rose-400 outline-none"
                  placeholder="Ta réponse..."
                />
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? 'Envoi...' : 'Envoyer mes réponses'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
