import { useQuery } from '@tanstack/react-query'
import api from '../api/axiosInstance'
import { USE_MOCK } from '../mocks'

const LAYER_ENDPOINTS = {
  'crop-type': '/tiles/crop-type',
  'stress':    '/tiles/stress',
  'ndvi':      '/tiles/ndvi',
}

export const useTileLayer = (activeLayer) =>
  useQuery({
    queryKey: ['tileLayer', activeLayer],
    queryFn: async () => {
      if (USE_MOCK) return null
      const endpoint = LAYER_ENDPOINTS[activeLayer]
      if (!endpoint) return null
      const res = await api.get(endpoint)
      return res.data
    },
    staleTime: 60 * 60 * 1000,
    enabled: !USE_MOCK,
  })
