import { Geist, Geist_Mono,Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. Configuramos la fuente
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Cargamos los pesos que usaremos
  variable: "--font-jakarta", // Definimos la variable CSS
});


export const metadata = {
  title: "KOOPA",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${jakarta.variable} antialiased font-sans`}
      >
        <div className="min-h-screen bg-[#F8F9FA]">
          {/* 1. SIDEBAR FIJO A LA IZQUIERDA */}
          <Sidebar />

          {/* 2. CONTENIDO PRINCIPAL (Desplazado a la derecha por el sidebar) */}
          <div className="ml-64 flex flex-col min-h-screen">
            
            {/* Header pegado arriba */}
            <Header />

            {/* El contenido cambiante (Tus páginas) */}
            <main className="flex-1 p-8">
              {children}
            </main>
            
          </div>
        </div>
      </body>
    </html>
  );
}

