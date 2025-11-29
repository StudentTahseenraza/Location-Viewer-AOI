import { useState, useCallback, useEffect } from 'react';
import type { LatLngExpression } from 'leaflet';
import type { AOIFeature, MapState } from '@/types/map';

const STORAGE_KEY = 'aoi-features';
const MAP_STATE_KEY = 'map-state';

// Default center: Cologne, Germany
const DEFAULT_CENTER: LatLngExpression = [50.9375, 6.9603];
const DEFAULT_ZOOM = 11;

export function useMapState() {
  const [features, setFeatures] = useState<AOIFeature[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [mapState, setMapState] = useState<MapState>(() => {
    try {
      const stored = localStorage.getItem(MAP_STATE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          center: parsed.center || DEFAULT_CENTER,
          zoom: parsed.zoom || DEFAULT_ZOOM,
        };
      }
    } catch {
      // Ignore
    }
    return {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    };
  });

  // Persist features to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
    } catch {
      // Storage might be full
    }
  }, [features]);

  // Persist map state
  useEffect(() => {
    try {
      localStorage.setItem(MAP_STATE_KEY, JSON.stringify(mapState));
    } catch {
      // Ignore
    }
  }, [mapState]);

  const addFeature = useCallback((feature: Omit<AOIFeature, 'id' | 'createdAt'>) => {
    const newFeature: AOIFeature = {
      ...feature,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setFeatures((prev) => [...prev, newFeature]);
    return newFeature;
  }, []);

  const updateFeature = useCallback((id: string, updates: Partial<Omit<AOIFeature, 'id' | 'createdAt'>>) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  const removeFeature = useCallback((id: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearFeatures = useCallback(() => {
    setFeatures([]);
  }, []);

  const updateMapState = useCallback((updates: Partial<MapState>) => {
    setMapState((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    features,
    mapState,
    addFeature,
    updateFeature,
    removeFeature,
    clearFeatures,
    updateMapState,
  };
}
