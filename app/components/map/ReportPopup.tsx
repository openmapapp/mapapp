"use client";
import { useState, useEffect } from "react";
import { useData } from "@/app/components/layout/DataProvider";
import { voteOnReport } from "@/actions/postVotes";
import { getUserVotes } from "@/actions/getUserVote";
import type { Session } from "@/app/lib/auth-client";

import { Popup } from "react-map-gl/maplibre";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Check, X, Trash } from "lucide-react";

const voteCache = new Map();

interface ReportPopupProps {
  selectedReport: any;
  setSelectedReport: (report: any) => void;
  setEditing: (editing: boolean) => void;
  session: Session | null;
  handleDelete: (reportId: string) => void;
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

  useEffect(() => {
    if (!session?.user.id || !selectedReport?.id) return;

    if (voteCache.has(selectedReport.id)) {
      setUserVote(voteCache.get(selectedReport.id));
      return;
    }

    const fetchUserVote = async () => {
      try {
        if (session?.user.id) {
          const vote = await getUserVotes(session.user.id, selectedReport.id);
          setUserVote(vote ? vote.value : 0);
        }
      } catch (error) {
        console.error("Error fetching user vote:", error);
      }
    };

    fetchUserVote();
  }, [session?.user?.id, selectedReport?.id]);

  if (!selectedReport) return null;

  const parsedDescription = selectedReport.description
    ? JSON.parse(selectedReport.description)
    : {};

  const reportType = reportTypes.find(
    (type) => type.id === selectedReport.reportTypeId
  );

  const reportTypeName = reportType ? reportType.name : "Unknown Type";

  const getStatus = () => {
    if (selectedReport.disconfirmationCount >= 5)
      return { label: "Not There", color: "bg-red-500" };
    if (selectedReport.confirmationCount >= 5)
      return { label: "Confirmed", color: "bg-green-500" };
    return { label: "Unconfirmed", color: "bg-yellow-500" };
  };

  const { label, color } = getStatus();

  const handleVote = async (voteType) => {
    // Prevent voting if visitors are not allowed
    if (!session?.user.id && !globalSettings?.votesOpenToVisitors) {
      toast.error("You must be logged in to vote");
      return;
    }

    try {
      const votePayload = {
        reportId: selectedReport.id,
        userId: session.user.id || null,
        voteType,
      };

      await voteOnReport(votePayload);

      setUserVote(voteType);
      toast.success("Vote submitted!");
      setSelectedReport(null);
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Failed to submit vote");
    }
  };

  return (
    <Popup
      longitude={selectedReport?.long}
      latitude={selectedReport?.lat}
      closeButton={false}
      closeOnClick={false}
      onClose={() => setSelectedReport(null)}
      anchor="top"
      className="flex justify-center"
    >
      <div className="flex items-center justify-center w-full">
        <Card className="w-64 bg-white relative shadow-none border-none">
          <Button
            className="absolute border-none shadow-none -top-2 -right-2 text-gray-500 hover:cursor-pointer focus:outline-none"
            variant={"ghost"}
            onClick={() => setSelectedReport(null)}
          >
            <X className="h-4 w-4" />
          </Button>

          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{reportTypeName || "Report"}</span>
              <Badge className={`mr-3 ${color}`}>{label}</Badge>
            </CardTitle>
          </CardHeader>
          <Separator />

          <CardContent className="p-3">
            <ScrollArea className="max-h-48">
              <p className="text-sm text-gray-600">
                <strong>Submitted: </strong>{" "}
                {new Date(selectedReport.createdAt).toLocaleString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {selectedReport.updatedAt !== selectedReport.createdAt && (
                <p className="text-sm text-gray-600">
                  <strong>Updated: </strong>{" "}
                  {new Date(selectedReport.updatedAt).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
              {selectedReport.lastSighting && (
                <p className="text-sm text-gray-600">
                  <strong>Last Sighting: </strong>{" "}
                  {new Date(selectedReport.lastSighting).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}

              {Object.keys(parsedDescription).length > 0 && (
                <>
                  <Separator className="my-2" />
                  <div className="text-sm space-y-1">
                    {Object.entries(parsedDescription)
                      .filter(([_, value]) => value && value.trim() !== "")
                      .map(([field, value]) => (
                        <p key={field}>
                          <strong className="capitalize">{field}: </strong>
                          {value}
                        </p>
                      ))}
                  </div>
                </>
              )}

              {session?.user.id &&
                (session?.user.id !== selectedReport.submittedById ||
                  !selectedReport.submittedById) && (
                  <div className="flex justify-between mt-3">
                    <Button
                      size="sm"
                      className={`${
                        userVote === 1
                          ? "bg-green-500 text-white"
                          : "bg-green-300 text-black"
                      }`}
                      onClick={() => handleVote(1)}
                      disabled={userVote === 1} // Disable if already confirmed
                    >
                      <Check className="mr-1 h-4 w-4" /> I See It
                    </Button>
                    <Button
                      size="sm"
                      className={`${
                        userVote === -1
                          ? "bg-red-500 text-white"
                          : "bg-red-300 text-black"
                      }`}
                      onClick={() => handleVote(-1)}
                      disabled={userVote === -1} // Disable if already disconfirmed
                    >
                      <X className="mr-1 h-4 w-4" /> I Don&apos;t See It
                    </Button>
                  </div>
                )}

              {(session?.user.id === selectedReport.submittedById ||
                session?.user.role === "admin" ||
                session?.user.role === "moderator") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 flex items-center justify-center"
                  onClick={() => {
                    setEditing(true);
                  }}
                >
                  Edit Report
                </Button>
              )}

              {(session?.user.id === selectedReport.submittedById ||
                session?.user.role === "admin" ||
                session?.user.role === "moderator") && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full mt-3 flex items-center justify-center bg-red-500 text-white hover:bg-red-600 hover:cursor-pointer"
                  onClick={() => handleDelete(selectedReport.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Report
                </Button>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </Popup>
  );
}
