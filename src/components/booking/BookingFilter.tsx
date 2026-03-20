import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TagDto } from "@/types/type";
import { TagCategory } from "@/types/filter";

interface BookingFilterProps {
  searchName: string;
  setSearchName: (value: string) => void;
  selectedTags: string[];
  toggleTag: (tagId: string) => void;
  allTags: TagDto[];
  clearFilters: () => void;
  placeholder?: string;
}

const BookingFilter = ({
  searchName,
  setSearchName,
  selectedTags,
  toggleTag,
  allTags,
  clearFilters,
  placeholder = "Tìm kiếm...",
}: BookingFilterProps) => {
  const activeFilterCount = selectedTags.length + (searchName ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="pl-9 pr-4 py-2 w-full bg-white border-slate-200 rounded-lg"
        />
      </div>

      {/* Tags Filter */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white border-slate-200 flex-1 justify-between"
            >
              <span>Lọc theo phân loại</span>
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
            {allTags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag.id}
                checked={selectedTags.includes(tag.id)}
                onCheckedChange={() => toggleTag(tag.id)}
              >
                <div className="flex flex-col">
                  <span>{tag.name}</span>
                  <span className="text-xs text-slate-500">
                    {TagCategory[tag.category]}
                  </span>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="shrink-0"
            title="Clear all filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tagId) => {
            const tag = allTags.find((t) => t.id === tagId);
            return tag ? (
              <Badge
                key={tagId}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                {tag.name}
                <button
                  onClick={() => toggleTag(tagId)}
                  className="ml-1 hover:text-slate-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default BookingFilter;
