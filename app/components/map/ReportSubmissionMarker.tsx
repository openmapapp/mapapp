"use client";

import { useState, useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-map-gl/maplibre";
import PopupForm from "./PopupForm";
import { PositionAnchor } from "maplibre-gl";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MapPosition {
  longitude: number;
  latitude: number;
}

interface ReportSubmissionMarkerProps {
  mapCenter: MapPosition;
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
}

export default function ReportSubmissionMarker({
  mapCenter,
  isAdding,
  setIsAdding,
}: ReportSubmissionMarkerProps) {
  const { current: map } = useMap();
  const [markerPosition, setMarkerPosition] = useState<MapPosition>(mapCenter);
  const [popupAnchor, setPopupAnchor] = useState<PositionAnchor>("bottom");
  const [popupOffset, setPopupOffset] = useState<number>(60);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [tooltipSide, setTooltipSide] = useState<"top" | "bottom">("top");
  const markerRef = useRef<HTMLDivElement>(null);

  // Only update marker position when adding starts (not continuously)
  useEffect(() => {
    if (isAdding) {
      // Only set the position on initial adding - don't update continuously
      // Get the current center of the map view
      if (map) {
        const center = map.getCenter();
        setMarkerPosition({
          longitude: center.lng,
          latitude: center.lat,
        });
      } else {
        setMarkerPosition(mapCenter);
      }

      // Update popup position based on screen
      updatePopupAnchor();
    }
  }, [isAdding, map]); // Remove mapCenter dependency to prevent updates

  // Update popup anchor when marker position changes
  useEffect(() => {
    updatePopupAnchor();
  }, [markerPosition]);

  // Safe handler for map clicks
  useEffect(() => {
    if (!map || !isAdding) return;

    const handleMapClick = (evt: any) => {
      if (!isAdding) return;

      // Get the event object, which might be nested
      const e = evt.originalEvent || evt;

      try {
        // Try to prevent default behavior safely
        if (typeof e.preventDefault === "function") {
          e.preventDefault();
        }

        // Try to stop propagation safely
        if (typeof e.stopPropagation === "function") {
          e.stopPropagation();
        }
      } catch (error) {
        console.warn("Error handling map click event:", error);
      }
    };

    // Add the event listener
    map.on("click", handleMapClick);

    // Cleanup
    return () => {
      if (map) {
        map.off("click", handleMapClick);
      }
    };
  }, [map, isAdding]);

  const updatePopupAnchor = () => {
    if (!markerRef.current) return;

    const markerRect = markerRef.current.getBoundingClientRect();
    const screenHeight = window.innerHeight;
    const screenCenter = screenHeight / 2;

    if (markerRect.top > screenCenter) {
      // If marker is in bottom half of screen:
      // - Show popup above marker
      // - Show tooltip below marker
      setPopupAnchor("bottom");
      setPopupOffset(45);
      setTooltipSide("top");
    } else {
      // If marker is in top half of screen:
      // - Show popup below marker
      // - Show tooltip above marker
      setPopupAnchor("top");
      setPopupOffset(30);
      setTooltipSide("bottom");
    }
  };

  const handleSubmissionSuccess = () => {
    setIsAdding(false);
  };

  // If not in adding mode, don't render anything
  if (!isAdding) return null;

  return (
    <>
      <Marker
        longitude={markerPosition.longitude}
        latitude={markerPosition.latitude}
        draggable
        anchor="bottom"
        style={{ zIndex: 10 }}
        onDragStart={(e) => {
          // Add a class to the body when dragging starts
          document.body.classList.add("marker-dragging");
          setIsDragging(true);
        }}
        onDragEnd={(e) => {
          // Remove the class when dragging ends
          document.body.classList.remove("marker-dragging");
          setIsDragging(false);

          const newCoords = { longitude: e.lngLat.lng, latitude: e.lngLat.lat };
          setMarkerPosition(newCoords);
          updatePopupAnchor();
        }}
        onDrag={(e) => {
          const newCoords = { longitude: e.lngLat.lng, latitude: e.lngLat.lat };
          setMarkerPosition(newCoords);
        }}
      >
        <div ref={markerRef}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0, y: -20 }}
                  animate={{
                    scale: 1,
                    y: isDragging ? -5 : 0,
                    transition: { type: "spring", stiffness: 500, damping: 15 },
                  }}
                  exit={{ scale: 0, y: -20 }}
                  className="relative cursor-pointer"
                >
                  {/* Map pin icon */}
                  <MapPin
                    size={42}
                    className="text-primary fill-secondary drop-shadow-lg"
                  />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side={tooltipSide} className="z-[9999]">
                {isDragging
                  ? "Release to place marker"
                  : "Drag to reposition marker"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Drag indicator - visible only while dragging */}
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background/80 text-foreground px-3 py-1 rounded-md text-sm shadow-md whitespace-nowrap z-20"
              >
                Drag to position
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Marker>

      {/* Form Popup */}
      <Popup
        longitude={markerPosition.longitude}
        latitude={markerPosition.latitude}
        closeButton={!isDragging} // Hide close button during drag
        closeOnClick={false}
        onClose={() => setIsAdding(false)}
        anchor={popupAnchor}
        offset={popupOffset}
        className={`report-submission-popup${
          isDragging ? " being-dragged" : ""
        }`}
      >
        <PopupForm
          latitude={markerPosition.latitude}
          longitude={markerPosition.longitude}
          onClose={handleSubmissionSuccess}
          setEditing={() => {}}
        />
      </Popup>
    </>
  );
}
