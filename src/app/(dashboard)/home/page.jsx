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

  // --- ESTADOS DE DATOS ---
  const [isLoading, setIsLoading] = useState(false);

  // Estados de Datos del Dashboard
  const [kpis, setKpis] = useState([
    { title: "Estudiantes", metric: "0", subMetric: null, icon: RiUserLine, tooltip: "" },
    { title: "Reprobación", metric: "0", subMetric: "0%", icon: RiShieldCheckLine, tooltip: "" },
    { title: "Graduados", metric: "0", subMetric: "0%", icon: RiGraduationCapLine, tooltip: "" },
    { title: "Promedio Global", metric: "0.00", subMetric: null, icon: RiTrophyLine, tooltip: "" },
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

        const response = await fetch("http://localhost:8081/api/filtros");

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
      let url = `http://localhost:8081/api/metricas/dashboard?`;

      // Filtros
      if (globalStore.carreraSeleccionada !== "all") url += `&codCarrera=${globalStore.carreraSeleccionada}`;
      if (globalStore.anioSeleccionado !== "all") url += `&anio=${globalStore.anioSeleccionado}`;
      if (globalStore.terminoSeleccionado !== "all") url += `&termino=${globalStore.terminoSeleccionado}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();

      // --- MAPPINGS DE KPIS CON TOOLTIPS ---
      setKpis([
        {
          title: "Estudiantes",
          metric: data.cantidad_estudiantes?.toLocaleString() || "0",
          subMetric: null,
          icon: RiUserLine,
          tooltip: "Estudiantes activos matriculados" // Texto solicitado
        },
        {
          title: "Reprobación",
          metric: data.total_reprobados?.toLocaleString() || "0",
          subMetric: `${data.tasa_reprobacion || 0}%`,
          icon: RiShieldCheckLine,
          tooltip: "Reprobado de los activos" // Texto solicitado
        },
        {
          title: "Graduados",
          metric: data.total_graduados?.toLocaleString() || "0",
          subMetric: null,
          icon: RiGraduationCapLine,
          tooltip: "Graduados por año" // Texto solicitado
        },
        {
          title: "Promedio Global",
          metric: data.promedio_carrera?.toFixed(2) || "0.00",
          subMetric: null,
          icon: RiTrophyLine,
          tooltip: "Promedio global de la carrera en ese término" // Texto solicitado
        },
      ]);

      // --- PROCESAMIENTO DE DATOS DE INGRESOS ---
      const rawIngresos = data.evolucion_ingresos?.cantidad_ingresos || [];
      const rawPeriodos = data.evolucion_ingresos?.periodos || [];
      const datosAgrupados = {};

      rawPeriodos.forEach((periodo, index) => {
        if (periodo.includes("PAE")) return; // Ignorar PAE
        const valor = rawIngresos[index] || 0;
        if (datosAgrupados[periodo]) {
          datosAgrupados[periodo] += valor;
        } else {
          datosAgrupados[periodo] = valor;
        }
      });

      const processedFinanceData = Object.entries(datosAgrupados).map(([periodo, valor]) => ({
        periodo,
        valor
      }));
      setFinanceData(processedFinanceData);

      // --- OTRAS TABLAS ---
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

  // --- LÓGICA DE TEXTO DEL HEADER ---
  const getDescripcionPeriodo = () => {
    if (globalStore.anioSeleccionado === "all") {
      if (globalStore.anios.length > 0) {
        const primerAnio = globalStore.anios[1].value;
        const ultimoAnio = globalStore.anios[globalStore.anios.length - 1].value;
        return `Resumen general desde ${primerAnio} hasta ${ultimoAnio}`;
      }
      return "Resumen general histórico";
    }
    const terminoLabel = globalStore.terminoSeleccionado === "all" ? "" : ` - ${globalStore.terminoSeleccionado}`;
    return `Resumen general del periodo ${globalStore.anioSeleccionado}${terminoLabel}`;
  };

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50/50 font-sans">
      <main className="flex w-full max-w-7xl flex-col gap-6 p-6 md:p-8">

        {/* HEADER / FILTROS */}
        <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-end mb-2">
          <div className="pb-1">
            <h2 className="text-2xl font-bold tracking-tight text-[#0B0E31]">
              Dashboard Académico
              {isLoading && <span className="text-sm font-normal text-muted-foreground ml-2 animate-pulse">Actualizando...</span>}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">{getDescripcionPeriodo()}</p>
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            {userStore.carrera && userStore.carrera !== 0 ? null : (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-gray-500 ml-1">Carrera</span>
                <Select value={globalStore.carreraSeleccionada} onValueChange={globalStore.setCarreraSeleccionada}>
                  <SelectTrigger className="w-[240px] bg-white"><SelectValue placeholder="Carrera" /></SelectTrigger>
                  <SelectContent>
                    {globalStore.carreras.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.value}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-500 ml-1">Año</span>
              <Select value={globalStore.anioSeleccionado} onValueChange={globalStore.setAnioSeleccionado}>
                <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Año" /></SelectTrigger>
                <SelectContent>
                  {globalStore.anios.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.value}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-500 ml-1">Término</span>
              <Select value={globalStore.terminoSeleccionado} onValueChange={globalStore.setTerminoSeleccionado}>
                <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Termino" /></SelectTrigger>
                <SelectContent>
                  {globalStore.terminos.map((p) => (<SelectItem key={p.id} value={p.id}>{p.id === "all" ? p.value : p.id}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className={`transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>

          {/* Tarjetas KPI con Tooltips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((item, index) => (
              <KpiCard
                key={index}
                title={item.title}
                metric={item.metric}
                subMetric={item.subMetric}
                icon={item.icon}
                tooltip={item.tooltip}
              />
            ))}
          </div>

          {/* Gráfico de Ingresos (Labels Verticales) */}
          <div className="mt-6 w-full">
            <FinanceChart data={financeData} accentColor={accentColor} />
          </div>

          {/* Gráfico de Barras */}
          <div className="mt-6 w-full">
            <PerformanceChart data={performanceData} mainColor={mainColor} secondaryColor={secondaryColor} />
          </div>

          {/* Listas Inferiores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <SubjectList title="Materias con mayor reprobación" data={subjectsData} barColor={mainColor} />
            <SubjectList title="Materias más pobladas" data={subjectsDataCant} barColor={secondaryColor} />
          </div>

        </div>
      </main>
    </div>
  );
}