"use client";

import { useState } from "react";
import SubjectCard from "@/components/ui/SubjectCard";
import SubjectStatsModal from "@/components/ui/SubjectStatsModal";

function groupByNivel(listaMaterias) {
  let lista = listaMaterias.filter(m => m.nombre !== "N/A" && m.nivel !== "N/A");
  return lista.reduce((acc, materia) => {
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

function parseNivel(nivelStr) {
  const match = nivelStr.match(/^(\d+)([A-Z]*)/i);
  if (!match) return { numero: 9999, subnivel: 0 };
  const numero = parseInt(match[1], 10);
  const subnivel = romanToInt(match[2]); 
  return { numero, subnivel };
}

// Función auxiliar para obtener inscritos del último periodo
function getUltimosInscritos(stats) {
  if (!stats) return 0;
  
  // Obtenemos las llaves ("1", "2", "12") y ordenamos numéricamente
  const periodos = Object.keys(stats).sort((a, b) => Number(a) - Number(b));
  
  if (periodos.length === 0) return 0;
  
  // Tomamos la última llave (ej: "12")
  const ultimoPeriodo = periodos[periodos.length - 1];
  
  // Retornamos los inscritos de ese periodo
  return stats[ultimoPeriodo]?.inscritos || 0;
}

export default function SubjectsView({ subjects }) {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const materiasPorNivel = groupByNivel(subjects);

  const nivelesOrdenados = Object.keys(materiasPorNivel).sort((a, b) => {
    const na = parseNivel(a);
    const nb = parseNivel(b);
  
    if (na.numero !== nb.numero) return na.numero - nb.numero;
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
                  <div style={{ width: "100px", fontSize: "12px", fontWeight: 700, color: "#6b7280", paddingTop: "20px", textAlign: "right", paddingRight: "10px" }}>
                    NIVEL {nivel}
                  </div>

                  <div style={{ display: "flex", flexWrap: "nowrap", gap: "16px" }}>
                    {listaMaterias.map((m) => {
                      
                      // CALCULAMOS EL VALOR AQUÍ
                      const inscritosActuales = getUltimosInscritos(m.stats);

                      return (
                        <SubjectCard
                          key={m.id}
                          // Si SubjectCard espera "codigo" para mostrar el ID visualmente,
                          // puedes reemplazarlo aquí o pasar una prop nueva.
                          // En este caso, paso 'inscritos' como prop explícita.
                          codigo={inscritosActuales} 
                          nombre={m.nombre}
                          color={m.color}
                          nivel={m.nivel}
                          
                          // 👇 PASAMOS EL DATO CALCULADO
                          inscritos={inscritosActuales}
                          
                          onClick={() => setSelectedSubject(m)}
                        />
                      );
                    })}
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