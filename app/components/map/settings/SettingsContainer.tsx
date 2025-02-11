"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import TimeRangeSlider from "./TimeRangeSlider";

export default function SettingsContainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-28 left-6 z-10">
      <div className="relative">
        <Button
          className={`absolute top-7 left-3 bg-white ${
            isOpen ? "shadow-none" : "shadow"
          } rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <MixerHorizontalIcon className="h-6 w-6" />
        </Button>
      </div>

      <motion.div
        initial={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0)",
          border: "1px solid rgba(0, 0, 0, 0)",
        }}
        animate={
          isOpen
            ? {
                width: 320,
                height: 300,
                borderRadius: "30px",
                padding: 16,
                backgroundColor: "rgba(255, 255, 255, 1)",
                border: "1px solid rgba(0, 0, 0, 0)",
              }
            : {
                width: 50,
                height: 50,
                borderRadius: "50%",
                padding: 0,
                backgroundColor: "rgba(255, 255, 255, 0)",
                border: "1px solid rgba(0, 0, 0, 0)",
              }
        }
        transition={{ duration: 0.3, ease: "easeOut", exit: { duration: 0.1 } }}
        className=" flex flex-col overflow-hidden"
      >
        {/* ✅ Top Row: Mixer Icon + Settings Title */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="w-12 h-12"></div>
          <AnimatePresence>
            {isOpen && (
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  exit: { duration: 0.001 },
                }}
                className="font-semibold text-lg"
              >
                Settings
              </motion.h2>
            )}
          </AnimatePresence>
        </div>

        {/* ✅ Settings Content (Appears Below) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                exit: { duration: 0.1 },
              }}
              className="flex flex-col gap-4 mt-2 mb-10"
            >
              <div className="border border-black rounded-md shadow-md p-2">
                <TimeRangeSlider />
              </div>
              <p className="border border-black rounded-md text-sm text-gray-600 p-3 shadow-md">
                Settings content goes here: filter by type, keyword, etc.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
