import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import { useAlerts } from '../hooks/useAlerts'
import useAppStore from '../store/useAppStore'

const borderColorMap = {
  critical: 'border-l-red-500',
  high:     'border-l-orange-500',
  medium:   'border-l-yellow-400',
}

export default function Alerts() {
  const navigate = useNavigate()
  const setSelectedFieldId = useAppStore((s) => s.setSelectedFieldId)

  const [activeTab, setActiveTab] = useState('active')
  const [dismissed, setDismissed] = useState([])
  const [riskFilter, setRiskFilter] = useState('all')

  const { data: alerts = [], isLoading, isError, error, refetch } = useAlerts()

  const activeAlerts = alerts.filter((a) => !dismissed.includes(a.id))
  const dismissedAlerts = alerts.filter((a) => dismissed.includes(a.id))

  const filteredActive = riskFilter === 'all'
    ? activeAlerts
    : activeAlerts.filter((a) => a.risk_level === riskFilter)

  const filterButtons = [
    { id: 'all',      label: 'All'      },
    { id: 'critical', label: 'Critical' },
    { id: 'high',     label: 'High'     },
    { id: 'medium',   label: 'Medium'   },
  ]

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return iso
    }
  }

  if (isLoading) {
    return (
      <PageWrapper title="Alerts">
        <Skeleton height="60px" className="mb-3 rounded-xl" />
        <Skeleton height="100px" className="mb-3 rounded-xl" />
        <Skeleton height="100px" className="rounded-xl" />
      </PageWrapper>
    )
  }

  if (isError) {
    return (
      <PageWrapper title="Alerts">
        <div className="text-sm text-red-600 bg-red-50 rounded-lg p-4">
          <p>{error?.message}</p>
          <button onClick={() => refetch()} className="mt-2 text-red-700 underline text-xs">Retry</button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Alerts">
      {/* Filter bar */}
      <div className="flex gap-3 mb-5 items-center flex-wrap">
        {filterButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setRiskFilter(btn.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              riskFilter === btn.id
                ? 'bg-[#0F6E56] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-5">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-2 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'active'
              ? 'border-b-2 border-[#0F6E56] text-[#0F6E56]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active ({activeAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab('dismissed')}
          className={`pb-2 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'dismissed'
              ? 'border-b-2 border-[#0F6E56] text-[#0F6E56]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Dismissed ({dismissed.length})
        </button>
      </div>

      {/* Active tab */}
      {activeTab === 'active' && (
        <>
          {filteredActive.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p>No alerts for this filter.</p>
            </div>
          ) : (
            filteredActive.map((alert) => (
              <div
                key={alert.id}
                className={`bg-white rounded-xl border-l-4 p-4 mb-3 shadow-sm ${borderColorMap[alert.risk_level] || 'border-l-gray-300'}`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-semibold text-gray-800">{alert.zone_name}</span>
                  <div className="flex items-center gap-2">
                    <Badge label={alert.risk_level} variant={alert.risk_level} />
                    <span className="text-xs text-gray-400">{formatTime(alert.created_at)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedFieldId(alert.field_id)
                      navigate('/map')
                    }}
                  >
                    View on map →
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setDismissed((prev) => [...prev, alert.id])}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* Dismissed tab */}
      {activeTab === 'dismissed' && (
        <>
          {dismissedAlerts.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p>No dismissed alerts.</p>
            </div>
          ) : (
            dismissedAlerts.map((alert) => (
              <div key={alert.id} className="bg-gray-50 rounded-xl p-4 mb-3 opacity-60">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-semibold text-gray-400">{alert.zone_name}</span>
                  <Badge label={alert.risk_level} variant={alert.risk_level} />
                </div>
                <p className="text-sm text-gray-400 mt-1">{alert.message}</p>
                <div className="mt-3">
                  <Button
                    variant="secondary"
                    onClick={() => setDismissed((prev) => prev.filter((id) => id !== alert.id))}
                  >
                    Restore
                  </Button>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </PageWrapper>
  )
}
