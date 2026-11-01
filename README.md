# RomEx QMS — Quality Management System

**Núcleo central del ecosistema RomEx**

Sistema de Gestión de Calidad para el laboratorio de **Exportadora RomEx S.A.**

Este repositorio contiene la plataforma principal desde la cual se conectarán el resto de los sistemas del ecosistema (Single Sign-On).

---

## Stack tecnológico

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide React** (iconos)
- **Framer Motion** (animaciones futuras)

---

## Características actuales (Fase 1)

- Página de Login moderna y profesional (carta de presentación)
- Dashboard principal con sidebar
- Módulos: Microbiología, Físico Químico (+ placeholders)
- Estructura preparada para crecer (SSO, más módulos, Qualy AI, etc.)

---

## Cómo ejecutar

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx              # Login
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard principal
│   ├── layout.tsx
│   └── globals.css
└── components/
    ├── Sidebar.tsx
    └── ModuleCard.tsx
```

---

## Próximos pasos

1. Autenticación real (NextAuth + base de datos)
2. Módulo Microbiología
3. Módulo Físico Químico
4. Qualy AI
5. Single Sign-On para conectar el resto del ecosistema

---

**Exportadora RomEx S.A.** — QMS Sistema de Gestión de Laboratorio
