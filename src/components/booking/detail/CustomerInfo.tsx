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
    <CardContent>
      <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">
        {name}
      </p>
      <p className="text-sm font-bold text-slate-400 flex items-center gap-1 mt-1">
        {phone}
      </p>
      <p className="text-sm font-bold text-slate-400 flex items-center gap-1 mt-1">
        {address}
      </p>
    </CardContent>
  </Card>
);
