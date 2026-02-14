import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Card from '../components/Card'
import { IconHeart } from '../components/Icons'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, displayName)
      navigate('/')
    } catch (err) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'Cet email est déjà utilisé.'
          : err.code === 'auth/weak-password'
            ? 'Le mot de passe doit faire au moins 6 caractères.'
            : err.message
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <IconHeart size={56} className="mx-auto text-rose-500" />
          <h1 className="text-2xl font-bold text-rose-800 mt-3">Créer un compte</h1>
          <p className="text-pink-600 mt-1">Rejoignez Souvenirs à Deux</p>
        </div>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-1">Prénom ou pseudo</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-rose-900 placeholder-pink-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none"
                placeholder="Marie"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-rose-900 placeholder-pink-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none"
                placeholder="vous@exemple.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-rose-900 placeholder-pink-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none"
                placeholder="••••••••"
              />
              <p className="text-xs text-pink-500 mt-1">Au moins 6 caractères</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Inscription...' : "S'inscrire"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-pink-600">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-rose-600 hover:underline">
              Se connecter
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
