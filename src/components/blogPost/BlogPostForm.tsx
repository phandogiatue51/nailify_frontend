import React, { useState } from "react";
import { blogAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
interface BlogPostFormProps {
  mode: "create" | "update";
  initialData?: {
    id?: string;
    title?: string;
    content?: string;
    imageUrls?: string[];
  };
  onSuccess?: () => void;
}

export const BlogPostForm: React.FC<BlogPostFormProps> = ({
  mode,
  initialData,
  onSuccess,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.imageUrls || [],
  );
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeExistingImage = (url: string) => {
    setExistingImages(existingImages.filter((img) => img !== url));
    setImagesToRemove([...imagesToRemove, url]);
  };

  const removeNewImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Content", content);

      // Append new images
      images.forEach((image) => {
        formData.append("imageFiles", image);
      });

      // For update mode, append images to remove
      if (mode === "update" && imagesToRemove.length > 0) {
        imagesToRemove.forEach((url) => {
          formData.append("RemoveImageUrls", url);
        });
      }

      let response;
      if (mode === "create") {
        response = await blogAPI.createBlogPost(formData);
        toast({
          description: response.message,
          variant: "success",
          duration: 3000,
        });
        navigate(`/blog/detail/${response.id}`);
      } else {
        response = await blogAPI.updateBlogPost(initialData?.id!, formData);
        toast({
          description: response.message,
          variant: "success",
          duration: 3000,
        });
        navigate(`/blog/detail/${initialData?.id}`);
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Tiêu đề</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Nội dung</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded h-32"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Hình ảnh</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Existing images (update mode) */}
      {existingImages.length > 0 && (
        <div>
          <p className="mb-2">Ảnh hiện tại:</p>
          <div className="flex gap-2 flex-wrap">
            {existingImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New images preview */}
      {images.length > 0 && (
        <div>
          <p className="mb-2">Ảnh mới:</p>
          <div className="flex gap-2 flex-wrap">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading
          ? "Đang xử lý..."
          : mode === "create"
            ? "Tạo bài viết"
            : "Cập nhật"}
      </button>
    </form>
  );
};

// Simple view component
export const BlogPostView: React.FC<{ post: any }> = ({ post }) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#FFCFE9] flex items-center justify-center">
          {post.authorAvatarUrl ? (
            <img
              src={post.authorAvatarUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-[#950101]">
              {post.authorName?.charAt(0) || "U"}
            </span>
          )}
        </div>
        <div>
          <p className="font-medium text-md">
            {post.authorName || "Unknown"}
          </p>
          <p className="text-xs text-slate-500">
            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="mb-4">{post.content}</p>

      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {post.imageUrls.map((url: string, index: number) => (
            <img
              key={index}
              src={url}
              alt={`blog-${index}`}
              className="w-32 h-32 object-cover rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
};
