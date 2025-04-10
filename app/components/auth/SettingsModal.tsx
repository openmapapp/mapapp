"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/app/lib/auth-client";
import { useSession } from "@/app/lib/auth-client";
import { handleDeletedUser } from "@/actions/user/userActions";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Loader2, Settings, User, Key, AlertTriangle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define schemas with proper typing
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

// Define types based on schemas
type UsernameFormValues = z.infer<typeof usernameSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

export default function SettingsModal() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("username");

  // Form loading states
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Initialize forms with proper typing
  const usernameForm = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const deleteAccountForm = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { confirmDeletePassword: "" },
  });

  // Handle Username Change
  const submitUsernameChange = async (values: UsernameFormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to change your username");
      return;
    }

    setUsernameLoading(true);
    try {
      await authClient.updateUser(
        { username: values.username },
        {
          onSuccess: () => {
            toast.success("Username changed successfully!");
            router.refresh();
            usernameForm.reset();
          },
          onError: (error) => {
            toast.error(error.message || "Error changing username");
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Error changing username");
    } finally {
      setUsernameLoading(false);
    }
  };

  // Handle Password Change
  const submitPasswordChange = async (values: PasswordFormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to change your password");
      return;
    }

    setPasswordLoading(true);
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
          onError: (error) => {
            toast.error(error.message || "Error changing password");
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Error changing password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle User Deletion
  const submitUserDelete = async (values: DeleteAccountFormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to delete your account");
      return;
    }

    setDeleteLoading(true);
    try {
      await handleDeletedUser(session?.user.id);
      await authClient.deleteUser(
        { password: values.confirmDeletePassword },
        {
          onSuccess: () => {
            router.refresh();
            toast.success("Account deleted");
            setIsOpen(false);
          },
          onError: (error) => {
            toast.error(error.message || "Error deleting account");
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Error deleting account");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Button with ID for mobile menu */}
      <DialogTrigger asChild>
        <Button id="settings-modal-trigger" variant="outline" size="icon">
          <Settings size={18} />
          <span className="sr-only">User Settings</span>
        </Button>
      </DialogTrigger>

      {/* The Modal */}
      <DialogContent
        className="sm:max-w-md max-w-[92vw] w-full p-4 sm:p-6 rounded-lg mx-auto"
        onInteractOutside={(e) => {
          // Prevent dismiss when clicking outside on mobile to avoid accidental dismissal
          if (window.innerWidth < 640) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Settings size={18} />
            User Settings
          </DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>

        {/* Tabbed interface for better mobile experience */}
        <Tabs
          defaultValue="username"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-4"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="username" className="flex items-center gap-1">
              <User size={16} className="hidden sm:block" />
              Username
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-1">
              <Key size={16} className="hidden sm:block" />
              Password
            </TabsTrigger>
            <TabsTrigger
              value="delete"
              className="flex items-center gap-1 text-destructive"
            >
              <AlertTriangle size={16} className="hidden sm:block" />
              Delete
            </TabsTrigger>
          </TabsList>

          {/* Username Change Form */}
          <TabsContent value="username" className="space-y-4">
            <Form {...usernameForm}>
              <form
                onSubmit={usernameForm.handleSubmit(submitUsernameChange)}
                className="space-y-4"
              >
                <FormField
                  control={usernameForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Enter new username${
                            session?.user?.username
                              ? ` (current: ${session.user.username})`
                              : ""
                          }`}
                          className="w-full"
                          disabled={usernameLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={usernameLoading}
                >
                  {usernameLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Username"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Password Change Form */}
          <TabsContent value="password" className="space-y-4">
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(submitPasswordChange)}
                className="space-y-4"
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
                          className="w-full"
                          disabled={passwordLoading}
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
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your new password"
                          className="w-full"
                          disabled={passwordLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Delete Account Tab */}
          <TabsContent value="delete" className="space-y-4">
            <div className="bg-destructive/10 p-4 rounded-md mb-4">
              <h3 className="text-destructive font-semibold flex items-center gap-2">
                <AlertTriangle size={18} />
                Warning: This action cannot be undone
              </h3>
              <p className="text-sm mt-2">
                Deleting your account will permanently remove all your data from
                our servers.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Delete My Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete your account and remove
                    all your personal data from our servers. This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...deleteAccountForm}>
                  <form
                    onSubmit={deleteAccountForm.handleSubmit(submitUserDelete)}
                    className="space-y-4 py-2"
                  >
                    <FormField
                      control={deleteAccountForm.control}
                      name="confirmDeletePassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm with your password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              className="w-full"
                              disabled={deleteLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                      <AlertDialogCancel className="mt-0">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        type="submit"
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Account"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </Form>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
