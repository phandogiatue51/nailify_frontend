import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
export default function Header({ title = "Nailify" }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1
          className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #950101, #D81B60, #FFCFE9)",
          }}
        >
          {title}
        </h1>

        <Button
          onClick={() => navigate(`/auth`)}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-[#950101] to-[#D81B60] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-100 hover:scale-105 transition-transform"
        >
          Trải nghiệm ngay
        </Button>
      </div>
    </header>
  );
}
