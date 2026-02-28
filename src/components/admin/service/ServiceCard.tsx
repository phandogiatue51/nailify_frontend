import { ServiceItem } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  DollarSign,
  Clock,
  Package,
  Building,
  User,
  Calendar,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ComponentBadge } from "@/components/badge/ComponentBadge";
import DateDisplay from "@/components/ui/date-display";
interface ServiceCardProps {
  service: ServiceItem;
  onViewDetails: () => void;
  onServiceUpdated?: () => void;
}

export const ServiceCard = ({
  service,
  onViewDetails,
  onServiceUpdated,
}: ServiceCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      {/* Service Image */}
      {service.imageUrl ? (
        <div className="relative h-40 rounded-lg overflow-hidden">
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <ComponentBadge role={service.componentType} />
          </div>
        </div>
      ) : (
        <div className="relative h-40 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#950101] to-[#FFCFE9]">
          <span className="text-2xl font-bold text-white uppercase">
            {service.name?.[0] || "U"}
          </span>
          <div className="absolute top-2 right-2">
            <ComponentBadge role={service.componentType} />
          </div>
        </div>
      )}

      <CardContent className="p-4">
        {/* Service Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">
              {service.name}
            </h3>
            {service.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {service.description}
              </p>
            )}
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
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                Edit Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Service Details */}
        <div className="space-y-3">
          {/* Price & Duration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-bold">
                  {Number(service.price).toLocaleString()} VND
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{service.estimatedDuration} min</span>
              </div>
            </div>

            <Badge variant={service.isActive ? "default" : "destructive"}>
              {service.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Owner Information */}
          <div className="flex items-center gap-4 text-sm">
            {service.shopId ? (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Building className="w-3 h-3" />
                <span>Shop Service</span>
              </div>
            ) : service.nailArtistId ? (
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="w-3 h-3" />
                <span>Artist Service</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Package className="w-3 h-3" />
                <span>General Service</span>
              </div>
            )}
          </div>

          <DateDisplay
            dateString={service.createdAt}
            label="Created At"
            showTime
          />
        </div>
      </CardContent>

      <div className="bg-muted/30 p-4">
        <Button variant="outline" className="w-full" onClick={onViewDetails}>
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default ServiceCard;
