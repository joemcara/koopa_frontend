"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserFormStore } from "@/store/userFormStore";
import { API_BASE_URL } from "@/config/api";

export default function SignUpScreen() {
    const router = useRouter();
    const userFormStore = useUserFormStore();
    const [carreras, setCarreras] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [triedSubmit, setTriedSubmit] = useState(false); // Nuevo estado para feedback visual
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchCarreras = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/carreras`);
                const data = await response.json();
                setCarreras(data.map((carrera) => ({ id: carrera.codCarrera, value: carrera.nombreCarrera })));
            } catch (err) {
                console.error("❌ Error al cargar carreras:", err);
            }
        };
        fetchCarreras();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTriedSubmit(true); // El usuario intentó enviar el form

        // VALIDACIÓN DE CARRERA OBLIGATORIA
        if (!userFormStore.carrera) {
            setError("Debes seleccionar una carrera para continuar.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombreUsuario: userFormStore.username.trim(),
                    password: userFormStore.password,
                    codCarrera: parseInt(userFormStore.carrera, 10),
                }),
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                setError(data?.message || "Error al registrar usuario.");
                return;
            }
            router.push("/");
        } catch (err) {
            console.error("❌ Error en el registro:", err);
            setError("Error de conexión con el servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    const getSelectedCarreraLabel = () => {
        const selected = carreras.find(c => String(c.id) === String(userFormStore.carrera));
        return selected ? selected.value : "Selecciona una carrera";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 px-8 pt-8 pb-6">
                    <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Registro</h1>
                    <p className="text-sm text-slate-500 text-center mb-8">Ingrese el usuario que quiere añadir al sistema.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Usuario */}
                        <div>
                            <label className="block text-sm font-medium text-slate-800 mb-1.5">Usuario</label>
                            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:ring-2 focus-within:ring-slate-900 transition">
                                <span className="text-slate-400">👤</span>
                                <input
                                    className="w-full bg-transparent outline-none text-sm"
                                    placeholder="Ingrese un nombre de usuario"
                                    value={userFormStore.username}
                                    onChange={(e) => userFormStore.setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-slate-800 mb-1.5">Contraseña</label>
                            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:ring-2 focus-within:ring-slate-900 transition">
                                <span className="text-slate-400">🔒</span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-transparent outline-none text-sm"
                                    value={userFormStore.password}
                                    onChange={(e) => userFormStore.setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Carrera (Select Personalizado) */}
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-sm font-medium text-slate-800 mb-1.5">Carrera</label>
                            
                            <button
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                className={`
                                    w-full flex items-center gap-2 
                                    rounded-xl border bg-slate-50 px-3 py-2.5 
                                    transition-all duration-200
                                    ${isOpen ? 'ring-2 ring-slate-900 border-transparent' : 
                                      triedSubmit && !userFormStore.carrera ? 'border-red-500 bg-red-50' : 'border-slate-200'}
                                `}
                            >
                                <span className="text-slate-400 text-lg">🎓</span>
                                <span className={`text-sm flex-1 text-left truncate ${userFormStore.carrera ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {getSelectedCarreraLabel()}
                                </span>
                                <svg className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isOpen && (
                                <div 
                                    className="absolute left-0 right-0 z-50 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
                                    style={{ width: '100%' }}
                                >
                                    <div className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                                        <ul className="py-1">
                                            {carreras.map((c) => (
                                                <li 
                                                    key={c.id}
                                                    onClick={() => {
                                                        userFormStore.setCarrera(String(c.id));
                                                        setIsOpen(false);
                                                        setError(""); // Limpiamos el error al elegir
                                                    }}
                                                    className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors"
                                                >
                                                    {c.value}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                                <span>⚠️</span>
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold text-sm py-3 transition-all active:scale-[0.98]"
                        >
                            {isLoading ? "Registrando..." : "Registrar"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}