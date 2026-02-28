import { ServiceItem } from "@/types/database";
import {
  useCustomerShopById,
  useCustomerArtistById,
} from "@/hooks/useCustomer";
import { Loader2, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useCustomerServiceItems } from "@/hooks/useCustomer";
import ServiceItemCard from "@/components/serviceItem/ServiceItemCard";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";

interface ServiceItemDetailProps {
  item: ServiceItem;
}

const ServiceItemDetail: React.FC<ServiceItemDetailProps> = ({ item }) => {
  const navigate = useNavigate();

  const isArtistItem = !!item.nailArtistId && !item.shopId;

  const { data: shop, isLoading: shopLoading } = useCustomerShopById(
    item.shopId,
  );
  const { data: artist, isLoading: artistLoading } = useCustomerArtistById(
    item.nailArtistId,
  );

  const { serviceItems = [], isLoading: itemsLoading } =
    useCustomerServiceItems(item.shopId, item.nailArtistId);

  const isLoading = shopLoading || artistLoading;
  const owner = shop || artist;
  const isArtist = !!artist;

  return (
    <div className="space-y-4">
      {item.imageUrl ? (
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-full rounded-full object-cover bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
          <span className="text-2xl font-bold text-white uppercase">
            {item?.name?.[0]}
          </span>
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
            {item.price.toLocaleString()} VND
          </p>
        )}
      </div>

      {/* Owner Info (Shop or Artist) */}
      <div className="border-t pt-4">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : owner ? (
          <div className="flex items-center gap-3">
            {owner.avatarUrl || owner.logoUrl ? (
              <img
                src={owner.avatarUrl || owner.logoUrl}
                alt={owner.name || artist?.profile?.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full object-cover bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                <span className="text-xl font-bold text-white uppercase">
                  {owner?.name?.[0] || artist?.fullName?.[0]}
                </span>
              </div>
            )}

            <div>
              <p className="text-md font-medium">
                {isArtist ? artist?.profile?.fullName : shop?.name}
              </p>
              {owner.address && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {owner.address}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => {
                if (isArtist) {
                  navigate(`/artist/${artist.id}`);
                } else {
                  navigate(`/shop/${shop.id}`);
                }
              }}
              className="ml-auto"
            >
              View {isArtist ? "Artist" : "Shop"}
            </Button>
          </div>
        ) : null}
      </div>

      {serviceItems.length > 1 && (
        <div className="space-y-2 mt-6">
          <h3 className="text-lg font-semibold">
            Other Services from this {isArtist ? "Artist" : "Shop"}
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
