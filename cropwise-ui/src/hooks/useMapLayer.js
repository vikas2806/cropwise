import { useQuery } from '@tanstack/react-query'
import { mockGeoJson } from '../mocks'
import useAppStore from '../store/useAppStore'

export const useMapLayer = () => {
  const activeLayer = useAppStore((s) => s.activeLayer)

  return useQuery({
    queryKey: ['mapLayer', activeLayer],
    queryFn: async () => {
      return mockGeoJson[activeLayer] || mockGeoJson['cropType']
    },
    staleTime: 5 * 60 * 1000,
  })
}
