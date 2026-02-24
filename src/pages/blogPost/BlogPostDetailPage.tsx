import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogAPI, reactionAPI } from "@/services/api";
import { BlogPostView } from "@/components/blogPost/BlogPostForm";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { ReactionBadge } from "@/components/badge/ReactionBadge";
import { BiSolidLike } from "react-icons/bi";
import { reactionOptions } from "./reactionOptions";
import { CommentSection } from "./CommentSection";

export const BlogPostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReactions, setShowReactions] = useState(false);

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
    } catch (error) {
      console.error("Failed to load post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type: number) => {
    try {
      await reactionAPI.togglePostReaction(id!, type);
      console.log("Reaction:", type);
      loadPost();
      setShowReactions(false);
    } catch (error) {
      console.error("Failed to react:", error);
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
    <div className="max-w-3xl mx-auto p-4 pb-24">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-[#950101]"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <BlogPostView post={post} />

      {/* Reactions and Comments Stats */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
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

        <div className="flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-600">
            {post.totalComments || 0}
          </span>
        </div>
      </div>

      {/* Two Column Action Buttons */}
      <div className="grid grid-cols-2 gap-3 my-4">
        {/* Like Button with Reaction Popup */}
        <div className="relative" ref={reactionRef}>
          <button
            onClick={() => handleReaction(0)}
            onMouseEnter={() => setShowReactions(true)}
            className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <BiSolidLike className="w-5 h-5" />
            Like
          </button>

          {/* Reaction Popup */}
          {showReactions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
              <div className="flex gap-1">
                {reactionOptions.map((reaction) => (
                  <button
                    key={reaction.type}
                    onClick={() => handleReaction(reaction.type)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110"
                    title={reaction.label}
                  >
                    {reaction.icon}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comment Button */}
        <button
          onClick={() => {
            const commentSection = document.getElementById('comment-section');
            if (commentSection) {
              commentSection.scrollIntoView({ behavior: 'smooth' });
              // Trigger comment box in CommentSection
              const event = new CustomEvent('openCommentBox');
              window.dispatchEvent(event);
            }
          }}
          className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <MessageCircle className="w-5 h-5" />
          Comment
        </button>
      </div>

      <CommentSection
        postId={id!}
        initialComments={post.comments}
        onCommentAdded={loadPost}
      />
    </div>
  );
};