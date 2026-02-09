import { useParams, useNavigate } from "react-router-dom";
import { useStaff } from "@/hooks/useStaff";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Edit3,
  Power,
} from "lucide-react";

export const StaffDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useStaffById, updateStaffStatus } = useStaff();
  const { data: staff, isLoading } = useStaffById(id || "");

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Power className="animate-spin text-[#E288F9]" />
      </div>
    );
  if (!staff)
    return (
      <MobileLayout>
        <div>Staff not found</div>
      </MobileLayout>
    );

  return (
    <div className="p-4 space-y-6 bg-slate-50/30 min-h-screen pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-2xl bg-slate-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-black text-sm uppercase tracking-widest text-slate-400">
          Staff Profile
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/staff/edit/${id}`)}
          className="rounded-2xl bg-slate-50"
        >
          <Edit3 className="w-4 h-4 text-[#E288F9]" />
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-[2.5rem] bg-slate-100 overflow-hidden mx-auto border-4 border-white shadow-xl">
            {staff.avatarUrl ? (
              <img
                src={staff.avatarUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                👤
              </div>
            )}
          </div>
          <div
            className={cn(
              "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white",
              staff.IsActive ? "bg-green-500" : "bg-red-400",
            )}
          />
        </div>
        <h1 className="text-2xl font-black mt-4 text-slate-900 leading-tight">
          {staff.fullName}
        </h1>
        <Badge
          className={cn(
            "mt-2 border-none font-bold",
            staff.IsActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700",
          )}
        >
          {staff.IsActive ? "Active Member" : "Inactive"}
        </Badge>
      </div>

      {/* Info Sections */}
      <div className="space-y-4 px-2">
        <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Email Address
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {staff.email || "No email provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                <Phone className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Phone Number
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {staff.phone || "No phone provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Primary Address
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {staff.address || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-[2rem] border border-slate-100">
            <Calendar className="w-4 h-4 text-[#FFC988] mb-2" />
            <p className="text-[10px] font-black uppercase text-slate-400">
              Joined
            </p>
            <p className="text-xs font-bold">
              {new Date(staff.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-[2rem] border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-[#E288F9] mb-2" />
            <p className="text-[10px] font-black uppercase text-slate-400">
              Staff ID
            </p>
            <p className="text-xs font-bold">#{staff.staffId}</p>
          </div>
        </div>

        <Button
          onClick={() => updateStaffStatus.mutateAsync(id!)}
          variant="outline"
          className={cn(
            "w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-2",
            staff.IsActive
              ? "border-red-100 text-red-500 hover:bg-red-50"
              : "border-green-100 text-green-600 hover:bg-green-50",
          )}
        >
          <Power className="w-4 h-4 mr-2" />
          {staff.IsActive ? "Deactivate Account" : "Activate Account"}
        </Button>
      </div>
    </div>
  );
};
