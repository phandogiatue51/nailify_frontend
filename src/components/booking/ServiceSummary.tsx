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
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-primary" />
          <h2 className="font-black uppercase tracking-tight">
            Dịch vụ đã chọn
          </h2>
        </div>

        <div className="space-y-4">
          {selectedCollection && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                {selectedCollection.imageUrl ? (
                  <img
                    src={selectedCollection.imageUrl}
                    alt={selectedCollection.name}
                    className="w-16 h-16 rounded-xl object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center shadow-sm">
                    <span className="text-xl font-bold text-white uppercase">
                      {selectedCollection.name?.[0] || "U"}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-800 tracking-tight">
                    {selectedCollection.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Set Nail
                  </p>
                </div>
              </div>

              <div className="flex justify-between text-sm pt-1 border-t border-slate-200/50 mt-2">
                <span className="text-slate-500 font-medium">Giá set:</span>
                <span className="font-bold text-slate-900">
                  {(selectedCollection.totalPrice || 0).toLocaleString()} đ
                </span>
              </div>
            </div>
          )}

          {selectedItems.length > 0 && (
            <div className={cn("space-y-2", selectedCollection && "pt-2")}>
              {selectedCollection && (
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                  Dịch vụ đi kèm
                </h4>
              )}
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 px-3 bg-white rounded-xl border border-slate-100 text-sm"
                  >
                    <span className="font-bold text-slate-600">{item.name}</span>
                    <span className="font-bold text-[#950101]">
                      {Number(item.price).toLocaleString()} đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!selectedCollection && selectedItems.length === 0 && (
            <p className="text-muted-foreground text-center py-4 italic">
              Không có dịch vụ
            </p>
          )}

          {(selectedCollection || selectedItems.length > 0) && (
            <div className="pt-4 border-t border-slate-200 border-dashed space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">
                  Tổng cộng
                </span>
                <span className="text-xl font-black text-[#950101]">
                  {localTotalPrice.toLocaleString()} đ
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-tight">
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
