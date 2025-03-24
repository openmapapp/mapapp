"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/app/lib/auth-client";
import { useSession } from "@/app/lib/auth-client";
import { handleDeletedUser } from "@/actions/postReport";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const usernameSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(30, "Username must be fewer than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
  })
  .superRefine(({ newPassword, currentPassword }, ctx) => {
    if (newPassword === currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "New password cannot be the same as the current password",
      });
    }
  });

const deleteAccountSchema = z.object({
  confirmDeletePassword: z
    .string()
    .min(6, "Password is required to delete account"),
});

export default function SettingsModal() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const usernameForm = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const deleteAccountForm = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { confirmDeletePassword: "" },
  });

  // Handle Username Change
  const submitUsernameChange = async (values: { username: string }) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to change your username");
      return;
    }

    try {
      await authClient.updateUser(
        { username: values.username },
        {
          onSuccess: () => {
            toast.success("Username changed successfully!");
            router.refresh();
            usernameForm.reset();
          },
          onError: () => {
            toast.error("Error changing username");
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Error changing username");
    }
  };

  // Handle Password Change
  const submitPasswordChange = async (values: {
    newPassword: string;
    currentPassword: string;
  }) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to change your password");
      return;
    }

    try {
      await authClient.changePassword(
        {
          newPassword: values.newPassword,
          currentPassword: values.currentPassword,
          revokeOtherSessions: true,
        },
        {
          onSuccess: () => {
            toast.success("Password changed successfully!");
            passwordForm.reset();
          },
          onError: () => {
            toast.error("Error changing password");
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Error changing password");
    }
  };

  // Handle User Deletion
  const submitUserDelete = async (values: {
    confirmDeletePassword: string;
  }) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to delete your account");
      return;
    }

    try {
      await handleDeletedUser(session?.user.id);
      await authClient.deleteUser(
        { password: values.confirmDeletePassword },
        {
          onSuccess: () => {
            router.refresh();
            toast.success("Account deleted");
          },
          onError: () => {
            toast.error("Error deleting account");
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Error deleting account");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button variant="outline" className="">
          User Settings
        </Button>
      </DialogTrigger>

      {/* The Modal */}
      <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <DialogTitle className="sr-only">User Settings</DialogTitle>

        {/* Username Change Form */}
        <Form {...usernameForm}>
          <form
            onSubmit={usernameForm.handleSubmit(submitUsernameChange)}
            className="space-y-4 p-4"
          >
            <FormField
              control={usernameForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your new username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Update Username
            </Button>
          </form>
        </Form>

        {/* Password Change Form */}
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(submitPasswordChange)}
            className="space-y-4 p-4"
          >
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your current password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Update Password
            </Button>
          </form>
        </Form>

        {/* Delete Account Form */}
        <div className="flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={"destructive"}
                className="bg-red-600 shadow-md hover:bg-red-500 hover:cursor-pointer text-white border border-black mt-4"
              >
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete your account and remove
                  your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Form {...deleteAccountForm}>
                <form
                  onSubmit={deleteAccountForm.handleSubmit(submitUserDelete)}
                  className="space-y-4 p-4"
                >
                  <FormField
                    control={deleteAccountForm.control}
                    name="confirmDeletePassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Delete Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      type="submit"
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </Form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
