import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Loader2, Upload } from "lucide-react";
import { Collection, ComponentType, ServiceItem } from "@/types/database";
import { Badge } from "@/components/ui/badge";

interface CollectionFormProps {
  serviceItems: ServiceItem[];
  initialData?: Partial<Collection>;
  onSubmit: (data: {
    name: string;
    description: string | null;
    image_url: string | null;
    itemIds: string[];
  }) => Promise<void>;
  isLoading?: boolean;
}

const typeLabels: Record<ComponentType, string> = {
  form: "Form",
  base: "Base",
  shape: "Shape",
  polish: "Polish",
  design: "Design",
};

const typeColors: Record<ComponentType, string> = {
  form: "bg-blue-100 text-blue-800",
  base: "bg-green-100 text-green-800",
  shape: "bg-purple-100 text-purple-800",
  polish: "bg-pink-100 text-pink-800",
  design: "bg-orange-100 text-orange-800",
};

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
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [selectedItems, setSelectedItems] = useState<string[]>(
    initialData?.items?.map((i) => i.id) || [],
  );

  const { uploadImage, uploading } = useImageUpload();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) setImageUrl(url);
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
    await onSubmit({
      name,
      description: description || null,
      image_url: imageUrl || null,
      itemIds: selectedItems,
    });
  };

  // Group items by type
  const groupedItems = serviceItems.reduce(
    (acc, item) => {
      if (!acc[item.component_type]) {
        acc[item.component_type] = [];
      }
      acc[item.component_type].push(item);
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
        <Label>Cover Image</Label>
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
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
              {typeLabels[type as ComponentType]}
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
                    {item.image_url && (
                      <img
                        src={item.image_url}
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
                    <Badge
                      className={typeColors[item.component_type]}
                      variant="secondary"
                    >
                      {item.component_type}
                    </Badge>
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

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || uploading || !name}
      >
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        {initialData ? "Update Collection" : "Create Collection"}
      </Button>
    </form>
  );
};

export default CollectionForm;
