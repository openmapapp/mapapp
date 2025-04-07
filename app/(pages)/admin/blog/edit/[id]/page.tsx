import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { fetchBlogPostById, fetchCategories } from "@/actions/blog/blog";
import BlogPostForm from "@/app/components/admin/BlogPostForm";
import { getGlobalSettings } from "@/actions/admin/globalSettings";

interface BlogPostPageProps {
  params: { id: string };
}

export default async function EditBlogPostPage({ params }: BlogPostPageProps) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  // Check if the user is authenticated and is an admin
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/blog/new");
  }

  if (session?.user.role !== "admin") {
    redirect("/");
  }

  // Get site settings to check if blog is enabled
  const settings = await getGlobalSettings();

  if (!settings?.blogEnabled) {
    redirect("/admin");
  }

  // Get categories for the form
  const categories = await fetchCategories();
  const post = await fetchBlogPostById(params.id);
  if (!post) {
    redirect("/admin/blog");
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
      <BlogPostForm session={session} post={post} categories={categories} />
    </div>
  );
}
