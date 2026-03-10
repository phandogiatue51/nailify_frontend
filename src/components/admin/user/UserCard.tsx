import { Profile } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, CheckCircle2, Eye } from "lucide-react";
import { RoleBadge } from "@/components/badge/RoleBadge";
interface UserCardProps {
  user: Profile;
  onViewDetails?: () => void;
  onUserUpdated?: () => void;
}

export const UserCard = ({ user, onViewDetails }: UserCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-2 border-slate-100 rounded-[2.5rem] transition-all duration-500 hover:border-[#950101] hover:shadow-2xl hover:shadow-[#950101]/10 bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center mb-3">
          <div className="relative">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-16 h-16 rounded-3xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-16 h-16 rounded-3xl border-2 border-white shadow-md flex items-center justify-center bg-gradient-to-br from-[#950101] to-[#6b0101]">
                <span className="text-2xl font-black text-white uppercase italic">
                  {user.fullName?.[0] || "U"}
                </span>
              </div>
            )}
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-white rounded-full ${user.isActive ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-slate-300"}`}
            />
          </div>
        </div>

        {/* Identity Section */}
        <div className="mb-3">
          <div className="flex items-center justify-center gap-2 mb-3">
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-[#950101] transition-colors ">
              {user.fullName}
            </h3>
            {user.isVerified && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
            )}
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <RoleBadge role={user.role} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Badge
            className={`border-none px-3 font-black text-[9px] uppercase tracking-widest ${user.isVerified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
          >
            {user.isVerified ? "Đã xác minh email" : "Chưa xác minh email"}
          </Badge>
        </div>

        {/* Contact Info with Nailify Red Accents */}
        <div className="space-y-2 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
            <Mail className="w-4 h-4 text-[#950101]/40" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <Phone className="w-4 h-4 text-[#950101]/40" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
        <div className="pt-4">
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

export default UserCard;
