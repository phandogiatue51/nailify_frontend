import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock, Loader2, Upload, X } from "lucide-react";
import { ComponentType, ServiceItem } from "@/types/database";
import { number } from "zod";

interface ServiceItemFormProps {
  componentType: ComponentType;
  initialData?: Partial<ServiceItem>;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

const ServiceItemForm: React.FC<ServiceItemFormProps> = ({
  componentType,
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [price, setPrice] = useState(initialData?.price?.toString() || "");

  const [estimatedDuration, setEstimatedDuration] = useState(
    initialData?.estimatedDuration?.toString() || "",
  );
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [hasExistingImage, setHasExistingImage] = useState(
    !!initialData?.imageUrl,
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData?.imageUrl) {
      setImageUrl(initialData.imageUrl);
      setHasExistingImage(true);
    } else {
      setImageUrl("");
      setHasExistingImage(false);
    }
  }, [initialData]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setHasExistingImage(false);

      const previewUrl = URL.createObjectURL(selectedFile);
      setImageUrl(previewUrl);
    }
  };

  const removeImage = () => {
    setFile(null);
    setImageUrl("");
    setHasExistingImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();

    // Use exact field names your backend expects
    formData.append("Name", name);
    formData.append("Description", description || "");
    formData.append("Price", price);
    formData.append("ComponentType", componentType.toString());
    formData.append("EstimatedDuration", estimatedDuration);

    // Use "imageFile" as field name (matching your backend)
    if (file) {
      formData.append("imageFile", file); // Field name must be "imageFile"
    }

    try {
      await onSubmit(formData);

      if (!initialData) {
        setName("");
        setDescription("");
        setEstimatedDuration("");
        setPrice("");
        setFile(null);
        setImageUrl("");
        setHasExistingImage(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setUploading(false);
    }
  };

  const typeLabels: Record<ComponentType, string> = {
    0: "Lớp Nền",
    1: "Tạo Dáng",
    2: "Sơn Bóng",
    3: "Trang Trí",
    4: "Đính Đá",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-4">
      {/* Identification Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            {typeLabels[componentType]} *
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-none bg-slate-50 rounded-2xl h-12 focus-visible:ring-[#950101] shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            Mô tả
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="border-none bg-slate-50 rounded-2xl focus-visible:ring-[#950101] shadow-sm resize-none"
          />
        </div>
      </div>

      {/* Metrics Section: Duration & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="estimatedDuration"
            className="text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            Thời gian dự kiến
          </Label>
          <div className="relative">
            <Input
              id="estimatedDuration"
              type="number"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              className="border-none bg-slate-50 rounded-2xl h-12 pl-10 focus-visible:ring-[#950101] shadow-sm"
            />
            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="price"
            className="text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            Giá tiền *
          </Label>
          <div className="relative">
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              required
              className="border-none bg-slate-50 rounded-2xl h-12 pr-12 focus-visible:ring-[#950101] shadow-sm font-bold text-[#950101]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">
              đ
            </span>
          </div>
        </div>
      </div>

      {/* Visual Section */}
      <div className="space-y-2">
    
        <div className="relative group overflow-hidden rounded-[1.5rem] border-2 border-dashed border-slate-200 hover:border-[#E288F9] transition-all bg-slate-50 aspect-video">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md text-red-500 rounded-xl shadow-lg active:scale-90 transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Upload className="w-5 h-5 text-[#950101]" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Tải ảnh lên
              </p>
            </div>
          )}
          <input
            id="image"
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={uploading}
            ref={fileInputRef}
          />
        </div>
      </div>

      {/* Action Button */}
      <Button
        type="submit"
        disabled={isLoading || uploading || !name || !price}
        className="w-full h-14 uppercase rounded-2xl bg-gradient-to-r from-[#950101] via-[#D81B60] to-[#E288F9] hover:opacity-90 shadow-xl shadow-pink-100 text-lg text-white font-black transition-all active:scale-[0.98] mt-4"
      >
        {isLoading || uploading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {initialData ? "Cập nhật" : "Thêm"} {typeLabels[componentType]}
          </>
        )}
      </Button>
    </form>
  );
};

export default ServiceItemForm;
