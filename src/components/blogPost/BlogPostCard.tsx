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
interface BlogPostCardProps {
  post: BlogPost;
  myReaction?: any;
  onReaction: (postId: string, type: number) => void;
}

export const BlogPostCard = ({
  post,
  myReaction,
  onReaction,
}: BlogPostCardProps) => {
  const navigate = useNavigate();
  const [showReactions, setShowReactions] = useState(false);
  const { user } = useAuth();
  const handlePostClick = () => {
    navigate(`/blog/detail/${post.id}`);
  };

  const getUniqueReactions = (reactions?: Array<{ type: number }>) => {
    if (!reactions || reactions.length === 0) return [];
    const uniqueTypes = Array.from(new Set(reactions.map((r) => r.type)));
    return uniqueTypes.slice(0, 3);
  };

  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 transition-all active:scale-[0.99]">
      {/* Header: Author & Edit */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFCFE9]/50 flex items-center justify-center border border-[#FFCFE9]">
            {post.authorAvatarUrl ? (
              <img
                src={post.authorAvatarUrl}
                className="w-full h-full rounded-2xl object-cover"
                alt=""
              />
            ) : (
              <span className="text-sm font-black text-[#950101]">
                {post.authorName?.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 leading-none mb-1">
              {post.authorName}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {new Date(post.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {post.profileId === user?.userId && (
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/blog/edit/${post.id}`);
            }}
            className="h-8 rounded-full bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-[#FFCFE9]/20 hover:text-[#950101]"
          >
            Edit
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
      <div className="flex items-center justify-between py-3 border-t border-slate-100">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {getUniqueReactions(post.reactions).map((type, i) => (
              <div key={i} className="ring-2 ring-white rounded-full">
                <ReactionBadge type={type} />
              </div>
            ))}
          </div>
          {post.totalReactions > 0 && (
            <span className="ml-3 text-[10px] font-black text-slate-400 tracking-widest uppercase">
              {post.totalReactions} Reactions
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-50">
          <MessageCircle size={14} className="text-slate-900" />
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
            {post.totalComments || 0}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2">
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
              : "Like"}
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
          Comment
        </button>
      </div>
    </div>
  );
};
