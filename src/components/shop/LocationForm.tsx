import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarCheck, Clock, Loader2, MapIcon, MapPin } from "lucide-react";
import { ShopLocation, ShopLocationCreateDto } from "@/types/database";
import { cn } from "@/lib/utils";

interface LocationFormProps {
  initialData?: ShopLocation;
  onSubmit: (data: ShopLocationCreateDto) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ShopLocationCreateDto>({
    address: initialData?.address || "",
    city: initialData?.city || "",
    phone: initialData?.phone || "",
    openingTime: initialData?.openingTime || "",
    closingTime: initialData?.closingTime || "",
    latitude: initialData?.latitude || undefined,
    longitude: initialData?.longitude || undefined,
    maxConcurrentBookings: initialData?.maxConcurrentBookings || undefined,
    bufferMinutes: initialData?.bufferMinutes || undefined,
    bookingLeadTimeMinutes: initialData?.bookingLeadTimeMinutes || undefined,
    bookingWindowDays: initialData?.bookingWindowDays || undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Validate time format if provided
    if (
      formData.openingTime &&
      !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.openingTime)
    ) {
      newErrors.openingTime = "Use HH:mm format (e.g., 09:00)";
    }

    if (
      formData.closingTime &&
      !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.closingTime)
    ) {
      newErrors.closingTime = "Use HH:mm format (e.g., 17:00)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData: ShopLocationCreateDto = {
        address: formData.address.trim(),
        city: formData.city?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
        openingTime: formData.openingTime?.trim() || undefined,
        closingTime: formData.closingTime?.trim() || undefined,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        maxConcurrentBookings: formData.maxConcurrentBookings || undefined,
        bufferMinutes: formData.bufferMinutes || undefined,
        bookingLeadTimeMinutes: formData.bookingLeadTimeMinutes || undefined,
        bookingWindowDays: formData.bookingWindowDays || undefined,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Failed to submit location:", error);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div>
          <div className="flex items-center gap-2 px-1">
            <MapPin className="w-4 h-4 text-[#950101]" />
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-800">
              Thông tin chi nhánh
            </h3>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400"
            >
              Địa chỉ
            </Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={cn(
                "border-none bg-slate-50 rounded-2xl focus-visible:ring-[#950101] shadow-sm resize-none",
                errors.address && "ring-2 ring-red-500",
              )}
              required
            />
            {errors.address && (
              <p className="text-[10px] font-bold text-red-500 px-2">
                {errors.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Thành phố
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                className="border-none bg-slate-50 rounded-2xl h-12 focus-visible:ring-[#950101] shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Số điện thoại
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="border-none bg-slate-50 rounded-2xl h-12 focus-visible:ring-[#950101] shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <div className="flex items-center gap-2 px-1">
            <CalendarCheck className="w-4 h-4 text-[#D81B60]" />
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-800">
              Quy trình đặt lịch
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Số khách song song{" "}
              </Label>
              <Input
                name="maxConcurrentBookings"
                type="number"
                value={formData.maxConcurrentBookings || ""}
                onChange={handleChange}
                className="border-none bg-white rounded-xl h-10 shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Thời gian nghỉ (phút){" "}
              </Label>
              <Input
                name="bufferMinutes"
                type="number"
                value={formData.bufferMinutes || ""}
                onChange={handleChange}
                className="border-none bg-white rounded-xl h-10 shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Đặt trước ít nhất (phút){" "}
              </Label>
              <Input
                name="bookingLeadTimeMinutes"
                type="number"
                value={formData.bookingLeadTimeMinutes || ""}
                onChange={handleChange}
                className="border-none bg-white rounded-xl h-10 shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Giới hạn đặt trước (ngày)
              </Label>
              <Input
                name="bookingWindowDays"
                type="number"
                value={formData.bookingWindowDays || ""}
                onChange={handleChange}
                className="border-none bg-white rounded-xl h-10 shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <div className="flex items-center gap-2 px-1">
            <Clock className="w-4 h-4 text-[#950101]" />
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-800">
              Giờ hoạt động
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-[#950101]/20 transition-all">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Giờ mở cửa
              </Label>
              <Input
                name="openingTime"
                type="time"
                value={formData.openingTime || ""}
                onChange={handleChange}
                className="border-none bg-transparent h-8 p-0 text-lg font-bold"
              />
            </div>
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-[#950101]/20 transition-all">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Giờ đóng cửa
              </Label>
              <Input
                name="closingTime"
                type="time"
                value={formData.closingTime || ""}
                onChange={handleChange}
                className="border-none bg-transparent h-8 p-0 text-lg font-bold"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="space-y-3 pt-4">
          <Button
            type="submit"
            className="w-full h-14 uppercase rounded-2xl bg-gradient-to-r from-[#950101] to-[#D81B60] shadow-xl shadow-red-100 text-white font-black text-lg active:scale-[0.98] transition-all"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            {initialData ? "Cập nhật" : "Tạo chi nhánh"}
          </Button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-3 text-[11px] font-black uppercase tracking-[0.2em] text-red-500 transition-colors"
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LocationForm;
