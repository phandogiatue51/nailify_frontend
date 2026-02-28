import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogAPI } from "@/services/api";
import { BlogPostForm } from "@/components/blogPost/BlogPostForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
export const EditBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const data = await blogAPI.getById(id!);
      setPost(data);
    } catch (error) {
      console.error("Failed to load post:", error);
      navigate("/admin/blogs");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#950101]" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Retrieving Post
        </p>
      </div>
    );

  return (
    <div className="bg-white">
      {/* Editorial Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-50 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-[#950101] hover:bg-slate-50 rounded-full transition-all active:scale-90"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Editor
          </span>
          <div className="h-0.5 w-4 bg-[#950101] mt-1" />
        </div>
        <div className="w-10" />
      </nav>

      <div className="max-w-2xl mx-auto px-6">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight uppercase">
            Edit <span className="italic font-serif">Journal</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
            Refining the details of your masterpiece
          </p>
        </header>

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
    </div>
  );
};
