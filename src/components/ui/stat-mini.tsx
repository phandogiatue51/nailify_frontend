export const StatMini = ({ label, value, color, bg }: any) => (
  <div
    className={`${bg} rounded-xl p-3 flex flex-col items-center justify-center text-center`}
  >
    <span className="text-[10px] font-bold uppercase text-slate-500 mb-1">
      {label}
    </span>
    <span className={`text-xl font-black ${color}`}>{value}</span>
  </div>
);
