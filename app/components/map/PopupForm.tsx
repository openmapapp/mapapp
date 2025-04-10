"use client";

import { useEffect, useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { postReport } from "@/actions/reports/postReport";
import { updateReport } from "@/actions/reports/updateReport";
import { useSession } from "@/app/lib/auth-client";
import { useData } from "@/context/DataProvider";

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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, Loader2, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Define proper types
interface Report {
  id: number;
  reportTypeId: number;
  description: string;
  isPermanent?: boolean;
  reportStatus?: "ACTIVE" | "CONFIRMED" | "DISPUTED" | "RESOLVED" | "INCORRECT";
  itemStatus?: "PRESENT" | "DEPARTED" | "UNKNOWN";
  [key: string]: any;
}

interface PopupFormProps {
  latitude: number;
  longitude: number;
  existingReport?: Report | null;
  setSelectedReport?: (report: Report | null) => void;
  setEditing: (editing: boolean) => void;
  onClose: () => void;
}

// Define base form schema
const baseFormSchema = z.object({
  reportTypeId: z.string().min(1, "Please select a report type"),
  dynamicFields: z.record(z.string()).optional(),
  isPermanent: z.boolean().optional().default(false),
  itemStatus: z.enum(["PRESENT", "DEPARTED", "UNKNOWN"]).default("PRESENT"),
});

// TypeScript type for form values derived from schema
type FormValues = z.infer<typeof baseFormSchema>;

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
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Initialize report data from existing report or defaults
  const reportData = existingReport || {
    reportTypeId: "",
    description: "{}",
    isPermanent: false,
    itemStatus: "PRESENT",
  };

  // Track selected report type and fields
  const [selectedReportType, setSelectedReportType] = useState<string | null>(
    () => {
      if (existingReport) {
        return String(existingReport.reportTypeId);
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

  // Find the selected report type object
  const selectedReport = reportTypes.find(
    (type) => String(type.id) === selectedReportType
  );

  // Parse the fields from the JSON string
  const availableFields = useMemo(() => {
    if (!selectedReport?.fields) return [];
    try {
      // Parse the JSON string from the database
      const fieldsData = JSON.parse(selectedReport.fields);

      // Handle both array of field objects and simple object formats
      if (Array.isArray(fieldsData)) {
        // New format: array of field objects with name, label, type, etc.
        return fieldsData.map((field) => field.name);
      } else {
        // Legacy format: simple object with field names as keys
        return Object.keys(fieldsData);
      }
    } catch (error) {
      console.error("Error parsing fields:", error);
      return [];
    }
  }, [selectedReport]);

  // Helper function to see if component is required
  const isFieldRequired = (fieldName: string): boolean => {
    if (!selectedReport?.fields) return false;
    try {
      const fieldsData = JSON.parse(selectedReport.fields);
      if (Array.isArray(fieldsData)) {
        const fieldData = fieldsData.find((f) => f.name === fieldName);
        return fieldData?.required || false;
      }
    } catch (error) {
      console.error("Error parsing fields:", error);
    }
    return false;
  };

  // Generate dynamic schema based on required fields
  const getFormSchema = useMemo(() => {
    if (!selectedReport?.fields) {
      return baseFormSchema;
    }

    try {
      const fieldsData = JSON.parse(selectedReport.fields);
      let dynamicFieldsSchema: Record<string, any> = {};

      if (Array.isArray(fieldsData)) {
        // Process each field to build validation schema
        fieldsData.forEach((field) => {
          if (field.required) {
            // For required fields, add validation
            switch (field.type) {
              case "number":
                dynamicFieldsSchema[field.name] = z
                  .string()
                  .min(1, `${field.label} is required`);
                break;
              case "select":
                dynamicFieldsSchema[field.name] = z
                  .string()
                  .min(1, `${field.label} is required`);
                break;
              default:
                dynamicFieldsSchema[field.name] = z
                  .string()
                  .min(1, `${field.label} is required`);
            }
          }
        });
      }

      // Extend the base schema with dynamic fields validation
      return z.object({
        reportTypeId: z.string().min(1, "Please select a report type"),
        dynamicFields: z.object(dynamicFieldsSchema).partial(),
        isPermanent: z.boolean().optional().default(false),
        itemStatus: z
          .enum(["PRESENT", "DEPARTED", "UNKNOWN"])
          .default("PRESENT"),
      });
    } catch (error) {
      return baseFormSchema;
    }
  }, [selectedReport]);

  // Initialize the form with the dynamic schema
  const form = useForm<FormValues>({
    resolver: zodResolver(getFormSchema),
    defaultValues: {
      reportTypeId: reportData ? String(reportData.reportTypeId) : "",
      dynamicFields: reportData?.description
        ? JSON.parse(reportData.description)
        : {},
      isPermanent: reportData?.isPermanent || false,
      itemStatus: reportData?.itemStatus || "PRESENT",
    },
  });

  useEffect(() => {
    if (!selectedReport?.fields || !selectedReport?.fields) return;

    try {
      const fieldsData = JSON.parse(selectedReport.fields);
      if (!Array.isArray(fieldsData)) return;

      // Find all required fields
      const requiredFields = fieldsData
        .filter((field) => field.required)
        .map((field) => field.name);

      // Add any required fields that aren't already selected
      requiredFields.forEach((fieldName) => {
        if (!selectedFields.includes(fieldName)) {
          setSelectedFields((prev) => [...prev, fieldName]);

          // Initialize with empty value in the form
          form.setValue(`dynamicFields.${fieldName}`, "");
        }
      });
    } catch (error) {
      console.error("Error processing required fields:", error);
    }
  }, [selectedReport, selectedFields, form]);

  // Update how field values are displayed in the form
  const getFieldLabel = (fieldName: string): string => {
    if (!selectedReport?.fields) return fieldName;

    try {
      const fieldsData = JSON.parse(selectedReport.fields);

      if (Array.isArray(fieldsData)) {
        // Find the field object that matches this name
        const fieldData = fieldsData.find((f) => f.name === fieldName);
        return fieldData?.label || fieldName;
      } else {
        // Legacy format - convert from snake_case to Title Case
        return fieldName
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
    } catch (error) {
      return fieldName;
    }
  };

  // Update the field rendering to use field types
  const renderFieldInput = (fieldName: string, formField: any) => {
    if (!selectedReport?.fields) {
      // Default to text input if we can't determine field type
      return (
        <Input
          {...formField}
          placeholder={`Enter ${fieldName}...`}
          className="text-sm"
          disabled={loading}
        />
      );
    }

    try {
      const fieldsData = JSON.parse(selectedReport.fields);
      let fieldType = "text";
      let fieldOptions: string[] = [];
      let isRequired = false;

      if (Array.isArray(fieldsData)) {
        // New format with field objects
        const fieldData = fieldsData.find((f) => f.name === fieldName);
        if (fieldData) {
          fieldType = fieldData.type || "text";
          fieldOptions = fieldData.options || [];
          isRequired = !!fieldData.required;
        }
      }

      // Render the appropriate input based on field type
      switch (fieldType) {
        case "number":
          return (
            <Input
              {...formField}
              type="number"
              placeholder={`Enter ${getFieldLabel(fieldName)}...`}
              className="text-sm"
              disabled={loading}
              required={isRequired}
            />
          );
        case "select":
          return (
            <Select
              value={formField.value || ""}
              onValueChange={formField.onChange}
              disabled={loading}
            >
              <SelectTrigger
                className={`text-sm ${isRequired ? "border-primary" : ""}`}
              >
                <SelectValue
                  placeholder={`Select ${getFieldLabel(fieldName)}`}
                />
              </SelectTrigger>
              <SelectContent>
                {fieldOptions.length > 0 ? (
                  fieldOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No options available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          );
        default:
          return (
            <Input
              {...formField}
              placeholder={`Enter ${getFieldLabel(fieldName)}...`}
              className={`text-sm ${isRequired ? "border-primary" : ""}`}
              disabled={loading}
              required={isRequired}
            />
          );
      }
    } catch (error) {
      // Fallback to text input
      console.error("Error parsing field data:", error);
      return (
        <Input
          {...formField}
          placeholder={`Enter ${fieldName}...`}
          className="text-sm"
          disabled={loading}
        />
      );
    }
  };

  // Set form values when existing report changes
  useEffect(() => {
    if (existingReport) {
      form.setValue("reportTypeId", String(existingReport.reportTypeId));
      form.setValue("isPermanent", existingReport.isPermanent || false);
      form.setValue("itemStatus", existingReport.itemStatus || "PRESENT");

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
    // Check if the field is required before removing
    if (isFieldRequired(field)) {
      toast.error(`Cannot remove required field: ${getFieldLabel(field)}`);
      return;
    }

    setSelectedFields((prev) => prev.filter((f) => f !== field));
    form.setValue(`dynamicFields.${field}`, "");
    form.unregister(`dynamicFields.${field}`);
  };

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    // Check if a report type is selected
    if (!session && !globalSettings?.submitReportsOpen) {
      toast.error("You must be logged in to submit a report.");
      return;
    }

    // Validate required fields
    if (selectedReport?.fields) {
      try {
        const fieldsData = JSON.parse(selectedReport.fields);
        if (Array.isArray(fieldsData)) {
          const requiredFields = fieldsData
            .filter((field) => field.required)
            .map((field) => field.name);

          // Check each required field
          const missingRequiredFields = requiredFields.filter((fieldName) => {
            const value = values.dynamicFields?.[fieldName];
            return !value || value.trim() === "";
          });

          if (missingRequiredFields.length > 0) {
            // Get the labels for better error messages
            const missingFieldLabels = missingRequiredFields.map(
              (fieldName) => {
                const field = fieldsData.find((f) => f.name === fieldName);
                return field?.label || fieldName;
              }
            );

            toast.error(
              `Required fields missing: ${missingFieldLabels.join(", ")}`
            );
            return; // Stop submission if required fields are missing
          }
        }
      } catch (error) {
        console.error("Error validating required fields:", error);
      }
    }

    setLoading(true);

    try {
      // Get ALL form values, not just the dynamicFields from values
      const formValues = form.getValues();

      // Collect all field values from the form
      const allDynamicFields = { ...formValues.dynamicFields };

      // Make sure we have all selected fields
      selectedFields.forEach((field) => {
        const fieldValue = form.getValues(`dynamicFields.${field}`);
        if (fieldValue !== undefined) {
          allDynamicFields[field] = fieldValue;
        }
      });

      const payload = {
        latitude,
        longitude,
        reportTypeId: Number(values.reportTypeId),
        userId: userId || null,
        description: JSON.stringify(allDynamicFields),
        isPermanent: values.isPermanent,
        itemStatus: values.itemStatus,
      };

      if (existingReport) {
        // Update existing report
        const updatedReport = await updateReport(
          existingReport.id,
          {
            ...values,
            reportTypeId: Number(values.reportTypeId),
            dynamicFields: allDynamicFields,
            isPermanent: values.isPermanent,
            itemStatus: values.itemStatus,
          },
          session
        );

        toast.success("Report updated successfully!");

        if (setSelectedReport) {
          setSelectedReport(updatedReport);
        }
      } else {
        // Create new report
        const response = await postReport(payload);

        if (!response || !response.success) {
          throw new Error(response?.error || "Failed to submit report");
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
        className="space-y-4 p-2 sm:p-4 max-w-[320px] sm:max-w-[350px] overflow-y-auto max-h-[75vh]"
      >
        <h3 className="font-medium text-lg">
          {existingReport ? "Edit Report" : "New Report"}
        </h3>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="details" className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>Status</span>
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 pt-2">
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
                    value={field.value || ""}
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
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
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
                        {getFieldLabel(field)}
                      </DropdownMenuItem>
                    ))}

                  {/* Show message if all fields are selected */}
                  {availableFields.filter(
                    (field) => !selectedFields.includes(field)
                  ).length === 0 && (
                    <DropdownMenuItem
                      disabled
                      className="text-muted-foreground"
                    >
                      All fields added
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Show selected fields */}
            {selectedFields.length > 0 ? (
              <div className="space-y-3 pt-2">
                {selectedFields.map((field, index) => (
                  <FormField
                    key={`${field}-${index}`}
                    control={form.control}
                    name={`dynamicFields.${field}`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-sm flex items-center gap-1">
                          {getFieldLabel(field)}
                          {isFieldRequired(field) && (
                            <span className="text-primary text-xs">*</span>
                          )}
                        </FormLabel>
                        <div className="flex gap-2 items-center">
                          <FormControl>
                            {renderFieldInput(field, formField)}
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeField(field)}
                            disabled={loading || isFieldRequired(field)}
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
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value="status" className="space-y-4 pt-2">
            {/* Permanence Toggle */}
            <FormField
              control={form.control}
              name="isPermanent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Permanent Feature</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      This is a fixed location that will not move or change
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Item Status Selection */}
            <FormField
              control={form.control}
              name="itemStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PRESENT">Present / Active</SelectItem>
                      <SelectItem value="DEPARTED">
                        Departed / Resolved
                      </SelectItem>
                      <SelectItem value="UNKNOWN">
                        Unknown / Uncertain
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {field.value === "PRESENT" &&
                      "The reported item or situation is currently present"}
                    {field.value === "DEPARTED" &&
                      "The reported item or situation is no longer present"}
                    {field.value === "UNKNOWN" &&
                      "Unable to determine if the item or situation is present"}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* If this is an existing report, show current report status */}
            {existingReport && existingReport.reportStatus && (
              <div className="rounded-lg border p-3 shadow-sm">
                <h4 className="text-sm font-medium">Report Status</h4>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm">
                    {existingReport.reportStatus === "ACTIVE" &&
                      "Awaiting confirmation"}
                    {existingReport.reportStatus === "CONFIRMED" &&
                      "Confirmed accurate"}
                    {existingReport.reportStatus === "DISPUTED" &&
                      "Accuracy disputed"}
                    {existingReport.reportStatus === "RESOLVED" &&
                      "Issue resolved"}
                    {existingReport.reportStatus === "INCORRECT" &&
                      "Marked incorrect"}
                  </p>
                  <Badge
                    className={
                      existingReport.reportStatus === "CONFIRMED"
                        ? "bg-green-500"
                        : existingReport.reportStatus === "DISPUTED"
                        ? "bg-amber-500"
                        : existingReport.reportStatus === "RESOLVED"
                        ? "bg-blue-500"
                        : existingReport.reportStatus === "INCORRECT"
                        ? "bg-red-500"
                        : "bg-slate-500"
                    }
                  >
                    {existingReport.reportStatus}
                  </Badge>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

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
