import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogAPI, commentAPI, reactionAPI } from "@/services/api";
import { BlogPostView } from "@/components/blogPost/BlogPostForm";
import { MessageCircle, ArrowLeft, X, Loader2 } from "lucide-react";
import { ReactionBadge } from "@/components/badge/ReactionBadge";
import { BiSolidLike } from "react-icons/bi";
import { reactionOptions } from "./reactionOptions";

export const BlogPostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const reactionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPost();
    loadComments();
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

  const loadComments = async () => {
    try {
      const data = await commentAPI.getByPost(id!);
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load comments:", error);
      setComments([]);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const formData = new FormData();
      formData.append("content", newComment.trim());
      await commentAPI.createComment(id!, formData);
      setNewComment("");
      loadComments();
      setShowCommentBox(false);
    } catch (error) {
      alert("Failed to post comment");
    }
  };

  const handleReaction = async (type: number) => {
    try {
      await reactionAPI.togglePostReaction(id!, type);
      loadPost();
      setShowReactions(false);
    } catch (error) {
      console.error("Failed to react:", error);
    }
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
            className="w-full py-3 px-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <BiSolidLike className="w-5 h-5 text-blue-600" />
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
          onClick={() => setShowCommentBox(!showCommentBox)}
          className="w-full py-3 px-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <MessageCircle className="w-5 h-5 text-[#950101]" />
          Comment
        </button>
      </div>

      {/* Comment Box - Hidden until button clicked */}
      {showCommentBox && (
        <div className="mt-4 mb-6 animate-in slide-in-from-top-2 duration-300">
          <form onSubmit={handleComment} className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 pr-12 border rounded-xl focus:ring-2 focus:ring-[#E288F9]/20 focus:border-[#E288F9] transition-all"
              placeholder="Write a comment..."
              rows={3}
              autoFocus
            />
            <button
              onClick={() => setShowCommentBox(false)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-[#950101] text-white rounded-xl font-medium hover:bg-[#7a0101] transition-colors"
            >
              Post Comment
            </button>
          </form>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            comments.map((comment: any) => (
              <div key={comment.id} className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFCFE9] flex items-center justify-center overflow-hidden shrink-0">
                    {comment.authorAvatarUrl ? (
                      <img
                        src={comment.authorAvatarUrl}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-[#950101]">
                        {comment.authorName?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">
                        {comment.authorName}
                      </p>
                      <small className="text-xs text-slate-500 shrink-0">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "vi-VN",
                        )}
                      </small>
                    </div>
                    <p className="text-sm text-slate-700 mt-1">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
