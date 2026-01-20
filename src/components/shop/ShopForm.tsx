import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from "lucide-react";
import { Shop } from "@/types/database";

interface ShopFormProps {
  initialData?: Partial<Shop>;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

const ShopForm: React.FC<ShopFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [address, setAddress] = useState(initialData?.address || "");
  const [phone, setPhone] = useState(initialData?.phone || "");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(initialData?.logoUrl || "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(initialData?.coverUrl || "");

  const [uploading, setUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview("");
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description || "");
    formData.append("address", address || "");
    formData.append("phone", phone || "");

    // Only append logo if a new file was selected
    if (logoFile) {
      formData.append("logoFile", logoFile);
    }

    // Only append cover if a new file was selected
    if (coverFile) {
      formData.append("coverFile", coverFile);
    }

    try {
      await onSubmit(formData);

      // Reset files after successful submission
      if (logoFile) {
        setLogoFile(null);
      }
      if (coverFile) {
        setCoverFile(null);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Shop Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Nail Salon"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell customers about your shop..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St, City"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 234 567 8900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Logo</Label>
          <div className="relative">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
              {logoPreview ? (
                <>
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploading}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {logoPreview ? "Click to change" : "Click to upload"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Cover Image</Label>
          <div className="relative">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
              {coverPreview ? (
                <>
                  <img
                    src={coverPreview}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeCover}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploading}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {coverPreview ? "Click to change" : "Click to upload"}
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || uploading || !name}
      >
        {isLoading || uploading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : null}
        {initialData ? "Update Shop" : "Create Shop"}
      </Button>
    </form>
  );
};

export default ShopForm;
