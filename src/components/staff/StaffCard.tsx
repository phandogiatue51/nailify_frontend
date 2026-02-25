import { Link } from "react-router-dom";
import { StaffViewDto } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "../ui/confirmation-dialog";

interface StaffCardProps {
  staff: StaffViewDto;
  onToggleStatus: () => void;
  isUpdating?: boolean;
}

export const StaffCard = ({ staff, onToggleStatus, isUpdating }: StaffCardProps) => {
  return (
    <Card className="group overflow-hidden border shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 rounded-[2rem] bg-white">
      <CardContent className="p-5">
        <div className="grid grid-cols-[auto,1fr] gap-4 mb-4">
          <div className="w-24 h-28 rounded-2xl bg-[#FFC988]/20 flex items-center justify-center text-xl border-2 border-white shadow-sm overflow-hidden">
            {staff.avatarUrl && (
              <img
                src={staff.avatarUrl}
                className="w-full h-full object-cover"
                alt=""
              />
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-black text-slate-800 leading-tight">
                  {staff.fullName || "Unnamed Staff"}
                </h4>
                <Badge
                  className={cn(
                    "text-[10px] font-black uppercase tracking-tighter border-none px-2",
                    staff.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-500",
                  )}
                >
                  {staff.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <Link to={`/staff/${staff.staffId}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-slate-50"
                >
                  <ExternalLink className="text-slate-400" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 font-bold text-slate-400">
              <Mail className="w-4 h-4" />
              <span className="text-[12px]">{staff.email || "No Email"}</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-400">
              <Phone className="w-4 h-4" />
              <span className="text-[12px]">{staff.phone || "No Phone"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 px-2">
          <Link to={`/staff/edit/${staff.staffId}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full h-10 rounded-2xl text-[12px] font-black uppercase tracking-widest border text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
            >
              Edit
            </Button>
          </Link>

          <ConfirmationDialog
            onConfirm={() => onToggleStatus()}
            title={staff.isActive ? "Xác nhận vô hiệu hóa" : "Xác nhận kích hoạt"}
            description={
              staff.isActive
                ? `Hành động này sẽ vô hiệu hóa tài khoản nhân viên ${staff.fullName}.`
                : `Hành động này sẽ kích hoạt lại tài khoản nhân viên ${staff.fullName}.`
            }
            confirmText={staff.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
            cancelText="Quay lại"
            variant={staff.isActive ? "destructive" : "default"}
            trigger={
              <Button
                disabled={isUpdating}
                variant="ghost"
                className={cn(
                  "flex-1 h-10 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all shadow-sm",
                  staff.isActive
                    ? "text-red-400 hover:bg-red-100 hover:text-red-500 border border-red-300"
                    : "text-green-500 hover:bg-green-100 hover:text-green-600 border border-green-300",
                )}
              >
                {isUpdating ? "Updating..." : staff.isActive ? "Disable" : "Enable"}
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
