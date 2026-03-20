import { useState, useMemo } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useAllCustomerService, useServiceItems } from "@/hooks/useCustomer";
import { ServiceItem } from "@/types/database";
import { ServiceItemFilterDto } from "@/types/filter";
import { Plus, Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddOnsDrawerProps {
  shopId?: string;
  nailArtistId?: string;
  selectedItems: ServiceItem[];
  onAddItems: (items: ServiceItem[]) => void;
}

export const AddOnsDrawer = ({
  shopId,
  nailArtistId,
  selectedItems,
  onAddItems,
}: AddOnsDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [localSelection, setLocalSelection] = useState<ServiceItem[]>([]);

  // Configure filters based on shop or artist
  const serviceFilterParams = useMemo(() => {
    const params: ServiceItemFilterDto = {};
    if (shopId) params.ShopId = shopId;
    if (nailArtistId) params.NailArtistId = nailArtistId;
    return params;
  }, [shopId, nailArtistId]);

  // Fetch services only when open
  const { data: serviceItems = [], isLoading } = useServiceItems(
    serviceFilterParams,
    { enabled: open },
  );

  const handleOpen = () => {
    setLocalSelection([...selectedItems]);
    setOpen(true);
  };

  const toggleItem = (item: ServiceItem) => {
    setLocalSelection((prev) => {
      const isSelected = prev.find((i) => i.id === item.id);
      if (isSelected) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleConfirm = () => {
    onAddItems(localSelection);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full mt-4 border-dashed border-[#E288F9] text-[#E288F9] hover:bg-[#E288F9]/5 rounded-xl h-12 font-bold"
          onClick={handleOpen}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm dịch vụ đi kèm
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-black uppercase text-center">
              Dịch vụ đi kèm
            </DrawerTitle>
            <DrawerDescription className="text-center italic">
              Chọn thêm các dịch vụ lẻ để hoàn thiện bộ Nail của bạn
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 overflow-y-auto max-h-[50vh] space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
              </div>
            ) : serviceItems.length > 0 ? (
              serviceItems.map((item) => {
                const isSelected = !!localSelection.find(
                  (i) => i.id === item.id,
                );
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer",
                      isSelected
                        ? "border-[#E288F9] bg-[#E288F9]/5 shadow-sm"
                        : "border-slate-100 bg-white hover:border-slate-200",
                    )}
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold text-slate-400 uppercase">
                          {item.estimatedDuration} phút
                        </span>
                        <span className="text-sm font-black text-[#950101]">
                          {Number(item.price).toLocaleString()} đ
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all",
                        isSelected
                          ? "bg-[#E288F9] border-[#E288F9] text-white"
                          : "border-slate-200 text-transparent",
                      )}
                    >
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-slate-500 py-8 italic">
                Không có dịch vụ đi kèm
              </p>
            )}
          </div>

          <DrawerFooter className="flex-row gap-3 pt-2 pb-6">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-12 font-bold"
              >
                Hủy
              </Button>
            </DrawerClose>
            <Button
              className="flex-1 rounded-xl h-12 font-bold bg-[#E288F9] hover:bg-[#d477eb]"
              onClick={handleConfirm}
            >
              Xác nhận ({localSelection.length})
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
