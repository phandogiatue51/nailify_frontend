import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogAPI } from "@/services/api";
import { BlogPostForm } from "@/components/blogPost/BlogPostForm";

export const EditBlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const data = await blogAPI.getById(id!);
      setPost(data);
    } catch (error) {
      console.error("Failed to load post:", error);
      alert("Post not found");
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>

      <BlogPostForm
        mode="update"
        initialData={{
          id: post.id,
          title: post.title,
          content: post.content,
          imageUrls: post.imageUrls,
        }}
      />
    </div>
  );
};
