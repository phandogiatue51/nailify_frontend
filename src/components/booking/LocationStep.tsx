import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { LocationSelector } from "@/components/shop/LocationSelector";
import { Loader2 } from "lucide-react";

interface LocationStepProps {
  locations: any[];
  selectedLocation: string | null;
  onSelectLocation: (locationId: string) => void;
  isLoading?: boolean;
}

export const LocationStep = ({
  locations,
  selectedLocation,
  onSelectLocation,
  isLoading = false,
}: LocationStepProps) => {
  const handleLocationSelect = (locationId: string) => {
    onSelectLocation(locationId);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="font-black uppercase tracking-tight">Select Location</h2>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : locations.length === 0 ? (
          <p className="text-muted-foreground">No locations available</p>
        ) : (
          <LocationSelector
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={handleLocationSelect} 
          />
        )}
      </CardContent>
    </Card>
  );
};
