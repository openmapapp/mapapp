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

export default function SignUpModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const trust = 1;

  const handleSignUp = async () => {
    const { data, error } = await authClient.signUp.email(
      { email, password, name, username, trust },
      {
        onRequest: (ctx) => {
          //show loading
        },
        onSuccess: (ctx) => {
          setIsOpen(false); // ✅ Close modal on success
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
      {/* Trigger Button (Floating on Map) */}
      <DialogTrigger asChild>
        <Button className="z-50 bg-white text-black outline hover:bg-gray-100 hover:cursor-pointer">
          Sign Up
        </Button>
      </DialogTrigger>

      {/* The Modal */}
      <DialogTitle className="sr-only">Register</DialogTitle>
      <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Register</h2>
        </div>

        <div className="mt-4">
          <Label>Name</Label>
          <Input
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your email"
            className="border border-black"
          />
        </div>

        <div className="mt-4">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border border-black"
          />
        </div>

        <div className="mt-4">
          <Label>Username</Label>
          <Input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a username"
            className="border border-black"
          />
        </div>

        <div className="mt-4">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password"
            className="border border-black"
          />
        </div>
        <div className="flex justify-center">
          <Button
            onClick={handleSignUp}
            className="w-36 h-11 mt-4 text-black border border-black bg-white hover:bg-gray-100 hover:cursor-pointer"
          >
            Register
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
