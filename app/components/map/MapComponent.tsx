// components/map/MapComponent.tsx
"use client";

import { useRef, useEffect } from "react";
import { Map, Popup, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import PopupForm from "./PopupForm";
import ReportMarkers from "./ReportMarkers";
import ReportPopup from "./ReportPopup";
import AddMarkerButton from "./AddMarkerButton";
import ReportSubmissionMarker from "./ReportSubmissionMarker";

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
      <ReportMarkers
        setSelectedReport={setSelectedReport}
        userId={userId}
        hoveredReportId={hoveredReportId}
      />

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

      {/* Mobile-friendly add marker button */}
      {(session || globalSettings.submitReportsOpen) && (
        <div className="absolute top-4 left-4 md:top-3 md:left-6 z-10">
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
