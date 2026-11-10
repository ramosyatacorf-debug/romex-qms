"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-[400px]">
        {/* Logo sin caja — el blanco del JPG se funde con el fondo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo_romex.jpg"
            alt="RomEx Quality Management System"
            width={160}
            height={48}
            className="object-contain"
            style={{ mixBlendMode: "multiply" }}
            priority
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 px-8 py-9">
          <h1 className="text-[20px] font-semibold text-slate-800 text-center mb-1">
            Iniciar sesión
          </h1>
          <p className="text-[13px] text-slate-500 text-center mb-8">
            Accede a tu cuenta de RomEx QMS
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@romex.com"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:bg-white transition-all"
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[14px] font-medium shadow-md shadow-blue-600/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          Exportadora RomEx S.A. — Quality Management System
        </p>
      </div>
    </div>
  );
}
