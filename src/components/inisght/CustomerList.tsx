// components/insights/CustomerList.tsx
import React, { useState } from "react";
import { CustomerDetail } from "@/types/database";
import { Star, Users } from "lucide-react";

interface CustomerListProps {
  title?: string;
  customers: CustomerDetail[];
}

const CustomerList: React.FC<CustomerListProps> = ({ title, customers }) => {
  const [showAll, setShowAll] = useState(false);

  if (!customers || customers.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-50 p-8 text-center shadow-md">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#950101] mb-6">
          {title}
        </h3>
        <div className="py-12 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-xs font-bold text-slate-400 italic">
            Chưa có khách hàng trong danh mục này
          </p>
        </div>
      </div>
    );
  }

  const displayCustomers = showAll ? customers : customers.slice(0, 5);
  const hasMore = customers.length > 5;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-50 p-6 shadow-md">
      {/* Editorial Header */}
      <div className="flex justify-between items-end mb-8 px-2">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">
            Danh Sách Khách Hàng
          </span>
          <h3 className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">
            {title}
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {displayCustomers.map((customer, index) => (
          <div
            key={index}
            className="group flex justify-between items-center p-4 rounded-2xl hover:bg-slate-50 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              {/* Client Avatar / Initial */}
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm relative shrink-0">
                {customer.customerName?.[0] || "K"}
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
                    <Star className="w-2 h-2 fill-white text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-800 tracking-tight">
                    {customer.customerName || "Khách ẩn danh"}
                  </span>
                </div>
                <div className="flex flex-col text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {customer.customerPhone && (
                    <span>{customer.customerPhone}</span>
                  )}
                  {customer.customerEmail && (
                    <span className="lowercase italic opacity-60 truncate max-w-[120px]">
                      {customer.customerEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-sm font-black text-slate-900 leading-none">
                {customer.totalBookings || 0}
                <span className="text-[9px] text-slate-400 ml-1 uppercase">
                  Lượt hẹn
                </span>
              </div>
              <div className="text-[11px] font-black text-[#D81B60]">
                {customer.totalSpent?.toLocaleString()} ₫
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-6 py-4 rounded-2xl border border-dashed border-slate-200 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#950101] hover:border-[#950101]/20 transition-all active:scale-[0.98]"
        >
          {showAll
            ? "Thu gọn danh sách ↑"
            : `Xem thêm tất cả (+${customers.length - 5}) ↓`}
        </button>
      )}
    </div>
  );
};

export default CustomerList;
