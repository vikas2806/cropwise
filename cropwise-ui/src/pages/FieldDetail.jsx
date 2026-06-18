import { useParams, useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import NdviChart from '../components/charts/NdviChart'
import WaterBalanceChart from '../components/charts/WaterBalanceChart'
import StressIndexChart from '../components/charts/StressIndexChart'
import ChartSkeleton from '../components/charts/ChartSkeleton'
import AdvisoryCard from '../components/advisory/AdvisoryCard'
import StressMetrics from '../components/advisory/StressMetrics'
import HealthBar from '../components/advisory/HealthBar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import { useTimeseries, useAdvisory } from '../hooks/useFieldData'

export default function FieldDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fieldId = parseInt(id, 10)

  const { data: timeseries, isLoading: tsLoading, isError: tsError, error: tsErr, refetch: tsRefetch } = useTimeseries(fieldId)
  const { data: advisory, isLoading: advLoading, isError: advError, error: advErr, refetch: advRefetch } = useAdvisory(fieldId)

  const isLoading = tsLoading || advLoading

  const handleExportJSON = () => {
    const payload = { field_id: fieldId, advisory, timeseries }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cropwise-field-${fieldId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const historyRows = timeseries ? [...timeseries].reverse().slice(0, 30) : []

  return (
    <PageWrapper title={advisory?.zone_name ?? `Field ${fieldId} Detail`}>
      <div className="grid grid-cols-3 gap-6">
        {/* LEFT — charts */}
        <div className="col-span-2 space-y-4">
          {isLoading ? (
            <>
              <div className="bg-white rounded-xl border border-gray-200 p-4"><ChartSkeleton /></div>
              <div className="bg-white rounded-xl border border-gray-200 p-4"><ChartSkeleton /></div>
              <div className="bg-white rounded-xl border border-gray-200 p-4"><ChartSkeleton /></div>
            </>
          ) : tsError ? (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg p-4">
              <p>{tsErr?.message}</p>
              <button onClick={() => tsRefetch()} className="mt-2 text-red-700 underline text-xs">Retry</button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <NdviChart data={timeseries ?? []} />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <WaterBalanceChart data={timeseries ?? []} />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <StressIndexChart data={timeseries ?? []} />
              </div>
            </>
          )}
        </div>

        {/* RIGHT — sidebar */}
        <div className="col-span-1 space-y-4 sticky top-0">
          {advLoading ? (
            <>
              <Skeleton height="80px" className="rounded-xl" />
              <Skeleton height="100px" className="rounded-xl" />
              <Skeleton height="140px" className="rounded-xl" />
            </>
          ) : advError ? (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg p-4">
              <p>{advErr?.message}</p>
              <button onClick={() => advRefetch()} className="mt-2 text-red-700 underline text-xs">Retry</button>
            </div>
          ) : advisory ? (
            <>
              {/* Field header */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h2 className="font-semibold text-gray-800">{advisory.zone_name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge label={advisory.crop_type} variant={advisory.crop_type?.toLowerCase()} />
                  <span className="text-sm text-gray-500">{advisory.area_ha?.toLocaleString()} ha</span>
                </div>
              </div>
              <HealthBar ndvi={advisory.ndvi} growth_stage={advisory.growth_stage} />
              <StressMetrics
                soil_moisture_pct={advisory.soil_moisture_pct}
                rainfall_mm={advisory.rainfall_mm}
                days_since_rain={advisory.days_since_rain}
                stress_class={advisory.stress_class}
              />
              <AdvisoryCard advisory={advisory} />
              <div className="flex flex-col gap-2">
                <Button variant="secondary" onClick={handleExportJSON}>
                  Export JSON
                </Button>
                <Button variant="secondary" onClick={() => navigate('/map')}>
                  ← Back to map
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Advisory history table */}
      {historyRows.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Advisory history (last 30 days)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <th className="pb-2 font-medium pr-4">Date</th>
                  <th className="pb-2 font-medium pr-4">Growth Stage</th>
                  <th className="pb-2 font-medium pr-4">Stress</th>
                  <th className="pb-2 font-medium">Deficit (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historyRows.map((row) => (
                  <tr key={row.obs_date} className="hover:bg-gray-50">
                    <td className="py-2 pr-4 font-mono text-xs text-gray-600">{row.obs_date}</td>
                    <td className="py-2 pr-4 text-gray-600">{row.growth_stage}</td>
                    <td className="py-2 pr-4">
                      <Badge label={row.stress_class} variant={row.stress_class?.toLowerCase()} />
                    </td>
                    <td className="py-2 text-gray-600">{row.deficit_mm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
