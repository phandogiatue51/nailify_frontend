import { BlogPostFilterDto } from "@/types/filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, CalendarDays } from "lucide-react";

interface BlogPostFilterProps {
  filters: BlogPostFilterDto;
  onFilterChange: (filters: BlogPostFilterDto) => void;
}

export const BlogPostFilter = ({
  filters,
  onFilterChange,
}: BlogPostFilterProps) => {
  const handleChange = (key: keyof BlogPostFilterDto, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({});
  };

  return (
    <Card className="border-2 border-slate-100 rounded-[2.5rem] shadow-sm bg-white overflow-hidden transition-all duration-300 focus-within:border-[#950101]/30">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Main Search Input */}
          <div className="flex-1 w-full group">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#950101] transition-colors" />
              <Input
                id="search"
                placeholder="Tìm kiếm theo tiêu đề bài viết ..."
                className="pl-10 h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-black text-[12px] tracking-widest focus-visible:ring-[#950101] focus-visible:border-[#950101] transition-all "
                value={filters.SearchTerm || ""}
                onChange={(e) => handleChange("SearchTerm", e.target.value)}
              />
            </div>
          </div>

          {/* Filters & Actions Section */}
          <div className="flex flex-wrap items-center justify-between w-full lg:w-auto gap-8 pt-6 lg:pt-0 lg:pl-8">
            {/* Recently Added Switch */}
            <div className="flex items-center space-x-3">
              <Switch
                id="recently"
                className="data-[state=checked]:bg-[#950101]"
                checked={filters.Recently === true}
                onCheckedChange={(checked) =>
                  handleChange("Recently", checked ? true : undefined)
                }
              />
              <Label
                htmlFor="recently"
                className="cursor-pointer font-black text-[12px] tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors  flex items-center gap-2"
              >
                Mới nhất
              </Label>
            </div>

            {/* Clear Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-10 px-6 rounded-xl font-black text-[12px] tracking-widest text-[#950101] hover:bg-red-50 hover:text-[#950101] transition-all "
            >
              Làm mới
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostFilter;
