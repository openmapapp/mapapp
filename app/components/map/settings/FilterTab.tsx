"use client";

import { useState } from "react";
import { useData } from "@/context/DataProvider";
import HistoricalViewPane from "./panes/HistoricalViewPane";
import TypeFilterPane from "./panes/TypeFilterPane";
import FieldFilterPane from "./panes/FieldFilterPane";
import { MapPinOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface FilterTabProps {
  isLoading: boolean;
}

export default function FilterTab({ isLoading }: FilterTabProps) {
  const {
    reportTypes,
    reports,
    filteredReports,
    filters,
    setHistoricalMode,
    setDateRange,
    toggleReportTypeFilter,
    setFieldFilter,
    setGlobalFieldFilter,
    setShowDepartedItems,
  } = useData();

  // Track which panes are expanded
  const [expandedPanes, setExpandedPanes] = useState<string[]>([]);

  // Toggle pane expansion
  const togglePane = (paneId: string) => {
    setExpandedPanes((prev) =>
      prev.includes(paneId)
        ? prev.filter((id) => id !== paneId)
        : [...prev, paneId]
    );
  };

  // Get count of reports by type
  const getReportCountByType = (typeId: number) => {
    // When filtering is active, count from filtered reports
    if (filters.isFiltering) {
      return filteredReports.filter((r) => r.reportTypeId === typeId).length;
    }
    // When not filtering, count from all reports
    return reports.filter((r) => r.reportTypeId === typeId).length;
  };

  // Helper to clear global field filters
  const clearGlobalFieldFilters = () => {
    setGlobalFieldFilter({}, []);
  };

  return (
    <div className="space-y-3">
      {/* Historical view pane */}
      <HistoricalViewPane
        useHistoricalMode={filters.useHistoricalMode}
        setHistoricalMode={setHistoricalMode}
        dateRange={filters.dateRange}
        setDateRange={setDateRange}
        isOpen={expandedPanes.includes("historical")}
        onOpenChange={() => togglePane("historical")}
      />

      {/* Type filter pane */}
      <TypeFilterPane
        reportTypes={reportTypes}
        selectedReportTypes={filters.selectedReportTypes}
        toggleReportTypeFilter={toggleReportTypeFilter}
        setFieldFilter={setFieldFilter}
        selectedFields={filters.selectedFields}
        getReportCountByType={getReportCountByType}
        isLoading={isLoading}
        isOpen={expandedPanes.includes("types")}
        onOpenChange={() => togglePane("types")}
      />

      {/* Field filter pane */}
      <FieldFilterPane
        reportTypes={reportTypes}
        globalFieldFilters={filters.globalFieldFilters}
        setGlobalFieldFilter={setGlobalFieldFilter}
        clearGlobalFieldFilters={clearGlobalFieldFilters}
        isOpen={expandedPanes.includes("fields")}
        onOpenChange={() => togglePane("fields")}
      />
      {/* Add this new pane for departed items */}
      <div className="overflow-hidden rounded-lg border border-border bg-background/95">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPinOff size={16} className="text-muted-foreground" />
            <h3 className="font-medium">Show Departed Items</h3>
          </div>
          <Switch
            checked={filters.showDepartedItems}
            onCheckedChange={(checked) => setShowDepartedItems(checked)}
            disabled={isLoading}
          />
        </div>
        <div className="px-3 pb-3 text-xs text-muted-foreground">
          Include reports of items that are no longer present
        </div>
      </div>
    </div>
  );
}
