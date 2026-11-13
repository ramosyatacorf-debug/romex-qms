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
    <div
      className="min-h-screen w-full flex items-center justify-center p-5 sm:p-8"
      style={{ background: "var(--md-surface)" }}
    >
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
          <p
            className="mt-3 text-[12px] font-medium tracking-[0.08em] uppercase"
            style={{ color: "var(--md-on-surface-variant)" }}
          >
            Quality Management System
          </p>
        </div>

        <div
          className="px-7 py-8 sm:px-9 sm:py-9"
          style={{
            background: "var(--md-surface-container-lowest)",
            borderRadius: "var(--md-radius-xl)",
            border: "1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent)",
            boxShadow: "var(--md-elevation-2)",
          }}
        >
          <div className="mb-7 text-center">
            <h1
              className="text-[22px] font-medium tracking-tight"
              style={{ color: "var(--md-on-surface)" }}
            >
              Iniciar sesión
            </h1>
            <p
              className="text-[14px] mt-1.5 leading-relaxed"
              style={{ color: "var(--md-on-surface-variant)" }}
            >
              Accede al ecosistema de laboratorio de Exportadora RomEx S.A.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-[12px] font-medium mb-2"
                style={{ color: "var(--md-on-surface-variant)" }}
              >
                Correo electrónico
              </label>
              <div className="relative">
                <span
                  className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none z-[1]"
                  style={{ color: "var(--md-on-surface-variant)" }}
                  aria-hidden
                >
                  <Mail size={18} strokeWidth={1.75} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@romex.com"
                  className="md-field md-field-with-leading text-[14px] h-12"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-[12px] font-medium mb-2"
                style={{ color: "var(--md-on-surface-variant)" }}
              >
                Contraseña
              </label>
              <div className="relative">
                <span
                  className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none z-[1]"
                  style={{ color: "var(--md-on-surface-variant)" }}
                  aria-hidden
                >
                  <Lock size={18} strokeWidth={1.75} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="md-field md-field-with-leading md-field-with-trailing text-[14px] h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center transition-colors z-[1]"
                  style={{ color: "var(--md-on-surface-variant)" }}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-[13px] px-3 py-2"
                style={{
                  color: "var(--md-on-error-container)",
                  background: "var(--md-error-container)",
                  borderRadius: "var(--md-radius-sm)",
                }}
              >
                {error}
              </p>
            )}

            <button type="submit" disabled={isLoading} className="md-btn-filled w-full mt-1">
              {isLoading ? "Verificando acceso..." : "Ingresar al sistema"}
            </button>
          </form>

          <div
            className="mt-6 pt-5 flex items-start gap-2.5"
            style={{
              borderTop: "1px solid color-mix(in srgb, var(--md-outline-variant) 50%, transparent)",
            }}
          >
            <ShieldCheck size={16} className="shrink-0 mt-0.5 text-emerald-600" />
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--md-on-surface-variant)" }}>
              Acceso interno. Un solo inicio de sesión te conecta a Microbiología, Guías y el resto del ecosistema.
            </p>
          </div>
        </div>

        <p className="text-center text-[11.5px] mt-7" style={{ color: "var(--md-on-surface-variant)" }}>
          Exportadora RomEx S.A. · Planta Chincha
        </p>
      </div>
    </div>
  );
}
