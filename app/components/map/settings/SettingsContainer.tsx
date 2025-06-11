"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wrench, X, Clock, Filter, MapPin, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeRangeSlider from "./TimeRangeSlider";
import { useClickAway } from "react-use";
import { cn } from "@/lib/utils";

export default function SettingsContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("time");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close settings when clicking outside
  useClickAway(containerRef, () => {
    if (isOpen) setIsOpen(false);
  });

  // Close settings when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen]);

  // Animation variants for container
  const containerVariants = {
    closed: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "var(--color-background)",
      boxShadow: "var(--shadow-sm)",
      border: "1px solid var(--color-border)",
    },
    open: {
      width: "min(90vw, 320px)",
      height: "auto",
      borderRadius: 16,
      backgroundColor: "var(--color-background)",
      boxShadow: "var(--shadow-md)",
      border: "1px solid var(--color-border)",
    },
  };

  // Animation variants for content
  const contentVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        delay: 0.1,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <div ref={containerRef} className="fixed top-38 left-4 sm:left-6 z-10">
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={containerVariants}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="overflow-hidden relative"
      >
        {/* Toggle button - changes position and icon when open/closed */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "open" : "closed"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute",
              isOpen
                ? "top-4 right-4"
                : "top-0 left-0 w-full h-full flex items-center justify-center"
            )}
          >
            <Button
              size="icon"
              variant={isOpen ? "ghost" : "secondary"}
              className={cn(
                "rounded-full",
                !isOpen &&
                  "w-full h-full bg-card text-card-foreground hover:bg-card/90"
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close settings" : "Open settings"}
            >
              {isOpen ? <X size={20} /> : <Wrench size={20} />}
            </Button>
          </motion.div>
        </AnimatePresence>

        {/* Settings Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="pt-4 pb-4 px-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Map Settings</h2>
                {/* This empty div ensures proper spacing in flex layout */}
                <div className="w-5"></div>
              </div>

              <Tabs
                defaultValue="time"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="time" className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Time</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="filter"
                    className="flex items-center gap-1"
                  >
                    <Filter size={14} />
                    <span>Filter</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="layers"
                    className="flex items-center gap-1"
                  >
                    <Layers size={14} />
                    <span>Layers</span>
                  </TabsTrigger>
                </TabsList>

                {/* Time Settings Tab */}
                <TabsContent value="time" className="space-y-4">
                  <div className="bg-secondary/50 rounded-lg p-3 border border-border">
                    <TimeRangeSlider />
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-3 border border-border">
                    <h3 className="font-medium mb-2">Historical View</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a custom date range to view historical data
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => {
                        // Placeholder for future functionality
                        alert("Historical view feature coming soon");
                      }}
                    >
                      View Historical Data
                    </Button>
                  </div>
                </TabsContent>

                {/* Filter Tab */}
                <TabsContent value="filter" className="space-y-4">
                  <div className="bg-secondary/50 rounded-lg p-3 border border-border">
                    <h3 className="font-medium mb-2">Filter by Type</h3>
                    <p className="text-sm text-muted-foreground">
                      Select which report types to display on the map
                    </p>
                    {/* Placeholder for future filter controls */}
                    <div className="mt-2 text-sm text-muted-foreground italic">
                      Filter controls coming soon
                    </div>
                  </div>
                </TabsContent>

                {/* Layers Tab */}
                <TabsContent value="layers" className="space-y-4">
                  <div className="bg-secondary/50 rounded-lg p-3 border border-border">
                    <h3 className="font-medium mb-2">Map Style</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose different map styles and visualization options
                    </p>
                    {/* Placeholder for future layer controls */}
                    <div className="mt-2 text-sm text-muted-foreground italic">
                      Map style options coming soon
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-3 border border-border">
                    <h3 className="font-medium mb-2">Heat Map</h3>
                    <p className="text-sm text-muted-foreground">
                      Toggle heat map visualization for report density
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => {
                        // Placeholder for future functionality
                        alert("Heat map feature coming soon");
                      }}
                    >
                      Enable Heat Map
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
