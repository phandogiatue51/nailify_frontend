// components/insights/PopularCollectionList.tsx
import React from "react";
import { PopularCollection } from "@/types/database";
import { Sparkles } from "lucide-react";

interface PopularCollectionListProps {
  collections: PopularCollection[];
}

const PopularCollectionList: React.FC<PopularCollectionListProps> = ({
  collections,
}) => {
  if (!collections || collections.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-50 p-8 text-center shadow-md">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
          Xu Hướng
        </h3>
        <div className="py-12 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-xs font-bold text-slate-400 italic">
            Chưa có dữ liệu xu hướng
          </p>
        </div>
      </div>
    );
  }

  const sortedCollections = [...collections].sort(
    (a, b) => (b.bookingCount || 0) - (a.bookingCount || 0),
  );

  const maxBookings = sortedCollections[0]?.bookingCount || 1;
  const totalRevenue = collections.reduce(
    (sum, c) => sum + (c.totalRevenue || 0),
    0,
  );

  return (
    <div className="bg-white rounded-[2rem] border border-slate-50 p-8 shadow-md">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black uppercase tracking-[0.3em] text-[#950101]">
          Xu Hướng
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase ">
            Tổng doanh thu:
          </span>
          <span className="text-sm font-black text-slate-900">
            {totalRevenue.toLocaleString()} ₫
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {sortedCollections.map((collection, index) => {
          const popularityRatio = (collection.bookingCount || 0) / maxBookings;

          return (
            <div key={index} className="relative group">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800 tracking-tight group-hover:text-[#950101] transition-colors">
                      {collection.collectionName || "Bộ sưu tập chưa đặt tên"}
                    </span>
                    {index === 0 && (
                      <span className="bg-[#950101] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest animate-pulse">
                        Bán Chạy Nhất
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {collection.bookingCount || 0} Lượt hoàn thành
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 block">
                    {collection.totalRevenue?.toLocaleString()} ₫
                  </span>
                  <span className="text-[9px] font-bold text-[#D81B60] uppercase">
                    {(
                      (collection.totalRevenue / (totalRevenue || 1)) *
                      100
                    ).toFixed(0)}
                    % Tỷ trọng
                  </span>
                </div>
              </div>

              {/* Luxury Progress Indicator */}
              <div className="relative w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D81B60] to-[#950101] transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${popularityRatio * 100}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCollectionList;
