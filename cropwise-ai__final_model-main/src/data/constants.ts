import { LayerType, LegendItem, AdvisoryLevel, FooterCard, DataSource } from '../types';

export const LAYER_ICONS: Record<LayerType, string> = {
  'Moisture Stress (WSI)': '🌊',
  'Crop Types': '🌾',
  'Crop Health (NDVI)': '📈',
  'Water Deficit (mm)': '💧',
  'Irrigation Amount (mm)': '💦',
  'Irrigation Advisory': '⚡',
};

export const LAYER_DESCRIPTIONS: Record<LayerType, string> = {
  'Moisture Stress (WSI)': `🌊 <b>Water Stress Index (WSI)</b> — Ranges 0 to 1.0 | Quantifies crop water stress from lack of moisture. <span style="color:#34d399;">🟢 Green = No Stress</span> → <span style="color:#c084fc;">🟣 Purple = Critical Stress</span> | Derived from MODIS ET, CHIRPS rainfall & Sentinel-1 SAR soil moisture.`,
  'Crop Types': `🌾 <b>Crop Type Classification</b> — 6 Land-cover Classes | Identifies crop species using NDVI + NDWI threshold rules: Rice, Wheat, Cotton, Sugarcane, Vegetables, or Fallow/Non-Crop.`,
  'Crop Health (NDVI)': `📈 <b>NDVI Vegetation Health Index</b> — Ranges 0 to 0.8 | Higher values = denser, healthier canopy. <span style="color:#ef4444;">🔴 Red = Bare/Stressed</span> → <span style="color:#60a5fa;">🔵 Blue = Peak Health</span> | Computed from Sentinel-2 NIR (B8) and Red (B4) bands.`,
  'Water Deficit (mm)': `💧 <b>8-Day Water Deficit (mm)</b> — Ranges 0–60 mm | Exact shortfall per 8-day period. Formula: ETc − (Rainfall + Soil Moisture). Direct input to precision irrigation scheduling.`,
  'Irrigation Amount (mm)': `💦 <b>Recommended Irrigation Depth (mm)</b> — Ranges 0–70 mm | Optimal application = Water Deficit × 1.2 (20% efficiency buffer). <span style="color:#e2e8f0;">⬜ White = No irrigation</span> → <span style="color:#6060ff;">🔷 Dark Blue = 70mm max</span>`,
  'Irrigation Advisory': `⚡ <b>Action Advisory (5 Priority Levels)</b> — 0 to 4 | <span style="color:#34d399;">● No Action</span> <span style="color:#fbbf24;">● Monitor (5-7d)</span> <span style="color:#fb923c;">● Schedule (3-5d)</span> <span style="color:#f87171;">● Irrigate Now</span> <span style="color:#c084fc;">● Emergency!</span>`,
};

export const LEGENDS: Record<LayerType, LegendItem[]> = {
  'Moisture Stress (WSI)': [
    { color: '#22C55E', value: '0.0–0.2', label: 'No Stress' },
    { color: '#EAB308', value: '0.2–0.4', label: 'Mild' },
    { color: '#F97316', value: '0.4–0.6', label: 'Moderate' },
    { color: '#EF4444', value: '0.6–0.8', label: 'Severe' },
    { color: '#7C3AED', value: '0.8–1.0', label: 'Extreme' },
  ],
  'Crop Types': [
    { color: '#8B4513', value: '0', label: 'Fallow' },
    { color: '#00BB00', value: '1', label: 'Rice' },
    { color: '#FFD700', value: '2', label: 'Wheat' },
    { color: '#DDDD00', value: '3', label: 'Cotton' },
    { color: '#006400', value: '4', label: 'Sugarcane' },
    { color: '#90EE90', value: '5', label: 'Vegetables' },
  ],
  'Crop Health (NDVI)': [
    { color: '#A52A2A', value: '0.0', label: 'Dead / Bare' },
    { color: '#FF6B6B', value: '0.2', label: 'Poor Health' },
    { color: '#FFD93D', value: '0.4', label: 'Fair' },
    { color: '#6BCB77', value: '0.6', label: 'Good' },
    { color: '#4D96FF', value: '0.8', label: 'Peak Health' },
  ],
  'Water Deficit (mm)': [
    { color: '#008000', value: '0 mm', label: 'None' },
    { color: '#FFFF00', value: '15 mm', label: 'Low' },
    { color: '#FFA500', value: '30 mm', label: 'Moderate' },
    { color: '#FF0000', value: '45 mm', label: 'High' },
    { color: '#8B0000', value: '60 mm', label: 'Critical' },
  ],
  'Irrigation Amount (mm)': [
    { color: '#CCCCCC', value: '0 mm', label: 'None' },
    { color: '#E6F2FF', value: '15 mm', label: 'Low' },
    { color: '#CCCCFF', value: '35 mm', label: 'Moderate' },
    { color: '#6666FF', value: '55 mm', label: 'High' },
    { color: '#000080', value: '70 mm', label: 'Max' },
  ],
  'Irrigation Advisory': [
    { color: '#22C55E', value: 'L0', label: 'No Action' },
    { color: '#EAB308', value: 'L1', label: 'Monitor' },
    { color: '#F97316', value: 'L2', label: 'Schedule' },
    { color: '#EF4444', value: 'L3', label: 'Irrigate' },
    { color: '#7C3AED', value: 'L4', label: 'Emergency' },
  ],
};

export const ADVISORY_LEVELS: AdvisoryLevel[] = [
  { level: 0, icon: '✅', title: 'No Action', description: 'Deficit <10mm', className: 'adv-0' },
  { level: 1, icon: '👁️', title: 'Monitor', description: '10–20mm · 5-7d', className: 'adv-1' },
  { level: 2, icon: '📅', title: 'Schedule', description: '20–35mm · 3-5d', className: 'adv-2' },
  { level: 3, icon: '🚿', title: 'Irrigate', description: '35–50mm · 2-3d', className: 'adv-3' },
  { level: 4, icon: '🚨', title: 'Emergency', description: '>50mm · NOW', className: 'adv-4' },
];

export const DATA_SOURCES: DataSource[] = [
  { badge: 'S-2', badgeColor: 'green', name: 'Sentinel-2', description: 'NDVI/NDWI · 10m' },
  { badge: 'S-1', badgeColor: 'green', name: 'Sentinel-1', description: 'SAR Soil · 10m' },
  { badge: 'MOD', badgeColor: 'orange', name: 'MODIS', description: 'Evapotranspiration · 500m' },
  { badge: 'CHR', badgeColor: 'blue', name: 'CHIRPS', description: 'Daily Rainfall · 5km' },
  { badge: 'GEE', badgeColor: 'red', name: 'Earth Engine', description: 'Cloud Processing' },
];

export const FOOTER_CARDS: FooterCard[] = [
  { icon: '🛰️', label: 'Optical Sensor', name: 'Sentinel-2', description: '10-20m · NDVI / NDWI · ESA Copernicus' },
  { icon: '📡', label: 'Radar (SAR)', name: 'Sentinel-1', description: '10m · Soil Moisture · VV/VH polarisation' },
  { icon: '🌡️', label: 'Thermal / ET', name: 'MODIS', description: '500m · MOD16A2 · 8-day ET product · NASA' },
  { icon: '☔', label: 'Precipitation', name: 'CHIRPS Daily', description: '5km · Climate Hazards Rainfall · UC Santa Barbara' },
];

export const PROCESSING_PIPELINE_CODE = `# ─────────────────────────────────────────────────────────
#  CropWise AI  ·  Satellite Processing Pipeline
# ─────────────────────────────────────────────────────────

# 1. OPTICAL DATA  ─  Sentinel-2 (10m, <20% cloud cover)
   NDVI = (B8 - B4) / (B8 + B4)     # Vegetation Health
   NDWI = (B8 - B11) / (B8 + B11)   # Water Content

# 2. MICROWAVE    ─  Sentinel-1 SAR (IW mode, 10m)
   SM_proxy = VH / VV                # Soil Moisture Proxy
   SM_scaled = unitScale(-25, 5)

# 3. THERMAL      ─  MODIS MOD16A2 (500m, 8-day)
   ET0 = MOD16A2.ET / 8             # Reference Evapotranspiration

# 4. RAINFALL     ─  CHIRPS Daily (5km)
   P = Σ(daily_precip)              # Cumulative Rainfall

# 5. CROP WATER DEMAND
   ETc = Kc × ET0                   # Kc = crop coefficient
   Water_Deficit = ETc - (P + SM×100)

# 6. STRESS & ADVISORY
   WSI  = Water_Deficit / Water_Needed    # [0, 1]
   Irr  = Water_Deficit × 1.2            # +20% buffer
   Lvl  = advisory_thresholds(deficit)   # 0-4 priority`;
