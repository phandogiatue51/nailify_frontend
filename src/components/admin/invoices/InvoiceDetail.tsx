// pages/admin/InvoiceDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Invoice } from "@/types/database";
import { invoiceAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { InvoiceStatusBadge } from "@/components/badge/InvoiceStatusBadge";
import { SubscriptionTierBadge } from "@/components/badge/SubscriptionTierBadge";
import DateDisplay from "@/components/ui/date-display";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Paid: "bg-green-100 text-green-800",
  Overdue: "bg-red-100 text-red-800",
  Cancelled: "bg-gray-100 text-gray-800"
};

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthContext();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoice = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await invoiceAPI.getById(id);
        setInvoice(data);
      } catch (error) {
        console.error("Error loading invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 2) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Invoice not found</p>
            <Button className="mt-4" onClick={() => navigate('/admin/invoices')}>
              Back to Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/admin/invoices')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Invoices
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Invoice #{invoice.orderCode}</span>
            <InvoiceStatusBadge status={invoice.status} />

          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Info */}
          <div className="border-b pb-3">
            <h3 className="font-medium mb-2">Customer</h3>
            <p className="text-sm">{invoice.fullName || 'N/A'}</p>
            <p className="text-sm">{invoice.email || 'N/A'}</p>
            <p className="text-sm">{invoice.phone || 'N/A'}</p>
          </div>

          {/* Plan Info */}
          <div className="border-b pb-3">
            <h3 className="font-medium mb-2">Subscription</h3>
            <SubscriptionTierBadge planId={invoice.subscriptionPlanId} />

            <DateDisplay
              dateString={invoice.startDate}
              label="Start At"
            />
            <DateDisplay
              dateString={invoice.endDate}
              label="End At"
            />
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="font-medium mb-2">Payment</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">


              <div>Total: {invoice.totalAmount ? Number(invoice.totalAmount).toLocaleString() : "0"} VNĐ </div>
              <div>Paid: {invoice.amountPaid ? Number(invoice.amountPaid).toLocaleString() : "0"} VNĐ </div>
              <DateDisplay
                dateString={invoice.issuedAt}
                label="Issued At"
                showTime
              />
              <DateDisplay
                dateString={invoice.dueDate}
                label="Due Day"
                showTime
              />
              <DateDisplay
                dateString={invoice.paidAt}
                label="Paid At"
                showTime
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetail;