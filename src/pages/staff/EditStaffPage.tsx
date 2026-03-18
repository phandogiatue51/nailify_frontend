import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStaff } from "@/hooks/useStaff";
import { useShopOwnerLocations } from "@/hooks/useLocation";
import { StaffForm } from "@/components/staff/StaffForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export const EditStaffPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { locations, isLoading: locationsLoading } = useShopOwnerLocations();
  const { useStaffById, updateStaff } = useStaff();
  const queryClient = useQueryClient();

  const { data: staff, isLoading: staffLoading } = useStaffById(id);
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (staff) {
      setInitialData({
        fullName: staff.fullName || "",
        email: staff.email || "",
        phone: staff.phone || "",
        address: staff.address || "",
        shopLocationId: staff.shopLocationId || "",
        avatarUrl: staff.avatarUrl || "",
      });
    }
  }, [staff]);

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;

    try {
      await updateStaff.mutateAsync({
        staffId: id,
        formData: formData,
      });

      await queryClient.invalidateQueries({ queryKey: ["staff", id] });

      navigate("/staff-management");

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["staff-filter"] });
      }, 100);
    } catch (error) {
      console.error("Failed to update staff:", error);
      toast({
        description: "Failed to update staff",
        variant: "destructive",
      });
    }
  };

  if (locationsLoading || staffLoading) {
    return <div>Loading...</div>;
  }

  if (!staff) {
    return <div>Staff not found</div>;
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
        mode="edit"
        initialData={staff}
        locations={locations || []}
        onSubmit={handleSubmit}
        isLoading={updateStaff.isPending}
      />
    </div>
  );
};
