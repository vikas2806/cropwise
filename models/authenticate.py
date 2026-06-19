import ee
import sys

# Fix Windows encoding
if sys.platform == 'win32':
    import os
    os.environ['PYTHONIOENCODING'] = 'utf-8'

print("Authenticating with Google Earth Engine...\n")

try:
    ee.Authenticate()
    print("\nAuthentication successful!")
    print("You are ready to use Earth Engine!")
    
except Exception as e:
    print(f"Error: {e}")