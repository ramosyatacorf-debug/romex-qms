"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4 md:p-8">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-blue-100/40 border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[580px]">
        
        {/* Left - Login form */}
        <div className="w-full lg:w-[42%] flex flex-col justify-center px-8 md:px-12 py-12">
          <div className="max-w-sm mx-auto w-full">
            {/* Logo */}
            <div className="mb-7">
              <Image
                src="/logo_romex.jpg"
                alt="RomEx Quality Management System"
                width={120}
                height={32}
                className="object-contain"
                priority
              />
            </div>

            <h1 className="text-[28px] font-semibold text-slate-800 tracking-tight mb-1.5">
              Login
            </h1>
            <p className="text-slate-500 text-[13.5px] mb-8 leading-relaxed">
              Welcome to log in to your background management system.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="1185780732@qq.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Please enter your password"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-[14px] font-semibold tracking-wide shadow-lg shadow-blue-200/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Ingresando..." : "LOGIN"}
              </button>
            </form>
          </div>
        </div>

        {/* Right - Illustration */}
        <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-50 via-blue-100/30 to-indigo-50 items-center justify-center overflow-hidden">
          <div className="absolute top-10 right-16 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-56 h-56 bg-indigo-200/20 rounded-full blur-3xl" />

          <div className="relative w-[80%] max-w-md">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-200/30 border border-white/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
              </div>
              <div className="flex gap-4">
                <div className="w-14 space-y-2.5">
                  <div className="h-2.5 bg-blue-100 rounded w-full" />
                  <div className="h-2.5 bg-slate-100 rounded w-4/5" />
                  <div className="h-2.5 bg-slate-100 rounded w-3/5" />
                </div>
                <div className="flex-1 space-y-2.5">
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl" />
                    <div className="space-y-2">
                      <div className="h-2.5 bg-slate-100 rounded w-full" />
                      <div className="h-2.5 bg-slate-100 rounded w-4/5" />
                      <div className="h-2.5 bg-blue-100 rounded w-3/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
