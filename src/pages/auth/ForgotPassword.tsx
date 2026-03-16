// @/pages/ForgotPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmail } from "@/hooks/useEmail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { sendPasswordResetEmail, isLoading } = useEmail();

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Hãy nhập email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Hãy nhập email hợp lệ");
      return;
    }

    try {
      await sendPasswordResetEmail.mutateAsync(email);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Failed to send reset email:", error);
      // Error is already handled in the hook, but we can set a local error too
      setError("Đã có lỗi. Vui lòng thử lại sau.");
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToLogin}
            className="self-start -ml-2 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại Đăng nhập
          </Button>

          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-red-500" />
          </div>

          <CardTitle className="text-2xl text-center">
            {isSubmitted ? "Kiểm tra Email" : "Quên mật khẩu?"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSubmitted
              ? `Chúng tôi đã gửi link đặt lại mật khẩu đến ${email}`
              : "Nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Địa chỉ Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ten@vidu.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  autoFocus
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Hãy nhập email đã đăng ký với tài khoản của bạn. Chúng tôi sẽ gửi
                  một liên kết để bạn có thể tạo mật khẩu mới.
                </p>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <Mail className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 font-medium">
                  Đã gửi email thành công!
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Vui lòng kiểm tra hộp thư tại{" "}
                  <span className="font-medium">{email}</span> để thực hiện đặt
                  lại mật khẩu.
                </p>

                <div className="rounded-lg bg-muted p-4 text-left">
                  <h4 className="font-semibold text-sm mb-2">
                    Bạn không nhận được email?
                  </h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Kiểm tra hòm thư rác (Spam) hoặc quảng cáo</li>
                    <li>• Đảm bảo bạn đã nhập đúng địa chỉ email</li>
                    <li>• Đợi vài phút và thử lại</li>
                    <li>• Liên kết sẽ hết hạn sau 30 phút</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {!isSubmitted ? (
            <>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !email.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Gửi yêu cầu"
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Bạn đã nhớ mật khẩu?{" "}
                <Link to="/auth" className="text-primary hover:underline">
                  Đăng nhập tại đây
                </Link>
              </p>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                  setError("");
                }}
                variant="outline"
                className="w-full"
              >
                Sử dụng email khác
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Gửi lại email"
                )}
              </Button>
              <Button
                onClick={handleBackToLogin}
                variant="ghost"
                className="w-full"
              >
                Quay lại Đăng nhập
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
