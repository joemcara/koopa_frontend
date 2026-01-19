import { useGlobalStore } from "@/store/globalStore";
import {useUserStore} from "@/store/userStore";

import { useEffect, useState } from "react";

export default function Header() {

  const userStore = useUserStore();
  const globalStore = useGlobalStore();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Título de la izquierda */}
      <h2 className="text-xl font-bold text-[#0B0E31]">
        {/* Puedes personalizar el título según la ruta o contexto */}
        {
          globalStore.pathname
        }
      </h2>

      {/* Perfil de usuario a la derecha */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden md:block">
          <p className="text-sm font-semibold text-gray-700">{userStore.usuario}</p>
        </div>
        {/* Avatar simulado */}
        <div className="w-10 h-10 rounded-full bg-red-200 overflow-hidden border border-gray-300">
          <img 
            src="https://i.pravatar.cc/150?u=bonilla" // Placeholder imagen
            alt="User" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}