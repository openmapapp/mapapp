"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import {
  getReportFields,
  createReportField,
  deleteReportField,
} from "@/actions/admin/reportFields";
import ReportFieldEditor from "./ReportFieldEditor";

export default function ReportFieldsSection() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a fetchFields function that can be called anytime we need to refresh
  const fetchFields = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getReportFields();
      if (response.success) {
        setFields(response.data);
      } else {
        toast.error("Failed to load fields");
      }
    } catch (error) {
      console.error("Error loading fields:", error);
      toast.error("An error occurred while loading fields");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load fields on mount and periodically refresh
  useEffect(() => {
    fetchFields();

    // Set up an interval to refresh data periodically
    const refreshInterval = setInterval(() => {
      fetchFields();
    }, 60000); // Refresh every minute

    return () => clearInterval(refreshInterval);
  }, [fetchFields]);

  const handleCreateField = () => {
    setSelectedField({
      name: "",
      label: "",
      type: "text",
      options: [],
      required: false,
      filterable: true,
      reportTypeIds: [],
    });
    setEditorOpen(true);
  };

  const handleEditField = (field) => {
    setSelectedField({
      ...field,
      reportTypeIds: field.reportTypes.map((rt) => rt.id),
    });
    setEditorOpen(true);
  };

  const handleSaveField = async (field) => {
    setIsSubmitting(true);
    try {
      const result = await createReportField(field);
      if (result.success) {
        await fetchFields(); // Refresh list
        toast.success("Field saved successfully");
        setEditorOpen(false);
      } else {
        toast.error(result.message || "Failed to save field");
      }
    } catch (error) {
      console.error("Error saving field:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (field) => {
    setSelectedField(field);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedField) return;

    setIsSubmitting(true);
    try {
      const result = await deleteReportField(selectedField.name);

      if (result.success) {
        await fetchFields(); // Refresh list
        toast.success("Field deleted successfully");
        setDeleteDialogOpen(false);
      } else {
        toast.error(result.message || "Failed to delete field");
      }
    } catch (error) {
      console.error("Error deleting field:", error);
      toast.error("An error occurred while deleting");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Report Fields</CardTitle>
        <Button onClick={handleCreateField}>
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">Loading fields...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Filterable</TableHead>
                <TableHead>Used In</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.length > 0 ? (
                fields.map((field) => (
                  <TableRow key={field.name}>
                    <TableCell className="font-mono">{field.name}</TableCell>
                    <TableCell>{field.label}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{field.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {field.filterable ? (
                        <Badge variant="success">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {field.reportTypes?.map((type) => (
                          <Badge key={type.id} variant="outline">
                            {type.name}
                          </Badge>
                        ))}
                        {(!field.reportTypes ||
                          field.reportTypes.length === 0) && (
                          <span className="text-muted-foreground text-sm">
                            Not used
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditField(field)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteClick(field)}
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
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No report fields found. Create your first field to add to
                    report types.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Field Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedField?.id ? "Edit Field" : "Create Field"}
            </DialogTitle>
          </DialogHeader>
          {selectedField && (
            <ReportFieldEditor
              field={selectedField}
              onSave={handleSaveField}
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
              This will permanently delete the field "{selectedField?.name}"
              from all report types. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
