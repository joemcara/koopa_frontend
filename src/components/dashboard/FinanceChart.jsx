"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FinanceChart({ data, accentColor }) {
  return (
    <Card className="shadow-sm border-zinc-200">
      <CardHeader>
        <CardTitle className="text-lg text-[#0B0E31]">Evolución de Ingresos</CardTitle>
        <CardDescription>Tendencia financiera semestral</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 35, bottom: 20 }}>
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
                tick={{ fontSize: 12, fill: "#666" }}
                tickMargin={10}
                padding={{ left: 0, right: 0 }}
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