import Badge from './Badge'

const bgMap = {
  critical: 'bg-red-50 border-red-200',
  high:     'bg-orange-50 border-orange-200',
  medium:   'bg-yellow-50 border-yellow-200',
}

export default function AlertPill({ alert, onDismiss }) {
  const bg = bgMap[alert.risk_level] || 'bg-gray-50 border-gray-200'
  const truncated = alert.message.length > 50
    ? alert.message.slice(0, 50) + '…'
    : alert.message

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm whitespace-nowrap flex-shrink-0 ${bg}`}>
      <Badge label={alert.risk_level} variant={alert.risk_level} />
      <span className="font-medium text-gray-800">{alert.zone_name}</span>
      <span className="text-gray-500 hidden sm:inline">{truncated}</span>
      <button
        onClick={() => onDismiss(alert.id)}
        className="ml-1 text-gray-400 hover:text-gray-700 font-bold text-base leading-none flex-shrink-0"
        aria-label="Dismiss alert"
      >
        ×
      </button>
    </div>
  )
}
