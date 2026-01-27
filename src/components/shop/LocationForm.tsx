import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ShopLocation, ShopLocationCreateDto } from "@/types/database";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Full address"
          className={errors.address ? "border-red-500" : ""}
          required
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            placeholder="City"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="Phone number"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Max Concurrent Bookings</Label>
          <Input
            id="maxConcurrentBookings"
            name="maxConcurrentBookings"
            type="number"
            value={formData.maxConcurrentBookings || ""}
            onChange={handleChange}
            placeholder="Max Concurrent Bookings"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Buffer Minutes</Label>
          <Input
            id="bufferMinutes"
            name="bufferMinutes"
            type="number"
            value={formData.bufferMinutes || ""}
            onChange={handleChange}
            placeholder="Buffer Minutes"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Booking Lead Time Minutes</Label>
          <Input
            id="bookingLeadTimeMinutes"
            name="bookingLeadTimeMinutes"
            type="number"
            value={formData.bookingLeadTimeMinutes || ""}
            onChange={handleChange}
            placeholder="Booking Lead Time Minutes"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Booking Window Days</Label>
          <Input
            id="bookingWindowDays"
            name="bookingWindowDays"
            type="number"
            value={formData.bookingWindowDays || ""}
            onChange={handleChange}
            placeholder="Booking Window Days"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="openingTime">Opening Time</Label>
          <Input
            id="openingTime"
            name="openingTime"
            type="time"
            value={formData.openingTime || ""}
            onChange={handleChange}
            className={errors.openingTime ? "border-red-500" : ""}
          />
          {errors.openingTime && (
            <p className="text-sm text-red-500">{errors.openingTime}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="closingTime">Closing Time</Label>
          <Input
            id="closingTime"
            name="closingTime"
            type="time"
            value={formData.closingTime || ""}
            onChange={handleChange}
            className={errors.closingTime ? "border-red-500" : ""}
          />
          {errors.closingTime && (
            <p className="text-sm text-red-500">{errors.closingTime}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            value={formData.latitude || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                latitude: e.target.value
                  ? parseFloat(e.target.value)
                  : undefined,
              }))
            }
            placeholder="e.g., 37.7749"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            value={formData.longitude || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                longitude: e.target.value
                  ? parseFloat(e.target.value)
                  : undefined,
              }))
            }
            placeholder="e.g., -122.4194"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData ? "Update Location" : "Create Location"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default LocationForm;
