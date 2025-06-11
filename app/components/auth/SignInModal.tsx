"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignInForm from "./SignInForm";
import { LogIn } from "lucide-react";

export default function SignInModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Button with ID for mobile menu reference */}
      <DialogTrigger asChild>
        <Button
          id="sign-in-modal-trigger"
          variant="outline"
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 overflow-hidden dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90"
        >
          <LogIn size={18} className="hidden sm:block" />
          <span>Sign In</span>
        </Button>
      </DialogTrigger>

      {/* The Modal */}
      <DialogContent
        className="sm:max-w-md max-w-[92vw] w-full p-6 gap-6 rounded-lg mx-auto"
        onInteractOutside={(e) => {
          // Prevent dismiss when clicking outside on mobile to avoid accidental dismissal
          if (window.innerWidth < 640) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Sign In</DialogTitle>
        </DialogHeader>

        <SignInForm onSuccess={() => setIsOpen(false)} />

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0 mt-2">
          <div className="text-sm text-center sm:text-left">
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => {
                setIsOpen(false);
                // Small timeout to avoid flickering between modals
                setTimeout(() => {
                  document.getElementById("sign-up-modal-trigger")?.click();
                }, 100);
              }}
            >
              Sign Up
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
