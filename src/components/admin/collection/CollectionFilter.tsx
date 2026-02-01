import { CollectionFilterDto, TagCategory } from "@/types/filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Layers, Hash, Building, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CollectionFilterProps {
  filters: CollectionFilterDto;
  onFilterChange: (filters: CollectionFilterDto) => void;
}

export const CollectionFilter = ({
  filters,
  onFilterChange,
}: CollectionFilterProps) => {
  const handleChange = (key: keyof CollectionFilterDto, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({});
  };

  const tagCategoryOptions = [
    { value: TagCategory.Occasion.toString(), label: "Occasion" },
    { value: TagCategory.Season.toString(), label: "Season" },
    { value: TagCategory.Style.toString(), label: "Style" },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <h3 className="font-semibold">Collection Filters</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search by Name */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Collection name..."
                className="pl-9"
                value={filters.Name || ""}
                onChange={(e) => handleChange("Name", e.target.value)}
              />
            </div>
          </div>

          {/* Shop ID Filter */}
          <div className="space-y-2">
            <Label htmlFor="shopId">Shop ID</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="shopId"
                placeholder="Shop ID..."
                className="pl-9"
                value={filters.ShopId || ""}
                onChange={(e) => handleChange("ShopId", e.target.value)}
              />
            </div>
          </div>

          {/* Artist ID Filter */}
          <div className="space-y-2">
            <Label htmlFor="artistId">Artist ID</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="artistId"
                placeholder="Artist ID..."
                className="pl-9"
                value={filters.ArtistId || ""}
                onChange={(e) => handleChange("ArtistId", e.target.value)}
              />
            </div>
          </div>

          {/* Tag Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category">Tag Category</Label>
            <Select
              value={filters.Category?.toString() || ""}
              onValueChange={(value) =>
                handleChange("Category", value ? Number(value) : undefined)
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {tagCategoryOptions.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={filters.isActive === true}
                onCheckedChange={(checked) =>
                  handleChange("isActive", checked ? true : undefined)
                }
              />
              <Label htmlFor="active" className="cursor-pointer">
                Active Only
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionFilter;
