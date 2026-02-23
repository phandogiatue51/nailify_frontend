import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogAPI } from "@/services/api";
import { Loader2, MessageCircle, Heart } from "lucide-react";
import { ReactionBadge } from "@/components/badge/ReactionBadge";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrls?: string[];
  createdAt: string;
  profileId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  totalReactions: number;
  totalComments: number;
  reactions?: Array<{
    type: number;
    reactorName: string;
  }>;
}

export const BlogListPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

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

  const handlePostClick = (postId: string) => {
    navigate(`/blog/detail/${postId}`);
  };

  // Get unique reaction types (max 3)
  const getUniqueReactions = (reactions?: Array<{ type: number }>) => {
    if (!reactions || reactions.length === 0) return [];
    const uniqueTypes = Array.from(new Set(reactions.map(r => r.type)));
    return uniqueTypes.slice(0, 3);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No blog posts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const uniqueReactions = getUniqueReactions(post.reactions);
        
        return (
          <div
            key={post.id}
            onClick={() => handlePostClick(post.id)}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:scale-[0.99] transition-transform cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handlePostClick(post.id);
              }
            }}
          >
            {/* Author info */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#FFCFE9] flex items-center justify-center">
                {post.authorAvatarUrl ? (
                  <img
                    src={post.authorAvatarUrl}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-[#950101]">
                    {post.authorName?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-sm">
                  {post.authorName || "Unknown"}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>

            {/* Content */}
            <h2 className="text-lg font-bold mb-2">{post.title}</h2>
            <p className="text-slate-600 text-sm mb-3">
              {post.content.substring(0, 100)}...
            </p>

            {/* Images */}
            {post.imageUrls && post.imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {post.imageUrls.slice(0, 3).map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`post-${index}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    {index === 2 &&
                      post.imageUrls &&
                      post.imageUrls.length > 3 && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            +{post.imageUrls.length - 3}
                          </span>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}

            {/* Reaction Badges and Counts */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              {/* Reaction badges */}
              <div className="flex items-center gap-1">
                {uniqueReactions.map((type, index) => (
                  <ReactionBadge key={index} type={type} />
                ))}
                {post.totalReactions > 0 && (
                  <span className="text-xs text-slate-600 ml-1">
                    {post.totalReactions}
                  </span>
                )}
              </div>

              {/* Comments count */}
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-600">
                  {post.totalComments}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};