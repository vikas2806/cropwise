const makeBox = (lat, lng) => ({
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [lng,       lat      ],
      [lng+0.015, lat      ],
      [lng+0.015, lat+0.015],
      [lng,       lat+0.015],
      [lng,       lat      ],
    ]],
  },
})

const fields = [
  { field_id: 1, zone_name: 'Vidarbha-Rice-01',    crop_type: 'Rice',    lat: 21.10, lng: 78.96, stress_class: 'Moderate', advisory: 'Irrigate Soon' },
  { field_id: 2, zone_name: 'Wardha-Cotton-02',     crop_type: 'Cotton',  lat: 21.10, lng: 78.99, stress_class: 'Severe',   advisory: 'Irrigate Now'  },
  { field_id: 3, zone_name: 'Amravati-Wheat-03',    crop_type: 'Wheat',   lat: 21.10, lng: 79.02, stress_class: 'Mild',     advisory: 'No Action'     },
  { field_id: 4, zone_name: 'Nagpur-Soybean-04',    crop_type: 'Soybean', lat: 21.13, lng: 78.96, stress_class: 'None',     advisory: 'No Action'     },
  { field_id: 5, zone_name: 'Amravati-Soybean-05',  crop_type: 'Soybean', lat: 21.13, lng: 78.99, stress_class: 'Severe',   advisory: 'Irrigate Now'  },
  { field_id: 6, zone_name: 'Yavatmal-Cotton-06',   crop_type: 'Cotton',  lat: 21.13, lng: 79.02, stress_class: 'Moderate', advisory: 'Irrigate Soon' },
  { field_id: 7, zone_name: 'Buldhana-Wheat-07',    crop_type: 'Wheat',   lat: 21.16, lng: 78.96, stress_class: 'Mild',     advisory: 'No Action'     },
  { field_id: 8, zone_name: 'Washim-Rice-08',       crop_type: 'Rice',    lat: 21.16, lng: 78.99, stress_class: 'None',     advisory: 'No Action'     },
]

const toFeature = (f, props) => ({
  ...makeBox(f.lat, f.lng),
  properties: { field_id: f.field_id, zone_name: f.zone_name, ...props(f) },
})

export const mockGeoJson = {
  cropType: {
    type: 'FeatureCollection',
    features: fields.map(f => toFeature(f, x => ({
      crop_type: x.crop_type,
      confidence: 0.91,
    }))),
  },
  stress: {
    type: 'FeatureCollection',
    features: fields.map(f => toFeature(f, x => ({
      stress_class: x.stress_class,
    }))),
  },
  advisory: {
    type: 'FeatureCollection',
    features: fields.map(f => toFeature(f, x => ({
      advisory: x.advisory,
    }))),
  },
}
