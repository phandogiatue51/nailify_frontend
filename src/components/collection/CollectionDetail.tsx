import { Collection } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useCustomerShopById,
  useCustomerArtistById,
} from "@/hooks/useCustomer";
import { Loader2, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useCustomerCollections } from "@/hooks/useCustomer";
import CollectionCard from "@/components/collection/CollectionCard";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { profileAPI } from "@/services/api";
import { profile } from "console";
import { useQuery } from "@tanstack/react-query";
interface CollectionDetailProps {
  collection: Collection;
}

const CollectionDetail: React.FC<CollectionDetailProps> = ({ collection }) => {
  const navigate = useNavigate();

  const { data: shop, isLoading: shopLoading } = useCustomerShopById(
    collection.shopId,
  );
  const { data: artist, isLoading: artistLoading } = useCustomerArtistById(
    collection.nailArtistId,
  );

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileAPI.getProfile(),
  });
  const { data: collections = [], isLoading: collectionsLoading } =
    useCustomerCollections(collection.shopId, collection.nailArtistId);

  const isLoading = shopLoading || artistLoading;
  const owner = shop || artist;
  const isArtist = !!artist;

  const handleBookNow = () => {
    const bookingState: any = {
      type: collection.shopId ? "shop" : "artist",
      selectedCollection: collection,
      collectionId: collection.id,
      customerName: profile?.fullName,
      customerPhone: profile?.phone,
      customerAddress: profile?.address,
    };

    if (collection.shopId) {
      bookingState.shopId = collection.shopId;
    } else if (collection.nailArtistId) {
      bookingState.nailArtistId = collection.nailArtistId;
    }

    navigate(`/customer-book`, { state: bookingState });
  };

  return (
    <div className="min-h-screen">
      {collection.imageUrl ? (
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={collection.imageUrl}
            alt={collection.name}
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      ) : (
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <div className="w-full h-full rounded-[3rem] object-cover bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
            <span className="text-4xl font-bold text-white uppercase">
              {collection.name?.[0] || "U"}
            </span>
          </div>
        </div>
      )}

      <div className="pt-4">
        <h2 className="text-2xl font-bold">{collection.name}</h2>
        {collection.description && (
          <p className="text-muted-foreground mt-2">{collection.description}</p>
        )}
      </div>

      <div className="flex items-center gap-4 w-full pt-4">
        {collection.estimatedDuration ? (
          <Badge variant="secondary" className="whitespace-nowrap text-md">
            {collection.estimatedDuration} phút
          </Badge>
        ) : collection.calculatedDuration > 0 ? (
          <Badge variant="secondary" className="whitespace-nowrap text-md">
            {collection.calculatedDuration} phút
          </Badge>
        ) : null}

        {collection.totalPrice !== undefined && (
          <p className="ml-auto text-xl font-black text-green-600 whitespace-nowrap">
            {collection.totalPrice.toLocaleString()} đ
          </p>
        )}
      </div>

      {collection.tags && collection.tags.length > 0 && (
        <div className="space-y-2 pt-4">
          <h3 className="text-lg font-semibold">Phân loại</h3>
          <div className="flex flex-wrap gap-2">
            {collection.tags.map((tag) => (
              <Badge key={tag.id} className={tag.color}>
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
      <div className="pt-4 pb-6">
        <Button
          onClick={handleBookNow}
          className="font-black tracking-tight uppercase text-lg w-full rounded-[2rem] h-14"
          style={{
            background:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            border: "none",
          }}
        >
          Đặt lịch ngay
        </Button>
      </div>

      <Separator />

      {/* Owner Info */}
      <div className="pt-6">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : owner ? (
          <div className="flex items-center gap-3">
            {owner.avatarUrl || owner.logoUrl ? (
              <img
                src={owner.avatarUrl || owner.logoUrl}
                alt={owner.name || artist?.fullName}
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
              <p className="text-md font-bold">
                {isArtist ? artist?.fullName : shop?.name}
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
              className="ml-auto rounded-3xl border border-slate-400"
            >
              Xem trang {isArtist ? "thợ Nail" : "cửa hàng"}
            </Button>
          </div>
        ) : null}
      </div>

      {collections.length > 1 && (
        <div className="space-y-2 mt-6">
          <h3 className="text-lg font-semibold">
            Bộ sưu tập khác từ {isArtist ? "thợ Nail này" : "cửa hàng này"}
          </h3>
          <div className="grid grid-cols-2 gap-3 pt-4">
            {collections
              .filter((c) => c.id !== collection.id)
              .map((c) => (
                <Link key={c.id} to={`/collections/${c.id}`}>
                  <CollectionCard collection={c} />
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionDetail;
