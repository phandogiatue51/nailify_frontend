// components/booking/LocationSelector.tsx
import { ShopLocation } from "@/types/database";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface LocationSelectorProps {
  locations: ShopLocation[];
  selectedLocation: string | null;
  onSelectLocation: (locationId: string) => void;
}

export const LocationSelector = ({
  locations,
  selectedLocation,
  onSelectLocation,
}: LocationSelectorProps) => {
  if (locations.length === 0) {
    return (
      <Card>
        <CardContent className="py-4 text-center text-muted-foreground">
          <p>Không có địa chỉ khả dụng</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <RadioGroup
      value={selectedLocation || ""}
      onValueChange={onSelectLocation}
      className="space-y-3"
    >
      {locations.map((location) => (
        <div key={location.shopLocationId}>
          <RadioGroupItem
            value={location.shopLocationId}
            id={`location-${location.shopLocationId}`}
            className="sr-only"
          />
          <Label
            htmlFor={`location-${location.shopLocationId}`}
            className="block"
          >
            <Card
              className={`cursor-pointer transition-all ${
                selectedLocation === location.shopLocationId
                  ? "border-primary ring-2 ring-primary/20"
                  : "hover:border-slate-300"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold">
                      {location.address}, {location.city}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {location.openingTime} - {location.closingTime}
                    </p>
                  </div>
                  {location.isActive && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Đang mở cửa
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
