"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { postReport } from "@/actions/postReport";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PopupFormProps {
  latitude: number;
  longitude: number;
  onClose: () => void;
}

const baseSchema = z.object({
  reportTypeId: z.string().min(1, "Please select a report type"),
  description: z.string().optional(),
});

const PopupForm = ({ latitude, longitude, onClose }: PopupFormProps) => {
  const { reportTypes } = useData();
  const { data: session } = useSession();

  const userId = session?.user?.id || "";
  const trustScore = session?.user?.trust || 1;

  const [selectedReportType, setSelectedReportType] = useState<string | null>(
    reportTypes.length > 0 ? String(reportTypes[0].id) : null
  );
  const [loading, setLoading] = useState(false);

  const selectedReport = reportTypes.find(
    (type) => type.id === selectedReportType
  );

  const selectedReport = reportTypes.find(
    (type) => String(type.id) === selectedReportType
  );

  const dynamicSchema = baseSchema.extend(
    selectedReport?.fields?.reduce(
      (schema, field) => ({
        ...schema,
        [field]: z.string().optional(),
      }),
      {}
    ) ?? {}
  );

  const form = useForm({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      reportTypeId: selectedReportType || "",
      description: "",
      ...(selectedReport?.fields?.reduce(
        (acc, field) => ({
          ...acc,
          [field]: "",
        }),
        {}
      ) ?? {}),
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      const payload = {
        latitude,
        longitude,
        reportTypeId: Number(values.reportTypeId),
        trustScore,
        userId,
        description: values.description || "",
        extraFields: JSON.stringify(
          selectedReport?.fields?.reduce(
            (acc, field) => ({ ...acc, [field]: values[field] || "" }),
            {}
          ) ?? {}
        ),
      };

      const response = await postReport(payload);

      if (!response) {
        throw new Error("Failed to submit report");
      }

      toast.success("Report submitted successfully!");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
      console.error("Failed to submit report:", error);
    } finally {
      setLoading(false);
    }
  };

  const roundedLatitude = Number(latitude).toFixed(4);
  const roundedLongitude = Number(longitude).toFixed(4);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-4"
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
                  field.onChange(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
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

        {/* Dynamic Fields Based on Report Type */}
        {selectedReport?.fields?.map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field}</FormLabel>
                <FormControl>
                  <Input {...formField} placeholder={`Enter ${field}...`} />
                </FormControl>
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
              "Submit Report"
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
