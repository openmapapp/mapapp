import { Metadata } from "next";
import Link from "next/link";
import { getGlobalSettings } from "@/actions/globalSettings";
import { fetchPublishedBlogPosts } from "@/actions/blog";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Blog",
  description: "Our community blog",
};

export default async function BlogPage() {
  // Check if blog is enabled
  const settings = await getGlobalSettings();

  if (!settings?.blogEnabled) {
    redirect("/");
  }

  // Get all published blog posts
  const posts = await fetchPublishedBlogPosts();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>

      {posts.length === 0 ? (
        <p>No blog posts published yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border bg-white dark:bg-secondary rounded-lg overflow-hidden shadow-sm"
            >
              <div className="p-6">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <span>
                    {post.publishedAt
                      ? formatDate(post.publishedAt)
                      : formatDate(post.createdAt)}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{post.author.name}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && (
                  <p className="text-muted-foreground">{post.excerpt}</p>
                )}

                {post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.categories.map((category) => (
                      <span
                        key={category.id}
                        className="bg-muted px-2 py-1 text-xs rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
