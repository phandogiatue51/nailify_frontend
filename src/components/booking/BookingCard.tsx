import {
  Booking,
  BookingItem,
  ServiceItem,
  Shop,
  Profile,
} from "@/types/database";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking & {
    shop?: Shop;
    customer?: Profile;
    items?: (BookingItem & { service_item?: ServiceItem })[];
  };
  isShopOwner?: boolean;
  onApprove?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
}

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Completed: "bg-blue-100 text-blue-800",
  Cancelled: "bg-gray-100 text-gray-800",
};

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isShopOwner = false,
  onApprove,
  onReject,
  onCancel,
}) => {
  const formattedDate = format(new Date(booking.bookingDate), "MMM d, yyyy");
  const formattedTime = booking.bookingTime.slice(0, 5);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          {isShopOwner && booking.customer && (
            <p className="font-semibold">{booking.customer.fullName}</p>
          )}
          {!isShopOwner && booking.shop && (
            <p className="font-semibold">{booking.shop.name}</p>
          )}
        </div>
        <Badge className={cn("capitalize", statusColors[booking.status])}>
          {booking.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formattedTime}</span>
          </div>
        </div>

        {!isShopOwner && booking.shop?.address && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{booking.shop.address}</span>
          </div>
        )}

        {booking.items && booking.items.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Services:</p>
            <div className="flex flex-wrap gap-1">
              {booking.items.map((item) => (
                <Badge key={item.id} variant="secondary" className="text-xs">
                  {item.serviceItem?.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {booking.notes && (
          <p className="text-sm text-muted-foreground italic">
            "{booking.notes}"
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <p className="font-bold text-lg text-primary">
            ${Number(booking.totalPrice).toFixed(2)}
          </p>

          {booking.status === "Pending" && (
            <div className="flex gap-2">
              {isShopOwner ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReject?.(booking.id)}
                  >
                    Reject
                  </Button>
                  <Button size="sm" onClick={() => onApprove?.(booking.id)}>
                    Approve
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onCancel?.(booking.id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
