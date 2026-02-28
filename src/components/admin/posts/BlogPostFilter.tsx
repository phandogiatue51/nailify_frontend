// components/admin/blog/BlogPostFilter.tsx
import { BlogPostFilterDto } from "@/types/filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Calendar } from "lucide-react";

interface BlogPostFilterProps {
  filters: BlogPostFilterDto;
  onFilterChange: (filters: BlogPostFilterDto) => void;
}

export const BlogPostFilter = ({
  filters,
  onFilterChange,
}: BlogPostFilterProps) => {
  const handleChange = (key: keyof BlogPostFilterDto, value: any) => {
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
            <h3 className="font-semibold">Blog Post Filters</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search by Title/Content */}
          <div className="space-y-2">
            <Label htmlFor="search">Search by Title or Content</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search posts..."
                className="pl-9"
                value={filters.SearchTerm || ""}
                onChange={(e) => handleChange("SearchTerm", e.target.value)}
              />
            </div>
          </div>

          {/* Recently Added Filter */}
          <div className="space-y-2">
            <Label>Time Filter</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="recently"
                checked={filters.Recently === true}
                onCheckedChange={(checked) =>
                  handleChange("Recently", checked ? true : undefined)
                }
              />
              <Label
                htmlFor="recently"
                className="cursor-pointer flex items-center gap-1"
              >
                <Calendar className="w-4 h-4" />
                Recently Added
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostFilter;
