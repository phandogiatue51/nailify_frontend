import { BlogPostForm } from "@/components/blogPost/BlogPostForm";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const CreateBlogPostPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Editorial Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-50 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-[#950101] hover:bg-slate-50 rounded-full transition-all active:scale-90"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">New Entry</span>
          <div className="h-0.5 w-4 bg-[#950101] mt-1" />
        </div>
        <div className="w-10" />
      </nav>

      <div className="max-w-2xl mx-auto px-6">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight uppercase italic">
            Create <span className="not-italic">Story</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
            Share your latest inspiration with the collection
          </p>
        </header>

        <BlogPostForm mode="create" />
      </div>
    </div>
  );
};