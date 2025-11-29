# AOI Creation - Area of Interest Definition Tool

A single-page application for defining areas of interest on satellite/drone imagery with interactive map features.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run Playwright tests
npx playwright install
npx playwright test
```

The application will be available at `http://localhost:8080`.

## 📚 Documentation

### Map Library Choice: Leaflet with react-leaflet

**Why Leaflet?**
- **Mature ecosystem**: Most widely adopted open-source mapping library with extensive documentation
- **WMS support**: Built-in `L.TileLayer.WMS` class handles WMS layers seamlessly
- **Drawing tools**: `leaflet-draw` plugin provides polygon, rectangle, and circle drawing out of the box
- **Performance**: Lightweight (~42KB gzipped) with efficient tile rendering
- **TypeScript support**: Well-maintained type definitions via `@types/leaflet`

**Alternatives Considered:**
- **MapLibre GL JS**: Better for vector tiles and 3D, but overkill for WMS raster layers
- **OpenLayers**: More powerful but heavier (~150KB) and steeper learning curve
- **react-map-gl**: Mapbox-based, requires API key and less suited for WMS

### Architecture Decisions

```
src/
├── components/
│   ├── icons/          # SVG icon components
│   ├── map/            # Map-related components
│   │   ├── MapContainer.tsx    # Leaflet map wrapper
│   │   └── LayerToggle.tsx     # WMS layer toggle
│   ├── sidebar/        # Sidebar UI components
│   │   ├── NavigationBar.tsx   # Left nav icons
│   │   ├── SearchInput.tsx     # Geocoding search
│   │   ├── ShapeUpload.tsx     # File upload UI
│   │   └── Sidebar.tsx         # Main sidebar container
│   └── ui/             # shadcn/ui components
├── hooks/
│   ├── useMapState.ts      # Map state & AOI features (localStorage)
│   └── useGeocoding.ts     # Nominatim geocoding
├── types/
│   └── map.ts              # TypeScript interfaces
└── pages/
    └── Index.tsx           # Main page orchestration
```

**Key Patterns:**
- **Composition over inheritance**: Small, focused components composed together
- **Custom hooks**: Encapsulated business logic (geocoding, state management)
- **Design system tokens**: All colors via CSS variables in `index.css`
- **Type safety**: Strict TypeScript with explicit interfaces

### Performance Considerations

**Current Implementation:**
- Debounced geocoding search (300ms delay)
- Efficient Leaflet tile caching
- Minimal re-renders via `useCallback` and proper dependency arrays

**Scaling to 1000s of Points/Polygons:**

1. **Clustering**: Use `leaflet.markercluster` for point data
2. **Canvas rendering**: Switch to `L.Canvas` renderer instead of SVG for >1000 features
3. **Viewport culling**: Only render features visible in current viewport
4. **Progressive loading**: Lazy-load features based on zoom level
5. **Virtual scrolling**: For sidebar feature lists, use virtualization
6. **Web Workers**: Offload GeoJSON parsing to background threads
7. **Simplification**: Use Douglas-Peucker algorithm to reduce polygon vertices at low zoom

### Testing Strategy

**What's Tested:**
1. **UI Rendering**: Sidebar, search input, map container visibility
2. **User Interactions**: Search functionality, layer toggle, file upload button
3. **Integration**: Geocoding API response handling

**Why These Tests:**
- Cover critical user journeys (search, draw, toggle layers)
- Validate external API integration (Nominatim)
- Ensure accessibility attributes are present

**With More Time:**
- Unit tests for hooks (`useMapState`, `useGeocoding`)
- Visual regression tests for Figma accuracy
- E2E tests for drawing tools (complex Leaflet interactions)
- Performance benchmarks with large datasets

### Tradeoffs Made

1. **OpenStreetMap base layer**: Used OSM instead of WMS-only for better UX (WMS is togglable)
2. **Nominatim for geocoding**: Free but rate-limited; production would need commercial API
3. **localStorage persistence**: Simple but not scalable; backend would be needed
4. **Minimal error boundaries**: Focused on happy path; production needs robust error handling

### Production Readiness

**Would Add:**
- [ ] Backend API for persistent AOI storage
- [ ] User authentication
- [ ] Error boundaries and fallback UI
- [ ] Sentry/error monitoring integration
- [ ] Rate limiting and caching for geocoding
- [ ] Service worker for offline capability
- [ ] Comprehensive accessibility audit
- [ ] Performance monitoring (Web Vitals)
- [ ] CI/CD pipeline with automated testing
- [ ] Environment variable management
- [ ] API documentation (OpenAPI/Swagger)

### Time Spent

| Task | Time |
|------|------|
| Design system & Figma analysis | ~30 min |
| Map integration (Leaflet + WMS) | ~1.5 hr |
| Sidebar components | ~1 hr |
| Drawing tools | ~45 min |
| Geocoding integration | ~30 min |
| State management & persistence | ~30 min |
| Playwright tests | ~45 min |
| Documentation | ~30 min |
| **Total** | **~6 hours** |

## 🗺️ API Documentation

### Geocoding (Nominatim)

```
GET https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=5

Response:
[
  {
    "display_name": "Cologne, North Rhine-Westphalia, Germany",
    "lat": "50.938361",
    "lon": "6.959974",
    "boundingbox": ["50.8304", "51.0849", "6.7725", "7.1620"]
  }
]
```

### WMS Layer (NRW Satellite)

```
URL: https://www.wms.nrw.de/geobasis/wms_nw_dop
Layers: nw_dop_rgb
Format: image/png
```

## 📊 Data Schema (Client-side)

```typescript
interface AOIFeature {
  id: string;           // UUID
  type: 'polygon' | 'rectangle' | 'circle';
  coordinates: LatLngExpression[] | LatLngExpression;
  radius?: number;      // For circles only
  createdAt: Date;
  name?: string;
}

interface MapState {
  center: LatLngExpression;
  zoom: number;
}
```

## 🎨 Design Tokens

Primary accent: `hsl(24, 95%, 53%)` (Orange)
Background: `hsl(0, 0%, 100%)` (White)
Muted: `hsl(220, 9%, 46%)` (Gray)

## License

MIT
