import { useState, useEffect, useRef, ChangeEvent } from "react";
import { ShopLocation } from "@/types/database";
import { Camera, User, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface StaffFormProps {
  mode: "create" | "edit";
  initialData?: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    shopLocationId?: string;
    avatarUrl?: string;
  };
  locations: ShopLocation[];
  onSubmit: (formData: FormData) => void;
  isLoading?: boolean;
}

export const StaffForm = ({
  mode,
  initialData = {},
  locations,
  onSubmit,
  isLoading = false,
}: StaffFormProps) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    address: initialData.address || "",
    shopLocationId: initialData.shopLocationId || "",
    password: "",
    confirmPassword: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(
    initialData.avatarUrl || "",
  ); // Add this
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData((prev) => ({
        ...prev,
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        shopLocationId: initialData.shopLocationId || "",
      }));
      // Set avatar preview from URL if exists
      if (initialData.avatarUrl) {
        setAvatarPreview(initialData.avatarUrl);
      }
    }
  }, [mode, initialData]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const removeImage = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (mode === "create") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (!formData.shopLocationId) {
      newErrors.shopLocationId = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSubmit = new FormData();

    // Use lowercase field names
    if (formData.fullName)
      formDataToSubmit.append("fullName", formData.fullName);
    if (formData.email) formDataToSubmit.append("email", formData.email);
    if (formData.phone) formDataToSubmit.append("phone", formData.phone);
    if (formData.address) formDataToSubmit.append("address", formData.address);
    if (formData.shopLocationId)
      formDataToSubmit.append("shopLocationId", formData.shopLocationId);

    if (mode === "create") {
      formDataToSubmit.append("password", formData.password);
    }

    if (avatarFile) {
      formDataToSubmit.append("imageFile", avatarFile);
    }

    onSubmit(formDataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      <div className="text-center">
        <h2 className="text-2xl font-black tracking-tighter text-slate-900">
          {mode === "create" ? "Add Team Member" : "Update Profile"}
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          {mode === "create"
            ? "Create a new account for your artist"
            : "Modify existing staff information"}
        </p>
      </div>

      {/* Luxury Avatar Upload */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-28 h-28 rounded-[2.5rem] bg-slate-100 overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
            {avatarPreview ? (
              <img src={avatarPreview} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-300" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-[#E288F9] text-white p-2.5 rounded-2xl shadow-lg cursor-pointer hover:scale-110 transition-transform active:scale-95">
            <Camera className="w-4 h-4" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
        {avatarPreview && (
          <button
            type="button"
            onClick={removeImage}
            className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500"
          >
            Remove Photo
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Name & Email Group */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Full Name *
            </Label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Artist name"
              className="rounded-xl bg-slate-50/50 border-none h-12 focus-visible:ring-[#E288F9]"
            />
            {errors.fullName && (
              <p className="text-[10px] text-red-500 font-bold ml-1">
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Email Address *
            </Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="artist@nailify.com"
              className="rounded-xl bg-slate-50/50 border-none h-12 focus-visible:ring-[#E288F9]"
            />
            {errors.email && (
              <p className="text-[10px] text-red-500 font-bold ml-1">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Location & Contact Group */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Location *
            </Label>
            <select
              name="shopLocationId"
              value={formData.shopLocationId}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50/50 border-none text-sm font-medium focus:ring-2 focus:ring-[#E288F9]"
            >
              <option value="">Select Studio</option>
              {locations.map((loc) => (
                <option key={loc.shopLocationId} value={loc.shopLocationId}>
                  {loc.address}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Phone
              </Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="090..."
                className="rounded-xl bg-slate-50/50 border-none h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Address
              </Label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="District 1..."
                className="rounded-xl bg-slate-50/50 border-none h-12"
              />
            </div>
          </div>
        </div>

        {/* Security Group (Create Only) */}
        {mode === "create" && (
          <div className="bg-purple-50/30 rounded-[2rem] p-6 border border-purple-100/50 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-3 h-3 text-[#E288F9]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E288F9]">
                Security
              </span>
            </div>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Set password"
              className="rounded-xl bg-white border-none h-12 shadow-sm"
            />
            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="rounded-xl bg-white border-none h-12 shadow-sm"
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 rounded-2xl bg-[#E288F9] hover:bg-[#d07ae6] shadow-xl shadow-purple-100 font-black uppercase tracking-widest"
      >
        {isLoading
          ? "Syncing..."
          : mode === "create"
            ? "Create Staff"
            : "Save Profile"}
      </Button>
    </form>
  );
};
