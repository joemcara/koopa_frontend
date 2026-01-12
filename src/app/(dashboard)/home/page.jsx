"use client";

import { useEffect, useState } from "react";

// --- IMPORTAR COMPONENTES ---
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiUserLine, RiShieldCheckLine, RiGraduationCapLine, RiTrophyLine } from "@remixicon/react";

import KpiCard from "@/components/dashboard/KpiCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import FinanceChart from "@/components/dashboard/FinanceChart";
import SubjectList from "@/components/dashboard/SubjectList";
import { useUserStore } from "@/store/userStore";
import { useGlobalStore } from "@/store/globalStore";

export default function Home() {
  // --- CONFIGURACIÓN DE COLORES ---
  const mainColor = "#0B0E31";      
  const secondaryColor = "#2563eb"; 
  const accentColor = "#6366f1";

  const userStore = useUserStore();

  const globalStore = useGlobalStore();


  // --- ESTADOS DE FILTROS ---
  const [careersList, setCareersList] = useState([]);
  const [periodsList, setPeriodsList] = useState([]);

  // --- ESTADOS DE SELECCIÓN ---
  // Usaremos el ID como valor del estado para garantizar unicidad (ej: "PAO 2025-1")
  const [selectedCareerId, setSelectedCareerId] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  
  const [isLoading, setIsLoading] = useState(false);

  // Estados de Datos del Dashboard
  const [kpis, setKpis] = useState([
    { title: "Estudiantes", metric: "0", subMetric: null, icon: RiUserLine },
    { title: "Reprobación", metric: "0", subMetric: "0%", icon: RiShieldCheckLine },
    { title: "Graduados", metric: "0", subMetric: "0%", icon: RiGraduationCapLine },
    { title: "Promedio Global", metric: "0.00", subMetric: null, icon: RiTrophyLine },
  ]);

  const [performanceData, setPerformanceData] = useState([]);
  const [financeData, setFinanceData] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);
  const [subjectsDataCant, setSubjectsDataCant] = useState([]);





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

  // --- 2. CARGAR DASHBOARD ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      let url = `http://localhost:8080/api/metricas/dashboard?`;

      // Filtro de Carrera
      if (globalStore.carreraSeleccionada !== "all") {
        url += `&codCarrera=${globalStore.carreraSeleccionada}`;
      }

      // Filtro de Periodo
      if (globalStore.anioSeleccionado !== "all") {
        url += `&anio=${globalStore.anioSeleccionado}`;
      }

      if (globalStore.terminoSeleccionado !== "all") {
        url += `&termino=${globalStore.terminoSeleccionado}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      
      // --- MAPPINGS (Igual que antes) ---
      setKpis([
        { title: "Estudiantes", metric: data.cantidad_estudiantes?.toLocaleString() || "0", subMetric: null, icon: RiUserLine },
        { title: "Reprobación", metric: data.total_reprobados?.toLocaleString() || "0", subMetric: `${data.tasa_reprobacion || 0}%`, icon: RiShieldCheckLine },
        { title: "Graduados", metric: data.total_graduados?.toLocaleString() || "0", subMetric: null, icon: RiGraduationCapLine },
        { title: "Promedio Global", metric: data.promedio_carrera?.toFixed(2) || "0.00", subMetric: null, icon: RiTrophyLine },
      ]);

      const cantidad_ingresos = data.evolucion_ingresos?.cantidad_ingresos || [];
      const periodosChart = data.evolucion_ingresos?.periodos || [];
      
      setFinanceData(periodosChart.length > 0 
        ? periodosChart.map((p, index) => ({ periodo: p, valor: cantidad_ingresos[index] || 0 })) 
        : []
      );

      setSubjectsData((data.materias_mayor_reprobacion || []).map((m) => ({
        name: m.nombre_materia || "Desconocido",
        cantidad: m.reprobados ?? m.cantidad ?? 0,
      })));

      setSubjectsDataCant((data.materias_mas_pobladas || []).map((m) => ({
        name: m.nombreMateria || m.nombre_materia || "Desconocido",
        cantidad: m.cantidadInscritos ?? m.cantidad ?? 0,
      })));

      setPerformanceData((data.rendimiento_carrera || []).map((r) => ({
        name: r.nombre_carrera || "Desconocido",
        Aprobado: r.aprobados ?? 0,
        Reprobado: r.reprobados ?? 0,
      })));

    } catch (error) {
      console.error("❌ Error conectando al backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [globalStore.carreraSeleccionada, globalStore.anioSeleccionado, globalStore.terminoSeleccionado]);

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50/50 font-sans">
      <main className="flex w-full max-w-7xl flex-col gap-6 p-6 md:p-8">
        
        {/* HEADER / FILTROS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center mb-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0B0E31]">
              Dashboard Académico
              {isLoading && <span className="text-sm font-normal text-muted-foreground ml-2 animate-pulse">Actualizando...</span>}
            </h2>
            <p className="text-muted-foreground text-sm">Resumen general del periodo actual.</p>
          </div>

          <div className="flex gap-3">
            {/* SELECT DE CARRERAS */}
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
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className={`transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((item, index) => (
              <KpiCard 
                key={index}
                title={item.title}
                metric={item.metric}
                subMetric={item.subMetric}
                icon={item.icon}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <PerformanceChart 
              data={performanceData} 
              mainColor={mainColor} 
              secondaryColor={secondaryColor} 
            />
            <FinanceChart 
              data={financeData} 
              accentColor={accentColor} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <SubjectList 
              title="Materias con mayor reprobación" 
              data={subjectsData} 
              barColor={mainColor} 
            />
            <SubjectList 
              title="Materias más pobladas" 
              data={subjectsDataCant} 
              barColor={secondaryColor} 
            />
          </div>

        </div>
      </main>
    </div>
  );
}