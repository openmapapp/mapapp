// components/admin/blog-post-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LazyRichTextEditor } from "./LazyRichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBlogPost, updateBlogPost } from "@/actions/blog";
import type { Session } from "@/app/lib/auth-client";

interface Category {
  id: string;
  name: string;
}

interface BlogPostFormProps {
  session: Session;
  post?: {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    published: boolean;
    categories: Category[];
  };
  categories: Category[];
}

export default function BlogPostForm({
  session,
  post,
  categories,
}: BlogPostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [published, setPublished] = useState(post?.published || false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories.map((cat) => cat.id) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("excerpt", excerpt);
      formData.append("published", published.toString());
      formData.append("categories", selectedCategories.join(","));

      if (post) {
        await updateBlogPost(session, post.id, formData);
      } else {
        await createBlogPost(session, formData);
      }

      router.push("/admin/blog");
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:min-w-full">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-white dark:bg-accent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="bg-white dark:bg-accent"
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <LazyRichTextEditor content={content} onChange={setContent} />
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="published"
          checked={published}
          onCheckedChange={(checked) => setPublished(!!checked)}
        />
        <Label htmlFor="published">Publish immediately</Label>
      </div>

      <div className="flex space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/blog")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
