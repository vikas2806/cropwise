# find_project.py
import ee

print("Trying to initialize...\n")

try:
    ee.Initialize()
    print("SUCCESS! Earth Engine initialized")
except Exception as e:
    error_msg = str(e)
    print(f"Error: {error_msg}")
    
    # Extract project ID if mentioned
    if "projects/" in error_msg:
        print("\nTry using a project ID from the error message")
    
    # Try common defaults
    print("\nTrying common project names...")
    for proj in ['ee-cropwise', 'ee-default', 'ee-testing']:
        try:
            ee.Initialize(project=proj)
            print(f"SUCCESS with: {proj}")
            break
        except:
            print(f"Failed: {proj}")