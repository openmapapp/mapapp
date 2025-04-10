// components/map/FilterNotification.tsx
"use client";

import { AlertCircle, X, Filter, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataProvider";
import { Badge } from "@/components/ui/badge";

export default function FilterNotification() {
  const { filteredReports, filters, resetFilters } = useData();

  if (!filters.isFiltering) return null;

  // Count active filters by type
  const typeFiltersCount = filters.selectedReportTypes.length;
  const fieldFiltersCount = Object.values(filters.selectedFields).flat().length;
  const globalFieldFiltersCount = Object.values(
    filters.globalFieldFilters
  ).flat().length;

  // Get icon and label based on most significant filter type
  let icon = <AlertCircle size={16} />;
  let label = "";

  if (filters.useHistoricalMode) {
    label = "Historical";
  } else if (globalFieldFiltersCount > 0) {
    icon = <Database size={16} />;
    label = "Fields";
  } else if (typeFiltersCount > 0) {
    icon = <Filter size={16} />;
    label = "Types";
  }

  const handleClearFilters = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Clearing filters");
    resetFilters();
  };

  return (
    <div className="filter-notification absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500/90 dark:bg-yellow-600/90 text-white px-4 py-2 rounded-full shadow-md filter-notification">
      <div className="flex items-center justify-center">
        {icon}
        <span className="text-sm font-medium ml-2">
          {filteredReports.length} filtered reports
        </span>

        {label && (
          <Badge
            variant="outline"
            className="ml-2 text-xs text-white border-white/50"
          >
            {label}
          </Badge>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="ml-2 h-6 px-2 text-white hover:bg-yellow-600/50 dark:hover:bg-yellow-700/50"
          onClick={handleClearFilters}
          type="button"
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );
}
