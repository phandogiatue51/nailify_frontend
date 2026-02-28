import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Palette, // Better for Artists
  Scissors,
  Layers, // Better for Collections
  Star, // Better for Ratings
  PenTool, // Better for Posts
  FileText, // Better for Invoices
  CreditCard, // Better for Subscriptions
  Menu,
  ChevronLeft,
  LogOut,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useAuthContext } from "../auth/AuthProvider";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { loading } = useAuth();
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/shops", icon: Store, label: "Shops" },
    { path: "/admin/artists", icon: Palette, label: "Nail Artists" },
    { path: "/admin/services", icon: Scissors, label: "Services" },
    { path: "/admin/collections", icon: Layers, label: "Collections" },
    { path: "/admin/ratings", icon: Star, label: "Ratings" },
    { path: "/admin/blogs", icon: PenTool, label: "Journal Posts" },
    { path: "/admin/invoices", icon: FileText, label: "Invoices" },
    { path: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" },
    { path: "/admin/chat", icon: MessageCircle, label: "Chats" },
  ];

  const handleSignOut = async () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-slate-100 transition-all duration-500 z-30 shadow-[20px_0_40px_rgba(0,0,0,0,01)]",
          sidebarOpen ? "w-72" : "w-20",
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-6 mb-4">
          <div
            className={cn(
              "flex items-center gap-3 overflow-hidden transition-all",
              !sidebarOpen && "w-0 opacity-0",
            )}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#950101] to-[#D81B60] flex items-center justify-center shadow-lg shadow-[#950101]/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-sm font-black uppercase tracking-[0.2em] whitespace-nowrap">
              Nailify <span className="text-slate-400 font-medium">Studio</span>
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300",
                  isActive
                    ? "bg-[#950101] text-white shadow-xl shadow-[#950101]/20 scale-[1.02]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-600",
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "shrink-0",
                    isActive
                      ? "text-white"
                      : "group-hover:scale-110 transition-transform",
                  )}
                />
                {sidebarOpen && (
                  <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-50">
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="group flex items-center gap-4 px-4 py-4 text-slate-400 hover:text-red-500 transition-all w-full rounded-2xl hover:bg-red-50"
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
            {sidebarOpen && (
              <span className="text-[11px] font-black uppercase tracking-widest">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-500 ease-in-out",
          sidebarOpen ? "ml-72" : "ml-20",
        )}
      >
        <div className="p-8 max-w-[1600px] mx-auto">
          {/* Page Header Portal could go here */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
