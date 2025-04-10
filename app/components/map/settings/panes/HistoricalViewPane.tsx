"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { motion, AnimatePresence } from "framer-motion";

interface HistoricalViewPaneProps {
  useHistoricalMode: boolean;
  setHistoricalMode: (enabled: boolean) => void;
  dateRange: { from: Date | null; to: Date | null };
  setDateRange: (range: { from: Date | null; to: Date | null }) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HistoricalViewPane({
  useHistoricalMode,
  setHistoricalMode,
  dateRange,
  setDateRange,
  isOpen,
  onOpenChange,
}: HistoricalViewPaneProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Header - always visible */}
      <div
        className="p-3 bg-secondary/50 flex items-center justify-between cursor-pointer"
        onClick={() => onOpenChange(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-muted-foreground" />
          <h3 className="font-medium">Historical View</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {useHistoricalMode ? "Enabled" : "Disabled"}
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
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">
                  Search historical data by date range
                </p>
                <div className="flex items-center">
                  <Checkbox
                    id="use-historical"
                    checked={useHistoricalMode}
                    onCheckedChange={(checked) =>
                      setHistoricalMode(checked === true)
                    }
                  />
                  <Label htmlFor="use-historical" className="ml-2 text-sm">
                    Enable
                  </Label>
                </div>
              </div>

              {useHistoricalMode && (
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                  <DateRangePicker
                    date={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onDateChange={setDateRange}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
