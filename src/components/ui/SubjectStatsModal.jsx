// src/components/ui/SubjectStatsModal.jsx
"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StatItem({ label, value, color, subtext }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100">
      <span className="text-2xl font-bold" style={{ color: color || "#374151" }}>
        {value ?? "-"}
      </span>
      <span className="text-xs text-gray-500 uppercase mt-1 text-center font-medium">
        {label}
      </span>
      {subtext && <span className="text-[10px] text-gray-400 mt-1">{subtext}</span>}
    </div>
  );
}

export default function SubjectStatsModal({ open, onClose, subject }) {
  if (!open || !subject) return null;

  // LÓGICA DE TRANSFORMACIÓN DE DATOS (Interna en el Modal)
  const { datosGrafico, infoActual } = useMemo(() => {
    // Si no hay datos, retornamos vacíos
    if (!subject.stats || !subject.rendimiento) {
      return { datosGrafico: [], infoActual: {} };
    }

    // 1. Preparar datos para el Gráfico (Eje X con nombres reales)
    const datosProcesados = subject.rendimiento.map((r) => {
      const infoPeriodo = subject.stats[r.periodo];
      return {
        ...r,
        // Usamos la descripción (ej: "PAO 2025-2") o el periodo si no existe
        nombrePeriodo: infoPeriodo ? infoPeriodo.descripcion : r.periodo,
      };
    });

    // 2. Obtener el ÚLTIMO registro disponible para las tarjetas de abajo
    // Convertimos las llaves a números, las ordenamos y tomamos la última
    const periodosKeys = Object.keys(subject.stats).sort((a, b) => Number(a) - Number(b));
    const ultimoKey = periodosKeys[periodosKeys.length - 1];
    const ultimaInfo = subject.stats[ultimoKey] || {};

    return { datosGrafico: datosProcesados, infoActual: ultimaInfo };
  }, [subject]);

  // Calculamos aprobados estimados (Inscritos - Reprobados) ya que no hay campo 'aprobaronRequisitos'
  const aprobadosEstimados = infoActual.inscritos 
    ? infoActual.inscritos - infoActual.reprobados 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Contenedor Modal */}
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
              {subject.nombre}
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-1">
              CÓDIGO: {subject.codigo} • NIVEL {subject.nivel}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* BODY (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          <div className="flex flex-col gap-8">
            
            {/* GRÁFICO DE LÍNEAS */}
            <div className="h-[320px] w-full bg-white rounded-xl border border-gray-50 p-2 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datosGrafico} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" vertical={false} />
                  
                  <XAxis 
                    dataKey="nombrePeriodo" 
                    tick={{ fontSize: 10, fill: "#9ca3af" }} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                    interval="preserveStartEnd"
                  />
                  
                  <YAxis 
                    tick={{ fontSize: 11, fill: "#9ca3af" }} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: "12px", 
                      border: "none", 
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "12px"
                    }}
                    labelStyle={{ color: "#6b7280", marginBottom: "8px", fontSize: "12px", fontWeight: "600" }}
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="inscripciones" // JSON backend usa "inscripciones" en rendimiento
                    name="Inscripciones"
                    stroke="#111827" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: "#111827", strokeWidth: 0 }} 
                    activeDot={{ r: 6 }} 
                    animationDuration={1500}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reprobados" 
                    name="Reprobados"
                    stroke="#8b5cf6" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: "#8b5cf6", strokeWidth: 0 }} 
                    activeDot={{ r: 6 }} 
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Leyenda manual */}
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-gray-900"></span> Inscripciones
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-violet-500"></span> Reprobados
                </div>
              </div>
            </div>

            {/* TARJETAS DE ESTADÍSTICAS (Datos del Último Registro) */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Estadísticas Actuales ({infoActual.descripcion || "Último Periodo"})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatItem 
                  label="Reprobados" 
                  value={infoActual.reprobados} 
                  color="#ef4444" 
                  subtext={`${infoActual.reprobadosPorcentaje}% Tasa de Reprobación`}
                />
                
                {/* Como "Aprobaron Requisitos" no existe en el JSON, 
                   calculamos Aprobados = Inscritos - Reprobados 
                   o mostramos "N/A" si prefieres.
                */}
                <StatItem 
                  label="Aprobaron requisitos" 
                  value={aprobadosEstimados} 
                  color="#22c55e" 
                  subtext="Cálculo: Inscritos - Reprobados"
                />

                <StatItem 
                  label="Habilitados" 
                  value={infoActual.habilitados} 
                  color="#3b82f6" 
                  subtext="Para siguiente nivel"
                />
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full shadow-lg hover:bg-black hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Cerrar Detalles
          </button>
        </div>

      </div>
    </div>
  );
}