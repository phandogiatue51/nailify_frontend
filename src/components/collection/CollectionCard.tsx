import { Collection } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TagBadge } from "../badge/TagBadge";
import { Edit2, Trash2 } from "lucide-react";
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

interface CollectionCardProps {
  collection: Collection;
  onClick?: (collection: Collection) => void;
  onSelect?: () => void;
  showActions?: boolean;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collection: Collection) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onClick,
  onSelect,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const itemCount = collection.items?.length || 0;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents card onClick
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(collection);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden cursor-pointer transition-all duration-300 border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-[2rem] h-auto pb-2 relative",
        )}
        onClick={() => {
          onClick?.(collection);
          onSelect?.();
        }}
      >
        {/* Action Buttons Overlay */}
        {showActions && (
          <div className="absolute top-3 right-3 z-30 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents card onClick
                onEdit?.(collection);
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

        <div className="relative bg-slate-50 overflow-hidden">
          {collection.imageUrl ? (
            <img
              src={collection.imageUrl}
              alt={collection.name}
              className="w-full h-24 object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-24 bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
              <span className="text-3xl font-bold text-white uppercase">
                {collection.name?.[0] || "U"}
              </span>
            </div>
          )}

          <div className="absolute bottom-3 left-3">
            <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none text-[10px] font-bold px-2 rounded-lg">
              {itemCount} dịch vụ
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-slate-800 text-sm truncate">
            {collection.name}
          </h3>

          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              ~{collection.calculatedDuration || collection.estimatedDuration}{" "}
              phút
            </span>
            <span className="text-sm font-black text-[#950101]">
              {Number(collection.totalPrice).toLocaleString()}đ
            </span>
          </div>

          {collection.tags && collection.tags.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {collection.tags.slice(0, 3).map((tag) => (
                  <TagBadge key={tag.id} tag={tag} size="sm" />
                ))}

                {collection.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{collection.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-[2.5rem] p-10 max-w-[400px]">
          <AlertDialogHeader className="space-y-4">
            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-slate-900">
              Xác nhận xóa
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium italic text-lg leading-relaxed">
              Bạn có chắc muốn xóa bộ set nail{" "}
              <span className="text-[#950101] font-black">
                "{collection.name}"
              </span>
              ?
              <span className="block mt-2">
                Hành động này không thể hoàn tác.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-6">
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

export default CollectionCard;
