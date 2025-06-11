import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { fetchBlogPosts } from "@/actions/blog/blog";
import BlogPostList from "@/app/components/admin/BlogPostList";
import { getGlobalSettings } from "@/actions/admin/globalSettings";
import Link from "next/link";

export default async function AdminBlogPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  // Check if the user is authenticated and is an admin
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/blog");
  }

  if (session?.user.role !== "admin") {
    redirect("/");
  }

  // Get site settings to check if blog is enabled
  const settings = await getGlobalSettings();

  if (!settings?.blogEnabled) {
    return (
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">Blog Administration</h1>
        <div className="bg-yellow-100 p-4 rounded-md">
          <p>
            The blog feature is currently disabled. Enable it in site settings.
          </p>
        </div>
      </div>
    );
  }

  // Get all blog posts
  const posts = await fetchBlogPosts(session);

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Administration</h1>
        <Link
          href="/admin/blog/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          New Post
        </Link>
      </div>

      <BlogPostList session={session} posts={posts} />
    </div>
  );
}
