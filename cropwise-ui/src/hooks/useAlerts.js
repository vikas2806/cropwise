import { useQuery } from '@tanstack/react-query'
import { getAlerts } from '../api/alertsApi'

export const useAlerts = () =>
  useQuery({
    queryKey: ['alerts'],
    queryFn: getAlerts,
    staleTime: 2 * 60 * 1000,
  })
