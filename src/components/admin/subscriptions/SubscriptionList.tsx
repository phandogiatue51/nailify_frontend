import { useState, useEffect, useCallback } from "react";
import { Subscription } from "@/types/database";
import { subscriptionAPI } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { Icons } from "@/components/ui/icons";

interface SubscriptionListProps {
  onSelect: (id: string) => void;
  selectedId?: string;
  refreshTrigger?: number;
}

export const SubscriptionList = ({
  onSelect,
  selectedId,
  refreshTrigger,
}: SubscriptionListProps) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subscriptionAPI.getAll();
      setSubscriptions(data);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions, refreshTrigger]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {subscriptions.map((sub) => {
        const isSelected = selectedId === sub.id;
        const IconComponent =
          Icons[sub.iconUrl as keyof typeof Icons] || Icons.FaGem;

        return (
          <button
            key={sub.id}
            onClick={() => onSelect(sub.id)}
            style={{ background: sub.colorHex }}
            className={`relative w-full text-left overflow-hidden rounded-2xl transition-all duration-500 group border-2 ${
              isSelected
                ? "border-[#950101] scale-[1] shadow-lg shadow-[#950101]/20"
                : "border-transparent bg-slate-50 hover:bg-white hover:scale-[1.01] hover:shadow-md"
            }`}
          >
            <div
              className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
              style={{ background: "#e2e8f0" }}
            />

            <div className="relative p-4 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <div
                  className="p-2 rounded-xl shadow-sm bg-white"
                  style={{
                    color: sub.colorHex?.includes("gradient")
                      ? "#950101"
                      : sub.colorHex,
                  }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                {isSelected && (
                  <div className="bg-[#950101] text-white p-1 rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="mt-4 text-white">
                <h3
                  className={`font-black uppercase text-lg tracking-[0.1em] mb-1`}
                >
                  {sub.name || "Unnamed Plan"}
                </h3>

                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black">
                    {sub.price ? Number(sub.price).toLocaleString() : "0"} đ
                  </span>
                  <span className="text-sm font-bold uppercase tracking-tight">
                    / {sub.durationDays || "?"} ngày
                  </span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
