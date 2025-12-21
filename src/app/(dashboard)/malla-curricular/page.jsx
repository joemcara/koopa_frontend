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

  // --- EFECTO 1: CARGAR FILTROS Y TRANSFORMAR DATOS ---
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/filtros");
        if (!response.ok) throw new Error("Error cargando filtros");
        const data = await response.json();

        setCareersList(data.carreras || []);

        if (data.semestres) {
          // 1. Tomamos los semestres reales (quitamos el "Todos" que viene del back si existe en indice 0)
          const rawSemestres = data.semestres.slice(1);

          // 2. Mapeamos PRIMERO para asignar el ID incremental correcto (basado en orden cronológico)
          // Esto asegura que el ID 1 siga siendo el periodo más antiguo, aunque lo mostremos al final.
          const mappedSemestres = rawSemestres.map((item, index) => ({
            id: index + 1,      // ID numérico backend (1, 2, 3...)
            label: item.id,     // Texto visual ("PAO 2022-1")
            value: item.value   // Valor técnico ("2022-1S")
          }));

          // 3. Invertimos el orden (REVERSE) para que salgan los más nuevos arriba
          const reversedSemestres = mappedSemestres.reverse();

          // 4. Agregamos manualmente la opción "Todos" al principio
          const finalPeriods = [
            { id: "all", label: "Todos los periodos", value: "all" },
            ...reversedSemestres
          ];
          
          setPeriodsList(finalPeriods);
        }
      } catch (error) {
        console.error("❌ Error cargando filtros:", error);
      }
    };
    fetchFilters();
  }, []);

  // --- EFECTO 2: CARGAR MALLA (Lógica de Petición) ---
  useEffect(() => {
    const fetchData = async () => {
      if (selectedCareerId === "all" || !selectedCareerId) return;

      setLoading(true); 
      try {
        // Base de la URL
        let url = `http://localhost:8080/api/materias/malla-stats?codCarrera=${selectedCareerId}`;

        // LÓGICA DE ENVÍO:
        // Solo agregamos el parámetro si NO es "all" y si existe un valor
        if (selectedPeriod && selectedPeriod !== "all") {
            url += `&codSemestre=${selectedPeriod}`;
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
  }, [selectedCareerId, selectedPeriod]); 

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
          
          {/* Select Carrera */}
          <Select value={selectedCareerId} onValueChange={setSelectedCareerId}>
            <SelectTrigger className="w-[280px] bg-white rounded-full border-gray-200">
              <SelectValue placeholder="Seleccionar carrera" />
            </SelectTrigger>
            <SelectContent>
              {careersList.map((c) => (
                c.id !== "all" && (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.value} 
                  </SelectItem>
                )
              ))}
            </SelectContent>
          </Select>

          {/* Select Periodo (Orden Invertido + Todos) */}
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[280px] bg-white rounded-full border-gray-200">
              <SelectValue placeholder="Seleccionar Periodo" />
            </SelectTrigger>
            <SelectContent>
              {periodsList.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                   {p.label}
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