"use client";

import { shopAPI } from "@/services/api";
import { Shop } from "@/types/database";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Phone, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function ShopInfoPage() {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Checking for Shop Owner (1) or Manager (3)
  const isAdminView = user?.role === 1 || user?.role === 3;

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const data = await shopAPI.getById(id!);
        setShop(data);
      } catch (error) {
        console.error("Failed to load shop:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [id]);

  if (loading) return <LoadingState />;
  if (!shop) return <NotFoundState />;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="relative h-64 w-full overflow-hidden">
        {shop.coverUrl ? (
          <div className="space-y-2">
            <img
              src={shop.coverUrl}
              alt="Cover"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center" />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Navigation Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 p-2 bg-black/10 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-all"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
      </div>
      <div className="w-full mx-auto px-4 -mt-16 relative z-10">
        {/* 2. IDENTITY CARD */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-[#950101]/5 border border-slate-50">
          <div className="flex flex-col items-center text-center">
            <div className="p-1 bg-white rounded-full shadow-lg -mt-20">
              {shop.logoUrl ? (
                <div className="space-y-2">
                  <img
                    src={shop.logoUrl}
                    alt="Logo"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 object-cover rounded-full bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                  <span className="text-5xl font-bold text-white uppercase">
                    {shop.name?.[0] || "U"}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                {shop.name}
              </h1>
            </div>

            <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed px-4">
              {shop.description ?? "N/A"}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4">
            {/* Contact Info Items */}
            <ContactItem
              icon={<Phone className="w-4 h-4" />}
              label="Số điện thoại"
              value={shop.phone}
            />
            <ContactItem
              icon={<Mail className="w-4 h-4" />}
              label="Địa chỉ email"
              value={shop.email}
            />
          </div>
        </div>

        {/* 3. ADMIN/OWNER VIEW STATS */}
        {/* {isAdminView && (
          <div className="mt-6 bg-[#950101] rounded-[2rem] p-6 text-white shadow-lg shadow-[#950101]/20">
            <h3 className="font-black uppercase tracking-widest text-[10px] text-[#FFCFE9] mb-4">
              Shop Management
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-3">
                <p className="text-[10px] font-bold opacity-60 uppercase">
                  Status
                </p>
                <p className="font-black text-sm uppercase">
                  {shop.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3">
                <p className="text-[10px] font-bold opacity-60 uppercase">
                  Joined
                </p>
                <p className="font-black text-sm uppercase">
                  {new Date(shop.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* 4. ACTIONS */}
        <div className="mt-8 space-y-3">
          <Button
            onClick={() => navigate(`/shop/${shop.id}`)}
            className="w-full h-14 rounded-2xl bg-[#950101] text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-[#950101]/20 transition-all active:scale-[0.98]"
          >
            Xem trang cửa hàng
          </Button>
        </div>
      </div>
    </div>
  );
}

// Reusable Contact Component
function ContactItem({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-[#FFCFE9]/50 flex items-center justify-center text-[#950101] group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-700">{value ?? "N/A"}</p>
      </div>
    </div>
  );
}

// Sub-components for states
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white p-8 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-3xl">
        💅
      </div>
      <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
        Không tìm thấy cửa hàng
      </h2>
      <p className="text-slate-400 text-sm mt-2">
        Cửa hàng bạn đang tìm kiếm có thể đã ngừng hoạt động.
      </p>
    </div>
  );
}
