import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import useAppStore from '../../store/useAppStore'

export default function TopBar() {
  const { pathname } = useLocation()
  const districtFilter = useAppStore((s) => s.districtFilter)
  const setDistrictFilter = useAppStore((s) => s.setDistrictFilter)
  const selectedDate = useAppStore((s) => s.selectedDate)
  const setSelectedDate = useAppStore((s) => s.setSelectedDate)

  const [season, setSeason] = useState('Kharif')

  const getTitle = (path) => {
    if (path === '/') return 'Dashboard'
    if (path === '/map') return 'Map Explorer'
    if (path === '/analytics') return 'Analytics'
    if (path === '/alerts') return 'Alerts'
    if (path.startsWith('/field/')) return 'Field Detail'
    return 'CropWise AI'
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
      <div className="text-lg font-semibold text-gray-800">
        {getTitle(pathname)}
      </div>
      <div className="flex items-center gap-3">
        <div>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2 py-1"
          >
            <option value="all">All Districts</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Wardha">Wardha</option>
            <option value="Amravati">Amravati</option>
            <option value="Yavatmal">Yavatmal</option>
            <option value="Buldhana">Buldhana</option>
            <option value="Washim">Washim</option>
          </select>
        </div>

        <div>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2 py-1"
          >
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
            <option value="Zaid">Zaid</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2 py-1"
          />
        </div>
      </div>
    </header>
  )
}
