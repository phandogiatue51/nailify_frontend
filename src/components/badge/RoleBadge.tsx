const roleMap: Record<number, { label: string; color: string }> = {
  0: { label: "Customer", color: "bg-blue-100 text-blue-800" },
  1: { label: "Shop Owner", color: "bg-green-100 text-green-800" },
  2: { label: "Admin", color: "bg-red-100 text-red-800" },
};

export const RoleBadge = ({ role }: { role: number }) => {
  const roleInfo = roleMap[role];
  if (!roleInfo) return null;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${roleInfo.color}`}
    >
      {roleInfo.label}
    </span>
  );
};
