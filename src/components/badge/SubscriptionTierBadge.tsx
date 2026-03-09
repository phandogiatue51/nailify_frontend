import { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import { Subscription } from "@/types/database";
import { subscriptionAPI } from "@/services/api";
type Size = "sm" | "md" | "lg";

export const SubscriptionTierBadge = ({
  planId,
  size = "sm", // default size
}: {
  planId: string;
  size?: Size;
}) => {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) return;
    subscriptionAPI
      .getById(planId)
      .then((data) => setSub(data))
      .catch((err) => console.error("Failed to load tier details", err))
      .finally(() => setLoading(false));
  }, [planId]);

  // Skeleton loader
  if (loading) {
    const skeletonClasses =
      size === "lg" ? "h-10 w-40" : size === "md" ? "h-8 w-32" : "h-6 w-24";
    return (
      <div
        className={`${skeletonClasses} bg-gray-200 animate-pulse rounded-full border border-gray-300`}
      />
    );
  }

  if (!sub) return null;

  const IconComponent = sub.iconUrl ? (FaIcons as any)[sub.iconUrl] : null;

  // Size maps
  const sizeClasses = {
    sm: "px-3 py-1 text-xs gap-2",
    md: "px-4 py-2 text-sm gap-2.5",
    lg: "px-8 py-4 text-xl gap-3",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  return (
    <span
      style={{
        background:
          sub.colorHex || "linear-gradient(to right, #e2e8f0, #cbd5e1)",
      }}
      className={`rounded-full font-bold shadow-sm inline-flex items-center text-gray-900 ${sizeClasses[size]}`}
    >
      {IconComponent && <IconComponent className={iconSizes[size]} />}
      {sub.name}
    </span>
  );
};
