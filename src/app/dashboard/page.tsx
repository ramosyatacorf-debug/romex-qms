import Sidebar from "@/components/Sidebar";
import ModuleCard from "@/components/ModuleCard";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <div className="flex-1 px-10 py-12 md:px-16 md:py-14">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-slate-800 mb-2">
              ¡Hola Rodrigo!
            </h1>
            <p className="text-slate-500 text-[15px] mb-12 max-w-xl leading-relaxed">
              Bienvenido al QMS del laboratorio de Exportadora RomEx S.A. Selecciona un
              módulo para comenzar.
            </p>

            {/* Modules - layout similar al original */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-start-1">
                <ModuleCard
                  number="Modulo 03"
                  title=""
                  href="#"
                  icon="empty"
                />
              </div>
              <div>
                <ModuleCard
                  number="Modulo 03"
                  title=""
                  href="#"
                  icon="empty"
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="py-4 text-center text-xs text-slate-400">
          Exportadora RomEx S.A. — QMS Sistema de Gestión de Laboratorio
        </footer>
      </main>
    </div>
  );
}
