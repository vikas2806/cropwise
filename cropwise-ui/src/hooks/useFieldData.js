import { useQuery } from '@tanstack/react-query'
import { getTimeseries, getAdvisory } from '../api/fieldsApi'

export const useTimeseries = (fieldId) =>
  useQuery({
    queryKey: ['timeseries', fieldId],
    queryFn: () => getTimeseries(fieldId),
    enabled: !!fieldId,
    staleTime: 5 * 60 * 1000,
  })

export const useAdvisory = (fieldId) =>
  useQuery({
    queryKey: ['advisory', fieldId],
    queryFn: () => getAdvisory(fieldId),
    enabled: !!fieldId,
    staleTime: 5 * 60 * 1000,
  })
