const roleMap: Record<
  number,
  { label: string; color: string; border: string }
> = {
  0: {
    label: "Active",
    color: "bg-gradient-to-r from-purple-100 to-purple-300 text-purple-900",
    border: "border-purple-300",
  },
  1: {
    label: "Expired",
    color: "bg-gradient-to-r from-yellow-100 to-yellow-300 text-yellow-900",
    border: "border-yellow-300",
  },
  2: {
    label: "Cancelled",
    color: "bg-gradient-to-r from-pink-100 to-pink-300 text-pink-900",
    border: "border-pink-300",
  },
  3: {
    label: "Pending",
    color: "bg-gradient-to-r from-teal-100 to-teal-300 text-teal-900",
    border: "border-teal-300",
  }
};

export const SubscriptionStatusBadge = ({ role }: { role: number }) => {
  const roleInfo = roleMap[role];
  if (!roleInfo) return null;

  return (
    <span
      className={`
        px-2.5 py-0.5 
        rounded-full 
        text-xs font-semibold 
        border shadow-sm 
        inline-flex items-center
        ${roleInfo.color} 
        ${roleInfo.border}
      `}
    >
      {roleInfo.label}
    </span>
  );
};
