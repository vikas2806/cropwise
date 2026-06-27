# CropWise AI — API Reference

Complete API reference for the FastAPI backend. All endpoints require the `X-Internal-Key` header (injected by proxy).

## Base URL

- **Development**: `http://localhost:4000/api` (through proxy)
- **Backend directly**: `http://localhost:8000` (if no proxy)

---

## 1. Tiles Endpoints

These return satellite tile URLs from Google Earth Engine. Frontend plugs these into Leaflet `TileLayer`.

### GET /tiles/ndvi

Returns NDVI (Normalized Difference Vegetation Index) heatmap for crop health monitoring.

**Parameters:**
- `date_start` (query, optional): YYYY-MM-DD, default `2023-06-01`
- `date_end` (query, optional): YYYY-MM-DD, default `2023-11-30`

**Response (200):**
```json
{
  "tile_url": "https://earthengine.googleapis.com/v1/projects/cropwise-ai-499810/maps/abc123/tiles/{z}/{x}/{y}",
  "attribution": "Map tiles by Google Earth Engine | Imagery © Copernicus/ESA Sentinel-2",
  "layer_name": "NDVI - Crop Health",
  "is_mock": false,
  "date_start": "2023-06-01",
  "date_end": "2023-11-30",
  "region": {
    "lon_min": 72.6,
    "lat_min": 15.6,
    "lon_max": 80.9,
    "lat_max": 22.0
  }
}
```

**Caching:** 24 hours (first call 30-60s, cached <100ms)

**Example:**
```bash
curl "http://localhost:8000/tiles/ndvi"
curl "http://localhost:8000/tiles/ndvi?date_start=2024-01-01&date_end=2024-03-31"
```

---

### GET /tiles/crop-type

Returns crop classification (Rice, Wheat, Cotton, etc.) based on kharif/rabi NDVI patterns.

**Parameters:**
- `kharif_start` (query, optional): YYYY-MM-DD, default `2023-06-01`
- `kharif_end` (query, optional): YYYY-MM-DD, default `2023-09-30`
- `rabi_start` (query, optional): YYYY-MM-DD, default `2023-10-01`
- `rabi_end` (query, optional): YYYY-MM-DD, default `2024-01-31`

**Response (200):**
```json
{
  "tile_url": "https://earthengine.googleapis.com/v1/projects/cropwise-ai-499810/maps/def456/tiles/{z}/{x}/{y}",
  "attribution": "Map tiles by Google Earth Engine | Imagery © Copernicus/ESA Sentinel-2",
  "layer_name": "Crop Classification",
  "is_mock": false,
  "legend": {
    "0": { "label": "Fallow",    "color": "#8B4513" },
    "1": { "label": "Rice",      "color": "#00CED1" },
    "2": { "label": "Wheat",     "color": "#FFD700" },
    "3": { "label": "Cotton",    "color": "#FFFFE0" },
    "4": { "label": "Sugarcane", "color": "#228B22" },
    "5": { "label": "Maize",     "color": "#FFA500" }
  }
}
```

**Classification Rules:**
- **Rice** (1): kharif_ndvi > 0.5 AND kharif_ndwi > 0.2
- **Wheat** (2): rabi_ndvi > 0.5
- **Cotton** (3): kharif_ndvi ∈ (0.4, 0.6] AND kharif_ndwi < 0.2
- **Sugarcane** (4): kharif_ndvi > 0.7 AND rabi_ndvi > 0.6
- **Maize** (5): kharif_ndvi ∈ (0.5, 0.7]
- **Fallow** (0): Everything else

**Example:**
```bash
curl "http://localhost:8000/tiles/crop-type"
```

---

### GET /tiles/stress

Returns moisture stress index derived from NDWI. Red = drought, Green = adequate water.

**Parameters:**
- `date_start` (query, optional): YYYY-MM-DD, default `2023-06-01`
- `date_end` (query, optional): YYYY-MM-DD, default `2023-11-30`

**Response (200):**
```json
{
  "tile_url": "https://earthengine.googleapis.com/v1/projects/cropwise-ai-499810/maps/ghi789/tiles/{z}/{x}/{y}",
  "attribution": "Map tiles by Google Earth Engine | Imagery © Copernicus/ESA Sentinel-2",
  "layer_name": "Moisture Stress",
  "is_mock": false,
  "legend": {
    "none":     { "label": "No Stress",       "color": "#639922" },
    "mild":     { "label": "Mild Stress",     "color": "#EF9F27" },
    "moderate": { "label": "Moderate Stress", "color": "#BA7517" },
    "severe":   { "label": "Severe Stress",   "color": "#E24B4A" }
  }
}
```

**Example:**
```bash
curl "http://localhost:8000/tiles/stress"
```

---

## 2. Fields Endpoints

Per-field timeseries and advisory data.

### GET /fields/{id}/advisory

Returns today's irrigation advisory for a specific field.

**Parameters:**
- `field_id` (path, required): Integer 1–8 (seeded fields)

**Response (200):**
```json
{
  "field_id": 1,
  "zone_name": "Vidarbha-Rice-01",
  "crop_type": "Rice",
  "area_ha": 2340,
  "growth_stage": "Flowering",
  "ndvi": 0.52,
  "stress_class": "Moderate",
  "soil_moisture_pct": 45.3,
  "rainfall_mm": 8.0,
  "days_since_rain": 5,
  "advisory_status": "Irrigate Soon",
  "timeline_days": 3,
  "water_amount_mm": 25.0,
  "duration_hours": 2.5,
  "best_time": "4:00–8:00 AM",
  "advisory_text": "Water deficit of 25mm with moderate stress at Flowering stage. Irrigate within 3 days with 25mm to maintain yield."
}
```

**Advisory Status Values:**
- `Irrigate Now` → Critical (deficit > 40mm OR stress = Severe)
- `Irrigate Soon` → High (deficit 20–40mm OR stress = Moderate)
- `No Action` → Low (deficit < 20mm OR stress < Moderate)

**Response (404):**
```json
{ "detail": "Field not found" }
```

**Example:**
```bash
curl "http://localhost:8000/fields/1/advisory"
curl "http://localhost:8000/fields/5/advisory"
```

---

### GET /fields/{id}/timeseries

Returns 60-day NDVI/NDWI/stress timeseries for a field.

**Parameters:**
- `field_id` (path, required): Integer 1–8

**Response (200):**
```json
[
  {
    "obs_date": "2024-08-15",
    "ndvi": 0.35,
    "ndwi": 0.19,
    "evi": 0.30,
    "growth_stage": "Sowing",
    "stress_class": "Mild",
    "deficit_mm": 15.2
  },
  {
    "obs_date": "2024-08-16",
    "ndvi": 0.38,
    "ndwi": 0.21,
    "evi": 0.32,
    "growth_stage": "Vegetative",
    "stress_class": "Mild",
    "deficit_mm": 14.8
  },
  ...
]
```

**Stress Classes:**
- `None` (CWSI < 0.25)
- `Mild` (CWSI 0.25–0.50)
- `Moderate` (CWSI 0.50–0.75)
- `Severe` (CWSI > 0.75)

**Example:**
```bash
curl "http://localhost:8000/fields/1/timeseries"
```

---

## 3. Alerts Endpoint

### GET /alerts

Returns all critical/high/medium-risk alerts across all fields.

**Response (200):**
```json
[
  {
    "id": 5,
    "field_id": 2,
    "zone_name": "Wardha-Cotton-02",
    "risk_level": "critical",
    "message": "Critical water deficit of 45mm detected with severe stress at Flowering stage. Irrigate immediately to prevent yield loss.",
    "created_at": "2024-10-15T09:30:00"
  },
  {
    "id": 3,
    "field_id": 6,
    "zone_name": "Yavatmal-Cotton-06",
    "risk_level": "high",
    "message": "Water deficit of 28mm with moderate stress at Flowering stage. Irrigate within 3 days with 28mm to maintain yield.",
    "created_at": "2024-10-14T14:22:00"
  }
]
```

**Risk Levels:**
- `critical` → Action required now
- `high` → Action required within 1–3 days
- `medium` → Monitor, irrigate if rain doesn't arrive
- (low/none not returned)

**Example:**
```bash
curl "http://localhost:8000/alerts"
```

---

## 4. Health Endpoint

### GET /health

Returns service status and GEE initialization status.

**Response (200):**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "gee_ready": true
}
```

- `status` = "ok" if all systems operational
- `gee_ready` = true if Google Earth Engine initialized
- `gee_ready` = false if `USE_MOCK_GEE=true` or GEE not authenticated

**Example:**
```bash
curl "http://localhost:8000/health"
```

---

## Headers

### X-Internal-Key (Required)

All endpoints except `/health`, `/docs`, `/openapi.json`, `/redoc` require:

```
X-Internal-Key: <INTERNAL_API_KEY>
```

The **proxy server injects this automatically**. When calling backend directly (not via proxy), provide it manually:

```bash
curl -H "X-Internal-Key: your_key_here" http://localhost:8000/tiles/ndvi
```

---

## Error Responses

### 400 Bad Request
Invalid parameters.
```json
{ "detail": "..." }
```

### 403 Forbidden
Missing or invalid `X-Internal-Key`.
```json
{ "detail": "Forbidden" }
```

### 404 Not Found
Resource not found (e.g., field doesn't exist).
```json
{ "detail": "Field not found" }
```

### 500 Internal Server Error
Backend error.
```json
{ "detail": "..." }
```

---

## Rate Limiting

Proxy applies rate limits:
- **200 requests per 60 seconds** per IP

Response when rate-limited:
```json
{ "error": "Too many requests, slow down." }
```

---

## CORS

Frontend origin must be in `ALLOWED_ORIGINS` in backend `.env`:
```env
ALLOWED_ORIGINS=http://localhost:4000,http://localhost:5173
```

---

## Pagination / Limits

- **Alerts**: Max 20 returned
- **Timeseries**: Default 60 days (configurable, max 365)

---

## Response Times

| Endpoint | First Call | Cached |
|----------|-----------|--------|
| `/tiles/ndvi` | 30–60s | <100ms |
| `/tiles/crop-type` | 30–60s | <100ms |
| `/tiles/stress` | 30–60s | <100ms |
| `/fields/{id}/advisory` | <100ms | <100ms |
| `/fields/{id}/timeseries` | <100ms | <100ms |
| `/alerts` | <100ms | <100ms |
| `/health` | <10ms | <10ms |

*Tile endpoints slow on first call due to GEE computation; subsequent requests within 24 hours return cached.*

---

## Integrations

- **Frontend**: Calls via proxy at `http://localhost:4000/api`
- **Database**: PostgreSQL with PostGIS extension
- **Geospatial**: Shapelyfor polygon operations
- **Satellite Data**: Google Earth Engine (Sentinel-2 SR Harmonized)

---

## Example Workflows

### 1. Load Map with Tiles

```javascript
// Frontend via proxy
const tiles = await fetch('http://localhost:4000/api/tiles/crop-type').then(r => r.json());
L.tileLayer(tiles.tile_url, { 
  attribution: tiles.attribution,
  opacity: 0.75 
}).addTo(map);
```

### 2. Show Field Advisory

```javascript
const advisory = await fetch(`http://localhost:4000/api/fields/1/advisory`).then(r => r.json());
console.log(`${advisory.zone_name}: ${advisory.advisory_text}`);
```

### 3. List Alerts

```javascript
const alerts = await fetch('http://localhost:4000/api/alerts').then(r => r.json());
alerts.forEach(a => console.log(`🚨 ${a.zone_name}: ${a.message}`));
```

---

## See Also

- [SETUP.md](./SETUP.md) — Full setup & architecture
- [QUICKSTART.md](./QUICKSTART.md) — 5-minute quickstart
- [README.md](./README.md) — Backend overview
