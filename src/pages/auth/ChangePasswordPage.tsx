"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, ChevronLeft } from "lucide-react";
import { profileAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/ui/header";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await profileAPI.changePassword(formData);
      setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      toast({
        description: "Password changed successfully!",
        duration: 3000,
      });
      navigate("/profile");
    } catch (err: any) {
      setMessage(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Nailify" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between text-slate-600">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="group rounded-full mr-4 border-2 border-slate-400 hover:border-[#950101] transition-all px-3"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-[#950101] transition-transform" />
          </Button>
          <h1 className="text-2xl font-black">Cập nhật mật khẩu</h1>
        </div>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base font-black">
              Thay đổi mật khẩu của bạn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Mật khẩu hiện tại"
              disabled={loading}
            />
            <Input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Mật khẩu mới"
              disabled={loading}
            />
            <Input
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              placeholder="Xác nhận mật khẩu mới"
              disabled={loading}
            />

            <Button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background:
                  "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
              }}
              className="w-full rounded-2xl font-black"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                </>
              ) : (
                "Đổi mật khẩu"
              )}
            </Button>

            {message && (
              <p className="text-sm text-center mt-2 text-muted-foreground">
                {message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
