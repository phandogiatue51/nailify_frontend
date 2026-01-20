const roleMap: Record<number, { label: string; color: string }> = {
    0: { label: "Forms", color: "bg-purple-100 text-purple-800" },
    1: { label: "Bases", color: "bg-yellow-100 text-yellow-800" },
    2: { label: "Shapes", color: "bg-pink-100 text-pink-800" },
    3: { label: "Polish", color: "bg-teal-100 text-teal-800" },
    4: { label: "Designs", color: "bg-indigo-100 text-indigo-800" },
};

export const ComponentBadge = ({ role }: { role: number }) => {
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
