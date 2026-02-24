// pages/blog/MyBlogPage.tsx
import { useEffect, useState } from "react";
import { blogAPI, reactionAPI } from "@/services/api";
import { ChevronLeft, Loader2 } from "lucide-react";
import { BlogPostCard } from "@/components/blogPost/BlogPostCard";
import { BlogPost, ReactionType } from "@/types/database";
import { useAuth } from "@/hooks/use-auth";
import { BlogPostFilterDto } from "@/types/filter";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export const MyBlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isShop = user?.shopId;
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      const filterParams: BlogPostFilterDto = {};
      if (isShop) {
        filterParams.ShopId = user?.shopId;
      } else {
        filterParams.NailArtistId = user?.nailArtistId;
      }

      const data = await blogAPI.filter(filterParams);
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
      await reactionAPI.togglePostReaction(postId, formData);

      // 2. SYNC WITH SERVER: Get the official data
      const updatedPost = await blogAPI.getById(postId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? updatedPost : p)));
    } catch (error) {
      console.error("React failed", error);
      // 3. REVERT ON ERROR: Reload posts
      await loadPosts();
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
      <button
        onClick={() => navigate(-1)}
        className="p-2 hover:bg-[#FFCFE9]/30 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-[#950101]" />
      </button>
      <Button
        onClick={() => navigate(`/blog/create/`)}
        className="font-black tracking-tight uppercase text-lg rounded-[2rem] w-1/2 h-12 mt-4 text-center"
        style={{
          background:
            "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
          border: "none",
        }}
      >
        Create a Post
      </Button>

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
