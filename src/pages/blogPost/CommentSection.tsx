import React, { useState, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { commentAPI } from "@/services/api";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorAvatarUrl: string | null;
}

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
  onCommentAdded?: () => void;
}

export const CommentSection = ({
  postId,
  initialComments = [],
  onCommentAdded,
}: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for open comment box event
    const handleOpenCommentBox = () => {
      setShowCommentBox(true);
    };

    window.addEventListener("openCommentBox", handleOpenCommentBox);
    return () =>
      window.removeEventListener("openCommentBox", handleOpenCommentBox);
  }, []);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const loadComments = async () => {
    try {
      const data = await commentAPI.getByPost(postId);
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", newComment.trim());
      await commentAPI.createComment(postId, formData);
      setNewComment("");
      await loadComments();
      setShowCommentBox(false);
      onCommentAdded?.();
    } catch (error) {
      alert("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="comment-section" className="space-y-10">
      {/* 1. Dynamic Comment Input */}
      {showCommentBox && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleComment} className="relative group">
            <textarea
              id="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-6 pb-16 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-[#950101]/5 text-slate-800 placeholder:text-slate-300 transition-all resize-none"
              rows={4}
              autoFocus
              disabled={loading}
            />

            <div className="absolute bottom-4 right-4 left-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowCommentBox(false)}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#950101] text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#950101]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {loading ? "Đang gửi ..." : "Bình luận"}
                {!loading && <Send size={12} />}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Comments List */}
      <div className="space-y-8">
        {comments.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
            <MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
              Chưa có bình luận nào
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {comments.map((comment) => (
              <div key={comment.id} className="py-4 first:pt-0">
                <div className="flex items-center gap-4">
                  {/* Avatar with Boutique Border */}
                  <div className="w-10 h-10 rounded-full bg-[#FFCFE9]/30 border border-[#FFCFE9]/50 flex items-center justify-center overflow-hidden shrink-0">
                    {comment.authorAvatarUrl ? (
                      <img
                        src={comment.authorAvatarUrl}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <div className="w-full h-full object-cover bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                        <span className="text-2xl font-bold text-white uppercase">
                          {comment.authorAvatarUrl?.[0] || "U"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-2 text-md">
                      <h4 className="font-black text-slate-900 tracking-tight">
                        {comment.authorName}
                      </h4>
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "vi-VN",
                        )}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
