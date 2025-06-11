import React from "react";

export default function MapSkeleton() {
  return (
    <div className="h-full w-full bg-gray-100 dark:bg-gray-800 animate-pulse">
      {/* Map container skeleton */}
      <div className="h-full w-full relative">
        {/* Map background */}
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
          {/* Fake grid lines to simulate a map */}
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="border border-gray-300 dark:border-gray-600 opacity-20"
              ></div>
            ))}
          </div>
        </div>

        {/* UI Control skeletons */}
        <div className="absolute top-3 left-7 h-10 w-10 rounded-md bg-white dark:bg-gray-900 shadow-md"></div>
        <div className="absolute top-4 right-4 h-32 w-10 rounded-md bg-white dark:bg-gray-900 shadow-md"></div>
        <div className="absolute bottom-4 left-4 h-6 w-32 rounded-md bg-white dark:bg-gray-900 shadow-md opacity-80"></div>
      </div>
    </div>
  );
}
