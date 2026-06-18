import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
)

export default function WaterBalanceChart({ data = [] }) {
  const last8 = data.slice(-8)
  const labels = last8.map((_, i) => `D${i + 1}`)

  const requirements = last8.map((d) => d.deficit_mm)
  const availables = last8.map((d) => parseFloat((d.deficit_mm * 0.6).toFixed(1)))

  const reqColors = last8.map((d) => {
    const req = d.deficit_mm
    const avail = d.deficit_mm * 0.6
    return req > avail ? '#E24B4A' : '#1D9E75'
  })

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Requirement',
        data: requirements,
        backgroundColor: reqColors,
        borderRadius: 4,
      },
      {
        label: 'Available',
        data: availables,
        backgroundColor: '#9FE1CB',
        borderRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Water balance — next 8 days (mm)',
        color: '#111827',
        font: { size: 14, weight: 'semibold' },
        align: 'start',
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
      y: {
        min: 0,
        suggestedMax: 80,
        ticks: { font: { size: 10 } },
      },
    },
  }

  return (
    <div className="w-full">
      <div className="relative h-[260px] w-full">
        <Bar data={chartData} options={options} />
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs font-medium text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#E24B4A] rounded-sm inline-block" />
          <span>Requirement (Deficit)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#9FE1CB] rounded-sm inline-block" />
          <span>Available Water</span>
        </div>
      </div>
    </div>
  )
}
