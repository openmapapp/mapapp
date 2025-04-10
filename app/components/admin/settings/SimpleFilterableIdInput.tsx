// Alternative approach - create a simplified version
// components/admin/settings/SimpleFilterableIdInput.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getFilterableFields,
  createFilterableField,
} from "@/actions/admin/reportFields";
import { toast } from "sonner";

// Helper function
const formatFilterableId = (id: string) => {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
};

interface SimpleFilterableIdInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  suggestedFromName?: string;
}

export default function SimpleFilterableIdInput({
  value,
  onChange,
  disabled = false,
  suggestedFromName = "",
}: SimpleFilterableIdInputProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When a name is suggested, format it as a filterable ID
  useEffect(() => {
    if (suggestedFromName && !value) {
      const formattedId = formatFilterableId(suggestedFromName);
      setInputValue(formattedId);
    } else if (value) {
      setInputValue(value);
    }
  }, [suggestedFromName, value]);

  // Update the value whenever input changes
  useEffect(() => {
    const formattedId = formatFilterableId(inputValue);
    if (formattedId !== value) {
      onChange(formattedId);
    }
  }, [inputValue, onChange, value]);

  // Handle creating a new field
  const handleCreateField = async () => {
    if (!inputValue.trim()) {
      toast.error("Field ID cannot be empty");
      return;
    }

    const formattedId = formatFilterableId(inputValue);
    setIsSubmitting(true);

    try {
      const result = await createFilterableField({
        fieldId: formattedId,
        label: suggestedFromName || formattedId,
        description: `Created for field ${suggestedFromName || "unknown"}`,
      });

      if (result.success) {
        toast.success(`Created field identifier: ${formattedId}`);
        onChange(formattedId);
      } else {
        // If already exists, just use it
        if (result.message && result.message.includes("already exists")) {
          onChange(formattedId);
          toast.info(`Using existing field identifier: ${formattedId}`);
        } else {
          toast.error(result.message || "Failed to create field identifier");
        }
      }
    } catch (error) {
      console.error("Error creating field:", error);
      toast.error("Failed to create field identifier");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter identifier..."
          disabled={disabled || isSubmitting}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleCreateField}
          disabled={disabled || isSubmitting || !inputValue.trim()}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Will be saved as: {formatFilterableId(inputValue || "")}
      </p>
    </div>
  );
}
