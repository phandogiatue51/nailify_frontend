import { useState, useEffect } from "react";
import { BookRateStats, NailArtist } from "@/types/database";
import { adminAPI, artistAPI } from "@/services/api";
import { CollectionPreview } from "../CollectionPreview";
import { ServicePreview } from "../ServicePreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ArtistDetailViewProps {
  artistId: string;
  onArtistUpdated?: () => void;
}

export const ArtistDetailView = ({
  artistId,
  onArtistUpdated,
}: ArtistDetailViewProps) => {
  const [artist, setArtist] = useState<NailArtist | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [artistStats, setArtistStats] = useState<BookRateStats | null>(null);

  const loadArtistDetails = async () => {
    if (!artistId) return;

    setLoading(true);
    try {
      const artistData = await artistAPI.getById(artistId);
      const artistStats = await adminAPI.getArtistStats(artistId);
      setArtistStats(artistStats || null);
      setArtist(artistData || null);
    } catch (error) {
      console.error("Error loading artist details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artistId) {
      loadArtistDetails();
    } else {
      setArtist(null);
    }
  }, [artistId]);

  const handleVerify = async () => {
    if (!artistId) return;

    setVerifying(true);
    try {
      await artistAPI.verifyArtist(artistId);
      onArtistUpdated?.();
      loadArtistDetails();
    } catch (error) {
      console.error("Failed to verify artist:", error);
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return dateString;
    }
  };

  if (!artistId) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No artist selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Artist not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-in fade-in duration-700 max-w-5xl mx-auto">
      {/* HERO HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-12 ">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative group">
            {artist.avatarUrl ? (
              <img
                src={artist.avatarUrl}
                alt={artist.fullName}
                className="w-32 h-32 rounded-[2rem] object-cover shadow-2xl border-4 border-white transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-32 h-32 rounded-[2rem] shadow-2xl border-4 border-white bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                <span className="text-5xl font-black text-white uppercase italic">
                  {artist.fullName?.[0] || "U"}
                </span>
              </div>
            )}
            {artist.artistVerified && (
              <div className="absolute -top-3 -right-3 bg-[#950101] text-white p-2 rounded-full shadow-xl border-4 border-white">
                <CheckCircle className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#950101]">
              Thợ Nail
            </p>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase leading-none">
              {artist.fullName}
            </h1>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase bg-slate-50 px-3 py-1 rounded-full">
                ID: {artist.id.slice(0, 8)}
              </span>
              <Badge
                variant={artist.isActive ? "default" : "secondary"}
                className="text-[10px] font-black uppercase tracking-widest bg-emerald-500"
              >
                {artist.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {!artist.artistVerified && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={verifying}
                  className="bg-[#950101] hover:bg-[#7a0101] text-white rounded-xl font-black uppercase tracking-widest text-[10px] px-8 h-12 shadow-lg transition-all"
                >
                  {verifying ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Xác minh thợ Nail
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[2.5rem] p-10">
                <AlertDialogHeader className="space-y-4">
                  <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-slate-900">
                    Xác nhận
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-500 font-medium italic text-lg leading-relaxed">
                    Bạn muốn xác minh thợ Nail{" "}
                    <span className="text-[#950101] font-black underline">
                      {artist.fullName}
                    </span>
                    ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="pt-6">
                  <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-xs border-slate-200">
                    Hủy
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleVerify}
                    className="rounded-xl bg-[#950101] hover:bg-[#7a0101] font-bold uppercase tracking-widest text-xs px-8"
                  >
                    Xác minh
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* <Button
            variant="outline"
            className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px] px-8 h-12 transition-all"
          >
            Vô hiệu hóa
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12 px-2">
        <div className="lg:col-span-8 space-y-16">
          {/* Contact Section */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#950101] flex items-center gap-3">
              <div className="w-8 h-[1px] bg-[#950101]" /> Thông tin liên hệ
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email Card */}
              <div className="group flex items-center gap-4 p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-slate-100 transition-all">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-[#950101] group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                    Địa chỉ email
                  </p>
                  <p className="text-sm font-bold text-slate-700 break-all">
                    {artist.email}
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              {artist.phone && (
                <div className="group flex items-center gap-4 p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-slate-100 transition-all">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-[#950101] group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                      Số điện thoại
                    </p>
                    <p className="text-sm font-black text-slate-900 italic tracking-tight">
                      {artist.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Portfolio Sections */}
          <div className="space-y-20">
            <div className="relative">
              <ServicePreview artistId={artist.id} />
            </div>
            <div className="relative">
              <CollectionPreview artistId={artist.id} />
            </div>
          </div>
        </div>

        {/* RIGHT: METRICS & STATUS (Takes 4/12 of the space) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-8 rounded-[3rem] p-10 text-white space-y-10 relative overflow-hidden shadow-[0_20px_50px_rgba(149,1,1,0.2)] bg-slate-950">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#950101] to-[#FFCFE9]" />

            <div className="relative z-10 space-y-8">
              <div className="space-y-1">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FFCFE9]">
                  Chỉ số hiệu suất
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                    Lượt đặt lịch
                  </p>
                  <p className="text-4xl font-black italic tracking-tighter leading-none">
                    {artistStats?.totalBookings ?? 0}
                  </p>
                </div>

                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                    Đánh giá
                  </p>
                  <div className="text-right">
                    <p className="text-4xl font-black italic tracking-tighter leading-none">
                      {artistStats?.averageRating?.toFixed(1) ?? "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                    Trạng thái
                  </span>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <div
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        artist.isActive
                          ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-[10px] font-black uppercase">
                      {artist.isActive ? "Hoạt động" : "Ngừng"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-white/50 tracking-widest">
                    Gia nhập
                  </span>
                  <span className="italic text-white">
                    {formatDate(artist.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Blur */}
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#950101] opacity-30 rounded-full blur-[80px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
