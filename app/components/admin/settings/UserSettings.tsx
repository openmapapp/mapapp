"use client";

import { useState, useEffect } from "react";
import {
  fetchUsers,
  deleteUser,
  updateUserRole,
} from "@/actions/admin/adminActions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User, columns as createColumns } from "./UserColumns";
import { DataTable } from "./DataTable";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Define session type
interface Session {
  user: {
    id: string;
    role: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface UserSettingsProps {
  session: Session;
}

export default function UserSettings({ session }: UserSettingsProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    const getUsers = async () => {
      try {
        setError(null);
        const fetchedUsers = await fetchUsers(session);

        if (Array.isArray(fetchedUsers)) {
          setUsers(fetchedUsers);
        } else {
          console.error("Invalid users data:", fetchedUsers);
          setError("Failed to load users data");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Error loading users");
      }
    };

    setLoading(true);
    getUsers().finally(() => setLoading(false));
  }, [session]);

  // Authorization check
  if (!session || session.user.role !== "admin") {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p className="font-semibold">Unauthorized</p>
            <p className="text-sm">You must be an admin to manage users</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle user deletion
  const handleDelete = (users: User[]) => {
    if (!users.length) return;

    setSelectedUsers(users);
    setShowConfirm(true);
  };

  // Confirm and perform deletion
  const confirmDelete = async () => {
    if (!selectedUsers.length) return;

    setLoading(true);
    try {
      await Promise.all(
        selectedUsers.map((user) => deleteUser(session, user.id))
      );

      toast.success("User(s) deleted successfully");

      // Update local state
      setUsers((prev) =>
        prev.filter((u) => !selectedUsers.some((s) => s.id === u.id))
      );
    } catch (err) {
      console.error("Error deleting users:", err);
      toast.error("Failed to delete users");
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setSelectedUsers([]);
    }
  };

  // Helper to capitalize strings
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Handle role change dialog
  const handleRoleClick = (users: User[]) => {
    if (!users.length) return;

    setSelectedUsers(users);
    setRoleModalOpen(true);
  };

  // Confirm and perform role change
  const confirmRoleChange = async (newRole: "admin" | "moderator" | "user") => {
    if (!selectedUsers.length || !newRole) return;

    setLoading(true);
    try {
      await Promise.all(
        selectedUsers.map((user) => updateUserRole(session, user.id, newRole))
      );

      toast.success(
        `Updated role to ${newRole} for ${selectedUsers.length} user${
          selectedUsers.length > 1 ? "s" : ""
        }`
      );

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          selectedUsers.some((s) => s.id === u.id) ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      console.error("Error updating user roles:", err);
      toast.error("Failed to update user roles");
    } finally {
      setLoading(false);
      setRoleModalOpen(false);
      setRole("");
      setSelectedUsers([]);
    }
  };

  // Create columns with handlers
  const columns = createColumns(handleDelete, handleRoleClick);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-bold">User Management</h2>
        <p className="text-muted-foreground">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={showConfirm}
        onOpenChange={(open) => {
          if (!loading) {
            setShowConfirm(open);
            if (!open) {
              setSelectedUsers([]);
            }
          }
        }}
      >
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm User Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              {selectedUsers.length > 1
                ? `these ${selectedUsers.length} users`
                : selectedUsers[0]?.name || "this user"}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role Change Dialog */}
      <AlertDialog
        open={roleModalOpen}
        onOpenChange={(open) => {
          if (!loading) {
            setRoleModalOpen(open);
            if (!open) {
              setRole("");
              setSelectedUsers([]);
            }
          }
        }}
      >
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUsers.length > 1
                ? `Update role for ${selectedUsers.length} selected users`
                : `Update role for ${selectedUsers[0]?.name || "user"}`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <Select value={role} onValueChange={setRole} disabled={loading}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    selectedUsers.length === 1
                      ? capitalize(selectedUsers[0]?.role || "")
                      : "Select new role"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmRoleChange(role as any)}
              disabled={loading || !role}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Data Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>User Accounts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && users.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <p>Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p className="font-semibold">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={users}
              onDeleteSelected={handleDelete}
              onChangeRoles={handleRoleClick}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
