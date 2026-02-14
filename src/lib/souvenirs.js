import * as api from '../api/souvenirs.js'

export async function createSouvenir({ forPartnerEmail, photoFile, questions }) {
  return api.createSouvenir({ forPartnerEmail, photoFile, questions })
}

export async function getMySouvenirs() {
  return api.getMySouvenirs()
}

export async function getSouvenirsForPartner() {
  return api.getSouvenirsReceived()
}

export async function getSouvenir(id) {
  return api.getSouvenir(id)
}

export async function setAnswers(souvenirId, answers) {
  return api.setAnswers(souvenirId, answers)
}

export async function getAnswer(souvenirId) {
  const data = await api.getAnswer(souvenirId)
  if (!data) return null
  return {
    answers: data.answers,
    answeredAt: data.answeredAt,
    verifiedByCreator: data.verifiedByCreator,
  }
}

export async function setVerified(souvenirId) {
  return api.setVerified(souvenirId)
}
