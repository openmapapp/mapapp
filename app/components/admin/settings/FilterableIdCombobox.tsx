// components/admin/settings/FilterableIdCombobox.tsx - fixed version
"use client";

import { useEffect, useState, useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  getFilterableFields,
  createFilterableField,
} from "@/actions/admin/reportFields";
import { toast } from "sonner";

// Helper functions
const formatFilterableId = (id: string) => {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_") // Replace non-alphanumeric with underscore
    .replace(/^_+|_+$/g, "") // Remove leading/trailing underscores
    .replace(/_+/g, "_"); // Replace multiple underscores with a single one
};

interface FilterableField {
  id: string;
  label: string;
  description?: string;
}

interface FilterableIdComboboxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  suggestedFromName?: string; // Field name to suggest from
}

export default function FilterableIdCombobox({
  value,
  onChange,
  disabled = false,
  suggestedFromName = "",
}: FilterableIdComboboxProps) {
  const [open, setOpen] = useState(false);
  const [filterableFields, setFilterableFields] = useState<FilterableField[]>(
    []
  );
  const [inputValue, setInputValue] = useState(value || "");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch the list of existing filterable fields
  const fetchFilterableFields = async () => {
    setLoading(true);
    try {
      const response = await getFilterableFields();
      if (response.success) {
        setFilterableFields(response.data);
      } else {
        console.error("Error fetching filterable fields:", response.message);
        toast.error("Error", {
          description: "Failed to load filterable fields.",
        });
      }
    } catch (error) {
      console.error("Error fetching filterable fields:", error);
      toast.error("Error", {
        description: "Failed to load filterable fields.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchFilterableFields();
    }
  }, [open]);

  // When a name is suggested, format it as a filterable ID
  useEffect(() => {
    if (suggestedFromName && !value) {
      const formattedId = formatFilterableId(suggestedFromName);
      setInputValue(formattedId);
    } else if (value) {
      setInputValue(value);
    }
  }, [suggestedFromName, value]);

  // Handle the creation of a new filterable ID
  const handleCreateNew = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!inputValue.trim()) {
      toast.error("Validation Error", {
        description: "Identifier cannot be empty",
      });
      return;
    }

    const formattedId = formatFilterableId(inputValue);

    // Check if this ID already exists
    if (filterableFields.some((field) => field.id === formattedId)) {
      // ID already exists, just select it
      onChange(formattedId);
      setOpen(false);
      setIsCreatingNew(false);
      return;
    }

    // Create a new filterable field
    setIsSubmitting(true);
    try {
      console.log("Creating new field:", {
        fieldId: formattedId,
        label: suggestedFromName || formattedId,
      });

      const result = await createFilterableField({
        fieldId: formattedId,
        label: suggestedFromName || formattedId,
        description: `Created for field ${suggestedFromName || "unknown"}`,
      });

      console.log("Create field result:", result);

      if (result.success) {
        toast.success("Success", {
          description: `Created new field identifier: ${formattedId}`,
        });

        // Update the value
        onChange(formattedId);

        // Close after successful creation
        setOpen(false);
        setIsCreatingNew(false);
      } else {
        toast.error("Error", {
          description: result.message || "Failed to create field identifier",
        });
      }
    } catch (error) {
      console.error("Error creating filterable field:", error);
      toast.error("Error", {
        description: "Failed to create field identifier",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
      style={{ position: "relative", zIndex: 50 }}
    >
      <Popover
        open={open}
        onOpenChange={(o) => {
          if (disabled) return;
          setOpen(o);
          // Reset creating new state when closing
          if (!o) setIsCreatingNew(false);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!disabled) setOpen(!open);
            }}
            type="button"
          >
            {value || "Select identifier..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
          onInteractOutside={(e) => {
            // Don't close when clicking inside our container
            if (containerRef.current?.contains(e.target as Node)) {
              e.preventDefault();
            }
          }}
          onOpenAutoFocus={(e) => {
            // Prevent auto-focus behavior
            e.preventDefault();
          }}
        >
          {isCreatingNew ? (
            <div className="p-4 space-y-4">
              <h4 className="text-sm font-medium">Create New Identifier</h4>
              <div className="space-y-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type identifier name..."
                  className="w-full"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter" && !isSubmitting) {
                      handleCreateNew();
                    }
                  }}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Will be saved as: {formatFilterableId(inputValue || "")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsCreatingNew(false);
                  }}
                  disabled={isSubmitting}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleCreateNew}
                  disabled={!inputValue.trim() || isSubmitting}
                  type="button"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          ) : (
            <Command>
              <CommandInput
                placeholder="Search or create new..."
                value={inputValue}
                onValueChange={setInputValue}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    inputValue.trim() &&
                    !filterableFields.some((f) => f.id === inputValue)
                  ) {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCreatingNew(true);
                  }
                }}
              />
              <CommandEmpty>
                <div className="py-3 px-4 text-sm">
                  <p>No match found. Create new identifier:</p>
                  <Button
                    className="mt-2 w-full"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setIsCreatingNew(true);
                    }}
                    type="button"
                  >
                    Create "{formatFilterableId(inputValue)}"
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup heading="Existing Fields">
                <ScrollArea className="h-[200px]">
                  {loading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Loading...
                    </div>
                  ) : filterableFields.length > 0 ? (
                    filterableFields.map((field) => (
                      <CommandItem
                        key={field.id}
                        value={field.id}
                        onSelect={() => {
                          onChange(field.id);
                          setInputValue(field.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === field.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span>{field.id}</span>
                        <span className="ml-2 text-muted-foreground text-xs">
                          ({field.label})
                        </span>
                      </CommandItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No filterable fields found
                    </div>
                  )}
                </ScrollArea>
              </CommandGroup>
              <div className="p-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsCreatingNew(true);
                  }}
                  type="button"
                >
                  Create New Identifier
                </Button>
              </div>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
