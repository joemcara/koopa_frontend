// src/components/SubjectCard.jsx

export default function SubjectCard({ codigo, nombre, color, nivel }) {
  return (
<div
  style={{
    borderRadius: "12px",
    padding: "12px 14px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
    borderTop: `4px solid ${color || "#22c55e"}`,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "280px",
    maxWidth: "280px",
    flex: "0 0 280px",
  }}
>
      <div
        style={{
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#9ca3af",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{codigo}</span>
        {nivel && <span style={{ fontWeight: 500 }}>{nivel}</span>}
      </div>

      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#111827",
          lineHeight: 1.2,
        }}
      >
        {nombre}
      </div>
    </div>
  );
}
