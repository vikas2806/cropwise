import ee
import geemap

project_id = "cropwise-ai-499810"

print("="*60)
print("PUNJAB CROP TYPE IDENTIFICATION")
print("="*60)

ee.Initialize(project=project_id)
print("Connected!\n")

# Punjab region
punjab = ee.Geometry.Rectangle([73.9, 29.5, 76.9, 32.5])

print("Getting multi-temporal satellite data...")

# Get images across crop growing season
collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
    .filterBounds(punjab) \
    .filterDate('2023-06-01', '2023-11-30') \
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))

# Create composite
composite = collection.median().clip(punjab)

# Calculate vegetation indices
print("Calculating crop signatures...")

# NDVI
ndvi = composite.normalizedDifference(['B8', 'B4']).rename('NDVI')

# NDWI (Water content - helps identify rice)
ndwi = composite.normalizedDifference(['B8', 'B11']).rename('NDWI')

print("Classifying crops based on spectral signatures...\n")

# CROP CLASSIFICATION LOGIC
crop_type = ndvi.expression(
    # Rice: High NDVI + High NDWI (water loving)
    "(NDVI > 0.6 && NDWI > 0.2) ? 1" +
    
    # Wheat: High NDVI + Low NDWI (Rabi season)
    ": (NDVI > 0.5 && NDVI <= 0.7 && NDWI < 0.1) ? 2" +
    
    # Cotton: Moderate NDVI + Moderate NDWI
    ": (NDVI > 0.4 && NDVI <= 0.6 && NDWI > 0.0 && NDWI <= 0.2) ? 3" +
    
    # Sugarcane: Very High NDVI (tall dense crop)
    ": (NDVI > 0.7) ? 4" +
    
    # Vegetables/Horticulture: Lower NDVI
    ": (NDVI > 0.3 && NDVI <= 0.5) ? 5" +
    
    # Fallow/Bare
    ": 0",
    {
        'NDVI': ndvi,
        'NDWI': ndwi
    }
).rename('Crop_Type')

# Create map
print("Creating crop map...")
m = geemap.Map(center=[30.9, 75.4], zoom=8)

# Add crop classification with legend
crop_viz = {
    'min': 0,
    'max': 5,
    'palette': [
        '#8B4513',  # 0: Brown - Fallow/Bare
        '#00FF00',  # 1: Bright Green - Rice
        '#FFD700',  # 2: Gold - Wheat
        '#FFFF00',  # 3: Yellow - Cotton
        '#006400',  # 4: Dark Green - Sugarcane
        '#90EE90'   # 5: Light Green - Vegetables
    ]
}

m.addLayer(crop_type, crop_viz, 'Crop Types')

# Add NDVI for reference
m.addLayer(ndvi, {
    'min': 0, 'max': 0.8,
    'palette': ['brown', 'yellow', 'green']
}, 'NDVI (Reference)', False)  # Hidden by default

m.addLayer(punjab, {'color': 'red'}, 'Punjab Boundary')

# Save
output = 'punjab_crop_types.html'
m.to_html(output)

print("="*60)
print("SUCCESS!")
print("="*60)
print("\nFile: punjab_crop_types.html")
print("\nCROP LEGEND:")
print("-" * 40)
print("Brown       = Fallow/Bare soil")
print("Bright Green = RICE (high water)")
print("Gold        = WHEAT")
print("Yellow      = COTTON")
print("Dark Green  = SUGARCANE")
print("Light Green = Vegetables/Others")
print("-" * 40)
print("\nNote: Based on spectral signatures")
print("Open the HTML map in your browser!")
print("="*60)