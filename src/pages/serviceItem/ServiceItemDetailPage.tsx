import { useParams, useNavigate } from "react-router-dom";
import { useCustomerServiceItemById } from "@/hooks/useCustomer";
import ServiceItemDetail from "@/components/serviceItem/ServiceItemDetail";
import { Loader2, ArrowLeft } from "lucide-react";
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
        <h2 className="text-xl font-semibold">Service not found</h2>
        <Button variant="link" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 hover:bg-secondary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Services
      </Button>

      <ServiceItemDetail item={data} />
    </div>
  );
};

export default ServiceItemDetailPage;
