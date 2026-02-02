import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Users,
  Scissors,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useAuthContext } from "../auth/AuthProvider";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, loading } = useAuth();
  const { logout } = useAuthContext();

  const navigate = useNavigate();
  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Users Management" },
    { path: "/admin/shops", icon: Store, label: "Shops Management" },
    { path: "/admin/artists", icon: Store, label: "Artists Management" },
    { path: "/admin/services", icon: Scissors, label: "Services Management" },
    {
      path: "/admin/collections",
      icon: Scissors,
      label: "Collections Management",
    },
  ];

  const handleSignOut = async () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30",
          sidebarOpen ? "w-64" : "w-20",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div
            className={cn(
              "flex items-center gap-3",
              !sidebarOpen && "justify-center",
            )}
          >
            <Store className="h-8 w-8 text-primary" />
            {sidebarOpen && (
              <h1 className="text-xl font-bold">Nailify Admin</h1>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="p-4 border-b">
          <div
            className={cn(
              "flex items-center gap-3",
              !sidebarOpen && "justify-center",
            )}
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.fullName}</p>
                <p className="text-sm text-muted-foreground truncate">
                  Administrator
                </p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100",
                )}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-20",
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
