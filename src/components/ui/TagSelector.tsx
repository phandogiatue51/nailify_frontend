import { TagBadge } from "../badge/TagBadge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTags } from "@/hooks/useTag";
import { useState } from "react";

interface TagSelectorProps {
  selectedTagIds: string[];
  onTagChange: (tagIds: string[]) => void;
  maxTags?: number;
  className?: string;
}

const CATEGORY_NAMES: Record<number, string> = {
  0: "Dịp lễ",
  1: "Mùa",
  2: "Phong cách",
};

export const TagSelector = ({
  selectedTagIds,
  onTagChange,
  maxTags = 5,
  className,
}: TagSelectorProps) => {
  const { data: tags = [], isLoading } = useTags();
  const [search, setSearch] = useState("");

  // Filter tags based on search
  const filteredTags = tags.filter(
    (tag) =>
      !search.trim() || tag.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleTagToggle = (tagId: string) => {
    const isSelected = selectedTagIds.includes(tagId);

    if (isSelected) {
      onTagChange(selectedTagIds.filter((id) => id !== tagId));
    } else if (selectedTagIds.length < maxTags) {
      onTagChange([...selectedTagIds, tagId]);
    }
  };

  const removeTag = (tagId: string) => {
    onTagChange(selectedTagIds.filter((id) => id !== tagId));
  };

  const clearAllTags = () => {
    onTagChange([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="ml-2">Đang tải tags...</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected Tags Display */}
      {selectedTagIds.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tags đã chọn</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAllTags}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Xóa tất cả
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[60px] bg-muted/20">
            {selectedTagIds.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              return tag ? (
                <TagBadge
                  key={tag.id}
                  tag={tag}
                  removable
                  onRemove={removeTag}
                />
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Available Tags */}
      {filteredTags.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          Không tìm thấy tags nào
        </div>
      ) : (
        <ScrollArea className="h-[250px]">
          <div className="space-y-3 pr-4">
            {filteredTags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <div key={tag.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={isSelected}
                    onChange={() => handleTagToggle(tag.id)}
                    disabled={!isSelected && selectedTagIds.length >= maxTags}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor={`tag-${tag.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <TagBadge tag={tag} />
                      <span className="text-xs text-muted-foreground">
                        {CATEGORY_NAMES[tag.category] ||
                          `Danh mục ${tag.category}`}
                      </span>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}

      {/* Selection info */}
      <div className="text-xs text-muted-foreground">
        {selectedTagIds.length} / {maxTags} tags được chọn
      </div>
    </div>
  );
};
