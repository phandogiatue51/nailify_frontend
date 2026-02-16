// components/shop/ShopInfoPage.tsx
"use client";

import { shopAPI } from "@/services/api";
import { Shop } from "@/types/database";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
export default function ShopInfoPage() {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 1 || user?.role === 3;

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const data = await shopAPI.getById(id!);
        setShop(data);
      } catch (error) {
        console.error("Failed to load shop:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-400">Loading shop...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Shop not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <button onClick={() => navigate(-1)} className="mb-4">
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Cover image */}
      {shop.coverUrl && (
        <div className="mb-4">
          <img
            src={shop.coverUrl}
            alt={`${shop.name} cover`}
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
      )}

      {/* Logo + name */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={shop.logoUrl ?? "/default-shop.png"}
          alt={shop.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h1 className="text-xl font-semibold">{shop.name}</h1>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>Description:</strong> {shop.description ?? "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {shop.phone ?? "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {shop.email ?? "N/A"}
        </p>

        {isAdmin && (
          <>
            <p className="text-sm text-gray-500">
              {shop.isVerified ? "✅ Verified" : "Unverified"}
            </p>
            <p>
              <strong>Status:</strong> {shop.isActive ? "Active" : "Inactive"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(shop.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(shop.updatedAt).toLocaleDateString()}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
