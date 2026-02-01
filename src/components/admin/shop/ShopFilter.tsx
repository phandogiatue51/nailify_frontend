import { ShopFilterDto } from "@/types/filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";

interface ShopFilterProps {
  filters: ShopFilterDto;
  onFilterChange: (filters: ShopFilterDto) => void;
}

export const ShopFilter = ({ filters, onFilterChange }: ShopFilterProps) => {
  const handleChange = (key: keyof ShopFilterDto, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({});
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search by Name */}
          <div className="space-y-2">
            <Label htmlFor="search">Search by Name</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Shop name..."
                className="pl-9"
                value={filters.Name || ""}
                onChange={(e) => handleChange("Name", e.target.value)}
              />
            </div>
          </div>

          {/* Verification Status */}
          <div className="space-y-2">
            <Label>Verification Status</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="verified"
                checked={filters.IsVerified === true}
                onCheckedChange={(checked) =>
                  handleChange("IsVerified", checked ? true : undefined)
                }
              />
              <Label htmlFor="verified" className="cursor-pointer">
                Verified Only
              </Label>
            </div>
          </div>

          {/* Active Status */}
          <div className="space-y-2">
            <Label>Active Status</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={filters.IsActive === true}
                onCheckedChange={(checked) =>
                  handleChange("IsActive", checked ? true : undefined)
                }
              />
              <Label htmlFor="active" className="cursor-pointer">
                Active Only
              </Label>
            </div>
          </div>

          {/* Rating Filter (if available) */}
          <div className="space-y-2">
            <Label htmlFor="rating">Minimum Rating</Label>
            <div className="flex gap-2">
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                placeholder="4.0"
                value={filters.Rating || ""}
                onChange={(e) =>
                  handleChange(
                    "Rating",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
              <span className="self-center">⭐</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopFilter;
