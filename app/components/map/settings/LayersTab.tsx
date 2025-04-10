// components/map/settings/LayersTab.tsx
"use client";

import { useState } from "react";
import { useData } from "@/context/DataProvider";
import { Layers, Flame } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface LayersTabProps {
  setHeatmapEnabled: (enabled: boolean) => void;
  heatmapEnabled: boolean;
  setHeatmapIntensity: (intensity: number) => void;
  heatmapIntensity: number;
  setHeatmapRadius: (radius: number) => void;
  heatmapRadius: number;
  setHeatmapOpacity: (opacity: number) => void;
  heatmapOpacity: number;
}

export default function LayersTab({
  setHeatmapEnabled,
  heatmapEnabled,
  setHeatmapIntensity,
  heatmapIntensity,
  setHeatmapRadius,
  heatmapRadius,
  setHeatmapOpacity,
  heatmapOpacity,
}: LayersTabProps) {
  const { reports, filteredReports, filters } = useData();

  // Use filtered reports when filtering is active, otherwise use all reports
  const displayReports = filters.isFiltering ? filteredReports : reports;

  // Count of reports being visualized
  const reportCount = displayReports.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-muted-foreground" />
          <h3 className="font-medium">Map Visualization</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          {reportCount} reports
        </div>
      </div>

      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-amber-500" />
              <Label htmlFor="enable-heatmap" className="font-medium">
                Heatmap
              </Label>
            </div>
            <Switch
              id="enable-heatmap"
              checked={heatmapEnabled}
              onCheckedChange={setHeatmapEnabled}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Show a heatmap visualization of report density
          </p>
        </div>

        {heatmapEnabled && (
          <div className="space-y-4 pt-2 border-t">
            {/* Intensity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="intensity-slider" className="text-sm">
                  Intensity
                </Label>
                <span className="text-xs text-muted-foreground">
                  {heatmapIntensity}
                </span>
              </div>
              <Slider
                id="intensity-slider"
                min={1}
                max={10}
                step={1}
                value={[heatmapIntensity]}
                onValueChange={(value) => setHeatmapIntensity(value[0])}
              />
            </div>

            {/* Radius Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="radius-slider" className="text-sm">
                  Radius
                </Label>
                <span className="text-xs text-muted-foreground">
                  {heatmapRadius}px
                </span>
              </div>
              <Slider
                id="radius-slider"
                min={10}
                max={50}
                step={5}
                value={[heatmapRadius]}
                onValueChange={(value) => setHeatmapRadius(value[0])}
              />
            </div>

            {/* Opacity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="opacity-slider" className="text-sm">
                  Opacity
                </Label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(heatmapOpacity * 100)}%
                </span>
              </div>
              <Slider
                id="opacity-slider"
                min={0.1}
                max={1}
                step={0.1}
                value={[heatmapOpacity]}
                onValueChange={(value) => setHeatmapOpacity(value[0])}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Additional map layer options can be added here */}
    </div>
  );
}
