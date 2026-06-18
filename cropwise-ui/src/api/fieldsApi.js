import api from './axiosInstance'
import { USE_MOCK, mockTimeseries, mockAdvisory } from '../mocks'

export const getTimeseries = async (fieldId) => {
  if (USE_MOCK) return mockTimeseries[fieldId] ?? mockTimeseries.default
  const res = await api.get(`/fields/${fieldId}/timeseries`)
  return res.data
}

export const getAdvisory = async (fieldId) => {
  if (USE_MOCK) return mockAdvisory[fieldId] ?? mockAdvisory.default
  const res = await api.get(`/fields/${fieldId}/advisory`)
  return res.data
}
