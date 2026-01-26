import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, X } from "lucide-react";
import { Collection, ComponentType, ServiceItem } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { ComponentBadge } from "../badge/ComponentBadge";
import { Separator } from "@/components/ui/separator";
import { TagSelector } from "../ui/TagSelector";

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
    initialData?.estimatedDuration?.toString() || "60",
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
    formData.append("EstimatedDuration", estimatedDuration || "60"); // Default 60 minutes, add input for this

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Collection Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Summer Vibes Set"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this collection..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimatedDuration">
          Estimated Duration (minutes) *
        </Label>
        <Input
          id="estimatedDuration"
          type="number"
          min="1"
          value={estimatedDuration}
          onChange={(e) => setEstimatedDuration(e.target.value)}
          placeholder="e.g., 60"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div className="relative">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
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
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploading}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1">
            {imagePreview ? "Click image to change" : "Optional cover image"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Select Services</Label>
          {selectedItems.length > 0 && (
            <Badge variant="secondary">
              {selectedItems.length} selected · ${totalPrice.toFixed(2)}
            </Badge>
          )}
        </div>

        {Object.entries(groupedItems).map(([type, items]) => (
          <div key={type} className="space-y-2">
            <p className="text-sm font-medium capitalize">
              {/* Use ComponentBadge for the header */}
              <ComponentBadge role={Number(type)} />
            </p>
            <div className="space-y-2">
              {items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted/50"
                >
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <div className="flex-1 flex items-center gap-2">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <ComponentBadge role={item.componentType} />
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}

        {serviceItems.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No services available. Add some services first!
          </p>
        )}
      </div>
      
      <Separator className="my-4" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Collection Tags</Label>
          <span className="text-xs text-muted-foreground">
            Optional - helps customers find your collection
          </span>
        </div>

        <TagSelector
          selectedTagIds={selectedTagIds}
          onTagChange={setSelectedTagIds}
          maxTags={5}
        />

        <p className="text-xs text-muted-foreground">
          Add tags like "Wedding", "Summer", "Minimalist" to help customers
          discover your collection.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || uploading || !name}
      >
        {isLoading || uploading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : null}
        {initialData ? "Update Collection" : "Create Collection"}
      </Button>
    </form>
  );
};

export default CollectionForm;
