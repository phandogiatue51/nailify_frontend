import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogAPI, reactionAPI } from "@/services/api";
import { Loader2, MessageCircle, Heart } from "lucide-react";
import { ReactionBadge } from "@/components/badge/ReactionBadge";
import { BlogPost } from "@/types/database";
import { reactionOptions } from "./reactionOptions";

export const BlogListPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReactionPost, setActiveReactionPost] = useState<string | null>(
    null,
  ); // Track which post's reaction popup is open
  const [myReactions, setMyReactions] = useState<Record<string, any>>({}); // Store user's reactions per post

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await blogAPI.filter({});
      setPosts(data);
      // Load user's reactions for all posts
      await loadAllMyReactions(data);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllMyReactions = async (postsData: BlogPost[]) => {
    try {
      const reactionPromises = postsData.map((post) =>
        reactionAPI.getByPostAuth(post.id).catch(() => null),
      );
      const reactions = await Promise.all(reactionPromises);

      const reactionMap: Record<string, any> = {};
      postsData.forEach((post, index) => {
        if (reactions[index]) {
          reactionMap[post.id] = reactions[index];
        }
      });
      setMyReactions(reactionMap);
    } catch (error) {
      console.error("Failed to load reactions:", error);
    }
  };

  const handleReaction = async (postId: string, type: number) => {
    try {
      const formData = new FormData();
      formData.append("type", type.toString());
      await reactionAPI.togglePostReaction(postId, formData);

      // Reload just this post's data
      const updatedPost = await blogAPI.getById(postId);
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postId ? updatedPost : p)),
      );

      // Reload user's reaction for this post
      const myReaction = await reactionAPI
        .getByPostAuth(postId)
        .catch(() => null);
      setMyReactions((prev) => ({
        ...prev,
        [postId]: myReaction,
      }));

      setActiveReactionPost(null);
    } catch (error) {
      console.error("Failed to react:", error);
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/blog/detail/${postId}`);
  };

  // Get unique reaction types (max 3)
  const getUniqueReactions = (reactions?: Array<{ type: number }>) => {
    if (!reactions || reactions.length === 0) return [];
    const uniqueTypes = Array.from(new Set(reactions.map((r) => r.type)));
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
        const myReaction = myReactions[post.id];

        return (
          <div
            key={post.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
          >
            {/* Clickable area for navigation (except reaction buttons) */}
            <div
              onClick={() => handlePostClick(post.id)}
              className="cursor-pointer active:scale-[0.99] transition-transform"
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
            </div>

            {/* Reaction and Comment Bar - Clickable separately */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              {/* Reaction badges with quick reaction button */}
              <div className="flex items-center gap-1">
                {uniqueReactions.map((type, index) => (
                  <ReactionBadge key={index} type={type} />
                ))}
                {post.totalReactions > 0 && (
                  <span className="text-xs text-slate-600 ml-1">
                    {post.totalReactions}
                  </span>
                )}

                {/* Quick reaction button */}
                <div className="relative ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Quick like or show popup?
                      if (myReaction) {
                        // If already reacted, clicking removes it
                        handleReaction(post.id, myReaction.type);
                      } else {
                        // If not reacted, show popup
                        setActiveReactionPost(
                          activeReactionPost === post.id ? null : post.id,
                        );
                      }
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {myReaction ? (
                      reactionOptions.find((r) => r.type === myReaction.type)
                        ?.icon || <Heart className="w-5 h-5" />
                    ) : (
                      <Heart className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Reaction Popup */}
                  {activeReactionPost === post.id && (
                    <div
                      className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50"
                      onMouseLeave={() => setActiveReactionPost(null)}
                    >
                      <div className="flex gap-1">
                        {reactionOptions.map((reaction) => (
                          <button
                            key={reaction.type}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReaction(post.id, reaction.type);
                            }}
                            className={`p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110 ${
                              myReaction?.type === reaction.type
                                ? "bg-gray-100 scale-110"
                                : ""
                            }`}
                            title={reaction.label}
                          >
                            {reaction.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments count */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/blog/detail/${post.id}`);
                }}
                className="flex items-center gap-1.5 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-600">
                  {post.totalComments}
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
