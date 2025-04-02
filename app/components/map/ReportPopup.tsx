"use client";
import { useState, useEffect } from "react";
import { useData } from "@/app/components/layout/DataProvider";
import { voteOnReport } from "@/actions/postVotes";
import { getUserVotes } from "@/actions/getUserVote";
import { verifyReport } from "@/actions/verifyReport";
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
  lastSighting?: string;
  confirmationCount: number;
  disconfirmationCount: number;
  submittedById?: string;
  isVisible: boolean;
  isVerified?: boolean; // New property for admin verification
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
    verify: false,
    edit: false,
    delete: false,
    vote: false,
  });

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

  // Parse the description JSON
  const parsedDescription = selectedReport.description
    ? JSON.parse(selectedReport.description)
    : {};

  // Find the report type from the available types
  const reportType = reportTypes.find(
    (type) => type.id === selectedReport.reportTypeId
  );

  const reportTypeName = reportType ? reportType.name : "Unknown Type";

  // Determine the status of the report based on confirmation/disconfirmation counts
  const getStatus = () => {
    if (selectedReport.isVerified) {
      return { label: "Verified", color: "bg-primary text-primary-foreground" };
    }
    if (selectedReport.disconfirmationCount >= 5) {
      return {
        label: "Not There",
        color: "bg-destructive text-destructive-foreground",
      };
    }
    if (selectedReport.confirmationCount >= 5) {
      return { label: "Confirmed", color: "bg-green-600 text-white" };
    }
    return { label: "Unconfirmed", color: "bg-amber-500 text-white" };
  };

  const { label, color } = getStatus();

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

      await voteOnReport(votePayload);

      // Update the cache
      voteCache.set(selectedReport.id, voteType);
      setUserVote(voteType);

      toast.success("Vote submitted!");
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Failed to submit vote");
    } finally {
      setLoading({ ...loading, vote: false });
    }
  };

  // Handle verifying a report (for admins/mods)
  const handleVerify = async () => {
    if (!selectedReport || !isAdminOrMod) return;

    try {
      setLoading({ ...loading, verify: true });

      // Toggle the verification status
      const newVerificationStatus = !selectedReport.isVerified;

      const response = await verifyReport(session, {
        reportId: selectedReport.id,
        isVerified: newVerificationStatus,
      });

      if (response.success) {
        toast.success(
          `Report ${
            newVerificationStatus ? "verified" : "unverified"
          } successfully`
        );

        // Update the selected report with the new verification status
        setSelectedReport({
          ...selectedReport,
          isVerified: newVerificationStatus,
        });
      } else {
        toast.error(response.error || "Failed to update verification status");
      }
    } catch (error) {
      console.error("Error verifying report:", error);
      toast.error("An error occurred while updating verification status");
    } finally {
      setLoading({ ...loading, verify: false });
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
          <div className="flex flex-col items-start justify-between">
            <CardTitle className="text-base flex items-center gap-1">
              {reportTypeName || "Report"}
            </CardTitle>
            <Badge className={`${color} text-xs px-2 py-0.5`}>{label}</Badge>
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

              {selectedReport.lastSighting && (
                <div className="flex items-center gap-1">
                  <Binoculars size={14} />
                  <span>
                    Last Sighting: {formatDate(selectedReport.lastSighting)}
                  </span>
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

          {/* Vote buttons (only show if user is not the submitter) */}
          {(session?.user?.id !== selectedReport.submittedById ||
            !selectedReport.submittedById) &&
            (globalSettings?.votesOpenToVisitors || session?.user?.id) && (
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

            {/* Verify button for admins/mods */}
            {isAdminOrMod && (
              <Button
                variant="outline"
                size="sm"
                className={`w-full flex items-center justify-center ${
                  selectedReport.isVerified
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : ""
                }`}
                onClick={handleVerify}
                disabled={loading.verify}
              >
                {selectedReport.isVerified ? (
                  <>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Unverify Report
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Report
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
