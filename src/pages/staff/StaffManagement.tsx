import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStaff } from "@/hooks/useStaff";
import { useShopOwnerLocations } from "@/hooks/useLocation";
import { StaffList } from "@/components/staff/StaffList";
import { StaffFilter } from "@/components/staff/StaffFilter";
import { Button } from "@/components/ui/button";
import { Plus, Users, Sparkles } from "lucide-react";

export const StaffManagement = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    SearchTerm: "",
    IsActive: undefined as boolean | undefined,
    ShopLocationId: "",
  });

  const { locations } = useShopOwnerLocations();
  const { staffList, isStaffListLoading, updateStaffStatus, useFilteredStaff } =
    useStaff();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleStatus = (staffId: string) => {
    setUpdatingId(staffId);
    updateStaffStatus.mutate(staffId, {
      onSettled: () => setUpdatingId(null),
    });
  };

  const { data: displayStaff = [] } = useFilteredStaff(filters);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 space-y-6 bg-slate-50/30 min-h-screen">
      <div className="pt-4 text-center">

        <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic pb-2">
          Quản lý nhân sự
        </h1>

      <Button
        onClick={() => navigate("/staff/create")}
        className="h-10 px-8 font-black tracking-widest uppercase rounded-full shadow-lg shadow-[#950101]/20 hover:scale-[1.02] transition-transform"
        style={{
          background: "linear-gradient(135deg, #950101 0%, #D81B60 100%)"
        }}
      >
        <Plus className="w-5 h-5 stroke-[3px]" />
        Thêm quản lý
      </Button>
      </div>
      <div>
        <StaffFilter
          filters={filters}
          locations={locations}
          onFilterChange={handleFilterChange}
          onClearFilters={() =>
            setFilters({
              SearchTerm: "",
              IsActive: undefined,
              ShopLocationId: "",
            })
          }
        />
      </div>

      <div className="mt-4">
        <StaffList
          staff={displayStaff}
          isLoading={isStaffListLoading}
          onToggleStatus={handleToggleStatus}
          updatingId={updatingId}
        />

      </div>
    </div>
  );
};
