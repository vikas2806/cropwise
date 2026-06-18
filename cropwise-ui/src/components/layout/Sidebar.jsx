import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const items = [
    { icon: '🌾', label: 'Dashboard',    path: '/dashboard' },
    { icon: '🗺',  label: 'Map Explorer', path: '/map'       },
    { icon: '📊', label: 'Analytics',    path: '/analytics' },
    { icon: '⚠️', label: 'Alerts',       path: '/alerts'    },
  ]

  return (
    <div className="w-60 h-screen flex flex-col justify-between bg-[#0F6E56] text-white p-4 flex-shrink-0">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="text-2xl">🌱</span>
          <span className="font-bold text-lg tracking-wide">CropWise AI</span>
        </div>
        <nav className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1D9E75] rounded-lg'
                    : 'hover:bg-[#1D9E75]/40 rounded-lg'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="px-2 space-y-2">
        <a
          href="/"
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          ← Home
        </a>
        <p className="text-xs text-white/40">v1.0 · ISRO Hackathon</p>
      </div>
    </div>
  )
}
