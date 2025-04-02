"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { postReport } from "@/actions/postReport";
import { updateReport } from "@/actions/updateReport";
import { useSession } from "@/app/lib/auth-client";
import { useData } from "@/app/components/layout/DataProvider";

import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Define proper types
interface Report {
  id: number;
  reportTypeId: number;
  description: string;
  [key: string]: any;
}

interface ReportType {
  id: number;
  name: string;
  fields: string[];
}

interface PopupFormProps {
  latitude: number;
  longitude: number;
  existingReport?: Report | null;
  setSelectedReport?: (report: Report | null) => void;
  setEditing: (editing: boolean) => void;
  onClose: () => void;
}

// Define form schema
const FormSchema = z.object({
  reportTypeId: z.string().min(1, "Please select a report type"),
  dynamicFields: z.record(z.string()).optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const PopupForm = ({
  latitude,
  longitude,
  existingReport = null,
  setSelectedReport,
  setEditing,
  onClose,
}: PopupFormProps) => {
  const { reportTypes, globalSettings } = useData();
  const { data: session } = useSession();

  const userId = session?.user?.id || "";
  const trustScore = session?.user?.trust || 1;
  const [loading, setLoading] = useState(false);

  // Initialize report data from existing report or defaults
  const reportData = existingReport || { reportTypeId: "", description: "{}" };

  // Track selected report type and fields
  const [selectedReportType, setSelectedReportType] = useState<string | null>(
    () => {
      if (existingReport) {
        return String(existingReport.reportTypeId);
      }
      if (reportTypes.length > 0) {
        return String(reportTypes[0].id);
      }
      return null;
    }
  );

  const [selectedFields, setSelectedFields] = useState<string[]>(() => {
    if (!existingReport?.description) return [];
    try {
      return Object.keys(JSON.parse(reportData.description));
    } catch (error) {
      console.error("Error parsing report description:", error);
      return [];
    }
  });

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reportTypeId: reportData ? String(reportData.reportTypeId) : "",
      dynamicFields: reportData?.description
        ? JSON.parse(reportData.description)
        : {},
    },
  });

  // Find the selected report type object
  const selectedReport = reportTypes.find(
    (type) => String(type.id) === selectedReportType
  );
  const availableFields = selectedReport?.fields || [];

  // Set form values when existing report changes
  useEffect(() => {
    if (existingReport) {
      form.setValue("reportTypeId", String(existingReport.reportTypeId));

      try {
        const parsedDescription = existingReport.description
          ? JSON.parse(existingReport.description)
          : {};
        form.setValue("dynamicFields", parsedDescription);
      } catch (error) {
        console.error("Error parsing description:", error);
        form.setValue("dynamicFields", {});
      }
    }
  }, [existingReport, form]);

  // Add a field to the form
  const addField = (field: string) => {
    if (!selectedFields.includes(field)) {
      setSelectedFields((prev) => [...prev, field]);
      form.setValue(
        `dynamicFields.${field}`,
        form.getValues(`dynamicFields.${field}`) || ""
      );
    }
  };

  // Remove a field from the form
  const removeField = (field: string) => {
    setSelectedFields((prev) => prev.filter((f) => f !== field));
    form.setValue(`dynamicFields.${field}`, "");
    form.unregister(`dynamicFields.${field}`);
  };

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    if (!session && !globalSettings?.submitReportsOpen) {
      toast.error("You must be logged in to submit a report.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        latitude,
        longitude,
        reportTypeId: Number(values.reportTypeId),
        trustScore,
        userId: userId || null,
        description: JSON.stringify(values.dynamicFields || {}),
      };

      if (existingReport) {
        // Update existing report
        const updatedReport = await updateReport(
          existingReport.id,
          { ...values, reportTypeId: Number(values.reportTypeId) },
          session
        );

        toast.success("Report updated successfully!");

        if (setSelectedReport) {
          setSelectedReport(updatedReport);
        }
      } else {
        // Create new report
        const response = await postReport(payload);

        if (!response) {
          throw new Error("Failed to submit report");
        }

        toast.success("Report submitted successfully!");
      }

      // Reset form and close popup
      setSelectedFields([]);
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
      console.error("Failed to submit report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state if no report types are available
  if (!selectedReportType && reportTypes.length === 0) {
    return (
      <div className="p-4 flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading report types...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-2 sm:p-4 max-w-[320px] sm:max-w-[350px] overflow-y-auto max-h-[60vh]"
      >
        <h3 className="font-medium text-lg">
          {existingReport ? "Edit Report" : "New Report"}
        </h3>

        {/* Report Type Selection */}
        <FormField
          control={form.control}
          name="reportTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Report Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  setSelectedReportType(value);
                  setSelectedFields([]);
                  form.setValue("reportTypeId", value);
                }}
                value={field.value}
                disabled={loading || existingReport !== null}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a report type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Only show add field dropdown if there are available fields */}
        {availableFields.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {availableFields
                .filter((field) => !selectedFields.includes(field)) // Filter out already selected fields
                .map((field) => (
                  <DropdownMenuItem
                    key={field}
                    onClick={() => addField(field)}
                    className="cursor-pointer"
                  >
                    {field}
                  </DropdownMenuItem>
                ))}

              {/* Show message if all fields are selected */}
              {availableFields.filter(
                (field) => !selectedFields.includes(field)
              ).length === 0 && (
                <DropdownMenuItem disabled className="text-muted-foreground">
                  All fields added
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Show selected fields */}
        {selectedFields.length > 0 ? (
          <div className="space-y-3 pt-2">
            {selectedFields.map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={`dynamicFields.${field}`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-sm">{field}</FormLabel>
                    <div className="flex gap-2 items-center">
                      <FormControl>
                        <Input
                          {...formField}
                          placeholder={`Enter ${field}...`}
                          className="text-sm"
                          disabled={loading}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeField(field)}
                        disabled={loading}
                        className="h-8 w-8"
                      >
                        <Minus className="w-4 h-4" />
                        <span className="sr-only">Remove field</span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        ) : selectedReportType && availableFields.length > 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            Add fields to provide more details
          </p>
        ) : null}

        {/* Submit & Cancel Buttons */}
        <div className="flex justify-between gap-2 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className={cn(
              "flex-1",
              existingReport ? "bg-primary" : "bg-primary"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {existingReport ? "Updating..." : "Submitting..."}
              </>
            ) : existingReport ? (
              "Update"
            ) : (
              "Submit"
            )}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PopupForm;
