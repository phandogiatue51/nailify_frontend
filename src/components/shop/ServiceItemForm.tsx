import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Loader2, Upload } from "lucide-react";
import { ComponentType, ServiceItem } from "@/types/database";

interface ServiceItemFormProps {
  componentType: ComponentType;
  initialData?: Partial<ServiceItem>;
  onSubmit: (data: {
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    component_type: ComponentType;
  }) => Promise<void>;
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
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");

  const { uploadImage, uploading } = useImageUpload();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) setImageUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      description: description || null,
      price: parseFloat(price) || 0,
      image_url: imageUrl || null,
      component_type: componentType,
    });
  };

  const typeLabels: Record<ComponentType, string> = {
    form: "Form",
    base: "Base",
    shape: "Shape",
    polish: "Polish",
    design: "Design",
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

      <div className="space-y-2">
        <Label>Image</Label>
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden max-w-[200px]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={uploading}
          />
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
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        {initialData ? "Update" : "Add"} {typeLabels[componentType]}
      </Button>
    </form>
  );
};

export default ServiceItemForm;
