// components/tags/TagBadge.tsx
import { TagDto } from "@/types/type";

interface TagBadgeProps {
  tag: TagDto;
  size?: "sm" | "md" | "lg";
  removable?: boolean;
  onRemove?: (tagId: string) => void;
}

export const TagBadge = ({
  tag,
  size = "md",
  removable = false,
  onRemove,
}: TagBadgeProps) => {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  // All your color combinations - Tailwind will include these
  const TAG_COLOR_CLASSES: Record<string, string> = {
    // Occasion (category 0)
    "Đám cưới": "bg-gradient-to-r from-pink-100 to-pink-300 text-pink-900",
    "Hẹn hò": "bg-gradient-to-r from-rose-100 to-rose-300 text-rose-900",
    "Kỳ nghỉ": "bg-gradient-to-r from-teal-100 to-teal-300 text-teal-900",
    "Lễ kỉ niệm": "bg-gradient-to-r from-pink-200 to-red-300 text-red-900",
    "Dự tiệc": "bg-gradient-to-r from-red-100 to-red-300 text-red-900",
    "Sinh nhật":
      "bg-gradient-to-r from-fuchsia-100 to-fuchsia-300 text-fuchsia-900",

    // Season (category 1)
    "Mùa thu": "bg-gradient-to-r from-amber-100 to-orange-300 text-amber-900",
    "Mùa xuân": "bg-gradient-to-r from-green-100 to-green-300 text-green-900",
    "Mùa đông": "bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900",
    "Mùa hè": "bg-gradient-to-r from-yellow-100 to-orange-300 text-yellow-900",

    // Style (category 2)
    "Sang trọng":
      "bg-gradient-to-r from-purple-100 to-purple-300 text-purple-900",
    "Táo bạo": "bg-gradient-to-r from-red-200 to-red-400 text-red-900",
    "Cổ điển": "bg-gradient-to-r from-slate-100 to-slate-300 text-slate-900",
    "Trừu tượng":
      "bg-gradient-to-r from-pink-100 to-violet-300 text-violet-900",
    "Tối giản": "bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900",
    Pháp: "bg-gradient-to-r from-indigo-100 to-indigo-300 text-indigo-900",
  };

  // Fallback based on category
  const FALLBACK_COLORS: Record<number, string> = {
    0: "bg-gradient-to-r from-pink-100 to-pink-300 text-pink-900", // Occasion
    1: "bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900", // Season
    2: "bg-gradient-to-r from-purple-100 to-purple-300 text-purple-900", // Style
  };

  const colorClass =
    TAG_COLOR_CLASSES[tag.name] ||
    FALLBACK_COLORS[tag.category] ||
    "bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900";

  return (
    <span
      className={`
        ${sizeClasses[size]} 
        ${colorClass}
        rounded-full font-medium inline-flex items-center gap-1
        shadow-sm
      `}
    >
      {tag.name}
      {removable && (
        <button
          type="button"
          onClick={() => onRemove?.(tag.id)}
          className="ml-1 hover:opacity-70"
        >
          ×
        </button>
      )}
    </span>
  );
};
