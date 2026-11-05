/** Icono oficial de Qualy AI (robot + matraz) */
export default function QualyIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Antena / sombrero */}
      <path d="M20 6h8v3h-8z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="4" r="1.8" fill="currentColor" />
      <path d="M18 9h12v4H18z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Cabeza */}
      <rect x="15" y="12" width="18" height="12" rx="6" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="20.5" cy="17.5" r="1.6" fill="currentColor" />
      <circle cx="27.5" cy="17.5" r="1.6" fill="currentColor" />
      <path d="M20 21.5c1.2 1.2 2.8 1.2 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

      {/* Orejas */}
      <path d="M15 16h-2.5a1.5 1.5 0 0 0 0 3H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M33 16h2.5a1.5 1.5 0 0 1 0 3H33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      {/* Cuerpo matraz */}
      <path
        d="M18 24v3l-6 14a3 3 0 0 0 2.7 4.2h18.6a3 3 0 0 0 2.7-4.2L30 27v-3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Check */}
      <path d="M20 36l3.5 3.5L30 32" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Circuitos */}
      <circle cx="16" cy="40" r="1.2" fill="currentColor" />
      <circle cx="32" cy="40" r="1.2" fill="currentColor" />
      <path d="M16 40h-3M32 40h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
