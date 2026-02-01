import { useState, useEffect } from "react";
import { Shop, ShopLocation } from "@/types/database";
import { shopAPI } from "@/services/api";
import { ServicePreview } from "../ServicePreview";
import { CollectionPreview } from "../CollectionPreview";
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
import {
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Clock,
  Calendar,
  Building,
  Mail,
  Globe,
  Star,
  Users,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

interface ShopDetailModalProps {
  shopId: string | null;
  open: boolean;
  onClose: () => void;
  onShopUpdated?: () => void;
}

export const ShopDetailModal = ({
  shopId,
  open,
  onClose,
  onShopUpdated,
}: ShopDetailModalProps) => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const loadShopDetails = async () => {
    if (!shopId) return;

    setLoading(true);
    try {
      const shops = await shopAPI.getById(shopId);
      setShop(shops || null);
    } catch (error) {
      console.error("Error loading shop details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && shopId) {
      loadShopDetails();
    } else {
      setShop(null);
    }
  }, [open, shopId]);

  const handleVerify = async () => {
    if (!shopId) return;

    setVerifying(true);
    try {
      await shopAPI.verifyShop(shopId);
      onShopUpdated?.();
      loadShopDetails(); // Reload to get updated verification status
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

  const formatTime = (timeString?: string | null) => {
    if (!timeString) return "N/A";
    return timeString.substring(0, 5); // "09:00:00" -> "09:00"
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !shop ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Shop not found</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    {shop.name}
                    {shop.isVerified && (
                      <Badge className="ml-2">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription>Shop ID: {shop.id}</DialogDescription>
                </div>

                <div className="flex gap-2">
                  {!shop.isVerified && (
                    <Button
                      onClick={handleVerify}
                      disabled={verifying}
                      size="sm"
                    >
                      {verifying ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Verify Shop
                    </Button>
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
            </DialogHeader>

            <div className="space-y-6">
              {/* Shop Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shop.coverUrl && (
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
                )}
                {shop.logoUrl && (
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
                    {shop.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-sm text-muted-foreground">
                            {shop.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {shop.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">
                            {shop.phone}
                          </p>
                        </div>
                      </div>
                    )}
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
                      <Badge
                        variant={shop.isActive ? "default" : "destructive"}
                      >
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
                      <Badge
                        variant={shop.isVerified ? "default" : "secondary"}
                      >
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

              {/* Owner Info */}
              <div className="space-y-4">
                <h4 className="font-medium">Owner Information</h4>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm">
                    Owner ID: <span className="font-mono">{shop.ownerId}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You can contact the owner through their profile or email.
                  </p>
                </div>
              </div>

              {/* Service & Collection Previews */}
              <div className="space-y-6">
                <ServicePreview shopId={shop.id} />
                <CollectionPreview shopId={shop.id} />
              </div>

              {/* Shop Metrics (if available) */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Shop Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-muted-foreground">
                      Total Bookings
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-muted-foreground">
                      Active Services
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-muted-foreground">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">-</div>
                    <div className="text-xs text-muted-foreground">
                      Avg. Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShopDetailModal;
