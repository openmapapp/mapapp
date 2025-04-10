"use client";

import { useData } from "@/context/DataProvider";
import TimeRangeSlider from "./TimeRangeSlider";

export default function TimeRangeTab() {
  const { reports, filteredReports, timeRange, filters } = useData();

  return (
    <div className="space-y-4">
      <div className="bg-secondary/50 rounded-lg p-3 border border-border">
        <TimeRangeSlider />
      </div>

      <div className="text-xs text-muted-foreground">
        Showing {filters.isFiltering ? filteredReports.length : reports.length}{" "}
        reports
        {filters.isFiltering
          ? " (filtered)"
          : ` from the last ${timeRange} hours`}
        .
      </div>
    </div>
  );
}
