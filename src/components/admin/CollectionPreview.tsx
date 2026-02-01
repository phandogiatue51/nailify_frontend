import { useState } from "react";
import { Collection } from "@/types/database";
import { collectionAPI } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag,
  Building,
  User,
  Image as ImageIcon,
  Clock,
  DollarSign,
} from "lucide-react";

interface CollectionPreviewProps {
  shopId?: string;
  artistId?: string;
  compact?: boolean;
  title?: string;
}

export const CollectionPreview = ({
  shopId,
  artistId,
  compact = false,
  title = "Collections",
}: CollectionPreviewProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadCollections = async () => {
    if (collections.length > 0) return;

    setLoading(true);
    try {
      const filterParams: any = {};

      if (shopId) filterParams.ShopId = shopId;
      if (artistId) filterParams.ArtistId = artistId;

      const data = await collectionAPI.adminFilter(filterParams);
      setCollections(data);
    } catch (error) {
      console.error("Error loading collections:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    if (!expanded && collections.length === 0) {
      loadCollections();
    }
    setExpanded(!expanded);
  };

  // Compact view
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
            <Layers className="w-4 h-4" />
            <span>
              {title} ({collections.length})
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
            ) : collections.length > 0 ? (
              collections.slice(0, 3).map((collection) => (
                <div
                  key={collection.id}
                  className="text-sm flex justify-between items-center"
                >
                  <span className="truncate">{collection.name}</span>
                  <Badge variant={collection.isActive ? "default" : "outline"}>
                    {collection.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No {title.toLowerCase()}
              </p>
            )}
            {collections.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{collections.length - 3} more
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full view
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
            <Layers className="w-5 h-5" />
            {title} ({collections.length})
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
            ) : collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {collections.map((collection) => (
                  <Card key={collection.id} className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          {collection.imageUrl && (
                            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={collection.imageUrl}
                                alt={collection.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium">{collection.name}</h4>
                            {collection.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {collection.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {collection.estimatedDuration} min
                              </div>
                              {collection.totalPrice && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {collection.totalPrice.toLocaleString()} VND
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={collection.isActive ? "default" : "secondary"}
                      >
                        {collection.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {collection.tags && collection.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {collection.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Tag className="w-2 h-2" />
                            {tag.name}
                          </Badge>
                        ))}
                        {collection.tags.length > 3 && (
                          <Badge variant="outline">
                            +{collection.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
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
