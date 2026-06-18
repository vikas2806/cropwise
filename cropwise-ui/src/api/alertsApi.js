import api from './axiosInstance'
import { USE_MOCK, mockAlerts } from '../mocks'

export const getAlerts = async () => {
  if (USE_MOCK) return mockAlerts
  const res = await api.get('/alerts')
  return res.data
}
