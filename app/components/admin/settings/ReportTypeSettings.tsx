// app/components/admin/settings/ReportTypeSettings.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReportTypeEditor from "./ReportTypeEditor";
import {
  getReportTypes,
  saveReportType,
  deleteReportType,
} from "@/actions/admin/reportTypes";
import Image from "next/image";

// Define types
interface ReportType {
  id: number;
  name: string;
  description?: string;
  fields: string; // JSON string of field configurations
}

interface ReportTypeSettingsProps {
  session: any;
}

export default function ReportTypeSettings({
  session,
}: ReportTypeSettingsProps) {
  const [reportTypes, setReportTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a fetchReportTypes function that can be called anytime we need to refresh
  const fetchReportTypes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getReportTypes();
      if (result.success) {
        setReportTypes(result.data);
      } else {
        toast.error(result.message || "Failed to load report types");
      }
    } catch (error) {
      console.error("Error fetching report types:", error);
      toast.error("An error occurred while loading report types");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load report types on mount and when specific actions take place
  useEffect(() => {
    fetchReportTypes();

    // Set up an interval to refresh data periodically
    const refreshInterval = setInterval(() => {
      fetchReportTypes();
    }, 60000); // Refresh every minute

    return () => clearInterval(refreshInterval);
  }, [fetchReportTypes]);

  // Handle creating a new report type
  const handleCreateNew = () => {
    setSelectedReportType({
      id: 0, // New report type
      name: "",
      description: "",
      fields: "[]", // Empty fields array as JSON string
    });
    setEditorOpen(true);
  };

  // Handle editing an existing report type
  const handleEdit = (reportType) => {
    setSelectedReportType(reportType);
    setEditorOpen(true);
  };

  // Handle saving a report type
  const handleSave = async (reportType) => {
    setIsSubmitting(true);
    try {
      const result = await saveReportType(reportType);

      if (result.success) {
        // Refresh all data
        await fetchReportTypes();

        toast.success(
          reportType.id ? "Report type updated" : "Report type created"
        );
        setEditorOpen(false);
        setSelectedReportType(null);
      } else {
        toast.error(result.error || "Failed to save report type");
      }
    } catch (error) {
      console.error("Error saving report type:", error);
      toast.error("An error occurred while saving the report type");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare to delete a report type
  const handleDeleteClick = (reportType) => {
    setSelectedReportType(reportType);
    setDeleteDialogOpen(true);
  };

  // Confirm deletion of a report type
  const handleDeleteConfirm = async () => {
    if (!selectedReportType) return;

    setIsSubmitting(true);
    try {
      const result = await deleteReportType(selectedReportType.id);

      if (result.success) {
        // Refresh all data
        await fetchReportTypes();

        toast.success("Report type deleted");
      } else {
        toast.error(result.message || "Failed to delete report type");
      }
    } catch (error) {
      console.error("Error deleting report type:", error);
      toast.error("An error occurred while deleting the report type");
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
      setSelectedReportType(null);
    }
  };

  // Get field count for each report type
  const getFieldCount = (fieldsJson) => {
    try {
      const fields = JSON.parse(fieldsJson);
      if (Array.isArray(fields)) return fields.length;
      if (typeof fields === "object") return Object.keys(fields).length;
      return 0;
    } catch (e) {
      console.error("Error parsing fields:", e);
      return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-bold">Report Type Settings</h2>
        <p className="text-muted-foreground">
          Manage the types of reports users can submit and their associated
          fields.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Report Types</CardTitle>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Type
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Fields</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportTypes.length > 0 ? (
                  reportTypes.map((reportType) => (
                    <TableRow key={reportType.id}>
                      <TableCell>
                        <Image
                          src={
                            reportType.iconUrl ||
                            "/uploads/icons/default-marker.png"
                          }
                          alt={reportType.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                          loading="lazy"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {reportType.name}
                      </TableCell>
                      <TableCell>{reportType.description || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getFieldCount(reportType.fields)} fields
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(reportType)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteClick(reportType)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No report types found. Create your first report type to
                      allow users to submit reports.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Report Type Editor Dialog */}
      <Dialog
        open={editorOpen}
        onOpenChange={(open) => {
          // Only allow closing via the Cancel button or X button
          if (open === false && !isSubmitting) {
            setEditorOpen(false);
          }
        }}
      >
        <DialogContent
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedReportType?.id
                ? "Edit Report Type"
                : "Create Report Type"}
            </DialogTitle>
          </DialogHeader>
          {selectedReportType && (
            <ReportTypeEditor
              reportType={selectedReportType}
              onSave={handleSave}
              isSubmitting={isSubmitting}
              onCancel={() => setEditorOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the report type "
              {selectedReportType?.name}". All associated reports may become
              unusable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
