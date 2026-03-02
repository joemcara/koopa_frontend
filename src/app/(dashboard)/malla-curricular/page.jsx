"use client";

import { useState, useEffect, useMemo } from "react";
import SubjectsView from "./SubjectsView";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalStore } from "@/store/globalStore";
import { useUserStore } from "@/store/userStore";

export default function MallaCurricular() {
  // 1. ESTADO DE FILTROS
  const [careersList, setCareersList] = useState([]);
  
  // 2. ESTADOS LOCALES
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");

  const globalStore = useGlobalStore();
  const userStore = useUserStore();

  // --- EFECTO 1: CARGAR FILTROS Y DEFAULT ---
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Si ya hay datos, solo validamos el default
        if (globalStore.carreras.length !== 0 && globalStore.anios.length !== 0 && globalStore.terminos.length !== 0) {
           // Lógica de Default si ya estaban cargados
           if ((!userStore.carrera || userStore.carrera === 0) && (globalStore.carreraSeleccionada === "all" || !globalStore.carreraSeleccionada)) {
              globalStore.setCarreraSeleccionada("236"); // Default Computación
           }
           return;
        }

        const response = await fetch("http://localhost:8080/api/filtros");

        if (!response.ok) throw new Error("Error cargando filtros");
        const data = await response.json();
        
        globalStore.setCarreras(data.carreras || []);
        globalStore.setAnios(data.anios || []);
        globalStore.setTerminos(data.terminos || []);

        // --- LÓGICA DE SELECCIÓN POR DEFECTO ---
        // Si el usuario no tiene carrera asignada (es admin/todos) y no ha seleccionado nada aún:
        if (!userStore.carrera || userStore.carrera === 0) {
          globalStore.setCarreraSeleccionada("236"); // ID 2 = Computación
        } else {
            // Si tiene carrera asignada, el store ya debería tener ese valor, o lo forzamos aqui
             globalStore.setCarreraSeleccionada(String(userStore.carrera));
        }

      } catch (error) {
        console.error("❌ Error cargando filtros:", error);
      }
    };
    fetchFilters();
  }, []); // Se ejecuta al montar

  // --- EFECTO 2: CARGAR MALLA ---
  useEffect(() => {
    const fetchData = async () => {
      // Evitar fetch si está en "all" o vacío
      if (!globalStore.carreraSeleccionada || globalStore.carreraSeleccionada === "all") return;

      setLoading(true); 
      try {
        let url = `http://localhost:8080/api/materias/malla-stats?codCarrera=${globalStore.carreraSeleccionada}`;

        if (globalStore.anioSeleccionado && globalStore.anioSeleccionado !== "all") {
          url += `&anio=${globalStore.anioSeleccionado}`;
        } 

        if (globalStore.terminoSeleccionado && globalStore.terminoSeleccionado !== "all") {
          url += `&termino=${globalStore.terminoSeleccionado}`;
        } 

        console.log("📡 Fetching Malla:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al cargar datos");
        const data = await response.json();

        // Procesamiento de datos
        const materiasProcesadas = data.map((materia) => {
          const datosGrafico = materia.rendimiento.map((r) => {
            const infoPeriodo = materia.stats[r.periodo];
            return {
              ...r,
              nombrePeriodo: infoPeriodo ? infoPeriodo.descripcion : r.periodo,
            };
          });

          const periodosKeys = Object.keys(materia.stats).sort((a, b) => Number(a) - Number(b));
          const ultimoPeriodoKey = periodosKeys[periodosKeys.length - 1];
          const infoActual = materia.stats[ultimoPeriodoKey] || {};

          return {
            ...materia,
            datosGrafico,
            infoActual
          };
        });

        setMaterias(materiasProcesadas);
      } catch (error) {
        console.error(error);
        setMaterias([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [globalStore.carreraSeleccionada, globalStore.anioSeleccionado, globalStore.terminoSeleccionado]); 

  // Filtrado local
  const materiasFiltradas = useMemo(() => {
    return materias.filter((m) =>
      m.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    );
  }, [materias, filtroNombre]);

  // Obtener nombre de la carrera actual para el loading/título
  const currentCareerName = globalStore.carreras.find(c => String(c.id) === globalStore.carreraSeleccionada)?.value || "Carrera";

  return (
    <div className="justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="p-6 md:p-8">
        
        {/* BARRA DE CONTROLES */}
        <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-end mb-6 mt-2">

            <div className="flex flex-wrap gap-4 items-end w-full xl:w-auto">
            
            {/* 1. SELECT CARRERA */}
            {userStore.carrera && userStore.carrera !== 0 ? null : (
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-gray-500 ml-1">Carrera</span>
                    <Select value={globalStore.carreraSeleccionada} onValueChange={globalStore.setCarreraSeleccionada}>
                        <SelectTrigger className="w-[240px] bg-white">
                        <SelectValue placeholder="Carrera" />
                        </SelectTrigger>
                        <SelectContent>
                        {globalStore.carreras.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                            {c.value}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* 2. SELECT AÑO */}
            <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-gray-500 ml-1">Año</span>
                <Select value={globalStore.anioSeleccionado} onValueChange={globalStore.setAnioSeleccionado}>
                    <SelectTrigger className="w-[140px] bg-white">
                    <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent>
                    {globalStore.anios.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                        {c.value}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>

            {/* 3. SELECT PERIODO */}
            <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-gray-500 ml-1">Término</span>
                <Select value={globalStore.terminoSeleccionado} onValueChange={globalStore.setTerminoSeleccionado}>
                    <SelectTrigger className="w-[140px] bg-white">
                    <SelectValue placeholder="Termino" />
                    </SelectTrigger>
                    <SelectContent>
                    {globalStore.terminos.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                        {p.id === "all" ? p.value : p.id}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>

            {/* 4. BUSCADOR */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                <span className="text-xs font-medium text-gray-500 ml-1">Buscar</span>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">🔍</span>
                    <input
                    type="text"
                    placeholder="Nombre de materia..."
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 h-10 rounded-md border border-gray-200 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white"
                    />
                </div>
            </div>

          </div>
            
            {/* IZQUIERDA: LEYENDA DEL SEMÁFORO */}
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-[#0B0E31]">Malla Curricular</h2>
                <div className="flex items-center gap-4 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-xs font-semibold text-gray-500 mr-1">Índice de Reprobación:</span>
                    
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600">Bajo (OK)</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <span className="text-xs text-gray-600">Medio</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <span className="text-xs text-gray-600">Alto (Crítico)</span>
                    </div>
                </div>
            </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 animate-pulse">
            <div className="mb-4 h-8 w-8 rounded-full border-2 border-t-transparent border-blue-600 animate-spin"></div>
            <p>Cargando malla de <span className="font-semibold text-blue-600">{currentCareerName}</span>...</p>
          </div>
        ) : (
          <SubjectsView subjects={materiasFiltradas} />
        )}
      </main>
    </div>
  );
}