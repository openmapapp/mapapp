"use client";

import { useState } from "react";
import { ChevronDown, Sliders } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface TypeFilterPaneProps {
  reportTypes: any[];
  selectedReportTypes: number[];
  toggleReportTypeFilter: (typeId: number) => void;
  setFieldFilter: (fieldName: string, values: string[]) => void;
  selectedFields: Record<string, string[]>;
  getReportCountByType: (typeId: number) => number;
  isLoading: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TypeFilterPane({
  reportTypes,
  selectedReportTypes,
  toggleReportTypeFilter,
  setFieldFilter,
  selectedFields,
  getReportCountByType,
  isLoading,
  isOpen,
  onOpenChange,
}: TypeFilterPaneProps) {
  const [expandedTypes, setExpandedTypes] = useState<number[]>([]);

  // Helper to parse report type fields
  const parseReportTypeFields = (reportType: any) => {
    if (!reportType || !reportType.fields) return [];

    try {
      const fields =
        typeof reportType.fields === "string"
          ? JSON.parse(reportType.fields)
          : reportType.fields;

      if (Array.isArray(fields)) {
        return fields.filter((f) => f.type === "select");
      }
      return [];
    } catch (e) {
      console.error(`Error parsing fields for ${reportType.name}:`, e);
      return [];
    }
  };

  // Toggle report type expansion
  const toggleTypeExpansion = (id: number) => {
    setExpandedTypes((prev) =>
      prev.includes(id) ? prev.filter((typeId) => typeId !== id) : [...prev, id]
    );
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Header - always visible */}
      <div
        className="p-3 bg-secondary/50 flex items-center justify-between cursor-pointer"
        onClick={() => onOpenChange(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-muted-foreground" />
          <h3 className="font-medium">Filter by Type</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {selectedReportTypes.length > 0
              ? `${selectedReportTypes.length} selected`
              : "None selected"}
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Content - animated */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.2 },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.2 },
            }}
            className="border-t border-border"
          >
            <div className="p-3 bg-background/40">
              <div className="mb-3">
                <p className="text-sm text-muted-foreground">
                  Select report types to filter by
                </p>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[180px] pr-4">
                  <div className="space-y-3">
                    {reportTypes.map((type) => (
                      <div
                        key={type.id}
                        className="border border-border/50 rounded-md overflow-hidden"
                      >
                        {/* Type header */}
                        <div className="flex items-center gap-2 bg-muted/30 p-2 pr-3">
                          <Checkbox
                            id={`filter-type-${type.id}`}
                            checked={selectedReportTypes.includes(type.id)}
                            onCheckedChange={() =>
                              toggleReportTypeFilter(type.id)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div
                            className="flex-1 flex items-center justify-between cursor-pointer"
                            onClick={() => toggleTypeExpansion(type.id)}
                          >
                            <Label
                              htmlFor={`filter-type-${type.id}`}
                              className="text-sm cursor-pointer flex-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {type.name}
                            </Label>
                            <Badge variant="outline" className="text-xs">
                              {getReportCountByType(type.id)}
                            </Badge>
                          </div>
                        </div>

                        {/* Type content */}
                        <AnimatePresence initial={false}>
                          {expandedTypes.includes(type.id) && (
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
                                <div className="text-xs text-muted-foreground">
                                  {/* Field filters section */}
                                  {selectedReportTypes.includes(type.id) && (
                                    <div className="mt-2 space-y-3">
                                      <h4 className="text-sm font-medium">
                                        Field Filters
                                      </h4>

                                      {parseReportTypeFields(type).map(
                                        (field) => (
                                          <div
                                            key={field.name}
                                            className="mt-2 pl-2 border-l-2 border-muted"
                                          >
                                            <p className="text-xs mb-1">
                                              {field.label || field.name}:
                                            </p>

                                            <div className="flex flex-wrap gap-1">
                                              {field.options?.map(
                                                (option: string) => {
                                                  const isSelected =
                                                    selectedFields[
                                                      field.name
                                                    ]?.includes(option);

                                                  return (
                                                    <Badge
                                                      key={option}
                                                      variant={
                                                        isSelected
                                                          ? "default"
                                                          : "outline"
                                                      }
                                                      className="cursor-pointer text-xs"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        const currentValues =
                                                          selectedFields[
                                                            field.name
                                                          ] || [];
                                                        const newValues =
                                                          isSelected
                                                            ? currentValues.filter(
                                                                (v) =>
                                                                  v !== option
                                                              )
                                                            : [
                                                                ...currentValues,
                                                                option,
                                                              ];

                                                        setFieldFilter(
                                                          field.name,
                                                          newValues
                                                        );
                                                      }}
                                                    >
                                                      {option}
                                                    </Badge>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>
                                        )
                                      )}

                                      {parseReportTypeFields(type).length ===
                                        0 && (
                                        <p className="text-xs italic text-muted-foreground">
                                          No filterable fields for this report
                                          type
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
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
