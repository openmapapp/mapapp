"use client";

import { useState, useEffect, useRef } from "react";
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { io } from "socket.io-client";
import { useData } from "./components/layout/DataProvider";
import { useSession } from "./lib/auth-client";
import { deleteReport } from "@/actions/deleteReport";
import ReportMarkers from "./components/map/ReportMarkers";
import ReportPopup from "./components/map/ReportPopup";
import AddMarkerButton from "./components/map/AddMarkerButton";
import ReportSubmissionMarker from "./components/map/ReportSubmissionMarker";
import TimeRangeSlider from "./components/map/settings/TimeRangeSlider";
import SettingsContainer from "./components/map/settings/SettingsContainer";

const socket = io("http://localhost:3005", {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});

const Page = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const { reports, setReports } = useData();

  const [mapCenter, setMapCenter] = useState({
    longitude: parseFloat(
      process.env.NEXT_PUBLIC_MAP_CENTER_LONG || "-73.935424"
    ),
    latitude: parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LAT || "40.730610"),
  });

  const [selectedReport, setSelectedReport] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const mapRef = useRef(null);

  const getBoundsFromEnv = () => {
    const sw = process.env.NEXT_PUBLIC_MAP_BOUNDS_SW?.split(",").map(Number);
    const ne = process.env.NEXT_PUBLIC_MAP_BOUNDS_NE?.split(",").map(Number);

    if (sw?.length === 2 && ne?.length === 2) {
      return [sw[0], sw[1], ne[0], ne[1]];
    }

    return undefined;
  };

  const maxBounds = getBoundsFromEnv();

  const handleDelete = async (reportId: string) => {
    if (!userId) {
      console.error("❌ No user ID found, cannot delete report");
      return;
    }

    const response = await deleteReport(reportId, userId);
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

  // Function to update popup position when marker is clicked
  const updatePopupPosition = () => {
    if (!selectedReport || !mapRef.current) return;

    const markerElement = document.querySelector(
      `[data-marker-id="${selectedReport.id}"]`
    );

    if (markerElement) {
      const markerRect = markerElement.getBoundingClientRect();
      setPopupPosition({
        x: markerRect.left + markerRect.width / 2,
        y: markerRect.top,
      });
    }
  };

  // Ensure popup repositions on map movement
  useEffect(() => {
    if (selectedReport) updatePopupPosition();
  }, [selectedReport]);

  return (
    <div className="h-[calc(100vh-66px)] w-screen relative">
      <div className="absolute left-4 top-4 z-10 p-2">
        <SettingsContainer />
      </div>
      <Map
        initialViewState={{
          longitude: mapCenter.longitude,
          latitude: mapCenter.latitude,
          zoom: 13,
        }}
        minZoom={Number(process.env.NEXT_PUBLIC_MAP_MIN_ZOOM || 10)}
        maxZoom={Number(process.env.NEXT_PUBLIC_MAP_MAX_ZOOM || 18)}
        maxBounds={maxBounds}
        ref={mapRef}
        style={{ width: "100%", height: "100%", position: "relative" }}
        //mapStyle={"http://159.65.164.132:8080/data/v3.json"}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
      >
        <ReportMarkers setSelectedReport={setSelectedReport} userId={userId} />
        <ReportPopup
          selectedReport={selectedReport}
          setSelectedReport={setSelectedReport}
          session={session}
          popupPosition={popupPosition}
          handleDelete={handleDelete}
        />
        {session && (
          <AddMarkerButton
            isAdding={isAdding}
            toggleMarker={() => setIsAdding(!isAdding)}
          ></AddMarkerButton>
        )}
        {session && (
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
