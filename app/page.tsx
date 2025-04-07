"use client";

import { useState, lazy, Suspense } from "react";
import { useData } from "../context/DataProvider";
import { useSession } from "./lib/auth-client";
import MapSkeleton from "./components/map/MapSkeleton";
import { deleteReport } from "@/actions/reports/deleteReport";
import ReportSidebar from "./components/map/ReportSidebar";
import dynamic from "next/dynamic";

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

// Dynamically import heavy components
const MapComponent = dynamic(() => import("./components/map/MapComponent"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

// Lazy load components that aren't needed immediately
const SettingsContainer = lazy(
  () => import("./components/map/settings/SettingsContainer")
);

// Socket initialization moved to a separate hook for better management
import { useSocketConnection } from "@/hooks/useSocketConnection";

const Page = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const { reports, setReports, globalSettings } = useData();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [hoveredReportId, setHoveredReportId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);

  // Use the socket hook instead of initializing directly
  const socket = useSocketConnection();

  if (!globalSettings) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading app...
      </div>
    );
  }

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

      socket?.emit("report-deleted", { reportId });
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  return (
    <div className="relative h-[calc(100vh-81px)] w-full overflow-hidden">
      <div className="absolute z-10">
        <Suspense
          fallback={
            <div className="p-2 bg-background/80 rounded-md">
              Loading settings...
            </div>
          }
        >
          <SettingsContainer />
        </Suspense>
      </div>

      <ReportSidebar
        setSelectedReport={setSelectedReport}
        hoveredReportId={hoveredReportId}
        setHoveredReportId={setHoveredReportId}
      />

      <MapComponent
        globalSettings={globalSettings}
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
        isAdding={isAdding}
        setIsAdding={setIsAdding}
        editing={editing}
        setEditing={setEditing}
        userId={userId}
        session={session}
        handleDelete={handleDelete}
        hoveredReportId={hoveredReportId}
      />
    </div>
  );
};

export default Page;
