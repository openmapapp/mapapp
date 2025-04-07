"use server";

import db from "@/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().optional(),
});

export async function addCategory(data: { name: string }) {
  try {
    const validated = categorySchema.parse(data);

    // Generate slug if not provided
    const slug =
      validated.slug ||
      validated.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    // Check for existing category with same slug
    const existingCategory = await db.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return {
        success: false,
        message: "A category with this name already exists",
      };
    }

    // Create new category
    const newCategory = await db.category.create({
      data: {
        name: validated.name,
        slug,
      },
    });

    revalidatePath("/admin/blog/categories");

    return {
      success: true,
      data: newCategory,
      message: "Category created successfully",
    };
  } catch (error: any) {
    console.error("Error creating blog category:", error);
    return {
      success: false,
      message: error.message || "Failed to create category",
    };
  }
}

export async function getBlogCategories() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return {
      success: true,
      data: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        postCount: cat._count.posts,
      })),
    };
  } catch (error: any) {
    console.error("Error fetching blog categories:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch categories",
      data: [],
    };
  }
}

export async function deleteCategory(id: number) {
  try {
    // Check if category has posts
    const category = await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!category) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    if (category._count.posts > 0) {
      return {
        success: false,
        message: "Cannot delete category with associated posts",
      };
    }

    // Delete category
    await db.category.delete({
      where: { id },
    });

    revalidatePath("/admin/blog/categories");

    return {
      success: true,
      message: "Category deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting blog category:", error);
    return {
      success: false,
      message: error.message || "Failed to delete category",
    };
  }
}
