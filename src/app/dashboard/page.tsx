import Sidebar from "@/components/Sidebar";
import ModuleCard from "@/components/ModuleCard";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-8 py-8 md:px-12 md:py-9">
          <div className="max-w-3xl">
            <h1 className="text-[22px] font-semibold text-slate-800 mb-1.5 tracking-tight">
              ¡Hola Rodrigo!
            </h1>
            <p className="text-slate-500 text-[14px] mb-8 max-w-lg leading-relaxed">
              Bienvenido al QMS del laboratorio de Exportadora RomEx S.A. Selecciona un
              módulo para comenzar.
            </p>

            {/* Fila 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <ModuleCard
                number="Modulo 01"
                title="Microbiología"
                href="/dashboard/microbiologia"
                icon="microscope"
              />
              <ModuleCard
                number="Modulo 02"
                title="Físico Químico"
                href="/dashboard/fisico-quimico"
                icon="flask"
              />
              <ModuleCard number="Modulo 03" title="" href="#" icon="empty" />
            </div>

            {/* Fila 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ModuleCard number="Modulo 03" title="" href="#" icon="empty" />
              <ModuleCard number="Modulo 03" title="" href="#" icon="empty" />
            </div>
          </div>
        </div>

        <footer className="py-3 text-center text-[11px] text-slate-400">
          Exportadora RomEx S.A. — QMS Sistema de Gestión de Laboratorio
        </footer>
      </main>
    </div>
  );
}
