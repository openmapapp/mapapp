"use client";

import { ColumnDef } from "@tanstack/react-table";

export type User = {
  id: string;
  username: string;
  role: "user" | "moderator" | "admin";
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
