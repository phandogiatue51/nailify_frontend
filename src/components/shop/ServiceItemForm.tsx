import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from "lucide-react";
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
    0: "Form",
    1: "Base",
    2: "Shape",
    3: "Polish",
    4: "Design",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{typeLabels[componentType]} Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Enter ${typeLabels[componentType]?.toLowerCase() || "service"} name`}
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
        <Label htmlFor="description">Estimated Duration</Label>
        <Input
          id="estimatedDuration"
          value={estimatedDuration}
          onChange={(e) => setEstimatedDuration(e.target.value)}
          placeholder="Set Estimated Duration.."
          type="number"
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
        <Label htmlFor="image">Service Image</Label>
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload</p>
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
        <p className="text-xs text-muted-foreground text-center mt-1">
          {imageUrl ? "Click image to change" : "Optional service image"}
        </p>
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
