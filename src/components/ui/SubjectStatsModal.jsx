// src/components/ui/SubjectStatsModal.jsx
"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SubjectStatsModal({ open, onClose, subject }) {
  if (!open || !subject) return null;

  const { nombre, rendimiento, stats } = subject;

  const reprobadosPorcentajeTexto = stats?.reprobadosPorcentaje
    ? `${Math.round(stats.reprobadosPorcentaje * 100)}%`
    : "–";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-zinc-900">
            {nombre}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {stats?.descripcion}
          </p>
        </div>

        <div className="mb-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={rendimiento}
              margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="inscripciones"
                stroke="#1f2937"
                strokeWidth={2}
                dot={false}
                name="Inscripciones"
              />
              <Line
                type="monotone"
                dataKey="reprobados"
                stroke="#6d28d9"
                strokeWidth={2}
                dot={false}
                name="Reprobados"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-6 text-center sm:grid-cols-3">
          <div>
            <div className="text-3xl font-semibold text-indigo-900">
              {stats?.reprobados}
              <span className="ml-1 text-sm text-emerald-500">
                {reprobadosPorcentajeTexto}
              </span>
            </div>
            <div className="mt-1 text-sm text-zinc-500">Reprobados</div>
          </div>

          <div>
            <div className="text-3xl font-semibold text-indigo-900">
              {stats?.aprobaronRequisitos}
            </div>
            <div className="mt-1 text-sm text-zinc-500">
              Aprobaron requisitos
            </div>
          </div>

          <div>
            <div className="text-3xl font-semibold text-indigo-900">
              {stats?.habilitados}
            </div>
            <div className="mt-1 text-sm text-zinc-500">Habilitados</div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          {stats?.notaPie}
        </p>

        <button
          onClick={onClose}
          className="mt-6 block w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
