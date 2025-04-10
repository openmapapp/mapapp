"use client";

import { Download, FileText } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExportPaneProps {
  exportData: (format: "csv" | "json") => void;
  reportCount: number;
  isFiltering: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExportPane({
  exportData,
  reportCount,
  isFiltering,
  isOpen,
  onOpenChange,
}: ExportPaneProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="mb-3">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-secondary/50 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <Download size={16} className="text-muted-foreground" />
          <h3 className="font-medium">Export Data</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          {reportCount} reports available
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-3 pb-1 px-3 mt-2 bg-secondary/30 rounded-lg border border-border">
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">
            Download map data in your preferred format
          </p>
        </div>

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

        {isFiltering && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              Exporting {reportCount} filtered reports
            </Badge>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
