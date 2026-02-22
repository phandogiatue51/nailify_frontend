import { GuestInfoForm, GuestInfoFormData } from "@/components/booking/GuestInfoProps";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
export const GuestBookingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmit = (data: GuestInfoFormData) => {
        const bookingState: any = {
            type: user?.shopId ? "shop" : "artist",
            customerProfileId: null,
            customerName: data.fullName,
            customerPhone: data.phone,
        };

        if (user?.shopId) {
            bookingState.shopId = user.shopId;
        } else if (user?.nailArtistId) {
            bookingState.nailArtistId = user.nailArtistId;
            bookingState.customerAddress = data.address;
        }

        navigate("/booking/collection-selection", { state: bookingState });
    };

    return (
        <GuestInfoForm
            mode="create"
            onSubmit={handleSubmit}
        />
    );
};