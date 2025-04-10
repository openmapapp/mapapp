"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FieldTypeSelect from "./FieldTypeSelect";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { getReportTypesForFieldAssociation } from "@/actions/admin/reportFields";
import { ReportFieldEditorProps, ReportType } from "@/types";

// Format to snake_case
const formatFieldId = (id) => {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
};

export default function ReportFieldEditor({
  field = {},
  onSave,
  isSubmitting,
  onCancel,
}: ReportFieldEditorProps) {
  const [fieldName, setFieldName] = useState(field.name || "");
  const [label, setLabel] = useState(field.label || "");
  const [description, setDescription] = useState(field.description || "");
  const [fieldType, setFieldType] = useState<"text" | "number" | "select">(
    field.type || "text"
  );
  const [options, setOptions] = useState<string[]>(field.options || []);
  const [filterable, setFilterable] = useState(field.filterable !== false);
  const [required, setRequired] = useState(field.required || false);

  // Report type association state
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [selectedReportTypeIds, setSelectedReportTypeIds] = useState<number[]>(
    field.reportTypeIds || []
  );

  // Loading state for report types
  const [loadingReportTypes, setLoadingReportTypes] = useState(false);

  // Load report types on component mount
  useEffect(() => {
    const fetchReportTypes = async () => {
      setLoadingReportTypes(true);
      try {
        const response = await getReportTypesForFieldAssociation();
        if (response.success) {
          setReportTypes(response.data);

          // If we have report types from the field (when editing), set them
          if (field.reportTypes && Array.isArray(field.reportTypes)) {
            const reportTypeIds = field.reportTypes.map((rt) => rt.id);
            setSelectedReportTypeIds(reportTypeIds);
          }
        } else {
          toast.error("Failed to load report types");
        }
      } catch (error) {
        console.error("Error loading report types:", error);
        toast.error("An error occurred while loading report types");
      } finally {
        setLoadingReportTypes(false);
      }
    };

    fetchReportTypes();
  }, [field]);

  const handleSubmit = async () => {
    // Validate inputs
    if (!label.trim()) {
      toast.error("Field label is required");
      return;
    }

    if (selectedReportTypeIds.length === 0) {
      toast.error("At least one report type must be selected");
      return;
    }

    // Format field name
    const formattedName = formatFieldId(fieldName || label);

    const fieldData = {
      name: formattedName,
      label,
      type: fieldType,
      reportTypeIds: selectedReportTypeIds,
      options: fieldType === "select" ? options : [],
      required,
      filterable,
    };

    await onSave(fieldData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Field Label</Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter field label"
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          Human-readable label for the field
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fieldName">Field Name</Label>
        <Input
          id="fieldName"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          placeholder="Will be generated from label if empty"
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          Technical identifier (snake_case):{" "}
          {formatFieldId(fieldName || label || "")}
        </p>
      </div>

      <div className="space-y-2">
        <FieldTypeSelect
          fieldId="fieldType"
          value={fieldType}
          onChange={(value) => {
            setFieldType(value);
          }}
          disabled={isSubmitting}
        />
      </div>

      {fieldType === "select" && (
        <div className="space-y-2">
          <Label htmlFor="options">Options (comma separated)</Label>
          <Input
            id="options"
            value={options?.join(", ") || ""}
            onChange={(e) => {
              const newOptions = e.target.value
                .split(",")
                .map((opt) => opt.trim())
                .filter(Boolean);
              setOptions(newOptions);
            }}
            placeholder="Option 1, Option 2, Option 3"
            disabled={isSubmitting}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Report Types</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
          {loadingReportTypes ? (
            <div className="flex justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          ) : (
            reportTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Switch
                  checked={selectedReportTypeIds.includes(type.id)}
                  onCheckedChange={(checked) => {
                    setSelectedReportTypeIds((prev) =>
                      checked
                        ? [...prev, type.id]
                        : prev.filter((id) => id !== type.id)
                    );
                  }}
                  id={`report-type-${type.id}`}
                  disabled={isSubmitting}
                />
                <Label htmlFor={`report-type-${type.id}`}>{type.name}</Label>
              </div>
            ))
          )}
          {!loadingReportTypes && reportTypes.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No report types available
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {selectedReportTypeIds.length > 0
            ? `Selected: ${selectedReportTypeIds.length} report type(s)`
            : "No report types selected"}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={filterable}
          onCheckedChange={setFilterable}
          id="filterable"
          disabled={isSubmitting}
        />
        <Label htmlFor="filterable">Filterable</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={required}
          onCheckedChange={setRequired}
          id="required"
          disabled={isSubmitting}
        />
        <Label htmlFor="required">Required</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="resize-none h-20"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Field"
          )}
        </Button>
      </div>
    </div>
  );
}
