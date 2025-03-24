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
import { getGlobalSettings } from "@/actions/globalSettings";
import { updateGlobalSettings } from "@/actions/adminActions";
import { getReportTypes } from "@/actions/getReportTypes";
import { getReports } from "@/actions/getReports";
import { io } from "socket.io-client";

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
}

interface ReportType {
  id: number;
  name: string;
}

interface Report {
  id: number;
  reportTypeId: number;
  lat: number;
  long: number;
  description: string | null;
  image: string | null;
  createdAt: string; // Prisma usually returns ISO date strings
  updatedAt: string;
  departedAt: string | null;
  trustScore: number;
  submittedById: string;
}

interface UserSettings {
  theme: "light" | "dark";
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
}

// Provide default values for context (empty arrays, defaults for settings)
const DataContext = createContext<DataContextType>({
  globalSettings: null,
  updateSettings: async () => {}, // Temporary placeholder function
  reportTypes: [],
  reports: [],
  setReports: () => {}, // Temporary placeholder function
  userSettings: { theme: "light" },
  setUserSettings: () => {}, // Temporary placeholder function
  timeRange: 4,
  setTimeRange: () => {}, // Temporary placeholder function
});

// Properly type the provider component
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

    const socket = io("http://localhost:3005"); // Adjust to match your socket server URL

    socket.on("new-report", (data: Report) => {
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
    });

    socket.on("report-deleted", ({ reportId }: { reportId: number }) => {
      setReports((prevReports) => prevReports.filter((r) => r.id !== reportId));
    });

    return () => {
      socket.off("new-report");
      socket.off("report-deleted");
    };
  }, []);

  useEffect(() => {
    const storedTimeRange = localStorage.getItem("timeRange");
    if (storedTimeRange) {
      setTimeRange(Number(storedTimeRange));
    }
  }, []);

  useEffect(() => {
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
    fetchReports();

    const interval = setInterval(fetchReports, 120000); // Fetch reports two minutes

    return () => clearInterval(interval);
  }, [timeRange]);

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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for easy data access
export const useData = () => useContext(DataContext);
