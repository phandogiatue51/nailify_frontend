import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStaff } from "@/hooks/useStaff";
import { useShopOwnerLocations } from "@/hooks/useLocation";
import { StaffForm } from "@/components/staff/StaffForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
export const EditStaffPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { locations, isLoading: locationsLoading } = useShopOwnerLocations();
  const { useStaffById, updateStaff } = useStaff();

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

      navigate("/staff-management");
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
    <div>
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
          Edit Member
        </span>
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
