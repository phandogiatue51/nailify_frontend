import { ServiceItemFilterDto, ComponentType } from "@/types/filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Package, Type, Hash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceFilterProps {
  filters: ServiceItemFilterDto;
  onFilterChange: (filters: ServiceItemFilterDto) => void;
}

export const ServiceFilter = ({
  filters,
  onFilterChange,
}: ServiceFilterProps) => {
  const handleChange = (key: keyof ServiceItemFilterDto, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({});
  };

  const componentTypeOptions = [
    { value: ComponentType.Form.toString(), label: "Form" },
    { value: ComponentType.Base.toString(), label: "Base" },
    { value: ComponentType.Shape.toString(), label: "Shape" },
    { value: ComponentType.Polish.toString(), label: "Polish" },
    { value: ComponentType.Design.toString(), label: "Design" },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <h3 className="font-semibold">Service Filters</h3>
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
                placeholder="Service name..."
                className="pl-9"
                value={filters.SearchTerm || ""}
                onChange={(e) => handleChange("SearchTerm", e.target.value)}
              />
            </div>
          </div>

          {/* Component Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="componentType">Component Type</Label>
            <Select
              value={filters.ComponentType?.toString() || ""}
              onValueChange={(value) =>
                handleChange("ComponentType", value ? Number(value) : undefined)
              }
            >
              <SelectTrigger id="componentType">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {componentTypeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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

          {/* Shop ID Filter */}
          <div className="space-y-2">
            <Label htmlFor="shopId">Shop ID</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="shopId"
                placeholder="Shop ID..."
                className="pl-9"
                value={filters.ShopId || ""}
                onChange={(e) => handleChange("ShopId", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceFilter;
