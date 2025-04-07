// app/about/page.tsx
import { Metadata } from "next";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { getAboutContent } from "@/actions/admin/about";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our community mapping project",
};

export default async function AboutPage() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  const content = await getAboutContent();

  return (
    <div className="container py-10">
      <div className="flex justify-between mb-6">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:underline mb-4"
        >
          &larr; Back to Home
        </Link>
        {session?.user.role == "admin" && (
          <Link
            href="/admin/about"
            className="text-sm text-muted-foreground hover:underline mb-4"
          >
            Edit
          </Link>
        )}
      </div>
      <h1 className="text-3xl font-bold mb-8">About Us</h1>

      <div
        className="prose max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{
          __html: content || "<p>No content available.</p>",
        }}
      />
    </div>
  );
}
