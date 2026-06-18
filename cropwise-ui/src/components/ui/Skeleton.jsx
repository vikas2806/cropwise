export default function Skeleton({ height = '20px', className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ height }}
    />
  )
}
