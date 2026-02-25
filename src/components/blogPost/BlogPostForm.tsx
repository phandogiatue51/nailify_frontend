import React, { useState } from "react";
import { blogAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ConfirmationDialog } from "../ui/confirmation-dialog";
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

  const handleDelete = async () => {
    if (!initialData?.id) return;
    setLoading(true);
    try {
      const response = await blogAPI.deleteBlogPost(initialData.id);
      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      navigate("/blog/my-blog"); // redirect after delete
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
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* 1. Styled Inputs */}
      <div className="space-y-6">
        <div className="group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-[#950101] transition-colors">
            Tiêu đề bài viết
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-[#950101]/5 transition-all"
            placeholder="Đặt một cái tên thật ấn tượng..."
          />
        </div>

        <div className="group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-focus-within:text-[#950101] transition-colors">
            Câu chuyện của bạn
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-[2rem] p-6 h-48 text-slate-700 leading-relaxed placeholder:text-slate-300 focus:ring-2 focus:ring-[#950101]/5 transition-all resize-none"
            placeholder="Viết nội dung bài viết tại đây..."
            required
          />
        </div>
      </div>

      {/* 2. Visual Media Section */}
      <div className="space-y-4">
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Hình ảnh bộ sưu tập
        </label>

        <div className="relative group">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center bg-white group-hover:bg-slate-50 group-hover:border-[#FFCFE9] transition-all">
            <div className="w-12 h-12 rounded-full bg-[#FFCFE9]/30 flex items-center justify-center mb-3">
              <span className="text-[#950101] text-xl">+</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Thêm ảnh mới
            </p>
          </div>
        </div>

        {/* Combined Image Previews */}
        {(existingImages.length > 0 || images.length > 0) && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {/* Existing */}
            {existingImages.map((url, index) => (
              <div
                key={`existing-${index}`}
                className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100"
              >
                <img src={url} className="w-full h-full object-cover" alt="" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute top-1 right-1 bg-white/90 backdrop-blur-md text-red-500 rounded-full w-6 h-6 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>
            ))}
            {/* New */}
            {images.map((image, index) => (
              <div
                key={`new-${index}`}
                className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-[#FFCFE9]"
              >
                <img
                  src={URL.createObjectURL(image)}
                  className="w-full h-full object-cover"
                  alt=""
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 bg-white/90 backdrop-blur-md text-red-500 rounded-full w-6 h-6 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
                <div className="absolute bottom-1 left-1 bg-[#950101] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                  Mới
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Action Footer */}
      <div className="pt-10 border-t border-slate-100 space-y-6">
        {/* The Primary "Gold Standard" Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] text-white transition-all active:scale-[0.98] shadow-2xl shadow-[#950101]/30 disabled:grayscale disabled:opacity-50"
          style={{
            background:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #3D0101 100%)",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Đang xử lý...
            </span>
          ) : mode === "create" ? (
            "Tạo bài viết"
          ) : (
            "Lưu thay đổi"
          )}
        </button>

        {/* The Sophisticated "Destructive" Button */}
        {mode === "update" && (
          <div className="flex justify-center pt-2">
            <ConfirmationDialog
              onConfirm={handleDelete}
              title="Xác nhận xóa"
              description="Hành động này sẽ gỡ bỏ vĩnh viễn bài viết khỏi bộ sưu tập của bạn."
              confirmText="Xóa vĩnh viễn"
              cancelText="Quay lại"
              variant="destructive"
              trigger={
                <button
                  type="button"
                  className="w-full py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] text-white transition-all active:scale-[0.98] shadow-2xl shadow-[#950101]/30 disabled:grayscale disabled:opacity-50"
                >
                  <div className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-red-400 transition-colors" />
                  <span className="font-black text-md uppercase tracking-[0.25em] text-slate-400 group-hover:text-red-500">
                    Gỡ bỏ bài viết
                  </span>
                </button>
              }
            />
          </div>
        )}
      </div>
    </form>
  );
};
