import { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import { Subscription } from "@/types/database";
import { subscriptionAPI } from "@/services/api";

export const SubscriptionTierBadge = ({ planId }: { planId: string }) => {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) return;

    subscriptionAPI.getById(planId)
      .then((data) => setSub(data))
      .catch((err) => console.error("Failed to load tier details", err))
      .finally(() => setLoading(false));
  }, [planId]);

  // Loading State (Shimmer/Skeleton)
  if (loading) {
    return (
      <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full border border-gray-300" />
    );
  }

  if (!sub) return null;

  // Resolve the icon from the string name (e.g., "FaRainbow")
  const IconComponent = sub.iconUrl ? (FaIcons as any)[sub.iconUrl] : null;

  return (
    <span
      style={{
        background: sub.colorHex || "linear-gradient(to right, #e2e8f0, #cbd5e1)",
        border: "1px solid rgba(0,0,0,0.1)"
      }}
      className="px-3 py-1 rounded-full text-xs font-bold shadow-sm inline-flex items-center gap-2 text-gray-900"
    >
      {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
      {sub.name}
    </span>
  );
};