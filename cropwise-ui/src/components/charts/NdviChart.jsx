import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
)

export default function NdviChart({ data = [] }) {
  const last60 = data.slice(-60)
  const labels = last60.map((d) => d.obs_date)
  const ndviValues = last60.map((d) => d.ndvi)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'NDVI',
        data: ndviValues,
        borderColor: '#639922',
        backgroundColor: 'rgba(99,153,34,0.1)',
        tension: 0.4,
        pointRadius: 0,
        fill: true,
      },
      {
        label: 'Stress threshold',
        data: Array(labels.length).fill(0.4),
        borderColor: '#E24B4A',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: { size: 11 },
        },
      },
      title: {
        display: true,
        text: 'NDVI trend — last 60 days',
        color: '#111827',
        font: { size: 14, weight: 'semibold' },
        align: 'start',
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          callback: function (val, index) {
            return index % 10 === 0 ? this.getLabelForValue(val) : ''
          },
        },
      },
      y: {
        min: 0,
        max: 1,
        ticks: { font: { size: 10 } },
      },
    },
  }

  const lastNdvi = last60[last60.length - 1]?.ndvi ?? 0

  return (
    <div className="w-full">
      <div className="relative h-[260px] w-full">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-3 text-sm font-medium">
        {lastNdvi < 0.4 ? (
          <span className="text-[#E24B4A]">↓ Declining — monitor closely</span>
        ) : (
          <span className="text-[#639922]">↑ Healthy growth</span>
        )}
      </div>
    </div>
  )
}
