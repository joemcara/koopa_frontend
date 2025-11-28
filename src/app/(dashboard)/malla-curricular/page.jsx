import SubjectsView from "./SubjectsView";

// 👇 Simula la respuesta del backend
// En producción aquí harías: const res = await fetch("/api/materias");
const materiasFromBackend = [
  {
    id: 1,
    codigo: "MATG1045",
    nombre: "SISTEMAS OPERATIVOS",
    nivel: "NIVEL 300 I",
    color: "#22c55e",
    // datos para el gráfico
    rendimiento: [
      { periodo: "I PAO 2023", inscripciones: 72, reprobados: 18 },
      { periodo: "II PAO 2023", inscripciones: 70, reprobados: 22 },
      { periodo: "I PAO 2024", inscripciones: 85, reprobados: 20 },
      { periodo: "II PAO 2024", inscripciones: 78, reprobados: 14 },
      { periodo: "I PAO 2025", inscripciones: 88, reprobados: 30 },
      { periodo: "II PAO 2025", inscripciones: 65, reprobados: 35 },
    ],
    // datos para las tarjetas de abajo
    stats: {
      reprobados: 25,
      reprobadosPorcentaje: 0.2, // 20%
      aprobaronRequisitos: 27,
      habilitados: 30,
      descripcion:
        "Se estima que al cierre del II PAO 2025, 82 estudiantes se inscribirán en la materia de sistemas operativos en el PAO 2026.",
      notaPie: "Información del II PAO 2025",
    },
  },
  {
    id: 2,
    codigo: "MATG1045",
    nombre: "CÁLCULO I",
    nivel: "NIVEL 100 I",
    color: "#22c55e",
    rendimiento: [
      { periodo: "I PAO 2023", inscripciones: 90, reprobados: 30 },
      { periodo: "II PAO 2023", inscripciones: 95, reprobados: 28 },
      { periodo: "I PAO 2024", inscripciones: 92, reprobados: 25 },
      { periodo: "II PAO 2024", inscripciones: 88, reprobados: 20 },
      { periodo: "I PAO 2025", inscripciones: 94, reprobados: 22 },
      { periodo: "II PAO 2025", inscripciones: 91, reprobados: 21 },
    ],
    stats: {
      reprobados: 30,
      reprobadosPorcentaje: 0.25,
      aprobaronRequisitos: 40,
      habilitados: 35,
      descripcion: "Tendencia histórica de inscripciones y reprobación en Cálculo I.",
      notaPie: "Datos históricos 2023–2025",
    },
  },
  {
    id: 3,
    codigo: "MATG1045",
    nombre: "ÁLGEBRA LINEAL",
    nivel: "NIVEL 100 II",
    color: "#22c55e",
    rendimiento: [
      { periodo: "I PAO 2023", inscripciones: 60, reprobados: 15 },
      { periodo: "II PAO 2023", inscripciones: 62, reprobados: 14 },
      { periodo: "I PAO 2024", inscripciones: 65, reprobados: 13 },
      { periodo: "II PAO 2024", inscripciones: 67, reprobados: 11 },
      { periodo: "I PAO 2025", inscripciones: 70, reprobados: 10 },
      { periodo: "II PAO 2025", inscripciones: 72, reprobados: 9 },
    ],
    stats: {
      reprobados: 10,
      reprobadosPorcentaje: 0.14,
      aprobaronRequisitos: 50,
      habilitados: 45,
      descripcion: "Mejora progresiva en el rendimiento de Álgebra Lineal.",
      notaPie: "Información consolidada 2023–2025",
    },
  },
];


export default function MallaCurricular() {
  return (
    <div className=" justify-center bg-zinc-50 font-sans dark:bg-black">
      <main style={{ padding: "24px" }}>
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
                borderRadius: "999px",
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
      <div style={{ width: "100%" , height: "100%", marginTop: "32px" }}>

      <SubjectsView subjects={materiasFromBackend}/>
      </div>
    </main>
    </div>
  );
}
