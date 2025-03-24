"use client";

import { useState, useEffect } from "react";
import { User, columns } from "./UserColumns";
import { DataTable } from "./DataTable";
import { fetchUsers } from "@/actions/adminActions";

export default function UserSettings({ session }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers = await fetchUsers(session);
      setUsers(fetchedUsers);
    };

    setLoading(true);
    getUsers().finally(() => setLoading(false));
  }, [session]);
  // Fetch users from the database

  if (loading) return <p>Loading...</p>;

  return (
    <div className="">
      <h2 className="text-lg font-bold mb-4"> User Settings</h2>
      <div className="flex flex-col items-center justify-center">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={users} />
        </div>
      </div>
    </div>
  );
}
