"use client";

import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2, Plus, Sparkles } from "lucide-react";
import BlogPostFilter from "@/components/admin/posts/BlogPostFilter";
import { BlogPostFilterDto } from "@/types/filter";
import { BlogPostList } from "@/components/admin/posts/BlogPostList";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BlogPostManagement() {
  const { user, loading } = useAuthContext();
  const [filters, setFilters] = useState<BlogPostFilterDto>({});
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#950101]" />
      </div>
    );
  }

  const handleCreateNew = () => {
    navigate("/admin/blogs/create");
  };

  if (!user || user?.role !== 2) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Quản lý <span className="text-[#950101]">Bài đăng</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 italic mt-1">
            Thiết kế nội dung và xu hướng làm đẹp mới nhất.
          </p>
        </div>

        {/* The New Premium Add Button */}
        <Button
          onClick={handleCreateNew}
          style={{
            background:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            border: "none",
          }}
          className="group relative h-14 px-8 rounded-2xl text-white shadow-2xl shadow-slate-200 hover:shadow-[#950101]/30 transition-all duration-500 overflow-hidden"
        >
          <div className="relative z-10 flex items-center gap-3">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            <span className="font-black uppercase tracking-[0.2em] text-[11px]">
              Tạo bài viết mới
            </span>
          </div>
          {/* Subtle shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Button>
      </div>

      <div className="mb-6">
        <BlogPostFilter filters={filters} onFilterChange={setFilters} />
      </div>

      <div>
        <BlogPostList filters={filters} />
      </div>
    </div>
  );
}
