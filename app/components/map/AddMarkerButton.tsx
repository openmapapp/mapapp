"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AddMarkerButtonProps {
  isAdding: boolean;
  toggleMarker: () => void;
}

const AddMarkerButton: React.FC<AddMarkerButtonProps> = ({
  isAdding,
  toggleMarker,
}) => {
  return (
    <motion.div
      className="absolute z-10"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Button
        size="icon"
        onClick={toggleMarker}
        className={cn(
          "h-12 w-12 rounded-full shadow-lg",
          isAdding
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        aria-label={isAdding ? "Cancel adding marker" : "Add new marker"}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isAdding ? -150 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isAdding ? (
            <MapPin className="h-8 w-8" />
          ) : (
            <MapPin className="h-8 w-8" />
          )}
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default AddMarkerButton;
