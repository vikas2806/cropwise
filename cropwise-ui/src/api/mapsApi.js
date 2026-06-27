import api from './axiosInstance'
import { USE_MOCK, mockGeoJson } from '../mocks'

export const getCropTypeLayer = async () => {
  if (USE_MOCK) return mockGeoJson.cropType
  const res = await api.get('/tiles/crop-type')
  return res.data
}

export const getStressLayer = async (date) => {
  if (USE_MOCK) return mockGeoJson.stress
  const res = await api.get(`/tiles/stress?date=${date}`)
  return res.data
}

export const getAdvisoryLayer = async (date) => {
  if (USE_MOCK) return mockGeoJson.advisory
  const res = await api.get(`/fields/${date}/advisory`)
  return res.data
}
