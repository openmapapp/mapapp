"use client";

import { useState } from "react";
import { useData } from "@/context/DataProvider";
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
import { validateInvite } from "@/actions/admin/validateInvite";
import { Loader2 } from "lucide-react";

// Define form schema with proper typing
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  inviteCode: z.string().optional(), // If invite-only mode is on
});

// TypeScript type for form values derived from schema
type SignUpFormValues = z.infer<typeof signUpSchema>;

// Props interface
interface SignUpFormProps {
  onSuccess?: () => void;
  inviteCode?: string;
}

export default function SignUpForm({
  onSuccess,
  inviteCode = "",
}: SignUpFormProps) {
  const router = useRouter();
  const { globalSettings } = useData();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      inviteCode, // Pre-fill if coming from invite link
    },
  });

  const handleSignUp = async (values: SignUpFormValues) => {
    setLoading(true);
    try {
      // Validate invite code if present
      if (values.inviteCode) {
        const codeValidated = await validateInvite(values.inviteCode);
        if (!codeValidated) {
          toast.error("Invalid invite code");
          setLoading(false);
          return;
        } else {
          toast.success("Invite code validated");
        }
      }

      // Create account with auth client
      await authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.name,
          username: values.username,
        },
        {
          onRequest: () => {
            toast.loading("Creating account...");
          },
          onSuccess: () => {
            toast.success("Account created successfully!");
            onSuccess?.(); // Close modal if using in SignUpModal
            router.refresh(); // Refresh session
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
                <Input
                  {...field}
                  placeholder="Full Name"
                  className="w-full"
                  disabled={loading}
                  autoComplete="name"
                />
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
                <Input
                  type="email"
                  {...field}
                  placeholder="Enter your email"
                  className="w-full"
                  disabled={loading}
                  autoComplete="email"
                />
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
                <Input
                  {...field}
                  placeholder="Choose a username"
                  className="w-full"
                  disabled={loading}
                  autoComplete="username"
                />
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
                  className="w-full"
                  disabled={loading}
                  autoComplete="new-password"
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
                  <Input
                    {...field}
                    placeholder="Enter invite code"
                    className="w-full"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </Form>
  );
}
