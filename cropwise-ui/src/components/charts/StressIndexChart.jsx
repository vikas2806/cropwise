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
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
)

const stressMap = { None: 0, Mild: 0.3, Moderate: 0.6, Severe: 1.0 }

export default function StressIndexChart({ data = [] }) {
  const last60 = data.slice(-60)
  const labels = last60.map((d) => d.obs_date)
  const mappedValues = last60.map((d) => stressMap[d.stress_class] ?? 0)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Stress Index',
        data: mappedValues,
        borderColor: '#E24B4A',
        backgroundColor: 'rgba(226,75,74,0.1)',
        tension: 0.3,
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
        display: false,
      },
      title: {
        display: true,
        text: 'Stress index trend',
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
        ticks: {
          font: { size: 10 },
          stepSize: 0.1,
          callback: function (val) {
            const labelMap = { 0: 'None', 0.3: 'Mild', 0.6: 'Moderate', 1.0: 'Severe' }
            const precVal = parseFloat(val.toFixed(1))
            return labelMap[precVal] !== undefined ? labelMap[precVal] : ''
          },
        },
      },
    },
  }

  const last3 = mappedValues.slice(-3)
  let trendElement = <span className="text-gray-500">→ Stable</span>

  if (last3.length === 3) {
    const rising = last3[2] >= last3[1] && last3[1] >= last3[0]
    const falling = last3[2] <= last3[1] && last3[1] <= last3[0]
    const isFlat = last3[0] === last3[1] && last3[1] === last3[2]

    if (isFlat) {
      trendElement = <span className="text-gray-500">→ Stable</span>
    } else if (rising) {
      trendElement = <span className="text-[#E24B4A]">↑ Rising — irrigation needed</span>
    } else if (falling) {
      trendElement = <span className="text-[#639922]">↓ Improving</span>
    }
  }

  return (
    <div className="w-full">
      <div className="relative h-[260px] w-full">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-3 text-sm font-medium">
        {trendElement}
      </div>
    </div>
  )
}
