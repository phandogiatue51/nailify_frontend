import { Shop } from "@/types/database";
import { ServicePreview } from "../ServicePreview";
import { CollectionPreview } from "../CollectionPreview";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Eye, Phone } from "lucide-react";
import DateDisplay from "@/components/ui/date-display";
interface ShopCardProps {
  shop: Shop;
  onViewDetails: () => void;
}

export const ShopCard = ({ shop, onViewDetails }: ShopCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Shop Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              {shop.logoUrl ? (
                <img
                  src={shop.logoUrl}
                  alt={shop.name}
                  className="w-12 h-12 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-12 h-12 object-cover border rounded-lg flex items-center justify-center bg-gradient-to-br from-[#950101] to-[#FFCFE9]">
                  <span className="text-xl font-bold text-white uppercase">
                    {shop.name?.[0] || "U"}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{shop.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {shop.description || "No description"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={shop.isVerified ? "default" : "secondary"}>
            {shop.isVerified ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </>
            ) : (
              "Unverified"
            )}
          </Badge>

          <Badge variant={shop.isActive ? "default" : "destructive"}>
            {shop.isActive ? "Active" : "Inactive"}
          </Badge>

          {shop.phone && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {shop.phone}
            </Badge>
          )}
        </div>

        <div className="grid gap-2 mb-4 text-sm">
          <DateDisplay
            dateString={shop.createdAt}
            label="Created At"
            showTime
          />
        </div>

        <div className="space-y-3 pt-4 border-t">
          <ServicePreview shopId={shop.id} compact />
          <CollectionPreview shopId={shop.id} compact />
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 p-4">
        <Button variant="outline" className="w-full" onClick={onViewDetails}>
          <Eye className="w-4 h-4 mr-2" />
          View Full Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShopCard;
