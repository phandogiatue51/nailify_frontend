import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Calendar,
  User,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../hooks/use-auth";

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const role = user?.role;

  // cấu hình theo từng vai trò
  const roleConfig: Record<number, { dashboard: string; bookings: string }> = {
    1: { dashboard: "/shop-dashboard", bookings: "/my-shop/bookings" }, // Chủ tiệm
    3: { dashboard: "/staff-dashboard", bookings: "/staff/bookings" }, // Nhân viên
    4: { dashboard: "/artist-dashboard", bookings: "/my-artist/bookings" }, // Thợ Nail
    0: { dashboard: "/", bookings: "/profile/bookings" }, // Khách hàng
  };

  const config = roleConfig[role ?? 0];

  const navItems = [
    {
      href: config.dashboard,
      icon: Home,
      label: role === 0 ? "Trang chủ" : "Bảng điều khiển",
    },
    { href: "/explore", icon: Search, label: "Khám phá" },
    { href: config.bookings, icon: Calendar, label: "Đặt lịch" },
    { href: "/chat/list", icon: MessageCircle, label: "Trò chuyện" },
    { href: "/profile", icon: User, label: "Hồ sơ" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
