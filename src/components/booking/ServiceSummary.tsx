import { Card, CardContent } from "@/components/ui/card";
import { ServiceItem } from "@/types/database";
import { Collection } from "@/types/database";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceSummaryProps {
  selectedItems: ServiceItem[];
  selectedCollection?: Collection;
  shopLocationId?: string | null;
  nailArtistId?: string | null;
}

export const ServiceSummary = ({
  selectedItems,
  selectedCollection,
}: ServiceSummaryProps) => {
  const collectionPrice = selectedCollection?.totalPrice || 0;
  const itemsPrice = selectedItems.reduce(
    (sum, item) => sum + Number(item.price),
    0,
  );
  const localTotalPrice = collectionPrice + itemsPrice;

  const collectionDuration =
    selectedCollection?.estimatedDuration ||
    selectedCollection?.calculatedDuration ||
    0;
  const itemsDuration = selectedItems.reduce(
    (sum, item) => sum + (item.estimatedDuration || 0),
    0,
  );
  const localTotalDuration = collectionDuration + itemsDuration;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-[#E288F9]" />
          <h2 className="font-black uppercase tracking-tight text-slate-800">
            Dịch vụ đã chọn
          </h2>
        </div>

        <div className="space-y-3">
          {/* Collection Section */}
          {selectedCollection && (
            <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                {selectedCollection.imageUrl ? (
                  <img
                    src={selectedCollection.imageUrl}
                    alt={selectedCollection.name}
                    className="w-14 h-14 rounded-xl object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#950101] to-[#D81B60] flex items-center justify-center shadow-sm">
                    <span className="text-lg font-bold text-white uppercase">
                      {selectedCollection.name?.[0] || "S"}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 tracking-tight">
                    {selectedCollection.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    Set Nail
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-[#950101]">
                    {(selectedCollection.totalPrice || 0).toLocaleString()} đ
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Services Section */}
          {selectedItems.length > 0 && (
            <div className={cn("space-y-2", selectedCollection && "mt-2")}>
              {selectedCollection && (
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  Dịch vụ thêm
                </h4>
              )}
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 px-3 bg-white rounded-xl border border-slate-100 shadow-sm"
                  >
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-bold text-[#950101]">
                      {Number(item.price).toLocaleString()} đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!selectedCollection && selectedItems.length === 0 && (
            <div className="text-center py-6">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">
                Chưa có dịch vụ nào được chọn
              </p>
            </div>
          )}

          {/* Total Section */}
          {(selectedCollection || selectedItems.length > 0) && (
            <div className="pt-3 mt-2 border-t-2 border-dashed border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">
                  Tổng cộng
                </span>
                <span className="text-2xl font-black text-[#950101]">
                  {localTotalPrice.toLocaleString()} đ
                </span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Thời gian dự kiến:</span>
                <span>{localTotalDuration} phút</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};