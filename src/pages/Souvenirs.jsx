import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getMySouvenirs,
  getSouvenirsForPartner,
  getAnswer,
} from '../lib/souvenirs'
import { getPhotoUrl } from '../api/client'
import Card from '../components/Card'
import { IconInbox, IconImages, IconPlusCircle, IconCheck } from '../components/Icons'

export default function Souvenirs() {
  const { user, profile } = useAuth()
  const [mySouvenirs, setMySouvenirs] = useState([])
  const [received, setReceived] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    Promise.all([getMySouvenirs(), getSouvenirsForPartner()])
      .then(([my, recv]) => {
        setMySouvenirs(my)
        setReceived(recv)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="text-rose-500">Chargement...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-rose-800">Partie Souvenirs</h1>

      {received.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-pink-700 mb-3 flex items-center gap-2">
            <IconInbox size={22} className="text-rose-500" />
            Reçus pour toi (réponds au quiz)
          </h2>
          <ul className="space-y-3">
            {received.map((s) => (
              <SouvenirCard key={s.id} souvenir={s} received />
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-pink-700 mb-3 flex items-center gap-2">
          <IconImages size={22} className="text-rose-500" />
          Mes souvenirs créés
        </h2>
        {mySouvenirs.length === 0 ? (
          <Card className="p-6 text-center text-pink-600">
            Aucun souvenir pour l’instant. Ajoute une photo et des questions pour ta moitié.
            <Link to="/souvenirs/new" className="flex items-center justify-center gap-1.5 mt-3 text-rose-600 font-medium">
              <IconPlusCircle size={18} />
              Ajouter un souvenir
            </Link>
          </Card>
        ) : (
          <ul className="space-y-3">
            {mySouvenirs.map((s) => (
              <SouvenirCard key={s.id} souvenir={s} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function SouvenirCard({ souvenir, received }) {
  const [answer, setAnswer] = useState(null)
  useEffect(() => {
    if (souvenir.id) {
      getAnswer(souvenir.id).then(setAnswer).catch(() => setAnswer(null))
    }
  }, [souvenir.id])

  const hasAnswers = answer?.answers && Object.keys(answer.answers).length > 0
  const verified = answer?.verifiedByCreator

  return (
    <Link to={received ? `/souvenirs/${souvenir.id}/quiz` : `/souvenirs/${souvenir.id}/verify`}>
      <Card className="p-0 overflow-hidden flex flex-row gap-0">
        <div className="w-24 h-24 flex-shrink-0 bg-pink-100">
          <img
            src={getPhotoUrl(souvenir.photoURL)}
            alt="Souvenir"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3 flex-1 min-w-0">
          <p className="text-sm text-rose-800 font-medium truncate">
            {souvenir.questions?.length || 0} question(s)
          </p>
          <p className="text-xs text-pink-500 mt-0.5 flex items-center gap-1">
            {verified && <IconCheck size={14} className="text-rose-500 shrink-0" />}
            {received
              ? hasAnswers
                ? verified
                  ? 'Vérifié par ton partenaire'
                  : 'Réponses envoyées'
                : 'À répondre'
              : hasAnswers
                ? 'Voir les réponses'
                : 'En attente de réponses'}
          </p>
        </div>
      </Card>
    </Link>
  )
}
