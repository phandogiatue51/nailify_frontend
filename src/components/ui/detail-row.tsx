export const DetailRow = ({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  children?: React.ReactNode;
}) => (
  <div className="flex items-center gap-4 p-4">
    <Icon className="w-4 h-4 text-slate-400" />
    <div className="flex flex-col text-left">
      <span className="text-[10px] uppercase font-bold text-slate-400 leading-tight">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-900">{value}</span>
        {children}
      </div>
    </div>
  </div>
);
