import { useNavigate } from 'react-router-dom'
import MapPanel from '../components/map/MapPanel'
import LayerToggle from '../components/map/LayerToggle'
import MapLegend from '../components/map/MapLegend'
import HealthBar from '../components/advisory/HealthBar'
import StressMetrics from '../components/advisory/StressMetrics'
import AdvisoryCard from '../components/advisory/AdvisoryCard'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import { useAdvisory } from '../hooks/useFieldData'
import useAppStore from '../store/useAppStore'

export default function MapExplorer() {
  const navigate = useNavigate()
  const selectedFieldId = useAppStore((s) => s.selectedFieldId)
  const setSelectedFieldId = useAppStore((s) => s.setSelectedFieldId)

  const { data: advisory, isLoading, isError, error, refetch } = useAdvisory(selectedFieldId)

  return (
    <div className="flex" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Map area */}
      <div className="flex-1 relative overflow-hidden">
        <MapPanel />
        <LayerToggle />
        <MapLegend />
      </div>

      {/* Right sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto p-5 flex-shrink-0">
        {selectedFieldId === null ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <span className="text-5xl mb-3">🗺</span>
            <p className="font-medium text-gray-600 text-base">Select a field</p>
            <p className="text-sm mt-1 text-gray-400">
              Click any field on the map to see crop details, stress metrics, and irrigation advice.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {isLoading && (
              <>
                <Skeleton height="80px" className="rounded-xl" />
                <Skeleton height="120px" className="rounded-xl" />
                <Skeleton height="150px" className="rounded-xl" />
              </>
            )}

            {isError && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg p-4">
                <p>{error?.message || 'Failed to load advisory data.'}</p>
                <button onClick={() => refetch()} className="mt-2 text-red-700 underline text-xs">
                  Retry
                </button>
              </div>
            )}

            {advisory && !isLoading && (
              <>
                {/* Field header */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h2 className="text-base font-semibold text-gray-800">{advisory.zone_name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge label={advisory.crop_type} variant={advisory.crop_type?.toLowerCase()} />
                    <span className="text-sm text-gray-500">{advisory.area_ha?.toLocaleString()} ha</span>
                    <span className="text-sm text-gray-500">· {advisory.growth_stage}</span>
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

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="secondary"
                    onClick={() => navigator.clipboard.writeText(advisory.advisory_text ?? '')}
                  >
                    Copy advisory
                  </Button>
                  <Button onClick={() => navigate(`/field/${selectedFieldId}`)}>
                    Full detail →
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
