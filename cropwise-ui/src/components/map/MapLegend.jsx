import useAppStore from '../../store/useAppStore'

export default function MapLegend() {
  const activeLayer = useAppStore((s) => s.activeLayer)

  const legendData = {
    'crop-type': [
      { color: '#1D9E75', label: 'Rice' },
      { color: '#378ADD', label: 'Cotton' },
      { color: '#EF9F27', label: 'Wheat' },
      { color: '#639922', label: 'Soybean' },
    ],
    'stress': [
      { color: '#639922', label: 'None' },
      { color: '#EF9F27', label: 'Mild' },
      { color: '#BA7517', label: 'Moderate' },
      { color: '#E24B4A', label: 'Severe' },
    ],
    'advisory': [
      { color: '#639922', label: 'No Action' },
      { color: '#EF9F27', label: 'Irrigate Soon' },
      { color: '#E24B4A', label: 'Irrigate Now' },
    ],
  }

  const items = legendData[activeLayer] || []

  const getTitle = () => {
    if (activeLayer === 'crop-type') return 'Crop Types'
    if (activeLayer === 'stress') return 'Stress Level'
    if (activeLayer === 'advisory') return 'Advisory Status'
    return 'Legend'
  }

  return (
    <div className="absolute bottom-8 left-3 z-[1000] bg-white rounded-lg p-3 shadow-md min-w-36 border border-gray-200">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {getTitle()}
      </h4>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-700 font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
