import { User, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CustomerInfo = ({ name, phone, address }: any) => (
  <Card className="border-none shadow-sm rounded-[2rem]">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
        <User className="w-4 h-4 text-[#FFC988]" />
        Customer
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <p className="text-[10px] font-black uppercase text-slate-300">
          Full Name
        </p>
        <p className="font-bold text-slate-700">{name}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-orange-50 p-2 rounded-xl">
          <Phone className="w-4 h-4 text-[#FFC988]" />
        </div>
        <p className="font-bold text-slate-700">{phone}</p>
      </div>
      {address && (
        <div className="flex items-start gap-3">
          <div className="bg-slate-50 p-2 rounded-xl">
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600 leading-snug">
            {address}
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);
