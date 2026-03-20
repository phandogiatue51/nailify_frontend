import { ServiceItem } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { ComponentBadge } from "../badge/ComponentBadge";
import { cn } from "@/lib/utils";
import { Check, Edit2, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ServiceItemCardProps {
  item: ServiceItem;
  selected?: boolean;
  onSelect?: (item: ServiceItem) => void;
  showActions?: boolean;
  onEdit?: (item: ServiceItem) => void;
  onDelete?: (item: ServiceItem) => void;
}

const ServiceItemCard: React.FC<ServiceItemCardProps> = ({
  item,
  selected = false,
  onSelect,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(item);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden cursor-pointer transition-all duration-300 border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-[2rem] relative",
          selected && "ring-2 ring-[#E288F9] ring-offset-2",
          onSelect && "active:scale-[0.96]",
        )}
        onClick={() => onSelect?.(item)}
      >
        {/* 1. Action Buttons (Top Right) */}
        {showActions && (
          <div className="absolute top-3 right-3 z-30 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(item);
              }}
              className="p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-sm text-slate-700 hover:text-[#E288F9] active:scale-90 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-sm text-red-500 hover:bg-red-50 active:scale-90 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="relative bg-slate-100 overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-24 object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-24 bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
              <span className="text-5xl font-bold text-white uppercase">
                {item.name?.[0] || "U"}
              </span>
            </div>
          )}

          {/* 2. Floating Badge (Top Left) */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <ComponentBadge role={item.componentType} />
          </div>

          {/* 3. Selected State Overlay (Only shown when not in 'showActions' mode) */}
          {selected && !showActions && (
            <div className="absolute inset-0 bg-[#E288F9]/10 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
              <div className="w-10 h-10 bg-[#E288F9] rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-1">
          <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">
            {item.name}
          </h3>

          <div className="flex items-center justify-between gap-1 pt-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
              {item.estimatedDuration} phút
            </p>
            <p className="text-sm font-black text-[#950101]">
              {Number(item.price).toLocaleString()}đ
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-[2.5rem] p-10">
          <AlertDialogHeader className="space-y-4">
            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-slate-900">
              Xác nhận xóa
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium italic text-lg leading-relaxed">
              Bạn có chắc muốn xóa dịch vụ{" "}
              <span className="text-[#950101] font-black">"{item.name}"</span>?
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-6 ">
            <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-xs border-slate-200">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="rounded-xl font-bold uppercase tracking-widest text-xs bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServiceItemCard;
