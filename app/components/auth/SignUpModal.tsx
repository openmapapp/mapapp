"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignUpForm from "@/app/components/auth/SignUpForm";

export default function SignUpModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="z-50 bg-white text-black outline hover:bg-gray-100 hover:cursor-pointer">
          Sign Up
        </Button>
      </DialogTrigger>

      <DialogTitle className="sr-only">Register</DialogTitle>
      <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-lg font-bold mb-4">Register</h2>
        <SignUpForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
