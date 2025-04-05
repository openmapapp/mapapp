"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Edit, Trash, Eye, Globe, EyeOff } from "lucide-react";
import { deleteBlogPost, updateBlogPostStatus } from "@/actions/blog";
import type { Session } from "@/app/lib/auth-client";

interface Author {
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  author: Author;
  categories: Category[];
}

interface BlogPostListProps {
  posts: BlogPost[];
  session: Session;
}

export default function BlogPostList({
  posts: initialPosts,
  session,
}: BlogPostListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      await deleteBlogPost(session, postToDelete.id);
      // Remove the deleted post from the state
      setPosts(posts.filter((post) => post.id !== postToDelete.id));
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const togglePublicationStatus = async (post: BlogPost) => {
    setIsUpdatingStatus(post.id);

    try {
      const updatedPost = await updateBlogPostStatus(
        session,
        post.id,
        !post.published
      );

      // Update the post in the local state
      setPosts(
        posts.map((p) =>
          p.id === post.id
            ? {
                ...p,
                published: !p.published,
                publishedAt: !p.published ? new Date() : p.publishedAt,
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error updating post status:", error);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No blog posts found. Create your first post!
          </p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-muted-foreground">
                      By {post.author.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.published && post.publishedAt
                      ? formatDate(post.publishedAt)
                      : formatDate(post.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.categories.map((category) => (
                        <span
                          key={category.id}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {category.name}
                        </span>
                      ))}
                      {post.categories.length === 0 && (
                        <span className="text-muted-foreground text-xs">
                          None
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={isUpdatingStatus === post.id}
                        >
                          <span className="sr-only">Open menu</span>
                          {isUpdatingStatus === post.id ? (
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="flex items-center"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/blog/edit/${post.id}`}
                            className="flex items-center"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => togglePublicationStatus(post)}
                        >
                          {post.published ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              <span>Unpublish</span>
                            </>
                          ) : (
                            <>
                              <Globe className="mr-2 h-4 w-4" />
                              <span>Publish</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(post)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this post?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post &quot;{postToDelete?.title}&quot;.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
