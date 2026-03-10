import { useState, useEffect, useCallback } from "react";
import { Subscription } from "@/types/database";
import { subscriptionAPI } from "@/services/api";
import { Check, Loader2, ChevronRight } from "lucide-react";
import * as Icons from "react-icons/fa";
import SubscriptionCard from "./SubscriptionCard";

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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await subscriptionAPI.getAll();
        setSubscriptions(data);
        if (data.length > 0 && !selectedId) {
          onSelect(data[0].id);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshTrigger]);

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {subscriptions.slice(0, 4).map((sub) => {
          const isSelected = selectedId === sub.id;
          const IconComponent =
            (Icons as any)[sub.iconUrl || ""] || Icons.FaGem;

          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.id)}
              style={{ background: sub.colorHex || "#950101" }}
              className={`relative flex flex-col items-center justify-center p-4 rounded-[2rem] transition-all duration-300  h-32 ${
                isSelected
                  ? "border-[#950101] bg-white shadow-xl scale-[1.05] z-10"
                  : "border-transparent bg-slate-50 opacity-60 scale-95"
              }`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-sm">
                <IconComponent className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-black uppercase text-lg text-white truncate w-full text-center">
                {sub.name}
              </h3>
              <p className="text-[15px] font-bold text-[#950101]">
                {Number(sub.price).toLocaleString()}đ
              </p>
            </button>
          );
        })}
      </div>

      {/* Persistent Detail Space Underneath */}
      <div className="relative min-h-[400px]">
        {selectedId && (
          <div
            key={selectedId}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
              <SubscriptionCard
                subscriptionId={selectedId}
                onClose={() => {}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
