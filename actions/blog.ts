"use server";

import { revalidatePath } from "next/cache";
import db from "../db";
import { requireRole } from "@/app/lib/requireRole";
import type { Session } from "@/app/lib/auth";
import { redirect } from "next/navigation";

// Types
export interface BlogPostFormData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  published: boolean;
  categoryIds: string[];
}

export async function createBlogPost(session: Session, formData: FormData) {
  requireRole(session, "admin");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const published = formData.get("published") === "true";
  const categoryIds = (formData.get("categories") as string)
    .split(",")
    .filter(Boolean);

  // Create slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");

  const post = await db.blogPost.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      published,
      publishedAt: published ? new Date() : null,
      authorId: session.user.id,
      categories: {
        connect: categoryIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/blog");
  return post;
}

// Update blog post publication status
export async function updateBlogPostStatus(
  session: Session,
  id: string,
  published: boolean
) {
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const post = await db.blogPost.findUnique({
    where: { id },
    select: { published: true },
  });

  if (!post) {
    throw new Error("Blog post not found");
  }

  // If we're publishing a post for the first time, set publishedAt
  const publishedAt = !post.published && published ? new Date() : undefined;

  const updatedPost = await db.blogPost.update({
    where: { id },
    data: {
      published,
      publishedAt: published && !post.published ? publishedAt : undefined,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${updatedPost.slug}`);
  revalidatePath("/admin/blog");

  return updatedPost;
}

export async function updateBlogPost(
  session: Session,
  id: string,
  formData: FormData
) {
  requireRole(session, "admin");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const published = formData.get("published") === "true";
  const categoryIds = (formData.get("categories") as string)
    .split(",")
    .filter(Boolean);

  const post = await db.blogPost.update({
    where: { id },
    data: {
      title,
      content,
      excerpt,
      published,
      publishedAt: published ? new Date() : null,
      categories: {
        set: categoryIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return post;
}

export async function deleteBlogPost(session: Session, id: string) {
  requireRole(session, "admin");

  await db.blogPost.delete({
    where: { id },
  });

  revalidatePath("/blog");
  redirect("/blog");
}

export async function fetchBlogPosts(session: Session) {
  requireRole(session, "admin");

  const posts = db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true },
      },
      categories: true,
    },
  });

  return posts;
}

// Fetch published blog posts (for public view)
export async function fetchPublishedBlogPosts() {
  return db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: {
      author: {
        select: { name: true },
      },
      categories: true,
    },
  });
}

// Fetch a single blog post by ID
export async function fetchBlogPost(id: string) {
  return db.blogPost.findUnique({
    where: { id },
    include: {
      author: {
        select: { name: true },
      },
      categories: true,
    },
  });
}

// Fetch a single blog post by slug
export async function fetchBlogPostBySlug(slug: string) {
  return db.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: { name: true },
      },
      categories: true,
    },
  });
}

// Fetch a single blog post by id
export async function fetchBlogPostById(id: string) {
  return db.blogPost.findUnique({
    where: { id },
    include: {
      author: {
        select: { name: true },
      },
      categories: true,
    },
  });
}

// Fetch a single blog post by slug
export async function fetchBlogPostMetadataBySlug(slug: string) {
  return db.blogPost.findUnique({
    where: { slug: slug },
    select: { title: true, excerpt: true },
  });
}

// Fetch all categories
export async function fetchCategories() {
  return db.category.findMany({
    orderBy: { name: "asc" },
  });
}
