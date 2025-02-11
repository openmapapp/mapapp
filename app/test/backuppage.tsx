"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { io } from "socket.io-client";
import { Map, Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { getReports } from "@/actions/getReports";
import { getReportTypes } from "@/actions/getReportTypes";
import { deleteReport } from "@/actions/deleteReport";
import { useSession } from "./lib/auth-client";
import { motion, AnimatePresence } from "motion/react";
import AddMarkerButton from "./components/map/AddMarkerButton";
import ReportSubmissionMarker from "./components/map/ReportSubmissionMarker";
import Image from "next/image";
import officer from "../public/officer.png";
import car from "../public/car.png";
import roadblock from "../public/roadblock.png";
import ice from "../public/raid.png";
import caution from "../public/caution.png";
import smoke from "../public/smoke.png";
import marker from "../public/marker.png";

const socket = io("http://localhost:3005", {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});

type Report = {
  id: string;
  long: number;
  lat: number;
  reportTypeId: string;
  trustScore: number;
  createdAt: string;
  isRemoving?: boolean; // This is our temporary flag for exit animations
};

const Page = () => {
  const { data: session, isPending, error } = useSession();
  const userId = session?.user?.id || "";
  const trustScore = session?.user?.trust;
  const [mapCenter, setMapCenter] = useState({
    longitude: process.env.NEXT_PUBLIC_MAP_CENTER_LONG,
    latitude: process.env.NEXT_PUBLIC_MAP_CENTER_LAT,
  });
  const [showFormPopup, setShowFormPopup] = useState(!session);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportTypes, setReportTypes] = useState([]);
  const [newReportId, setNewReportId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [playStagger, setPlayStagger] = useState(false);

  const getBoundsFromEnv = () => {
    const sw = process.env.NEXT_PUBLIC_MAP_BOUNDS_SW?.split(",").map(Number);
    const ne = process.env.NEXT_PUBLIC_MAP_BOUNDS_NE?.split(",").map(Number);

    if (sw?.length === 2 && ne?.length === 2) {
      return [
        [sw[0], sw[1]],
        [ne[0], ne[1]],
      ];
    }

    return undefined;
  };

  const maxBounds = getBoundsFromEnv();

  // Fetch report types only once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const serverReports = await getReports();
        setReports(serverReports);
        const types = await getReportTypes();
        setReportTypes(types);
      } catch (error) {
        console.error("Error fetching report types:", error);
      }
    };
    fetchData();

    // Listen for real-time updates from WebSockets
    socket.on("new-report", (data) => {
      // Extract the report from the WebSocket event
      const newReport = Array.isArray(data) ? data[1] : data;

      setNewReportId(newReport.id);

      setReports((prevReports) => {
        if (prevReports.some((r) => r.id === newReport.id)) {
          return prevReports; // Prevent duplicates
        }
        return [...prevReports, { ...newReport }];
      });

      setTimeout(() => setNewReportId(null), 2000);
    });

    // Listen for "report-deleted" events
    socket.on("report-deleted", ({ reportId }) => {
      console.log(`🗑️ Report deleted: ${reportId}`);
      setReports((prevReports) => prevReports.filter((r) => r.id !== reportId));
    });

    // Clean up both event listeners on unmount
    return () => {
      socket.off("new-report");
      socket.off("report-deleted"); // ✅ Cleanup the delete event
    };
  }, []);

  useEffect(() => {
    if (reports.length > 0) {
      setPlayStagger(true);
    }
  }, [reports.length]);

  const reportTypeIcons = {
    1: officer,
    2: car,
    3: roadblock,
    4: ice,
    5: caution,
    6: smoke,
  };

  // Function to determine color based on trust level
  const getMarkerColor = (trustScore: number) => {
    if (trustScore >= 4)
      return "bg-green-300 shadow-green-400 before:border-t-green-300"; // High trust (green)
    if (trustScore >= 2)
      return "bg-yellow-300 shadow-yellow-400 before:border-t-yellow-300"; // Medium trust (yellow)
    return "bg-red-300 shadow-red-400 before:border-t-red-300"; // Low trust (red)
  };

  // Function to determine opacity based on age of report
  const getMarkerOpacity = (createdAt: string) => {
    const reportDate = new Date(createdAt);
    const now = new Date();
    const hoursElapsed =
      (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60);

    if (hoursElapsed < 1) return "1";
    if (hoursElapsed < 3) return "0.8";
    if (hoursElapsed < 6) return "1";
    if (hoursElapsed < 12) return "1";
    return "1";
  };

  // Handle the drag end event to update the marker's position

  // Sync marker position with map center
  const handleMapMove = (e: any) => {
    setMapCenter({
      longitude: e.viewState.longitude,
      latitude: e.viewState.latitude,
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: -50 },
    show: { opacity: 1, y: 0 },
  };

  // const memoizedMarkers = useMemo(
  //   () =>
  //     reports.map((report) => {
  //       const iconSrc = reportTypeIcons[report.reportTypeId] || marker;
  //       const markerColor = getMarkerColor(report.trustScore);
  //       const isNew = report.id === newReportId;

  //       return (
  //         <Marker
  //           key={report.id}
  //           longitude={report.long}
  //           latitude={report.lat}
  //           color={getMarkerColor(report.trustScore)}
  //           opacity={getMarkerOpacity(report.createdAt)}
  //           anchor="bottom"
  //           onClick={() => setSelectedReport(report)}
  //         >
  //           {iconSrc && (
  //             <motion.div
  //               variants={isNew ? undefined : item}
  //               initial={isNew ? { opacity: 0, y: -50 } : undefined}
  //               animate={isNew ? { opacity: 1, y: 0 } : undefined}
  //               layout={"position"}
  //             >
  //               <div
  //                 className={`relative flex items-center justify-center h-12 w-12 rounded-full opacity-95 shadow-md ${markerColor} p-1 before:content-[''] before:absolute before:bottom-[-28px] before:left-1/2 before:-translate-x-1/2 before:border-[15px] before:border-transparent -translate-y-4`}
  //               >
  //                 <Image
  //                   src={iconSrc}
  //                   alt="Report Marker"
  //                   style={{ width: "40px", height: "40px" }} // Adjust size as needed
  //                 />
  //               </div>
  //             </motion.div>
  //           )}
  //         </Marker>
  //       );
  //     }),
  //   [reports]
  // );

  const handleDelete = async (reportId: string) => {
    if (!userId) {
      console.error("❌ No user ID found, cannot delete report");
      return;
    }

    const response = await deleteReport(reportId, userId);
    if (response.error) {
      console.error("❌ Delete failed:", response.error);
      return;
    }

    setReports((prevReports) =>
      prevReports.map((r) =>
        r.id === reportId ? { ...r, isRemoving: true } : r
      )
    );

    setTimeout(() => {
      setReports((prevReports) => prevReports.filter((r) => r.id !== reportId));
    }, 200);

    // setReports((prevReports) => prevReports.filter((r) => r.id !== reportId));
    // setSelectedReport(null);

    socket.emit("report-deleted", { reportId });
  };

  return (
    <div className="h-[calc(100vh-66px)] w-screen relative">
      <div className="absolute left-10 top-10 z-10"></div>
      <Map
        initialViewState={{
          longitude: mapCenter.longitude,
          latitude: mapCenter.latitude,
          zoom: 13,
        }}
        minZoom={process.env.NEXT_PUBLIC_MAP_MIN_ZOOM || 10}
        maxZoom={process.env.NEXT_PUBLIC_MAP_MAX_ZOOM || 18}
        maxBounds={maxBounds}
        onMove={handleMapMove}
        style={{ width: "100%", height: "100%", position: "relative" }}
        //mapStyle={"http://159.65.164.132:8080/data/v3.json"}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
      >
        <AnimatePresence>
          <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            key={playStagger}
          >
            {reports.map((report) => {
              if (report.isRemoving) return null; // Skip rendering if marked for removal

              const iconSrc = reportTypeIcons[report.reportTypeId] || marker;
              const markerColor = getMarkerColor(report.trustScore);
              const isNew = report.id === newReportId;

              return (
                <Marker
                  key={report.id}
                  longitude={report.long}
                  latitude={report.lat}
                  color={getMarkerColor(report.trustScore)}
                  opacity={getMarkerOpacity(report.createdAt)}
                  anchor="bottom"
                  onClick={() => setSelectedReport(report)}
                >
                  {iconSrc && (
                    <motion.div
                      //key={report.id}
                      layout="position" // Prevents movement from triggering animations
                      variants={isNew ? undefined : item} // Use variants only for old markers
                      initial={isNew ? { opacity: 0, y: -50 } : undefined} // Only animate new markers
                      animate={
                        isNew
                          ? {
                              opacity: 1,
                              y: 0,
                              transition: { duration: 0.3, ease: "easeOut" },
                            }
                          : undefined
                      }
                      exit={{
                        opacity: 0,
                        y: -50,
                        transition: { duration: 0.2, ease: "easeIn" },
                      }}
                    >
                      <div
                        className={`relative flex items-center justify-center h-12 w-12 rounded-full opacity-95 shadow-md ${markerColor} p-1 before:content-[''] before:absolute before:bottom-[-28px] before:left-1/2 before:-translate-x-1/2 before:border-[15px] before:border-transparent -translate-y-4`}
                      >
                        <Image
                          src={iconSrc}
                          alt="Report Marker"
                          style={{ width: "40px", height: "40px" }} // Adjust size as needed
                        />
                      </div>
                    </motion.div>
                  )}
                </Marker>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Display popup if a report is selected */}
        {selectedReport && (
          <Popup
            longitude={selectedReport.long}
            latitude={selectedReport.lat}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setSelectedReport(null)}
            anchor="top"
          >
            <div className="p-3 bg-white rounded shadow">
              <h3 className="font-bold">Food Truck Report</h3>
              <p className="text-sm">
                {selectedReport.description || "No description provided"}
              </p>
              <p>Submitted: {selectedReport.createdAt[0]}</p>
              <p>Most recent confirmation: </p>
              {session &&
                session?.user?.id !== selectedReport.submittedById && (
                  <div className="flex justify-between mt-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      //onClick={() => handleVote(selectedReport.id, "confirm")}
                    >
                      ✅ I See It
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      //onClick={() => handleVote(selectedReport.id, "disconfirm")}
                    >
                      ❌ I Don&apos;t See It
                    </button>
                  </div>
                )}
              {/* ✅ Show Delete Button if User Owns the Report */}
              {session?.user?.id === selectedReport.submittedById && (
                <button
                  className="bg-red-500 text-white px-3 py-1 mt-2 rounded hover:bg-red-700 transition"
                  onClick={() => handleDelete(selectedReport.id)}
                >
                  🗑️ Delete Report
                </button>
              )}
            </div>
          </Popup>
        )}

        {session ? (
          <>
            <AddMarkerButton
              isAdding={isAdding}
              toggleMarker={() => setIsAdding(!isAdding)}
            />

            <ReportSubmissionMarker
              mapCenter={mapCenter}
              isAdding={isAdding}
              setIsAdding={setIsAdding}
            />
          </>
        ) : (
          <>
            {showFormPopup && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-sm shadow-sm">
                <button
                  onClick={() => setShowFormPopup(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
                <p className="text-black">
                  Please sign in to interact with the map.
                </p>
              </div>
            )}
          </>
        )}
      </Map>
    </div>
  );
};

export default Page;
