// components/blog/BlogPostCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Heart } from "lucide-react";
import { ReactionBadge } from "@/components/badge/ReactionBadge";
import {
  getReactionTextColor,
  reactionOptions,
} from "@/pages/blogPost/reactionOptions";
import { BlogPost } from "@/types/database";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { BiSolidLike } from "react-icons/bi";
import { cn } from "@/lib/utils";
import { RoleBadge } from "../badge/RoleBadge";
interface BlogPostCardProps {
  post: BlogPost;
  myReaction?: any;
  onReaction?: (postId: string, type: number) => void;
}

export const BlogPostCard = ({
  post,
  myReaction,
  onReaction,
}: BlogPostCardProps) => {
  const navigate = useNavigate();
  const [showReactions, setShowReactions] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 2;
  const handlePostClick = () => {
    if (isAdmin) {
      navigate(`/admin/blogs/${post.id}`);
    } else {
      navigate(`/blog/detail/${post.id}`);
    }
  };

  const handleClick = () => {
    if (post.shopId) {
      navigate(`/shop/${post.shopId}`);
    } else if (post.nailArtistId) {
      navigate(`/artist/${post.nailArtistId}`);
    }
  };

  const getUniqueReactions = (reactions?: Array<{ type: number }>) => {
    if (!reactions || reactions.length === 0) return [];
    const uniqueTypes = Array.from(new Set(reactions.map((r) => r.type)));
    return uniqueTypes.slice(0, 3);
  };

  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 transition-all active:scale-[0.99] overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFCFE9]/50 flex items-center justify-center border border-[#FFCFE9]">
            {post.authorAvatarUrl ? (
              <img
                src={post.authorAvatarUrl}
                className="w-full h-full rounded-full object-cover"
                alt=""
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                <span className="text-2xl font-bold text-white uppercase">
                  {post.authorName?.[0] || "U"}
                </span>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4
                onClick={handleClick}
                className="text-sm font-black text-slate-900 leading-none cursor-pointer hover:text-[#950101] transition-colors"
              >
                {post.authorName}
              </h4>
              <RoleBadge role={post.role} />
            </div>

            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
              {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>  
        </div>

        {post.profileId === user?.userId && (
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              if (isAdmin) {
                navigate(`/admin/blogs/edit/${post.id}`);
              } else {
                navigate(`/blog/edit/${post.id}`);
              }
            }}
            className="h-8 rounded-full bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-[#FFCFE9]/20 hover:text-[#950101]"
          >
            Chỉnh sửa
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div onClick={handlePostClick} className="cursor-pointer">
        <h2 className="text-lg font-black text-slate-900 leading-tight mb-2 tracking-tight">
          {post.title}
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {post.content}
        </p>

        {/* Premium Image Grid */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {post.imageUrls.slice(0, 3).map((url, index) => (
              <div
                key={index}
                className="aspect-square relative group overflow-hidden rounded-2xl"
              >
                <img
                  src={url}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  alt=""
                />
                {index === 2 && post.imageUrls.length > 3 && (
                  <div className="absolute inset-0 bg-[#950101]/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-black text-xs">
                      +{post.imageUrls.length - 3}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interaction Stats */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {getUniqueReactions(post.reactions).map((type, i) => (
            <div key={i} className="ring-2 ring-white rounded-full">
              <ReactionBadge type={type} />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();

              if (myReaction) {
                onReaction(post.id, myReaction.type);
              } else {
                setShowReactions(!showReactions);
              }
            }}
            className={cn(
              "w-full py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest",
              myReaction
                ? `${getReactionTextColor(myReaction.type)} bg-[#FFCFE9]/40 scale-[1.02]`
                : "bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-95",
            )}
          >
            {myReaction ? (
              reactionOptions.find((r) => r.type === myReaction.type)?.icon || (
                <BiSolidLike className="w-5 h-5" />
              )
            ) : (
              <BiSolidLike className="w-5 h-5" />
            )}

            {myReaction
              ? reactionOptions.find((r) => r.type === myReaction.type)?.label
              : "Thích"}
          </button>

          {showReactions && (
            <div
              className="absolute bottom-full left-0 mb-3 p-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-2xl border border-white flex gap-1 animate-in fade-in slide-in-from-bottom-2"
              onMouseLeave={() => setShowReactions(false)}
            >
              {reactionOptions.map((r) => (
                <button
                  key={r.type}
                  onClick={() => onReaction(post.id, r.type)}
                  className="p-2 hover:scale-125 transition-transform origin-bottom"
                >
                  {r.icon}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handlePostClick}
          className="w-full py-3 rounded-2xl bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
        >
          <MessageCircle size={16} />
          Bình luận
        </button>
      </div>
    </div>
  );
};
