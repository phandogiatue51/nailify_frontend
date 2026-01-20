import { Link, useLocation } from "react-router-dom";
import { Home, Search, Calendar, User, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../hooks/use-auth";

const BottomNav = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const isShopOwner = profile?.role === "ShopOwner";

  const customerNavItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Search, label: "Explore" },
    { href: "/bookings", icon: Calendar, label: "Bookings" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const ownerNavItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/my-shop", icon: Store, label: "My Shop" },
    { href: "/schedule", icon: Calendar, label: "Schedule" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const navItems = isShopOwner ? ownerNavItems : customerNavItems;

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
