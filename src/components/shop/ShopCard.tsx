import { Shop } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CircleCheckBig } from "lucide-react";
interface ShopCardProps {
  shop: Shop;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98] rounded-[2rem]"
      onClick={() => navigate(`/shop/${shop.id}`)}
    >
      <div className="relative aspect-video bg-muted">
        {shop.coverUrl ? (
          <img
            src={shop.coverUrl}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200" />
        )}
        {shop.logoUrl && (
          <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-xl border-4 border-background overflow-hidden bg-background">
            <img
              src={shop.logoUrl}
              alt={`${shop.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      <CardContent className="pt-8 pb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-black text-lg">{shop.name}</h3>
        </div>

        {shop.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {shop.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopCard;
