import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCustomerServiceItems } from "@/hooks/useCustomer";
import { ServiceItem } from "@/types/database";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import ServiceItemCard from "@/components/serviceItem/ServiceItemCard";
import { ArrowLeft, Loader2, AlertCircle, ShoppingBag } from "lucide-react";

export const CustomDesignPage = () => {
  const { shopId, id } = useParams<{
    shopId?: string;
    id?: string;
  }>();
  const navigate = useNavigate();

  const { groupedItems, serviceItems, isLoading } = useCustomerServiceItems(
    shopId,
    id,
  );

  const allItems: ServiceItem[] = Object.values(groupedItems || {}).flat();
  const [selectedItems, setSelectedItems] = useState<ServiceItem[]>([]);

  const handleBookNow = () => {
    const bookingState: any = {
      selectedItems,
      type: shopId ? "shop" : "artist",
    };

    if (shopId) {
      bookingState.shopId = shopId;
    } else if (id) {
      bookingState.id = id;
    }

    navigate(`/customer-book`, { state: bookingState });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <div>
            <h2 className="text-lg font-semibold mb-2">Loading services</h2>
            <p className="text-sm text-slate-500">
              {shopId
                ? "Fetching shop services..."
                : "Fetching artist services..."}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)} disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // No services available state
  if (allItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Custom Design</h1>
            </div>
          </div>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
            <div>
              <h2 className="text-xl font-bold mb-2">No services available</h2>
              <p className="text-slate-500">
                {shopId
                  ? "This shop doesn't have any services available for custom design yet."
                  : "This artist doesn't have any services available for custom design yet."}
              </p>
            </div>
            <div className="space-y-2 pt-4">
              <Button onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              {shopId && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/shop/${shopId}`)}
                  className="w-full"
                >
                  View Shop Profile
                </Button>
              )}
              {id && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/artist/${id}`)}
                  className="w-full"
                >
                  View Artist Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main content with services
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Custom Design</h1>
            <p className="text-sm text-slate-500">
              Select services to create your custom design
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Badge variant="secondary">
            {selectedItems.length}{" "}
            {selectedItems.length === 1 ? "item" : "items"} selected
          </Badge>
          <span className="text-sm font-medium">
            Total:{" "}
            {selectedItems
              .reduce((sum, item) => sum + Number(item.price), 0)
              .toLocaleString()}{" "}
            VND
          </span>
        </div>
      </div>

      {/* Services list */}
      <div className="flex-1 p-4 space-y-3 pb-24">
        {allItems.length > 0 ? (
          allItems.map((item: ServiceItem) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
                  <Checkbox
                    checked={selectedItems.some(
                      (selected) => selected.id === item.id,
                    )}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedItems((prev) => [...prev, item]);
                      } else {
                        setSelectedItems((prev) =>
                          prev.filter((i) => i.id !== item.id),
                        );
                      }
                    }}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1">
                    <ServiceItemCard item={item} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            No services found
          </div>
        )}
      </div>

      {/* Fixed bottom button */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <Button
          onClick={handleBookNow}
          disabled={selectedItems.length === 0}
          className="w-full h-12"
          size="lg"
        >
          {selectedItems.length === 0 ? (
            "Select services to continue"
          ) : (
            <>
              {shopId ? "Book Custom Design" : "Request Custom Design"}
              <Badge variant="secondary" className="ml-2">
                {selectedItems.length} items
              </Badge>
              <span className="ml-auto font-semibold">
                {selectedItems
                  .reduce((sum, item) => sum + Number(item.price), 0)
                  .toLocaleString()}{" "}
                VND
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
