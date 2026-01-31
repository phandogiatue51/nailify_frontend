import { Search, Bell } from "lucide-react";
export default function Header({ title = "Nailify", hasNotification = false }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(to right, #FFC988, #E288F9)",
          }}
        >
          {title}
        </h1>
        <div className="flex gap-2">
          <button className="p-2 bg-slate-100 rounded-full">
            <Search className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 bg-slate-100 rounded-full relative">
            <Bell className="w-5 h-5 text-slate-600" />
            {hasNotification && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
