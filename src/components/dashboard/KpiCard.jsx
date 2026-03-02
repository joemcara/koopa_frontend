"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiInformationLine } from "@remixicon/react";

export default function KpiCard({ title, metric, subMetric, icon: Icon, tooltip }) {
  return (
    <Card className="relative overflow-visible shadow-sm border-zinc-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

        {/* Título + Tooltip Manual */}
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>

          {/* Lógica del Tooltip CSS puro */}
          {tooltip && (
            <div className="group relative flex items-center">
              {/* Ícono Trigger */}
              <RiInformationLine className="h-4 w-4 text-zinc-400 hover:text-zinc-600 cursor-help transition-colors" />

              {/* Contenido del Tooltip (Flotante) */}
              <div className="absolute bottom-full left-1/2 mb-2 w-max max-w-[200px] -translate-x-1/2 scale-0 transform rounded-lg bg-slate-800 px-3 py-2 text-xs text-white opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 z-50 shadow-xl pointer-events-none">
                {tooltip}
                {/* Flechita decorativa */}
                <div className="absolute top-full left-1/2 -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-800"></div>
              </div>
            </div>
          )}
        </div>

        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>

      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#0B0E31]">
            {metric}
          </span>
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