"use client";

import { useEffect, useState } from "react";

// 1. COMPONENTES DE SHADCN
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 2. RECHARTS
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 3. ICONOS
import {
  RiUserLine,
  RiShieldCheckLine,
  RiGraduationCapLine,
  RiTrophyLine,
  RiLoader4Line // Agregué un icono de carga opcional
} from "@remixicon/react";

// --- COMPONENTE: GRÁFICO DE BARRAS NATIVO ---
const NativeBarChart = ({ data, colorAprobado, colorReprobado }) => {
  const maxValue = Math.max(...data.map((d) => d.Aprobado + d.Reprobado)) || 1; // Evitar división por 0

  return (
    <div className="w-full flex flex-col gap-4 mt-2">
      <div className="flex justify-end gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorReprobado }}></span>
          Reprobado
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorAprobado }}></span>
          Aprobado
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {data.map((item, index) => {
          const pctReprobado = (item.Reprobado / maxValue) * 100;
          const pctAprobado = (item.Aprobado / maxValue) * 100;

          return (
            <div key={index} className="grid grid-cols-[100px_1fr] items-center gap-4 text-sm">
              <span className="text-muted-foreground font-medium truncate text-xs" title={item.name}>
                {item.name}
              </span>
              <div className="h-6 flex w-full bg-secondary/30 rounded-sm overflow-hidden">
                <div
                  style={{ width: `${pctReprobado}%`, backgroundColor: colorReprobado }}
                  className="h-full flex items-center justify-center"
                  title={`Reprobado: ${item.Reprobado}`}
                />
                <div
                  style={{ width: `${pctAprobado}%`, backgroundColor: colorAprobado }}
                  className="h-full flex items-center justify-center"
                  title={`Aprobado: ${item.Aprobado}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
export default function Home() {
  const mainColor = "#0B0E31";
  const secondaryColor = "#2563eb";
  const accentColor = "#6366f1";

  // DATOS ESTÁTICOS DE LISTAS
  const careersList = [
    { id: 1, name: "Ciencia de Datos e Inteligencia Artificial" },
    { id: 2, name: "Computación" },
    { id: 3, name: "Electricidad" },
    { id: 4, name: "Electrónica y Automatización" },
    { id: 5, name: "Telecomunicaciones" },
    { id: 6, name: "Telemática" },
  ];

  const periodsList = [
    { value: "2025-1S", label: "2025 - I" },
    { value: "2024-2S", label: "2024 - II" },
    { value: "2024-1S", label: "2024 - I" },
    { value: "2023-2S", label: "2023 - II" },
  ];

  // 🔥 CAMBIO 1: DEFAULTS CORREGIDOS
  // Inicializamos en "2" (Computación) y "2025-1S"
  const [selectedCareerId, setSelectedCareerId] = useState("2");
  const [selectedPeriod, setSelectedPeriod] = useState("2025-1S");
  const [isLoading, setIsLoading] = useState(false); // Estado para feedback visual de carga

  // ESTADOS DE DATOS (Se actualizarán al conectar backend)
  const [kpis, setKpis] = useState([
    { title: "Estudiantes", metric: "1,240", icon: RiUserLine },
    { title: "Tasa de reprobación", metric: "15%", icon: RiShieldCheckLine },
    { title: "Tasa de graduados", metric: "42%", icon: RiGraduationCapLine },
    { title: "Promedio de carrera", metric: "7.8", icon: RiTrophyLine },
  ]);

  const [performanceData, setPerformanceData] = useState([
    { name: "Computación", Aprobado: 36, Reprobado: 15 },
    { name: "Telecomunicaciones", Aprobado: 28, Reprobado: 15 },
    { name: "Telemática", Aprobado: 12, Reprobado: 25 },
    { name: "Electricidad", Aprobado: 40, Reprobado: 10 },
    { name: "Automatización", Aprobado: 32, Reprobado: 18 },
    { name: "Ciencia de Datos", Aprobado: 20, Reprobado: 5 },
  ]);

  const [financeData, setFinanceData] = useState([
    { periodo: "2023-I", valor: 400 },
    { periodo: "2023-II", valor: 180 },
    { periodo: "2024-I", valor: 650 },
    { periodo: "2024-II", valor: 700 },
    { periodo: "2025-I", valor: 1500 },
  ]);

  const [subjectsData, setSubjectsData] = useState([
    { name: "Fund. Programación", cantidad: 387 },
    { name: "Cálculo 1 Var.", cantidad: 349 },
    { name: "Álgebra Lineal", cantidad: 250 },
    { name: "Física Mecánica", cantidad: 180 },
    { name: "Estadística", cantidad: 120 },
  ]);

  const [subjectsDataCant, setSubjectsDataCant] = useState([
    { name: "Fund. Programación", cantidad: 387 },
    { name: "Cálculo 1 Var.", cantidad: 349 },
    { name: "Álgebra Lineal", cantidad: 250 },
    { name: "Física Mecánica", cantidad: 180 },
    { name: "Estadística", cantidad: 120 },
  ]);


  // 🔥 FUNCIÓN DE FETCH (Simulada para backend)
const fetchData = async () => {
    setIsLoading(true);

    // 1. Preparamos los parámetros
    // El frontend tiene "2025-1S", el backend quiere anio="2025" y termino="1S"
    const [anio, termino] = selectedPeriod.split("-");

    try {
      // 2. Construimos la URL
      // Nota: Usamos 'codCarrera' porque así lo pide tu Swagger
      const url = `http://localhost:8080/api/metricas/dashboard?anio=${anio}&termino=${termino}&codCarrera=${selectedCareerId}`;
      
      console.log("📡 Fetching:", url);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Respuesta Backend:", data);

      // --- 3. TRANSFORMACIÓN DE DATOS (Mapping) ---

      setKpis([
        { 
          title: "Estudiantes", 
          metric: data.cant_estudiantes?.toLocaleString() || "0", 
          icon: RiUserLine 
        },
        { 
          title: "Tasa de reprobación", 
          metric: `${data.tasa_reprobacion || 0}%`, 
          icon: RiShieldCheckLine 
        },
        { 
          title: "Tasa de graduados", 
          metric: `${data.tasa_graduados || 0}%`, 
          icon: RiGraduationCapLine 
        },
        { 
          title: "Promedio de carrera", 
          metric: data.promedio_carrera?.toFixed(2) || "0.00", 
          icon: RiTrophyLine 
        },
      ]);

      let cantidad_ingresos = data.evolucion_ingresos.cantidad_ingresos || [];
      let periodos = data.evolucion_ingresos.periodos || [];
      setFinanceData(
              periodos.map((p, index) => ({
                periodo: p,
                valor: cantidad_ingresos[index] || 0 // Usamos el índice para buscar el valor correspondiente
              }))
      );
      
        setSubjectsData(
          (data.materias_mayor_reprobacion || []).map((m) => ({
            name: m.nombre_materia || "Desconocido",
            cantidad: m.reprobados ?? 0,
          }))
        );
        setSubjectsDataCant(
          (data.materias_mas_pobladas || []).map((m) => ({
            name: m.nombreMateria || "Desconocido",
            cantidad: m.cantidadInscritos ?? 0,
          }))
        );
        setPerformanceData(
          (data.rendimiento_carrera || []).map((r) => ({
            name: r.nombre_carrera || "Desconocido",
            Aprobado: r.aprobados ?? 0,
            Reprobado: r.reprobados ?? 0,
          }))
        );
      


    } catch (error) {
      console.error("❌ Error conectando al backend:", error);
      // Aquí podrías poner un Toast de error si quieres
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
            {/* SELECT CARRERA (Controlado por selectedCareerId) */}
            <Select 
                value={selectedCareerId} 
                onValueChange={(val) => setSelectedCareerId(val)}
            >
              <SelectTrigger className="w-[240px] bg-white">
                <SelectValue placeholder="Seleccionar carrera" />
              </SelectTrigger>
              <SelectContent>
                {careersList.map((carrera) => (
                    <SelectItem key={carrera.id} value={String(carrera.id)}>
                        {carrera.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* SELECT PERIODO (Controlado por selectedPeriod) */}
            <Select 
                value={selectedPeriod} 
                onValueChange={(val) => setSelectedPeriod(val)}
            >
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                {periodsList.map((periodo) => (
                    <SelectItem key={periodo.value} value={periodo.value}>
                        {periodo.label}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL (Con opacidad si está cargando) */}
        <div className={`transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
            
            {/* KPIS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((item) => (
                <Card key={item.title} className="relative overflow-hidden shadow-sm border-zinc-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {item.title}
                    </CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold text-[#0B0E31]">{item.metric}</div>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B0E31] to-transparent opacity-10"></div>
                </Card>
            ))}
            </div>

            {/* GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card className="shadow-sm border-zinc-200">
                    <CardHeader>
                    <CardTitle className="text-lg text-[#0B0E31]">Rendimiento por Carrera</CardTitle>
                    <CardDescription>Aprobados vs Reprobados</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <NativeBarChart 
                        data={performanceData} 
                        colorReprobado={mainColor} 
                        colorAprobado={secondaryColor} 
                    />
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-zinc-200">
                    <CardHeader>
                    <CardTitle className="text-lg text-[#0B0E31]">Evolución de Ingresos</CardTitle>
                    <CardDescription>Tendencia financiera semestral</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={financeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                            <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={accentColor} stopOpacity={0.2}/>
                                <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                            </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="periodo" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} tickMargin={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} tickFormatter={(val) => `$${val}`} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={false} />
                            <Area type="monotone" dataKey="valor" stroke={accentColor} fillOpacity={1} fill="url(#colorIngresos)" strokeWidth={2} isAnimationActive={false} />
                        </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    </CardContent>
                </Card>
            </div>

            {/* MATERIAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card className="shadow-sm border-zinc-200">
                    <CardHeader>
                        <CardTitle className="text-base text-[#0B0E31]">Materias con mayor reprobación</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {subjectsData.map((m, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <div className="w-32 truncate text-muted-foreground text-xs">{m.name}</div>
                                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0B0E31] rounded-full" style={{ width: `${(m.cantidad / 400) * 100}%` }}></div>
                                    </div>
                                    <div className="text-xs font-bold w-8 text-right">{m.cantidad}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-zinc-200">
                    <CardHeader>
                        <CardTitle className="text-base text-[#0B0E31]">Materias más pobladas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {subjectsDataCant.map((m, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <div className="w-32 truncate text-muted-foreground text-xs">{m.name}</div>
                                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(m.cantidad / 400) * 100}%` }}></div>
                                    </div>
                                    <div className="text-xs font-bold w-8 text-right">{m.cantidad}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>

      </main>
    </div>
  );
}