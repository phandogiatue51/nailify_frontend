import { useQuery } from "@tanstack/react-query";
import { tagAPI } from "@/services/api";
import { TagDto } from "@/types/type";

export const useTags = (category?: number) => {
  return useQuery<TagDto[]>({
    queryKey: ["tags", category],
    queryFn: () => {
      if (category !== undefined) {
        return tagAPI.getTagsByCategory(category);
      }
      return tagAPI.getAllTags();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Optional: Helper to group tags locally
export const useGroupedTags = () => {
  const { data: tags, ...rest } = useTags();

  const groupedTags =
    tags?.reduce(
      (acc, tag) => {
        if (!acc[tag.category]) acc[tag.category] = [];
        acc[tag.category].push(tag);
        return acc;
      },
      {} as Record<number, TagDto[]>,
    ) || {};

  return { groupedTags, tags, ...rest };
};
