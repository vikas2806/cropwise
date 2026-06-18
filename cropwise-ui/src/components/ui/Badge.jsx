const variantClasses = {
  'critical':      'bg-red-100 text-red-800',
  'severe':        'bg-red-100 text-red-800',
  'irrigate-now':  'bg-red-100 text-red-800',
  'high':          'bg-orange-100 text-orange-800',
  'moderate':      'bg-amber-100 text-amber-800',
  'irrigate-soon': 'bg-amber-100 text-amber-800',
  'medium':        'bg-yellow-100 text-yellow-800',
  'mild':          'bg-yellow-100 text-yellow-800',
  'none':          'bg-green-100 text-green-800',
  'no-action':     'bg-green-100 text-green-800',
  'rice':          'bg-teal-100 text-teal-800',
  'cotton':        'bg-blue-100 text-blue-800',
  'wheat':         'bg-amber-100 text-amber-800',
  'soybean':       'bg-lime-100 text-lime-800',
}

export default function Badge({ label, variant = 'none' }) {
  const cls = variantClasses[variant.toLowerCase()] || 'bg-gray-100 text-gray-800'
  return (
    <span className={`${cls} px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap`}>
      {label}
    </span>
  )
}
