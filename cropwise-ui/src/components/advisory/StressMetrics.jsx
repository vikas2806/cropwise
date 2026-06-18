import Badge from '../ui/Badge'

export default function StressMetrics({ soil_moisture_pct, rainfall_mm, days_since_rain, stress_class }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Stress metrics</span>
        {stress_class && (
          <Badge label={stress_class} variant={stress_class.toLowerCase()} />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Soil moisture</span>
          <span className="font-medium text-gray-800">{soil_moisture_pct ?? 'N/A'}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Recent rainfall</span>
          <span className="font-medium text-gray-800">{rainfall_mm ?? 'N/A'} mm</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Days since rain</span>
          <span className="font-medium text-gray-800">{days_since_rain ?? 'N/A'} days</span>
        </div>
      </div>
    </div>
  )
}
