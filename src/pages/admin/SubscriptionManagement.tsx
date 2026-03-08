import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { CreditCard, Loader2 } from "lucide-react";
import { SubscriptionForm } from "@/components/admin/subscriptions/SubscriptionForm";
import { SubscriptionList } from "@/components/admin/subscriptions/SubscriptionList";
import { Card, CardContent } from "@/components/ui/card";

const SubscriptionManagement = () => {
  const { user, loading } = useAuthContext();
  const [selectedId, setSelectedId] = useState<string>();
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleSubscriptionUpdate = () => {
    setRefreshCounter((prev) => prev + 1);
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user?.role !== 2) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
            Quản lý gói đăng ký
          </h1>
          <p className="text-sm font-bold text-slate-400 italic">
            Quản lý các gói đăng ký
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-[#950101]">
              Nailify Dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar List */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-6">
            <SubscriptionList
              onSelect={setSelectedId}
              selectedId={selectedId}
              refreshTrigger={refreshCounter}
            />
          </div>
        </div>

        {/* Form Detail Area */}
        <div className="md:col-span-8 lg:col-span-9">
          {selectedId ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <SubscriptionForm
                subscriptionId={selectedId}
                onClose={() => setSelectedId(undefined)}
                onSuccess={handleSubscriptionUpdate}
              />
            </div>
          ) : (
            <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-20 text-center">
                <div className="bg-white w-20 h-20 rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  Chưa chọn gói đăng ký nào
                </h3>
                <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto mt-2 italic">
                  Chọn một gói đăng ký để xem chi tiết hoặc cập nhật
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
