"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Marker, useMap } from "react-map-gl/maplibre";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useData } from "@/app/components/layout/DataProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import marker icons
import officer from "@/public/officer.png";
import car from "@/public/car.png";
import roadblock from "@/public/roadblock.png";
import ice from "@/public/raid.png";
import caution from "@/public/caution.png";
import smoke from "@/public/smoke.png";
import marker from "@/public/marker.png";

// Map report types to their corresponding icons
const reportTypeIcons: Record<number, any> = {
  1: officer,
  2: car,
  3: roadblock,
  4: ice,
  5: caution,
  6: smoke,
};

interface Report {
  id: number;
  reportTypeId: number;
  long: number;
  lat: number;
  isRemoving?: boolean;
  isVerified?: boolean;
  description: string;
  confirmationCount: number;
  disconfirmationCount: number;
  createdAt: string;
  [key: string]: any;
}

interface ReportMarkersProps {
  setSelectedReport: (report: Report | null) => void;
  userId: string;
  hoveredReportId: number | null;
}

export default function ReportMarkers({
  setSelectedReport,
  userId,
  hoveredReportId,
}: ReportMarkersProps) {
  const { reports } = useData();
  const { current: map } = useMap();
  const [newMarkers, setNewMarkers] = useState<Record<number, boolean>>({});

  // Use ref to track previous reports for comparison
  const prevReportsRef = useRef<number[]>([]);

  // Keep track of initial load to animate all markers on first render
  const isInitialLoadRef = useRef(true);

  // Add staggered delay to markers for drop animation
  const getAnimationDelay = useCallback((index: number, isNew: boolean) => {
    if (isInitialLoadRef.current) {
      // During initial load, stagger all markers
      return Math.min(index * 0.05, 1.5); // Cap at 1.5 seconds max delay
    } else if (isNew) {
      // For new markers, animate immediately
      return 0;
    }
    return 0;
  }, []);

  // Track new markers - use simpler approach to avoid infinite loop
  useEffect(() => {
    // Skip if no reports
    if (!reports || reports.length === 0) return;

    // Check for new markers by comparing with previously tracked report IDs
    const currentReportIds = reports.map((r) => r.id);
    const newMarkersFound: Record<number, boolean> = {};

    // Find reports that weren't in the previous set
    currentReportIds.forEach((id) => {
      if (!prevReportsRef.current.includes(id)) {
        newMarkersFound[id] = true;
      }
    });

    // Only update state if we have new markers and not on initial load
    if (Object.keys(newMarkersFound).length > 0 && !isInitialLoadRef.current) {
      setNewMarkers(newMarkersFound);
    }

    // Update ref for next comparison
    prevReportsRef.current = currentReportIds;

    // Set initial load to false after first render with reports
    if (isInitialLoadRef.current && reports.length > 0) {
      isInitialLoadRef.current = false;
    }
  }, [reports]);

  // Custom pin marker component
  const CustomPinMarker = ({
    icon,
    isVerified,
    isConfirmed,
    isDisputed,
    isHovered,
  }: {
    icon: any;
    isVerified: boolean;
    isConfirmed: boolean;
    isDisputed: boolean;
    isHovered: boolean;
  }) => {
    // Determine status class
    const statusClass = isVerified
      ? "map-pin-verified"
      : isConfirmed
      ? "map-pin-confirmed"
      : isDisputed
      ? "map-pin-disputed"
      : "map-pin-default";

    return (
      <div
        className={`map-pin ${statusClass} ${
          isHovered ? "map-pin-hovered" : ""
        }`}
      >
        <div className="map-pin-head">
          <Image
            src={icon}
            alt="Map marker"
            width={32}
            height={32}
            className={isDisputed ? "opacity-60" : ""}
          />
        </div>
        <div className="map-pin-needle" />
        <div className="map-pin-base" />
      </div>
    );
  };

  // Click handler for markers - fixed to work properly with map events
  const handleMarkerClick = (e: any, report: Report) => {
    // Stop event propagation to prevent the map from handling it
    if (e) {
      // Prevent all default behaviors
      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault) e.preventDefault();

      // Also stop click from reaching the map container
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
        e.nativeEvent.preventDefault();
      }
    }

    // Alternative approach to prevent map zoom/pan on marker click
    setTimeout(() => {
      // Set the selected report after a tiny delay
      setSelectedReport(report);
    }, 10);
  };

  // Direct DOM event handler for marker clicks
  useEffect(() => {
    // Function to prevent default behavior on marker clicks
    const preventDefaultOnMarkers = () => {
      // Find all marker elements
      const markerElements = document.querySelectorAll(".maplibregl-marker");

      // Add click handlers to all markers
      markerElements.forEach((markerEl) => {
        // Remove old handlers (if any) to prevent duplicates
        markerEl.removeEventListener("click", captureMarkerClick);

        // Add new handler
        markerEl.addEventListener("click", captureMarkerClick);
      });
    };

    // Function to capture and handle marker clicks
    const captureMarkerClick = (e: Event) => {
      e.stopPropagation();

      // Find the closest marker element
      const markerEl = (e.target as HTMLElement).closest(".maplibregl-marker");
      if (!markerEl) return;

      // Prevent the event from bubbling to the map
      e.preventDefault();
    };

    // Set up a mutation observer to watch for new markers being added to the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // If nodes were added, check for new markers
          preventDefaultOnMarkers();
        }
      });
    });

    // Start observing the map container
    const mapContainer = document.querySelector(".maplibregl-map");
    if (mapContainer) {
      observer.observe(mapContainer, {
        childList: true,
        subtree: true,
      });

      // Initial setup
      preventDefaultOnMarkers();
    }

    // Clean up
    return () => {
      observer.disconnect();

      // Remove event listeners
      const markerElements = document.querySelectorAll(".maplibregl-marker");
      markerElements.forEach((markerEl) => {
        markerEl.removeEventListener("click", captureMarkerClick);
      });
    };
  }, []);

  return (
    <AnimatePresence>
      {reports.map((report, index) => {
        // Skip removed markers
        if (report.isRemoving) return null;

        // Determine which icon to use
        const iconSrc = reportTypeIcons[report.reportTypeId] || marker;

        // Check if this is a new marker or part of initial load
        const isNew = newMarkers[report.id] || isInitialLoadRef.current;

        // Determine marker status for styling
        const isVerified = !!report.isVerified;
        const isConfirmed = report.confirmationCount >= 5;
        const isDisputed = report.disconfirmationCount >= 5;

        //Check if this marker is being hovered over in the sidebar
        const isHovered = hoveredReportId === report.id;

        // Parse description for tooltip
        let tooltip = "";
        try {
          if (report.description) {
            const desc = JSON.parse(report.description);
            // Take the first non-empty field for the tooltip
            const firstField = Object.entries(desc).find(
              ([_, value]) => value && String(value).trim() !== ""
            );
            if (firstField) {
              tooltip = `${firstField[0]}: ${firstField[1]}`;
            }
          }
        } catch (e) {
          tooltip = "Click for details";
        }

        return (
          <Marker
            key={report.id}
            longitude={report.long}
            latitude={report.lat}
            anchor="bottom"
            onClick={(e) => {
              // Handle both types of events
              if (e.originalEvent) {
                // This is a MapLibre event
                e.originalEvent.stopPropagation();
                e.originalEvent.preventDefault();
                handleMarkerClick(e.originalEvent, report);
              } else {
                // Direct DOM event
                handleMarkerClick(e, report);
              }
              //data-report-id={report.id}; // Set data attribute for reference
              return false; // Explicitly return false to prevent default
            }}
          >
            <TooltipProvider>
              <Tooltip delayDuration={700}>
                <TooltipTrigger asChild>
                  <div>
                    <motion.div
                      layout="position"
                      initial={{ opacity: 0, y: -30, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          damping: 12,
                          delay: getAnimationDelay(index, isNew),
                        },
                      }}
                      exit={{ opacity: 0, y: -20, scale: 0.5 }}
                      className={`cursor-pointer ${
                        isHovered ? "z-10 filter drop-shadow-lg" : ""
                      }`}
                    >
                      <CustomPinMarker
                        icon={iconSrc}
                        isVerified={isVerified}
                        isConfirmed={isConfirmed}
                        isDisputed={isDisputed}
                      />
                    </motion.div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="z-50 max-w-[200px] text-xs"
                >
                  <p>{tooltip || "Click for details"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Marker>
        );
      })}
    </AnimatePresence>
  );
}
