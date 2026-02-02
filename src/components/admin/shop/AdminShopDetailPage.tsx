"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ShopDetailView from "./ShopDetailView";

const AdminShopDetailPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user?.role !== 2) {
    return <Navigate to="/auth" replace />;
  }

  if (!shopId) {
    return <Navigate to="/admin/shops" replace />;
  }

  const handleClose = () => {
    navigate("/admin/shops");
  };

  const handleShopUpdated = () => {
    console.log("Shop updated");
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/shops")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shops
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <ShopDetailView shopId={shopId} onShopUpdated={handleShopUpdated} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminShopDetailPage;
