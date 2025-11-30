AOI Creation – Area of Interest Definition Tool

A modern single-page web application for defining Areas of Interest (AOIs) on satellite/drone imagery using an interactive map interface.

![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9+-199900?logo=leaflet&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.57+-2EAD33?logo=playwright&logoColor=white)

![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?logo=testing-library)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-success)
![Platform](https://img.shields.io/badge/Platform-Web-orange)


🚀 Quick Start
        # Install dependencies
        npm install
        
        # Start development server
        npm run dev
        
        # Install Playwright browsers
        npx playwright install
        
        # Run Playwright tests
        npx playwright test


The app will run at: http://localhost:8080


📚 Documentation
🗺️ Map Library Choice: Leaflet with react-leaflet
Why Leaflet?

✔ Mature & battle-tested mapping ecosystem

✔ Built-in WMS support (L.TileLayer.WMS)

✔ Excellent drawing tools via leaflet-draw

✔ Lightweight (~42KB gzipped)

✔ First-class TypeScript support (@types/leaflet)


Alternatives Considered
| Library            | Why Not Chosen                            |
| ------------------ | ----------------------------------------- |
| **MapLibre GL JS** | Overkill; optimized for vector tiles & 3D |
| **OpenLayers**     | Heavy (~150KB) & steep learning curve     |
| **react-map-gl**   | Requires API key; weak WMS support        |

🧩 Architecture Overview

    src/
    ├── components/
    │   ├── icons/           # SVG icon components
    │   ├── map/             # Map components
    │   │   ├── MapContainer.tsx     # Leaflet wrapper
    │   │   └── LayerToggle.tsx      # WMS toggle
    │   ├── sidebar/         # Sidebar components
    │   │   ├── NavigationBar.tsx
    │   │   ├── SearchInput.tsx
    │   │   ├── ShapeUpload.tsx
    │   │   └── Sidebar.tsx
    │   └── ui/              # shadcn/ui components
    ├── hooks/
    │   ├── useMapState.ts       # AOI state + localStorage
    │   └── useGeocoding.ts      # Nominatim geocoding logic
    ├── types/
    │   └── map.ts               # Shared TypeScript types
    └── pages/
        └── Index.tsx            # Main application entry


Key Patterns

    Composition-driven UI
    
    Custom hooks for logic separation
    
    Design tokens via CSS variables
    
    Strict TypeScript everywhere

⚡ Performance Considerations
    Current Optimizations
    
    300ms debounced geocoding
    
    Efficient Leaflet tile caching
    
    Reduced re-renders using useCallback
    
    Scaling to 1000+ AOIs
    
    Use marker clustering for many points
    
    Switch to Canvas renderer (L.Canvas)
    
    Render only viewport-visible features
    
    Progressive loading based on zoom
    
    Virtualized lists for large sidebars
    
    Use Web Workers for heavy GeoJSON loading
    
    Polygon simplification (Douglas-Peucker)

🧪 Testing Strategy
    ✔ What’s Tested
    
    UI Rendering (Sidebar, MapContainer)
    
    User Interactions (search, toggle, upload)
    
    Geocoding API integration handling

📌 Why These Tests

    Cover all critical UX flows
    
    Validate external API behavior
    
    Ensure accessibility & usability

⏳ With More Time

    Hook unit tests
    
    Visual regression (Figma accuracy)
    
    E2E drawing tests (Leaflet interactions)
    
    Performance benchmarking

⚖️ Key Tradeoffs

    OpenStreetMap base tiles → Better UX than WMS-only
    
    Nominatim geocoding → Free but rate-limited
    
    localStorage → Simple persistence; not scalable
    
    Minimal error boundaries → Focus on core features due to time constraints

🏗️ Production Readiness Checklist

    | Feature                     | Status |
    | --------------------------- | ------ |
    | Backend AOI storage         | ❌      |
    | Authentication              | ❌      |
    | Error boundaries            | ❌      |
    | Sentry monitoring           | ❌      |
    | API rate limiting           | ❌      |
    | Offline support             | ❌      |
    | Accessibility audit         | ❌      |
    | Web Vitals tracking         | ❌      |
    | CI/CD Pipeline              | ❌      |
    | Environment variable system | ❌      |
    | OpenAPI documentation       | ❌      |


⏱️ Time Spent

    | Task                           | Time         |
    | ------------------------------ | ------------ |
    | Design system & Figma analysis | ~30 min      |
    | Map + WMS integration          | ~1.5 hr      |
    | Sidebar components             | ~1 hr        |
    | Drawing tools                  | ~45 min      |
    | Geocoding                      | ~30 min      |
    | State management               | ~30 min      |
    | Playwright tests               | ~45 min      |
    | Documentation                  | ~30 min      |
    | **Total**                      | **~6 hours** |
    

🌍 API Documentation
    Geocoding (Nominatim)
    GET https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=5
    
    
    Sample Response
    
    [
      {
        "display_name": "Cologne, Germany",
        "lat": "50.938361",
        "lon": "6.959974",
        "boundingbox": ["50.8304", "51.0849", "6.7725", "7.1620"]
      }
    ]
    
    WMS (NRW Satellite Layer)
    URL:    https://www.wms.nrw.de/geobasis/wms_nw_dop
    Layers: nw_dop_rgb
    Format: image/png

📊 Data Schema
    interface AOIFeature {
      id: string;
      type: "polygon" | "rectangle" | "circle";
      coordinates: LatLngExpression[] | LatLngExpression;
      radius?: number;
      createdAt: Date;
      name?: string;
    }
    
    interface MapState {
      center: LatLngExpression;
      zoom: number;
    }


🎨 Design Tokens

    | Token          | Value               |
    | -------------- | ------------------- |
    | Primary Accent | `hsl(24, 95%, 53%)` |
    | Background     | `hsl(0, 0%, 100%)`  |
    | Muted          | `hsl(220, 9%, 46%)` |





