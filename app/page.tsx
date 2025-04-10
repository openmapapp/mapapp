"use client";

import { useState } from "react";
import { useData } from "../context/DataProvider";
import { useSession } from "./lib/auth-client";
import MapSkeleton from "./components/map/MapSkeleton";
import { deleteReport } from "@/actions/reports/deleteReport";
import ReportSidebar from "./components/map/ReportSidebar";
import dynamic from "next/dynamic";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState<{ delete: boolean }>({
    delete: false,
  });

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
    try {
      // Show loading state if you have one
      setLoading({ ...loading, delete: true });

      // Call the server action
      const response = await deleteReport(reportId, session);

      if (response.success) {
        // Update local state
        setReports((prevReports) =>
          prevReports.filter((r) => r.id !== Number(reportId))
        );

        // Close any open popups
        setSelectedReport(null);

        // Notify via socket
        socket?.emit("report-deleted", { reportId: Number(reportId) });

        // Show success message
        toast.success(response.message || "Report deleted successfully");
      } else {
        // Show error message
        toast.error(response.error || "Failed to delete report");
        console.error("Delete report failed:", response.error);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("An unexpected error occurred while deleting the report");
    } finally {
      // Reset loading state
      setLoading({ ...loading, delete: false });
    }
  };

  return (
    <div className="relative h-[calc(100vh-81px)] w-full overflow-hidden">
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
