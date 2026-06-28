import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Rectangle, useMap, Popup, CircleMarker } from 'react-leaflet';
import { LayerType } from '../types';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  activeLayer: LayerType;
  opacity: number;
}

// Component to update map when props change
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Simulated data points for different layers
interface DataPoint {
  lat: number;
  lng: number;
  value: number;
  label: string;
}

const generateDataPoints = (layer: LayerType): DataPoint[] => {
  // Base locations across Maharashtra
  const baseLocations = [
    { lat: 19.9, lng: 75.3, region: 'Aurangabad' },
    { lat: 18.5, lng: 73.9, region: 'Pune' },
    { lat: 21.1, lng: 79.1, region: 'Nagpur' },
    { lat: 19.2, lng: 77.3, region: 'Nanded' },
    { lat: 17.7, lng: 75.9, region: 'Solapur' },
    { lat: 20.9, lng: 77.0, region: 'Amravati' },
    { lat: 16.7, lng: 74.2, region: 'Kolhapur' },
    { lat: 19.9, lng: 73.8, region: 'Nashik' },
    { lat: 18.2, lng: 76.0, region: 'Latur' },
    { lat: 20.4, lng: 78.1, region: 'Yavatmal' },
    { lat: 17.3, lng: 76.8, region: 'Bidar' },
    { lat: 19.3, lng: 76.5, region: 'Jalna' },
  ];

  return baseLocations.map((loc, idx) => {
    // Generate pseudo-random but consistent values based on layer and index
    const seed = idx * 17 + layer.length;
    let value: number;
    let label: string;

    switch (layer) {
      case 'Moisture Stress (WSI)':
        value = ((seed % 100) / 100);
        label = `WSI: ${value.toFixed(2)}`;
        break;
      case 'Crop Types':
        value = seed % 6;
        const cropTypes = ['Fallow', 'Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Vegetables'];
        label = cropTypes[value];
        break;
      case 'Crop Health (NDVI)':
        value = 0.3 + ((seed % 50) / 100);
        label = `NDVI: ${value.toFixed(2)}`;
        break;
      case 'Water Deficit (mm)':
        value = (seed % 60);
        label = `Deficit: ${value}mm`;
        break;
      case 'Irrigation Amount (mm)':
        value = (seed % 70);
        label = `Irrigation: ${value}mm`;
        break;
      case 'Irrigation Advisory':
        value = seed % 5;
        const advisories = ['No Action', 'Monitor', 'Schedule', 'Irrigate', 'Emergency'];
        label = `Level ${value}: ${advisories[value]}`;
        break;
      default:
        value = 0.5;
        label = 'N/A';
    }

    return {
      lat: loc.lat + (Math.sin(seed) * 0.3),
      lng: loc.lng + (Math.cos(seed) * 0.3),
      value,
      label: `${loc.region}: ${label}`,
    };
  });
};

const getColorForValue = (layer: LayerType, value: number): string => {
  switch (layer) {
    case 'Moisture Stress (WSI)':
      if (value < 0.2) return '#22C55E';
      if (value < 0.4) return '#EAB308';
      if (value < 0.6) return '#F97316';
      if (value < 0.8) return '#EF4444';
      return '#7C3AED';
    case 'Crop Types':
      const cropColors = ['#8B4513', '#00BB00', '#FFD700', '#DDDD00', '#006400', '#90EE90'];
      return cropColors[Math.floor(value) % 6];
    case 'Crop Health (NDVI)':
      if (value < 0.2) return '#A52A2A';
      if (value < 0.4) return '#FF6B6B';
      if (value < 0.6) return '#FFD93D';
      if (value < 0.7) return '#6BCB77';
      return '#4D96FF';
    case 'Water Deficit (mm)':
      if (value < 10) return '#008000';
      if (value < 20) return '#FFFF00';
      if (value < 35) return '#FFA500';
      if (value < 50) return '#FF0000';
      return '#8B0000';
    case 'Irrigation Amount (mm)':
      if (value < 10) return '#CCCCCC';
      if (value < 25) return '#E6F2FF';
      if (value < 45) return '#CCCCFF';
      if (value < 60) return '#6666FF';
      return '#000080';
    case 'Irrigation Advisory':
      const advColors = ['#22C55E', '#EAB308', '#F97316', '#EF4444', '#7C3AED'];
      return advColors[Math.floor(value) % 5];
    default:
      return '#10b981';
  }
};

// Data points layer component
const DataPointsLayer: React.FC<{ layer: LayerType; opacity: number }> = ({ layer, opacity }) => {
  const dataPoints = useMemo(() => generateDataPoints(layer), [layer]);
  
  return (
    <>
      {dataPoints.map((point, idx) => (
        <CircleMarker
          key={`${layer}-${idx}`}
          center={[point.lat, point.lng]}
          radius={25}
          pathOptions={{
            color: getColorForValue(layer, point.value),
            fillColor: getColorForValue(layer, point.value),
            fillOpacity: opacity * 0.7,
            weight: 2,
            opacity: opacity,
          }}
        >
          <Popup>
            <div className="text-slate-900 font-medium text-sm">
              {point.label}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
};

const MapView: React.FC<MapViewProps> = ({ activeLayer, opacity }) => {
  const center: [number, number] = [19.0, 76.0];
  const zoom = 7;
  const [isLoading, setIsLoading] = useState(true);
  
  // Maharashtra boundary
  const maharashtraBounds: [[number, number], [number, number]] = [
    [15.6, 72.6],
    [22.0, 80.9]
  ];

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeLayer]);

  // Memoize gradient colors based on active layer
  const gradientStyle = useMemo(() => {
    const gradients: Record<LayerType, string> = {
      'Moisture Stress (WSI)': 'radial-gradient(ellipse at 30% 40%, rgba(34,197,94,0.25) 0%, rgba(234,179,8,0.2) 30%, rgba(239,68,68,0.25) 60%, rgba(124,58,237,0.2) 100%)',
      'Crop Types': 'radial-gradient(ellipse at 40% 50%, rgba(0,187,0,0.25) 0%, rgba(255,215,0,0.2) 30%, rgba(0,100,0,0.25) 60%, rgba(139,69,19,0.15) 100%)',
      'Crop Health (NDVI)': 'radial-gradient(ellipse at 35% 45%, rgba(77,150,255,0.25) 0%, rgba(107,203,119,0.2) 30%, rgba(255,217,61,0.2) 60%, rgba(165,42,42,0.15) 100%)',
      'Water Deficit (mm)': 'radial-gradient(ellipse at 50% 40%, rgba(0,128,0,0.25) 0%, rgba(255,255,0,0.2) 30%, rgba(255,0,0,0.2) 60%, rgba(139,0,0,0.2) 100%)',
      'Irrigation Amount (mm)': 'radial-gradient(ellipse at 45% 50%, rgba(204,204,204,0.2) 0%, rgba(204,204,255,0.2) 30%, rgba(102,102,255,0.25) 60%, rgba(0,0,128,0.2) 100%)',
      'Irrigation Advisory': 'radial-gradient(ellipse at 40% 45%, rgba(34,197,94,0.25) 0%, rgba(234,179,8,0.2) 25%, rgba(249,115,22,0.2) 50%, rgba(239,68,68,0.2) 75%, rgba(124,58,237,0.2) 100%)',
    };
    return gradients[activeLayer];
  }, [activeLayer]);

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="text-lg font-bold text-slate-200">🗺️ Interactive Satellite Map</span>
        <span className="text-[0.65rem] px-2 py-1 rounded-full font-semibold"
          style={{
            background: 'rgba(16,185,89,0.12)',
            border: '1px solid rgba(16,185,89,0.2)',
            color: '#34d399',
          }}>
          📡 {activeLayer}
        </span>
        {isLoading && (
          <span className="text-xs text-emerald-400 animate-pulse">
            🔄 Loading layer...
          </span>
        )}
      </div>
      
      <div className="rounded-2xl overflow-hidden relative"
        style={{
          border: '1px solid rgba(16,185,89,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '520px', width: '100%' }}
          zoomControl={true}
        >
          <MapUpdater center={center} zoom={zoom} />
          
          {/* Dark base map */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* Data points */}
          <DataPointsLayer layer={activeLayer} opacity={opacity} />
          
          {/* Maharashtra boundary */}
          <Rectangle
            bounds={maharashtraBounds}
            pathOptions={{
              color: '#3fb950',
              fill: false,
              weight: 2,
              dashArray: '6, 4',
            }}
          />
        </MapContainer>
        
        {/* Overlay gradient for the simulated layer */}
        <div 
          className="absolute inset-0 pointer-events-none z-[400]"
          style={{
            background: gradientStyle,
            opacity: opacity * 0.5,
            mixBlendMode: 'screen',
          }}
        />
        
        {/* Demo indicator */}
        <div className="absolute top-3 left-3 z-[500] px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: 'rgba(10, 25, 18, 0.9)',
            border: '1px solid rgba(16, 185, 89, 0.3)',
            color: '#fbbf24',
          }}>
          ⚠️ Demo Mode - Simulated Data Visualization
        </div>

        {/* Map instructions */}
        <div className="absolute bottom-3 right-3 z-[500] px-3 py-1.5 rounded-lg text-xs"
          style={{
            background: 'rgba(10, 25, 18, 0.9)',
            border: '1px solid rgba(16, 185, 89, 0.2)',
            color: '#94a3b8',
          }}>
          💡 Click markers for details
        </div>
      </div>
    </div>
  );
};

export default MapView;
