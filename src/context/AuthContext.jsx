import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('souvenirs_token')
    if (!token) {
      setLoading(false)
      return
    }
    authApi.getMe()
      .then((data) => {
        setUser({ id: data.id, email: data.email })
        setProfile({
          displayName: data.displayName,
          partnerEmail: data.partnerEmail || '',
        })
      })
      .catch(() => {
        localStorage.removeItem('souvenirs_token')
      })
      .finally(() => setLoading(false))
  }, [])

  const signUp = async (email, password, displayName) => {
    const data = await authApi.register(email, password, displayName)
    setUser({ id: data.id, email: data.email })
    setProfile({
      displayName: data.displayName,
      partnerEmail: data.partnerEmail || '',
    })
    return data
  }

  const signIn = async (email, password) => {
    const data = await authApi.login(email, password)
    setUser({ id: data.id, email: data.email })
    setProfile({
      displayName: data.displayName,
      partnerEmail: data.partnerEmail || '',
    })
    return data
  }

  const signOut = () => {
    authApi.logout()
    setUser(null)
    setProfile(null)
  }

  const updateUserProfile = async (data) => {
    const updated = await authApi.updateProfile(data)
    setProfile({
      displayName: updated.displayName,
      partnerEmail: updated.partnerEmail || '',
    })
    return updated
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateUserProfile,
        isConfigured: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
