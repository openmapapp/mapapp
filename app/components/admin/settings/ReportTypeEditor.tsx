"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  GripVertical,
  Trash2,
  MapPinned,
  Upload,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { uploadReportIcon } from "@/actions/admin/uploadReportIcon";
import { toast } from "sonner";
import Image from "next/image";
import {
  getReportFields,
  createReportField,
} from "@/actions/admin/reportFields";
import ReportFieldEditor from "./ReportFieldEditor";

// Field type for structured field definitions
interface Field {
  id: string;
  name: string;
  label: string;
  type: string;
  options?: string[];
  required: boolean;
  filterable: boolean;
  order: number;
}

interface ReportTypeEditorProps {
  reportType: {
    id: number;
    name: string;
    description?: string;
    fields: string; // JSON string of field configurations
    iconUrl?: string;
  };
  onSave: (reportType: any) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  onFieldCreated?: () => void;
}

export default function ReportTypeEditor({
  reportType,
  onSave,
  isSubmitting,
  onCancel,
  onFieldCreated,
}: ReportTypeEditorProps) {
  // Parse fields from JSON string
  const [fields, setFields] = useState<Field[]>(() => {
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
          filterable: false,
          order: index,
        }));
      }
      return [];
    } catch (e) {
      console.error("Error parsing fields:", e);
      return [];
    }
  });

  const [availableFields, setAvailableFields] = useState<any[]>([]);
  const [name, setName] = useState(reportType.name || "");
  const [description, setDescription] = useState(reportType.description || "");
  const [iconUrl, setIconUrl] = useState(reportType.iconUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldEditorOpen, setFieldEditorOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load available fields when component mounts
  const fetchFields = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getReportFields();
      if (response.success) {
        setAvailableFields(response.data);
      } else {
        toast.error("Failed to load available fields");
      }
    } catch (error) {
      console.error("Error loading fields:", error);
      toast.error("An error occurred while loading fields");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

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
    const newField: Field = {
      id: uuidv4(),
      name: "",
      label: "",
      type: "text",
      required: false,
      filterable: false,
      order: fields.length,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  // Function to handle field selection from dropdown
  const handleSelectField = (selectedField) => {
    // Create a new field based on the selected field
    const newField: Field = {
      id: uuidv4(),
      name: selectedField.name,
      label: selectedField.label,
      type: selectedField.type || "text",
      options: selectedField.options || [],
      required: false,
      filterable: selectedField.filterable || false,
      order: fields.length,
    };

    setFields([...fields, newField]);
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
      toast.error("Report type name is required");
      return;
    }

    // Validate field names
    for (const field of fields) {
      if (!field.name.trim()) {
        toast.error("All fields must have a name");
        return;
      }

      // Convert field names to snake_case if they're not already
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

      {/* Fields section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Fields</Label>
          <div className="flex gap-2">
            <Button
              onClick={() => setFieldEditorOpen(true)}
              size="sm"
              variant="outline"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Field
            </Button>

            {/* Dropdown to select from existing fields */}
            <Select
              onValueChange={(value) => {
                const field = availableFields.find((f) => f.name === value);
                if (field) handleSelectField(field);
              }}
              disabled={
                isSubmitting || isLoading || availableFields.length === 0
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Add existing field" />
              </SelectTrigger>
              <SelectContent>
                {availableFields.map((field) => (
                  <SelectItem key={field.name} value={field.name}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Draggable fields list */}
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
                              <div>
                                <Label className="font-medium">
                                  {field.label || "Unnamed Field"}
                                </Label>
                                {field.filterable && (
                                  <Badge variant="outline" className="ml-2">
                                    Filterable
                                  </Badge>
                                )}
                                <p className="text-sm text-muted-foreground mt-1">
                                  {field.type === "select"
                                    ? `Select field with options: ${
                                        field.options?.join(", ") || "none"
                                      }`
                                    : `${field.type} field`}
                                </p>
                              </div>

                              <div className="flex items-center justify-end space-x-4">
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

                                {field.filterable && (
                                  <Badge variant="secondary">Filterable</Badge>
                                )}
                              </div>
                            </div>
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
              <p className="text-sm text-muted-foreground mt-2">
                Add fields to define what information users can submit for this
                report type
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submit and Cancel buttons */}
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

      {/* Field editor dialog */}
      <Dialog open={fieldEditorOpen} onOpenChange={setFieldEditorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Field</DialogTitle>
          </DialogHeader>
          <ReportFieldEditor
            field={{}}
            onSave={async (fieldData) => {
              setIsLoading(true);
              try {
                // Create the field with the new createReportField function
                const result = await createReportField({
                  name: fieldData.name,
                  label: fieldData.label,
                  type: fieldData.type || "text",
                  options: fieldData.options || [],
                  required: fieldData.required || false,
                  filterable: fieldData.filterable !== false,
                  reportTypeIds: [reportType.id], // Associate with current report type
                });

                if (result.success) {
                  // Refresh available fields
                  await fetchFields();

                  // Create a new field in this report type
                  const newField: Field = {
                    id: uuidv4(),
                    name: fieldData.name,
                    label: fieldData.label,
                    type: fieldData.type || "text",
                    options: fieldData.options || [],
                    required: fieldData.required || false,
                    filterable: fieldData.filterable !== false,
                    order: fields.length,
                  };

                  setFields([...fields, newField]);

                  toast.success("Field created successfully");
                  setFieldEditorOpen(false);

                  // Notify parent if needed
                  if (onFieldCreated) {
                    onFieldCreated();
                  }
                } else {
                  toast.error(result.message || "Failed to create field");
                }
              } catch (error) {
                console.error("Error creating field:", error);
                toast.error("An error occurred while creating the field");
              } finally {
                setIsLoading(false);
              }
            }}
            isSubmitting={isLoading}
            onCancel={() => setFieldEditorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
