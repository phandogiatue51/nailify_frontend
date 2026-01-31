import { useAuthContext } from "../auth/AuthProvider";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Hãy điền email hợp lệ"),
  password: z.string().min(6, "Mật khẩu có ít nhất 6 chữ số"),
});
type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
            Email
          </Label>
          <Input
            className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
            placeholder="name@example.com"
            {...loginForm.register("email")}
          />
          {loginForm.formState.errors.email && (
            <p className="text-[10px] text-red-500 font-bold ml-1">
              {loginForm.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-[10px] font-bold text-pink-600 hover:text-pink-700 underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
            placeholder="••••••••"
            {...loginForm.register("password")}
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full h-12 rounded-2xl font-bold hover:bg-pink-700 shadow-lg shadow-pink-200"
        style={{ background: "#f988b3ff" }}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
      </Button>
    </form>
  );
};
