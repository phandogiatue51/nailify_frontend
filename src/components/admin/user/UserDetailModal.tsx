import { useState, useEffect } from "react";
import { Profile } from "@/types/database";
import { profileAPI } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { RoleBadge } from "@/components/badge/RoleBadge";
import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { StatusRow } from "@/components/ui/status-row";

interface UserDetailModalProps {
  userId: string | null;
  open: boolean;
  onClose: () => void;
  onUserUpdated?: () => void;
}

export const UserDetailModal = ({
  userId,
  open,
  onClose,
  onUserUpdated,
}: UserDetailModalProps) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const { toast } = useToast();
  const loadUserDetails = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const users = await profileAPI.getById(userId);
      setUser(users || null);
    } catch (error) {
      console.error("Error loading user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && userId) {
      loadUserDetails();
    } else {
      setUser(null);
    }
  }, [open, userId]);

  const handleChangeStatus = async () => {
    if (!userId) return;

    setChangingStatus(true);
    try {
      var response = await profileAPI.changeStatus(userId);
      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      onUserUpdated?.();
      loadUserDetails();
    } catch (error) {
      console.error("Failed to change user status:", error);
      toast({
        description: error?.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setChangingStatus(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch {
      return dateString;
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none !rounded-3xl bg-white shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>User Details</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden>
          <DialogDescription>
            View and manage user account details, status, and information
          </DialogDescription>
        </VisuallyHidden>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#950101]" />
          </div>
        ) : !user ? (
          <div className="text-center py-24">
            <AlertCircle className="w-12 h-12 mx-auto text-slate-200 mb-4" />
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">
              User not found
            </p>
          </div>
        ) : (
          <div className="flex flex-col max-h-[90vh]">
            <div className="relative bg-slate-50 px-8 pt-12 pb-8 border-b border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="w-24 h-24 rounded-[2rem] object-cover border-4 border-white shadow-xl transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#950101] to-[#6b0101] flex items-center justify-center border-4 border-white shadow-xl">
                        <span className="text-3xl font-black text-white italic uppercase">
                          {user.fullName?.[0] || "U"}
                        </span>
                      </div>
                    )}
                    <div
                      className={`absolute -bottom-2 -right-2 w-8 h-8 border-4 border-white rounded-full ${user.isActive ? "bg-emerald-500 shadow-lg shadow-emerald-200" : "bg-slate-300"}`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                        {user.fullName}
                      </DialogTitle>
                    </div>
                    <div className="flex items-center gap-3">
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={changingStatus}
                      variant="outline"
                      className={`rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] px-6 h-12 transition-all ${
                        user.isActive
                          ? "border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                          : "border-emerald-100 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
                      }`}
                    >
                      {changingStatus ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : user.isActive ? (
                        <XCircle className="w-4 h-4 mr-2" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      {user.isActive ? "Ngừng hoạt động" : "Kích hoạt"}
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="rounded-[2.5rem] p-10">
                    <AlertDialogHeader className="space-y-4">
                      <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-slate-900">
                        Xác nhận
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-500 font-medium italic text-lg leading-relaxed">
                        Bạn có chắc muốn{" "}
                        <span className="text-[#950101] font-black underline">
                          {user.isActive ? "ngừng hoạt động" : "kích hoạt"}
                        </span>{" "}
                        tài khoản này?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-6">
                      <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-xs border-slate-200">
                        Hủy
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleChangeStatus}
                        className={`rounded-xl font-bold uppercase tracking-widest text-xs px-8 ${
                          user.isActive
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {user.isActive ? "Ngừng hoạt động" : "Kích hoạt"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-10">
              {/* Main Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Column */}
                <section className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#950101] border-b border-slate-100 pb-2">
                    Thông tin liên hệ
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-slate-50 rounded-xl text-[#950101]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-0.5">
                          Email
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {user.phone && (
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-slate-50 rounded-xl text-[#950101]">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-0.5">
                            Số điện thoại
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-slate-50 rounded-xl text-[#950101]">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-0.5">
                            Địa chỉ
                          </p>
                          <p className="text-sm font-bold text-slate-700 leading-relaxed">
                            {user.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Status Column */}
                <section className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#950101] border-b border-slate-100 pb-2">
                    Tình trạng xác thực
                  </h4>
                  <div className="space-y-3 bg-slate-50/50 p-4 rounded-3xl border border-slate-50">
                    <StatusRow
                      label="Tài khoản đang hoạt động"
                      isVerified={user.isActive}
                    />
                    <StatusRow
                      label="Email đã xác minh"
                      isVerified={user.isVerified}
                    />
                    {user.shopVerified !== null && (
                      <StatusRow
                        label="Cửa hàng đã xác minh"
                        isVerified={user.shopVerified}
                      />
                    )}
                    {user.artistVerified !== null && (
                      <StatusRow
                        label="Thợ nail đã xác minh"
                        isVerified={user.artistVerified}
                      />
                    )}
                  </div>
                </section>
              </div>

              {/* Timeline Section */}
              <section className="bg-slate-100 rounded-[2rem] p-6 text-black flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-[#950101]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Tạo vào ngày
                    </p>
                    <p className="text-sm font-black italic">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
                {user.updatedAt && (
                  <div className="text-right border-l border-white/10 pl-6 hidden sm:block">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Hoạt động lần cuối
                    </p>
                    <p className="text-sm font-black italic">
                      {formatDate(user.updatedAt)}
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
