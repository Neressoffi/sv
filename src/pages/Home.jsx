import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'
import { IconHeart, IconImages, IconPlusCircle, IconSparkles } from '../components/Icons'

export default function Home() {
  const { user, profile } = useAuth()
  const hasPartner = profile?.partnerEmail?.trim()

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-rose-800 flex items-center justify-center gap-2 flex-wrap">
          <IconHeart size={28} className="text-rose-500" />
          Bonjour, {profile?.displayName || user?.email?.split('@')[0] || 'toi'}
        </h1>
        <p className="text-pink-600 mt-1">Retrouvez vos souvenirs et quiz d'amour</p>
      </div>

      {!hasPartner && (
        <Card className="p-4 bg-amber-50/80 border-amber-200">
          <p className="text-amber-800 text-sm">
            Ajoutez l'email de votre partenaire dans <Link to="/profile" className="font-medium underline">Profil</Link> pour lui envoyer des souvenirs et des quiz.
          </p>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/souvenirs">
          <Card className="p-6 text-center hover:shadow-xl transition-all duration-200 active:scale-[0.99]">
            <IconImages size={40} className="mx-auto mb-2 text-rose-500" />
            <h2 className="font-semibold text-rose-800">Partie Souvenirs</h2>
            <p className="text-sm text-pink-600 mt-1">Voir et gérer vos photos souvenirs</p>
          </Card>
        </Link>
        <Link to="/souvenirs/new">
          <Card className="p-6 text-center hover:shadow-xl transition-all duration-200 active:scale-[0.99]">
            <IconPlusCircle size={40} className="mx-auto mb-2 text-rose-500" />
            <h2 className="font-semibold text-rose-800">Ajouter un souvenir</h2>
            <p className="text-sm text-pink-600 mt-1">Photo + questions pour ta moitié</p>
          </Card>
        </Link>
      </div>

      <Card className="p-6 border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50">
        <h2 className="font-semibold text-rose-800 flex items-center gap-2">
          <IconSparkles size={22} className="text-rose-500" />
          Comment ça marche ?
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-rose-700 list-decimal list-inside">
          <li>Charge une photo de vous deux (ou d’elle) dans <strong>Souvenirs</strong>.</li>
          <li>Ajoute des questions : « Te rappelles-tu ce moment ? », « Où était cette photo ? », etc.</li>
          <li>Ta partenaire reçoit le souvenir et répond au questionnaire.</li>
          <li>Tu vérifies ses réponses et tu peux la féliciter si tout est bon.</li>
        </ol>
        <Link to="/souvenirs/new" className="mt-4 inline-block">
          <Button>Créer mon premier souvenir</Button>
        </Link>
      </Card>
    </div>
  )
}
