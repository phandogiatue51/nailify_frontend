import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Loader2, Sparkles, Upload, X } from "lucide-react";
import { Collection, ComponentType, ServiceItem } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { ComponentBadge } from "../badge/ComponentBadge";
import { Separator } from "@/components/ui/separator";
import { TagSelector } from "../ui/TagSelector";
import { cn } from "@/lib/utils";

interface CollectionFormProps {
  serviceItems: ServiceItem[];
  initialData?: Partial<Collection>;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

const CollectionForm: React.FC<CollectionFormProps> = ({
  serviceItems,
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [selectedItems, setSelectedItems] = useState<string[]>(
    initialData?.items?.map((i) => i.serviceItemId) || [],
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    initialData?.estimatedDuration?.toString() || "",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags?.map((t) => t.id) || [],
  );

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();

    // Use capitalized field names to match backend
    formData.append("Name", name);
    formData.append("Description", description || "");
    formData.append("EstimatedDuration", estimatedDuration || ""); // Default 60 minutes, add input for this

    // Add image file - field name must be "imageFile"
    if (imageFile) {
      formData.append("imageFile", imageFile); // Changed from "image" to "imageFile"
    }

    // Add selected item IDs - use ServiceItemIds (plural) as field name
    selectedItems.forEach((itemId) => {
      formData.append("ServiceItemIds", itemId); // Multiple entries with same key
    });

    selectedTagIds.forEach((tagId) => {
      formData.append("TagIds", tagId);
    });

    try {
      await onSubmit(formData);

      // Reset image file after successful submission
      if (imageFile) {
        setImageFile(null);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Group items by type
  const groupedItems = serviceItems.reduce(
    (acc, item) => {
      if (!acc[item.componentType]) {
        acc[item.componentType] = [];
      }
      acc[item.componentType].push(item);
      return acc;
    },
    {} as Record<ComponentType, ServiceItem[]>,
  );

  const totalPrice = serviceItems
    .filter((i) => selectedItems.includes(i.id))
    .reduce((sum, i) => sum + Number(i.price), 0);

  const calculatedDuration = serviceItems
    .filter((i) => selectedItems.includes(i.id))
    .reduce((sum, i) => sum + Number(i.estimatedDuration), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-4">
      {/* Section: Basic Info */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            Thông tin set Nail *
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Vibe mùa hè"
            required
            className="border-none bg-slate-50 rounded-2xl h-12 focus-visible:ring-[#950101] transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            Mô tả / Câu chuyện
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Điều gì khiến set này đặc biệt?"
            rows={3}
            className="border-none bg-slate-50 rounded-2xl focus-visible:ring-[#950101] transition-all shadow-sm resize-none"
          />
        </div>
      </div>

      {/* Section: Visuals & Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Ảnh minh họa
          </Label>
          <div className="relative group cursor-pointer">
            <div className="relative aspect-video bg-slate-50 rounded-[1.5rem] overflow-hidden border-2 border-dashed border-slate-200 group-hover:border-[#E288F9] transition-colors">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md text-red-500 rounded-xl shadow-lg active:scale-90 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="p-4 bg-white rounded-2xl shadow-sm text-[#950101]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    Tải ảnh lên
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploading}
              />
            </div>
          </div>
        </div>

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
              className="border-none bg-slate-50 rounded-2xl h-12 pl-12 focus-visible:ring-[#950101] shadow-sm"
            />
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <p className="text-[10px] text-slate-400 font-medium italic">
            Thời gian dự đoán : {calculatedDuration} phút
          </p>
        </div>
      </div>

      {/* Section: Services Selection */}
      <div className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div>
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Dịch vụ bao gồm
            </Label>
          </div>
          {selectedItems.length > 0 && (
            <Badge className="bg-[#950101] text-white border-none px-3 py-1 rounded-full shadow-lg shadow-red-100">
              {totalPrice.toLocaleString()}đ • {selectedItems.length} dịch vụ
            </Badge>
          )}
        </div>

        <div className="space-y-6">
          {Object.entries(groupedItems).map(([type, items]) => (
            <div key={type} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-[1px] flex-1 bg-slate-100" />
                <ComponentBadge role={Number(type)} />
                <div className="h-[1px] flex-1 bg-slate-100" />
              </div>

              <div className="grid grid-cols-1 gap-2">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-2xl border-2 transition-all cursor-pointer",
                      selectedItems.includes(item.id)
                        ? "border-[#E288F9] bg-white shadow-md"
                        : "border-transparent bg-slate-50 hover:bg-slate-100",
                    )}
                  >
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="rounded-full border-slate-300 data-[state=checked]:bg-[#950101] data-[state=checked]:border-[#950101]"
                    />

                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center text-white font-bold text-xl uppercase">
                          {item.name?.[0]}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#950101]">
                          {Number(item.price).toLocaleString()}đ
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          ~{item.estimatedDuration}m
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Tags */}
      <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-black uppercase tracking-widest text-[#950101]">
            Phân loại
          </Label>
          <Sparkles className="w-4 h-4 text-[#E288F9]" />
        </div>

        <TagSelector
          selectedTagIds={selectedTagIds}
          onTagChange={setSelectedTagIds}
          maxTags={5}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || uploading || !name}
        className="w-full h-14 rounded-full uppercase bg-gradient-to-r from-[#950101] via-[#D81B60] to-[#E288F9] hover:opacity-90 shadow-xl shadow-pink-100 text-white font-black text-md transition-all active:scale-[0.98]"
      >
        {isLoading || uploading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>{initialData ? "Cập nhật set Nail" : "Tạo set Nail"}</>
        )}
      </Button>
    </form>
  );
};

export default CollectionForm;
