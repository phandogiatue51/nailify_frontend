"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignUpForm";

const AuthForm = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-[#fafafa]">
      <div
        className="absolute top-[-5%] right-[-5%] w-[70%] h-[70%] rounded-full blur-[100px] opacity-60 animate-pulse"
        style={{ backgroundColor: "#950101" }}
      />
      <div
        className="absolute bottom-[-5%] left-[-5%] w-[70%] h-[70%] rounded-full blur-[100px] opacity-60 animate-pulse"
        style={{ backgroundColor: "#ffcfe9" }}
      />

      <div className="relative w-full max-w-[400px] z-10">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-orange-50 mb-2">
            <Sparkles className="w-7 h-7 text-[#FFC988]" />
          </div>

          <h1
            className="text-4xl font-black tracking-tight bg-clip-text text-transparent italic text-white"
          >
            Nailify
          </h1>
          <p className="text-sm font-bold tracking-wide uppercase">
            Vẻ đẹp trên đầu ngón tay
          </p>
        </div>

        <Card className="border-none shadow-[0_30px_60px_rgba(0,0,0,0.04)] bg-white/70 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
          <Tabs defaultValue="login" className="w-full">
            <div className="px-8 pt-8">
              <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-slate-200/30 rounded-2xl">
                <TabsTrigger
                  value="login"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-bold text-slate-500 transition-all"
                >
                  Đăng nhập
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-bold text-slate-500 transition-all"
                >
                  Đăng ký
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-8">
              <TabsContent
                value="login"
                className="mt-0 animate-in fade-in zoom-in-95 duration-500"
              >
                <LoginForm />
              </TabsContent>

              <TabsContent
                value="signup"
                className="mt-0 animate-in fade-in zoom-in-95 duration-500"
              >
                <SignupForm />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
