import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useMapLayer } from '../../hooks/useMapLayer'
import useAppStore from '../../store/useAppStore'

function getColor(feature, activeLayer) {
  if (activeLayer === 'crop-type') {
    const colors = { Rice: '#1D9E75', Cotton: '#378ADD',
                     Wheat: '#EF9F27', Soybean: '#639922' }
    return colors[feature.properties.crop_type] || '#888780'
  }
  if (activeLayer === 'stress') {
    const colors = { None: '#639922', Mild: '#EF9F27',
                     Moderate: '#BA7517', Severe: '#E24B4A' }
    return colors[feature.properties.stress_class] || '#888780'
  }
  if (activeLayer === 'advisory') {
    const colors = { 'No Action': '#639922',
                     'Irrigate Soon': '#EF9F27',
                     'Irrigate Now': '#E24B4A' }
    return colors[feature.properties.advisory] || '#888780'
  }
  return '#888780'
}

export default function MapPanel() {
  const activeLayer = useAppStore((s) => s.activeLayer)
  const selectedDate = useAppStore((s) => s.selectedDate)
  const selectedFieldId = useAppStore((s) => s.selectedFieldId)
  const setSelectedFieldId = useAppStore((s) => s.setSelectedFieldId)

  const { data, isLoading, isError, error, refetch } = useMapLayer()

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        setSelectedFieldId(feature.properties.field_id)
      },
    })
  }

  const style = (feature) => ({
    fillColor: getColor(feature, activeLayer),
    fillOpacity: 0.65,
    color: '#ffffff',
    weight: selectedFieldId === feature.properties.field_id ? 3 : 1.5,
    opacity: 1,
  })

  // We change the key to force react-leaflet's GeoJSON to redraw when activeLayer, selectedFieldId, or selectedDate changes.
  const geojsonKey = `${activeLayer}-${selectedDate}-${selectedFieldId}-${data ? data.features.length : 0}`

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 z-[1000] bg-white/80 flex items-center justify-center animate-fade-in">
          <span className="text-[#0F6E56] font-semibold text-lg animate-pulse">
            Loading map...
          </span>
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 z-[1000] bg-white/90 flex flex-col items-center justify-center p-4">
          <div className="text-sm text-red-600 bg-red-50 rounded-lg p-4 max-w-md text-center">
            <p>{error?.message || 'Error loading map layers'}</p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-red-700 underline text-xs font-semibold focus:outline-none"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <MapContainer
        center={[21.12, 78.99]}
        zoom={11}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data && (
          <GeoJSON
            key={geojsonKey}
            data={data}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  )
}
