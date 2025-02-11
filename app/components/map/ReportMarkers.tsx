"use client";
import { Marker } from "react-map-gl/maplibre";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useData } from "@/app/components/layout/DataProvider";

import officer from "@/public/officer.png";
import car from "@/public/car.png";
import roadblock from "@/public/roadblock.png";
import ice from "@//public/raid.png";
import caution from "@/public/caution.png";
import smoke from "@/public/smoke.png";
import marker from "@/public/marker.png";

const reportTypeIcons = {
  1: officer,
  2: car,
  3: roadblock,
  4: ice,
  5: caution,
  6: smoke,
};

const getMarkerColor = (trustScore: number) => {
  if (trustScore >= 4)
    return "bg-green-300 shadow-green-400 before:border-t-green-300";
  if (trustScore >= 2)
    return "bg-yellow-300 shadow-yellow-400 before:border-t-yellow-300";
  return "bg-red-300 shadow-red-400 before:border-t-red-300";
};

const getMarkerOpacity = (createdAt: string) => {
  const reportDate = new Date(createdAt);
  const now = new Date();
  const hoursElapsed =
    (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60);
  return hoursElapsed < 1 ? "1" : "0.8";
};

export default function ReportMarkers({ setSelectedReport, userId }) {
  const { reports, setReports } = useData();
  const [newReportId, setNewReportId] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {reports.map((report) => {
        if (report.isRemoving) return null;

        const iconSrc = reportTypeIcons[report.reportTypeId] || marker;
        const markerColor = getMarkerColor(report.trustScore);
        const isNew = report.id === newReportId;

        return (
          <Marker
            key={report.id}
            longitude={report.long}
            latitude={report.lat}
            anchor="bottom"
            data-marker-id={report.id}
            onClick={() => setSelectedReport(report)}
          >
            <motion.div
              layout="position"
              variants={
                isNew
                  ? undefined
                  : {
                      hidden: { opacity: 0, y: -50 },
                      show: { opacity: 1, y: 0 },
                    }
              }
              initial={isNew ? { opacity: 0, y: -50 } : undefined}
              animate={isNew ? { opacity: 1, y: 0 } : undefined}
              exit={{ opacity: 0, y: -50 }}
            >
              <div
                className={`relative flex items-center justify-center h-12 w-12 rounded-full opacity-95 shadow-md ${markerColor} p-1 before:content-[''] before:absolute before:bottom-[-28px] before:left-1/2 before:-translate-x-1/2 before:border-[15px] before:border-transparent -translate-y-4`}
              >
                <Image
                  src={iconSrc}
                  alt="Report Marker"
                  width={40}
                  height={40}
                />
              </div>
            </motion.div>
          </Marker>
        );
      })}
    </AnimatePresence>
  );
}
