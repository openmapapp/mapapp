// components/ui/LazyRichTextEditor.tsx
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component from Shadcn

// Interface for the props
interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

// Lazy load the actual editor
const RichTextEditor = lazy(() =>
  import("@/components/ui/rich-text-editor").then((mod) => ({
    default: mod.RichTextEditor,
  }))
);

// Create a wrapper component that handles the lazy loading
export function LazyRichTextEditor(props: EditorProps) {
  return (
    <Suspense
      fallback={
        <div className="border rounded-md">
          <div className="flex flex-wrap gap-1 p-2 border-b bg-muted">
            {/* Toolbar skeleton */}
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-8 rounded" />
              ))}
            </div>
          </div>
          {/* Editor content skeleton */}
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      }
    >
      <RichTextEditor {...props} />
    </Suspense>
  );
}
