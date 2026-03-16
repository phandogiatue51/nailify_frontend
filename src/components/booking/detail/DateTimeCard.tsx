import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DateDisplay from "@/components/ui/date-display";

interface DateTimeCardProps {
  scheduledStart: string;
  scheduledEnd: string;
}

export const DateTimeCard = ({
  scheduledStart,
  scheduledEnd,
}: DateTimeCardProps) => (
  <Card className="border-none shadow-sm rounded-[2rem]">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
        <Calendar className="w-4 h-4 text-[#88F9D0]" />
        Thời gian lịch hẹn
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <p className="text-[12px] font-black uppercase text-slate-400">
            Giờ vào
          </p>
          <div className="flex items-center gap-3">
            <div className="bg-[#88F9D0]/20 p-3 rounded-2xl">
              <Calendar className="w-5 h-5 text-[#88F9D0]" />
            </div>
            <div className="font-bold">
              <DateDisplay dateString={scheduledStart} showTime isIcon={false} />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[12px] font-black uppercase text-slate-400">Giờ ra</p>
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-3 rounded-2xl">
              <Calendar className="w-5 h-5 text-red-500" />
            </div>
            <div className="font-bold">
              <DateDisplay dateString={scheduledEnd} showTime isIcon={false}/>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
