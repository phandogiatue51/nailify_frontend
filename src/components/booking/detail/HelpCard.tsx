import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const HelpCard = () => (
  <Card className="bg-blue-50 border-blue-200 rounded-[2rem] shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
        <div className="space-y-2">
          <p className="font-black text-blue-800 text-lg">Bạn gặp vấn dề?</p>
          <p className="text-sm text-blue-600">
            Liên hệ chăm sóc khách hàng tại {" "}
            <a href="tel:+84123456789" className="underline font-medium">
              +84 101 697 330
            </a>{" "}
            hoặc gửi email đến togetherlms@gmail.com
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
