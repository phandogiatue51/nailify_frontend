import { useState, useRef } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import UserFilter from "@/components/admin/user/UserFilter";
import UserList, { UserListRef } from "@/components/admin/user/UserList"; // Import the ref type
import UserDetailModal from "@/components/admin/user/UserDetailModal";
import { ProfileFilter } from "@/types/filter";

const UsersManagement = () => {
  const { user, loading } = useAuthContext();
  const [filters, setFilters] = useState<ProfileFilter>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const userListRef = useRef<UserListRef>(null); // Create a ref to access UserList methods

  const handleUserUpdated = () => {
    // Refresh the user list
    userListRef.current?.refreshUsers();
    // Close the modal
    setSelectedUserId(null);
  };

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
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Quản lý <span className="text-[#950101]">Người dùng</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 italic mt-1">
            Quản lý toàn bộ người dùng
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-[#950101] uppercase tracking-widest">
            Nailify Dashboard
          </p>
        </div>
      </div>

      <div className="mb-12">
        <UserFilter filters={filters} onFilterChange={setFilters} />
      </div>

      <div className="mt-6">
        <UserList
          ref={userListRef}
          filters={filters}
          onUserSelect={setSelectedUserId}
        />
      </div>

      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          open={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default UsersManagement;
