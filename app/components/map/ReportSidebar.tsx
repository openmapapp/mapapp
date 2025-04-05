// components/map/ReportSidebar.tsx
"use client";

import { useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { useData } from "@/app/components/layout/DataProvider";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";

// Import marker icons
import officer from "@/public/officer.png";
import car from "@/public/car.png";
import roadblock from "@/public/roadblock.png";
import ice from "@/public/raid.png";
import caution from "@/public/caution.png";
import smoke from "@/public/smoke.png";
import marker from "@/public/marker.png";

// Map report types to icons
const reportTypeIcons: Record<number, any> = {
  1: officer,
  2: car,
  3: roadblock,
  4: ice,
  5: caution,
  6: smoke,
};

// Map report type IDs to readable names
const reportTypeNames: Record<number, string> = {
  1: "Officer",
  2: "Police Car",
  3: "Roadblock",
  4: "ICE",
  5: "Caution",
  6: "Smoke/Fire",
};

interface ReportSidebarProps {
  setSelectedReport: (report: any) => void;
  hoveredReportId: number | null;
  setHoveredReportId: (id: number | null) => void;
}

export default function ReportSidebar({
  setSelectedReport,
  hoveredReportId,
  setHoveredReportId,
}: ReportSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { reports, timeRange } = useData();
  const { current: map } = useMap();

  // Sort reports by createdAt in reverse chronological order
  const sortedReports = [...(reports || [])].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Format the description for display
  const formatDescription = (description: any) => {
    if (!description) return "No description";

    try {
      if (typeof description === "string") {
        const parsed = JSON.parse(description);
        // Return the first non-empty field
        const firstField = Object.entries(parsed).find(
          ([_, value]) => value && String(value).trim() !== ""
        );
        return firstField ? `${firstField[0]}: ${firstField[1]}` : "No details";
      }

      // If it's already an object
      const firstField = Object.entries(description).find(
        ([_, value]) => value && String(value).trim() !== ""
      );
      return firstField ? `${firstField[0]}: ${firstField[1]}` : "No details";
    } catch (e) {
      return String(description) || "No description";
    }
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return format(date, "h:mm a"); // e.g. "3:45 PM"
    } else {
      return format(date, "MMM d, h:mm a"); // e.g. "Apr 4, 3:45 PM"
    }
  };

  // Get time ago for tooltip
  const getTimeAgo = (timeString: string) => {
    return formatDistanceToNow(new Date(timeString), { addSuffix: true });
  };

  // Handle clicking a report in the sidebar
  const handleReportClick = (report: any) => {
    // Center the map on this report
    if (map) {
      map.flyTo({
        center: [report.long, report.lat],
        zoom: Math.max(map.getZoom(), 14), // Zoom in if we're zoomed out
        duration: 1000,
      });
    }

    // Set this as the selected report to show its popup
    setSelectedReport(report);
  };

  return (
    <div className="absolute right-0 top-0 h-full z-10 flex">
      {/* Collapsed/Expanded toggle button */}
      <div className="h-full flex items-center">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-l-md rounded-r-none h-12 shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* Sidebar panel with CSS transition */}
      <div
        className={`h-full bg-background/95 backdrop-blur-sm shadow-lg overflow-hidden transition-all duration-300 ${
          isOpen ? "w-[320px] opacity-100" : "w-0 opacity-0"
        }`}
      >
        <div className="h-full flex flex-col" style={{ width: "320px" }}>
          {/* Header */}
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Recent Reports</h2>
            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock size={14} />
              <span>Showing reports from the past {timeRange} hours</span>
            </div>
          </div>

          {/* Report list */}
          <div className="flex-1 overflow-y-auto p-2">
            {sortedReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <AlertCircle className="mb-2" />
                <p>No reports in the selected time range</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedReports.map((report) => {
                  const iconSrc =
                    reportTypeIcons[report.reportTypeId] || marker;
                  const typeName =
                    reportTypeNames[report.reportTypeId] || "Unknown";
                  const description = formatDescription(report.description);

                  // Determine status badges
                  const isVerified = !!report.isVerified;
                  const isConfirmed = report.confirmationCount >= 5;
                  const isDisputed = report.disconfirmationCount >= 5;

                  return (
                    <div
                      key={report.id}
                      className={`p-3 rounded-md border transition-colors cursor-pointer relative ${
                        hoveredReportId === report.id
                          ? "bg-accent border-accent-foreground/20"
                          : "hover:bg-accent/50"
                      }`}
                      onMouseEnter={() => setHoveredReportId(report.id)}
                      onMouseLeave={() => setHoveredReportId(null)}
                      onClick={() => handleReportClick(report)}
                    >
                      {/* Report content as before */}
                      <div className="flex gap-3">
                        {/* Report icon */}
                        <div className="mt-0.5">
                          <Image
                            src={iconSrc}
                            alt={typeName}
                            width={24}
                            height={24}
                            className={isDisputed ? "opacity-60" : ""}
                          />
                        </div>

                        {/* Report content */}
                        <div className="flex-1 min-w-0">
                          {/* Title line with badges */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">
                              {typeName}
                            </span>

                            {/* Status badges */}
                            <div className="flex gap-1">
                              {isVerified && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                  Verified
                                </span>
                              )}
                              {isConfirmed && !isVerified && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                  Confirmed
                                </span>
                              )}
                              {isDisputed && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                  Disputed
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground truncate">
                            {description}
                          </p>

                          {/* Time */}
                          <div
                            className="text-xs text-muted-foreground mt-1"
                            title={getTimeAgo(report.createdAt)}
                          >
                            {formatTime(report.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
