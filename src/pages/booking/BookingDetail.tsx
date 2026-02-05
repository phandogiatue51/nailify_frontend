// /src/pages/booking/BookingDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useShopOwnerLocationById } from "@/hooks/useLocation";
import { useCustomerArtistById } from "@/hooks/useCustomer";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    Phone,
    Package,
    DollarSign,
    FileText,
    Copy,
    Download,
    MessageSquare,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";

import { BookingStatusBadge } from "@/components/badge/BookingStatusBadge";

const BookingDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const { data: booking, isLoading, error } = useBookings().useBookingById(id);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { data: shopLocation } = useShopOwnerLocationById(booking?.shopLocationId);
    const { data: nailArtist } = useCustomerArtistById(booking?.nailArtistId);

    useEffect(() => {
        if (location.state?.success) {
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 5000);
        }
    }, [location.state]);

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                            <h2 className="text-2xl font-bold">Booking Not Found</h2>
                            <p className="text-muted-foreground">
                                The booking you're looking for doesn't exist or you don't have permission to view it.
                            </p>
                            <Button onClick={() => navigate("/bookings")} className="mt-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Bookings
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleCancelBooking = () => {
        if (confirm("Are you sure you want to cancel this booking?")) {
            toast({
                title: "Booking cancelled",
                description: "The booking has been cancelled successfully",
            });
        }
    };

    const handleReschedule = () => {
        navigate(`/booking/reschedule/${id}`, {
            state: { booking },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Success Toast */}
            {showSuccessMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top">
                    <Card className="bg-green-50 border-green-200 shadow-lg">
                        <CardContent className="p-4 flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="font-semibold text-green-800">Booking Confirmed!</p>
                                <p className="text-sm text-green-600">Your appointment has been scheduled successfully.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-semibold">Booking Details</h1>
                            {booking && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">ID: {booking.id.substring(0, 8)}...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 max-w-4xl mx-auto space-y-6">
                {isLoading ? (
                    // Loading Skeleton
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-4 w-full" />
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                ) : booking ? (
                    <>
                        {/* Booking Status Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold">
                                            {booking.collectionName || "Custom Service"}
                                        </h3>
                                        <BookingStatusBadge status={booking.status} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-green-600">
                                            {booking.totalPrice.toLocaleString()} VND
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.durationMinutes} minutes
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Booking Info */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Date & Time Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5" />
                                            Date & Time
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">Date</p>
                                                <p className="font-medium">
                                                    {booking.scheduledStart} - {booking.scheduleEnd}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="w-5 h-5" />
                                            Service Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {booking.bookingItems.length > 0 ? (
                                            <div className="space-y-4">
                                                {booking.bookingItems.map((item, index) => (
                                                    <div key={item.id || index} className="flex justify-between items-center py-2">
                                                        <div>
                                                            <p className="font-medium">{item.serviceItemName}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {item.estimatedDuration} min
                                                            </p>
                                                        </div>
                                                        <p className="font-medium">
                                                            {item.price?.toLocaleString()} VND
                                                        </p>
                                                    </div>
                                                ))}
                                                <Separator />
                                                <div className="flex justify-between items-center py-2">
                                                    <p className="font-semibold">Total</p>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-lg">
                                                            {booking.totalPrice.toLocaleString()} VND
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {booking.durationMinutes} minutes total
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">No service items</p>
                                        )}
                                    </CardContent>
                                </Card>

                                {booking.notes && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                Additional Notes
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="whitespace-pre-wrap">{booking.notes}</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            Customer Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Name</p>
                                            <p className="font-medium">{booking.customerName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Phone</p>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <p className="font-medium">{booking.customerPhone}</p>
                                            </div>
                                        </div>
                                        {booking.customerAddress && (
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">Address</p>
                                                <p className="font-medium">{booking.customerAddress}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent> {booking?.shopLocationId ? (shopLocation ? (
                                        <div className="space-y-4 font-sans">
                                            <h2 className="text-2xl font-semibold text-gray-900">
                                                {shopLocation.shopName ?? "Unnamed Shop"}
                                            </h2>
                                            <div className="text-sm text-gray-700 leading-relaxed">
                                                <p>
                                                    {shopLocation.address}
                                                </p>
                                                {shopLocation.city &&
                                                    <p>
                                                        {shopLocation.city}
                                                    </p>
                                                }
                                                {shopLocation.phone &&
                                                    <p>
                                                        {shopLocation.phone}
                                                    </p>
                                                }
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                {shopLocation.openingTime &&
                                                    <p>
                                                        Opens: {shopLocation.openingTime
                                                        }
                                                    </p>}
                                                {shopLocation.closingTime &&
                                                    <p>Closes: {shopLocation.closingTime}</p>}
                                            </div>
                                        </div>) :
                                        (
                                            <p className="text-muted-foreground">Location not found</p>
                                        )
                                    ) : booking?.nailArtistId ? (nailArtist ? (
                                        <div className="space-y-2">
                                            <p className="font-medium">Mobile Service</p>
                                            <p className="text-sm text-muted-foreground">
                                                {nailArtist.address ?? "Artist will come to your location"}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">Artist not found
                                        </p>
                                    )
                                    )
                                        : (
                                            <p className="text-muted-foreground">Location not specified</p>
                                        )
                                    }
                                    </CardContent>
                                </Card>


                                {/* Help Card */}
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="font-medium text-blue-800">Need Help?</p>
                                                <p className="text-sm text-blue-600">
                                                    Contact support at{" "}
                                                    <a href="tel:+84123456789" className="underline">
                                                        +84 123 456 789
                                                    </a>{" "}
                                                    or email support@nailsalon.com
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>

            {/* Fixed Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate("/bookings")}
                    >
                        Back to Bookings
                    </Button>
                    <Button className="flex-1" onClick={() => window.print()}>
                        Print Details
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;