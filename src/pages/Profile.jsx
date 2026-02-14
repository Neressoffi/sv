import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'
import { IconCheckCircle } from '../components/Icons'

export default function Profile() {
  const { user, profile, updateUserProfile } = useAuth()
  const [partnerEmail, setPartnerEmail] = useState(profile?.partnerEmail || '')
  const [saved, setSaved] = useState(false)
  const [emailSent, setEmailSent] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [appLink, setAppLink] = useState('')

  useEffect(() => {
    setAppLink(window.location.origin)
  }, [])

  const copyLink = () => {
    if (!appLink) return
    navigator.clipboard.writeText(appLink).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  useEffect(() => {
    setPartnerEmail(profile?.partnerEmail || '')
  }, [profile?.partnerEmail])

  const handleSave = async () => {
    setLoading(true)
    setEmailSent(null)
    setEmailError(null)
    try {
      const result = await updateUserProfile({ partnerEmail: partnerEmail.trim() })
      setSaved(true)
      if (result?.emailSent === true) setEmailSent(true)
      else if (partnerEmail.trim() && result?.hasOwnProperty('emailSent')) {
        setEmailSent(false)
        if (result?.emailError) setEmailError(result.emailError)
      }
      setTimeout(() => { setSaved(false); setEmailSent(null); setEmailError(null) }, 6000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-rose-800">Mon profil</h1>
      <Card className="p-6">
        <p className="text-sm text-pink-600 mb-4">
          Indiquez l’email de votre partenaire. Les souvenirs que vous créez lui seront proposés pour qu’elle réponde aux questions.
        </p>
        <div>
          <label className="block text-sm font-medium text-rose-800 mb-1">Email de ta moitié</label>
          <input
            type="email"
            value={partnerEmail}
            onChange={(e) => setPartnerEmail(e.target.value)}
            className="w-full rounded-xl border border-pink-200 px-4 py-3 text-rose-900 placeholder-pink-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none"
            placeholder="partenaire@exemple.com"
          />
        </div>
        <Button className="mt-4 flex items-center justify-center gap-2" onClick={handleSave} disabled={loading}>
          {loading ? 'Enregistrement...' : saved ? (
            <>
              <IconCheckCircle size={20} />
              Enregistré
            </>
          ) : (
            'Enregistrer'
          )}
        </Button>
        {saved && emailSent === true && (
          <p className="mt-3 text-sm text-green-700 bg-green-50 rounded-xl p-3">
            Un email a été envoyé à ta partenaire pour l’inviter à rejoindre l’application.
          </p>
        )}
        {saved && emailSent === false && (
          <p className="mt-3 text-sm text-amber-800 bg-amber-50 rounded-xl p-3">
            Profil enregistré. L’email automatique n’a pas été envoyé. Utilise le lien ci-dessous pour inviter ta partenaire.
          </p>
        )}

        <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200">
          <p className="text-sm font-medium text-rose-800 mb-2">Méthode simple : envoie ce lien à ta partenaire</p>
          <p className="text-xs text-rose-600 mb-2">Elle pourra s’inscrire ou se connecter et voir les quiz dans Souvenirs.</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-rose-700 bg-white px-3 py-2 rounded-lg border border-rose-200 truncate max-w-full flex-1 min-w-0" title={appLink}>
              {appLink || '...'}
            </span>
            <Button variant="secondary" className="shrink-0" onClick={copyLink}>
              {linkCopied ? '✓ Copié !' : 'Copier le lien'}
            </Button>
          </div>
        </div>
      </Card>
      <p className="text-sm text-pink-500">Connecté : {user?.email}</p>
    </div>
  )
}
