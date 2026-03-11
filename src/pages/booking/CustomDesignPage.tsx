import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCustomerServiceItems } from "@/hooks/useCustomer";
import { ServiceItem } from "@/types/database";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import ServiceItemCard from "@/components/serviceItem/ServiceItemCard";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const CustomDesignPage = () => {
  const { shopId, id } = useParams<{
    shopId?: string;
    id?: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { groupedItems, serviceItems, isLoading } = useCustomerServiceItems(
    shopId,
    id,
  );

  const allItems: ServiceItem[] = Object.values(groupedItems || {}).flat();
  const [selectedItems, setSelectedItems] = useState<ServiceItem[]>([]);

  const handleBookNow = () => {
    const bookingState: any = {
      selectedItems,
      type: shopId ? "shop" : "artist",
      customerProfileId: user?.userId,
    };

    if (shopId) {
      bookingState.shopId = shopId;
    } else if (id) {
      bookingState.nailArtistId = id;
    }

    navigate(`/customer-book`, { state: bookingState });
  };
  
  const toggleItem = (item: ServiceItem) => {
    const isSelected = selectedItems.some((s) => s.id === item.id);
    if (isSelected) {
      setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          
          <Button variant="outline" onClick={() => navigate(-1)} disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // No services available state
  if (allItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1
                className="font-black tracking-tight uppercase text-xl bg-clip-text text-transparent pb-1"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
                  WebkitBackgroundClip: "text",
                }}
              >
                Custom Design
              </h1>
            </div>
          </div>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
            <div>
              <h2 className="text-xl font-bold mb-2">No services available</h2>
              <p className="text-slate-500">
                {shopId
                  ? "This shop doesn't have any services available for custom design yet."
                  : "This artist doesn't have any services available for custom design yet."}
              </p>
            </div>
            <div className="space-y-2 pt-4">
              <Button onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              {shopId && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/shop/${shopId}`)}
                  className="w-full"
                >
                  View Shop Profile
                </Button>
              )}
              {id && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/artist/${id}`)}
                  className="w-full"
                >
                  View Artist Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      {/* 1. Header: Fixed and Glassmorphic */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full bg-slate-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1
              className="font-black tracking-tight uppercase text-xl bg-clip-text text-transparent pb-1"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
                WebkitBackgroundClip: "text",
              }}
            >
              Custom Design
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Tap to select services
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center bg-slate-50 rounded-2xl p-3">
          <Badge className="bg-[#950101] text-white border-none font-black px-3 py-1 text-[10px] uppercase">
            {selectedItems.length}{" "}
            {selectedItems.length === 1 ? "Item" : "Items"}
          </Badge>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-400 uppercase leading-none">
              Total
            </span>
            <span className="text-sm font-black text-slate-900">
              {selectedItems
                .reduce((sum, item) => sum + Number(item.price), 0)
                .toLocaleString()}{" "}
              VND
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Content: 2-Column Grid */}
      <div className="flex-1 p-4 pb-32">
        {allItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {allItems.map((item: ServiceItem) => {
              const isSelected = selectedItems.some((s) => s.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item)}
                  className={cn(
                    "relative group cursor-pointer rounded-[2rem] transition-all duration-300 border-2 overflow-hidden bg-white",
                    isSelected
                      ? "border-[#950101] shadow-lg ring-4 ring-[#950101]/50"
                      : "border-transparent shadow-sm hover:border-slate-100",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                      isSelected
                        ? "bg-[#950101] scale-100"
                        : "bg-black/10 scale-0 opacity-0",
                    )}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  <div
                    className={cn(
                      "transition-opacity duration-300",
                      isSelected ? "opacity-100" : "opacity-90",
                    )}
                  >
                    <ServiceItemCard item={item} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 mx-4">
            <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              No services found
            </p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
        <Button
          onClick={handleBookNow}
          disabled={selectedItems.length === 0}
          style={
            selectedItems.length > 0
              ? {
                background:
                  "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
                border: "none",
              }
              : { background: "#0F172A", border: "none" }
          }
          className={cn(
            "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all active:scale-95 text-white",
            selectedItems.length > 0
              ? "shadow-orange-100"
              : "cursor-not-allowed",
          )}
        >
          {selectedItems.length === 0 ? (
            <span>Select to Continue</span>
          ) : (
            <div className="flex justify-between w-full items-center px-2">
              <span>Continue Booking</span>
              <div className="h-6 w-[1px] bg-white/20" />
              <span className="flex items-center gap-1">
                Next <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
