import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Card from '../components/Card'
import { IconHeart } from '../components/Icons'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, isConfigured } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError(err.code === 'auth/invalid-credential' ? 'Email ou mot de passe incorrect.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {!isConfigured && (
          <div className="mb-4 p-4 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-sm">
            <strong>Firebase non configuré.</strong> Copiez <code className="bg-amber-200 px-1 rounded">.env.example</code> en <code className="bg-amber-200 px-1 rounded">.env</code> et remplissez les clés de votre projet Firebase. Redémarrez <code className="bg-amber-200 px-1 rounded">npm run dev</code>.
          </div>
        )}
        <div className="text-center mb-8">
          <IconHeart size={56} className="mx-auto text-rose-500" />
          <h1 className="text-2xl font-bold text-rose-800 mt-3">Souvenirs à Deux</h1>
          <p className="text-pink-600 mt-1">Connectez-vous pour retrouver vos souvenirs</p>
        </div>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
                {error}
              </div>
            )}
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
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-rose-900 placeholder-pink-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !isConfigured}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-pink-600">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-medium text-rose-600 hover:underline">
              S'inscrire
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
