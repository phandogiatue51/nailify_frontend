// pages/blog/BlogListPage.tsx
import { useEffect, useState } from "react";
import { blogAPI, reactionAPI } from "@/services/api";
import { Loader2 } from "lucide-react";
import { BlogPostCard } from "@/components/blogPost/BlogPostCard";
import { BlogPost, ReactionType } from "@/types/database";
import { useAuth } from "@/hooks/use-auth";

export const BlogListPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadPosts = async () => {
    try {
      const data = await blogAPI.filter({});
      setPosts(data);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleReaction = async (postId: string, type: number) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const isRemoving = post.myReaction?.type === type;
        const prevTotal = post.totalReactions || 0;

        const tempMyReaction = isRemoving
          ? null
          : {
            id: `temp-${Date.now()}`,
            profileId: user?.userId || "",
            reactorName: user?.fullName || "You",
            reactorAvatarUrl: null,
            type: type as ReactionType,
            reactedAt: new Date().toISOString(),
          };

        let newTotal = prevTotal;
        if (isRemoving) {
          newTotal = Math.max(0, prevTotal - 1);
        } else if (!post.myReaction) {
          newTotal = prevTotal + 1;
        } else {
          newTotal = prevTotal;
        }

        return {
          ...post,
          myReaction: tempMyReaction,
          totalReactions: newTotal,
        };
      }),
    );

    try {
      const formData = new FormData();
      formData.append("type", type.toString());

      const response = await reactionAPI.togglePostReaction(postId, formData);

      if (response.data?.post) {
        setPosts((prev) => prev.map((p) =>
          p.id === postId ? response.data.post : p
        ));
      }
    } catch (error) {
      console.error("React failed", error);
      await loadPosts(); // Revert on error
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#950101]" />
      </div>
    );

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <BlogPostCard
          key={post.id}
          post={post}
          myReaction={post.myReaction}
          onReaction={handleReaction}
        />
      ))}
    </div>
  );
};
