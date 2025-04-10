// types.ts - You can create this file to centralize your type definitions

// Base field interface
export interface BaseField {
  name: string;
  label: string;
  type: "text" | "number" | "select";
  options?: string[];
  required: boolean;
  filterable: boolean;
  description?: string;
}

// Field for ReportTypeEditor
export interface ReportTypeField extends BaseField {
  id: string;
  order: number;
}

// Field for API responses
export interface ApiField extends BaseField {
  reportTypes?: ReportType[];
  reportTypeIds?: number[];
}

// Field for editing in ReportFieldEditor
export interface EditableField extends BaseField {
  id?: number;
  reportTypes?: ReportType[];
  reportTypeIds?: number[];
}

// Report Type definition
export interface ReportType {
  id: number;
  name: string;
  description?: string;
  fields?: string; // JSON string of field configurations
  iconUrl?: string;
}

// Props for ReportFieldEditor
export interface ReportFieldEditorProps {
  field?: EditableField;
  onSave: (field: EditableField) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

// Props for ReportTypeEditor
export interface ReportTypeEditorProps {
  reportType: ReportType;
  onSave: (reportType: ReportType) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  onFieldCreated?: () => void;
}

// Field selector props
export interface FieldSelectorProps {
  availableFields: ApiField[];
  currentFields: ReportTypeField[];
  onSelect: (field: ApiField) => void;
  onClose: () => void;
  isLoading: boolean;
}

// Server action response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
