"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  X,
  Clock,
  Filter,
  Layers,
  Download,
  Check,
  RotateCcw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClickAway } from "react-use";
import { useData } from "@/context/DataProvider";
import TimeRangeTab from "./TimeRangeTab";
import FilterTab from "./FilterTab";
import LayersTab from "./LayersTab";
import ExportTab from "./ExportTab";

interface SettingsContainerProps {
  setHeatmapEnabled: (enabled: boolean) => void;
  heatmapEnabled: boolean;
  setHeatmapIntensity: (intensity: number) => void;
  heatmapIntensity: number;
  setHeatmapRadius: (radius: number) => void;
  heatmapRadius: number;
  setHeatmapOpacity: (opacity: number) => void;
  heatmapOpacity: number;
}

export default function SettingsContainer({
  // Heatmap props
  setHeatmapEnabled,
  heatmapEnabled,
  setHeatmapIntensity,
  heatmapIntensity,
  setHeatmapRadius,
  heatmapRadius,
  setHeatmapOpacity,
  heatmapOpacity,
}: SettingsContainerProps) {
  const { filters, applyFilters, resetFilters } = useData();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("time");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle filter application with loading state
  const handleApplyFilters = () => {
    setIsLoading(true);
    // Use setTimeout to allow UI to update with loading state
    setTimeout(() => {
      applyFilters();
      setIsLoading(false);
    }, 300);
  };

  // Reset filters with loading state
  const handleResetFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      resetFilters();
      setIsLoading(false);
    }, 300);
  };

  // Close settings when clicking outside
  useClickAway(
    containerRef,
    (e) => {
      // Don't close if clicking inside a popover
      const target = e.target as HTMLElement;
      const isDatePickerClick = !!target.closest('[role="dialog"]');
      const isDatePickerTriggerClick = !!target.closest(".date-range-trigger");

      // Check if the click is inside the settings container
      const isInsideSettings = !!containerRef.current?.contains(target);

      if (
        isOpen &&
        !isDatePickerClick &&
        !isDatePickerTriggerClick &&
        !isInsideSettings
      ) {
        setIsOpen(false);
      }
    },
    ["mousedown", "touchstart"]
  );

  // Close settings when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        // Check if a popover is open
        const popoverOpen = document.querySelector('[role="dialog"]');
        if (!popoverOpen) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="settings-container fixed top-38 left-4 sm:left-6 z-10"
      onClick={(e) => {
        // Prevent click events from propagating to the parent
        e.stopPropagation();
      }}
    >
      {/* Button when closed */}
      {!isOpen && (
        <Button
          size="icon"
          variant="secondary"
          className="h-12 w-12 rounded-full bg-card text-card-foreground hover:bg-card/90"
          onClick={() => setIsOpen(true)}
          aria-label="Open settings"
        >
          <Wrench size={20} />
        </Button>
      )}

      {/* Container when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 56, height: 48, borderRadius: 24, opacity: 0 }}
            animate={{
              width: "min(90vw, 360px)",
              height: "max(75vh, 400px)",
              borderRadius: 16,
              opacity: 1,
            }}
            exit={{
              width: 48,
              height: 48,
              borderRadius: 24,
              opacity: 0,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="bg-background border border-border shadow-md overflow-y-auto max-h-[85vh]"
            style={{ zIndex: 100 }}
          >
            {/* Close button */}
            <div className="absolute top-1 right-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                aria-label="Close settings"
                className="hover:bg-secondary/10"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="pt-8 pb-8 px-5">
              <Tabs
                defaultValue="time"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger
                    value="time"
                    className="flex items-center gap-1 px-1 sm:px-2"
                  >
                    <Clock size={14} />
                    <span>Recent</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="filter"
                    className="flex items-center gap-1 px-1 sm:px-2 relative"
                  >
                    <Filter size={14} />
                    <span>Filter</span>
                    {(filters.selectedReportTypes.length > 0 ||
                      Object.keys(filters.selectedFields).length > 0 ||
                      Object.keys(filters.globalFieldFilters).length > 0 ||
                      filters.useHistoricalMode) && (
                      <span className="w-2 h-2 bg-primary rounded-full absolute top-1 right-1" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="layers"
                    className="flex items-center gap-1 px-1 sm:px-2"
                  >
                    <Layers size={14} />
                    <span>Layers</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="export"
                    className="flex items-center gap-1 px-1 sm:px-2"
                  >
                    <Download size={14} />
                    <span>Export</span>
                  </TabsTrigger>
                </TabsList>

                {/* Recent Events Tab */}
                <TabsContent value="time" className="space-y-4">
                  <TimeRangeTab />
                </TabsContent>

                {/* Filter Tab with collapsible panes */}
                <TabsContent value="filter" className="space-y-4">
                  <FilterTab isLoading={isLoading} />

                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1"
                      onClick={handleApplyFilters}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="animate-spin mr-1">⧗</span>
                      ) : (
                        <Check size={16} className="mr-1" />
                      )}
                      {filters.isFiltering ? "Update Filters" : "Apply Filters"}
                    </Button>

                    {filters.isFiltering && (
                      <Button
                        variant="outline"
                        className="flex-shrink-0"
                        onClick={handleResetFilters}
                        disabled={isLoading}
                        aria-label="Reset Filters"
                      >
                        <RotateCcw size={16} />
                      </Button>
                    )}
                  </div>
                </TabsContent>

                {/* Layers Tab */}
                <TabsContent value="layers" className="space-y-4">
                  <LayersTab
                    setHeatmapEnabled={setHeatmapEnabled}
                    heatmapEnabled={heatmapEnabled}
                    setHeatmapIntensity={setHeatmapIntensity}
                    heatmapIntensity={heatmapIntensity}
                    setHeatmapRadius={setHeatmapRadius}
                    heatmapRadius={heatmapRadius}
                    setHeatmapOpacity={setHeatmapOpacity}
                    heatmapOpacity={heatmapOpacity}
                  />
                </TabsContent>

                {/* Export Tab */}
                <TabsContent value="export" className="space-y-4">
                  <ExportTab />
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
