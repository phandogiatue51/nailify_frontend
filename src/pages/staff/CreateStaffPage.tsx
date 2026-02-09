import { useNavigate } from "react-router-dom";
import { useStaff } from "@/hooks/useStaff";
import { StaffForm } from "@/components/staff/StaffForm";
import { useShopOwnerLocations } from "@/hooks/useLocation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
export const CreateStaffPage = () => {
  const navigate = useNavigate();
  const { locations, isLoading: locationsLoading } = useShopOwnerLocations();
  const { createStaff } = useStaff();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createStaff.mutateAsync(formData);
      navigate("/staff-management");
    } catch (error) {
      console.error("Failed to create staff:", error);
    }
  };

  if (locationsLoading) {
    return <div>Loading locations...</div>;
  }

  return (
    <div className="pb-10">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/staff-management")}
          className="rounded-2xl bg-slate-50 mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Staff Directory
        </span>
      </div>

      <StaffForm
        mode="create"
        locations={locations || []}
        onSubmit={handleSubmit}
        isLoading={createStaff.isPending}
      />
    </div>
  );
};
