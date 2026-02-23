import { BlogPostForm } from "@/components/blogPost/BlogPostForm";

export const CreateBlogPostPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>

      <BlogPostForm mode="create" />
    </div>
  );
};
