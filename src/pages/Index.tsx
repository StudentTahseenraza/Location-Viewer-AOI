import { useState, useCallback, useRef } from 'react';
import { NavigationBar } from '@/components/sidebar/NavigationBar';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { MapContainer, MapContainerRef } from '@/components/map/MapContainer';
import { LayerToggle } from '@/components/map/LayerToggle';
import { useMapState } from '@/hooks/useMapState';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import type { AOIFeature } from '@/types/map';

const Index = () => {
  const {
    features,
    mapState,
    addFeature,
    updateFeature,
    removeFeature,
    clearFeatures,
    updateMapState,
  } = useMapState();

  const mapRef = useRef<MapContainerRef>(null);

  const [flyToLocation, setFlyToLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);
  const [showWmsLayer, setShowWmsLayer] = useState(false);

  const handleSelectLocation = useCallback(
    (lat: number, lng: number, name: string) => {
      setFlyToLocation({ lat, lng, name });
      toast.success(`Flying to ${name.split(',')[0]}`);
    },
    []
  );

  const handleFeatureCreate = useCallback(
    (feature: Parameters<typeof addFeature>[0]) => {
      addFeature(feature);
      toast.success('Area of interest created');
    },
    [addFeature]
  );

  const handleMapMove = useCallback(
    (center: Parameters<typeof updateMapState>[0]['center'], zoom: number) => {
      updateMapState({ center, zoom });
    },
    [updateMapState]
  );

  const handleFileUpload = useCallback((file: File) => {
    toast.info(`File "${file.name}" selected for upload`);
    // Future: Parse GeoJSON/KML and add to map
  }, []);

  const handleDeleteFeature = useCallback(
    (id: string) => {
      removeFeature(id);
      toast.success('Area deleted');
    },
    [removeFeature]
  );

  const handleRenameFeature = useCallback(
    (id: string, name: string) => {
      updateFeature(id, { name });
      toast.success('Area renamed');
    },
    [updateFeature]
  );

  const handleZoomToFeature = useCallback((feature: AOIFeature) => {
    mapRef.current?.zoomToFeature(feature);
  }, []);

  const handleClearAll = useCallback(() => {
    clearFeatures();
    toast.success('All areas cleared');
  }, [clearFeatures]);

  const toggleWmsLayer = useCallback(() => {
    setShowWmsLayer((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Navigation Bar */}
      <NavigationBar className="w-16 flex-shrink-0" />

      {/* Sidebar */}
      <Sidebar
        features={features}
        onSelectLocation={handleSelectLocation}
        onFileUpload={handleFileUpload}
        onDeleteFeature={handleDeleteFeature}
        onRenameFeature={handleRenameFeature}
        onZoomToFeature={handleZoomToFeature}
        onClearAll={handleClearAll}
      />

      {/* Map Area */}
      <main className="relative flex-1">
        <MapContainer
          ref={mapRef}
          center={mapState.center}
          zoom={mapState.zoom}
          features={features}
          onFeatureCreate={handleFeatureCreate}
          onMapMove={handleMapMove}
          flyToLocation={flyToLocation}
          showWmsLayer={showWmsLayer}
        />

        {/* Layer Toggle */}
        <LayerToggle showWmsLayer={showWmsLayer} onToggle={toggleWmsLayer} />
      </main>

      <Toaster position="bottom-right" />
    </div>
  );
};

export default Index;
