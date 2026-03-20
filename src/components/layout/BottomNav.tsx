import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Calendar,
  User,
  ClipboardCheck,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../hooks/use-auth";

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isShopOwner = user?.role === 1;
  const isNailArtist = user?.role === 4;
  const isStaff = user?.role === 3;

  const customerNavItems = [
    { href: "/", icon: Home },
    { href: "/explore", icon: Search },
    { href: "/profile/bookings", icon: Calendar },
    { href: "/chat/list", icon: MessageCircle },
    { href: "/profile", icon: User, label: "Hồ sơ" },
  ];

  const shopOwnerNavItems = [
    { href: "/shop-dashboard", icon: Home },
    { href: "/explore", icon: Search },
    { href: "/my-shop/bookings", icon: ClipboardCheck },
    { href: "/chat/list", icon: MessageCircle },
    { href: "/profile", icon: User },
  ];

  const StaffNavItems = [
    { href: "/staff-dashboard", icon: Home },
    { href: "/explore", icon: Search },
    { href: "/staff/bookings", icon: ClipboardCheck },
    { href: "/chat/list", icon: MessageCircle },
    { href: "/profile", icon: User },
  ];

  const nailArtistNavItems = [
    { href: "/artist-dashboard", icon: Home },
    { href: "/explore", icon: Search },
    { href: "/my-artist/bookings", icon: ClipboardCheck },
    { href: "/chat/list", icon: MessageCircle },
    { href: "/profile", icon: User },
  ];

  const navItems = isShopOwner
    ? shopOwnerNavItems
    : isNailArtist
      ? nailArtistNavItems
      : isStaff
        ? StaffNavItems
        : customerNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ href, icon: Icon }) => {
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
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
