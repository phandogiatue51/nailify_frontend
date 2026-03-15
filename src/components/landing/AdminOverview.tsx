export const AdminOverview = () => (
  <section className="py-24 bg-gradient-to-br from-[#950101] to-[#FFCFE9] overflow-hidden text-white">
    <div className="max-w-7xl mx-auto px-6">
      {/* Section Header */}
      <div className="text-center mb-20">
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] mb-4">
          Codix Admin Panel
        </h3>
        <h2 className="text-4xl md:text-5xl font-serif font-light">
          Quản trị <span className="font-bold">Toàn diện</span>
        </h2>
        <div className="mt-6 w-24 h-1 bg-[#950101] mx-auto rounded-full" />
      </div>

      <div className="space-y-32">
        {/* FIRST DESKTOP SCREEN */}
        <div className="group">
          <div className="mb-8 text-center">
            <h4 className="text-xl font-bold mb-2">
              Tổng quan hệ thống
            </h4>
            <p className=" max-w-2xl mx-auto">
              Theo dõi toàn bộ hoạt động của hệ thống, từ doanh thu tổng đến
              lượng người dùng truy cập thời gian thực.
            </p>
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-slate-800 p-2 shadow-2xl transition-all duration-700 group-hover:border-[#950101]/50">
            <img
              src="/images/admin/admin1.png"
              className="w-full rounded-xl"
              alt="Admin Dashboard Analytics"
            />
          </div>
        </div>

        {/* SECOND DESKTOP SCREEN */}
        <div className="group">
          <div className="mb-8 text-center">
            <h4 className="text-xl font-bold  mb-2">
              Quản lý chi tiết
            </h4>
            <p className=" max-w-2xl mx-auto">
              Kiểm soát danh sách cửa hàng, phê duyệt nghệ nhân và quản lý các
              giao dịch nạp tiền/đặt cọc.
            </p>
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-slate-800 p-2 shadow-2xl transition-all duration-700 group-hover:border-[#D81B60]/50">
            <img
              src="/images/admin/admin2.png"
              className="w-full rounded-xl"
              alt="Admin Detailed Management"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);
