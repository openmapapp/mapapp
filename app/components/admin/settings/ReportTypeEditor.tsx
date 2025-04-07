// app/components/admin/settings/ReportTypeEditor.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, GripVertical, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Field type for structured field definitions
interface ReportField {
  id: string;
  name: string;
  label: string;
  type: "text" | "number" | "select";
  options?: string[];
  required: boolean;
  order: number;
}

interface ReportType {
  id: number;
  name: string;
  description?: string;
  fields: string; // JSON string
}

interface ReportTypeEditorProps {
  reportType: ReportType;
  onSave: (reportType: ReportType) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function ReportTypeEditor({
  reportType,
  onSave,
  isSubmitting,
  onCancel,
}: ReportTypeEditorProps) {
  // Parse fields from JSON string
  const [fields, setFields] = useState<ReportField[]>(() => {
    try {
      const parsed = JSON.parse(reportType.fields || "[]");
      if (Array.isArray(parsed)) return parsed;

      // Handle case where fields is an object instead of array
      if (typeof parsed === "object") {
        return Object.keys(parsed).map((key, index) => ({
          id: uuidv4(),
          name: key,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
          type: "text",
          required: false,
          order: index,
        }));
      }
      return [];
    } catch (e) {
      console.error("Error parsing fields:", e);
      return [];
    }
  });

  const [name, setName] = useState(reportType.name || "");
  const [description, setDescription] = useState(reportType.description || "");

  const addField = () => {
    const newField: ReportField = {
      id: uuidv4(),
      name: "",
      label: "",
      type: "text",
      required: false,
      order: fields.length,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<ReportField>) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const handleSubmit = async () => {
    // Validate
    if (!name.trim()) {
      alert("Report type name is required");
      return;
    }

    // Validate field names
    for (const field of fields) {
      if (!field.name.trim()) {
        alert("All fields must have a name");
        return;
      }

      // Convert field names to snake_case
      field.name = field.name
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

      // Generate label from name if empty
      if (!field.label.trim()) {
        field.label = field.name
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
    }

    // Sort fields by order
    const sortedFields = [...fields].sort((a, b) => a.order - b.order);

    const updatedReportType = {
      ...reportType,
      name,
      description,
      fields: JSON.stringify(sortedFields),
    };

    await onSave(updatedReportType);
  };

  // Handle drag functionality (simplified without react-beautiful-dnd)
  const moveField = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= fields.length) return;

    const updatedFields = [...fields];
    const [movedItem] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedItem);

    // Update order property
    const reorderedFields = updatedFields.map((item, index) => ({
      ...item,
      order: index,
    }));

    setFields(reorderedFields);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Report Type Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter report type name"
            disabled={isSubmitting}
          />
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
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Fields</Label>
          <Button
            onClick={addField}
            size="sm"
            variant="outline"
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="relative">
              <div className="absolute left-2 top-4 cursor-move flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-50 hover:opacity-100"
                  onClick={() => moveField(index, index - 1)}
                  disabled={index === 0 || isSubmitting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-50 hover:opacity-100"
                  onClick={() => moveField(index, index + 1)}
                  disabled={index === fields.length - 1 || isSubmitting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>
              </div>

              <CardContent className="p-4 pl-10">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Field {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => removeField(field.id)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`field-name-${field.id}`}>Field Name</Label>
                    <Input
                      id={`field-name-${field.id}`}
                      value={field.name}
                      onChange={(e) =>
                        updateField(field.id, { name: e.target.value })
                      }
                      placeholder="e.g. item_count"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">
                      Technical name (no spaces, use snake_case)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`field-label-${field.id}`}>
                      Display Label
                    </Label>
                    <Input
                      id={`field-label-${field.id}`}
                      value={field.label}
                      onChange={(e) =>
                        updateField(field.id, { label: e.target.value })
                      }
                      placeholder="e.g. Item Count"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">
                      Shown to users
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor={`field-type-${field.id}`}>Field Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value: any) =>
                        updateField(field.id, { type: value })
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id={`field-type-${field.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end pb-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) =>
                          updateField(field.id, { required: checked })
                        }
                        id={`required-${field.id}`}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor={`required-${field.id}`}>Required</Label>
                    </div>
                  </div>
                </div>

                {field.type === "select" && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`field-options-${field.id}`}>
                      Options (comma separated)
                    </Label>
                    <Input
                      id={`field-options-${field.id}`}
                      value={field.options?.join(", ") || ""}
                      onChange={(e) => {
                        const options = e.target.value
                          .split(",")
                          .map((opt) => opt.trim())
                          .filter(Boolean);
                        updateField(field.id, { options });
                      }}
                      placeholder="Option 1, Option 2, Option 3"
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-10 border rounded-md border-dashed">
              <p className="text-muted-foreground">No fields added yet</p>
              <Button
                onClick={addField}
                variant="ghost"
                className="mt-2"
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Field
              </Button>
            </div>
          )}
        </div>
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
            "Save Report Type"
          )}
        </Button>
      </div>
    </div>
  );
}
