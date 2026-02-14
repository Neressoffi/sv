import { api, apiUpload } from './client.js'

export async function createSouvenir({ forPartnerEmail, photoFile, questions }) {
  const form = new FormData()
  form.append('photo', photoFile)
  form.append('forPartnerEmail', forPartnerEmail.trim())
  form.append('questions', JSON.stringify(questions))
  return apiUpload('/api/souvenirs', form)
}

export async function getMySouvenirs() {
  return api('/api/souvenirs/mine')
}

export async function getSouvenirsReceived() {
  return api('/api/souvenirs/received')
}

export async function getSouvenir(id) {
  return api('/api/souvenirs/' + id)
}

export async function setAnswers(souvenirId, answers) {
  return api('/api/souvenirs/' + souvenirId + '/answers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  })
}

export async function getAnswer(souvenirId) {
  return api('/api/souvenirs/' + souvenirId + '/answers')
}

export async function setVerified(souvenirId) {
  return api('/api/souvenirs/' + souvenirId + '/answers/verify', { method: 'PUT' })
}
