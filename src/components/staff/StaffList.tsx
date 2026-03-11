import { StaffViewDto } from "@/types/database";
import { StaffCard } from "./StaffCard";
import { Loader2, UserPlus } from "lucide-react";

interface StaffListProps {
  staff: StaffViewDto[];
  isLoading: boolean;
  onToggleStatus: (staffId: string) => void;
  updatingId?: string | null;
}

export const StaffList = ({
  staff,
  isLoading,
  onToggleStatus,
  updatingId
}: StaffListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
       
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
          Members ({staff.length})
        </h3>
      </div>

      {staff.length === 0 ? (
        <div className="text-center py-16 px-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <UserPlus className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-500">No staff found.</p>
          <p className="text-xs text-slate-400 mt-1">
            Start by adding your first team member!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {staff.map((staffMember) => (
            <StaffCard
              key={staffMember.staffId}
              staff={staffMember}
              onToggleStatus={() => onToggleStatus(staffMember.staffId)}
              isUpdating={updatingId === staffMember.staffId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
