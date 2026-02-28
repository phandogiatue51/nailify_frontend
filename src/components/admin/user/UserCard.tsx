import { Profile } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  Phone,
  Calendar,
  Shield,
  User as UserIcon,
  MoreVertical,
  Building,
  Palette,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DateDisplay from "@/components/ui/date-display";
import { profileAPI } from "@/services/api";
import { RoleBadge } from "@/components/badge/RoleBadge";
interface UserCardProps {
  user: Profile;
  onViewDetails?: () => void;
  onUserUpdated?: () => void;
}

export const UserCard = ({
  user,
  onViewDetails,
  onUserUpdated,
}: UserCardProps) => {
  const handleChangeStatus = async () => {
    try {
      await profileAPI.changeStatus(user.id);
      onUserUpdated?.();
    } catch (error) {
      console.error("Failed to change user status:", error);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full object-cover border flex items-center justify-center bg-gradient-to-br from-[#950101] to-[#FFCFE9]">
                <span className="text-2xl font-bold text-white uppercase">
                  {user.fullName?.[0] || "U"}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{user.fullName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewDetails}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleChangeStatus}>
                {user.isActive ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2 text-destructive" />
                    <span className="text-destructive">Deactivate</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Activate</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span className="truncate">{user.email}</span>
          </div>

          {user.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3 h-3 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={user.isActive ? "default" : "destructive"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>

          <Badge variant={user.isVerified ? "default" : "secondary"}>
            {user.isVerified ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </>
            ) : (
              "Unverified"
            )}
          </Badge>

          {/* Shop/Artist Verification Badges */}
          {user.shopVerified !== null && (
            <Badge
              variant={user.shopVerified ? "default" : "outline"}
              className="flex items-center gap-1"
            >
              <Building className="w-3 h-3" />
              {user.shopVerified ? "Shop ✓" : "Shop ✗"}
            </Badge>
          )}

          {user.artistVerified !== null && (
            <Badge
              variant={user.artistVerified ? "default" : "outline"}
              className="flex items-center gap-1"
            >
              <Palette className="w-3 h-3" />
              {user.artistVerified ? "Artist ✓" : "Artist ✗"}
            </Badge>
          )}
        </div>

        <DateDisplay dateString={user.createdAt} label="Created At" showTime />
      </CardContent>

      <div className="bg-muted/30 p-4">
        <Button variant="outline" className="w-full" onClick={onViewDetails}>
          <Eye className="w-4 h-4 mr-2" />
          View Full Details
        </Button>
      </div>
    </Card>
  );
};

export default UserCard;
