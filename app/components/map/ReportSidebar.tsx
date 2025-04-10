"use client";

import { useState, useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";
import { useData } from "@/context/DataProvider";
import { getReportHistory } from "@/actions/reports/getReportHistory";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  Filter,
  MapPin,
  ArrowLeft,
  History,
  ShieldAlert,
  List,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useSession } from "@/app/lib/auth-client";
import {
  confirmReport,
  markReportResolved,
  hideReport,
  getReportsForModeration,
} from "@/actions/reports/reportModeration";

// Default marker icon path as fallback
const DEFAULT_MARKER_ICON = "/marker.png";

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
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<"list" | "history" | "queue">("list");
  const [selectedReportForHistory, setSelectedReportForHistory] =
    useState<any>(null);
  const [reportHistory, setReportHistory] = useState<{
    statusChanges: any[];
    votes: any[];
  } | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [queueReports, setQueueReports] = useState<any[]>([]);
  const [queueLoading, setQueueLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("recent");

  const {
    reports,
    filteredReports,
    timeRange,
    filters,
    reportTypes,
    refreshReports,
  } = useData();
  const { current: map } = useMap();
  const { data: session } = useSession();

  // Check if user is admin or moderator
  const isAdminOrMod =
    session?.user?.role === "admin" || session?.user?.role === "moderator";

  // Get the correct report list based on filter state
  const displayReports = filters.isFiltering ? filteredReports : reports;

  // Sort reports by createdAt in reverse chronological order
  const sortedReports = [...(displayReports || [])].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Fetch moderation queue reports when tab changes to queue
  useEffect(() => {
    if (activeTab === "queue" && isAdminOrMod) {
      fetchQueueReports();
    }
  }, [activeTab, isAdminOrMod]);

  // Add an additional function to fetch reports specifically for the moderation queue
  const fetchQueueReports = async () => {
    setQueueLoading(true);

    try {
      // First, we'll get all reports within the time range, including invisible ones
      // We'll create a special server action for this
      const moderationReports = await getReportsForModeration(timeRange);

      if (!moderationReports || moderationReports.length === 0) {
        setQueueReports([]);
        return;
      }

      // Filter for reports that need attention
      const needsAttention = moderationReports.filter(
        (report) =>
          report.reportStatus === "DISPUTED" ||
          (report.disconfirmationCount >= 3 &&
            report.reportStatus === "ACTIVE") ||
          (report.confirmationCount >= 3 && report.disconfirmationCount >= 3)
      );

      // Sort by most disconfirmations first
      const sorted = [...needsAttention].sort(
        (a, b) => b.disconfirmationCount - a.disconfirmationCount
      );

      setQueueReports(sorted);
    } catch (error) {
      console.error("Error fetching moderation queue:", error);
    } finally {
      setQueueLoading(false);
    }
  };

  // Handle taking action on a report in the queue
  const handleReportAction = async (
    report: any,
    action: "verify" | "resolve" | "remove"
  ) => {
    try {
      // Show loading state for this specific report
      setQueueReports((prev) =>
        prev.map((r) => (r.id === report.id ? { ...r, isProcessing: true } : r))
      );

      let result;

      if (action === "verify") {
        result = await confirmReport(session, {
          reportId: report.id,
          isConfirmed: true,
        });
      } else if (action === "resolve") {
        result = await markReportResolved(session, report.id);
      } else if (action === "remove") {
        result = await hideReport(session, report.id);
      }

      if (result && result.success) {
        // Show success toast
        toast.success(`Report ${action}d successfully`);

        // Remove from queue immediately
        setQueueReports((prev) => prev.filter((r) => r.id !== report.id));

        // Refresh the reports data
        refreshReports();
      } else {
        // Show error and revert loading state
        toast.error(`Failed to ${action} report`);
        setQueueReports((prev) =>
          prev.map((r) =>
            r.id === report.id ? { ...r, isProcessing: false } : r
          )
        );
      }
    } catch (error) {
      console.error(`Error with ${action} action:`, error);
      toast.error(`Error: Could not ${action} report`);

      // Revert loading state on error
      setQueueReports((prev) =>
        prev.map((r) =>
          r.id === report.id ? { ...r, isProcessing: false } : r
        )
      );
    }
  };

  // Load report history when a report is selected for history view
  useEffect(() => {
    if (selectedReportForHistory && view === "history") {
      const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
          const result = await getReportHistory(selectedReportForHistory.id);
          if (result.success) {
            setReportHistory(result.data);
          } else {
            console.error("Failed to fetch report history:", result.error);
            setReportHistory({ statusChanges: [], votes: [] });
          }
        } catch (error) {
          console.error("Error fetching report history:", error);
          setReportHistory({ statusChanges: [], votes: [] });
        } finally {
          setHistoryLoading(false);
        }
      };

      fetchHistory();
    }
  }, [selectedReportForHistory, view]);

  // Handle viewing a report's history
  const viewReportHistory = (report: any) => {
    setSelectedReportForHistory(report);
    setView("history");
  };

  // Return to the list view
  const returnToList = () => {
    setView("list");
    setSelectedReportForHistory(null);
    setReportHistory(null);
  };

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

  // Helper to create filter info text
  const getFilterInfo = () => {
    if (!filters.isFiltering) return null;

    const parts = [];

    if (filters.selectedReportTypes.length > 0) {
      parts.push(
        `${filters.selectedReportTypes.length} type${
          filters.selectedReportTypes.length !== 1 ? "s" : ""
        }`
      );
    }

    const fieldCount = Object.values(filters.selectedFields).flat().length;
    if (fieldCount > 0) {
      parts.push(`${fieldCount} field filter${fieldCount !== 1 ? "s" : ""}`);
    }

    if (
      filters.useHistoricalMode &&
      filters.dateRange.from &&
      filters.dateRange.to
    ) {
      const from = format(new Date(filters.dateRange.from), "MMM d");
      const to = format(new Date(filters.dateRange.to), "MMM d");
      parts.push(`${from} - ${to}`);
    }

    return parts.join(", ");
  };

  // Renders a report item (used in multiple views)
  const renderReportItem = (
    report: any,
    showHistoryButton = true,
    showActions = false
  ) => {
    // Get report type information
    const reportType =
      report.reportType ||
      reportTypes.find((t) => t.id === report.reportTypeId);

    // Get icon URL from report type
    const iconSrc = reportType?.iconUrl || DEFAULT_MARKER_ICON;
    const typeName = reportType?.name || "Unknown";

    const description = formatDescription(report.description);

    // Determine status badges
    const isConfirmed = report.reportStatus === "CONFIRMED";
    const isDisputed = report.reportStatus === "DISPUTED";
    const isDeparted = report.itemStatus === "DEPARTED";

    return (
      <div
        key={report.id}
        className={`p-3 rounded-md border transition-colors cursor-pointer relative group ${
          hoveredReportId === report.id
            ? "bg-accent border-accent-foreground/20"
            : "hover:bg-accent/50"
        }`}
        onMouseEnter={() => setHoveredReportId(report.id)}
        onMouseLeave={() => setHoveredReportId(null)}
        onClick={() => handleReportClick(report)}
      >
        {/* Report content */}
        <div className="flex gap-3">
          {/* Report icon */}
          <div className="mt-0.5 relative w-6 h-6 flex-shrink-0">
            {iconSrc ? (
              <Image
                src={iconSrc}
                alt={typeName}
                width={24}
                height={24}
                className={isDeparted ? "opacity-60" : ""}
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.style.display = "none";
                  // Show fallback icon
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML =
                      '<div class="flex items-center justify-center w-6 h-6 bg-primary rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>';
                  }
                }}
              />
            ) : (
              // SVG fallback if no icon is available
              <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Report content */}
          <div className="flex-1 min-w-0">
            {/* Title line with badges */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium truncate">{typeName}</span>

              {/* Status badges */}
              <div className="flex gap-1">
                {isConfirmed && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Confirmed
                  </span>
                )}
                {isDisputed && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    Disputed
                  </span>
                )}
                {isDeparted && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    Departed
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground truncate">
              {description}
            </p>

            {/* Vote counts */}
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                {report.confirmationCount}
              </span>
              <span className="flex items-center">
                <XCircle className="h-3 w-3 mr-1 text-red-600" />
                {report.disconfirmationCount}
              </span>
              <span title={getTimeAgo(report.createdAt)}>
                {formatTime(report.createdAt)}
              </span>
            </div>

            {/* Action buttons for moderation queue */}
            {showActions && (
              <div className="flex mt-2 gap-1 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-2 h-6 text-green-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReportAction(report, "verify");
                  }}
                  disabled={report.isProcessing}
                >
                  {report.isProcessing ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    "Verify"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-2 h-6 text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReportAction(report, "resolve");
                  }}
                  disabled={report.isProcessing}
                >
                  {report.isProcessing ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    "Resolve"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-2 h-6 text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReportAction(report, "remove");
                  }}
                  disabled={report.isProcessing}
                >
                  {report.isProcessing ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    "Remove"
                  )}
                </Button>
              </div>
            )}

            {/* History button */}
            {showHistoryButton && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent click
                  viewReportHistory(report);
                }}
                title="View History"
              >
                <History className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="report-sidebar absolute right-0 top-0 h-full z-10 flex">
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
          {/* Tabs for different views */}
          {view === "list" ? (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <div className="p-4 border-b">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger
                    value="recent"
                    className="flex items-center gap-1"
                  >
                    <List className="h-3.5 w-3.5" />
                    <span>Recent</span>
                  </TabsTrigger>
                  {isAdminOrMod && (
                    <TabsTrigger
                      value="queue"
                      className="flex items-center gap-1"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>Moderation</span>
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <TabsContent
                value="recent"
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    Recent Reports
                    {filters.isFiltering && (
                      <Badge variant="secondary" className="font-normal">
                        Filtered
                      </Badge>
                    )}
                  </h2>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    {filters.isFiltering ? (
                      <>
                        <Filter size={14} />
                        <span>
                          {getFilterInfo()} ({sortedReports.length} results)
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock size={14} />
                        <span>
                          Showing reports from the past {timeRange} hours
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Recent reports list */}
                <div className="flex-1 overflow-y-auto p-2">
                  {isLoading ? (
                    // Loading skeleton
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-3 rounded-md border">
                          <div className="flex gap-3">
                            <Skeleton className="w-6 h-6" />
                            <div className="flex-1">
                              <Skeleton className="w-1/2 h-4 mb-2" />
                              <Skeleton className="w-3/4 h-3 mb-2" />
                              <Skeleton className="w-1/4 h-3" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : sortedReports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <AlertCircle className="mb-2" />
                      <p>
                        No reports{" "}
                        {filters.isFiltering
                          ? "match your filters"
                          : "in the selected time range"}
                      </p>
                      {filters.isFiltering && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => {
                            setIsLoading(true);
                            setTimeout(() => {
                              // Reset filters using context
                              const resetFiltersBtn = document.querySelector(
                                '[aria-label="Reset Filters"]'
                              ) as HTMLButtonElement;
                              if (resetFiltersBtn) {
                                resetFiltersBtn.click();
                              }
                              setIsLoading(false);
                            }, 300);
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sortedReports.map((report) => renderReportItem(report))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Moderation Queue Tab */}
              {isAdminOrMod && (
                <TabsContent
                  value="queue"
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      Moderation Queue
                    </h2>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <ShieldAlert size={14} />
                      <span>
                        Reports requiring attention ({queueReports.length})
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2">
                    {queueLoading ? (
                      // Loading skeleton
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-3 rounded-md border">
                            <div className="flex gap-3">
                              <Skeleton className="w-6 h-6" />
                              <div className="flex-1">
                                <Skeleton className="w-1/2 h-4 mb-2" />
                                <Skeleton className="w-3/4 h-3 mb-2" />
                                <Skeleton className="w-1/4 h-3" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : queueReports.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <CheckCircle className="mb-2" />
                        <p>No reports require moderation</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {queueReports.map((report) =>
                          renderReportItem(report, false, true)
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          ) : view === "history" ? (
            // History View
            <>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={returnToList}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-semibold">Report History</h2>
                  <div className="w-8"></div> {/* Empty space for balance */}
                </div>
                {selectedReportForHistory && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {reportTypes.find(
                      (t) => t.id === selectedReportForHistory.reportTypeId
                    )?.name || "Unknown Type"}
                    <span className="mx-1">•</span>
                    <span>
                      {formatTime(selectedReportForHistory.createdAt)}
                    </span>
                  </div>
                )}
              </div>

              <ScrollArea className="flex-1">
                {historyLoading ? (
                  <div className="space-y-2 p-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 p-3">
                    {reportHistory ? (
                      <>
                        {/* Render combined history here... */}
                        {/* This would be your existing history rendering code */}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <AlertCircle className="mb-2" />
                        <p>No history available for this report</p>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
