import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { ComponentType, ServiceItem } from "@/types/database";

interface ServiceItemFormProps {
  componentType: ComponentType;
  shopId?: string; // Add shopId prop
  initialData?: Partial<ServiceItem>;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

const ServiceItemForm: React.FC<ServiceItemFormProps> = ({
  componentType,
  shopId,
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setImageUrl(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description || '');
    formData.append('price', price);
    formData.append('componentType', componentType);

    if (shopId) {
      formData.append('shopId', shopId);
    }

    if (file) {
      formData.append('image', file);
    }

    try {
      await onSubmit(formData);
      // Reset form if successful
      if (!initialData) {
        setName("");
        setDescription("");
        setPrice("");
        setFile(null);
        setImageUrl("");
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
    Form: "Form",
    Base: "Base",
    Shape: "Shape",
    Polish: "Polish",
    Design: "Design",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{typeLabels[componentType]} Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Enter ${typeLabels[componentType].toLowerCase()} name`}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <div className="flex items-center gap-4">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden w-32">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
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
          <div className="text-sm text-muted-foreground">
            <p>Upload an image (optional)</p>
            <p className="text-xs">JPG, PNG up to 5MB</p>
          </div>
        </div>
        {uploading && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || uploading || !name || !price}
      >
        {isLoading || uploading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : null}
        {initialData ? "Update" : "Add"} {typeLabels[componentType]}
      </Button>
    </form>
  );
};

export default ServiceItemForm;