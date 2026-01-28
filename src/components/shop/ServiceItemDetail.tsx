import { ServiceItem } from "@/types/database";
import { useCustomerShopById } from "@/hooks/useCustomer";
import { Loader2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useCustomerServiceItems } from "@/hooks/useCustomer";
import ServiceItemCard from "@/components/shop/ServiceItemCard";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
interface ServiceItemDetailProps {
  item: ServiceItem;
}

const ServiceItemDetail: React.FC<ServiceItemDetailProps> = ({ item }) => {
  const { data: shop, isLoading } = useCustomerShopById(item.shopId);
  const navigate = useNavigate();
  const { serviceItems = [], isLoading: loadingServices } =
    useCustomerServiceItems(item.shopId);
  return (
    <div className="space-y-4">
      {item.imageUrl && (
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h2 className="text-xl font-semibold">{item.name}</h2>
      {item.description && (
        <p className="text-muted-foreground">{item.description}</p>
      )}

      <div className="flex items-center gap-4 w-full">
        {item.estimatedDuration && (
          <Badge variant="secondary" className="whitespace-nowrap text-md">
            {item.estimatedDuration} minutes
          </Badge>
        )}

        {item.price !== undefined && (
          <p className="ml-auto text-xl font-bold text-green-600 whitespace-nowrap">
            {item.price.toFixed(3)} VND
          </p>
        )}
      </div>

      {/* Shop Info */}
      <div className="border-t pt-4">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : shop ? (
          <div className="flex items-center gap-3">
            {shop.logoUrl && (
              <img
                src={shop.logoUrl}
                alt={shop.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-md font-medium">{shop.name}</p>
              {shop.address && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {shop.address}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => navigate(`/shop/${shop.id}`)}
              className="ml-auto"
            >
              View Shop
            </Button>
          </div>
        ) : null}
      </div>
      {serviceItems.length > 1 && (
        <div className="space-y-2 mt-6">
          <h3 className="text-lg font-semibold">
            Other Services from this Shop
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {serviceItems
              .filter((s) => s.id !== item.id)
              .map((s) => (
                <Link key={s.id} to={`/services/${s.id}`}>
                  <ServiceItemCard item={s} />
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceItemDetail;
