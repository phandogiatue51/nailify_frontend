// components/admin/invoices/InvoiceCard.tsx
import { useNavigate } from "react-router-dom";
import { Invoice } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, DollarSign } from "lucide-react";
import { InvoiceStatusBadge } from "@/components/badge/InvoiceStatusBadge";
import DateDisplay from "@/components/ui/date-display";

interface InvoiceCardProps {
  invoice: Invoice;
}

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Paid: "bg-green-100 text-green-800",
  Overdue: "bg-red-100 text-red-800",
  Cancelled: "bg-gray-100 text-gray-800"
};

export const InvoiceCard = ({ invoice }: InvoiceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Order #{invoice.orderCode}</p>
            <p className="font-medium">{invoice.totalAmount ? Number(invoice.totalAmount).toLocaleString() : "0"} VNĐ</p>
          </div>

          <InvoiceStatusBadge status={invoice.status} />

        </div>

        <div className="space-y-1 text-sm mb-4">
          <div className="flex items-center gap-2">
            <DateDisplay
              dateString={invoice.issuedAt}
              label="Issued At"
              showTime
            />
          </div>
          {invoice.dueDate && (
            <div className="flex items-center gap-2">
              <DateDisplay
                dateString={invoice.dueDate}
                label="Due Day"
                showTime
              />
            </div>
          )}
          {invoice.amountPaid && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-3 h-3" />
              <span>
                Paid: {invoice.amountPaid ? Number(invoice.amountPaid).toLocaleString() : "0"} VNĐ
              </span>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate(`/admin/invoices/${invoice.id}`)}
        >
          <Eye className="w-3 h-3 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};