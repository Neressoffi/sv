export const API_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : import.meta.env.DEV
      ? ''
      : 'http://localhost:3001'

/** Pour afficher une photo stockée sur le serveur (photoURL commence par /uploads/). */
export function getPhotoUrl(photoURL) {
  if (!photoURL) return ''
  if (photoURL.startsWith('http')) return photoURL
  return API_URL + photoURL
}

function getToken() {
  return localStorage.getItem('souvenirs_token')
}

export function setToken(token) {
  if (token) localStorage.setItem('souvenirs_token', token)
  else localStorage.removeItem('souvenirs_token')
}

export async function api(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`
  const headers = { ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(url, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || 'Erreur')
    err.status = res.status
    err.code = data.code
    throw err
  }
  return data
}

export function apiUpload(path, formData, method = 'POST') {
  const token = getToken()
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  return fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: formData,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = new Error(data.error || res.statusText)
      err.status = res.status
      throw err
    }
    return data
  })
}
