import { ArtistFilterDto } from "@/types/filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Star } from "lucide-react";

interface ArtistFilterProps {
  filters: ArtistFilterDto;
  onFilterChange: (filters: ArtistFilterDto) => void;
}

export const ArtistFilter = ({
  filters,
  onFilterChange,
}: ArtistFilterProps) => {
  const handleChange = (key: keyof ArtistFilterDto, value: any) => {
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
            <h3 className="font-semibold">Artist Filters</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search by Name/Email */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Name or email..."
                className="pl-9"
                value={filters.SearchTerm || ""}
                onChange={(e) => handleChange("SearchTerm", e.target.value)}
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

          {/* Minimum Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Minimum Rating</Label>
            <div className="flex gap-2">
              <Input
                id="rating"
                type="number"
                min="0"
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
              <Star className="w-5 h-5 self-center text-yellow-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistFilter;
