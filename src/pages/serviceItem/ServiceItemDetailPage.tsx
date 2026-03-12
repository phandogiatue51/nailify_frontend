import { useParams, useNavigate } from "react-router-dom";
import { useCustomerServiceItemById } from "@/hooks/useCustomer";
import ServiceItemDetail from "@/components/serviceItem/ServiceItemDetail";
import { Loader2, ArrowLeft, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
const ServiceItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useCustomerServiceItemById(id);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-xl font-semibold">Không tìm thấy dịch vụ</h2>

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="group rounded-full border-2 border-slate-400 hover:border-[#950101] transition-all px-3"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-[#950101] transition-transform" />
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="group rounded-full border-2 border-slate-400 hover:border-[#950101] transition-all px-3"
      >
        <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-[#950101] transition-transform" />
      </Button>

      <ServiceItemDetail item={data} />
    </div>
  );
};

export default ServiceItemDetailPage;
