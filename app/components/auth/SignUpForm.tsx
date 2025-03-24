"use client";

import { useState } from "react";
import { useData } from "@/app/components/layout/DataProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { validateInvite } from "@/actions/validateInvite";

// ✅ Zod validation schema for sign-up
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  inviteCode: z.string().optional(), // If invite-only mode is on
});

export default function SignUpForm({
  onSuccess,
  inviteCode = "",
}: {
  onSuccess?: () => void;
  inviteCode?: string;
}) {
  const router = useRouter();
  const { globalSettings } = useData();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      inviteCode, // Pre-fill if coming from invite link
    },
  });

  const handleSignUp = async (values: any) => {
    setLoading(true);
    try {
      if (values.inviteCode) {
        const codeValidated = await validateInvite(values.inviteCode);
        if (!codeValidated) {
          toast.error("Invalid invite code");
          return;
        } else {
          toast.success("Invite code validated");
        }
      }

      const { data, error } = await authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.name,
          username: values.username,
          trust: 1, // Default trust level
        },
        {
          onRequest: () => {
            toast.loading("Creating account...");
          },
          onSuccess: () => {
            toast.success("Account created successfully!");
            onSuccess?.(); // Close modal if using in SignUpModal
            router.push("/"); // Refresh session
          },
          onError: (ctx) => {
            toast.error(ctx.message || "Signup failed");
          },
        }
      );
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Full Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} placeholder="Enter your email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Choose a username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  placeholder="Create a password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Invite Code (Only shown if required) */}
        {globalSettings?.registrationMode === "invite-only" && (
          <FormField
            control={form.control}
            name="inviteCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Invite Code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
