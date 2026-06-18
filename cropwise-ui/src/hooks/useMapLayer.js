import { useQuery } from '@tanstack/react-query'
import { getCropTypeLayer, getStressLayer, getAdvisoryLayer } from '../api/mapsApi'
import useAppStore from '../store/useAppStore'

export const useMapLayer = () => {
  const activeLayer = useAppStore((s) => s.activeLayer)
  const selectedDate = useAppStore((s) => s.selectedDate)

  return useQuery({
    queryKey: ['mapLayer', activeLayer, selectedDate],
    queryFn: () => {
      if (activeLayer === 'crop-type') return getCropTypeLayer()
      if (activeLayer === 'stress')    return getStressLayer(selectedDate)
      if (activeLayer === 'advisory')  return getAdvisoryLayer(selectedDate)
    },
    staleTime: 5 * 60 * 1000,
  })
}
