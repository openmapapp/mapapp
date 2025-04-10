"use client";

import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Map, Popup, MapRef, Source, Layer } from "react-map-gl/maplibre";
import { heatmapLayer } from "./layers/HeatMapLayer";
import "maplibre-gl/dist/maplibre-gl.css";
import PopupForm from "./PopupForm";
import ReportMarkers from "./ReportMarkers";
import ReportPopup from "./ReportPopup";
import AddMarkerButton from "./AddMarkerButton";
import ReportSubmissionMarker from "./ReportSubmissionMarker";
import FilterNotification from "./FilterNotification";
import FilterStatus from "./FilterStatus";
import { useData } from "@/context/DataProvider";
import RefreshButton from "./RefreshButton";

interface MapComponentProps {
  globalSettings: any;
  selectedReport: any;
  setSelectedReport: (report: any) => void;
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  userId: string;
  session: any;
  handleDelete: (reportId: string) => void;
  hoveredReportId: number | null;
}

const MapComponent = ({
  globalSettings,
  selectedReport,
  setSelectedReport,
  isAdding,
  setIsAdding,
  editing,
  setEditing,
  userId,
  session,
  handleDelete,
  hoveredReportId,
}: MapComponentProps) => {
  const mapRef = useRef<MapRef | null>(null);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [heatmapIntensity, setHeatmapIntensity] = useState(5);
  const [heatmapRadius, setHeatmapRadius] = useState(20);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.7);
  const { reports, filteredReports, filters } = useData();

  const mapCenter = {
    longitude: globalSettings.mapCenterLng || -73.935242,
    latitude: globalSettings.mapCenterLat || 40.73061,
  };

  // Max bounds with nullish coalescing
  const maxBounds = [
    globalSettings.mapBoundsSwLng ?? -180,
    globalSettings.mapBoundsSwLat ?? -90,
    globalSettings.mapBoundsNeLng ?? 180,
    globalSettings.mapBoundsNeLat ?? 90,
  ];

  // Adds click away functionality for map popups
  useEffect(() => {
    if (!mapRef.current) return;

    // Function to handle clicks on the map
    const handleMapClick = (e: any) => {
      // Only proceed if we have a selected report
      if (selectedReport) {
        // Check if the click is on a popup or marker
        const isClickOnPopup =
          e.originalEvent?.target?.closest(".maplibregl-popup");
        const isClickOnMarker =
          e.originalEvent?.target?.closest(".maplibregl-marker");

        // If click is not on a popup or marker, close the popup
        if (!isClickOnPopup && !isClickOnMarker) {
          setSelectedReport(null);
        }
      }
    };

    // Add the click handler to the map
    mapRef.current.on("click", handleMapClick);

    // Clean up the event listener
    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", handleMapClick);
      }
    };
  }, [mapRef.current, selectedReport, setSelectedReport]);

  // Use filtered reports when filtering is active, otherwise use all reports
  const displayReports = filters.isFiltering ? filteredReports : reports;

  // Format reports for the heatmap
  const heatmapData = {
    type: "FeatureCollection",
    features: displayReports.map((report) => ({
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [report.long, report.lat],
      },
    })),
  };

  // Lazy load components that aren't needed immediately
  const SettingsContainer = lazy(
    () => import("@/app/components/map/settings/SettingsContainer")
  );

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        latitude: globalSettings.mapCenterLat,
        longitude: globalSettings.mapCenterLng,
        zoom: globalSettings.mapZoom,
      }}
      minZoom={globalSettings.mapMinZoom || 10}
      maxZoom={globalSettings.mapMaxZoom || 18}
      maxBounds={maxBounds}
      style={{ width: "100%", height: "100%" }}
      mapStyle={"http://127.0.0.1:8080/styles/basic-preview/style.json"}
      touchZoomRotate={true}
      dragRotate={false}
      attributionControl={false}
    >
      {/* Heatmap Layer */}
      {heatmapEnabled && (
        <Source id="heatmap-source" type="geojson" data={heatmapData}>
          <Layer
            {...heatmapLayer}
            id="heatmap-layer"
            source="heatmap-source"
            paint={{
              ...heatmapLayer.paint,
              "heatmap-intensity": heatmapIntensity / 10,
              "heatmap-radius": heatmapRadius,
              "heatmap-opacity": heatmapOpacity,
            }}
          />
        </Source>
      )}

      {/* Report Markers */}
      {!heatmapEnabled && (
        <ReportMarkers
          setSelectedReport={setSelectedReport}
          userId={userId}
          hoveredReportId={hoveredReportId}
        />
      )}

      {editing ? (
        <Popup
          latitude={selectedReport?.lat || 0}
          longitude={selectedReport?.long || 0}
          offset={10}
          onClose={() => setEditing(false)}
        >
          <PopupForm
            latitude={selectedReport?.lat || 0}
            longitude={selectedReport?.long || 0}
            existingReport={selectedReport}
            setSelectedReport={setSelectedReport}
            setEditing={setEditing}
            onClose={() => setEditing(false)}
          />
        </Popup>
      ) : (
        <ReportPopup
          selectedReport={selectedReport}
          setSelectedReport={setSelectedReport}
          setEditing={setEditing}
          session={session}
          handleDelete={handleDelete}
        />
      )}

      <div className="absolute settings-container">
        <Suspense
          fallback={
            <div className="p-2 bg-background/80 rounded-md">
              Loading settings...
            </div>
          }
        >
          <SettingsContainer
            // Pass heatmap props
            setHeatmapEnabled={setHeatmapEnabled}
            heatmapEnabled={heatmapEnabled}
            setHeatmapIntensity={setHeatmapIntensity}
            heatmapIntensity={heatmapIntensity}
            setHeatmapRadius={setHeatmapRadius}
            heatmapRadius={heatmapRadius}
            setHeatmapOpacity={setHeatmapOpacity}
            heatmapOpacity={heatmapOpacity}
          />
        </Suspense>
      </div>

      {/* Filter notification banner */}
      <FilterNotification />

      {/* Filter status display */}
      <FilterStatus />

      {/* Add the refresh button in a suitable position */}
      <div className="absolute top-4 right-4 z-10">
        <RefreshButton />
      </div>

      {/* Mobile-friendly add marker button */}
      {(session || globalSettings.submitReportsOpen) && (
        <div className="absolute top-4 left-4 md:top-3 md:left-6 add-marker-button">
          <AddMarkerButton
            isAdding={isAdding}
            toggleMarker={() => setIsAdding(!isAdding)}
          />
        </div>
      )}

      {(session || globalSettings.submitReportsOpen) && (
        <ReportSubmissionMarker
          mapCenter={mapCenter}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
        />
      )}

      {/* Custom attribution */}
      <div className="absolute bottom-0 left-0 bg-background/80 text-xs p-1 z-10">
        © MapTiler © OpenStreetMap
      </div>
    </Map>
  );
};

export default MapComponent;
