"use client";

import { useEffect, useState } from "react";
import SubjectsView from "./SubjectsView";
import { BookOpen, Search } from "lucide-react";

export default function MallaCurricular() {
  const [subjects, setSubjects] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // INICIALIZACIÓN: Asegúrate de que este ID inicial exista en tu BD
  const [selectedCareerId, setSelectedCareerId] = useState("2"); 
  const [searchTerm, setSearchTerm] = useState("");

  // 1. FETCH DE CARRERAS
  const fetchCarreras = async () => {
    try {
      const BASE_URL = "http://localhost:8080"; 
      const response = await fetch(`${BASE_URL}/api/carreras`);
      const data = await response.json();
      console.log("🎓 Carreras cargadas:", data); // Mira esto en la consola (F12)
      setCareers(data);
    } catch (err) {
      console.error("❌ Error cargando carreras:", err);
    }
  };

  // 2. FETCH DE MATERIAS (Malla)
  const fetchMaterias = async () => {
    if (!selectedCareerId) return; // No hacer nada si no hay ID

    setLoading(true);
    setSubjects([]); // 🔥 IMPORTANTE: Limpiamos la malla anterior visualmente
    setError(null);

    try {
      const BASE_URL = "http://localhost:8080"; 
      const url = `${BASE_URL}/api/materias/malla-stats/${selectedCareerId}`;
      
      console.log(`📡 Fetching Malla para ID: ${selectedCareerId} -> URL: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Malla recibida (${data.length} materias):`, data);

      // Mapeo seguro de datos
      const mappedSubjects = data.map(m => ({
        id: m.id || m.Id || Math.random(),
        codigo: m.codigo || m.CodigoMateria || "S/C",
        nombre: m.nombre || m.NombreMateria || "Materia Sin Nombre",
        nivel: m.nivel || m.Nivel || "Nivel Desconocido",
        color: m.color || "#2563eb",
        rendimiento: m.rendimiento || [],
        stats: m.stats || { descripcion: "Sin datos", reprobados: 0 }
      }));

      setSubjects(mappedSubjects);

    } catch (err) {
      console.error("❌ Error en fetchMaterias:", err);
      setError("Error al cargar la malla.");
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial de carreras
  useEffect(() => {
    fetchCarreras();
  }, []);

  // 🔥 DETECTOR DE CAMBIOS: Se ejecuta cada vez que cambia selectedCareerId
  useEffect(() => {
    console.log("🔄 useEffect disparado por cambio de carrera a:", selectedCareerId);
    fetchMaterias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCareerId]);


  // Filtro de búsqueda local
  const filteredSubjects = subjects.filter((materia) =>
    (materia.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (materia.codigo?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Manejador del cambio en el Select
  const handleCareerChange = (e) => {
    const nuevoId = e.target.value;
    console.log("🖱️ Usuario seleccionó carrera ID:", nuevoId);
    setSelectedCareerId(nuevoId);
  };

  return (
    <div className="flex justify-center bg-zinc-50 font-sans min-h-screen">
      <main className="w-full max-w-7xl p-6 md:p-8">
        
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold text-[#0B0E31] flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            Malla Curricular
          </h1>
          <p className="text-muted-foreground">Visualización gráfica del plan de estudios.</p>
        </div>

        {/* CONTROLES */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
          
          {/* SELECTOR DE CARRERA */}
          <div className="w-full md:w-auto">
            <select
              value={selectedCareerId}
              onChange={handleCareerChange} // Usamos la función handleCareerChange
              disabled={loading}
              className="w-full md:w-64 appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {careers.length === 0 && <option value="2">Cargando carreras...</option>}
              
              {careers.map((c) => {
                // 🔥 AQUI ESTA LA CLAVE: Asegurarnos de usar el ID correcto
                // Verifica en tu consola si tus carreras tienen 'codCarrera', 'id' o 'Id'
                const idValue = c.codCarrera || c.id || c.Id; 
                const label = c.nombreCarrera || c.nombre || c.Nombre;
                
                return (
                  <option key={idValue} value={String(idValue)}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
          
          {/* BUSCADOR */}
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

        {/* AREA DE CONTENIDO */}
        <div className={`transition-opacity duration-300`}>
          
          {/* Spinner de Carga */}
          {loading && (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="text-sm text-zinc-500">Cargando malla...</p>
             </div>
          )}

          {/* Mensaje de Error */}
          {error && !loading && (
             <div className="text-center py-16 text-red-500 bg-red-50 rounded-xl border border-red-100">
                <p>{error}</p>
             </div>
          )}

          {/* Mensaje Vacío */}
          {!loading && !error && filteredSubjects.length === 0 && (
            <div className="text-center py-16 text-zinc-500">
               {searchTerm 
                 ? `No hay materias que coincidan con "${searchTerm}"` 
                 : "No se encontraron materias para esta carrera."}
            </div>
          )}

          {/* VISTA DE MATERIAS */}
          {!loading && !error && filteredSubjects.length > 0 && (
            <SubjectsView subjects={filteredSubjects} />
          )}
        </div>
      </main>
    </div>
  );
}