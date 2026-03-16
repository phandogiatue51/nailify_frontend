import { useState, useEffect } from "react";
import { BlogPost } from "@/types/database";
import { BlogPostFilterDto } from "@/types/filter";
import { blogAPI } from "@/services/api";
import { BlogPostCard } from "@/components/blogPost/BlogPostCard";
import { PaginationWrapper } from "@/components/ui/PaginationWrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
interface BlogPostListProps {
  filters: BlogPostFilterDto;
  onReaction?: (postId: string, reaction: string) => void;
}

export const BlogPostList = ({ filters }: BlogPostListProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const loadPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await blogAPI.filter(filters);
      setPosts(data);
    } catch (err) {
      setError("Failed to load blog posts");
      console.error("Error loading blog posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    setPage(1);
  }, [filters]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={loadPosts}
            className="ml-4"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <AlertCircle className="w-12 h-12 mx-auto text-slate-300" />
        <div className="space-y-1">
          <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Chưa có bài viết nào</h3>
          <p className="text-sm font-medium text-slate-400">
            {Object.keys(filters).length > 0
              ? "Không tìm thấy cảm hứng phù hợp với tiêu chí của bạn."
              : "Những xu hướng làm đẹp mới nhất sẽ sớm được cập nhật."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PaginationWrapper
        items={posts}
        currentPage={page}
        pageSize={9}
        onPageChange={setPage}
        renderItem={(post) => (
          <div className="relative group">
            <BlogPostCard key={post.id} post={post} />
          </div>
        )}
      />
    </div>
  );
};

export default BlogPostList;
