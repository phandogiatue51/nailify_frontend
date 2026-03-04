import { useState, useEffect } from "react";
import { Collection, CollectionItemDto } from "@/types/database";
import { collectionAPI } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Layers,
  Clock,
  DollarSign,
  Calendar,
  Building,
  User,
  Package,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

interface CollectionDetailModalProps {
  collectionId: string | null;
  open: boolean;
  onClose: () => void;
}

export const CollectionDetailModal = ({
  collectionId,
  open,
  onClose,
}: CollectionDetailModalProps) => {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCollectionDetails = async () => {
    if (!collectionId) return;

    setLoading(true);
    try {
      // Use getById endpoint
      const data = await collectionAPI.getById(collectionId);
      setCollection(data);
    } catch (error) {
      console.error("Error loading collection details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && collectionId) {
      loadCollectionDetails();
    } else {
      setCollection(null);
    }
  }, [open, collectionId]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price?: number) => {
    return price ? price.toLocaleString() + " VND" : "N/A";
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !collection ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Collection not found</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {collection.imageUrl ? (
                    <img
                      src={collection.imageUrl}
                      alt={collection.name}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                      <span className="text-xl font-bold text-white uppercase">
                        {collection.name?.[0] || "U"}
                      </span>
                    </div>
                  )}

                  <div>
                    <DialogTitle className="text-2xl">
                      {collection.name}
                    </DialogTitle>
                    <DialogDescription>
                      Collection ID: {collection.id}
                    </DialogDescription>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Collection Image (Large) */}
              <div className="relative h-64 rounded-lg overflow-hidden">
                {collection.imageUrl ? (
                  <img
                    src={collection.imageUrl}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#950101] to-[#FFCFE9]">
                    <span className="text-5xl font-bold text-white uppercase">
                      {collection.name?.[0] || "U"}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {collection.description && (
                <div className="space-y-2">
                  <h4 className="font-medium">Description</h4>
                  <p className="text-muted-foreground">
                    {collection.description}
                  </p>
                </div>
              )}

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Collection Details */}
                <div className="space-y-4">
                  <h4 className="font-medium">Collection Details</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>Estimated Duration</span>
                      </div>
                      <span>{collection.estimatedDuration} minutes</span>
                    </div>

                    {collection.calculatedDuration && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Calculated Duration</span>
                        </div>
                        <span>{collection.calculatedDuration} minutes</span>
                      </div>
                    )}

                    <Separator />

                    {collection.totalPrice && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>Total Price</span>
                        </div>
                        <span className="font-bold text-lg">
                          {collection.totalPrice.toLocaleString()} VND
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {collection.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>Status</span>
                      </div>
                      <Badge
                        variant={
                          collection.isActive ? "default" : "destructive"
                        }
                      >
                        {collection.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">Owner Information</h4>

                  <div className="space-y-3">
                    {collection.shopId && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Shop Collection</p>
                          <p className="text-sm text-muted-foreground">
                            Shop ID: {collection.shopId}
                          </p>
                        </div>
                      </div>
                    )}

                    {collection.nailArtistId && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Artist Collection</p>
                          <p className="text-sm text-muted-foreground">
                            Artist ID: {collection.nailArtistId}
                          </p>
                        </div>
                      </div>
                    )}

                    {!collection.shopId && !collection.nailArtistId && (
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">General Collection</p>
                          <p className="text-sm text-muted-foreground">
                            Not attached to specific shop or artist
                          </p>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Timeline */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Created: {formatDate(collection.createdAt)}</span>
                      </div>
                      {collection.updatedAt && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            Updated: {formatDate(collection.updatedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Items */}
              {collection.items && collection.items.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">
                    Service Items ({collection.items.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collection.items.map((item: CollectionItemDto) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {item.serviceItemImageUrl ? (
                            <img
                              src={item.serviceItemImageUrl}
                              alt={item.serviceItemName}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded flex items-center justify-center bg-gradient-to-br from-[#950101] to-[#FFCFE9]">
                              <span className="text-sm font-bold text-white uppercase">
                                {item.serviceItemName?.[0] || "U"}
                              </span>
                            </div>
                          )}

                          <div className="flex-1">
                            <h5 className="font-medium">
                              {item.serviceItemName || "Unnamed Service"}
                            </h5>
                            {item.serviceItemPrice && (
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {formatPrice(item.serviceItemPrice)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags (Optional) */}
              {collection.tags && collection.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">
                    Tags ({collection.tags.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {collection.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CollectionDetailModal;
