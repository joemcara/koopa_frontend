"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FinanceChart({ data, accentColor }) {
  return (
    <Card className="shadow-sm border-zinc-200">
      <CardHeader>
        <CardTitle className="text-lg text-[#0B0E31]">Evolución de Ingresos</CardTitle>
        <CardDescription>Estudiantes ingresados por admisiones y cambio de carrera</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Aumenté un poco la altura del contenedor para dar espacio al eje X */}
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {/* Aumenté el margin bottom a 60 para que no se corten los textos */}
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              
              <XAxis
                dataKey="periodo"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#666" }}
                tickMargin={10}
                
                // --- CLAVES PARA QUE SE VEAN ---
                angle={0}       // Rota el texto vertical
                textAnchor="end"  // Alinea el final del texto con la rayita
                height={80}       // <--- IMPORTANTE: Altura reservada para el eje X
                interval={0}      // <--- IMPORTANTE: Fuerza a mostrar TODOS los labels
              />
              
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={(val) => val}
              />
              
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                cursor={false}
                formatter={(val) => [val, "Cantidad"]}
              />
              
              <Area
                type="monotone"
                dataKey="valor"
                stroke={accentColor}
                fillOpacity={1}
                fill="url(#colorIngresos)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}