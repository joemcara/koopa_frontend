// src/components/SubjectsView.jsx
"use client";

import { useState } from "react";
import SubjectCard from "@/components/ui/SubjectCard";
import SubjectStatsModal from "@/components/ui/SubjectStatsModal";

function groupByNivel(lista) {
  return lista.reduce((acc, materia) => {
    if (!acc[materia.nivel]) acc[materia.nivel] = [];
    acc[materia.nivel].push(materia);
    return acc;
  }, {});
}

function romanToInt(roman) {
  const map = { I: 1, II: 2, III: 3, IV: 4, V: 5 };
  return map[roman] ?? 0;
}

function parseNivel(nivelStr) {
  const match = nivelStr.match(/NIVEL\s+(\d+)\s+([IVX]+)/i);
  if (!match) return { numero: 0, subnivel: 0 };
  const numero = parseInt(match[1], 10);
  const subnivel = romanToInt(match[2]);
  return { numero, subnivel };
}

export default function SubjectsView({ subjects }) {
  const [selectedSubject, setSelectedSubject] = useState(null);

  // subjects viene DIRECTO del back con la forma del ejemplo de arriba
  const materiasPorNivel = groupByNivel(subjects);

  const nivelesOrdenados = Object.keys(materiasPorNivel).sort((a, b) => {
    const na = parseNivel(a);
    const nb = parseNivel(b);
    if (na.numero !== nb.numero) return na.numero - nb.numero;
    return na.subnivel - nb.subnivel;
  });

  return (
    <>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            minWidth: "900px",
          }}
        >

          {/* niveles + cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              paddingRight: "24px",
            }}
          >
            {nivelesOrdenados.map((nivel) => {
              const listaMaterias = materiasPorNivel[nivel];

              return (
                <div
                  key={nivel}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    minWidth: "max-content",
                  }}
                >
                  <div
                    style={{
                      width: "120px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      paddingTop: "20px",
                    }}
                  >
                    {nivel}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "nowrap",
                      gap: "16px",
                    }}
                  >
                    {listaMaterias.map((m) => (
                      <SubjectCard
                        key={m.id}
                        codigo={m.codigo}
                        nombre={m.nombre}
                        color={m.color}
                        nivel={m.nivel}
                        onClick={() => setSelectedSubject(m)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <SubjectStatsModal
        open={!!selectedSubject}
        onClose={() => setSelectedSubject(null)}
        subject={selectedSubject}
      />
    </>
  );
}
