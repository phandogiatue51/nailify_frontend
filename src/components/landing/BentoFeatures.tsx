export const BentoFeatures = () => (
  <section className="py-24 px-6 bg-slate-50">
    <div className="max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#950101] mb-2">
          Trang quản lý
        </h2>
        <p className="text-3xl font-serif font-bold">
          Dành cho chủ tiệm & Thợ nail
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CARD 1: SHOP INSIGHT */}
        <div className="relative bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden group hover:shadow-xl transition-all duration-500">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">Quản trị Insight</h3>
            <p className="text-slate-500 text-sm">
              Theo dõi doanh thu và xu hướng mẫu nail được yêu thích nhất.
            </p>
          </div>
          <div className="relative mt-auto pt-4">
            <div className="mx-auto w-[260px] rounded-[2.5rem] border-[7px] border-slate-900 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
              <img
                src="/images/shop/insight.png"
                alt="Analytics"
                className="w-full"
              />
            </div>
            {/* Soft Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-200/30 blur-[60px] -z-10" />
          </div>
        </div>

        {/* CARD 2: COLLECTION CRUD (Garnet Brand Color) */}
        <div className="relative bg-gradient-to-br from-[#950101] to-[#FFCFE9] p-8 rounded-[2rem] flex flex-col overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2 text-pink-100">Portfolio</h3>
            <p className="text-white/70 text-sm">
              Tạo bộ sưu tập cá nhân và quảng bá mẫu móng đặc trưng.
            </p>
          </div>
          <div className="relative mt-auto pt-4">
            <div className="mx-auto w-[260px] rounded-[2.5rem] border-[7px] border-slate-900 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
              <img
                src="/images/shop/collectionCRUD.png"
                alt="CRUD"
                className="w-full"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 blur-[60px] -z-10" />
          </div>
        </div>

        {/* CARD 3: SHOP DASHBOARD/CALENDAR */}
        <div className="relative bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden group hover:shadow-xl transition-all duration-500">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">Lịch thông minh</h3>
            <p className="text-slate-500 text-sm">
              Tự động hóa việc sắp xếp thợ và tối ưu hóa thời gian phục vụ.
            </p>
          </div>
          <div className="relative mt-auto pt-4">
            <div className="mx-auto w-[260px] rounded-[2.5rem] border-[7px] border-slate-900 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
              <img
                src="/images/shop/calendar.png"
                alt="Calendar"
                className="w-full"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-200/30 blur-[60px] -z-10" />
          </div>
        </div>
      </div>
    </div>
  </section>
);
