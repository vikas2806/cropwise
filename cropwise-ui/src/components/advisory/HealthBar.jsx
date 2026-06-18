function getNdviColor(ndvi) {
  if (ndvi >= 0.6) return { text: 'text-green-700', bg: 'bg-green-500' }
  if (ndvi >= 0.3) return { text: 'text-amber-600', bg: 'bg-amber-500' }
  return { text: 'text-red-600', bg: 'bg-red-500' }
}

export default function HealthBar({ ndvi, growth_stage }) {
  const safeNdvi = ndvi ?? 0
  const { text, bg } = getNdviColor(safeNdvi)
  const widthPct = Math.min(100, Math.max(0, safeNdvi * 100)).toFixed(1)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-gray-700">Crop health (NDVI)</span>
      </div>
      <p className={`text-2xl font-bold ${text}`}>{safeNdvi.toFixed(3)}</p>
      <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${bg}`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">{growth_stage ?? 'Unknown stage'}</p>
    </div>
  )
}
