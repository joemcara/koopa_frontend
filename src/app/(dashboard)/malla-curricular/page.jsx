"use client";

import { useState, useEffect, useMemo } from "react";
import SubjectsView from "./SubjectsView";
// Asegúrate de importar los componentes de shadcn donde los tengas guardados
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definimos la lista SIN la opción "all"
const careersList = [
  { id: 1, name: "Ciencia de Datos e Inteligencia Artificial" },
  { id: 2, name: "Computación" },
  { id: 3, name: "Electricidad" },
  { id: 4, name: "Electrónica y Automatización" },
  { id: 5, name: "Telecomunicaciones" },
  { id: 6, name: "Telemática" },
];

export default function MallaCurricular() {
  // 1. ESTADO INICIAL: Ponemos "2" (Computación) por defecto para que siempre haya una carrera seleccionada.
  const [selectedCareerId, setSelectedCareerId] = useState("2");
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Ponemos loading cada vez que cambia la carrera
      try {
        // 2. PETICIÓN AL BACKEND: Enviamos el ID de la carrera seleccionada
        // Ajusta el param (?carrera=...) según como lo espere tu API
        const response = await fetch(`http://localhost:8080/api/materias/malla-stats?codCarrera=${selectedCareerId}`);
        
        if (!response.ok) throw new Error("Error al cargar datos");
        
        const data = await response.json();

        // Procesamiento de datos (igual que antes)
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
        setMaterias([]); // Limpiamos si hay error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCareerId]); // <--- IMPORTANTE: El efecto se dispara cuando cambia el ID

  // Filtrado local solo por nombre (la carrera ya la filtra el backend)
  const materiasFiltradas = useMemo(() => {
    return materias.filter((m) =>
      m.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    );
  }, [materias, filtroNombre]);

  return (
    <div className="justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main style={{ padding: "24px" }}>
        
        <div className="flex gap-4 items-center mt-8 mb-6 pr-6 flex-wrap">
          
          {/* 3. TU COMPONENTE SELECT (SHADCN UI) */}
          <Select value={selectedCareerId} onValueChange={setSelectedCareerId}>
            <SelectTrigger className="w-[280px] bg-white rounded-full border-gray-200">
              <SelectValue placeholder="Seleccionar carrera" />
            </SelectTrigger>
            <SelectContent>
              {careersList.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Input de búsqueda por nombre */}
          <div className="relative flex-1 max-w-[400px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
              🔍
            </span>
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
            Cargando malla de {careersList.find(c => String(c.id) === selectedCareerId)?.name}...
          </div>
        ) : (
          <SubjectsView subjects={materiasFiltradas} />
        )}
      </main>
    </div>
  );
}