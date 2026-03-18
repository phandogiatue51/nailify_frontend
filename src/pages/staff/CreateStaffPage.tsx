import { useNavigate } from "react-router-dom";
import { useStaff } from "@/hooks/useStaff";
import { StaffForm } from "@/components/staff/StaffForm";
import { useShopOwnerLocations } from "@/hooks/useLocation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export const CreateStaffPage = () => {
  const navigate = useNavigate();
  const { locations, isLoading: locationsLoading } = useShopOwnerLocations();
  const { createStaff } = useStaff();
  const queryClient = useQueryClient();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createStaff.mutateAsync(formData);

      navigate("/staff-management");

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["staff-filter"] });
      }, 100);
      
    } catch (error) {
      console.error("Failed to create staff:", error);
    }
  };

  if (locationsLoading) {
    return <div>Loading locations...</div>;
  }

  return (
    <div className="p-6 bg-slate-50">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/staff-management")}
          className="rounded-2xl bg-slate-50 mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
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
