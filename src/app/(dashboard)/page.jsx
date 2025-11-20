"use client";

import { useState } from "react";

// 1. COMPONENTES DE SHADCN (Asegúrate de haber hecho el 'npx add ...')
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

// 2. RECHARTS (Para líneas y áreas complejas)
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
} from "@remixicon/react";

// --- COMPONENTE: GRÁFICO DE BARRAS NATIVO (ULTRA RÁPIDO) ---
// Este componente usa CSS puro para evitar el 'retraso' de animación de las librerías
const NativeBarChart = ({ data, colorAprobado, colorReprobado }) => {
  const maxValue = Math.max(...data.map((d) => d.Aprobado + d.Reprobado));

  return (
    <div className="w-full flex flex-col gap-4 mt-2">
      {/* Leyenda */}
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

      {/* Barras */}
      <div className="flex flex-col gap-3">
        {data.map((item, index) => {
          const pctReprobado = (item.Reprobado / maxValue) * 100;
          const pctAprobado = (item.Aprobado / maxValue) * 100;

          return (
            <div key={index} className="grid grid-cols-[100px_1fr] items-center gap-4 text-sm">
              {/* Nombre Carrera */}
              <span className="text-muted-foreground font-medium truncate text-xs" title={item.name}>
                {item.name}
              </span>

              {/* Barra contenedora */}
              <div className="h-6 flex w-full bg-secondary/30 rounded-sm overflow-hidden">
                {/* Reprobado */}
                <div
                  style={{ width: `${pctReprobado}%`, backgroundColor: colorReprobado }}
                  className="h-full flex items-center justify-center"
                  title={`Reprobado: ${item.Reprobado}`}
                />
                {/* Aprobado */}
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
  // Colores del Tema Koopa
  const mainColor = "#0B0E31";      // Azul Oscuro
  const secondaryColor = "#2563eb"; // Azul Brillante (Tailwind Blue-600)
  const accentColor = "#6366f1";    // Indigo

  // --- ESTADOS Y DATOS ---
  const [kpis] = useState([
    { title: "Estudiantes", metric: "1,732", icon: RiUserLine },
    { title: "Tasa de reprobación", metric: "30%", icon: RiShieldCheckLine },
    { title: "Tasa de graduados", metric: "48%", icon: RiGraduationCapLine },
    { title: "Promedio de carrera", metric: "7.45", icon: RiTrophyLine },
  ]);

  const [performanceData] = useState([
    { name: "Computación", Aprobado: 36, Reprobado: 15 },
    { name: "Telecomunicaciones", Aprobado: 28, Reprobado: 15 },
    { name: "Telemática", Aprobado: 12, Reprobado: 25 },
    { name: "Electricidad", Aprobado: 40, Reprobado: 10 },
    { name: "Automatización", Aprobado: 32, Reprobado: 18 },
    { name: "Ciencia de Datos", Aprobado: 20, Reprobado: 5 },
  ]);

  const [financeData] = useState([
    { periodo: "2023-I", valor: 400 },
    { periodo: "2023-II", valor: 180 },
    { periodo: "2024-I", valor: 650 },
    { periodo: "2024-II", valor: 700 },
    { periodo: "2025-I", valor: 1500 },
  ]);

  const [subjectsData] = useState([
    { name: "Fund. Programación", cantidad: 387 },
    { name: "Cálculo 1 Var.", cantidad: 349 },
    { name: "Álgebra Lineal", cantidad: 250 },
    { name: "Física Mecánica", cantidad: 180 },
    { name: "Estadística", cantidad: 120 },
  ]);

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50/50 font-sans">
      <main className="flex w-full max-w-7xl flex-col gap-6 p-6 md:p-8">
        
        {/* 1. HEADER / FILTROS (Usando Select de Shadcn) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center mb-2">
          <div>
             <h2 className="text-2xl font-bold tracking-tight text-[#0B0E31]">Dashboard Académico</h2>
             <p className="text-muted-foreground text-sm">Resumen general del periodo actual.</p>
          </div>
          
          <div className="flex gap-3">
            <Select>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Seleccionar carrera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compu">Computación</SelectItem>
                <SelectItem value="tele">Telecomunicaciones</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="2025-1">
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-1">2025 - I</SelectItem>
                <SelectItem value="2024-2">2024 - II</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 2. KPIS */}
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
              {/* Decoración inferior */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B0E31] to-transparent opacity-10"></div>
            </Card>
          ))}
        </div>

        {/* 3. GRÁFICOS PRINCIPALES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* A. RENDIMIENTO (Nativo - Rápido) */}
          <Card className="shadow-sm border-zinc-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#0B0E31]">Rendimiento por Carrera</CardTitle>
              <CardDescription>Aprobados vs Reprobados en el ciclo actual</CardDescription>
            </CardHeader>
            <CardContent>
              <NativeBarChart 
                data={performanceData} 
                colorReprobado={mainColor} 
                colorAprobado={secondaryColor} 
              />
            </CardContent>
          </Card>

          {/* B. INGRESOS (Recharts - Área) */}
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
                    <XAxis 
                      dataKey="periodo" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#666'}} 
                      tickMargin={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#666'}} 
                      tickFormatter={(val) => `$${val}`} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={false}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="valor" 
                      stroke={accentColor} 
                      fillOpacity={1} 
                      fill="url(#colorIngresos)" 
                      strokeWidth={2} 
                      isAnimationActive={false} // Desactivado para velocidad
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* 4. TOP MATERIAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <Card className="shadow-sm border-zinc-200">
            <CardHeader>
              <CardTitle className="text-base text-[#0B0E31]">Materias con mayor reprobación</CardTitle>
            </CardHeader>
            <CardContent>
               {/* Reusamos el gráfico nativo pero solo con un color simulado */}
               <div className="flex flex-col gap-3">
                  {subjectsData.map((m, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-32 truncate text-muted-foreground text-xs">{m.name}</div>
                        <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                           <div 
                            className="h-full bg-[#0B0E31] rounded-full" 
                            style={{ width: `${(m.cantidad / 400) * 100}%` }}
                           ></div>
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
                  {subjectsData.map((m, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-32 truncate text-muted-foreground text-xs">{m.name}</div>
                        <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                           <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${(m.cantidad / 400) * 100}%` }}
                           ></div>
                        </div>
                        <div className="text-xs font-bold w-8 text-right">{m.cantidad}</div>
                     </div>
                  ))}
               </div>
            </CardContent>
           </Card>
        </div>

      </main>
    </div>
  );
}