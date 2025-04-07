"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { getGlobalSettings } from "@/actions/admin/globalSettings";
import { updateGlobalSettings } from "@/actions/admin/adminActions";
import { getReportTypes } from "@/actions/reports/getReportTypes";
import { getReports } from "@/actions/reports/getReports";
import { io, Socket } from "socket.io-client";

// Define types for global settings, reports, report types, and user settings
interface GlobalSettings {
  id: number;
  mapCenterLat: number;
  mapCenterLng: number;
  mapBoundsSwLat: number;
  mapBoundsSwLng: number;
  mapBoundsNeLat: number;
  mapBoundsNeLng: number;
  registrationMode: "open" | "invite-only" | "closed";
  inviteCodes: string;
  mapOpenToVisitors: boolean;
  submitReportsOpen: boolean;
  votesOpenToVisitors: boolean;
  mapZoom: number;
  mapMaxZoom: number;
  mapMinZoom: number;
  mapApiKey: string;
  aboutContent: string;
  blogEnabled: boolean;
}

interface ReportType {
  id: number;
  name: string;
  fields?: Record<string, any>;
}

interface Report {
  id: number;
  reportTypeId: number;
  reportType?: ReportType;
  lat: number;
  long: number;
  description: string | null | Record<string, any>;
  image: string | null;
  createdAt: string; // Prisma usually returns ISO date strings
  updatedAt: string;
  departedAt: string | null;
  trustScore: number;
  submittedById: string;
  submittedBy?: {
    id: string;
    username: string;
  };
  confirmationCount: number;
  disconfirmationCount: number;
  isVisible: boolean;
  votes?: Vote[];
}

export interface Vote {
  id: number;
  value: number;
  userId: string | null;
  reportId: number;
  createdAt: string;
}

interface UserSettings {
  theme: "light" | "dark";
}

// Define socket event types
interface ServerToClientEvents {
  "new-report": (data: Report) => void;
  "report-deleted": (data: { reportId: number }) => void;
  "report-updated": (data: { report: Report }) => void;
  "report-voted": (data: { reportId: number; value: number }) => void;
}

interface ClientToServerEvents {
  "report-delete": (data: { reportId: number }) => void;
  "report-add": (data: Report) => void;
  "report-update": (data: { report: Report }) => void;
  "report-vote": (data: {
    reportId: number;
    userId: string;
    value: number;
  }) => void;
}

interface DataContextType {
  globalSettings: GlobalSettings | null;
  updateSettings: (session: any, newSettings: GlobalSettings) => Promise<void>;
  reportTypes: ReportType[];
  reports: Report[];
  setReports: Dispatch<SetStateAction<Report[]>>;
  userSettings: UserSettings;
  setUserSettings: Dispatch<SetStateAction<UserSettings>>;
  timeRange: number;
  setTimeRange: Dispatch<SetStateAction<number>>;
  refreshReports: () => Promise<void>;
}

// Provide default values for context (empty arrays, defaults for settings)
const DataContext = createContext<DataContextType>({
  globalSettings: null,
  updateSettings: async () => {}, // placeholder function
  reportTypes: [],
  reports: [],
  setReports: () => {}, // placeholder function
  userSettings: { theme: "light" },
  setUserSettings: () => {}, // placeholder function
  timeRange: 4,
  setTimeRange: () => {}, // placeholder function
  refreshReports: async () => {}, // placeholder function
});

// Type-safe socket instance
let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(
    null
  );
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [timeRange, setTimeRange] = useState<number>(4);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    theme: "light",
  });

  // Initialize socket only once
  useEffect(() => {
    if (typeof window !== "undefined" && !socket) {
      socket = io("http://localhost:3005", {
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });

      console.log("Socket initialized");
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  //Fetch global settings once
  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getGlobalSettings();
        if (!data) {
          console.error("No global settings found");
          return;
        }
        setGlobalSettings(data);
      } catch (error) {
        console.log("Error fetching global settings:", error);
      }
    }
    fetchSettings();

    const interval = setInterval(fetchSettings, 60000); // Fetch settings every minute
    return () => clearInterval(interval);
  }, []);

  // Fetch report types once
  useEffect(() => {
    const fetchReportTypes = async () => {
      const types = await getReportTypes();
      setReportTypes(types);
    };
    fetchReportTypes();
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewReport = (data: Report) => {
      setReports((prevReports) => {
        if (prevReports.some((r) => r.id === data.id)) {
          return prevReports;
        }

        return [
          ...prevReports,
          {
            ...data,
            createdAt:
              data.createdAt instanceof Date
                ? data.createdAt.toISOString()
                : data.createdAt,
            updatedAt:
              data.updatedAt instanceof Date
                ? data.updatedAt.toISOString()
                : data.updatedAt,
            departedAt:
              data.departedAt instanceof Date
                ? data.departedAt.toISOString()
                : null,
          },
        ];
      });
    };

    const handleReportDeleted = ({ reportId }: { reportId: number }) => {
      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== reportId)
      );
    };

    socket.on("new-report", handleNewReport);
    socket.on("report-deleted", handleReportDeleted);

    return () => {
      if (socket) {
        socket.off("new-report", handleNewReport);
        socket.off("report-deleted", handleReportDeleted);
      }
    };
  }, [socket]);

  // Manage time range from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedTimeRange = localStorage.getItem("timeRange");
    if (storedTimeRange) {
      setTimeRange(Number(storedTimeRange));
    }
  }, []);

  // Save timeRange changes to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("timeRange", timeRange.toString());
  }, [timeRange]);

  // Fetch reports based on time range
  const fetchReports = async () => {
    try {
      const serverReports = await getReports(timeRange);

      if (!serverReports || serverReports.length === 0) {
        console.warn("⚠️ No reports found for the given time range.");
        setReports([]);
        return;
      }

      // Convert Date objects to ISO strings
      const formattedReports = serverReports.map((report) => ({
        ...report,
        createdAt:
          report.createdAt instanceof Date
            ? report.createdAt.toISOString()
            : report.createdAt,
        updatedAt:
          report.updatedAt instanceof Date
            ? report.updatedAt.toISOString()
            : report.updatedAt,
        departedAt:
          report.departedAt instanceof Date
            ? report.departedAt.toISOString()
            : null,
      }));

      setReports(formattedReports);
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
    }
  };

  // Effect to fetch reports initially and at intervals
  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 120000); // Fetch reports every two minutes
    return () => clearInterval(interval);
  }, [timeRange]);

  // Function to update global settings
  const updateSettings = async (session: any, newSettings: GlobalSettings) => {
    try {
      await updateGlobalSettings(session, newSettings);
      setGlobalSettings(newSettings);
    } catch (error) {
      console.error("Error updating global settings:", error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        globalSettings,
        updateSettings,
        reportTypes,
        reports,
        setReports,
        userSettings,
        setUserSettings,
        timeRange,
        setTimeRange,
        refreshReports: fetchReports,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for easy data access
export const useData = () => useContext(DataContext);
