export default function PageWrapper({ title, children }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">{title}</h1>
      {children}
    </div>
  )
}
