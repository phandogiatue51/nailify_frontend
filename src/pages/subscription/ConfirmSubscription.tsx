import { useQuery } from "@tanstack/react-query";
import { subscriptionAPI } from "@/services/api";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, ArrowLeft, CreditCard } from "lucide-react";
import { useState } from "react";

export const ConfirmSubscription = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: plan, isLoading } = useQuery({
        queryKey: ["subscription", id],
        queryFn: () => subscriptionAPI.getById(id!),
        enabled: !!id,
    });

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            const data = await subscriptionAPI.subscribe(id);
            if (data.paymentUrl) {
                window.open(data.paymentUrl, '_blank');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsProcessing(false);
        }
    };


    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#950101]" />
        </div>
    );

    if (!plan) return <div className="p-10 text-center">Không tìm thấy gói dịch vụ.</div>;

    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">
            {/* onBack now uses navigate(-1) to go back in history */}
            <button
                onClick={() => navigate(-1)}
                disabled={isProcessing}
                className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>

            <header className="space-y-2">
                <h2 className="text-2xl font-black uppercase text-slate-900">Xác nhận thanh toán</h2>
                <p className="text-sm text-slate-500 font-medium">Vui lòng kiểm tra lại thông tin gói dịch vụ của bạn.</p>
            </header>

            {/* Order Summary Card */}
            <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 border-dashed">
                    <div>
                        <p className="text-[10px] font-black text-[#950101] uppercase tracking-widest">Gói đã chọn</p>
                        <p className="text-xl font-black text-slate-900">{plan.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-slate-900">
                            {plan.price.toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">/ {plan.durationDays} ngày</p>
                    </div>
                </div>

                <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Kích hoạt ngay lập tức
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Hỗ trợ 24/7
                    </li>
                </ul>
            </div>

            <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phương thức thanh toán</h3>
                <div className="flex items-center justify-between p-4 bg-white border-2 border-slate-900 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5" />
                        <span className="font-bold text-sm">Chuyển khoản / Ví điện tử</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            <button
                onClick={handleConfirm}
                disabled={isProcessing}
                style={{
                    background: plan.colorHex || "#0f172a",
                    boxShadow: `0 10px 20px -5px ${plan.colorHex}66`
                }}
                className="w-full py-5 text-white rounded-[1.5rem] font-black uppercase text-sm tracking-[0.2em] shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
                {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </span>
                ) : (
                    "Thanh toán ngay"
                )}
            </button>

            {/* Optional: Payment instructions */}
            {isProcessing && (
                <p className="text-center text-xs text-slate-400 animate-pulse">
                    Đang mở cổng thanh toán, vui lòng đợi trong giây lát...
                </p>
            )}
        </div>
    );
};