import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User, Phone, MapPin, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export const GuestBookingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const isArtistBooking = !!user?.nailArtistId;

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
    });

    const [errors, setErrors] = useState({
        fullName: "",
        phone: "",
        address: "",
    });

    const validateForm = () => {
        const newErrors = {
            fullName: "",
            phone: "",
            address: "",
        };

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Name is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = "Invalid phone number";
        }

        // Only validate address for artist bookings
        if (isArtistBooking && !formData.address.trim()) {
            newErrors.address = "Address is required for artist bookings";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== "");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleContinue = () => {
        if (!validateForm()) return;

        const bookingState: any = {
            type: user?.shopId ? "shop" : "artist",
            customerProfileId: null,
            customerName: formData.fullName,
            customerPhone: formData.phone,
        };

        if (user?.shopId) {
            bookingState.shopId = user.shopId;
        } else if (user?.nailArtistId) {
            bookingState.nailArtistId = user.nailArtistId;
            bookingState.customerAddress = formData.address;
        }

        navigate("/booking/collection-selection", { state: bookingState });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1
                    className="font-black tracking-tight uppercase text-xl bg-clip-text text-transparent pb-1"
                    style={{
                        backgroundImage:
                            "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
                        WebkitBackgroundClip: "text",
                    }}
                >
                    Guest Booking
                </h1>
            </div>

            <div className="p-4">
                <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
                    <CardContent className="p-6 space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </label>
                            <Input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter guest full name"
                                className={cn(
                                    "h-12 rounded-xl border-2 bg-white",
                                    errors.fullName ? "border-red-500" : "border-slate-100"
                                )}
                            />
                            {errors.fullName && (
                                <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone Number
                            </label>
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter guest phone number"
                                className={cn(
                                    "h-12 rounded-xl border-2 bg-white",
                                    errors.phone ? "border-red-500" : "border-slate-100"
                                )}
                            />
                            {errors.phone && (
                                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                            )}
                        </div>

                        {/* Address Input - Only show for artist bookings */}
                        {isArtistBooking && (
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter guest address for home service"
                                    className={cn(
                                        "h-12 rounded-xl border-2 bg-white",
                                        errors.address ? "border-red-500" : "border-slate-100"
                                    )}
                                />
                                {errors.address && (
                                    <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                                )}
                                <p className="text-xs text-slate-400 mt-1">
                                    Artists provide home service, so address is required
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Continue Button */}
            <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
                <Button
                    onClick={handleContinue}
                    className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl"
                    style={{
                        background:
                            "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
                        border: "none",
                    }}
                >
                    Continue to Collections
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};
