"use client";

import { useEffect, useState } from "react";
import SubjectsView from "./SubjectsView";
import { BookOpen, Search } from "lucide-react";

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
  const [subjects, setSubjects] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCareerId, setSelectedCareerId] = useState("2");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMaterias = async () => {
    setLoading(true);
    setError(null);
    try {
      const BASE_URL = "http://localhost:8080"; 
      const url = `${BASE_URL}/api/materias/malla-stats/${selectedCareerId}`;
      console.log("📡 Cargando malla:", url);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      console.error("❌ Error:", err);
      setError("No se pudo cargar la malla. Verifica la conexión.");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCarreras = async () => {
    setLoading(true);
    setError(null);
    try {
      const BASE_URL = "http://localhost:8080"; 
      const url = `${BASE_URL}/api/carreras`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setCareers(data);
    } catch (err) {
      console.error("❌ Error:", err);
      setError("No se pudo cargar la malla. Verifica la conexión.");
      setCareers([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCarreras();
  }, []);

  useEffect(() => {
    fetchMaterias();
  }, [selectedCareerId]);


  // USEe

  // const filteredSubjects = subjects.filter((materia) =>
  //   materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // useEffect(() => {
  //   const filteredSubjects = subjects.filter((materia) =>
  //   materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  // }, [selectedCareerId]);

  return (
    <div className="flex justify-center bg-zinc-50 font-sans min-h-screen">
      <main className="w-full max-w-7xl p-6 md:p-8">
        
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold text-[#0B0E31] flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            Malla Curricular
          </h1>
          <p className="text-muted-foreground">
            Visualización gráfica del plan de estudios.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="w-full md:w-auto">
            <select
              value={selectedCareerId}
              onChange={(e) => setSelectedCareerId(e.target.value)}
              disabled={loading}
              className="w-full md:w-64 appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              { careers.map((c) => (
                <option key={`${c.nombreCarrera}${c.codCarrera}`} value={c.codCarrera}>{c.nombreCarrera}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:flex-1 md:max-w-md relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar materia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
          </div>
        </div>

        <div className={`transition-opacity duration-300 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
          {loading && subjects.length === 0 && (
             <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
          )}

          {!loading && subjects.length === 0 && !error && (
            <div className="text-center py-16 text-zinc-500">No se encontraron materias.</div>
          )}

          {subjects.length > 0 && (
            <SubjectsView subjects={subjects} />
          )}
        </div>
      </main>
    </div>
  );
}