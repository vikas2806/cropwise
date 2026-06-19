import ee
import geemap

project_id = "cropwise-ai-499810"

ee.Initialize(project=project_id)

print("="*60)
print("PUNJAB SEASONAL CROP IDENTIFICATION")
print("="*60)

punjab = ee.Geometry.Rectangle([73.9, 29.5, 76.9, 32.5])

# KHARIF SEASON (June-Sept): Rice dominant
print("\nAnalyzing Kharif season (Rice)...")
kharif = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
    .filterBounds(punjab) \
    .filterDate('2023-06-01', '2023-09-30') \
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) \
    .median()

kharif_ndvi = kharif.normalizedDifference(['B8', 'B4'])
kharif_ndwi = kharif.normalizedDifference(['B8', 'B11'])

# RABI SEASON (Oct-March): Wheat dominant
print("Analyzing Rabi season (Wheat)...")
rabi = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
    .filterBounds(punjab) \
    .filterDate('2023-10-01', '2024-01-31') \
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) \
    .median()

rabi_ndvi = rabi.normalizedDifference(['B8', 'B4'])

# CROP CLASSIFICATION
print("Identifying crops...\n")

crop_map = kharif_ndvi.expression(
    # Rice (Kharif): High NDVI + High water
    "(kharif_ndvi > 0.5 && kharif_ndwi > 0.2) ? 1" +
    
    # Wheat (Rabi): High NDVI in Rabi season
    ": (rabi_ndvi > 0.5) ? 2" +
    
    # Cotton (Kharif): Moderate NDVI, low water
    ": (kharif_ndvi > 0.4 && kharif_ndvi <= 0.6 && kharif_ndwi < 0.2) ? 3" +
    
    # Sugarcane (Year-round): High NDVI in both seasons
    ": (kharif_ndvi > 0.7 && rabi_ndvi > 0.6) ? 4" +
    
    # Maize (Kharif alternative)
    ": (kharif_ndvi > 0.5 && kharif_ndvi <= 0.7) ? 5" +
    
    # Fallow
    ": 0",
    {
        'kharif_ndvi': kharif_ndvi,
        'kharif_ndwi': kharif_ndwi,
        'rabi_ndvi': rabi_ndvi
    }
).rename('Crop')

# Create detailed map
m = geemap.Map(center=[30.9, 75.4], zoom=8)

# Add crop layer with specific colors
m.addLayer(crop_map, {
    'min': 0, 'max': 5,
    'palette': [
        '#8B4513',  # 0: Fallow
        '#00CED1',  # 1: Rice (cyan - water crop)
        '#FFD700',  # 2: Wheat (golden)
        '#FFFFE0',  # 3: Cotton (light yellow)
        '#228B22',  # 4: Sugarcane (forest green)
        '#FFA500'   # 5: Maize (orange)
    ]
}, 'Punjab Crops')

# Add reference layers (hidden)
m.addLayer(kharif_ndvi, {
    'min': 0, 'max': 0.8,
    'palette': ['brown', 'yellow', 'green']
}, 'Kharif NDVI', False)

m.addLayer(rabi_ndvi, {
    'min': 0, 'max': 0.8,
    'palette': ['brown', 'yellow', 'green']
}, 'Rabi NDVI', False)

m.addLayer(punjab, {'color': 'red'}, 'Punjab')

# Save
m.to_html('punjab_seasonal_crops.html')

print("="*60)
print("SUCCESS!")
print("="*60)
print("\nFile: punjab_seasonal_crops.html")
print("\nCROP IDENTIFICATION LEGEND:")
print("-" * 40)
print("Brown       = Fallow/Bare land")
print("Cyan        = RICE (Kharif)")
print("Gold        = WHEAT (Rabi)")
print("Light Yellow = COTTON (Kharif)")
print("Dark Green  = SUGARCANE (Year-round)")
print("Orange      = MAIZE (Kharif)")
print("-" * 40)
print("\nUse layer toggles to see:")
print("  - Kharif NDVI (monsoon crops)")
print("  - Rabi NDVI (winter crops)")
print("="*60)