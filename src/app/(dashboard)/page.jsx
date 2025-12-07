"use client";

import { useEffect, useState } from "react";

// --- IMPORTAR COMPONENTES ---
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiUserLine, RiShieldCheckLine, RiGraduationCapLine, RiTrophyLine } from "@remixicon/react";

import KpiCard from "@/components/dashboard/KpiCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import FinanceChart from "@/components/dashboard/FinanceChart";
import SubjectList from "@/components/dashboard/SubjectList";

export default function Home() {
  // --- CONFIGURACIÓN DE COLORES ---
  const mainColor = "#0B0E31";      // Azul Oscuro (Reprobado / Top Reprobación)
  const secondaryColor = "#2563eb"; // Azul Brillante (Aprobado / Top Pobladas)
  const accentColor = "#6366f1";    // Indigo (Ingresos)

  // --- DATOS ESTÁTICOS ---
  const careersList = [
    { id: "all", name: "Todas las carreras" },
    { id: 1, name: "Ciencia de Datos e Inteligencia Artificial" },
    { id: 2, name: "Computación" },
    { id: 3, name: "Electricidad" },
    { id: 4, name: "Electrónica y Automatización" },
    { id: 5, name: "Telecomunicaciones" },
    { id: 6, name: "Telemática" },
  ];

  const periodsList = [
    { value: "all", label: "2023 - 2025" },
    { value: "2025-1S", label: "2025 - I" },
    { value: "2024-2S", label: "2024 - II" },
    { value: "2024-1S", label: "2024 - I" },
    { value: "2023-2S", label: "2023 - II" },
  ];

  // --- ESTADOS ---
  const [selectedCareerId, setSelectedCareerId] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Estados de Datos
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

  // --- FETCH DATA ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      let url = `http://localhost:8080/api/metricas/dashboard?`;

      if (selectedCareerId !== "all") url += `&codCarrera=${selectedCareerId}`;
      if (selectedPeriod !== "all") {
        const [anio, termino] = selectedPeriod.split("-");
        url += `&anio=${anio}&termino=${termino}`;
      }

      console.log("📡 Fetching:", url);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      console.log("📦 Respuesta Backend:", data);

      // --- MAPPINGS ---
      // 1. KPIs
      setKpis([
        { title: "Estudiantes", metric: data.cant_estudiantes?.toLocaleString() || "0", subMetric: null, icon: RiUserLine },
        { title: "Reprobación", metric: data.total_reprobados?.toLocaleString() || "0", subMetric: `${data.tasa_reprobacion || 0}%`, icon: RiShieldCheckLine },
        { title: "Graduados", metric: data.total_graduados?.toLocaleString() || "0", subMetric: `${data.tasa_graduados || 0}%`, icon: RiGraduationCapLine },
        { title: "Promedio Global", metric: data.promedio_carrera?.toFixed(2) || "0.00", subMetric: null, icon: RiTrophyLine },
      ]);

      // 2. Ingresos
      const cantidad_ingresos = data.evolucion_ingresos?.cantidad_ingresos || [];
      const periodos = data.evolucion_ingresos?.periodos || [];
      if (periodos.length > 0) {
        setFinanceData(periodos.map((p, index) => ({ periodo: p, valor: cantidad_ingresos[index] || 0 })));
      } else {
        setFinanceData([]);
      }

      // 3. Materias
      setSubjectsData((data.materias_mayor_reprobacion || []).map((m) => ({
        name: m.nombre_materia || "Desconocido",
        cantidad: m.reprobados ?? m.cantidad ?? 0,
      })));

      setSubjectsDataCant((data.materias_mas_pobladas || []).map((m) => ({
        name: m.nombreMateria || m.nombre_materia || "Desconocido",
        cantidad: m.cantidadInscritos ?? m.cantidad ?? 0,
      })));

      // 4. Rendimiento
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
  }, [selectedCareerId, selectedPeriod]);

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
            <Select value={selectedCareerId} onValueChange={setSelectedCareerId}>
              <SelectTrigger className="w-[240px] bg-white"><SelectValue placeholder="Carrera" /></SelectTrigger>
              <SelectContent>
                {careersList.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Periodo" /></SelectTrigger>
              <SelectContent>
                {periodsList.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className={`transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
          
          {/* 1. KPIS */}
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

          {/* 2. GRÁFICOS GRANDES */}
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

          {/* 3. LISTAS DE MATERIAS */}
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