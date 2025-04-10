"use client";

import { useData } from "@/context/DataProvider";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function FilterStatus() {
  const { filters, reportTypes, getFilterableFields } = useData();

  if (!filters.isFiltering) return null;

  // Get names of selected report types
  const selectedTypeNames = filters.selectedReportTypes.map((id) => {
    const type = reportTypes.find((t) => t.id === id);
    return type?.name || `Type ${id}`;
  });

  // Get names of selected fields
  const fieldFilters = Object.entries(filters.selectedFields).map(
    ([field, values]) => {
      return {
        field,
        values: values.join(", "),
      };
    }
  );

  // Get names of selected global fields
  const globalFields = getFilterableFields();
  const globalFieldFilters = Object.entries(filters.globalFieldFilters)
    .filter(([_, values]) => values.length > 0)
    .map(([fieldId, values]) => {
      const field = globalFields.find((f) => f.id === fieldId);
      return {
        field: field?.label || fieldId,
        values: values.join(", "),
      };
    });

  // Date range info
  let dateInfo = null;
  if (
    filters.useHistoricalMode &&
    filters.dateRange.from &&
    filters.dateRange.to
  ) {
    dateInfo = `${format(
      new Date(filters.dateRange.from),
      "MMM d, yyyy"
    )} - ${format(new Date(filters.dateRange.to), "MMM d, yyyy")}`;
  }

  return (
    <div className="absolute left-4 bottom-10 max-w-xs bg-background/90 backdrop-blur-sm p-2 rounded-md shadow-md text-xs z-10">
      <div className="font-medium mb-1">Active Filters:</div>
      <div className="space-y-1">
        {dateInfo && (
          <div className="flex gap-1 items-center">
            <Badge variant="outline" className="h-5">
              Date
            </Badge>
            <span className="truncate">{dateInfo}</span>
          </div>
        )}

        {selectedTypeNames.length > 0 && (
          <div className="flex gap-1 items-center flex-wrap">
            <Badge variant="outline" className="h-5">
              Types
            </Badge>
            {selectedTypeNames.map((name) => (
              <Badge key={name} variant="secondary" className="h-5">
                {name}
              </Badge>
            ))}
          </div>
        )}

        {fieldFilters.length > 0 && (
          <div className="space-y-1">
            <Badge variant="outline" className="h-5">
              Local Fields
            </Badge>
            {fieldFilters.map(({ field, values }) => (
              <div key={field} className="pl-2 text-muted-foreground">
                {field}: {values}
              </div>
            ))}
          </div>
        )}

        {globalFieldFilters.length > 0 && (
          <div className="space-y-1">
            <Badge variant="outline" className="h-5">
              Global Fields
            </Badge>
            {globalFieldFilters.map(({ field, values }) => (
              <div key={field} className="pl-2 text-muted-foreground">
                {field}: {values}
              </div>
            ))}
          </div>
        )}
        {filters.showDepartedItems && (
          <div className="flex space-y-1">
            <Badge variant="outline" className="h-5">
              Show Departed Items
            </Badge>
            <div className="pl-2 text-muted-foreground">True</div>
          </div>
        )}
      </div>
    </div>
  );
}
