"use client";

import { useState, useEffect } from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Search,
  Trash,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define props interface with proper typing
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDeleteSelected?: (users: TData[]) => void;
  onChangeRoles?: (users: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onDeleteSelected,
  onChangeRoles,
}: DataTableProps<TData, TValue>) {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  // Get selected rows data
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedUsers = selectedRows.map((row) => row.original);
  const selectedCount = selectedRows.length;
  const isAnySelected = selectedCount > 0;

  // Setup default page size based on viewport
  useEffect(() => {
    table.setPageSize(isMobile ? 5 : 10);
  }, [table, isMobile]);

  return (
    <div className="w-full">
      {/* Table Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-2">
        {/* Search */}
        <div className="relative w-full md:w-auto max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-8 w-full md:w-[240px] lg:w-[320px]"
          />
        </div>

        {/* Action Buttons - Only show when rows selected */}
        {isAnySelected && (
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDeleteSelected?.(selectedUsers)}
              className="flex items-center gap-1"
            >
              <Trash className="h-4 w-4" />
              <span>{`Delete ${
                selectedCount === 1 ? "User" : `${selectedCount} Users`
              }`}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChangeRoles?.(selectedUsers)}
              className="flex items-center gap-1"
            >
              <UserCog className="h-4 w-4" />
              <span>{`Change Role${selectedCount > 1 ? "s" : ""}`}</span>
            </Button>
          </div>
        )}

        {/* Column Visibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <span className="sr-only md:not-sr-only md:inline-block">
                Columns
              </span>{" "}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "transition-colors hover:bg-muted/50",
                      row.getIsSelected() && "bg-muted"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 py-4">
        <div className="text-sm text-muted-foreground">
          {selectedCount > 0 && (
            <span>
              {selectedCount} of {table.getFilteredRowModel().rows.length}{" "}
              row(s) selected.
            </span>
          )}
          {!selectedCount && data.length > 0 && (
            <span>
              {table.getFilteredRowModel().rows.length} user
              {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
