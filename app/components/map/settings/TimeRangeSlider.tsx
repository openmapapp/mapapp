"use client";

import { useData } from "../../layout/DataProvider";
import { Slider } from "@/components/ui/slider";

export default function TimeRangeSlider() {
  const { timeRange, setTimeRange } = useData();

  return (
    <div className="p-3">
      <label className="block font-semibold pb-1">Time Range</label>
      <Slider
        min={1}
        max={24}
        step={1}
        value={[timeRange]}
        onValueChange={(value) => setTimeRange(value[0])}
      />
      <p className="text-sm text-gray-600 mt-2">
        Showing repotrs from the last <strong>{[timeRange]}</strong> hours
      </p>
    </div>
  );
}
