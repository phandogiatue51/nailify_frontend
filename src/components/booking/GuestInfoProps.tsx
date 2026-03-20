import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User, Phone, MapPin, ArrowRight, Save } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface GuestInfoFormProps {
  mode: "create" | "update";
  bookingId?: string;
  initialData?: {
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
  };
  onSubmit: (data: GuestInfoFormData) => void;
  isSubmitting?: boolean;
  onBack?: () => void;
  nextButtonText?: string;
}

export interface GuestInfoFormData {
  fullName: string;
  phone: string;
  address: string;
}

export const GuestInfoForm = ({
  mode,
  bookingId,
  initialData,
  onSubmit,
  isSubmitting = false,
  onBack,
  nextButtonText = "Chọn set Nail",
}: GuestInfoFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isArtistBooking = !!user?.nailArtistId;

  const [formData, setFormData] = useState<GuestInfoFormData>({
    fullName: initialData?.customerName || "",
    phone: initialData?.customerPhone || "",
    address: initialData?.customerAddress || "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  // Update form when initialData changes (for update mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.customerName || "",
        phone: initialData.customerPhone || "",
        address: initialData.customerAddress || "",
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      phone: "",
      address: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Invalid phone number";
    }

    // Only validate address for artist bookings
    if (isArtistBooking && !formData.address.trim()) {
      newErrors.address = "Address is required for artist bookings";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1
          className="font-black tracking-tight uppercase text-xl bg-clip-text text-transparent pb-1"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          {mode === "create"
            ? "Đặt lịch cho khách"
            : "Cập nhật thông tin khách hàng"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-4">
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-6 space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Họ và tên
                </label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={cn(
                    "h-12 rounded-xl border-2 bg-white",
                    errors.fullName ? "border-red-500" : "border-slate-100",
                    isSubmitting && "opacity-50 cursor-not-allowed",
                  )}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Số điện thoại
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={cn(
                    "h-12 rounded-xl border-2 bg-white",
                    errors.phone ? "border-red-500" : "border-slate-100",
                    isSubmitting && "opacity-50 cursor-not-allowed",
                  )}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Address Input - Only show for artist bookings */}
              {isArtistBooking && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12 rounded-xl border-2 bg-white",
                      errors.address ? "border-red-500" : "border-slate-100",
                      isSubmitting && "opacity-50 cursor-not-allowed",
                    )}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.address}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    Đối với thợ Nail, bắt buộc nhập địa chỉ khách hàng
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
              border: "none",
            }}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {mode === "create"
                  ? "Tạo thông tin ..."
                  : "Cập nhật thông tin ..."}
              </div>
            ) : (
              <>
                {mode === "create" ? nextButtonText : "Lưu thay đổi"}
                {mode === "create" ? (
                  <ArrowRight className="w-4 h-4 ml-2" />
                ) : (
                  <Save className="w-4 h-4 ml-2" />
                )}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
