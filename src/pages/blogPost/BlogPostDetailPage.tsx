import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogAPI, reactionAPI } from "@/services/api";
import { BlogPostView } from "@/components/blogPost/BlogPostView";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { ReactionBadge } from "@/components/badge/ReactionBadge";
import { BiSolidLike } from "react-icons/bi";
import { getReactionTextColor, reactionOptions } from "./reactionOptions";
import { CommentSection } from "./CommentSection";
import { cn } from "@/lib/utils";

export const BlogPostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReactions, setShowReactions] = useState(false);
  const [myReaction, setMyReaction] = useState<any>(null);

  const reactionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPost();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reactionRef.current &&
        !reactionRef.current.contains(event.target as Node)
      ) {
        setShowReactions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadPost = async () => {
    try {
      const data = await blogAPI.getById(id!);
      setPost(data);
      await loadMyReaction();
    } catch (error) {
      console.error("Failed to load post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type: number) => {
    try {
      const formData = new FormData();
      formData.append("type", type.toString());
      await reactionAPI.togglePostReaction(id!, formData);
      loadPost();
      setShowReactions(false);
    } catch (error) {
      console.error("Failed to react:", error);
    }
  };

  const loadMyReaction = async () => {
    try {
      const reaction = await reactionAPI.getByPostAuth(id!);

      setMyReaction(reaction);
    } catch (error) {
      setMyReaction(null);
    }
  };

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

  if (!post) return <div className="p-4">Post not found</div>;

  const uniqueReactions = getUniqueReactions(post.reactions);
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Boutique Sticky Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-50 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-[#950101] hover:bg-slate-50 rounded-full transition-all active:scale-90"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Bài viết</span>
          <div className="h-0.5 w-4 bg-[#950101] mt-1" />
        </div>
        <div className="w-10" /> {/* Symmetry Spacer */}
      </nav>

      <div className="max-w-2xl mx-auto px-6">
        {/* 2. Main Content View */}
        <BlogPostView post={post} />

        {/* 3. Interaction Stats Bar */}
        <div className="flex items-center justify-between mt-4 py-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {uniqueReactions.map((type, index) => (
                <div key={index} className="ring-4 ring-white rounded-full">
                  <ReactionBadge type={type} />
                </div>
              ))}
            </div>
            {post.totalReactions > 0 && (
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {post.totalReactions} cảm xúc
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
            <MessageCircle size={12} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {post.totalComments || 0} bình luận
            </span>
          </div>
        </div>

        {/* 4. Luxury Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Like Button & Glass-morphism Picker */}
          <div className="relative" ref={reactionRef}>
            <button
              onClick={() => {
                const reactionTypeToSend = myReaction ? myReaction.type : 0;
                handleReaction(reactionTypeToSend);
              }}
              onMouseEnter={() => setShowReactions(true)}
              className={cn(
                "w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-sm",
                myReaction
                  ? `${getReactionTextColor(myReaction.type)}` // Active state with colored text
                  : "text-gray-500" // Inactive state
              )}
            >
              {myReaction ? (
                reactionOptions.find((r) => r.type === myReaction.type)?.icon
              ) : (
                <BiSolidLike className="w-5 h-5" />
              )}
              {myReaction
                ? reactionOptions.find((r) => r.type === myReaction.type)?.label
                : "React"}
            </button>

            {showReactions && (
              <div className="absolute bottom-full left-0 mb-4 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-white flex gap-2 animate-in fade-in slide-in-from-bottom-3 z-50">
                {reactionOptions.map((reaction) => (
                  <button
                    key={reaction.type}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReaction(reaction.type);
                    }}
                    className={cn(
                      "p-3 rounded-full transition-all hover:scale-150 duration-300 origin-bottom",
                      myReaction?.type === reaction.type ? "bg-white shadow-md" : "hover:bg-white/50"
                    )}
                  >
                    <span className="text-2xl">{reaction.icon}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Comment Button */}
          <button
            onClick={() => {
              const commentSection = document.getElementById("comment-section");
              if (commentSection) {
                commentSection.scrollIntoView({ behavior: "smooth" });
                const event = new CustomEvent("openCommentBox");
                window.dispatchEvent(event);
              }
            }}
            className="w-full py-5 bg-slate-50 text-slate-400 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-5 h-5" />
            Bình luận
          </button>
        </div>

        {/* 5. Discussion Section */}
        <div id="comment-section" className="pt-4 border-t-4 border-slate-50">
          <CommentSection
            postId={id!}
            initialComments={post.comments}
            onCommentAdded={loadPost}
          />
        </div>
      </div>
    </div>
  );
}