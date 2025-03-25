"use client";

import { useState } from "react";
import { Map, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { io } from "socket.io-client";
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

const socket = io("http://localhost:3005", {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});

const Page = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const { reports, setReports, globalSettings } = useData();

  const mapCenter = {
    longitude: globalSettings?.mapCenterLng,
    latitude: globalSettings?.mapCenterLat,
  };

  const [selectedReport, setSelectedReport] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState(false);

  if (!globalSettings) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading map...
      </div>
    );
  }

  const maxBounds = [
    globalSettings.mapBoundsSwLng,
    globalSettings.mapBoundsSwLat,
    globalSettings.mapBoundsNeLng,
    globalSettings.mapBoundsNeLat,
  ];

  const handleDelete = async (reportId: string) => {
    if (!userId) {
      console.error("❌ No user ID found, cannot delete report");
      return;
    }

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
  };

  return (
    <div className="h-[calc(100vh-76px)] w-screen relative">
      <div className="absolute z-10 p-2">
        <SettingsContainer />
      </div>
      <Map
        initialViewState={{
          latitude: globalSettings?.mapCenterLat,
          longitude: globalSettings?.mapCenterLng,
          zoom: globalSettings?.mapZoom,
        }}
        minZoom={globalSettings?.mapMinZoom || 10}
        maxZoom={globalSettings?.mapMaxZoom || 18}
        maxBounds={maxBounds}
        style={{ width: "100%", height: "100%", position: "relative" }}
        //mapStyle={"http://10.42.0.1:8080/styles/basic-preview/style.json"}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
      >
        <ReportMarkers setSelectedReport={setSelectedReport} userId={userId} />
        {editing ? (
          <Popup
            latitude={selectedReport?.lat}
            longitude={selectedReport?.long}
            offset={10}
            onClose={() => setEditing(false)}
          >
            <PopupForm
              latitude={selectedReport?.lat}
              longitude={selectedReport?.long}
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
        {(session || globalSettings.submitReportsOpen) && (
          <AddMarkerButton
            isAdding={isAdding}
            toggleMarker={() => setIsAdding(!isAdding)}
          ></AddMarkerButton>
        )}
        {(session || globalSettings.submitReportsOpen) && (
          <ReportSubmissionMarker
            mapCenter={mapCenter}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
          ></ReportSubmissionMarker>
        )}
      </Map>
    </div>
  );
};

export default Page;
