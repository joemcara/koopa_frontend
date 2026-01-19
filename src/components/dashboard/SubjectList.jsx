"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubjectList({ title, data, barColor }) {
  // Calculamos el máximo local para que las barras sean proporcionales dentro de esta lista
  const maxVal = Math.max(...data.map(d => d.cantidad)) || 1;

  return (
    <Card className="shadow-sm border-zinc-200">
      <CardHeader>
        <CardTitle className="text-base text-[#0B0E31]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {data.map((m, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="w-32 truncate text-muted-foreground text-xs" title={m.name}>
                {m.name}
              </div>
              <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(m.cantidad / maxVal) * 100}%`,
                    backgroundColor: barColor 
                  }}
                ></div>
              </div>
              <div className="text-xs font-bold w-8 text-right">{m.cantidad}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}