import Sidebar from "@/components/Sidebar";
import ModuleCard from "@/components/ModuleCard";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-8 py-10 md:px-14 md:py-12">
          <div className="max-w-3xl">
            <h1 className="text-[26px] font-semibold text-slate-800 mb-2 tracking-tight">
              ¡Hola Rodrigo!
            </h1>
            <p className="text-slate-500 text-[15px] mb-11 max-w-lg leading-relaxed">
              Bienvenido al QMS del laboratorio de Exportadora RomEx S.A. Selecciona un
              módulo para comenzar.
            </p>

            {/* Fila 1 - 3 módulos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
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

            {/* Fila 2 - 2 módulos alineados a la izquierda */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <ModuleCard number="Modulo 03" title="" href="#" icon="empty" />
              <ModuleCard number="Modulo 03" title="" href="#" icon="empty" />
            </div>
          </div>
        </div>

        <footer className="py-4 text-center text-[11px] text-slate-400">
          Exportadora RomEx S.A. — QMS Sistema de Gestión de Laboratorio
        </footer>
      </main>
    </div>
  );
}
