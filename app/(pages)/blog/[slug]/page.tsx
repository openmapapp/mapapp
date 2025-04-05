import { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import {
  fetchBlogPostMetadataBySlug,
  fetchBlogPostBySlug,
} from "@/actions/blog";
import { getGlobalSettings } from "@/actions/globalSettings";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await fetchBlogPostMetadataBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Check if blog is enabled
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  const settings = await getGlobalSettings();

  console.log("User: ", session?.user);

  if (!settings?.blogEnabled) {
    notFound();
  }

  // Get the blog post
  const post = await fetchBlogPostBySlug(params.slug);

  if (!post || (!post.published && !post.author.isAdmin)) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:underline mb-4"
        >
          &larr; Back to Blog
        </Link>
        {session?.user.role == "admin" && (
          <Link
            href={`/admin/blog/edit/${post.id}`}
            className="text-sm text-muted-foreground hover:underline mb-4"
          >
            Edit Post
          </Link>
        )}
      </div>
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>
              {post.publishedAt
                ? formatDate(post.publishedAt)
                : formatDate(post.createdAt)}
            </span>
            <span className="mx-2">•</span>
            <span>{post.author.name}</span>
          </div>

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
        </header>

        <div
          className="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
