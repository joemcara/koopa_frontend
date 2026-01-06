"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Usa una variable de entorno si existe, si no, cae a localhost:8080
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function LoginScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreUsuario: usuario.trim(),
          password: contrasena,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(data?.message || "Usuario o contraseña incorrectos.");
        return;
      }

      // Guarda info básica en localStorage para el resto de la app
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "koopa_user",
          JSON.stringify({
            usuario: data.nombreUsuario ?? usuario.trim(),
            codCarrera: data.codCarrera ?? null,
          })
        );
      }

      // Redirige al dashboard (ajusta si quieres otra ruta)
      router.push("/home");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("No se pudo conectar con el servidor. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md">
        {/* Tarjeta principal */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 px-8 pt-8 pb-4">
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
            Acceso Académico
          </h1>
          <p className="text-sm text-slate-500 text-center mb-8">
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Usuario */}
            <div>
              <label
                htmlFor="usuario"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Usuario
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900 transition">
                <span className="text-slate-400 text-lg">👤</span>
                <input
                  id="usuario"
                  type="text"
                  placeholder="ej. admin"
                  className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Contraseña
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900 transition">
                <span className="text-slate-400 text-lg">🔒</span>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold text-sm py-2.5 mt-1 transition-colors"
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
