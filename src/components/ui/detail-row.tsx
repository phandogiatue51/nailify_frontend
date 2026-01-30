export const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) => (
  <div className="flex items-center gap-4 p-4">
    <Icon className="w-4 h-4 text-slate-400" />
    <div className="flex flex-col text-left">
      <span className="text-[10px] uppercase font-bold text-slate-400 leading-tight">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  </div>
);
