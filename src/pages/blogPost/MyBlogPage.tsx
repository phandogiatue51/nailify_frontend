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
    <div className="min-h-screen bg-white px-4 sm:px-6">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md py-6 flex items-center justify-between border-b border-slate-50">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-[#950101] hover:bg-[#FFCFE9]/20 rounded-full transition-all active:scale-90"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Collection</span>
          <div className="h-0.5 w-6 bg-[#950101] mt-1" />
        </div>

        <div className="w-10" /> {/* Symmetry Spacer */}
      </header>

      {/* 2. Hero Action Section */}
      <div className="mb-4 flex justify-center">
        <Button
          onClick={() => navigate(`/blog/create/`)}
          className="group relative overflow-hidden font-black tracking-[0.1em] uppercase text-sm rounded-[1.5rem] w-1/2 max-w-md h-14 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#950101]/20 border-none"
          style={{
            background: "linear-gradient(135deg, #950101 0%, #D81B60 50%, #3D0101 100%)",
          }}
        >
          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative flex items-center gap-2">
            Create a Post
            <div className="h-1 w-1 rounded-full bg-[#FFCFE9]" />
          </span>
        </Button>
      </div>

      {/* 3. Post Collection */}
      <div className="max-w-2xl mx-auto space-y-16">
        {posts.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
              Your journal is empty
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <BlogPostCard
                post={post}
                myReaction={post.myReaction}
                onReaction={handleReaction}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}