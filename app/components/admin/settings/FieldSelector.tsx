"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Search } from "lucide-react";

export default function FieldSelector({
  availableFields,
  currentFields,
  onSelect,
  onClose,
  isLoading,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter out fields that are already in use
  const currentFieldNames = currentFields.map((field) => field.name);

  // Filter and sort available fields
  const filteredFields = availableFields
    .filter(
      (field) =>
        !currentFieldNames.includes(field.name) &&
        (field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          field.label.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Field</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredFields.length > 0 ? (
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {filteredFields.map((field) => (
                <div
                  key={field.name}
                  className="flex justify-between items-center p-3 border rounded-md hover:bg-muted"
                >
                  <div>
                    <div className="font-medium">{field.label}</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {field.name}
                    </div>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline">{field.type}</Badge>
                      {field.filterable && (
                        <Badge variant="secondary">Filterable</Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => onSelect(field)}>
                    Add
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No matching fields found"
                : "No available fields found. Create new fields first."}
            </div>
          )}
        </div>

        <DialogFooter className="justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
