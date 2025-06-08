// app/components/admin/settings/ReportTypeEditor.tsx
"use client";

import { useEffect, useState, useRef } from "react";
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
import {
  Loader2,
  Plus,
  GripVertical,
  Trash2,
  MapPinned,
  Upload,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { uploadReportIcon } from "@/actions/admin/uploadReportIcon";
import { toast } from "sonner";
import Image from "next/image";
import FieldTypeSelect from "./FieldTypeSelect";

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
  iconUrl?: string;
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

  const [iconUrl, setIconUrl] = useState(reportType.iconUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(reportType.fields || "[]");
      const normalizedFields = Array.isArray(parsed)
        ? parsed.map((field) => ({
            ...field,
            // Ensure type is always one of the valid options
            type: ["text", "number", "select"].includes(field.type)
              ? field.type
              : "text",
            id: field.id || uuidv4(),
            name: field.name || "",
            label: field.label || "",
            required: Boolean(field.required),
            order: typeof field.order === "number" ? field.order : 0,
          }))
        : [];

      setFields(normalizedFields);
    } catch (e) {
      console.log("Error parsing fields:", e);
      setFields([]);
    }
  }, [reportType.fields]);

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("icon", file);

      const result = await uploadReportIcon(reportType.id, formData);

      if (result.success) {
        setIconUrl(result.iconUrl);
        toast.success("Icon uploaded successfully");
      } else {
        toast.error(result.message || "Failed to upload icon");
      }
    } catch (error) {
      console.error("Error uploading icon:", error);
      toast.error("An error occurred while uploading the icon");
    } finally {
      setIsUploading(false);
    }
  };

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

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const reorderedFields = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setFields(reorderedFields);
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
      iconUrl,
    };

    await onSave(updatedReportType);
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

        <div className="space-y-4 mb-6">
          <Label>Report Type Icon</Label>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 border rounded-md flex items-center justify-center bg-muted/50">
              {iconUrl ? (
                <Image
                  src={iconUrl}
                  alt="Report type icon"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              ) : (
                <MapPinned className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png"
                className="hidden"
                onChange={handleIconUpload}
                disabled={isUploading || isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isSubmitting}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Icon
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                PNG only. Max dimensions: 80×80px. Max size: 50KB.
              </p>
            </div>
          </div>
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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="fields-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {fields.map((field, index) => (
                    <Draggable
                      key={field.id}
                      draggableId={field.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                          className={`relative draggable ${
                            snapshot.isDragging
                              ? "border-primary ring-2 ring-primary/30"
                              : ""
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="absolute left-2 top-4 cursor-grab h-10 flex items-center justify-center"
                          >
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>

                          <CardContent className="p-4 pl-10">
                            {/* Rest of your card content stays the same */}
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
                                <Label htmlFor={`field-name-${field.id}`}>
                                  Field Name
                                </Label>
                                <Input
                                  id={`field-name-${field.id}`}
                                  value={field.name}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      name: e.target.value,
                                    })
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
                                    updateField(field.id, {
                                      label: e.target.value,
                                    })
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
                                <FieldTypeSelect
                                  fieldId={field.id}
                                  value={field.type}
                                  onChange={(value) => {
                                    updateField(field.id, { type: value });
                                  }}
                                  disabled={isSubmitting}
                                />
                              </div>

                              <div className="flex items-end pb-2">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={field.required}
                                    onCheckedChange={(checked) =>
                                      updateField(field.id, {
                                        required: checked,
                                      })
                                    }
                                    id={`required-${field.id}`}
                                    disabled={isSubmitting}
                                  />
                                  <Label htmlFor={`required-${field.id}`}>
                                    Required
                                  </Label>
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

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
