import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import AlertPill from '../components/ui/AlertPill'
import Badge from '../components/ui/Badge'
import { useAlerts } from '../hooks/useAlerts'
import { mockAdvisory } from '../mocks/mockAdvisory'
import useAppStore from '../store/useAppStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const setSelectedFieldId = useAppStore((s) => s.setSelectedFieldId)
  const { data: alerts = [], isLoading: alertsLoading } = useAlerts()
  const [dismissed, setDismissed] = useState([])

  const visibleAlerts = alerts.filter((a) => !dismissed.includes(a.id))
  const underStress = alerts.filter((a) => a.risk_level === 'critical' || a.risk_level === 'high').length
  const needIrrigation = alerts.filter((a) => a.risk_level === 'critical').length

  const statCards = [
    { label: 'Total fields',    value: 8 },
    { label: 'Under stress',    value: alertsLoading ? '…' : underStress },
    { label: 'Need irrigation', value: alertsLoading ? '…' : needIrrigation },
    { label: 'Avg NDVI',        value: '0.62' },
  ]

  const advisoryRows = Object.values(mockAdvisory).filter((a) => a.field_id)

  return (
    <PageWrapper title="Dashboard">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-[#0F6E56] mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Alert strip */}
      {visibleAlerts.length > 0 && (
        <div className="flex overflow-x-auto gap-3 pb-2 mb-6">
          {visibleAlerts.map((alert) => (
            <AlertPill
              key={alert.id}
              alert={alert}
              onDismiss={(id) => setDismissed((prev) => [...prev, id])}
            />
          ))}
        </div>
      )}

      {/* Latest advisories table */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Latest field advisories</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b border-gray-100">
                <th className="pb-2 font-medium pr-4">Zone</th>
                <th className="pb-2 font-medium pr-4">Crop</th>
                <th className="pb-2 font-medium pr-4">Stress</th>
                <th className="pb-2 font-medium pr-4">Advisory</th>
                <th className="pb-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {advisoryRows.map((row) => (
                <tr key={row.field_id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-gray-800">{row.zone_name}</td>
                  <td className="py-3 pr-4 text-gray-600">{row.crop_type}</td>
                  <td className="py-3 pr-4">
                    <Badge label={row.stress_class} variant={row.stress_class?.toLowerCase()} />
                  </td>
                  <td className="py-3 pr-4">
                    <Badge
                      label={row.advisory_status}
                      variant={row.advisory_status?.toLowerCase().replace(/ /g, '-')}
                    />
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => {
                        setSelectedFieldId(row.field_id)
                        navigate(`/field/${row.field_id}`)
                      }}
                      className="text-[#0F6E56] hover:text-[#1D9E75] font-medium transition-colors"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  )
}
