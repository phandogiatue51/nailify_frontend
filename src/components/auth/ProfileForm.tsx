"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Camera, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string | null; // Added this
}

interface ProfileFormProps {
  initialData: ProfileFormData;
  onSubmit: (data: any, imageFile?: File | null) => Promise<void>;
  isArtist?: boolean;
  isLoading?: boolean;
  isReadOnly?: boolean;
}

export const ProfileForm = ({
  initialData,
  onSubmit,
  isArtist = false,
  isLoading = false,
  isReadOnly = false,
}: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData.avatarUrl || null,
  );

  useEffect(() => {
    setFormData(initialData);
    if (initialData.avatarUrl) setImagePreview(initialData.avatarUrl);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { avatarUrl, ...textData } = formData;
    await onSubmit(textData, imageFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isReadOnly && (
        <div className="flex flex-col items-center space-y-4 py-2">
          <div className="relative">
            <Avatar className="w-28 h-28 border-4 border-white shadow-md">
              <AvatarImage src={imagePreview || ""} className="object-cover" />
              <AvatarFallback className="bg-slate-100">
                <User className="w-12 h-12 text-slate-400" />
              </AvatarFallback>
            </Avatar>
            <Label
              htmlFor="avatar"
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg cursor-pointer border-2 border-white"
            >
              <Camera className="w-4 h-4" />
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs font-medium text-slate-500">
            Tap to change photo
          </p>
        </div>
      )}

      <div className="space-y-4 text-left">
        <div className="grid gap-2">
          <Label htmlFor="fullName" className="text-sm font-semibold ml-1">
            Full Name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="h-11 rounded-xl"
            disabled={isLoading || isReadOnly}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-semibold ml-1">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="h-11 rounded-xl"
            disabled={isLoading || isReadOnly}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone" className="text-sm font-semibold ml-1">
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="h-11 rounded-xl"
            disabled={isLoading || isReadOnly}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address" className="text-sm font-semibold ml-1">
            Address
          </Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="rounded-xl resize-none"
            disabled={isLoading || isReadOnly}
            rows={3}
          />
        </div>
      </div>

      {!isReadOnly && (
        <Button
          type="submit"
          className="w-full h-12 rounded-xl font-bold text-base mt-4 transition-all active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      )}
    </form>
  );
};
