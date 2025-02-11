"use client";

import { useState, useEffect, useRef } from "react";
import { Marker, Popup } from "react-map-gl/maplibre";
import PopupForm from "./PopupForm"; // Import the form for submitting
import { PositionAnchor } from "maplibre-gl";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

export default function ReportSubmissionMarker({
  mapCenter,
  isAdding,
  setIsAdding,
}) {
  const [markerPosition, setMarkerPosition] = useState({
    longitude: mapCenter.longitude,
    latitude: mapCenter.latitude,
  });
  const [popupAnchor, setPopupAnchor] = useState<PositionAnchor>("bottom");
  const [popupOffset, setPopupOffset] = useState(60);

  const markerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMarkerPosition({
      longitude: mapCenter.longitude,
      latitude: mapCenter.latitude,
    });
  }, [mapCenter]);

  useEffect(() => {
    updatePopupAnchor();
  }, [markerPosition]);

  const updatePopupAnchor = () => {
    if (!markerRef.current) {
      console.warn("⚠️ Marker ref is null!");
      return;
    }

    const markerRect = markerRef.current.getBoundingClientRect();
    const screenHeight = window.innerHeight;

    if (markerRect.top > (screenHeight / 5) * 2) {
      setPopupAnchor("bottom");
      setPopupOffset(60);
    } else {
      setPopupAnchor("top");
      setPopupOffset(20);
    }
  };

  const handleSubmissionSuccess = () => {
    setIsAdding(false);
  };

  return (
    <>
      <Marker
        longitude={markerPosition.longitude}
        latitude={markerPosition.latitude}
        draggable
        anchor="bottom"
        style={{ zIndex: "10" }}
        onDragEnd={(e) => {
          const newCoords = { longitude: e.lngLat.lng, latitude: e.lngLat.lat };
          setMarkerPosition(newCoords);
          updatePopupAnchor();
        }}
        onDrag={(e) => {
          const newCoords = { longitude: e.lngLat.lng, latitude: e.lngLat.lat };
          setMarkerPosition(newCoords);
        }}
      >
        <AnimatePresence>
          {isAdding && (
            <motion.div
              key={"adding-image"}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <Image
                src="/marker.png"
                width={45}
                height={45}
                alt="Marker"
                ref={markerRef}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Marker>
      {isAdding && (
        <motion.div
          key={"adding-popup"}
          layoutId="popupForm"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <Popup
            longitude={markerPosition.longitude}
            latitude={markerPosition.latitude}
            closeButton
            closeOnClick={false}
            onClose={() => setIsAdding(false)}
            anchor={popupAnchor}
            offset={popupOffset}
          >
            <PopupForm
              latitude={markerPosition.latitude}
              longitude={markerPosition.longitude}
              onClose={handleSubmissionSuccess}
            />
          </Popup>
        </motion.div>
      )}
    </>
  );
}
