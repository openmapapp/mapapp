"use client";

import { useState, useEffect, useRef } from "react";
import { Map, Popup, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { io, Socket } from "socket.io-client";
import { useData } from "./components/layout/DataProvider";
import { useSession } from "./lib/auth-client";
import type { Session } from "./lib/auth-client";
import { deleteReport } from "@/actions/deleteReport";
import PopupForm from "./components/map/PopupForm";
import ReportMarkers from "./components/map/ReportMarkers";
import ReportPopup from "./components/map/ReportPopup";
import AddMarkerButton from "./components/map/AddMarkerButton";
import ReportSubmissionMarker from "./components/map/ReportSubmissionMarker";
import SettingsContainer from "./components/map/settings/SettingsContainer";

// Define proper types for reports and events
interface Report {
  id: number;
  lat: number;
  long: number;
  reportTypeId: number;
  description?: Record<string, any>;
  image?: string;
  createdAt: string;
  submittedById?: string;
  confirmationCount: number;
  disconfirmationCount: number;
  isVisible: boolean;
  reportType?: {
    id: number;
    name: string;
    fields: Record<string, any>;
  };
  submittedBy?: {
    id: string;
    name: string;
  };
}

interface ServerToClientEvents {
  "report-added": (data: { report: Report }) => void;
  "report-updated": (data: { report: Report }) => void;
  "report-deleted": (data: { reportId: string | number }) => void;
  "report-voted": (data: { reportId: string | number; value: number }) => void;
}

interface ClientToServerEvents {
  "report-deleted": (data: { reportId: string | number }) => void;
  "report-added": (data: { report: Report }) => void;
  "report-updated": (data: { report: Report }) => void;
  "report-voted": (data: {
    reportId: string | number;
    userId: string;
    value: number;
  }) => void;
}

// Initialize the socket with proper types
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3005",
  {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  }
);

const Page = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const { reports, setReports, globalSettings } = useData();
  const mapRef = useRef<MapRef | null>(null);
  const mapCenter = globalSettings
    ? {
        longitude: globalSettings.mapCenterLng || -73.935242,
        latitude: globalSettings.mapCenterLat || 40.73061,
      }
    : {
        longitude: -73.935242,
        latitude: 40.73061,
      };
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);

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
  }, [mapRef.current, selectedReport]);

  if (!globalSettings) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading map...
      </div>
    );
  }

  // Use optional chaining and nullish coalescing to handle potential undefined values
  const maxBounds = [
    globalSettings.mapBoundsSwLng ?? -180,
    globalSettings.mapBoundsSwLat ?? -90,
    globalSettings.mapBoundsNeLng ?? 180,
    globalSettings.mapBoundsNeLat ?? 90,
  ];

  const handleDelete = async (reportId: string) => {
    if (!userId) {
      console.error("❌ No user ID found, cannot delete report");
      return;
    }

    try {
      const response = await deleteReport(reportId, session);
      if (!response) {
        console.error("❌ Failed to delete report");
        return;
      }

      setReports((prevReports) =>
        prevReports.filter((r) => r.id !== Number(reportId))
      );
      setSelectedReport(null);

      socket.emit("report-deleted", { reportId });
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  // Function to handle map position changes - useful for mobile responsiveness
  const flyToSelectedReport = (report: Report) => {
    if (mapRef.current && report) {
      mapRef.current.flyTo({
        center: [report.long, report.lat],
        zoom: 16,
        duration: 1000,
      });
    }
  };

  return (
    <div className="relative h-[calc(100vh-81px)] w-full overflow-hidden">
      <div className="absolute z-10">
        <SettingsContainer />
      </div>

      <Map
        ref={mapRef}
        initialViewState={{
          latitude: globalSettings?.mapCenterLat,
          longitude: globalSettings?.mapCenterLng,
          zoom: globalSettings?.mapZoom,
        }}
        minZoom={globalSettings?.mapMinZoom || 10}
        maxZoom={globalSettings?.mapMaxZoom || 18}
        maxBounds={maxBounds}
        style={{ width: "100%", height: "100%" }}
        mapStyle={"http://127.0.0.1:8080/styles/basic-preview/style.json"}
        //mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        touchZoomRotate={true} // Enable touch zoom and rotate for mobile
        dragRotate={false} // Disable drag rotation for simpler mobile UX
        attributionControl={false} // Move attribution to a custom position
      >
        <ReportMarkers
          setSelectedReport={(report) => {
            setSelectedReport(report);
          }}
          userId={userId}
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

        {/* Mobile-friendly add marker button - repositioned for better thumb access */}
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

        {/* Custom attribution positioned for mobile */}
        <div className="absolute bottom-0 left-0 bg-background/80 text-xs p-1 z-10">
          © MapTiler © OpenStreetMap
        </div>
      </Map>
    </div>
  );
};

export default Page;
