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

export default function ReportMarkers({ setSelectedReport, userId }) {
  const { reports, setReports } = useData();
  const [newReportId, setNewReportId] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {reports.map((report) => {
        if (report.isRemoving) return null;

        const iconSrc = reportTypeIcons[report.reportTypeId] || marker;
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
                className={`relative flex items-center justify-center h-12 w-12 rounded-full opacity-95 shadow-md bg-white before:border-t-white p-1 before:content-[''] before:absolute before:bottom-[-28px] before:left-1/2 before:-translate-x-1/2 before:border-[15px] before:border-transparent -translate-y-4`}
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
