"use client";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataProvider";
import { voteOnReport } from "@/actions/reports/postVotes";
import { getUserVotes } from "@/actions/reports/getUserVote";
import { confirmReport } from "@/actions/reports/reportModeration";
import type { Session } from "@/app/lib/auth-client";

import { Popup } from "react-map-gl/maplibre";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Check,
  X,
  Trash,
  Edit,
  Shield,
  ShieldAlert,
  Clock,
  CalendarPlus,
  Binoculars,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Pin,
  MapPin,
  MapPinOff,
} from "lucide-react";

// Create a vote cache to avoid repeated API calls
const voteCache = new Map<number, number>();

interface Report {
  id: number;
  long: number;
  lat: number;
  reportTypeId: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  departedAt?: string | null;
  confirmationCount: number;
  disconfirmationCount: number;
  submittedById?: string;
  isVisible: boolean;
  isPermanent: boolean;
  reportStatus: "ACTIVE" | "CONFIRMED" | "DISPUTED" | "RESOLVED" | "INCORRECT";
  itemStatus: "PRESENT" | "DEPARTED" | "UNKNOWN";
}

interface ReportPopupProps {
  selectedReport: Report | null;
  setSelectedReport: (report: Report | null) => void;
  setEditing: (editing: boolean) => void;
  session: Session | null;
  handleDelete: (reportId: string) => Promise<void>;
}

export default function ReportPopup({
  selectedReport,
  setSelectedReport,
  setEditing,
  session,
  handleDelete,
}: ReportPopupProps) {
  const { reportTypes, globalSettings } = useData();
  const [userVote, setUserVote] = useState<number | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    confirm: false,
    edit: false,
    delete: false,
    vote: false,
  });

  // Parse the description safely
  const [parsedDescription, setParsedDescription] = useState<
    Record<string, any>
  >({});

  // Parse description when selected report changes
  useEffect(() => {
    if (!selectedReport) return;

    try {
      // Check if description is already an object
      if (
        typeof selectedReport.description === "object" &&
        selectedReport.description !== null
      ) {
        setParsedDescription(selectedReport.description);
      }
      // If it's a string, try to parse it
      else if (typeof selectedReport.description === "string") {
        setParsedDescription(JSON.parse(selectedReport.description));
      }
    } catch (error) {
      console.error("Error parsing description:", error);
      setParsedDescription({});
    }
  }, [selectedReport]);

  // Fetch user's vote for this report
  useEffect(() => {
    if (!session?.user?.id || !selectedReport?.id) return;

    // Check cache first
    if (voteCache.has(selectedReport.id)) {
      setUserVote(voteCache.get(selectedReport.id) || null);
      return;
    }

    const fetchUserVote = async () => {
      try {
        if (session?.user?.id) {
          const vote = await getUserVotes(session.user.id, selectedReport.id);
          const voteValue = vote ? vote.value : 0;
          setUserVote(voteValue);
          voteCache.set(selectedReport.id, voteValue);
        }
      } catch (error) {
        console.error("Error fetching user vote:", error);
      }
    };

    fetchUserVote();
  }, [session?.user?.id, selectedReport?.id]);

  // Return null if no report is selected
  if (!selectedReport) return null;

  // Find the report type from the available types
  const reportType = reportTypes.find(
    (type) => type.id === selectedReport.reportTypeId
  );

  const reportTypeName = reportType ? reportType.name : "Unknown Type";

  // Get status badge settings based on report status
  const getReportStatusBadge = () => {
    switch (selectedReport.reportStatus) {
      case "CONFIRMED":
        return {
          label: "Confirmed",
          color: "bg-green-600 text-white",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
        };
      case "DISPUTED":
        return {
          label: "Disputed",
          color: "bg-amber-500 text-white",
          icon: <AlertTriangle className="h-3 w-3 mr-1" />,
        };
      case "RESOLVED":
        return {
          label: "Resolved",
          color: "bg-blue-600 text-white",
          icon: <Check className="h-3 w-3 mr-1" />,
        };
      case "INCORRECT":
        return {
          label: "Incorrect",
          color: "bg-red-600 text-white",
          icon: <XCircle className="h-3 w-3 mr-1" />,
        };
      case "ACTIVE":
      default:
        return {
          label: "Active",
          color: "bg-slate-600 text-white",
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
    }
  };

  // Get item status badge settings
  const getItemStatusBadge = () => {
    switch (selectedReport.itemStatus) {
      case "PRESENT":
        return {
          label: "Present",
          color: "bg-indigo-600 text-white",
          icon: <MapPin className="h-3 w-3 mr-1" />,
        };
      case "DEPARTED":
        return {
          label: "Departed",
          color: "bg-purple-600 text-white",
          icon: <MapPinOff className="h-3 w-3 mr-1" />,
        };
      case "UNKNOWN":
      default:
        return {
          label: "Unknown",
          color: "bg-gray-500 text-white",
          icon: <HelpCircle className="h-3 w-3 mr-1" />,
        };
    }
  };

  const reportStatusBadge = getReportStatusBadge();
  const itemStatusBadge = getItemStatusBadge();

  // Handle voting on a report
  const handleVote = async (voteType: number) => {
    // Prevent voting if visitors are not allowed and user is not logged in
    if (!session?.user?.id && !globalSettings?.votesOpenToVisitors) {
      toast.error("You must be logged in to vote");
      return;
    }

    try {
      setLoading({ ...loading, vote: true });

      const votePayload = {
        reportId: selectedReport.id,
        userId: session?.user?.id || "anonymous", // Handle anonymous users
        voteType,
      };

      const result = await voteOnReport(votePayload);

      if (result.success) {
        // Update the cache
        voteCache.set(selectedReport.id, voteType);
        setUserVote(voteType);

        // Update the report status if changed
        if (
          result.reportStatus &&
          result.reportStatus !== selectedReport.reportStatus
        ) {
          setSelectedReport({
            ...selectedReport,
            reportStatus: result.reportStatus,
            itemStatus: result.itemStatus || selectedReport.itemStatus,
          });
        }

        toast.success("Vote submitted!");
      } else {
        toast.error(result.error || "Failed to submit vote");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Failed to submit vote");
    } finally {
      setLoading({ ...loading, vote: false });
    }
  };

  // Handle confirming a report (for admins/mods)
  const handleConfirm = async () => {
    if (!selectedReport || !isAdminOrMod) return;

    try {
      setLoading({ ...loading, confirm: true });
      let newConfirmationStatus = false;

      // Toggle the verification status
      if (selectedReport.reportStatus === "CONFIRMED") {
        newConfirmationStatus = false;
      } else {
        newConfirmationStatus = true;
      }

      const response = await confirmReport(session, {
        reportId: selectedReport.id,
        isConfirmed: newConfirmationStatus,
      });

      if (response.success) {
        toast.success(
          `Report ${
            newConfirmationStatus ? "confirmed" : "disputed"
          } successfully`
        );

        let updatedReportStatus = "ACTIVE";

        if (newConfirmationStatus) {
          updatedReportStatus = "CONFIRMED";
        } else {
          updatedReportStatus = "DISPUTED";
        }

        // Update the selected report with the new verification status
        setSelectedReport({
          ...selectedReport,
          reportStatus: updatedReportStatus,
        });
      } else {
        toast.error(response.error || "Failed to update verification status");
      }
    } catch (error) {
      console.error("Error confirming report:", error);
      toast.error("An error occurred while updating confirmation status");
    } finally {
      setLoading({ ...loading, confirm: false });
    }
  };

  // Check if the user is an admin or moderator
  const isAdminOrMod =
    session?.user?.role === "admin" || session?.user?.role === "moderator";

  // Check if the user is the report submitter
  const isSubmitter = session?.user?.id === selectedReport.submittedById;

  // Check if report can be edited by this user
  const canEdit = isSubmitter || isAdminOrMod;

  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Popup
      longitude={selectedReport?.long}
      latitude={selectedReport?.lat}
      closeButton={true}
      closeOnClick={false}
      onClose={() => setSelectedReport(null)}
      anchor="bottom" // Always show popup above the marker
      offset={40} // Increase offset to avoid covering the marker
      className="report-popup z-30"
      maxWidth="320px"
    >
      <Card className="w-full bg-card shadow-md border border-border relative">
        <CardHeader className="pb-2 pt-3 px-3">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-1">
                {reportTypeName || "Report"}
                {selectedReport.isPermanent && (
                  <Pin className="h-3 w-3 ml-1 text-muted-foreground" />
                )}
              </CardTitle>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-2">
              {selectedReport.reportStatus === "DISPUTED" && (
                <Badge
                  className={`${reportStatusBadge.color} text-xs px-2 py-0.5 flex items-center`}
                >
                  {reportStatusBadge.icon}
                  {reportStatusBadge.label}
                </Badge>
              )}

              <Badge
                className={`${itemStatusBadge.color} text-xs px-2 py-0.5 flex items-center`}
              >
                {itemStatusBadge.icon}
                {itemStatusBadge.label}
              </Badge>
              {/* Vote counts display */}
              <div className="flex space-x-2 text-xs">
                <span className="flex items-center text-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  {selectedReport.confirmationCount}
                </span>
                <span className="flex items-center text-red-600">
                  <X className="h-3 w-3 mr-1" />
                  {selectedReport.disconfirmationCount}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-3 space-y-3">
          <ScrollArea className="max-h-48 pr-2">
            {/* Time information */}
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>Submitted: {formatDate(selectedReport.createdAt)}</span>
              </div>

              {selectedReport.updatedAt !== selectedReport.createdAt && (
                <div className="flex items-center gap-1">
                  <CalendarPlus size={14} />
                  <span>Updated: {formatDate(selectedReport.updatedAt)}</span>
                </div>
              )}

              {selectedReport.departedAt && (
                <div className="flex items-center gap-1">
                  <MapPinOff size={14} />
                  <span>Departed: {formatDate(selectedReport.departedAt)}</span>
                </div>
              )}
            </div>

            {/* Description fields */}
            {Object.keys(parsedDescription).length > 0 && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                {Object.entries(parsedDescription)
                  .filter(([_, value]) => value && String(value).trim() !== "")
                  .map(([field, value]) => (
                    <div key={field} className="text-sm">
                      <span className="font-medium capitalize">{field}: </span>
                      <span className="text-foreground">{String(value)}</span>
                    </div>
                  ))}
              </div>
            )}
          </ScrollArea>

          {/* Vote buttons (only show if user is not the submitter and the item is still present) */}
          {(session?.user?.id !== selectedReport.submittedById ||
            !selectedReport.submittedById) &&
            (globalSettings?.votesOpenToVisitors || session?.user?.id) &&
            selectedReport.itemStatus !== "DEPARTED" && (
              <div className="flex justify-between gap-2 pt-2">
                <Button
                  size="sm"
                  className={
                    userVote === 1
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                  }
                  onClick={() => handleVote(1)}
                  disabled={loading.vote}
                >
                  <Check className="mr-1 h-4 w-4" />I See It
                </Button>
                <Button
                  size="sm"
                  className={
                    userVote === -1
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                  }
                  onClick={() => handleVote(-1)}
                  disabled={loading.vote}
                >
                  <X className="mr-1 h-4 w-4" />I Don&apos;t See It
                </Button>
              </div>
            )}
        </CardContent>

        {/* Admin/Mod/Submitter options */}
        {(canEdit || isAdminOrMod) && (
          <CardFooter className="p-3 pt-0 flex flex-col gap-2">
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center"
                onClick={() => setEditing(true)}
                disabled={loading.edit}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Report
              </Button>
            )}

            {/* Confirm/Dispute button for admins/mods */}
            {isAdminOrMod && (
              <Button
                variant="outline"
                size="sm"
                className={`w-full flex items-center justify-center ${
                  selectedReport.reportStatus === "CONFIRMED"
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : ""
                }`}
                onClick={handleConfirm}
                disabled={loading.confirm}
              >
                {selectedReport.reportStatus === "CONFIRMED" ? (
                  <>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Dispute Report
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Confirm Report
                  </>
                )}
              </Button>
            )}

            {/* Delete button */}
            {(isSubmitter || isAdminOrMod) && (
              <Button
                variant="destructive"
                size="sm"
                className="w-full flex items-center justify-center"
                onClick={() => {
                  setLoading({ ...loading, delete: true });
                  handleDelete(String(selectedReport.id)).finally(() =>
                    setLoading({ ...loading, delete: false })
                  );
                }}
                disabled={loading.delete}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Report
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </Popup>
  );
}
