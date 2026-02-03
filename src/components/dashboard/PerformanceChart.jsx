"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerformanceChart({ data, mainColor, secondaryColor }) {

  // --- FILTRO: Excluir la categoría "OTROS" ---
  // Esto evitará que la barra gigante distorsione la escala de las demás carreras
  const filteredData = data.filter((item) => item.name !== "OTROS");

  // Tooltip interno del componente
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const reprobado = payload.find((p) => p.dataKey === "Reprobado")?.value || 0;
      const aprobado = payload.find((p) => p.dataKey === "Aprobado")?.value || 0;
      const total = reprobado + aprobado;

      return (
        <div className="bg-white border border-zinc-200 p-3 rounded-lg shadow-lg text-xs">
          <p className="font-bold mb-2 text-[#0B0E31]">{label}</p>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mainColor }}></span>
            <span className="text-muted-foreground">Reprobado:</span>
            <span className="font-medium ml-auto">{reprobado}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }}></span>
            <span className="text-muted-foreground">Aprobado:</span>
            <span className="font-medium ml-auto">{aprobado}</span>
          </div>
          <div className="border-t pt-2 mt-1 flex justify-between font-bold text-[#0B0E31]">
            <span>Total:</span>
            <span>{total}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-sm border-zinc-200">
      <CardHeader>
        <CardTitle className="text-lg text-[#0B0E31]">Rendimiento por Carrera</CardTitle>
        <CardDescription>Aprobados vs Reprobados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={filteredData} // Usamos la data filtrada aquí
              margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 11, fill: "#666" }}
                interval={0}
              />
              <XAxis type="number" hide />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "transparent" }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar dataKey="Reprobado" stackId="a" fill={mainColor} radius={[4, 0, 0, 4]} barSize={20} />
              <Bar dataKey="Aprobado" stackId="a" fill={secondaryColor} radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}