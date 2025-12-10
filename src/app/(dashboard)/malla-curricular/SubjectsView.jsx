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