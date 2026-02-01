import { Collection } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Clock,
  DollarSign,
  Layers,
  Building,
  User,
  Calendar,
  Package,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CollectionCardProps {
  collection: Collection;
  onViewDetails: () => void;
}

export const CollectionCard = ({
  collection,
  onViewDetails,
}: CollectionCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      {/* Collection Image */}
      {collection.imageUrl && (
        <div className="relative h-40">
          <img
            src={collection.imageUrl}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={collection.isActive ? "default" : "destructive"}>
              {collection.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      )}

      <CardContent className="p-4">
        {/* Collection Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">
              {collection.name}
            </h3>
            {collection.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {collection.description}
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Collection Details */}
        <div className="space-y-3">
          {/* Price & Duration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {collection.totalPrice && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-bold">
                    {collection.totalPrice.toLocaleString()} VND
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{collection.estimatedDuration} min</span>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="flex items-center gap-4 text-sm">
            {collection.shopId ? (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Building className="w-3 h-3" />
                <span>Shop Collection</span>
              </div>
            ) : collection.nailArtistId ? (
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="w-3 h-3" />
                <span>Artist Collection</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Layers className="w-3 h-3" />
                <span>General Collection</span>
              </div>
            )}
          </div>

          {/* Items Count */}
          {collection.items && collection.items.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="w-3 h-3" />
              <span>{collection.items.length} service items</span>
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Created: {formatDate(collection.createdAt)}</span>
          </div>
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

export default CollectionCard;
