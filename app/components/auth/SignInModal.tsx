"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignInForm from "./SignInForm";

export default function SignInModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignIn = async () => {
    const { data, error } = await authClient.signIn.email(
      { email, password, callbackURL: "/" },
      {
        onSuccess: () => {
          setIsOpen(false);
          router.refresh();
        },
        onError: (ctx) => {
          console.log("onError", ctx);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* ✅ Trigger Button (Floating on Map) */}
      <DialogTrigger asChild>
        <Button className="z-50 bg-white text-black outline hover:bg-gray-100 hover:cursor-pointer">
          Sign In
        </Button>
      </DialogTrigger>

      {/* ✅ The Modal */}
      <DialogTitle className="sr-only">Sign In</DialogTitle>
      <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-lg font-bold">Sign In</h2>
        <SignInForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
