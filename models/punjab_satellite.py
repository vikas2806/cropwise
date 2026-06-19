import ee
import geemap
import os

project_id = "cropwise-ai-499810"

print("="*60)
print("PUNJAB SATELLITE IMAGE GETTER")
print("="*60)

try:
    print(f"\nInitializing with project: {project_id}")
    ee.Initialize(project=project_id)
    print("Connected!")
    
    # PUNJAB COORDINATES
    print("\nTarget: Punjab (India's Breadbasket!)")
    punjab = ee.Geometry.Rectangle([73.9, 29.5, 76.9, 32.5])
    
    print("Fetching Sentinel-2 images...")
    print("(Takes 60-120 seconds)\n")
    
    # Get images
    images = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
        .filterBounds(punjab) \
        .filterDate('2023-06-01', '2023-11-30') \
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    
    count = images.size().getInfo()
    print(f"Found {count} images!")
    
    # Process
    print("Processing...")
    clean = images.median()
    ndvi = clean.normalizedDifference(['B8', 'B4'])
    
    # Create map
    print("Creating map...")
    m = geemap.Map(center=[30.9, 75.4], zoom=7)  # Punjab center
    
    m.addLayer(ndvi, {
        'min': 0, 'max': 0.8,
        'palette': ['brown', 'yellow', 'lightgreen', 'darkgreen']
    }, 'NDVI - Crop Health')
    
    m.addLayer(punjab, {'color': 'red'}, 'Punjab Boundary')
    
    # Save
    output = 'punjab_ndvi.html'
    m.to_html(output)
    
    print("\n" + "="*60)
    print("SUCCESS!")
    print("="*60)
    print(f"\nFile saved: {os.path.abspath(output)}")
    print("\nColor meanings:")
    print("  Brown      = Bare soil / Fallow")
    print("  Yellow     = Sparse vegetation")
    print("  Lt Green   = Moderate crops")
    print("  Dark Green = Healthy wheat/rice fields!")
    print("\nPunjab is VERY green (lots of farming)!")
    print("="*60)
    
except Exception as e:
    print(f"Error: {e}")