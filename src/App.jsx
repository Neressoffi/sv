import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Souvenirs from './pages/Souvenirs'
import AddSouvenir from './pages/AddSouvenir'
import SouvenirQuiz from './pages/SouvenirQuiz'
import VerifyAnswers from './pages/VerifyAnswers'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-rose-500">Chargement...</span>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/souvenirs"
        element={
          <ProtectedRoute>
            <Souvenirs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/souvenirs/new"
        element={
          <ProtectedRoute>
            <AddSouvenir />
          </ProtectedRoute>
        }
      />
      <Route
        path="/souvenirs/:id/quiz"
        element={
          <ProtectedRoute>
            <SouvenirQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/souvenirs/:id/verify"
        element={
          <ProtectedRoute>
            <VerifyAnswers />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
