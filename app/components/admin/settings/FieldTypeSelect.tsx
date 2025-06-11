import { Label } from "@/components/ui/label";

// Create a dedicated FieldTypeSelect component
export default function FieldTypeSelect({
  fieldId,
  value,
  onChange,
  disabled,
}: {
  fieldId: string;
  value: "text" | "number" | "select";
  onChange: (value: "text" | "number" | "select") => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`field-type-${fieldId}`}>Field Type</Label>
      <div className="relative">
        <select
          id={`field-type-${fieldId}`}
          value={value}
          onChange={(e) => {
            const newValue = e.target.value as "text" | "number" | "select";
            onChange(newValue);
          }}
          disabled={disabled}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="select">Dropdown</option>
        </select>
      </div>
    </div>
  );
}
