"use client";

import Image from "next/image";
import { useState } from "react";

interface RomexLogoProps {
  /** Ancho visual preferido */
  width?: number;
  /** Alto visual preferido */
  height?: number;
  /** Clases adicionales del contenedor/imagen */
  className?: string;
  /**
   * Si true, aplica mix-blend-mode: multiply para que el fondo blanco
   * del JPG se funda con fondos claros del sistema (Sidebar, etc.).
   */
  blendWhite?: boolean;
  priority?: boolean;
}

/**
 * Logo oficial RomEx (public/logo_romex.jpg).
 * Si el asset no está disponible (404), muestra un fallback textual limpio
 * para no romper Login ni Sidebar.
 */
export default function RomexLogo({
  width = 180,
  height = 48,
  className = "",
  blendWhite = true,
  priority = false,
}: RomexLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center gap-2 font-semibold tracking-tight ${className}`}
        style={{ color: "var(--md-on-surface)", height }}
        aria-label="RomEx Quality Management System"
      >
        <span
          className="inline-flex items-center justify-center rounded-lg text-white text-sm font-bold"
          style={{
            width: Math.min(height, 40),
            height: Math.min(height, 40),
            background: "var(--md-primary)",
          }}
        >
          R
        </span>
        <span className="text-[15px] leading-none">RomEx</span>
      </div>
    );
  }

  return (
    <Image
      src="/logo_romex.jpg"
      alt="RomEx Quality Management System"
      width={width}
      height={height}
      className={`object-contain object-left ${className}`}
      style={blendWhite ? { mixBlendMode: "multiply" } : undefined}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
