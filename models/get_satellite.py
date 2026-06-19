import ee
import geemap
import os

# PASTE YOUR PROJECT ID HERE
project_id = "cropwise-ai-499810"  # Replace with YOUR Project ID

print("="*60)
print("MAHARASHTRA SATELLITE IMAGE GETTER")
print("="*60)

try:
    print(f"\nInitializing with project: {project_id}")
    ee.Initialize(project=project_id)
    print("Connected!")
    
    print("\nTarget: Maharashtra")
    maha = ee.Geometry.Rectangle([72.6, 15.6, 80.9, 22.0])
    
    print("Fetching Sentinel-2 images...")
    print("(Takes 60-120 seconds)\n")
    
    images = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
        .filterBounds(maha) \
        .filterDate('2023-06-01', '2023-11-30') \
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    
    count = images.size().getInfo()
    print(f"Found {count} images!")
    
    print("Processing...")
    clean = images.median()
    ndvi = clean.normalizedDifference(['B8', 'B4'])
    
    print("Creating map...")
    m = geemap.Map(center=[19.0, 76.0], zoom=7)
    m.addLayer(ndvi, {
        'min': 0, 'max': 0.8,
        'palette': ['brown', 'yellow', 'lightgreen', 'darkgreen']
    }, 'NDVI - Crop Health')
    m.addLayer(maha, {'color': 'red'}, 'Maharashtra')
    
    output = 'maharashtra_ndvi.html'
    m.to_html(output)
    
    print("\n" + "="*60)
    print("SUCCESS!")
    print("="*60)
    print(f"\nFile saved: {os.path.abspath(output)}")
    print("\nColor meanings:")
    print("  Brown  = Bare soil / No crops")
    print("  Yellow = Sparse vegetation")
    print("  Green  = Healthy crops")
    print("\nOpen the HTML file in your browser!")
    print("="*60)
    
except Exception as e:
    print(f"Error: {e}")