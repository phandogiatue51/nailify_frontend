export const ActionButton = ({ icon: Icon, label, sub, onClick }: any) => (
  <button
    onClick={onClick}
    className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-start gap-2 shadow-sm active:scale-95 transition-all text-left"
  >
    <div className="p-2 bg-slate-50 rounded-lg text-primary">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="font-bold text-slate-900 text-sm">{label}</p>
      <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
        {sub}
      </p>
    </div>
  </button>
);
