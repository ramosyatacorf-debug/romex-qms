import Sidebar from "@/components/Sidebar";
import ModuleCard from "@/components/ModuleCard";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-8 md:p-12">
          <div className="max-w-5xl">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              ¡Hola Rodrigo!
            </h1>
            <p className="text-slate-500 text-base mb-10 max-w-2xl leading-relaxed">
              Bienvenido al QMS del laboratorio de Exportadora RomEx S.A. Selecciona un
              módulo para comenzar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
              <ModuleCard
                number="Modulo 03"
                title=""
                href="#"
                icon="empty"
              />
              <ModuleCard
                number="Modulo 03"
                title=""
                href="#"
                icon="empty"
              />
              <ModuleCard
                number="Modulo 03"
                title=""
                href="#"
                icon="empty"
              />
            </div>
          </div>
        </div>

        <footer className="py-4 px-8 text-center text-xs text-slate-400 border-t border-slate-100">
          Exportadora RomEx S.A. — QMS Sistema de Gestión de Laboratorio
        </footer>
      </main>
    </div>
  );
}
