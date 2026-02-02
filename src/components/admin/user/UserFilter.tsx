import { ProfileFilter, UserRole } from "@/types/filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, User, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFilterProps {
  filters: ProfileFilter;
  onFilterChange: (filters: ProfileFilter) => void;
}

export const UserFilter = ({ filters, onFilterChange }: UserFilterProps) => {
  const handleChange = (key: keyof ProfileFilter, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({});
  };

  const roleOptions = [
    { value: "0", label: "Customer" },
    { value: "1", label: "Shop Owner" },
    { value: "2", label: "Nail Artist" },
    { value: "3", label: "Admin" },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search by Name/Email */}
          <div className="space-y-2">
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

          {/* Role Filter */}
          <div className="space-y-2">
            <Select
              value={filters.Role?.toString() || undefined}
              onValueChange={(value) =>
                handleChange("Role", value ? Number(value) : undefined)
              }
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="space-y-2">
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
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserFilter;
