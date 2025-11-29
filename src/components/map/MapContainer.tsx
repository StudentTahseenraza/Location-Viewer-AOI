import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import type { LatLngExpression } from 'leaflet';
import type { AOIFeature } from '@/types/map';

// Fix Leaflet default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// WMS Configuration
const WMS_URL = 'https://www.wms.nrw.de/geobasis/wms_nw_dop';
const WMS_LAYERS = 'nw_dop_rgb';

// Feature styles
const FEATURE_STYLE = {
  color: 'hsl(24, 95%, 53%)',
  weight: 2,
  fillOpacity: 0.2,
};

export interface MapContainerRef {
  zoomToFeature: (feature: AOIFeature) => void;
}

interface MapContainerProps {
  center: LatLngExpression;
  zoom: number;
  features: AOIFeature[];
  onFeatureCreate: (feature: Omit<AOIFeature, 'id' | 'createdAt'>) => void;
  onMapMove: (center: LatLngExpression, zoom: number) => void;
  flyToLocation?: { lat: number; lng: number; name: string } | null;
  showWmsLayer?: boolean;
}

export const MapContainer = forwardRef<MapContainerRef, MapContainerProps>(
  (
    {
      center,
      zoom,
      features,
      onFeatureCreate,
      onMapMove,
      flyToLocation,
      showWmsLayer = false,
    },
    ref
  ) => {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
    const wmsLayerRef = useRef<L.TileLayer.WMS | null>(null);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      zoomToFeature: (feature: AOIFeature) => {
        if (!mapRef.current) return;

        if (feature.type === 'circle' && feature.radius) {
          const [lat, lng] = feature.coordinates as [number, number];
          const circle = L.circle([lat, lng], { radius: feature.radius });
          mapRef.current.fitBounds(circle.getBounds(), { padding: [50, 50] });
        } else {
          const bounds = L.latLngBounds(feature.coordinates as L.LatLngExpression[]);
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      },
    }));

    // Initialize map
    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: center as L.LatLngExpression,
        zoom,
        zoomControl: true,
      });

      // Add base tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Initialize drawn items layer
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;

      // Initialize draw control with polyline enabled
      const drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
          polygon: {
            allowIntersection: false,
            shapeOptions: FEATURE_STYLE,
          },
          rectangle: {
            shapeOptions: FEATURE_STYLE,
          },
          circle: {
            shapeOptions: FEATURE_STYLE,
          },
          polyline: {
            shapeOptions: {
              color: FEATURE_STYLE.color,
              weight: 3,
            },
          },
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          remove: true,
        },
      });

      map.addControl(drawControl);

      // Handle draw events
      map.on(L.Draw.Event.CREATED, (e: L.LeafletEvent) => {
        const event = e as L.DrawEvents.Created;
        const layer = event.layer;
        drawnItems.addLayer(layer);

        let feature: Omit<AOIFeature, 'id' | 'createdAt'>;

        if (event.layerType === 'polygon' || event.layerType === 'rectangle') {
          const latlngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
          feature = {
            type: event.layerType as 'polygon' | 'rectangle',
            coordinates: latlngs.map((ll) => [ll.lat, ll.lng]),
          };
        } else if (event.layerType === 'circle') {
          const circle = layer as L.Circle;
          feature = {
            type: 'circle',
            coordinates: [circle.getLatLng().lat, circle.getLatLng().lng],
            radius: circle.getRadius(),
          };
        } else if (event.layerType === 'polyline') {
          const latlngs = (layer as L.Polyline).getLatLngs() as L.LatLng[];
          feature = {
            type: 'polyline',
            coordinates: latlngs.map((ll) => [ll.lat, ll.lng]),
          };
        } else {
          return;
        }

        onFeatureCreate(feature);
      });

      // Handle map move
      map.on('moveend', () => {
        const newCenter = map.getCenter();
        const newZoom = map.getZoom();
        onMapMove([newCenter.lat, newCenter.lng], newZoom);
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
      };
    }, []);

    // Toggle WMS layer
    useEffect(() => {
      if (!mapRef.current) return;

      if (showWmsLayer && !wmsLayerRef.current) {
        wmsLayerRef.current = L.tileLayer.wms(WMS_URL, {
          layers: WMS_LAYERS,
          format: 'image/png',
          transparent: true,
          attribution: '&copy; Geobasis NRW',
        });
        wmsLayerRef.current.addTo(mapRef.current);
      } else if (!showWmsLayer && wmsLayerRef.current) {
        mapRef.current.removeLayer(wmsLayerRef.current);
        wmsLayerRef.current = null;
      }
    }, [showWmsLayer]);

    // Fly to location
    useEffect(() => {
      if (!mapRef.current || !flyToLocation) return;

      mapRef.current.flyTo([flyToLocation.lat, flyToLocation.lng], 14, {
        duration: 1.5,
      });
    }, [flyToLocation]);

    // Sync existing features
    useEffect(() => {
      if (!drawnItemsRef.current) return;

      drawnItemsRef.current.clearLayers();

      features.forEach((feature) => {
        let layer: L.Layer;

        if (feature.type === 'circle' && feature.radius) {
          const [lat, lng] = feature.coordinates as [number, number];
          layer = L.circle([lat, lng], {
            radius: feature.radius,
            ...FEATURE_STYLE,
          });
        } else if (feature.type === 'polyline') {
          layer = L.polyline(feature.coordinates as L.LatLngExpression[], {
            color: FEATURE_STYLE.color,
            weight: 3,
          });
        } else {
          layer = L.polygon(feature.coordinates as L.LatLngExpression[], FEATURE_STYLE);
        }

        drawnItemsRef.current?.addLayer(layer);
      });
    }, [features]);

    return (
      <div
        ref={containerRef}
        className="w-full h-full"
        data-testid="map-container"
        role="application"
        aria-label="Interactive map for defining areas of interest"
      />
    );
  }
);

MapContainer.displayName = 'MapContainer';
