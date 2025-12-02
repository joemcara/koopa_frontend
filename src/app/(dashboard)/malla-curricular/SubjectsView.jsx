'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import '@xyflow/react/dist/style.css';

// --- 1. DATOS SIMULADOS (ESTRUCTURA MANTENIDA) ---
const materiasFromBackend = [
  // --- NIVEL 100 (SEMESTRE 1) ---
  {
    id: 'matg1045',
    codigo: "MATG1045",
    nombre: "CÁLCULO DE UNA VARIABLE",
    nivel: "NIVEL 1",
    estado: "aprobado",
    prerequisitos: [],
    stats: { reprobados: 30, descripcion: "Fundamentos de cálculo diferencial e integral." },
    rendimiento: [{ periodo: "2024", inscripciones: 90, reprobados: 30 }]
  },
  {
    id: 'fisg1005',
    codigo: "FISG1005",
    nombre: "FÍSICA: MECÁNICA",
    nivel: "NIVEL 1",
    estado: "aprobado",
    prerequisitos: [],
    stats: { reprobados: 25, descripcion: "Leyes de Newton y cinemática." },
    rendimiento: []
  },
  {
    id: 'indg1033',
    codigo: "INDG1033",
    nombre: "ANÁLISIS Y RESOLUCIÓN DE PROB.",
    nivel: "NIVEL 1",
    estado: "aprobado",
    prerequisitos: [],
    stats: { reprobados: 5, descripcion: "Pensamiento lógico y algorítmico." },
    rendimiento: []
  },
    {
    id: '123',
    codigo: "INDG10323",
    nombre: "COMPLEMENTARIA ",
    nivel: "NIVEL 1",
    estado: "aprobado",
    prerequisitos: [],
    stats: { reprobados: 5, descripcion: "Pensamiento lógico y algorítmico." },
    rendimiento: []
  },
  {
    id: 'ccpg1043',
    codigo: "CCPG1043",
    nombre: "FUNDAMENTOS DE PROGRAMACIÓN",
    nivel: "NIVEL 1",
    estado: "aprobado",
    prerequisitos: [],
    stats: { reprobados: 40, descripcion: "Introducción a Python y lógica de programación." },
    rendimiento: [{ periodo: "2024", inscripciones: 120, reprobados: 40 }]
  },
  {
    id: 'idig1006',
    codigo: "IDIG1006",
    nombre: "INGLÉS I",
    nivel: "NIVEL 1",
    estado: "aprobado",
    prerequisitos: [],
    stats: { reprobados: 2, descripcion: "Nivel básico de inglés." },
    rendimiento: []
  },

  // --- NIVEL 200 (SEMESTRE 2) ---
  {
    id: 'matg1049',
    codigo: "MATG1049",
    nombre: "ÁLGEBRA LINEAL",
    nivel: "NIVEL 2",
    estado: "aprobado",
    prerequisitos: ['matg1045'], // Requiere Cálculo 1
    stats: { reprobados: 20, descripcion: "Espacios vectoriales y matrices." },
    rendimiento: []
  },
  {
    id: 'matg1046',
    codigo: "MATG1046",
    nombre: "CÁLCULO VECTORIAL",
    nivel: "NIVEL 2",
    estado: "pendiente",
    prerequisitos: ['matg1045'], // Requiere Cálculo 1
    stats: { reprobados: 28, descripcion: "Cálculo multivariable." },
    rendimiento: []
  },
  {
    id: 'ccpg1039',
    codigo: "CCPG1039",
    nombre: "COMPUTACIÓN Y SOCIEDAD",
    nivel: "NIVEL 2",
    estado: "pendiente",
    prerequisitos: [],
    stats: { reprobados: 0, descripcion: "Ética y tecnología." },
    rendimiento: []
  },
  {
    id: 'ccpg1052',
    codigo: "CCPG1052",
    nombre: "PROG. ORIENTADA A OBJETOS",
    nivel: "NIVEL 2",
    estado: "aprobado",
    prerequisitos: ['ccpg1043'], // Requiere Fundamentos
    stats: { reprobados: 15, descripcion: "Java/C++ y clases." },
    rendimiento: []
  },
  {
    id: 'idig1007',
    codigo: "IDIG1007",
    nombre: "INGLÉS II",
    nivel: "NIVEL 2",
    estado: "aprobado",
    prerequisitos: ['indg1033'],
    stats: { reprobados: 1, descripcion: "Nivel pre-intermedio." },
    rendimiento: []
  },

  // --- NIVEL 300 (SEMESTRE 3) ---
  {
    id: 'eyag1037',
    codigo: "EYAG1037",
    nombre: "FUND. ELECTRICIDAD Y SISTEMAS",
    nivel: "NIVEL 3",
    estado: "pendiente",
    prerequisitos: ['fisg1005'], // Requiere Física
    stats: { reprobados: 18, descripcion: "Circuitos básicos." },
    rendimiento: []
  },
  {
    id: 'matg1051',
    codigo: "MATG1051",
    nombre: "MATEMÁTICAS DISCRETAS",
    nivel: "NIVEL 3",
    estado: "pendiente",
    prerequisitos: ['matg1049'], // Requiere Algebra
    stats: { reprobados: 22, descripcion: "Lógica y teoría de grafos." },
    rendimiento: []
  },
  {
    id: 'ccpg1034',
    codigo: "CCPG1034",
    nombre: "ESTRUCTURAS DE DATOS",
    nivel: "NIVEL 3",
    estado: "reprobado",
    prerequisitos: ['ccpg1052'], // Requiere POO
    stats: { reprobados: 35, descripcion: "Listas, árboles y grafos.", reprobadosPorcentaje: 0.35, habilitados: 10 },
    rendimiento: [{periodo: "2024", inscripciones: 80, reprobados: 35}]
  },
  {
    id: 'ccpg1042',
    codigo: "CCPG1042",
    nombre: "DISEÑO DE SOFTWARE",
    nivel: "NIVEL 3",
    estado: "pendiente",
    prerequisitos: ['ccpg1052'], // Requiere POO
    stats: { reprobados: 5, descripcion: "UML y patrones." },
    rendimiento: []
  },
  {
    id: 'ticg1018',
    codigo: "TICG1018",
    nombre: "SISTEMA DE BASES DE DATOS",
    nivel: "NIVEL 3",
    estado: "pendiente",
    prerequisitos: ['ccpg1043'],
    stats: { reprobados: 12, descripcion: "SQL y modelado ER." },
    rendimiento: []
  },
  {
    id: 'idig1008',
    codigo: "IDIG1008",
    nombre: "INGLÉS III",
    nivel: "NIVEL 3",
    estado: "pendiente",
    prerequisitos: ['idig1007'],
    rendimiento: []
  },

  // --- NIVEL 400 (SEMESTRE 4) ---
  {
    id: 'ccpg1049',
    codigo: "CCPG1049",
    nombre: "ORGANIZACIÓN DE COMPUTADORES",
    nivel: "NIVEL 4",
    estado: "pendiente",
    prerequisitos: ['eyag1037'], // Requiere Electricidad
    stats: { reprobados: 15, descripcion: "Arquitectura de hardware." },
    rendimiento: []
  },
  {
    id: 'ccpg1051',
    codigo: "CCPG1051",
    nombre: "PROGRAMACIÓN DE SISTEMAS",
    nivel: "NIVEL 4",
    estado: "pendiente",
    prerequisitos: ['ccpg1034'], // Requiere Est. Datos
    stats: { reprobados: 20, descripcion: "Programación a bajo nivel (C)." },
    rendimiento: []
  },
  {
    id: 'estg1034',
    codigo: "ESTG1034",
    nombre: "ESTADÍSTICA",
    nivel: "NIVEL 4",
    estado: "pendiente",
    prerequisitos: ['matg1046'], // Requiere Vectorial
    stats: { reprobados: 30, descripcion: "Probabilidad y estadística inferencial." },
    rendimiento: []
  },
  {
    id: 'ccpg1046',
    codigo: "CCPG1046",
    nombre: "INTERACCIÓN HUMANO COMP.",
    nivel: "NIVEL 4",
    estado: "pendiente",
    prerequisitos: ['ccpg1042'], // Requiere Diseño
    rendimiento: []
  },
  {
    id: 'tlmg1032',
    codigo: "TLMG1032",
    nombre: "REDES DE DATOS",
    nivel: "NIVEL 4",
    estado: "pendiente",
    prerequisitos: ['ticg1018'],
    rendimiento: []
  },
  {
    id: 'idig1009',
    codigo: "IDIG1009",
    nombre: "INGLÉS IV",
    nivel: "NIVEL 4",
    estado: "pendiente",
    prerequisitos: ['idig1008'],
    rendimiento: []
  },

  // --- NIVEL 500 (SEMESTRE 5) ---
  {
    id: 'ccpg1056',
    codigo: "CCPG1056",
    nombre: "SISTEMAS OPERATIVOS",
    nivel: "NIVEL 5",
    estado: "pendiente",
    prerequisitos: ['ccpg1049', 'ccpg1051'], // Org Comp y Prog Sis
    stats: { reprobados: 40, descripcion: "Procesos, hilos y gestión de memoria." },
    rendimiento: [{periodo: "2024", inscripciones: 60, reprobados: 25}]
  },
  {
    id: 'ccpg1036',
    codigo: "CCPG1036",
    nombre: "ANÁLISIS DE ALGORITMOS",
    nivel: "NIVEL 5",
    estado: "pendiente",
    prerequisitos: ['estg1034', 'ccpg1034'], // Estadistica y Est Datos
    stats: { reprobados: 25, descripcion: "Complejidad algorítmica." },
    rendimiento: []
  },
  {
    id: 'sofg1006',
    codigo: "SOFG1006",
    nombre: "APPS WEB Y MÓVILES",
    nivel: "NIVEL 5",
    estado: "pendiente",
    prerequisitos: ['ccpg1042', 'ticg1018'],
    rendimiento: []
  },
  {
    id: 'sofg1007',
    codigo: "SOFG1007",
    nombre: "INGENIERÍA DE SOFTWARE I",
    nivel: "NIVEL 5",
    estado: "pendiente",
    prerequisitos: ['ccpg1042'],
    rendimiento: []
  },
  {
    id: 'admg1005',
    codigo: "ADMG1005",
    nombre: "EMPRENDIMIENTO E INNOV.",
    nivel: "NIVEL 5",
    estado: "pendiente",
    prerequisitos: [],
    rendimiento: []
  },
    {
    id: 'idig1010',
    codigo: "IDIG1010",
    nombre: "INGLÉS V",
    nivel: "NIVEL 5",
    estado: "pendiente",
    prerequisitos: ['idig1009'],
    rendimiento: []
  },

  // --- NIVEL 600 (SEMESTRE 6) ---
  {
    id: 'ccpg1053',
    codigo: "CCPG1053",
    nombre: "SEGURIDAD DE LA INFO",
    nivel: "NIVEL 6",
    estado: "pendiente",
    prerequisitos: ['ccpg1056', 'tlmg1032'], // SO y Redes
    rendimiento: []
  },
  {
    id: 'ccpg1048',
    codigo: "CCPG1048",
    nombre: "METODOLOGÍA INVESTIGACIÓN",
    nivel: "NIVEL 6",
    estado: "pendiente",
    prerequisitos: ['ccpg1036'],
    rendimiento: []
  },
  {
    id: 'sofg1009',
    codigo: "SOFG1009",
    nombre: "LENGUAJES DE PROGRAMACIÓN",
    nivel: "NIVEL 6",
    estado: "pendiente",
    prerequisitos: ['ccpg1036'],
    rendimiento: []
  },
  {
    id: 'sofg1008',
    codigo: "SOFG1008",
    nombre: "INGENIERÍA DE SOFTWARE II",
    nivel: "NIVEL 6",
    estado: "pendiente",
    prerequisitos: ['sofg1007'],
    rendimiento: []
  },

  // --- NIVEL 700 (SEMESTRE 7) ---
  {
    id: 'ccpg1044',
    codigo: "CCPG1044",
    nombre: "INTELIGENCIA ARTIFICIAL",
    nivel: "NIVEL 7",
    estado: "pendiente",
    prerequisitos: ['ccpg1036'],
    stats: { reprobados: 10, descripcion: "Redes neuronales y ML." },
    rendimiento: []
  },
  {
    id: 'ccpg1054',
    codigo: "CCPG1054",
    nombre: "SISTEMAS DE INFORMACIÓN",
    nivel: "NIVEL 7",
    estado: "pendiente",
    prerequisitos: ['sofg1006'],
    rendimiento: []
  },
  {
    id: 'ccpg1055',
    codigo: "CCPG1055",
    nombre: "SISTEMAS DISTRIBUIDOS",
    nivel: "NIVEL 7",
    estado: "pendiente",
    prerequisitos: ['ccpg1056', 'tlmg1032'],
    rendimiento: []
  },
  {
    id: 'ccpg1041',
    codigo: "CCPG1041",
    nombre: "GESTIÓN DE PROYECTOS",
    nivel: "NIVEL 7",
    estado: "pendiente",
    prerequisitos: ['sofg1008'],
    rendimiento: []
  },

   // --- NIVEL 800 (SEMESTRE 8 - FINAL) ---
  {
    id: 'ccpg1035',
    codigo: "CCPG1035",
    nombre: "MATERIA INTEGRADORA",
    nivel: "NIVEL 8",
    estado: "pendiente",
    prerequisitos: ['ccpg1041', 'sofg1008'],
    stats: { reprobados: 0, descripcion: "Proyecto de titulación." },
    rendimiento: []
  },
  {
    id: 'itinerario1',
    codigo: "ITIN1",
    nombre: "ITINERARIO I",
    nivel: "NIVEL 8",
    estado: "pendiente",
    prerequisitos: [],
    rendimiento: []
  },
  {
    id: 'practicas',
    codigo: "PRAC1",
    nombre: "PRÁCTICAS PREPROFESIONALES",
    nivel: "NIVEL 9", // Lo pongo al final
    estado: "pendiente",
    prerequisitos: ['ccpg1035'],
    rendimiento: []
  },
];

// --- 2. COMPONENTE MODAL CON RECHARTS ---
const ModalMateria = ({ node, onClose }) => {
  if (!node) return null;
  const { nombre, stats, rendimiento } = node.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 dark:bg-zinc-900">
        
        {/* Header */}
        <div className="px-8 pt-8 text-center">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white uppercase">{nombre}</h2>
          <p className="mt-1 text-sm text-zinc-500">{stats.descripcion}</p>
        </div>

        {/* Body: GRÁFICO CON RECHARTS */}
        <div className="h-[300px] w-full px-8 py-6">
           {rendimiento && rendimiento.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
               <LineChart
                 data={rendimiento}
                 margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
               >
                 <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f3f4f6" />
                 <XAxis 
                    dataKey="periodo" 
                    tick={{fontSize: 10, fill: '#6b7280'}} 
                    tickLine={false} 
                    axisLine={false} 
                    interval={0} // Muestra todas las etiquetas
                 />
                 <YAxis 
                    tick={{fontSize: 10, fill: '#6b7280'}} 
                    tickLine={false} 
                    axisLine={false} 
                 />
                 <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Legend 
                    verticalAlign="bottom" 
                    iconType="circle"
                    height={36}
                 />
                 <Line 
                    type="monotone" 
                    dataKey="inscripciones" 
                    name="Inscripciones"
                    stroke="#374151" // Gris oscuro
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{r: 6}} 
                 />
                 <Line 
                    type="monotone" 
                    dataKey="reprobados" 
                    name="Reprobados"
                    stroke="#8b5cf6" // Violeta/Morado
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{r: 6}} 
                 />
               </LineChart>
             </ResponsiveContainer>
           ) : (
             <div className="flex h-full items-center justify-center text-zinc-400">
                Sin datos históricos disponibles
             </div>
           )}
        </div>

        {/* Body: Stats Cards (Diseño idéntico a la imagen) */}
        <div className="grid grid-cols-3 divide-x divide-zinc-100 border-t border-zinc-100 py-6 dark:divide-zinc-800 dark:border-zinc-800">
           {/* Reprobados */}
           <div className="flex flex-col items-center justify-center p-2 text-center">
              <div className="flex items-end gap-1">
                 <span className="text-3xl font-bold text-violet-900 dark:text-violet-300">{stats.reprobados}</span>
                 <span className="mb-1 text-xs font-bold text-emerald-500">{(stats.reprobadosPorcentaje * 100).toFixed(0)}%</span>
              </div>
              <span className="text-xs text-zinc-500">Reprobados</span>
           </div>

           {/* Aprobaron Requisitos */}
           <div className="flex flex-col items-center justify-center p-2 text-center">
              <span className="text-3xl font-bold text-violet-900 dark:text-violet-300">{stats.aprobaronRequisitos}</span>
              <span className="text-xs text-zinc-500">Aprobaron requisitos</span>
           </div>

           {/* Habilitados */}
           <div className="flex flex-col items-center justify-center p-2 text-center">
              <span className="text-3xl font-bold text-violet-900 dark:text-violet-300">{stats.habilitados}</span>
              <span className="text-xs text-zinc-500">Habilitados</span>
           </div>
        </div>

        <div className="pb-4 text-center text-[10px] text-zinc-400">
           Información consolidada 2023–2025
        </div>

        {/* Footer: Botón Cerrar Negro */}
        <div className="bg-white p-6 pt-2 dark:bg-zinc-900">
          <button 
            onClick={onClose}
            className="w-full rounded-full bg-zinc-950 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

// --- 3. COMPONENTE DE NODO (MALLA) ---
const SubjectNode = ({ data, selected }) => {
  const statusConfig = {
    aprobado: { bg: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-900' },
    reprobado: { bg: 'bg-rose-500', border: 'border-rose-200 dark:border-rose-900' },
    pendiente: { bg: 'bg-blue-500', border: 'border-zinc-200 dark:border-zinc-800' }
  };
  const config = statusConfig[data.estado] || statusConfig.pendiente;
  const selectionStyle = selected ? 'ring-2 ring-indigo-500 ring-offset-2' : '';

  return (
    <div className={`relative flex h-24 w-58 flex-col justify-between rounded-lg border bg-white p-3 shadow-sm transition-all dark:bg-zinc-900 ${config.border} ${selectionStyle}`}>
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{data.codigo}</span>
        <div className={`h-2 w-2 rounded-full ${config.bg}`} />
      </div>
      <h3 className="line-clamp-2 text-xs font-bold leading-tight text-zinc-700 dark:text-zinc-100">{data.nombre}</h3>
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
    </div>
  );
};
const nodeTypes = { subject: SubjectNode };

// --- 4. LOGICA DE LAYOUT ---
const transformDataToFlow = (materias) => {
  const COL_WIDTH = 260;
  const ROW_HEIGHT = 150; 
  const levels = [...new Set(materias.map(m => m.nivel))].sort();
  const nodes = [];
  const edges = [];
  const levelCounters = {}; 
  materias.forEach((materia) => {
    const levelIndex = levels.indexOf(materia.nivel);
    if (!levelCounters[levelIndex]) levelCounters[levelIndex] = 0;
    const posX = levelCounters[levelIndex] * COL_WIDTH;
    const posY = levelIndex * ROW_HEIGHT;
    levelCounters[levelIndex]++; 

    nodes.push({
      id: String(materia.id),
      type: 'subject',
      position: { x: posX, y: posY },
      data: { ...materia },
    });
    if (materia.preRequisitos) {

      materia.preRequisitos.forEach(preId => {
       
          edges.push({
            id: `e-${preId}-${materia.id}`,
            source: String(preId),
            target: String(materia.id),
            type: 'smoothstep',
            style: { stroke: '#cbd5e1', strokeWidth: 1.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#cbd5e1' },
          });
      });
    }
  });
  return { nodes, edges };
};

export default function MallaCurricular({subjects}) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => transformDataToFlow(subjects), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col bg-zinc-50 font-sans dark:bg-black">
      
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-black">
        <h1 className="text-sm font-bold text-zinc-500">Malla Curricular - Ingeniería</h1>
      </div>

      <div className="relative h-full w-full bg-zinc-50 dark:bg-zinc-950 py-4 overflow-auto ">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          nodesDraggable={false}       
          panOnDrag={true}            
          zoomOnScroll={true}         
          zoomOnPinch={false}          
          zoomOnDoubleClick={false}  
          preventScrolling={true}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          
          // Ocultar atribución (proOptions es la forma correcta moderna)
          proOptions={{ hideAttribution: true }}
          // 👇 AJUSTE AUTOMÁTICO AL CONTENEDOR
          // padding: 0 asegura que el grafo ocupe TODO el espacio disponible del div padre.
          // El espacio en blanco lo controlas con el padding CSS del div padre.
        />

        {/* MODAL / POP UP */}
        {selectedNode && (
          <ModalMateria 
            node={selectedNode} 
            onClose={() => setSelectedNode(null)} 
          />
        )}

      </div>
    </div>
  );
}