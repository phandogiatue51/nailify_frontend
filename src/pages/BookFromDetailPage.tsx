import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { useCustomerShopById } from "@/hooks/useCustomer";
import { useBookings } from "@/hooks/useBookings";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import TimePicker from "react-time-picker";
import { Card, CardContent } from "@/components/ui/card";

import "react-time-picker/dist/TimePicker.css";
import {
    Loader2,
    ArrowLeft,
    MapPin,
    Phone,
    ShoppingBag,
    CalendarIcon,
    Clock,
} from "lucide-react";
import { ServiceItem } from "@/types/database";
import { format } from "date-fns";
import { toast } from "sonner";

const BookFromDetailPage = () => {
    const { shopId } = useParams<{ shopId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthContext();
    const { data: shop, isLoading: shopLoading } = useCustomerShopById(shopId);
    const { createBooking } = useBookings();

    // Get selected items from navigation state or initialize as empty
    const [selectedItems, setSelectedItems] = useState<ServiceItem[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<string>();

    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<string>();
    const [notes, setNotes] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [showCustomerForm, setShowCustomerForm] = useState(false);

    useEffect(() => {
        // Load selected items from navigation state
        if (location.state?.selectedItems) {
            setSelectedItems(location.state.selectedItems);
        }
        if (location.state?.selectedCollection) {
            setSelectedCollection(location.state.selectedCollection);
        }

        // If user is not logged in, show customer form
        if (!user) {
            setShowCustomerForm(true);
        }
    }, [location.state, user]);

    if (shopLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!shop) {
        return <Navigate to="/" replace />;
    }

    const totalPrice = selectedItems.reduce(
        (sum, item) => sum + Number(item.price),
        0,
    );

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || selectedItems.length === 0) {
            toast.error("Please select a date, time, and at least one service");
            return;
        }

        if (showCustomerForm) {
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
            navigate("/bookings");
        } catch (error: any) {
            toast.error(error.message || "Failed to create booking");
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <MobileLayout showNav={false}>
            <div className="p-4 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goBack}
                        className="shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Book Appointment</h1>
                        <p className="text-sm text-muted-foreground">{shop.name}</p>
                    </div>
                </div>

                {/* Shop Info Card */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            {shop.logoUrl && (
                                <img
                                    src={shop.logoUrl}
                                    alt={shop.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                            )}
                            <div className="flex-1">
                                <h3 className="font-semibold">{shop.name}</h3>
                                {shop.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {shop.description}
                                    </p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                    {shop.address && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span>{shop.address}</span>
                                        </div>
                                    )}
                                    {shop.phone && (
                                        <div className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            <span>{shop.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Selected Services */}
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-3">Selected Services</h3>
                        {selectedItems.length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                                No services selected. Please go back and select services.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {selectedItems.map((item) => (
                                        <Badge key={item.id} variant="secondary" className="text-sm">
                                            {item.name} - ${Number(item.price).toFixed(2)}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="pt-3 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Total:</span>
                                        <span className="text-xl font-bold text-primary">
                                            ${totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Customer Information */}
                {showCustomerForm && (
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-semibold mb-3">Your Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">
                                        Full Name *
                                    </label>
                                    <Input
                                        placeholder="Enter your full name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">
                                        Phone Number *
                                    </label>
                                    <Input
                                        placeholder="Enter your phone number"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Date Selection */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <CalendarIcon className="w-4 h-4" />
                            <h3 className="font-semibold">Select Date</h3>
                        </div>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            className="rounded-md border"
                        />
                        {selectedDate && (
                            <p className="text-sm text-muted-foreground mt-3">
                                Selected: {format(selectedDate, "PPP")}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Time Selection */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4" />
                            <h3 className="font-semibold">Select Time</h3>
                        </div>
                        <TimePicker
                            onChange={setSelectedTime}
                            value={selectedTime}
                            format="HH:mm"
                            clearIcon={null}
                            className="w-full [&_.react-time-picker__wrapper]:border [&_.react-time-picker__wrapper]:rounded-md [&_.react-time-picker__wrapper]:px-3 [&_.react-time-picker__wrapper]:py-2"
                        />
                        {selectedTime && (
                            <p className="text-sm text-muted-foreground mt-3">
                                Selected: {selectedTime}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-3">Additional Notes</h3>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special requests, notes, or requirements..."
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Optional: Let the shop know if you have any specific requirements
                        </p>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <Button
                    onClick={handleBooking}
                    className="w-full h-12 text-base"
                    size="lg"
                    disabled={
                        !selectedDate ||
                        !selectedTime ||
                        selectedItems.length === 0 ||
                        (showCustomerForm && (!customerName || !customerPhone)) ||
                        createBooking.isPending
                    }
                >
                    {createBooking.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Confirm Booking"
                    )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Your booking will be confirmed after the shop approves it
                </p>
            </div>
        </MobileLayout>
    );
};

export default BookFromDetailPage;