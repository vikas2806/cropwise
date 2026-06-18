import Badge from '../ui/Badge'

const statusToVariant = {
  'Irrigate Now':  'irrigate-now',
  'Irrigate Soon': 'irrigate-soon',
  'No Action':     'no-action',
}

export default function AdvisoryCard({ advisory }) {
  if (!advisory) return null
  const variant = statusToVariant[advisory.advisory_status] || 'none'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Irrigation advisory</span>
        <Badge label={advisory.advisory_status ?? 'N/A'} variant={variant} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Timeline</span>
          <p className="font-medium text-gray-800">{advisory.timeline_days ?? 'N/A'} days</p>
        </div>
        <div>
          <span className="text-gray-500">Amount</span>
          <p className="font-medium text-gray-800">{advisory.water_amount_mm ?? 'N/A'} mm</p>
        </div>
        <div>
          <span className="text-gray-500">Duration</span>
          <p className="font-medium text-gray-800">{advisory.duration_hours ?? 'N/A'} hours</p>
        </div>
        <div>
          <span className="text-gray-500">Best time</span>
          <p className="font-medium text-gray-800">{advisory.best_time ?? 'N/A'}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 italic leading-relaxed">
        {advisory.advisory_text ?? 'No advisory text available.'}
      </div>
    </div>
  )
}
