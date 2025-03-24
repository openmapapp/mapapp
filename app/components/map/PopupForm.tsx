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
import { Plus, Minus } from "lucide-react";

interface PopupFormProps {
  latitude: number;
  longitude: number;
  existingReport?: any;
  setEditing: (editing: boolean) => void;
  onClose: () => void;
}

const FormSchema = z.object({
  reportTypeId: z.string().min(1, "Please select a report type"),
  dynamicFields: z.record(z.string()).optional(),
});

const PopupForm = ({
  latitude,
  longitude,
  existingReport,
  setSelectedReport,
  setEditing,
  onClose,
}: PopupFormProps) => {
  const { reportTypes, globalSettings } = useData();
  const { data: session } = useSession();

  const userId = session?.user?.id || "";
  const trustScore = session?.user?.trust || 1;
  const [loading, setLoading] = useState(false);

  const reportData = existingReport || { reportTypeId: "", description: "{}" };

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

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reportTypeId: reportData ? String(reportData.reportTypeId) : "",
      dynamicFields: reportData?.description
        ? JSON.parse(reportData.description)
        : {},
    },
  });

  console.log("existingReport", existingReport);

  const selectedReport = reportTypes.find(
    (type) => String(type.id) === selectedReportType
  );
  const availableFields = selectedReport?.fields || [];

  useEffect(() => {
    if (existingReport) {
      form.setValue("reportTypeId", String(existingReport.reportTypeId));
      form.setValue(
        "dynamicFields",
        existingReport.description ? JSON.parse(existingReport.description) : {}
      );
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

  const handleSubmit = async (values: any) => {
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
        const updatedReport = await updateReport(
          existingReport.id,
          { ...values, reportTypeId: Number(values.reportTypeId) },
          session
        );
        toast.success("Report updated successfully!");
        setSelectedReport(updatedReport);
      } else {
        const response = await postReport(payload);

        if (!response) {
          throw new Error("Failed to submit report");
        }
        toast.success("Report submitted successfully!");
      }

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

  if (!selectedReportType && reportTypes.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-4 z-30"
      >
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
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a report type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {reportTypes.map((type) => (
                    <SelectItem
                      className="hover:bg-gray-100"
                      key={type.id}
                      value={String(type.id)}
                    >
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dynamic Fields Selection */}
        {availableFields.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              {availableFields
                .filter((field) => !selectedFields.includes(field)) // Filter out already selected fields
                .map((field) => (
                  <DropdownMenuItem
                    key={field}
                    onClick={() => addField(field)}
                    className="hover:bg-gray-100"
                  >
                    {field}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Render Selected Fields */}
        {selectedFields.map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={`dynamicFields.${field}`}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field}</FormLabel>
                <div className="flex gap-2 items-center">
                  <FormControl>
                    <Input {...formField} placeholder={`Enter ${field}...`} />
                  </FormControl>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(field)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Submit & Cancel Buttons */}
        <div className="flex justify-between mt-4">
          <Button type="submit" disabled={loading} className="w-1/2">
            {loading ? (
              <span className="flex items-center">Submitting...</span>
            ) : (
              "Submit"
            )}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            disabled={loading}
            variant="outline"
            className="w-1/2 ml-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PopupForm;
