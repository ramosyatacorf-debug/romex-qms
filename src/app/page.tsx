"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Completa correo y contraseña.");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f1f5f9] p-5 sm:p-8">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo_romex.jpg"
            alt="RomEx Quality Management System"
            width={168}
            height={50}
            className="object-contain h-12 w-auto"
            style={{ mixBlendMode: "multiply" }}
            priority
          />
          <p className="mt-3 text-[12px] font-medium text-slate-500 tracking-wide uppercase">
            Quality Management System
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(15,23,42,0.06)] px-7 py-8 sm:px-9 sm:py-9">
          <div className="mb-7">
            <h1 className="text-[21px] font-semibold text-slate-900 tracking-tight text-center">
              Iniciar sesión
            </h1>
            <p className="text-[13.5px] text-slate-500 text-center mt-1.5 leading-relaxed">
              Accede al ecosistema de laboratorio de Exportadora RomEx S.A.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@romex.com"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-slate-50/40 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 bg-slate-50/40 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[14px] font-medium shadow-md shadow-blue-600/15 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isLoading ? "Verificando acceso..." : "Ingresar al sistema"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Acceso interno. Un solo inicio de sesión te conecta a Microbiología, Guías y el resto del ecosistema.
            </p>
          </div>
        </div>

        <p className="text-center text-[11.5px] text-slate-400 mt-7">
          Exportadora RomEx S.A. · Planta Chincha
        </p>
      </div>
    </div>
  );
}
