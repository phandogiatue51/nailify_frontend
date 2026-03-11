import { useParams, useNavigate } from "react-router-dom";
import { useCustomerCollectionById } from "@/hooks/useCustomer";
import CollectionDetail from "@/components/collection/CollectionDetail";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CollectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useCustomerCollectionById(id);

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
        <p className="mb-4 text-lg">Collection not found</p>
        <Button onClick={() => navigate(-1)}>Return to Shop</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>
      </div>

      <CollectionDetail collection={data} />
    </div>
  );
};

export default CollectionDetailPage;
