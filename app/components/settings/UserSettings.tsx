"use client";

import { useState, useEffect } from "react";
import { fetchUsers, deleteUser, updateUserRole } from "@/actions/adminActions";
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

export default function UserSettings({ session }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState("");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers = await fetchUsers(session);
      setUsers(fetchedUsers);
    };

    setLoading(true);
    getUsers().finally(() => setLoading(false));
  }, [session]);
  // Fetch users from the database

  if (!session || session.user.role !== "admin") {
    return <p>Unauthorized</p>;
  }

  // if (loading) return <p>Loading...</p>;

  const handleDelete = (users: User[]) => {
    setSelectedUsers(users);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    await Promise.all(
      selectedUsers.map((user) => deleteUser(session, user.id))
    );

    toast.success("User(s) deleted successfully");
    setShowConfirm(false);

    setUsers((prev) =>
      prev.filter((u) => !selectedUsers.some((s) => s.id === u.id))
    );
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleRoleClick = (users: User[]) => {
    setSelectedUsers(users);
    setRoleModalOpen(true);
  };

  const confirmRoleChange = async (newRole: "admin" | "moderator" | "user") => {
    await Promise.all(
      selectedUsers.map((user) => updateUserRole(session, user.id, newRole))
    );
    toast.success(
      `Updated role to ${newRole} for ${selectedUsers.length} user${
        selectedUsers.length > 1 ? "s" : ""
      }`
    );

    // Refresh local users state
    setUsers((prev) =>
      prev.map((u) =>
        selectedUsers.some((s) => s.id === u.id) ? { ...u, role: newRole } : u
      )
    );

    setRoleModalOpen(false);
    setRole("");
    setSelectedUsers([]);
  };

  const columns = createColumns(handleDelete, handleRoleClick);

  return (
    <div className="">
      <h2 className="text-lg font-bold mb-4"> User Settings</h2>
      <div className="flex flex-col items-center justify-center">
        <AlertDialog
          open={showConfirm}
          onOpenChange={(open) => {
            setShowConfirm(open);
            if (!open) {
              setSelectedUsers([]);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                {selectedUsers.length > 1 ? "these users" : "this user"}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 border-black"
                onClick={confirmDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={roleModalOpen}
          onOpenChange={(open) => {
            setRoleModalOpen(open);
            if (!open) {
              setRole("");
              setSelectedUsers([]);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change User Role</AlertDialogTitle>
            </AlertDialogHeader>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    selectedUsers.length === 1
                      ? capitalize(selectedUsers[0].role)
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
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => confirmRoleChange(role)}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="container mx-auto py-10">
          {loading ? (
            <div className="text-center">Loading users...</div>
          ) : (
            <DataTable
              columns={columns}
              data={users}
              onDeleteSelected={handleDelete}
              onChangeRoles={handleRoleClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
