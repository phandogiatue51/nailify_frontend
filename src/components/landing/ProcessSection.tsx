export const ProcessSection = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 text-center mb-20">
      <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D81B60] mb-3">
        Trải nghiệm người dùng
      </h2>
      <p className="text-4xl font-serif font-bold text-slate-900">
        Đặt lịch chỉ trong 3 bước
      </p>
    </div>

    <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-12 relative">
      {/* Visual Connecting Line (Optional - Desktop only) */}
      <div className="hidden md:block absolute top-1/2 left-0 w-full bg-slate-100 -z-10" />

      {["Chọn mẫu & Nghệ nhân", "Tính giá tự động", "Xác nhận 2 bước"].map(
        (step, i) => (
          <div key={i} className="relative group flex flex-col items-center">
            {/* Step Number Badge */}
            <div className="mb-6 w-10 h-10 rounded-full bg-[#950101] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-red-200 z-20">
              0{i + 1}
            </div>

            {/* Mobile Mockup Container */}
            <div className="relative z-10 w-[280px] rounded-[2.5rem] border-[8px] border-slate-900 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-4">
              <img
                src={`/images/booking/step${i + 1}.png`}
                alt={step}
                className="w-full h-full"
              />
            </div>

            {/* Content below image */}
            <div className="mt-8 text-center">
              <h3 className="text-lg font-bold text-[#950101] tracking-tight">
                {step}
              </h3>
              <div className="mt-2 w-8 h-1 bg-pink-100 mx-auto rounded-full group-hover:w-16 transition-all duration-300" />
            </div>

            {/* Individual Background Glow (Properly Contained) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-100/40 blur-[80px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ),
      )}
    </div>
  </section>
);