import { useState, useEffect } from "react";
import { Shop } from "@/types/database";
import { shopAPI } from "@/services/api";
import { ServicePreview } from "../ServicePreview";
import { CollectionPreview } from "../CollectionPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Calendar,
  Building,
  Globe,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Profile } from "@/types/database";
import UserDetailModal from "../user/UserDetailModal";
interface ShopDetailViewProps {
  shopId: string;
  onShopUpdated?: () => void;
}
import { profileAPI } from "@/services/api";
import UserCard from "../user/UserCard";
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
export const ShopDetailView = ({
  shopId,
  onShopUpdated,
}: ShopDetailViewProps) => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [owner, setOwner] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const loadShopDetails = async () => {
    if (!shopId) return;

    setLoading(true);
    try {
      const shopData = await shopAPI.getById(shopId);
      setShop(shopData || null);
    } catch (error) {
      console.error("Error loading shop details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      loadShopDetails();
    } else {
      setShop(null);
    }
  }, [shopId]);

  useEffect(() => {
    if (shop?.ownerId) {
      const fetchOwner = async () => {
        try {
          const ownerData = await profileAPI.getById(shop.ownerId);
          setOwner(ownerData);
        } catch (error) {
          console.error("Error fetching owner:", error);
        }
      };
      fetchOwner();
    }
  }, [shop?.ownerId]);

  const handleVerify = async () => {
    if (!shopId) return;

    setVerifying(true);
    try {
      await shopAPI.verifyShop(shopId);
      onShopUpdated?.();
      loadShopDetails();
    } catch (error) {
      console.error("Failed to verify shop:", error);
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return dateString;
    }
  };

  if (!shopId) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No shop selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Shop not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {shop.name}
            {shop.isVerified && (
              <Badge className="ml-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">Shop ID: {shop.id}</p>
        </div>

        <div className="flex gap-2">
          {!shop.isVerified && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={verifying} size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify Shop
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Verify Shop</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to verify {shop.name}? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleVerify}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              /* Handle disable */
            }}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Disable
          </Button>
        </div>
      </div>

      {/* Shop Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shop.coverUrl ? (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Cover Image
            </h4>
            <img
              src={shop.coverUrl}
              alt="Cover"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="w-full h-48 object-cover rounded-lg flex items-center justify-center bg-gradient-to-br from-[#950101] to-[#FFCFE9]">
            <span className="text-2xl font-bold text-white uppercase">
              {shop.name?.[0] || "U"}
            </span>
          </div>
        )}
        {shop.logoUrl ? (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Building className="w-4 h-4" />
              Logo
            </h4>
            <img
              src={shop.logoUrl}
              alt="Logo"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="w-32 h-32 object-cover rounded-lg flex items-center justify-center bg-gradient-to-br from-[#950101] to-[#FFCFE9]">
            <span className="text-2xl font-bold text-white uppercase">
              {shop.name?.[0] || "U"}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {shop.description && (
        <div className="space-y-2">
          <h4 className="font-medium">Description</h4>
          <p className="text-muted-foreground">{shop.description}</p>
        </div>
      )}

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Contact Information</h4>

          <div className="space-y-3">
            {/* Shop phone (top-level) */}
            {shop.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Shop Phone</p>
                  <p className="text-sm text-muted-foreground">{shop.phone}</p>
                </div>
              </div>
            )}

            {/* Locations */}
            {shop.locations?.map((location) => (
              <div key={location.id} className="space-y-2">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        {location.address}, {location.city}
                      </p>
                    </div>
                  </div>
                  {location.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Location Phone</p>
                        <p className="text-sm text-muted-foreground">
                          {location.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Shop Status</h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {shop.isActive ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>Active Status</span>
              </div>
              <Badge variant={shop.isActive ? "default" : "destructive"}>
                {shop.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {shop.isVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span>Verification</span>
              </div>
              <Badge variant={shop.isVerified ? "default" : "secondary"}>
                {shop.isVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Created: {formatDate(shop.createdAt)}</span>
              </div>
              {shop.updatedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Updated: {formatDate(shop.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Owner Information</h4>
        {owner ? (
          <UserCard
            user={owner}
            onUserUpdated={loadShopDetails}
            onViewDetails={() => setSelectedOwnerId(owner.id)}
          />
        ) : (
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm">
              Owner ID: <span className="font-mono">{shop.ownerId}</span>
            </p>
          </div>
        )}
      </div>

      {/* Service & Collection Previews */}
      <div className="space-y-6">
        <ServicePreview shopId={shop.id} />
        <CollectionPreview shopId={shop.id} />
      </div>

      {/* Shop Metrics */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium mb-3">Shop Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-muted-foreground">Total Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-muted-foreground">Active Services</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-muted-foreground">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">-</div>
            <div className="text-xs text-muted-foreground">Avg. Rating</div>
          </div>
        </div>
      </div>
      {selectedOwnerId && (
        <UserDetailModal
          userId={selectedOwnerId}
          open={!!selectedOwnerId}
          onClose={() => setSelectedOwnerId(null)}
          onUserUpdated={() => {
            setSelectedOwnerId(null);
            loadShopDetails(); // refresh shop details after update
          }}
        />
      )}
    </div>
  );
};

export default ShopDetailView;
