"use client";

import { Clock } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import TimeRangeSlider from "../TimeRangeSlider";

interface TimeRangePaneProps {
  timeRange: number;
  reportCount: number;
  isFiltering: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TimeRangePane({
  timeRange,
  reportCount,
  isFiltering,
  isOpen,
  onOpenChange,
}: TimeRangePaneProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="mb-3">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-secondary/50 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-muted-foreground" />
          <h3 className="font-medium">Recent Events</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          {isFiltering ? `${reportCount} filtered` : `Last ${timeRange} hours`}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-3 pb-1 px-3 mt-2 bg-secondary/30 rounded-lg border border-border">
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">
            Adjust the time range for recent reports
          </p>
        </div>

        <TimeRangeSlider />

        <div className="text-xs text-muted-foreground mt-3">
          Showing {reportCount} reports
          {isFiltering ? " (filtered)" : ` from the last ${timeRange} hours`}.
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
