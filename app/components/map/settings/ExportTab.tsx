"use client";

import { useData } from "@/context/DataProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export default function ExportTab() {
  const { filteredReports, filters, exportData } = useData();

  return (
    <div className="space-y-4">
      <div className="bg-secondary/50 rounded-lg p-3 border border-border">
        <h3 className="font-medium mb-2 flex items-center gap-1">
          <FileText size={16} className="text-muted-foreground" />
          Export Data
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Download map data in your preferred format
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData("csv")}
            className="w-full"
          >
            <FileText size={14} className="mr-1" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData("json")}
            className="w-full"
          >
            <FileText size={14} className="mr-1" />
            JSON
          </Button>
        </div>

        {filters.isFiltering && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              Exporting {filteredReports.length} filtered reports
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
