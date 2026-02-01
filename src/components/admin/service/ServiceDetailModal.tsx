import { useState, useEffect } from "react";
import { ServiceItem, ComponentType } from "@/types/database";
import { serviceItemAPI } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ComponentBadge } from "@/components/badge/ComponentBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  DollarSign,
  Clock,
  Calendar,
  Building,
  User,
  Layers,
  Edit,
  Loader2,
  AlertCircle,
  Type,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ServiceDetailModalProps {
  serviceId: string | null;
  open: boolean;
  onClose: () => void;
  onServiceUpdated?: () => void;
}

export const ServiceDetailModal = ({
  serviceId,
  open,
  onClose,
  onServiceUpdated,
}: ServiceDetailModalProps) => {
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadServiceDetails = async () => {
    if (!serviceId) return;

    setLoading(true);
    try {
      // Use getById endpoint instead of filtering!
      const data = await serviceItemAPI.getById(serviceId);
      setService(data);
    } catch (error) {
      console.error("Error loading service details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && serviceId) {
      loadServiceDetails();
    } else {
      setService(null);
    }
  }, [open, serviceId]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch {
      return dateString;
    }
  };

  const handleViewShop = () => {
    if (service?.shopId) {
      navigate(`/admin/shops/${service.shopId}`);
      onClose();
    }
  };

  const handleViewArtist = () => {
    if (service?.nailArtistId) {
      navigate(`/admin/artists/${service.nailArtistId}`);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !service ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Service not found</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <DialogTitle className="text-2xl">
                      {service.name}
                    </DialogTitle>
                    <DialogDescription>
                      Service ID: {service.id}
                    </DialogDescription>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Service Image (Large) */}
              {service.imageUrl && (
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              {service.description && (
                <div className="space-y-2">
                  <h4 className="font-medium">Description</h4>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              )}

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Details */}
                <div className="space-y-4">
                  <h4 className="font-medium">Service Details</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>Price</span>
                      </div>
                      <span className="font-bold text-lg">
                        {Number(service.price).toLocaleString()} VND
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>Duration</span>
                      </div>
                      <span>{service.estimatedDuration} minutes</span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-muted-foreground" />
                        <span>Component Type</span>
                      </div>
                      <ComponentBadge role={service.componentType} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {service.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>Status</span>
                      </div>
                      <Badge
                        variant={service.isActive ? "default" : "destructive"}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">Owner Information</h4>

                  <div className="space-y-3">
                    {service.shopId && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Shop Service</p>
                            <p className="text-sm text-muted-foreground">
                              Shop ID: {service.shopId}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleViewShop}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    {service.nailArtistId && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Artist Service</p>
                            <p className="text-sm text-muted-foreground">
                              Artist ID: {service.nailArtistId}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleViewArtist}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    {!service.shopId && !service.nailArtistId && (
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">General Service</p>
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
                        <span>Created: {formatDate(service.createdAt)}</span>
                      </div>
                      {service.updatedAt && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Updated: {formatDate(service.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    // Navigate to edit page or open edit modal
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Service
                </Button>
                <Button
                  variant={service.isActive ? "destructive" : "default"}
                  className="flex-1"
                >
                  {service.isActive ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailModal;
