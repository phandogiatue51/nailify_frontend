const roleMap: Record<number, { label: string; color: string }> = {
  0: {
    label: "Customer",
    color: "bg-gradient-to-r from-sky-100 to-sky-300 text-sky-900"
  },
  1: {
    label: "Shop Owner",
    color: "bg-gradient-to-r from-indigo-100 to-indigo-300 text-indigo-900"
  },
  2: {
    label: "Admin",
    color: "bg-gradient-to-r from-amber-100 to-orange-300 text-orange-900"
  },
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
