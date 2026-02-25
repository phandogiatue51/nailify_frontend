// hooks/useStaff.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffAPI } from "@/services/api";
import { useToast } from "./use-toast";
import { StaffViewDto } from "@/types/database";
import { StaffFilterDto } from "@/types/filter";

export const useStaff = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: staffList,
    isLoading: isStaffListLoading,
    error: staffListError,
    refetch: refetchStaffList,
  } = useQuery({
    queryKey: ["staff-list"],
    queryFn: async () => {
      try {
        return await staffAPI.getAll();
      } catch (error: any) {
        toast({
          description: "Không thể tải danh sách nhân viên",
          variant: "destructive",
        });
        throw error;
      }
    },
  });

  const {
    data: currentStaff,
    isLoading: isCurrentStaffLoading,
    error: currentStaffError,
    refetch: refetchCurrentStaff,
  } = useQuery({
    queryKey: ["current-staff"],
    queryFn: async () => {
      try {
        const data = await staffAPI.getByAuth();
        return data || null;
      } catch (error: any) {
        if (
          error.message?.includes("404") ||
          error.message?.includes("not found") ||
          error.response?.status === 404
        ) {
          return null;
        }
        toast({
          description: "Không thể tải thông tin nhân viên",
          variant: "destructive",
        });
        throw error;
      }
    },
  });

  const useStaffById = (staffId: string) => {
    return useQuery({
      queryKey: ["staff", staffId],
      queryFn: async () => {
        try {
          return await staffAPI.getById(staffId);
        } catch (error: any) {
          if (error.message?.includes("404")) {
            return null;
          }
          toast({
            description: "Không thể tải thông tin nhân viên",
            variant: "destructive",
          });
          throw error;
        }
      },
      enabled: !!staffId,
    });
  };

  const useFilteredStaff = (filterParams: StaffFilterDto, enabled = true) => {
    return useQuery({
      queryKey: ["staff-filter", filterParams],
      queryFn: async () => {
        try {
          return await staffAPI.filter(filterParams);
        } catch (error: any) {
          toast({
            description: "Không thể lọc nhân viên",
            variant: "destructive",
          });
          throw error;
        }
      },
      enabled: enabled && Object.keys(filterParams).length > 0,
    });
  };

  const createStaff = useMutation({
    mutationFn: async (formData: FormData) => {
      return await staffAPI.createStaff(formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["staff-list"] });
      queryClient.invalidateQueries({ queryKey: ["staff-filter"] });
      toast({
        description: data.message,
        variant: "success",
        duration: 3000,
      });
      return data;
    },
    onError: (error: any) => {
      console.error("Error creating staff:", error);
      toast({
        description: error?.message,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const updateStaff = useMutation({
    mutationFn: async ({
      staffId,
      formData,
    }: {
      staffId: string;
      formData: FormData;
    }) => {
      return await staffAPI.updateStaff(staffId, formData);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["staff", variables.staffId], data);
      queryClient.invalidateQueries({ queryKey: ["staff-list"] });
      queryClient.invalidateQueries({ queryKey: ["current-staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-filter"] });

      toast({
        description: data.message,
        variant: "success",
        duration: 3000,
      });
      return data;
    },
    onError: (error: any) => {
      console.error("Error updating staff:", error);
      toast({
        description: error?.message,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const updateStaffStatus = useMutation({
    mutationFn: async (staffId: string) => {
      return await staffAPI.updateStatus(staffId);
    },
    onSuccess: (data, staffId) => {
      // Update cache with returned staff object
      queryClient.setQueryData(["staff", staffId], data);

      // Refresh lists
      queryClient.invalidateQueries({ queryKey: ["staff-list"] });
      queryClient.invalidateQueries({ queryKey: ["current-staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-filter"] });

      toast({
        description: "Trạng thái nhân viên đã được cập nhật",
        variant: "success",
        duration: 3000,
      });
    },
    onError: (error: any, staffId) => {
      queryClient.invalidateQueries({ queryKey: ["staff", staffId] });
      toast({
        description: error?.message || "Không thể cập nhật trạng thái",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  return {
    staffList,
    isStaffListLoading,
    staffListError,
    currentStaff,
    isCurrentStaffLoading,
    currentStaffError,

    useStaffById,
    useFilteredStaff,

    createStaff,
    updateStaff,
    updateStaffStatus,

    refetchStaffList,
    refetchCurrentStaff,
  };
};

export type { StaffViewDto };
