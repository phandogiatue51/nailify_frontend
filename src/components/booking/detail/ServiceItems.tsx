import { Package } from "lucide-react";
import { Separator } from "../../ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ServiceItems = ({ items, totalPrice, duration }: any) => (
  <Card className="border-none shadow-sm rounded-[2rem]">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
        <Package className="w-4 h-4 text-[#E288F9]" />
        Services
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {items.map((item: any, index: number) => (
        <div
          key={item.id || index}
          className="flex justify-between items-center"
        >
          <div>
            <p className="font-bold text-slate-700 text-md">
              {item.serviceItemName}
            </p>
          </div>
          <p className="font-black text-slate-900">
            {item.price?.toLocaleString()} <span className="text-md">VND</span>
          </p>
        </div>
      ))}
      <Separator className="bg-slate-50" />
      <div className="flex justify-between items-end">
        <p className="text-xs font-black uppercase text-slate-400">
          Total Value
        </p>
        <div className="text-right">
          <p className="text-xl font-black text-[#E288F9]">
            {totalPrice.toLocaleString()} VND
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
