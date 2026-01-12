// app/(dashboard)/layout.jsx
"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* SIDEBAR FIJO A LA IZQUIERDA */}
      <Sidebar />

      {/* CONTENIDO PRINCIPAL (Desplazado por el sidebar) */}
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
