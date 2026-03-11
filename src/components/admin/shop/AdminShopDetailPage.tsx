"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopDetailView from "./ShopDetailView";

const AdminShopDetailPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-10 h-10 animate-spin text-[#950101]" /></div>;
  if (!user || user?.role !== 2) return <Navigate to="/auth" replace />;
  if (!shopId) return <Navigate to="/admin/shops" replace />;

  return (
    <div className="container mx-auto p-8 max-w-[1200px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/admin/shops")}
        className="group hover:bg-transparent p-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#950101] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Quay lại danh sách
      </Button>

      <div className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <ShopDetailView shopId={shopId} />
      </div>
    </div>
  );
};

export default AdminShopDetailPage;
