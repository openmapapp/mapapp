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
import { getReportTypes } from "@/actions/getReportTypes";
import { getReports } from "@/actions/getReports";
import { io } from "socket.io-client";

// Define types for reports, report types, and user settings
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
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [timeRange, setTimeRange] = useState<number>(4);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    theme: "light",
  });

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
    const fetchReports = async () => {
      try {
        const serverReports = await getReports(timeRange);

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
  }, [timeRange]);

  return (
    <DataContext.Provider
      value={{
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
