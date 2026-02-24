import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStaff } from "@/hooks/useStaff";
import { useShopOwnerLocations } from "@/hooks/useLocation";
import { StaffList } from "@/components/staff/StaffList";
import { StaffFilter } from "@/components/staff/StaffFilter";
import MobileLayout from "@/components/layout/MobileLayout";
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

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== undefined,
  );

  const { data: filteredStaff = [] } = useFilteredStaff(
    hasActiveFilters ? filters : { SearchTerm: "" },
  );

  const displayStaff = hasActiveFilters ? filteredStaff : staffList || [];

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 space-y-6 bg-slate-50/30 min-h-screen">
      <div className="flex items-center justify-between p-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[#E288F9]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Team Portal
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900">
            Staff Management
          </h1>
        </div>
        <Button
          onClick={() => navigate("/staff/create")}
          className="bg-[#E288F9] hover:bg-[#d07ae6] rounded-2xl shadow-lg shadow-purple-100 h-12 px-4"
        >
          <Plus className="w-5 h-5 mr-1" />
          <span className="font-bold">Add Staff</span>
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
          onToggleStatus={(id) => updateStaffStatus.mutateAsync(id)}
        />
      </div>
    </div>
  );
};
