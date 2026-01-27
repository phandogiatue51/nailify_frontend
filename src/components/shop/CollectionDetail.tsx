import { Collection } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCustomerShopById } from "@/hooks/useCustomer";
import { Loader2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useCustomerCollections } from "@/hooks/useCustomer";
import CollectionCard from "@/components/shop/CollectionCard";
import { Link } from "react-router-dom";
interface CollectionDetailProps {
  collection: Collection;
}

const CollectionDetail: React.FC<CollectionDetailProps> = ({ collection }) => {
  const { data: shop, isLoading } = useCustomerShopById(collection.shopId);
  const navigate = useNavigate();
  const { data: collections = [], isLoading: loadingCollections } =
    useCustomerCollections(collection.shopId);
  return (
    <div className="space-y-6">
      {collection.imageUrl && (
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={collection.imageUrl}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold">{collection.name}</h2>
        {collection.description && (
          <p className="text-muted-foreground mt-2">{collection.description}</p>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm w-full">
        {collection.estimatedDuration && (
          <Badge variant="secondary" className="whitespace-nowrap">
            {collection.estimatedDuration} min
          </Badge>
        )}

        {collection.totalPrice !== undefined && (
          <p className="ml-auto text-xl font-bold text-green-600 whitespace-nowrap">
            {collection.totalPrice.toFixed(3)} VND
          </p>
        )}
      </div>
      {collection.tags && collection.tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {collection.tags.map((tag) => (
              <Badge key={tag.id} className={tag.color}>
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
      <Separator />
      <div className="pt-2">
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
              <p className="text-sm font-medium">{shop.name}</p>
              {shop.address && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {shop.address}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(`/shop/${shop.id}`)}
            >
              View Shop
            </Button>
          </div>
        ) : null}
      </div>
      {collections.length > 1 && (
        <div className="space-y-2 mt-6">
          <h3 className="text-lg font-semibold">
            Other Collections from this Shop
          </h3>
          <div className="grid grid-cols-2 gap-3">
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
