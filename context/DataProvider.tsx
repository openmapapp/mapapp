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
import { getHistoricalReports } from "@/actions/reports/getHistoricalReports";
import { exportDataAsCSV, exportDataAsJSON } from "@/utils/data-export";
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
  description?: string;
  iconUrl?: string;
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
  isPermanent?: boolean;
  itemStatus?: "PRESENT" | "DEPARTED" | "UNKNOWN";
  reportStatus?: "ACTIVE" | "CONFIRMED" | "DISPUTED" | "RESOLVED";
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

interface FilterState {
  useHistoricalMode: boolean;
  dateRange: { from: Date | null; to: Date | null };
  selectedReportTypes: number[];
  selectedFields: Record<string, string[]>; // fieldName -> selected values
  globalFieldFilters: Record<string, string[]>; // filterable_id -> selected values
  isFiltering: boolean;
  showDepartedItems: boolean;
}

interface FilterableField {
  id: string; // The filterable_id
  label: string;
  options: string[];
  reportTypes: number[];
}

interface DataContextType {
  globalSettings: GlobalSettings | null;
  updateSettings: (session: any, newSettings: GlobalSettings) => Promise<void>;
  reportTypes: ReportType[];
  reports: Report[];
  filteredReports: Report[];
  setReports: Dispatch<SetStateAction<Report[]>>;
  userSettings: UserSettings;
  setUserSettings: Dispatch<SetStateAction<UserSettings>>;
  timeRange: number;
  setTimeRange: Dispatch<SetStateAction<number>>;
  refreshReports: () => Promise<void>;

  // Filter state and functions
  filters: FilterState;
  setHistoricalMode: (enabled: boolean) => void;
  setDateRange: (range: { from: Date | null; to: Date | null }) => void;
  toggleReportTypeFilter: (typeId: number) => void;
  setFieldFilter: (fieldName: string, values: string[]) => void;
  setGlobalFieldFilter: (fieldId: string, values: string[]) => void;
  setShowDepartedItems: (show: boolean) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  exportData: (format: "csv" | "json") => void;
  getFilterableFields: () => FilterableField[];
  isFilterLoading: boolean;
}

// Provide default values for context (empty arrays, defaults for settings)
const DataContext = createContext<DataContextType>({
  globalSettings: null,
  updateSettings: async () => {}, // placeholder function
  reportTypes: [],
  reports: [],
  filteredReports: [],
  setReports: () => {}, // placeholder function
  userSettings: { theme: "light" },
  setUserSettings: () => {}, // placeholder function
  timeRange: 4,
  setTimeRange: () => {}, // placeholder function
  refreshReports: async () => {}, // placeholder function

  filters: {
    useHistoricalMode: false,
    dateRange: { from: null, to: null },
    selectedReportTypes: [],
    selectedFields: {},
    globalFieldFilters: {},
    isFiltering: false,
    showDepartedItems: false,
  },
  setHistoricalMode: () => {}, // placeholder function
  setDateRange: () => {}, // placeholder function;
  toggleReportTypeFilter: () => {}, // placeholder function
  setFieldFilter: () => {}, // placeholder function;
  setGlobalFieldFilter: () => {}, // placeholder function
  setShowDepartedItems: () => {}, // placeholder function
  applyFilters: () => {}, // placeholder function
  resetFilters: () => {}, // placeholder function
  exportData: () => {}, // placeholder function
  getFilterableFields: () => [], // placeholder function
  isFilterLoading: false,
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
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [timeRange, setTimeRange] = useState<number>(4);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    theme: "light",
  });

  // Filtering state
  const [filters, setFilters] = useState<FilterState>({
    useHistoricalMode: false,
    dateRange: { from: null, to: null },
    selectedReportTypes: [],
    selectedFields: {},
    globalFieldFilters: {},
    isFiltering: false,
    showDepartedItems: false,
  });

  const [isFilterLoading, setIsFilterLoading] = useState(false);

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

        const processedReport = {
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
        };

        // If the report doesn't have complete report type information,
        // but we have its report type ID, look it up from our cached reportTypes
        if (
          processedReport.reportTypeId &&
          (!processedReport.reportType || !processedReport.reportType.iconUrl)
        ) {
          // Find the matching report type from our previously fetched reportTypes
          const matchingReportType = reportTypes.find(
            (type) => type.id === Number(processedReport.reportTypeId)
          );

          if (matchingReportType) {
            // Attach the complete report type information
            processedReport.reportType = {
              id: matchingReportType.id,
              name: matchingReportType.name,
              fields: matchingReportType.fields,
              iconUrl: matchingReportType.iconUrl,
              description: matchingReportType.description,
            };
          }
        }

        return [...prevReports, processedReport];
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

  const setShowDepartedItems = (show: boolean) => {
    setFilters((prev) => ({
      ...prev,
      showDepartedItems: show,
    }));
  };

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

  useEffect(() => {
    // Debug function to check report date formats
    if (reports.length > 0) {
      const dateFormats = reports.slice(0, 5).map((report) => ({
        id: report.id,
        createdAtType: typeof report.createdAt,
        createdAtValue: report.createdAt,
        parsedDate: new Date(report.createdAt).toISOString(),
        isValidDate: !isNaN(new Date(report.createdAt).getTime()),
      }));

      console.log("Report date formats sample:", dateFormats);
    }
  }, [reports]);

  // Function to update global settings
  const updateSettings = async (session: any, newSettings: GlobalSettings) => {
    try {
      await updateGlobalSettings(session, newSettings);
      setGlobalSettings(newSettings);
    } catch (error) {
      console.error("Error updating global settings:", error);
    }
  };

  // Set filteredReports to match reports initially
  useEffect(() => {
    if (!filters.isFiltering) {
      setFilteredReports(reports);
    }
  }, [reports, filters.isFiltering]);

  // Filter handling functions
  const setHistoricalMode = (enabled: boolean) => {
    setFilters((prev) => ({
      ...prev,
      useHistoricalMode: enabled,
    }));
  };

  const setDateRange = (range: { from: Date | null; to: Date | null }) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: range,
    }));
  };

  const toggleReportTypeFilter = (typeId: number) => {
    setFilters((prev) => {
      const types = prev.selectedReportTypes.includes(typeId)
        ? prev.selectedReportTypes.filter((id) => id !== typeId)
        : [...prev.selectedReportTypes, typeId];

      return {
        ...prev,
        selectedReportTypes: types,
      };
    });
  };

  const getFilterableFields = () => {
    const filterableFields: Record<
      string,
      {
        id: string;
        label: string;
        options: Set<string>;
        reportTypes: number[];
      }
    > = {};

    // Scan all report types for filterable fields
    reportTypes.forEach((type) => {
      try {
        const fields =
          typeof type.fields === "string"
            ? JSON.parse(type.fields)
            : type.fields;

        if (Array.isArray(fields)) {
          fields.forEach((field) => {
            if (field.filterable && field.filterable_id) {
              if (!filterableFields[field.filterable_id]) {
                filterableFields[field.filterable_id] = {
                  id: field.filterable_id,
                  label: field.label || field.name,
                  options: new Set(),
                  reportTypes: [type.id],
                };
              } else {
                filterableFields[field.filterable_id].reportTypes.push(type.id);
              }

              // Add all options from this field
              if (field.options && Array.isArray(field.options)) {
                field.options.forEach((option) =>
                  filterableFields[field.filterable_id].options.add(option)
                );
              }
            }
          });
        }
      } catch (e) {
        console.error(`Error parsing fields for ${type.name}:`, e);
      }
    });

    // Convert Set to Array for all options
    return Object.values(filterableFields).map((field) => ({
      ...field,
      options: Array.from(field.options),
    }));
  };

  // Global field filter setter
  const setGlobalFieldFilter = (fieldId: string, values: string[]) => {
    setFilters((prev) => ({
      ...prev,
      globalFieldFilters: {
        ...prev.globalFieldFilters,
        [fieldId]: values,
      },
    }));
  };

  // Apply all filters to generate filteredReports
  const applyFilters = async () => {
    setIsFilterLoading(true);

    try {
      // Check if we need to fetch historical data
      if (
        filters.useHistoricalMode &&
        filters.dateRange.from &&
        filters.dateRange.to
      ) {
        // Fetch historical data directly from the server
        const historicalReports = await getHistoricalReports(
          new Date(filters.dateRange.from),
          new Date(filters.dateRange.to),
          filters.showDepartedItems
        );

        // Format and process the reports
        const formattedReports = historicalReports.map((report) => ({
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

        // Start with these historical reports
        let result = [...formattedReports];

        // Apply additional filters (report types, fields, global fields)
        result = applyAdditionalFilters(result);

        // Set flag for filtering mode
        setFilters((prev) => ({
          ...prev,
          isFiltering: true,
        }));

        // Update filtered reports
        setFilteredReports(result);
        console.log(`Final filtered reports: ${result.length}`);
      } else {
        // Regular filtering on the existing reports
        if (!reports.length) {
          setFilteredReports([]);
          return;
        }

        // Start with all reports
        let result = [...reports];

        // If we're showing departed items and they're not included in current reports,
        // we need to fetch them separately
        if (filters.showDepartedItems) {
          const departedReports = await getReports(
            timeRange,
            true // Include non-visible reports
          );
          const existingIds = new Set(result.map((r) => r.id));
          const newDepartedReports = departedReports.filter(
            (report) =>
              !existingIds.has(report.id) && report.itemStatus === "DEPARTED"
          );
          result = [...result, ...newDepartedReports];
        }

        // Apply additional filters (report types, fields, global fields)
        result = applyAdditionalFilters(result);

        // Set flag for filtering mode only if we have active filters
        const hasActiveFilters =
          filters.selectedReportTypes.length > 0 ||
          Object.keys(filters.selectedFields).length > 0 ||
          Object.keys(filters.globalFieldFilters).length > 0 ||
          filters.showDepartedItems;

        setFilters((prev) => ({
          ...prev,
          isFiltering: hasActiveFilters,
        }));

        // Update filtered reports
        setFilteredReports(result);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      // Handle error state appropriately
    } finally {
      setIsFilterLoading(false);
    }
  };

  // Helper function to apply type, field, and global field filters
  const applyAdditionalFilters = (reportsToFilter: Report[]) => {
    let result = [...reportsToFilter];

    // Apply report type filters if any are selected
    if (filters.selectedReportTypes.length > 0) {
      console.log(
        `Filtering by report types: ${filters.selectedReportTypes.join(", ")}`
      );
      result = result.filter((report) =>
        filters.selectedReportTypes.includes(report.reportTypeId)
      );
      console.log(`After type filtering: ${result.length} reports remain`);
    }

    // Apply field filters if any
    if (Object.keys(filters.selectedFields).length > 0) {
      console.log(
        `Filtering by fields: ${JSON.stringify(filters.selectedFields)}`
      );

      result = result.filter((report) => {
        // Parse the description
        let description: Record<string, any> = {};
        try {
          description =
            typeof report.description === "string"
              ? JSON.parse(report.description as string)
              : report.description || {};
        } catch (e) {
          console.error(
            `Error parsing description for report ${report.id}:`,
            e
          );
          return false; // Skip reports with invalid description
        }

        // Check each field filter
        return Object.entries(filters.selectedFields).every(
          ([fieldName, values]) => {
            if (!values.length) return true; // No filter values selected
            const fieldValue = description[fieldName];
            return values.includes(fieldValue);
          }
        );
      });

      console.log(`After field filtering: ${result.length} reports remain`);
    }

    // Apply global field filters if any
    if (Object.keys(filters.globalFieldFilters).length > 0) {
      console.log(
        `Filtering by global fields: ${JSON.stringify(
          filters.globalFieldFilters
        )}`
      );

      result = result.filter((report) => {
        // Get the report type for this report
        const reportType = reportTypes.find(
          (t) => t.id === report.reportTypeId
        );
        if (!reportType) return false;

        // Parse fields for this report type
        let reportTypeFields = [];
        try {
          reportTypeFields = JSON.parse(reportType.fields);
        } catch (e) {
          console.error(
            `Error parsing fields for report type ${reportType.id}:`,
            e
          );
          return false;
        }

        // Parse the description
        let description: Record<string, any> = {};
        try {
          description =
            typeof report.description === "string"
              ? JSON.parse(report.description as string)
              : report.description || {};
        } catch (e) {
          console.error(
            `Error parsing description for report ${report.id}:`,
            e
          );
          return false;
        }

        // Check each global field filter
        return Object.entries(filters.globalFieldFilters).every(
          ([fieldName, selectedValues]) => {
            if (selectedValues.length === 0) return true;

            // Handle special case for text fields
            if (selectedValues.includes("__has_value__")) {
              // Find the field in the report
              const fieldValue = description[fieldName];
              // Check if field exists and has a non-empty value
              return (
                fieldValue !== undefined &&
                fieldValue !== null &&
                fieldValue !== ""
              );
            }

            // For select fields - regular filtering
            const fieldValue = description[fieldName];
            return selectedValues.includes(fieldValue);
          }
        );
      });

      console.log(
        `After global field filtering: ${result.length} reports remain`
      );
    }

    // Filter by departed status if showDeparted is false
    if (!filters.showDepartedItems) {
      result = result.filter((report) => report.itemStatus !== "DEPARTED");
    }

    return result;
  };

  const setFieldFilter = (fieldName: string, values: string[]) => {
    setFilters((prev) => ({
      ...prev,
      selectedFields: {
        ...prev.selectedFields,
        [fieldName]: values,
      },
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    console.log("Resetting filters...");
    setIsFilterLoading(true);

    setTimeout(() => {
      setFilters({
        useHistoricalMode: false,
        dateRange: { from: null, to: null },
        selectedReportTypes: [],
        selectedFields: {},
        globalFieldFilters: {},
        isFiltering: false,
        showDepartedItems: false,
      });
      setFilteredReports(reports);
      setIsFilterLoading(false);
    }, 300); // Brief delay for better UI feedback
  };

  // Export data function
  const exportData = (format: "csv" | "json") => {
    const dataToExport = filters.isFiltering ? filteredReports : reports;

    if (dataToExport.length === 0) {
      console.error("No data to export");
      return;
    }

    // Process data for export
    const exportData = dataToExport.map((report) => {
      let description;
      try {
        description =
          typeof report.description === "string"
            ? JSON.parse(report.description)
            : report.description;
      } catch (e) {
        description = {};
      }

      return {
        id: report.id,
        reportType:
          reportTypes.find((t) => t.id === report.reportTypeId)?.name ||
          "Unknown",
        latitude: report.lat,
        longitude: report.long,
        createdAt: new Date(report.createdAt).toLocaleString(),
        updatedAt: new Date(report.updatedAt).toLocaleString(),
        trustScore: report.trustScore,
        confirmationCount: report.confirmationCount,
        disconfirmationCount: report.disconfirmationCount,
        ...description, // Include all description fields directly in the export
      };
    });

    // Export based on format
    if (format === "csv") {
      exportDataAsCSV(exportData, "map-reports.csv");
    } else {
      exportDataAsJSON(exportData, "map-reports.json");
    }
  };

  return (
    <DataContext.Provider
      value={{
        globalSettings,
        updateSettings,
        reportTypes,
        reports,
        filteredReports,
        setReports,
        userSettings,
        setUserSettings,
        timeRange,
        setTimeRange,
        refreshReports: fetchReports,
        // Filter state and functions
        filters,
        setHistoricalMode,
        setDateRange,
        toggleReportTypeFilter,
        setFieldFilter,
        setGlobalFieldFilter,
        setShowDepartedItems,
        applyFilters,
        resetFilters,
        exportData,
        getFilterableFields,
        isFilterLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for easy data access
export const useData = () => useContext(DataContext);
