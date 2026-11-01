"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    // Simulación de login (más adelante conectamos autenticación real)
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 p-4 md:p-8">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[640px]">
        {/* Left side - Login form */}
        <div className="w-full lg:w-[42%] flex flex-col justify-center px-8 md:px-12 py-12 relative z-10">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2">Login</h1>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed">
              Welcome to log in to your background management system.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="1185780732@qq.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Please enter your password"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold tracking-wide shadow-lg shadow-blue-200/60 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Ingresando..." : "LOGIN"}
              </button>
            </form>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-50 via-blue-100/40 to-indigo-50 items-center justify-center overflow-hidden">
          <div className="absolute top-10 right-16 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-56 h-56 bg-indigo-200/25 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-sky-200/40 rounded-full blur-2xl" />

          {/* Logo */}
          <div className="absolute top-8 right-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M12 2C8 2 5 5.5 5 9.5c0 3.5 2 6.5 5 8.5 1.5-1 2.5-2.5 3-4 .5 1.5 1.5 3 3 4 3-2 5-5 5-8.5C21 5.5 18 2 12 2z" />
              </svg>
            </div>
            <div>
              <div className="text-slate-700 font-bold text-lg leading-none tracking-tight">RomEx</div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Quality Management System</div>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative w-[85%] max-w-lg">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-blue-200/40 border border-white/60 p-5 transform rotate-[-1deg]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
              </div>
              <div className="flex gap-4">
                <div className="w-16 space-y-3">
                  <div className="h-3 bg-blue-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-4/5" />
                  <div className="h-3 bg-slate-100 rounded w-3/5" />
                  <div className="h-3 bg-slate-100 rounded w-4/5" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-4 border-blue-300 border-t-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-100 rounded w-full" />
                      <div className="h-3 bg-slate-100 rounded w-4/5" />
                      <div className="h-3 bg-blue-100 rounded w-3/5" />
                      <div className="h-3 bg-slate-100 rounded w-full" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 bg-blue-50 rounded-lg" />
                    <div className="h-8 flex-1 bg-slate-50 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-8 w-20 h-28">
              <div className="w-14 h-14 rounded-full bg-blue-200/80 mx-auto mb-1" />
              <div className="w-16 h-12 bg-blue-300/70 rounded-t-2xl mx-auto" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-28">
              <div className="w-14 h-14 rounded-full bg-indigo-200/80 mx-auto mb-1" />
              <div className="w-16 h-12 bg-indigo-300/70 rounded-t-2xl mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
