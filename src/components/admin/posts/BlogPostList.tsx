import { useState, useEffect } from "react";
import { BlogPost } from "@/types/database";
import { BlogPostFilterDto } from "@/types/filter";
import { blogAPI } from "@/services/api";
import { BlogPostCard } from "@/components/blogPost/BlogPostCard";
import { PaginationWrapper } from "@/components/ui/PaginationWrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface BlogPostListProps {
  filters: BlogPostFilterDto;
  onReaction?: (postId: string, reaction: string) => void;
}

export const BlogPostList = ({ filters }: BlogPostListProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
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

  const handleCreateNew = () => {
    navigate("/admin/blogs/create");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading blog posts...</p>
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
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-medium">No blog posts found</h3>
          <p className="text-muted-foreground mt-1">
            {Object.keys(filters).length > 0
              ? "Try adjusting your filters"
              : "No blog posts available yet"}
          </p>
          <Button onClick={handleCreateNew} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Create First Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

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
