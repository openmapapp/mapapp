"use client";
import { useData } from "@/app/components/layout/DataProvider";
import { Popup } from "react-map-gl/maplibre";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, Trash } from "lucide-react";

export default function ReportPopup({
  selectedReport,
  setSelectedReport,
  session,
  handleDelete,
  popupPosition,
}) {
  if (!selectedReport || !popupPosition) return null;

  const { reportTypes } = useData();

  const parsedDescription = selectedReport.description
    ? JSON.parse(selectedReport.description)
    : {};

  const reportType = reportTypes.find(
    (type) => type.id === selectedReport.reportTypeId
  );
  const reportTypeName = reportType ? reportType.name : "Unknown Type";

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-full z-50"
      style={{
        left: popupPosition.x,
        top: popupPosition.y - 10, // Adjust positioning
      }}
    >
      <Card className="w-64 shadow-lg border bg-white relative">
        <Button
          className="absolute border-none shadow-none top-0.5 right-0.5 text-gray-500 hover:text-gray-800 hover:cursor-pointer focus:outline-none"
          onClick={() => setSelectedReport(null)}
        >
          <X className="h-4 w-4 focus:outline-none" />
        </Button>

        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{reportTypeName || "Report"}</span>
            <Badge className="mr-3">{selectedReport.trustScore} Trust</Badge>
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
              })}
            </p>

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

            {session?.user.id === selectedReport.submittedById && (
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
  );
}
