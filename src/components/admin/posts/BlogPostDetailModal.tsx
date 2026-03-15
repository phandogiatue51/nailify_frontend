import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogAPI, commentAPI } from "@/services/api";
import { ArrowLeft, Loader2, Trash2, MessageCircle } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { BlogPostView } from "@/components/blogPost/BlogPostView";
import DateDisplay from "@/components/ui/date-display";
import { useToast } from "@/hooks/use-toast";
export const BlogPostDetailModal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    loadPost();
  }, [id]);
  const { toast } = useToast();
  const loadPost = async () => {
    try {
      const data = await blogAPI.getById(id!);
      setPost(data);
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to load post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setDeleting(true);
      var response = await blogAPI.deleteBlogPost(id!);
      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      navigate("/admin/blogs", {
        state: { message: "Xóa bài viết thành công" },
      });
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast({
        description: error?.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingCommentId(commentId);
    try {
      var response = await commentAPI.deleteComment(commentId);
      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast({
        description: error?.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setDeletingCommentId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Post not found</p>
        <button
          onClick={() => navigate("/admin/blogs")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Back to Blog List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/blogs")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-semibold">Thông tin bài viết</h1>

        {deleting ? (
          <div className="p-2 rounded-full">
            <Loader2 className="w-5 h-5 animate-spin text-red-600" />
          </div>
        ) : (
          <ConfirmationDialog
            onConfirm={handleDeletePost}
            title="Xóa bài viết"
            description="Bạn có muốn xóa bài viết này?"
            confirmText="Xóa bài viết"
            cancelText="Hủy"
            variant="destructive"
            trigger={
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            }
          />
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Post Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <BlogPostView post={post} />
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold">
              Số bình luận ({comments.length})
            </h2>
          </div>

          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Chưa có bình luận</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">
                          {comment.authorName || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500">
                          <DateDisplay
                            dateString={comment.createdAt}
                            label="Created At"
                            showTime
                          />
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>

                    <ConfirmationDialog
                      onConfirm={() => handleDeleteComment(comment.id)}
                      title="Xóa bình luận"
                      description="Bạn có muốn xóa bình luận này?"
                      confirmText="Xóa"
                      cancelText="Hủy"
                      variant="destructive"
                      trigger={
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          disabled={deletingCommentId === comment.id}
                        >
                          {deletingCommentId === comment.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
