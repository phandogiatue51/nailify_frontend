import { useAuthContext } from "../auth/AuthProvider";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Tên cần ít nhất 2 từ"),
    email: z.string().email("Hãy điền email hợp lệ"),
    phone: z.string().optional(),
    address: z.string().optional(),
    password: z.string().min(6, "Mật khẩu có ít nhất 6 chữ số"),
    confirmPassword: z.string().min(6, "Mật khẩu có ít nhất 6 chữ số"),
    role: z.enum(["0", "1", "4"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không trùng khớp",
    path: ["confirmPassword"],
  });
type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const { signup } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "0" },
  });

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await signup({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone || "",
        address: data.address || "",
        role: parseInt(data.role) as 0 | 1 | 4,
      });
      navigate("/auth");
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={signupForm.handleSubmit(handleSignup)}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-3 px-1 py-1">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-slate-500">
            Email
          </Label>
          <Input
            className="h-11 rounded-xl border-slate-100"
            placeholder="jane@example.com"
            {...signupForm.register("email")}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-slate-500">
              Mật khẩu
            </Label>
            <Input
              type="password"
              className="h-11 rounded-xl border-slate-100"
              {...signupForm.register("password")}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-slate-500">
              Xác nhận mật khẩu
            </Label>
            <Input
              type="password"
              className="h-11 rounded-xl border-slate-100"
              {...signupForm.register("confirmPassword")}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-slate-500">
            Họ và tên
          </Label>
          <Input
            className="h-11 rounded-xl border-slate-100"
            placeholder="Jane Doe"
            {...signupForm.register("fullName")}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-slate-500">
            Số điện thoại
          </Label>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="h-11 rounded-xl border-slate-100"
            placeholder="09"
            {...signupForm.register("phone")}
          />
        </div>
        <div className="space-y-2 py-2">
          <Label className="text-xs font-bold uppercase text-slate-500">
            Tôi là ...
          </Label>
          <RadioGroup
            defaultValue="0"
            className="grid grid-cols-3 gap-2"
            onValueChange={(v) => signupForm.setValue("role", v as any)}
          >
            <RoleTile value="0" label="Khách hàng" id="role-0" />
            <RoleTile value="4" label="Thợ Nail" id="role-4" />
            <RoleTile value="1" label="Chủ cửa hàng" id="role-1" />
          </RadioGroup>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-2xl font-boldhover:bg-purple-700 shadow-lg shadow-purple-200"
        style={{ backgroundColor: "#950101" }}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "Tạo tài khoản"}
      </Button>
    </form>
  );
};

const RoleTile = ({ value, label, id }: any) => (
  <div>
    <RadioGroupItem value={value} id={id} className="peer sr-only" />
    <Label
      htmlFor={id}
      className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 bg-white peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-50 transition-all cursor-pointer text-[10px] font-bold uppercase tracking-tight"
    >
      {label}
    </Label>
  </div>
);
