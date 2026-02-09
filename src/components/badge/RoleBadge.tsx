const roleMap: Record<number, { label: string; color: string }> = {
  0: {
    label: "Customer",
    color: "bg-gradient-to-r from-sky-100 to-sky-300 text-sky-900",
  },
  1: {
    label: "Shop Owner",
    color: "bg-gradient-to-r from-indigo-100 to-indigo-300 text-indigo-900",
  },
  2: {
    label: "Admin",
    color: "bg-gradient-to-r from-red-100 to-red-300 text-red-900",
  },
  3: {
    label: "Manager",
    color: "bg-gradient-to-r from-green-100 to-green-300 text-green-900",
  },
  4: {
    label: "Nail Artist",
    color: "bg-gradient-to-r from-pink-100 to-pink-300 text-pink-900",
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
