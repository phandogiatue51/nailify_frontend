import { Card, CardContent } from "@/components/ui/card";
import { ServiceItem } from "@/types/database";
import { Collection } from "@/types/database";
import { Package } from "lucide-react";

interface ServiceSummaryProps {
  selectedItems: ServiceItem[];
  selectedCollection?: Collection;
  shopLocationId?: string | null;
  nailArtistId?: string | null;
}

export const ServiceSummary = ({
  selectedItems,
  selectedCollection,
}: ServiceSummaryProps) => {

  const localTotalPrice = selectedCollection
    ? selectedCollection.totalPrice || 0
    : selectedItems.reduce((sum, item) => sum + Number(item.price), 0);

  const localTotalDuration = selectedCollection
    ? selectedCollection.estimatedDuration ||
      selectedCollection.calculatedDuration ||
      0
    : selectedItems.reduce(
        (sum, item) => sum + (item.estimatedDuration || 0),
        0,
      );

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Selected Services</h2>
        </div>

        {selectedCollection ? (
          <div className="space-y-3">
            {/* Collection info */}
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                {selectedCollection.imageUrl && (
                  <img
                    src={selectedCollection.imageUrl}
                    alt={selectedCollection.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{selectedCollection.name}</h3>
                  <p className="text-sm text-muted-foreground">Collection</p>
                </div>
              </div>

              {selectedCollection.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedCollection.description}
                </p>
              )}

              <div className="flex justify-between text-sm">
                <span>Estimated Price:</span>
                <span className="font-semibold">
                  {localTotalPrice.toLocaleString()} VND
                </span>
              </div>

              {localTotalDuration > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Estimated Duration:</span>
                  <span>{localTotalDuration} minutes</span>
                </div>
              )}
            </div>
          </div>
        ) : selectedItems.length > 0 ? (
          <div>
            {selectedItems.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <span>{item.name}</span>
                <span>{Number(item.price).toLocaleString()} VND</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2">
              <span>Total</span>
              <span>{localTotalPrice.toLocaleString()} VND</span>
            </div>
            <div className="text-sm text-muted-foreground pt-1">
              Duration: {localTotalDuration} minutes
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No services selected</p>
        )}

        <div className="mt-4 text-sm text-muted-foreground text-center">
          ⓘ Final price will be calculated after selecting date
        </div>
      </CardContent>
    </Card>
  );
};
