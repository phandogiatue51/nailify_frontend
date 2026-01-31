export const ExploreSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-48 bg-slate-200 rounded-[2rem]" />
    ))}
  </div>
);
