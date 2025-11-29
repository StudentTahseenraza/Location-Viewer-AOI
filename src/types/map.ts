import type { LatLngExpression, LatLngBounds } from 'leaflet';

export type FeatureType = 'polygon' | 'rectangle' | 'circle' | 'polyline';

export interface AOIFeature {
  id: string;
  type: FeatureType;
  coordinates: LatLngExpression[] | LatLngExpression;
  radius?: number;
  createdAt: Date;
  name?: string;
}

export interface MapState {
  center: LatLngExpression;
  zoom: number;
  bounds?: LatLngBounds;
}

export interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: string[];
}

export interface GeocodingResponse extends SearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  class: string;
  type: string;
  importance: number;
}
