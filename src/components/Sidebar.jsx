"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/userStore";
import { useGlobalStore } from "@/store/globalStore";
import { useEffect, useState } from "react";

const menuItems = [
  { name: "Estadísticas", path: "/home", icon: "📊" },
  { name: "Malla Curricular", path: "/malla-curricular", icon: "🕸️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState([
    { name: "Estadísticas", path: "/home", icon: "📊" },
    { name: "Malla Curricular", path: "/malla-curricular", icon: "🕸️" },
  ]);

  const userStore = useUserStore();
  const globalStore = useGlobalStore();

  const logout = () => {
    // Limpia el estado global
    userStore.setUsuario("");
    userStore.setCarrera("");
    // Limpia el localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("koopa_user");
    }
    // Redirige al login
    window.location.href = "/";
  };

  useEffect(() => {
    if (userStore.carrera !== null) {

      setMenuItems(
        [
          { name: "Estadísticas", path: "/home", icon: "📊" },
          { name: "Malla Curricular", path: "/malla-curricular", icon: "🕸️" },
          { name: "Registrar usuario", path: "/auth/registrar-usuario", icon: "⚙️" }
        ]
      )
    }
  }, [userStore.carrera]);


  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="h-16 flex items-center px-8 border-b border-transparent">
        <h1 className="text-2xl font-bold text-[#0B0E31]">Koopa</h1>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          // Verificamos si el link está activo
          // Nota: Ajusta la lógica del path según sea tu ruta exacta ("/" o "/dashboard")
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => globalStore.setPathname(item.path === "/home" ? 'Dashboard académico' : 'Malla Curricular')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                isActive
                  ? "bg-[#0B0E31] text-white shadow-md" // Estilo Activo (Azul oscuro)
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#0B0E31]" // Estilo Inactivo
              }`}
            >
              {/* Icono (puedes usar librerías como Lucide-react luego) */}
              <span>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <Button onClick={logout} variant={'outline'}>Log out</Button>
    </aside>
  );
}