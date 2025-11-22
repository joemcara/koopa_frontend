// src/components/SubjectsView.jsx

import SubjectCard from "@/components/ui/SubjectCard";

const materias = [
  // NIVEL 100 I
  { codigo: "MATG1045", nombre: "CÁLCULO I", color: "#22c55e", nivel: "NIVEL 100 I" },
  { codigo: "MATG1045", nombre: "FÍSICA: MECÁNICA", color: "#22c55e", nivel: "NIVEL 100 I" },
  { codigo: "MATG1045", nombre: "ANÁLISIS Y RESOLUCIÓN DE PROBLEMAS", color: "#f97373", nivel: "NIVEL 100 I" },
  { codigo: "MATG1045", nombre: "FUNDAMENTOS DE PROGRAMACIÓN", color: "#f97373", nivel: "NIVEL 100 I" },

  // NIVEL 100 II
  { codigo: "MATG1045", nombre: "ÁLGEBRA LINEAL", color: "#22c55e", nivel: "NIVEL 100 II" },
  { codigo: "MATG1045", nombre: "CÁLCULO VECTORIAL", color: "#22c55e", nivel: "NIVEL 100 II" },
  { codigo: "MATG1045", nombre: "CÁLCULO VECTORIAL2", color: "#22c55e", nivel: "NIVEL 100 II" },
  { codigo: "MATG1045", nombre: "ÁLGEBRA LINEAL", color: "#22c55e", nivel: "NIVEL 100 II" },
  { codigo: "MATG1045", nombre: "CÁLCULO VECTORIAL", color: "#22c55e", nivel: "NIVEL 100 II" },
  { codigo: "MATG1045", nombre: "CÁLCULO VECTORIAL2", color: "#22c55e", nivel: "NIVEL 100 II" },

    { codigo: "MATG1045", nombre: "ÁLGEBRA LIN2EAL", color: "#22c55e", nivel: "NIVEL 200 I" },
  { codigo: "MATG1045", nombre: "CÁLCULO VECTO23RIAL", color: "#22c55e", nivel: "NIVEL 200 I" },
  { codigo: "MATG1045", nombre: "CÁLCULO VECT1ORIAL2", color: "#22c55e", nivel: "NIVEL 200 I" },

  // NIVEL 200 II (solo a modo de ejemplo)
  { codigo: "MATG1045", nombre: "ÁLGEBRA LINEAL", color: "#22c55e", nivel: "NIVEL 200 II" },
  { codigo: "MATG1045", nombre: "CÁLCULO VECTORIAL", color: "#22c55e", nivel: "NIVEL 200 II" },
  { codigo: "MATG1045", nombre: "CÁLCULO VECTORIAL2", color: "#22c55e", nivel: "NIVEL 200 II" },
];

function groupByNivel(lista) {
  return lista.reduce((acc, materia) => {
    if (!acc[materia.nivel]) acc[materia.nivel] = [];
    acc[materia.nivel].push(materia);
    return acc;
  }, {});
}

// Convierte números romanos (I, II, III...) a número
function romanToInt(roman) {
  const map = { I: 1, II: 2, III: 3, IV: 4, V: 5 };
  return map[roman] ?? 0;
}

// Extrae { numero: 100, subnivel: 1 } de "NIVEL 100 I"
function parseNivel(nivelStr) {
  const match = nivelStr.match(/NIVEL\s+(\d+)\s+([IVX]+)/i);
  if (!match) return { numero: 0, subnivel: 0 };
  const numero = parseInt(match[1], 10);
  const subnivel = romanToInt(match[2]);
  return { numero, subnivel };
}

export default function SubjectsView() {
  const materiasPorNivel = groupByNivel(materias);

  // 🔥 Ordenamos los niveles: 100 I, 100 II, 200 I, 200 II, etc.
  const nivelesOrdenados = Object.keys(materiasPorNivel).sort((a, b) => {
    const na = parseNivel(a);
    const nb = parseNivel(b);

    if (na.numero !== nb.numero) {
      return na.numero - nb.numero; // 100, 200, 300...
    }
    return na.subnivel - nb.subnivel; // I, II, III...
  });

  return (
    // Scroll horizontal para TODO el componente
    <div style={{ width: "100%", overflowX: "auto" }}>
      {/* Contenedor interno, ancho = contenido */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          minWidth: "900px",
        }}
      >
        {/* Filtros superiores */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "nowrap",
            marginTop: "32px",
            paddingRight: "24px",
          }}
        >
          <select
            style={{
              padding: "10px 12px",
              borderRadius: "100px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              fontSize: "13px",
              minWidth: "220px",
              outline: "none",
            }}
          >
            <option>Seleccionar carrera</option>
            <option>Computación</option>
            <option>Telemática</option>
          </select>

          <div
            style={{
              position: "relative",
              flex: "0 0 400px",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "14px",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Materia"
              style={{
                width: "100%",
                padding: "9px 12px 9px 32px",
                borderRadius: "999px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Bloques por nivel */}
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
                {/* Columna izquierda: texto del nivel */}
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

                {/* Columna derecha: cartas en una sola fila */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "nowrap",
                    gap: "16px",
                  }}
                >
                  {listaMaterias.map((m) => (
                    <SubjectCard
                      key={`${m.codigo}-${m.nombre}-${nivel}`}
                      codigo={m.codigo}
                      nombre={m.nombre}
                      color={m.color}
                      nivel={m.nivel}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
