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
  const [periodsList, setPeriodsList] = useState([]); 
  
  // 2. ESTADOS DE SELECCIÓN
  const [selectedCareerId, setSelectedCareerId] = useState("2");
  
  // Inicializamos en "all" para que por defecto muestre todos
  const [selectedPeriod, setSelectedPeriod] = useState("all"); 

  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");

  const globalStore = useGlobalStore();
  const userStore = useUserStore();

  // --- EFECTO 1: CARGAR FILTROS Y TRANSFORMAR DATOS ---
  // --- 1. CARGAR FILTROS ---
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        if (globalStore.carreras.length !== 0 && globalStore.anios.length !== 0 && globalStore.terminos.length !== 0) return;

        const response = await fetch("http://localhost:8080/api/filtros");

        if (!response.ok) throw new Error("Error cargando filtros");
        const data = await response.json();
        
        globalStore.setCarreras(data.carreras || []);
        globalStore.setAnios(data.anios || []);
        globalStore.setTerminos(data.terminos || []);

      } catch (error) {
        console.error("❌ Error cargando filtros:", error);
      }
    };
    fetchFilters();
  }, []);

  // --- EFECTO 2: CARGAR MALLA (Lógica de Petición) ---
  useEffect(() => {
    const fetchData = async () => {
      if (globalStore.carreraSeleccionada === "all" || !globalStore.carreraSeleccionada) return;

      setLoading(true); 
      try {
        // Base de la URL
        let url = `http://localhost:8080/api/materias/malla-stats?codCarrera=${globalStore.carreraSeleccionada}`;

        // LÓGICA DE ENVÍO:
        // Solo agregamos el parámetro si NO es "all" y si existe un valor
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

        // Procesamiento de datos (Igual que siempre)
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

  // Filtrado local y nombre de carrera
  const materiasFiltradas = useMemo(() => {
    return materias.filter((m) =>
      m.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    );
  }, [materias, filtroNombre]);

  const currentCareerName = careersList.find(c => String(c.id) === selectedCareerId)?.value || "Carrera";

  return (
    <div className="justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main style={{ padding: "24px" }}>
        
        <div className="flex gap-4 items-center mt-8 mb-6 pr-6 flex-wrap">
          
         {
            userStore.carrera && userStore.carrera !== 0 ? null : (
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
            </Select>)
           }

              {/* SELECT DE CARRERAS */}
            <Select value={globalStore.anioSeleccionado} onValueChange={globalStore.setAnioSeleccionado}>
              <SelectTrigger className="w-[240px] bg-white">
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

            {/* SELECT DE PERIODOS (Modificado) */}
            <Select value={globalStore.terminoSeleccionado} onValueChange={globalStore.setTerminoSeleccionado}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Termino" />
              </SelectTrigger>
              <SelectContent>
                {globalStore.terminos.map((p) => (
                  // KEY y VALUE usan 'p.id' (ej: "PAO 2025-1") porque es único.
                  // 'p.value' ("1S") se repite, así que no sirve como identificador de selección.
                  // CHILDREN usa 'p.id' para MOSTRAR el texto "PAO 2025-1".
                  <SelectItem key={p.id} value={p.id}>
                    {p.id === "all" ? p.value : p.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          {/* Buscador */}
          <div className="relative flex-1 max-w-[400px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Buscar materia..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500 animate-pulse">
            Cargando malla de <span className="font-semibold">{currentCareerName}</span>...
          </div>
        ) : (
          <SubjectsView subjects={materiasFiltradas} />
        )}
      </main>
    </div>
  );
}