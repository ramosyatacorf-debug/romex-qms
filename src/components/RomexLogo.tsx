"use client";

import Image from "next/image";

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
 * Única fuente de verdad para Login, Sidebar y demás pantallas.
 */
export default function RomexLogo({
  width = 180,
  height = 48,
  className = "",
  blendWhite = true,
  priority = false,
}: RomexLogoProps) {
  return (
    <Image
      src="/logo_romex.jpg"
      alt="RomEx Quality Management System"
      width={width}
      height={height}
      className={`object-contain object-left ${className}`}
      style={blendWhite ? { mixBlendMode: "multiply" } : undefined}
      priority={priority}
    />
  );
}
