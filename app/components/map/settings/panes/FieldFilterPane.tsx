// components/map/settings/panes/FieldFilterPane.tsx - updated version
"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown, Database, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { getReportFields } from "@/actions/admin/reportFields";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ReportType {
  id: number;
  name: string;
  fields: string;
}

interface FilterableField {
  name: string;
  label: string;
  options: string[];
  reportTypes: number[];
  filterable: boolean;
}

interface FieldFilterPaneProps {
  reportTypes: ReportType[];
  globalFieldFilters: Record<string, string[]>;
  setGlobalFieldFilter: (fieldId: string, values: string[]) => void;
  clearGlobalFieldFilters: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FieldFilterPane({
  reportTypes,
  globalFieldFilters,
  setGlobalFieldFilter,
  clearGlobalFieldFilters,
  isOpen,
  onOpenChange,
}: FieldFilterPaneProps) {
  const [filterableFields, setFilterableFields] = useState<FilterableField[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFields, setExpandedFields] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Measure content height for smooth animation
  useEffect(() => {
    if (isOpen && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    } else {
      setContentHeight(0);
    }
  }, [isOpen, filterableFields, isLoading, searchQuery]);

  // Load filterable fields when component mounts or tab becomes active
  useEffect(() => {
    if (isOpen) {
      const fetchFilterableFields = async () => {
        setIsLoading(true);
        try {
          const response = await getReportFields();
          if (response.success) {
            // Filter to only include fields that are filterable
            const filterableFieldsOnly = response.data.filter(
              (field) => field.filterable
            );
            const fields = processFilterableFields(
              filterableFieldsOnly,
              reportTypes
            );
            setFilterableFields(fields);
          } else {
            console.error(
              "Error fetching filterable fields:",
              response.message
            );
          }
        } catch (error) {
          console.error("Error fetching filterable fields:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchFilterableFields();
    }
  }, [isOpen, reportTypes]);

  // Helper function to process filterable fields
  const processFilterableFields = (fields, reportTypes) => {
    const processedFields = fields.map((field) => {
      // Find all report types that use this field
      const typesWithField = reportTypes.filter((type) => {
        try {
          const typeFields = JSON.parse(type.fields);
          return typeFields.some((f) => f.filterable && f.name === field.name);
        } catch (e) {
          return false;
        }
      });

      // Check the field's type - if it's a select field, get all options
      // For text fields, we'll handle differently
      let fieldType = "text";
      let allOptions = new Set();

      typesWithField.forEach((type) => {
        try {
          const typeFields = JSON.parse(type.fields);
          const matchingField = typeFields.find(
            (f) => f.filterable && f.name === field.name
          );

          if (matchingField) {
            // Set field type
            fieldType = matchingField.type || "text";

            // For select fields, collect all options
            if (fieldType === "select" && matchingField.options) {
              matchingField.options.forEach((option) => allOptions.add(option));
            }
          }
        } catch (e) {}
      });

      return {
        ...field,
        type: fieldType,
        options: Array.from(allOptions),
        reportTypes: typesWithField.map((t) => t.id),
      };
    });

    return processedFields;
  };

  // Toggle field expansion
  const toggleFieldExpansion = (name) => {
    setExpandedFields((prev) =>
      prev.includes(name)
        ? prev.filter((fieldName) => fieldName !== name)
        : [...prev, name]
    );
  };

  // Filter fields by search query
  const filteredFields = searchQuery
    ? filterableFields.filter((field) =>
        field.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filterableFields;

  // Toggle the "has value" filter for text fields
  const toggleHasValueFilter = (fieldName) => {
    const currentValues = globalFieldFilters[fieldName] || [];
    const newValues = currentValues.includes("__has_value__")
      ? [] // Remove the filter
      : ["__has_value__"]; // Add the "has value" filter

    setGlobalFieldFilter(fieldName, newValues);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Header - always visible */}
      <div
        className="p-3 bg-secondary/50 flex items-center justify-between cursor-pointer"
        onClick={() => onOpenChange(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Database size={16} className="text-muted-foreground" />
          <h3 className="font-medium">Filter by Field</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {Object.values(globalFieldFilters).flat().length > 0
              ? `${Object.values(globalFieldFilters).flat().length} selected`
              : "None selected"}
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Content - animated with fixed height animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: contentHeight }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className={`border-t border-border overflow-hidden ${
              !isOpen ? "border-t-transparent" : ""
            }`}
            style={{ display: isOpen ? "block" : "none" }}
          >
            <div ref={contentRef} className="p-3 bg-background/40">
              <div className="mb-3">
                <p className="text-sm text-muted-foreground">
                  Filter across report types by common fields
                </p>
              </div>

              {/* Search input */}
              <div className="mb-3 relative">
                <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search fields..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[180px] pr-4">
                  <div className="space-y-4">
                    {filteredFields.length > 0 ? (
                      filteredFields.map((field) => (
                        <div
                          key={field.name}
                          className="border border-border/50 rounded-md overflow-hidden"
                        >
                          {/* Field header */}
                          <div
                            className="bg-muted/30 p-2 flex items-center justify-between cursor-pointer"
                            onClick={() => toggleFieldExpansion(field.name)}
                          >
                            <div className="flex items-center">
                              <span className="text-sm font-medium">
                                {field.label}
                              </span>
                              {globalFieldFilters[field.name]?.length > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  {field.type === "text"
                                    ? "Active"
                                    : globalFieldFilters[field.name].length}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2 text-xs">
                                {field.type}
                              </Badge>
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                  expandedFields.includes(field.name)
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>

                          {/* Field content */}
                          <AnimatePresence initial={false}>
                            {expandedFields.includes(field.name) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                  height: "auto",
                                  opacity: 1,
                                  transition: { duration: 0.15 },
                                }}
                                exit={{
                                  height: 0,
                                  opacity: 0,
                                  transition: { duration: 0.15 },
                                }}
                              >
                                <div className="p-2 pt-1">
                                  {field.type === "select" ? (
                                    // Select field - show options as badges
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {field.options.map((option) => {
                                        const isSelected =
                                          globalFieldFilters[
                                            field.name
                                          ]?.includes(option);

                                        return (
                                          <Badge
                                            key={option}
                                            variant={
                                              isSelected ? "default" : "outline"
                                            }
                                            className="cursor-pointer text-xs"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const currentValues =
                                                globalFieldFilters[
                                                  field.name
                                                ] || [];
                                              const newValues = isSelected
                                                ? currentValues.filter(
                                                    (v) => v !== option
                                                  )
                                                : [...currentValues, option];

                                              setGlobalFieldFilter(
                                                field.name,
                                                newValues
                                              );
                                            }}
                                          >
                                            {option}
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    // Text field - show just a toggle for "has value"
                                    <div className="mb-2">
                                      <Button
                                        variant={
                                          globalFieldFilters[
                                            field.name
                                          ]?.includes("__has_value__")
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        className="w-full text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleHasValueFilter(field.name);
                                        }}
                                      >
                                        {globalFieldFilters[
                                          field.name
                                        ]?.includes("__has_value__")
                                          ? "Show only reports with this field"
                                          : "Filter by this field"}
                                      </Button>
                                    </div>
                                  )}

                                  <div className="text-xs text-muted-foreground mt-2 flex justify-between items-center">
                                    <span>
                                      Used in {field.reportTypes.length} report
                                      type(s)
                                    </span>

                                    {globalFieldFilters[field.name]?.length >
                                      0 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setGlobalFieldFilter(field.name, []);
                                        }}
                                      >
                                        <FilterX size={12} className="mr-1" />
                                        Clear
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        {searchQuery
                          ? "No fields match your search"
                          : "No filterable fields have been defined across report types."}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
