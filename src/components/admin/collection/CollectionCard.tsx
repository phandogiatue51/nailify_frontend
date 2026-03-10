import { Collection } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Clock,
  DollarSign,
  Building,
  User,
  Layers,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DateDisplay from "@/components/ui/date-display";

interface CollectionCardProps {
  collection: Collection;
  onViewDetails: () => void;
}

export const CollectionCard = ({
  collection,
  onViewDetails,
}: CollectionCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-2 border-slate-100 rounded-[2.5rem] transition-all duration-500 hover:border-[#950101] hover:shadow-2xl hover:shadow-[#950101]/10 bg-white flex flex-col h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Image & Header Section */}
        <div className="relative mb-6">
          <div className="aspect-[16/10] overflow-hidden rounded-3xl border-2 border-white shadow-md">
            {collection.imageUrl ? (
              <img
                src={collection.imageUrl}
                alt={collection.name}
                className="w-full h-full object-cover  transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#950101] to-[#6b0101]">
                <span className="text-3xl font-black text-white uppercase italic">
                  {collection.name?.[0] || "C"}
                </span>
              </div>
            )}
          </div>

          {/* Status Badge Overlay */}
          <div className="absolute top-3 right-3">
            <Badge
              className={`border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest shadow-sm ${
                collection.isActive
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-500 text-white"
              }`}
            >
              {collection.isActive ? "Hoạt động" : "Hủy bỏ"}
            </Badge>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-[#950101] transition-colors line-clamp-1">
              {collection.name}
            </h3>
          </div>

          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest line-clamp-2  h-8 leading-relaxed">
            {collection.description || "Nailify Exclusive Collection"}
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-50 p-1.5 rounded-lg">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-black text-slate-700 tracking-tight">
                {collection.totalPrice?.toLocaleString()}{" "}
                <span className="text-[10px]">VND</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-sm font-black text-slate-700 tracking-tight">
                {collection.estimatedDuration ?? collection.calculatedDuration}{" "}
                <span className="text-[10px]">phút</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {collection.shopId ? (
                <Building className="w-3.5 h-3.5 text-[#950101]/40" />
              ) : collection.nailArtistId ? (
                <User className="w-3.5 h-3.5 text-[#950101]/40" />
              ) : (
                <Layers className="w-3.5 h-3.5 text-[#950101]/40" />
              )}
              <span>
                {collection.shopId
                  ? "Bộ sưu tập cửa hàng"
                  : collection.nailArtistId
                    ? "Tác phẩm nghệ sĩ"
                    : "Chung"}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full rounded-2xl font-black uppercase tracking-widest text-[10px] h-11 text-[#950101] hover:text-[#950101] hover:bg-red-50 transition-all border border-transparent hover:border-red-100 shadow-md"
            onClick={onViewDetails}
          >
            <Eye className="w-4 h-4 mr-2" />
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionCard;
