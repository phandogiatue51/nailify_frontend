import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import UserFilter from "@/components/admin/user/UserFilter";
import UserList from "@/components/admin/user/UserList";
import UserDetailModal from "@/components/admin/user/UserDetailModal";
import { ProfileFilter } from "@/types/filter";

const UsersManagement = () => {
  const { user, loading } = useAuthContext();
  const [filters, setFilters] = useState<ProfileFilter>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user?.role !== 2) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả người dùng và phân quyền
          </p>
        </div>
        <div className="text-sm text-muted-foreground">Nailify Dashboard</div>
      </div>

      <UserFilter filters={filters} onFilterChange={setFilters} />

      <div className="mt-6">
        <UserList filters={filters} onUserSelect={setSelectedUserId} />
      </div>

      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          open={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onUserUpdated={() => {
            setSelectedUserId(null);
          }}
        />
      )}
    </div>
  );
};

export default UsersManagement;
