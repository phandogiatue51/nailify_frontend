"use client";

import { useState } from "react";
import BlogPostFilter from "@/components/admin/posts/BlogPostFilter";
import { BlogPostFilterDto } from "@/types/filter";
import { BlogPostList } from "@/components/admin/posts/BlogPostList";
export default function BlogPostManagement() {
  const [filters, setFilters] = useState<BlogPostFilterDto>({});

  const handleFilterChange = (newFilters: BlogPostFilterDto) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý bài đăng</h1>
          <p className="text-muted-foreground">Quản lý các bài đăng trên diễn đàn</p>
        </div>
        <div className="text-sm text-muted-foreground">Nailify Dashboard</div>
      </div>
      <BlogPostFilter filters={filters} onFilterChange={handleFilterChange} />

      <div className="mt-6">
        <BlogPostList filters={filters} />
      </div>
    </div>
  );
}
