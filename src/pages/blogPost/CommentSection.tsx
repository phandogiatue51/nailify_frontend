import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
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
    onCommentAdded
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

        window.addEventListener('openCommentBox', handleOpenCommentBox);
        return () => window.removeEventListener('openCommentBox', handleOpenCommentBox);
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
        <div id="comment-section" className="mt-8">
            {/* Comment Box - Show on top */}
            {showCommentBox && (
                <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
                    <form onSubmit={handleComment} className="relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-3 pr-12 border rounded-xl focus:ring-2 focus:ring-[#E288F9]/20 focus:border-[#E288F9] transition-all"
                            placeholder="Write a comment..."
                            rows={3}
                            autoFocus
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCommentBox(false)}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 px-4 py-2 bg-[#950101] text-white rounded-xl font-medium hover:bg-[#7a0101] transition-colors disabled:bg-gray-400"
                        >
                            {loading ? "Posting..." : "Post Comment"}
                        </button>
                    </form>
                </div>
            )}

            {/* Comments List */}
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
                    comments.map((comment) => (
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
                                            {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
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
    );
};