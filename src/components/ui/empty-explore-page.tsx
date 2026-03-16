import { Search } from "lucide-react";
export const EmptyExploreState = ({
  query,
  type,
}: {
  query: string;
  type: string;
}) => (
  <div className="flex flex-col items-center justify-center py-20 px-10 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
      <Search className="w-10 h-10 text-slate-200" />
    </div>
    <h3 className="font-bold text-slate-900">
      Không có kết quả phù hợp
    </h3>
  
  </div>
);
