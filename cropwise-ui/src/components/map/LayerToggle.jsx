import useAppStore from '../../store/useAppStore'

export default function LayerToggle() {
  const activeLayer = useAppStore((s) => s.activeLayer)
  const setActiveLayer = useAppStore((s) => s.setActiveLayer)

  const buttons = [
    { id: 'crop-type', label: 'Crop Type' },
    { id: 'stress',    label: 'Stress'    },
    { id: 'advisory',  label: 'Advisory'  },
  ]

  return (
    <div className="absolute top-3 left-14 z-[1000] bg-white rounded-lg p-1 shadow-md flex gap-1 border border-gray-200">
      {buttons.map((btn) => {
        const isActive = activeLayer === btn.id
        return (
          <button
            key={btn.id}
            onClick={() => setActiveLayer(btn.id)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? 'bg-[#0F6E56] text-white rounded-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 rounded-md'
            }`}
          >
            {btn.label}
          </button>
        )
      })}
    </div>
  )
}
