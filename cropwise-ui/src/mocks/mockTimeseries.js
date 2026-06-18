const buildTimeseries = (seed) => {
  const base = new Date('2024-10-15')
  const stages = ['Sowing', 'Vegetative', 'Flowering', 'Maturity']
  const stressLevels = ['None', 'None', 'Mild', 'Moderate', 'Severe']

  return Array.from({ length: 60 }, (_, i) => {
    const d = new Date(base)
    d.setDate(d.getDate() - (59 - i))
    const t = i / 59
    const ndvi = parseFloat(
      (0.35 + 0.35 * Math.sin(Math.PI * t * seed) +
       0.05 * Math.sin(t * 20)).toFixed(3)
    )
    const stressIndex = Math.min(4, Math.max(0,
      Math.floor((1 - ndvi) * 4 + 0.4 * Math.sin(t * 15))
    ))
    return {
      obs_date: d.toISOString().split('T')[0],
      ndvi,
      ndwi: parseFloat((ndvi * 0.6 + 0.05).toFixed(3)),
      evi: parseFloat((ndvi * 0.85).toFixed(3)),
      vv: parseFloat((-12 + 3 * Math.sin(t * Math.PI)).toFixed(2)),
      vh: parseFloat((-18 + 2 * Math.sin(t * Math.PI * seed)).toFixed(2)),
      growth_stage: stages[Math.min(3, Math.floor(t * 4))],
      stress_class: stressLevels[stressIndex],
      deficit_mm: parseFloat((Math.max(0, (1 - ndvi) * 55 + 5)).toFixed(1)),
    }
  })
}

export const mockTimeseries = {
  default: buildTimeseries(1),
  1: buildTimeseries(1),
  2: buildTimeseries(1.3),
  3: buildTimeseries(0.8),
  4: buildTimeseries(1.1),
  5: buildTimeseries(0.9),
  6: buildTimeseries(1.0),
  7: buildTimeseries(0.75),
  8: buildTimeseries(1.2)
}
