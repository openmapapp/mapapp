"use client";

import { useData } from "../../../../context/DataProvider";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function TimeRangeSlider() {
  const { timeRange, setTimeRange } = useData();
  const [localTimeRange, setLocalTimeRange] = useState(timeRange);

  // Update the context value when slider stops changing (for performance)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localTimeRange !== timeRange) {
        setTimeRange(localTimeRange);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localTimeRange, timeRange, setTimeRange]);

  // Format time based on the value
  const formatTime = (hours: number) => {
    if (hours === 1) return "1 hour";
    if (hours < 24) return `${hours} hours`;
    if (hours === 24) return "1 day";
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return days === 1 ? "1 day" : `${days} days`;
    return days === 1
      ? `1 day ${remainingHours} hr${remainingHours > 1 ? "s" : ""}`
      : `${days} days ${remainingHours} hr${remainingHours > 1 ? "s" : ""}`;
  };

  // Quick select options
  const timePresets = [
    { label: "4h", value: 4 },
    { label: "12h", value: 12 },
    { label: "1d", value: 24 },
    { label: "3d", value: 72 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label
          htmlFor="time-slider"
          className="text-sm font-medium flex items-center gap-1.5"
        >
          <Clock size={14} className="text-muted-foreground" />
          Time Window
        </Label>
        <span className="text-sm font-medium text-primary">
          {formatTime(localTimeRange)}
        </span>
      </div>

      <Slider
        id="time-slider"
        min={1}
        max={72} // Extended to 3 days
        step={1}
        value={[localTimeRange]}
        onValueChange={(value) => setLocalTimeRange(value[0])}
        className="py-2"
      />

      <div className="text-xs text-muted-foreground">
        Showing reports from the last{" "}
        <strong>{formatTime(localTimeRange)}</strong>
      </div>

      {/* Quick select buttons */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs text-muted-foreground mr-1">
          Quick select:
        </span>
        {timePresets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => {
              setLocalTimeRange(preset.value);
              setTimeRange(preset.value);
            }}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${
              localTimeRange === preset.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
