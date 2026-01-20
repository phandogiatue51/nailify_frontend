const roleMap: Record<number, { label: string; color: string }> = {
    0: { label: "Pending", color: "bg-orange-100 text-orange-800" },
    1: { label: "Approved", color: "bg-green-100 text-green-800" },
    2: { label: "Rejected", color: "bg-red-100 text-red-800" },
    3: { label: "Completed", color: "bg-teal-100 text-teal-800" },
    4: { label: "Cancelled", color: "bg-yellow-100 text-yellow-800" },
};

export const BookingStatusBadge = ({ status }: { status: number }) => {
    const roleInfo = roleMap[status];
    if (!roleInfo) return null;

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${roleInfo.color}`}
        >
            {roleInfo.label}
        </span>
    );
};
