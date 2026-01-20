import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { useShopById } from "@/hooks/useShop";
import { useServiceItems } from "@/hooks/useServiceItems";
import { useCollections } from "@/hooks/useCollections";
import { useBookings } from "@/hooks/useBookings";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Loader2,
  ArrowLeft,
  MapPin,
  Phone,
  ShoppingBag,
  X,
} from "lucide-react";
import { ComponentType, ServiceItem } from "@/types/database";
import ServiceItemCard from "@/components/shop/ServiceItemCard";
import CollectionCard from "@/components/shop/CollectionCard";
import { format } from "date-fns";
import { toast } from "sonner";

const COMPONENT_TYPES: { value: ComponentType; label: string }[] = [
  { value: "Form", label: "Forms" },
  { value: "Base", label: "Bases" },
  { value: "Shape", label: "Shapes" },
  { value: "Polish", label: "Polish" },
  { value: "Design", label: "Designs" },
];

const ShopDetailPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const { data: shop, isLoading: shopLoading } = useShopById(shopId);
  const { groupedItems, isLoading: itemsLoading } = useServiceItems(shopId);
  const { collections, isLoading: collectionsLoading } = useCollections(shopId);
  const { createBooking } = useBookings();

  const [selectedItems, setSelectedItems] = useState<ServiceItem[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [notes, setNotes] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string>();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  if (loading || shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!shop) {
    return <Navigate to="/" replace />;
  }

  const toggleItem = (item: ServiceItem) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const selectCollection = (collection: any) => {
    setSelectedItems(collection.items || []);
    setSelectedCollection(collection.id);
    setShowBooking(true);
  };

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + Number(item.price),
    0,
  );

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || selectedItems.length === 0) {
      toast.error("Please select a date, time, and at least one service");
      return;
    }

    if (!user || showCustomerForm) {
      if (!customerName.trim()) {
        toast.error("Please enter your name");
        return;
      }
      if (!customerPhone.trim()) {
        toast.error("Please enter your phone number");
        return;
      }
    }

    try {
      await createBooking.mutateAsync({
        shopId: shop.id,
        bookingDate: format(selectedDate, "yyyy-MM-dd"),
        bookingTime: selectedTime + ":00",
        notes: notes || undefined,
        collectionId: selectedCollection,
        items: selectedItems.map((item) => ({
          serviceItemId: item.id,
        })),
        customerName: customerName,
        customerPhone: customerPhone,
      });

      toast.success("Booking submitted! Waiting for approval.");
      setShowBooking(false);
      setSelectedItems([]);
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setNotes("");
      setSelectedCollection(undefined);
      setCustomerName("");
      setCustomerPhone("");
      setShowCustomerForm(false);
      navigate("/bookings");
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    }
  };

  return (
    <MobileLayout showNav={false}>
      <div className="relative">
        {/* Header Image */}
        <div className="h-48 bg-muted relative">
          {shop.cover_url ? (
            <img
              src={shop.cover_url}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-background/80 backdrop-blur"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Shop Info */}
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            {shop.logo_url && (
              <img
                src={shop.logo_url}
                alt={shop.name}
                className="w-16 h-16 rounded-xl object-cover -mt-10 border-4 border-background"
              />
            )}
            <div className="flex-1 pt-1">
              <h1 className="text-2xl font-bold">{shop.name}</h1>
              {shop.description && (
                <p className="text-muted-foreground text-sm mt-1">
                  {shop.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {shop.address && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {shop.address}
              </div>
            )}
            {shop.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {shop.phone}
              </div>
            )}
          </div>
        </div>

        {/* Services & Collections */}
        <div className="p-4">
          <Tabs defaultValue="services">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4 mt-4">
              {itemsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                COMPONENT_TYPES.map((type) => {
                  const items = groupedItems[type.value] || [];
                  if (items.length === 0) return null;
                  return (
                    <div key={type.value}>
                      <h3 className="font-semibold mb-3">{type.label}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {items.map((item) => (
                          <ServiceItemCard
                            key={item.id}
                            item={item}
                            selected={
                              !!selectedItems.find((i) => i.id === item.id)
                            }
                            onSelect={() => toggleItem(item)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="collections" className="space-y-4 mt-4">
              {collectionsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : collections && collections.length > 0 ? (
                collections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onSelect={() => selectCollection(collection)}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <p>No collections available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {selectedItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold">
                  {selectedItems.length} items selected
                </p>
                <p className="text-lg font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
              <Button onClick={() => setShowBooking(true)}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {selectedItems.map((item) => (
                <Badge
                  key={item.id}
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  {item.name}
                  <button
                    onClick={() => toggleItem(item)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Dialog open={showBooking} onOpenChange={setShowBooking}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book Appointment</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {(!user || showCustomerForm) && (
                <div className="space-y-3 p-3 border rounded-lg">
                  <h4 className="text-sm font-medium">Your Information</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Your Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Phone Number *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2">Selected Services</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItems.map((item) => (
                    <Badge key={item.id} variant="secondary">
                      {item.name} - ${Number(item.price).toFixed(2)}
                    </Badge>
                  ))}
                </div>
                <p className="text-lg font-bold text-primary mt-2">
                  Total: ${totalPrice.toFixed(2)}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Select Date</h4>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Select Time</h4>
                <TimePicker
                  onChange={(value) => setSelectedTime(value)}
                  value={selectedTime}
                  format="HH:mm"
                  clearIcon={null}
                  className="w-full [&_.react-time-picker__wrapper]:border [&_.react-time-picker__wrapper]:rounded-md [&_.react-time-picker__wrapper]:px-3 [&_.react-time-picker__wrapper]:py-2"
                />
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-sm font-medium mb-2">Notes (optional)</h4>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests..."
                  rows={3}
                />
              </div>

              <Button
                onClick={handleBooking}
                className="w-full"
                disabled={
                  !selectedDate ||
                  !selectedTime ||
                  (!user && (!customerName || !customerPhone)) ||
                  createBooking.isPending
                }
              >
                {createBooking.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Confirm Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
};

export default ShopDetailPage;
