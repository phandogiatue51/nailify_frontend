import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-[#950101] to-[#FFCFE9] text-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D81B60] bg-pink-50 px-3 py-1 rounded-full">
            Nailify Premium Platform
          </span>
          <h1 className="text-6xl font-serif font-light leading-tight">
            <span className="font-bold ">Nailify</span>
          </h1>
          <p className="text-xl italic font-light max-w-md">
            Nền tảng trung gian kết nối nghệ nhân và khách hàng qua hệ thống đặt
            lịch thông minh.
          </p>
          <Button
            onClick={() => navigate(`/auth`)}
            className="px-6 py-2 rounded-full bg-white text-[#950101] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-100 hover:scale-105 transition-transform hover:text-white hover:bg-[#950101]"
          >
            Trải nghiệm ngay
          </Button>
        </div>
        <div className="flex-1 relative">
          <div className="relative z-10 w-[300px] mx-auto rounded-[3rem] border-[8px] border-slate-900 overflow-hidden shadow-2xl shadow-pink-200">
            <img
              src="/images/hero/login.png"
              alt="Nailify App"
              className="w-full"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-200/20 blur-[120px] rounded-full -z-10" />
        </div>
      </div>
    </section>
  );
};
