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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DateDisplay from "@/components/ui/date-display";
interface CollectionCardProps {
  collection: Collection;
  onViewDetails: () => void;
}

export const CollectionCard = ({
  collection,
  onViewDetails,
}: CollectionCardProps) => {
  return (
    <Card className="h-[400px] flex flex-col hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative h-40 bg-muted">
        <div className="absolute inset-0">
          {collection.imageUrl ? (
            <img
              src={collection.imageUrl}
              alt={collection.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200" />
          )}
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant={collection.isActive ? "default" : "destructive"}>
            {collection.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <CardContent className="flex-1 p-4 flex flex-col justify-between">
        <div>
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

          <div className="space-y-3">
            {/* Price & Duration */}
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

            {/* Owner */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {collection.shopId ? (
                <>
                  <Building className="w-3 h-3" />
                  <span>Shop Collection</span>
                </>
              ) : collection.nailArtistId ? (
                <>
                  <User className="w-3 h-3" />
                  <span>Artist Collection</span>
                </>
              ) : (
                <>
                  <Layers className="w-3 h-3" />
                  <span>General Collection</span>
                </>
              )}
            </div>

            <DateDisplay
              dateString={collection.createdAt}
              label="Created At"
              showTime
            />
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
