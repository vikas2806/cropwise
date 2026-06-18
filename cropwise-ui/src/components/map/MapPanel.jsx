import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'
import { useMapLayer } from '../../hooks/useMapLayer'
import useAppStore from '../../store/useAppStore'

// Fix Leaflet default marker icons broken by Vite's asset bundling
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function getColor(feature, activeLayer) {
  if (activeLayer === 'crop-type') {
    const colors = { Rice: '#1D9E75', Cotton: '#378ADD', Wheat: '#EF9F27', Soybean: '#639922' }
    return colors[feature.properties.crop_type] || '#888780'
  }
  if (activeLayer === 'stress') {
    const colors = { None: '#639922', Mild: '#EF9F27', Moderate: '#BA7517', Severe: '#E24B4A' }
    return colors[feature.properties.stress_class] || '#888780'
  }
  if (activeLayer === 'advisory') {
    const colors = { 'No Action': '#639922', 'Irrigate Soon': '#EF9F27', 'Irrigate Now': '#E24B4A' }
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

  const mapContainerRef = useRef(null) // DOM div ref
  const mapRef = useRef(null)          // L.Map instance
  const geoLayerRef = useRef(null)     // current GeoJSON layer

  // --- Initialise Leaflet map imperatively (no react-leaflet) ---
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) return // already initialised (StrictMode double-run guard)

    const map = L.map(mapContainerRef.current, {
      center: [21.12, 78.99],
      zoom: 11,
      zoomControl: true,
    })

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    ).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // --- Render / re-render GeoJSON layer whenever data or activeLayer changes ---
  useEffect(() => {
    const map = mapRef.current
    if (!map || !data) return

    // Remove old layer
    if (geoLayerRef.current) {
      map.removeLayer(geoLayerRef.current)
      geoLayerRef.current = null
    }

    const layer = L.geoJSON(data, {
      style: (feature) => ({
        fillColor: getColor(feature, activeLayer),
        fillOpacity: 0.65,
        color: '#ffffff',
        weight: selectedFieldId === feature.properties.field_id ? 3.5 : 1.5,
        opacity: 1,
      }),
      onEachFeature: (feature, featureLayer) => {
        featureLayer.on({
          click: () => {
            setSelectedFieldId(feature.properties.field_id)
          },
          mouseover: (e) => {
            e.target.setStyle({ fillOpacity: 0.9, weight: 2.5 })
          },
          mouseout: (e) => {
            layer.resetStyle(e.target)
          },
        })
        featureLayer.bindTooltip(
          `<b>${feature.properties.zone_name}</b><br/>${feature.properties.crop_type}`,
          { sticky: true, className: 'cropwise-tooltip' }
        )
      },
    })

    layer.addTo(map)
    geoLayerRef.current = layer
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, activeLayer, selectedFieldId])

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[1000] bg-white/80 flex items-center justify-center">
          <span className="text-[#0F6E56] font-semibold text-lg animate-pulse">
            Loading map…
          </span>
        </div>
      )}

      {/* Error overlay */}
      {isError && (
        <div className="absolute inset-0 z-[1000] bg-white/90 flex flex-col items-center justify-center p-4">
          <div className="text-sm text-red-600 bg-red-50 rounded-lg p-4 max-w-md text-center">
            <p>{error?.message || 'Error loading map layers'}</p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-red-700 underline text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Leaflet mount point */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  )
}
