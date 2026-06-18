import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import NdviChart from '../components/charts/NdviChart'
import WaterBalanceChart from '../components/charts/WaterBalanceChart'
import StressIndexChart from '../components/charts/StressIndexChart'
import ChartSkeleton from '../components/charts/ChartSkeleton'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { useTimeseries } from '../hooks/useFieldData'
import { mockGeoJson } from '../mocks/mockGeoJson'
import useAppStore from '../store/useAppStore'

const PAGE_SIZE = 10

export default function Analytics() {
  const selectedFieldId = useAppStore((s) => s.selectedFieldId)
  const setSelectedFieldId = useAppStore((s) => s.setSelectedFieldId)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(0)

  const { data, isLoading, isError, error, refetch } = useTimeseries(selectedFieldId)

  const fieldOptions = mockGeoJson.cropType.features.map((f) => ({
    id: f.properties.field_id,
    label: f.properties.zone_name,
  }))

  // Filter by date range
  const filtered = (() => {
    if (!data) return []
    if (!startDate && !endDate) return data
    return data.filter((row) => {
      const d = row.obs_date
      if (startDate && d < startDate) return false
      if (endDate && d > endDate) return false
      return true
    })
  })()

  const totalRows = filtered.length
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleExportCSV = () => {
    const header = 'obs_date,ndvi,evi,growth_stage,stress_class,deficit_mm'
    const rows = filtered.map((r) =>
      `${r.obs_date},${r.ndvi},${r.evi},${r.growth_stage},${r.stress_class},${r.deficit_mm}`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cropwise-field-${selectedFieldId ?? 'all'}-timeseries.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const noFieldPlaceholder = (
    <div className="bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center text-gray-400 text-sm h-64">
      Select a field above to view data
    </div>
  )

  return (
    <PageWrapper title="Analytics">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Field</label>
          <select
            value={selectedFieldId ?? ''}
            onChange={(e) => {
              setSelectedFieldId(e.target.value ? Number(e.target.value) : null)
              setPage(0)
            }}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-52"
          >
            <option value="">Select a field…</option>
            {fieldOptions.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(0) }}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">End date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(0) }}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <Button variant="secondary" onClick={handleExportCSV} disabled={!data}>
          Export CSV
        </Button>
      </div>

      {/* Charts section */}
      {!selectedFieldId ? (
        <>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {noFieldPlaceholder}
            {noFieldPlaceholder}
          </div>
          {noFieldPlaceholder}
        </>
      ) : isLoading ? (
        <>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4"><ChartSkeleton /></div>
            <div className="bg-white rounded-xl border border-gray-200 p-4"><ChartSkeleton /></div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4"><ChartSkeleton /></div>
        </>
      ) : isError ? (
        <div className="text-sm text-red-600 bg-red-50 rounded-lg p-4">
          <p>{error?.message}</p>
          <button onClick={() => refetch()} className="mt-2 text-red-700 underline text-xs">Retry</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <NdviChart data={filtered} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <WaterBalanceChart data={filtered} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <StressIndexChart data={filtered} />
          </div>
        </>
      )}

      {/* Raw data table */}
      {data && filtered.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Raw timeseries data</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <th className="pb-2 font-medium pr-4">Date</th>
                  <th className="pb-2 font-medium pr-4">NDVI</th>
                  <th className="pb-2 font-medium pr-4">EVI</th>
                  <th className="pb-2 font-medium pr-4">Growth Stage</th>
                  <th className="pb-2 font-medium pr-4">Stress</th>
                  <th className="pb-2 font-medium">Deficit (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pageData.map((row) => (
                  <tr key={row.obs_date} className="hover:bg-gray-50">
                    <td className="py-2 pr-4 text-gray-600 font-mono text-xs">{row.obs_date}</td>
                    <td className="py-2 pr-4 font-medium">{row.ndvi}</td>
                    <td className="py-2 pr-4 text-gray-600">{row.evi}</td>
                    <td className="py-2 pr-4 text-gray-600">{row.growth_stage}</td>
                    <td className="py-2 pr-4">
                      <Badge label={row.stress_class} variant={row.stress_class?.toLowerCase()} />
                    </td>
                    <td className="py-2 text-gray-600">{row.deficit_mm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span>
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalRows)} of {totalRows} rows
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                Prev
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => p + 1)}
                disabled={(page + 1) * PAGE_SIZE >= totalRows}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
