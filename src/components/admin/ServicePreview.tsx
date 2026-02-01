import { useState } from "react";
import { ServiceItem } from "@/types/database";
import { serviceItemAPI } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Package,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
  Building,
  User,
} from "lucide-react";

interface ServicePreviewProps {
  shopId?: string;
  artistId?: string;
  compact?: boolean;
  title?: string;
}

export const ServicePreview = ({
  shopId,
  artistId,
  compact = false,
  title = "Services",
}: ServicePreviewProps) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadServices = async () => {
    if (services.length > 0) return;

    setLoading(true);
    try {
      const filterParams: any = {};

      if (shopId) filterParams.ShopId = shopId;
      if (artistId) filterParams.NailArtistId = artistId;

      const data = await serviceItemAPI.adminFilter(filterParams);
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    if (!expanded && services.length === 0) {
      loadServices();
    }
    setExpanded(!expanded);
  };

  // Compact view (for cards)
  if (compact) {
    return (
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpand}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            {shopId ? (
              <Building className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <Package className="w-4 h-4" />
            <span>
              {title} ({services.length})
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>

        {expanded && (
          <div className="pl-6 space-y-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : services.length > 0 ? (
              services.slice(0, 3).map((service) => (
                <div
                  key={service.id}
                  className="text-sm flex justify-between items-center"
                >
                  <span className="truncate">{service.name}</span>
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No {title.toLowerCase()}
              </p>
            )}
            {services.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{services.length - 3} more
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full view (for modal/detail page)
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            {shopId ? (
              <Building className="w-5 h-5" />
            ) : (
              <User className="w-5 h-5" />
            )}
            <Package className="w-5 h-5" />
            {title} ({services.length})
          </h3>
          <Button variant="outline" size="sm" onClick={toggleExpand}>
            {expanded ? "Hide" : "Show All"}
          </Button>
        </div>

        {expanded && (
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((service) => (
                  <Card key={service.id} className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {service.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {Number(service.price).toLocaleString()} VND
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {service.estimatedDuration} min
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={service.isActive ? "default" : "secondary"}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {service.imageUrl && (
                          <div className="w-12 h-12 rounded overflow-hidden">
                            <img
                              src={service.imageUrl}
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No {title.toLowerCase()} found
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
