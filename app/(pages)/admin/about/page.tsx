"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LazyRichTextEditor } from "@/app/components/admin/LazyRichTextEditor";
import { Button } from "@/components/ui/button";
import { getAboutContent, updateAboutPage } from "@/actions/about";
import { useSession } from "@/app/lib/auth-client";
import type { Session } from "@/app/lib/auth-client";

export default function AdminAboutPage() {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        const aboutContent = await getAboutContent();
        setContent(aboutContent);
        setOriginalContent(aboutContent);
      } catch (error) {
        console.error("Error loading about page content:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await updateAboutPage(session, content);
      setOriginalContent(content);
      router.push("/about");
    } catch (error) {
      console.error("Error saving about page:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="container py-10">Loading...</div>;
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Edit About Page</h1>

      <div className="space-y-6">
        <LazyRichTextEditor content={content} onChange={setContent} />

        <div className="flex space-x-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setContent(originalContent);
              router.push("/about");
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
