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
    await new Promise((resolve) => setTimeout(resolve, 700));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#fafbfc]">
      {/* Header minimal */}
      <header className="w-full px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <Image
            src="/logo_romex.jpg"
            alt="RomEx"
            width={120}
            height={32}
            className="object-contain"
            priority
          />
        </div>
      </header>

      {/* Formulario centrado */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[380px]">
          <h1 className="text-[22px] font-semibold text-slate-800 mb-1">
            Iniciar sesión
          </h1>
          <p className="text-[13px] text-slate-500 mb-8">
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@romex.com"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full h-11 px-3.5 pr-11 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400 mt-10">
            Exportadora RomEx S.A. — QMS
          </p>
        </div>
      </main>
    </div>
  );
}
