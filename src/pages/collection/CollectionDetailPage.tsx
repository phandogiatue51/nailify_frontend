import { useParams, useNavigate } from "react-router-dom";
import { useCustomerCollectionById } from "@/hooks/useCustomer";
import CollectionDetail from "@/components/collection/CollectionDetail";
import { Loader2, ArrowLeft, ChevronLeft } from "lucide-react";
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
        <p className="mb-4 text-lg">Không tìm thấy bộ sưu tập</p>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="group rounded-3xl border-slate-500 border-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4  transition-transform group-hover:-translate-x-1" />
          Trở về
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="group rounded-full mr-4 border-2 border-slate-400 hover:border-[#950101] transition-all px-3"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-[#950101] transition-transform" />
        </Button>
      </div>

      <CollectionDetail collection={data} />
    </div>
  );
};

export default CollectionDetailPage;
