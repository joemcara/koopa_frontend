// src/components/ui/SubjectCard.jsx
"use client";

export default function SubjectCard({
  codigo,
  nombre,
  color,
  nivel,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full flex-col rounded-xl bg-white text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        borderTop: `4px solid ${color || "#22c55e"}`,
        width: "280px",
        maxWidth: "280px",
        flex: "0 0 280px",
        padding: "12px 14px",
      }}
    >
      <div className="mb-1 flex justify-between text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
        <span>{codigo}</span>
        {nivel && <span>{nivel}</span>}
      </div>
      <div className="text-[13px] font-semibold leading-snug text-zinc-900">
        {nombre}
      </div>
    </button>
  );
}
