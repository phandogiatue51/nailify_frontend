import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Profile } from "@/types/database";
import { ProfileFilter } from "@/types/filter";
import { profileAPI } from "@/services/api";
import UserCard from "./UserCard";
import { PaginationWrapper } from "@/components/ui/PaginationWrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

export interface UserListRef {
  refreshUsers: () => void;
}

interface UserListProps {
  filters: ProfileFilter;
  onUserSelect: (userId: string) => void;
}

export const UserList = forwardRef<UserListRef, UserListProps>(
  ({ filters, onUserSelect }, ref) => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const loadUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await profileAPI.filterProfiles(filters);
        setUsers(data);
      } catch (err) {
        setError("Failed to load users");
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };

    // Expose refreshUsers method via ref
    useImperativeHandle(ref, () => ({
      refreshUsers: () => {
        loadUsers();
      },
    }));

    useEffect(() => {
      loadUsers();
      setPage(1); // Reset to page 1 when filters change
    }, [filters]);

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={loadUsers}
              className="ml-4"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    if (users.length === 0) {
      return (
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-medium">Không tìm thấy người dùng</h3>
            <p className="text-muted-foreground mt-1">
              {Object.keys(filters).length > 0
                ? "Không tìm thấy người dùng phù hợp bộ lọc"
                : "Chưa có người dùng đăng ký"}
            </p>
          </div>
        </div>
      );
    }

    return (
      <PaginationWrapper
        items={users}
        currentPage={page}
        pageSize={9}
        onPageChange={setPage}
        renderItem={(user) => (
          <UserCard
            key={user.id}
            user={user}
            onViewDetails={() => onUserSelect(user.id)}
          />
        )}
        gridClassName="grid grid-cols-4 gap-4"
      />
    );
  },
);

UserList.displayName = "UserList";

export default UserList;
