import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  IconHeart,
  IconHome,
  IconImages,
  IconPlusCircle,
  IconUser,
  IconLogOut,
} from './Icons'

const navItems = [
  { to: '/', label: 'Accueil', Icon: IconHome },
  { to: '/souvenirs', label: 'Souvenirs', Icon: IconImages },
  { to: '/souvenirs/new', label: 'Ajouter', Icon: IconPlusCircle },
  { to: '/profile', label: 'Profil', Icon: IconUser },
]

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-200/60 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-pink-700 font-semibold text-lg transition-opacity hover:opacity-90 active:opacity-80"
          >
            <IconHeart size={26} className="text-rose-500" />
            <span>Souvenirs à Deux</span>
          </Link>
          {user && (
            <button
              type="button"
              onClick={() => signOut()}
              className="flex items-center gap-1.5 text-sm text-pink-600 hover:text-pink-800 touch-target px-2 transition-colors"
            >
              <IconLogOut size={18} />
              Déconnexion
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {children}
      </main>

      {user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-pink-200/60 safe-area-pb z-50">
          <div className="max-w-lg mx-auto flex justify-around py-2">
            {navItems.map(({ to, label, Icon }) => {
              const isActive =
                location.pathname === to ||
                (to !== '/' && location.pathname.startsWith(to))
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center gap-1 py-2.5 px-4 rounded-xl touch-target transition-all duration-200 ${
                    isActive
                      ? 'text-rose-600 bg-rose-50 scale-[1.02]'
                      : 'text-gray-500 hover:text-rose-500 hover:bg-rose-50/50'
                  }`}
                >
                  <Icon
                    size={24}
                    strokeWidth={isActive ? 2 : 1.75}
                    className="transition-transform duration-200"
                  />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
