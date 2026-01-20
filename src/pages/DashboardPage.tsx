import { useAuthContext } from "@/components/auth/AuthProvider";
import MobileLayout from "@/components/layout/MobileLayout";
import { useShop } from "@/hooks/useShop";
import { useBookings } from "@/hooks/useBookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Store, Calendar, Package, TrendingUp } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";

const DashboardPage = () => {
  const { user, loading } = useAuthContext();
  const { myShop, shopLoading } = useShop();
  const { useShopBookings } = useBookings();
  const { data: bookings } = useShopBookings(myShop?.id);
  const navigate = useNavigate();

  if (loading || shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role !== "ShopOwner") {
    return <Navigate to="/" replace />;
  }

  const pendingBookings =
    bookings?.filter((b) => b.status === "pending").length || 0;
  const todayBookings =
    bookings?.filter(
      (b) => b.booking_date === new Date().toISOString().split("T")[0],
    ).length || 0;

  if (!myShop) {
    return (
      <MobileLayout>
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Store className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Create Your Shop</h2>
          <p className="text-muted-foreground mb-6">
            Set up your nail shop to start receiving bookings
          </p>
          <Button onClick={() => navigate("/my-shop")}>Create Shop</Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <div className="pt-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">{myShop.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Today</span>
              </div>
              <p className="text-2xl font-bold">{todayBookings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingBookings}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => navigate("/my-shop")}
          >
            <div className="flex flex-col items-center gap-2">
              <Store className="w-6 h-6" />
              <span>My Shop</span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => navigate("/schedule")}
          >
            <div className="flex flex-col items-center gap-2">
              <Calendar className="w-6 h-6" />
              <span>Schedule</span>
            </div>
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DashboardPage;
