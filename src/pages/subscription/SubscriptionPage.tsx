import { SubscriptionList } from "@/components/subscription/SubscriptionList";
import Header from "@/components/ui/header";
import { useState } from "react";
export const SubscriptionPage = () => {
  const [selectedId, setSelectedId] = useState<string>();

  return (
    <div>
      <Header title="Nailify" />

      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase mb-4">
          Gói đăng ký
        </h1>
        <SubscriptionList onSelect={setSelectedId} selectedId={selectedId} />
      </div>
    </div>
  );
};
