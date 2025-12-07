"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KpiCard({ title, metric, subMetric, icon: Icon }) {
  return (
    <Card className="relative overflow-hidden shadow-sm border-zinc-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          {/* Número Principal (Grande y Azul) */}
          <span className="text-2xl font-bold text-[#0B0E31]">
            {metric}
          </span>
          
          {/* Porcentaje Secundario (Pequeño y Gris) */}
          {subMetric && (
            <span className="text-sm font-medium text-muted-foreground">
              {subMetric}
            </span>
          )}
        </div>
      </CardContent>
      {/* Decoración inferior */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B0E31] to-transparent opacity-10"></div>
    </Card>
  );
}