import { useState, useEffect } from "react";
import { Profile } from "@/types/database";
import { profileAPI } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RoleBadge } from "@/components/badge/RoleBadge";
import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  User as UserIcon,
  MapPin,
  Building,
  Palette,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

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

  const loadUserDetails = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Since we don't have a getById endpoint, filter with the ID
      const users = await profileAPI.filterProfiles({});
      const foundUser = users.find((u) => u.id === userId);
      setUser(foundUser || null);
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
      await profileAPI.changeStatus(userId);
      onUserUpdated?.();
      loadUserDetails(); // Reload to get updated status
    } catch (error) {
      console.error("Failed to change user status:", error);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !user ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">User not found</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <DialogTitle className="text-2xl">
                      {user.fullName}
                    </DialogTitle>
                    <DialogDescription>User ID: {user.id}</DialogDescription>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleChangeStatus}
                    disabled={changingStatus}
                    variant={user.isActive ? "destructive" : "default"}
                    size="sm"
                  >
                    {changingStatus ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : user.isActive ? (
                      <XCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {user.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* User Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="space-y-4">
                  <h4 className="font-medium">Contact Information</h4>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-sm text-muted-foreground">
                            {user.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Info */}
                <div className="space-y-4">
                  <h4 className="font-medium">Account Information</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <RoleBadge role={user.role} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {user.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>Account Status</span>
                      </div>
                      <Badge
                        variant={user.isActive ? "default" : "destructive"}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {user.isVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        <span>Email Verification</span>
                      </div>
                      <Badge
                        variant={user.isVerified ? "default" : "secondary"}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>

                    <Separator />

                    {/* Shop/Artist Verification */}
                    {user.shopVerified !== null && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span>Shop Verification</span>
                        </div>
                        <Badge
                          variant={user.shopVerified ? "default" : "secondary"}
                        >
                          {user.shopVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    )}

                    {user.artistVerified !== null && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-muted-foreground" />
                          <span>Artist Verification</span>
                        </div>
                        <Badge
                          variant={
                            user.artistVerified ? "default" : "secondary"
                          }
                        >
                          {user.artistVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="font-medium">Account Timeline</h4>
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Account Created: {formatDate(user.createdAt)}</span>
                  </div>
                  {user.updatedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Last Updated: {formatDate(user.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Info (Read Only) */}
              <div className="space-y-4">
                <h4 className="font-medium">Security Information</h4>
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">Email Verification Token</p>
                    <p className="text-xs font-mono text-muted-foreground truncate">
                      {user.EmailVerificationToken || "No token"}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Password Reset Token</p>
                    <p className="text-xs font-mono text-muted-foreground truncate">
                      {user.PasswordResetToken || "No token"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Note: These tokens are for system use only.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
