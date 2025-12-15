"use client";

import { useState } from "react";
import SubjectCard from "@/components/ui/SubjectCard";
import SubjectStatsModal from "@/components/ui/SubjectStatsModal";

function groupByNivel(lista) {
  return lista.reduce((acc, materia) => {
    // Usamos el string tal cual viene del back como clave (ej: "100I")
    if (!acc[materia.nivel]) acc[materia.nivel] = [];
    acc[materia.nivel].push(materia);
    return acc;
  }, {});
}

function romanToInt(roman) {
  if (!roman) return 0;
  const map = { I: 1, II: 2, III: 3, IV: 4, V: 5 };
  return map[roman.toUpperCase()] ?? 0;
}

// ---------------------------------------------------------
// NUEVA LÓGICA DE PARSEO PARA "100I", "200II", etc.
// ---------------------------------------------------------
function parseNivel(nivelStr) {
  // Regex busca: Un numero al inicio (\d+) seguido opcionalmente de letras ([A-Z]*)
  const match = nivelStr.match(/^(\d+)([A-Z]*)/i);
  
  if (!match) return { numero: 9999, subnivel: 0 }; // Si falla, lo mandamos al final
  
  const numero = parseInt(match[1], 10);
  const subnivel = romanToInt(match[2]); 
  
  return { numero, subnivel };
}

export default function SubjectsView({ subjects }) {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const materiasPorNivel = groupByNivel(subjects);

  const nivelesOrdenados = Object.keys(materiasPorNivel).sort((a, b) => {
    const na = parseNivel(a);
    const nb = parseNivel(b);
    
    // Primero ordenamos por el número (100 vs 200)
    if (na.numero !== nb.numero) return na.numero - nb.numero;
    // Si son iguales, ordenamos por el subnivel romano (I vs II)
    return na.subnivel - nb.subnivel;
  });

  return (
    <>
      <div style={{ width: "100%", overflowX: "auto", paddingBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", minWidth: "900px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingRight: "24px" }}>
            {nivelesOrdenados.map((nivel) => {
              const listaMaterias = materiasPorNivel[nivel];

              return (
                <div key={nivel} style={{ display: "flex", alignItems: "flex-start", gap: "16px", minWidth: "max-content" }}>
                  {/* Etiqueta lateral del Nivel */}
                  <div style={{ width: "100px", fontSize: "12px", fontWeight: 700, color: "#6b7280", paddingTop: "20px", textAlign: "right", paddingRight: "10px" }}>
                    NIVEL {nivel}
                  </div>

                  <div style={{ display: "flex", flexWrap: "nowrap", gap: "16px" }}>
                    {listaMaterias.map((m) => (
                      <SubjectCard
                        key={m.id}
                        codigo={m.codigo}
                        nombre={m.nombre}
                        color={m.color}
                        nivel={m.nivel}
                        // Nota: Asegúrate de que SubjectCard sepa manejar las props que le mandas.
                        // Si SubjectCard usa 'stats' para mostrar algo resumen, usa 'statsResumen' que creamos arriba
                        // o ajusta SubjectCard para leer el nuevo formato.
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