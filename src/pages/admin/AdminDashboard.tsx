import { useEffect, useState } from "react";
import {
  Store,
  Users,
  Scissors,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pendingShops: 12,
    totalShops: 156,
    totalUsers: 2890,
    totalServices: 423,
    totalRevenue: 125400,
    growthRate: 24.5,
  });
  const { user, loading } = useAuthContext();

  if (!user || user?.role !== 2) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  const [recentShops, setRecentShops] = useState([
    { id: 1, name: "Elegant Nails", status: "pending", date: "2024-01-28" },
    { id: 2, name: "Glamour Spa", status: "approved", date: "2024-01-27" },
    { id: 3, name: "Nail Paradise", status: "rejected", date: "2024-01-26" },
  ]);

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp size={16} className="text-green-500" />
          <span className="text-green-600 font-medium">{trend}%</span>
          <span className="text-muted-foreground">from last month</span>
        </div>
      )}
    </div>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { color: string; icon: any; text: string }> = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertCircle,
        text: "Pending",
      },
      approved: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Approved",
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Rejected",
      },
    };

    const { color, icon: Icon, text } = config[status] || config.pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}
      >
        <Icon size={14} />
        {text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Shops"
          value={stats.pendingShops}
          icon={Store}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          color="bg-blue-100 text-blue-600"
          trend={12.3}
        />
        <StatCard
          title="Services"
          value={stats.totalServices}
          icon={Scissors}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-100 text-green-600"
          trend={stats.growthRate}
        />
      </div>

      {/* Recent Shops Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Shop Submissions</h2>
          <Link
            to="/admin/shops"
            className="text-primary hover:underline font-medium"
          >
            View all →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 font-medium">Shop Name</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Submission Date</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentShops.map((shop) => (
                <tr key={shop.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{shop.name}</td>
                  <td className="p-4">
                    <StatusBadge status={shop.status} />
                  </td>
                  <td className="p-4 text-muted-foreground">{shop.date}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/shops/${shop.id}`}
                        className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                      >
                        Review
                      </Link>
                      <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 text-sm">
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
