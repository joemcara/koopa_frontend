'use client';

import React, { useMemo, useCallback, useState } from 'react';
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


// --- MODAL CON RECHARTS ---
const ModalMateria = ({ node, onClose }) => {
  if (!node) return null;
  const { nombre, stats = {}, rendimiento = [] } = node.data;

  const reprobados = stats.reprobados ?? 0;
  const reprobadosPorcentaje = stats.reprobadosPorcentaje ?? 0;
  const aprobaronRequisitos = stats.aprobaronRequisitos ?? 0;
  const habilitados = stats.habilitados ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
        
        {/* Header */}
        <div className="px-8 pt-8 text-center">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white uppercase">
            {nombre}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">{stats.descripcion}</p>
        </div>

        {/* Gráfico */}
        <div className="h-[300px] w-full px-8 py-6">
          {rendimiento && rendimiento.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={rendimiento}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical horizontal stroke="#f3f4f6" />
                <XAxis
                  dataKey="periodo"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend verticalAlign="bottom" iconType="circle" height={36} />
                <Line
                  type="monotone"
                  dataKey="inscripciones"
                  name="Inscripciones"
                  stroke="#374151"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="reprobados"
                  name="Reprobados"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              Sin datos históricos disponibles
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-zinc-100 border-t border-zinc-100 py-6 dark:divide-zinc-800 dark:border-zinc-800">
          {/* Reprobados */}
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-violet-900 dark:text-violet-300">
                {reprobados}
              </span>
              <span className="mb-1 text-xs font-bold text-emerald-500">
                {(reprobadosPorcentaje * 100).toFixed(0)}%
              </span>
            </div>
            <span className="text-xs text-zinc-500">Reprobados</span>
          </div>

          {/* Aprobaron requisitos */}
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <span className="text-3xl font-bold text-violet-900 dark:text-violet-300">
              {aprobaronRequisitos}
            </span>
            <span className="text-xs text-zinc-500">Aprobaron requisitos</span>
          </div>

          {/* Habilitados */}
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <span className="text-3xl font-bold text-violet-900 dark:text-violet-300">
              {habilitados}
            </span>
            <span className="text-xs text-zinc-500">Habilitados</span>
          </div>
        </div>

        <div className="pb-4 text-center text-[10px] text-zinc-400">
          Información consolidada 2023–2025
        </div>

        {/* Footer */}
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

// --- NODO DE LA MALLA ---
const SubjectNode = ({ data, selected }) => {
  // Colores base por estado, por si no viene "color" del backend
  const statusConfig = {
    aprobado: { bg: '#10b981' },
    reprobado: { bg: '#f43f5e' },
    pendiente: { bg: '#3b82f6' },
  };

  const baseColor =
    data.color || (statusConfig[data.estado] && statusConfig[data.estado].bg) || statusConfig.pendiente.bg;

  const selectionStyle = selected ? 'ring-2 ring-indigo-500 ring-offset-2' : '';

  return (
    <div
      className={`relative flex h-24 w-58 flex-col justify-between rounded-lg border bg-white p-3 shadow-sm transition-all dark:bg-zinc-900 ${selectionStyle}`}
      style={{ borderColor: baseColor }}
    >
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          {data.codigo}
        </span>
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: baseColor }}
        />
      </div>
      <h3 className="line-clamp-2 text-xs font-bold leading-tight text-zinc-700 dark:text-zinc-100">
        {data.nombre}
      </h3>
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
    </div>
  );
};

const nodeTypes = { subject: SubjectNode };

// --- LAYOUT: usa preRequisitos, coRequisitos y color ---
const transformDataToFlow = (materias) => {
  const COL_WIDTH = 260;
  const ROW_HEIGHT = 150;
  const levels = [...new Set(materias.map((m) => m.nivel))].sort();
  const nodes = [];
  const edges = [];
  const levelCounters = {};

  materias.forEach((materia) => {
    const levelIndex = levels.indexOf(materia.nivel);
    if (!levelCounters[levelIndex]) levelCounters[levelIndex] = 0;

    const posX = levelCounters[levelIndex] * COL_WIDTH;
    const posY = levelIndex * ROW_HEIGHT;
    levelCounters[levelIndex]++;

    // Nodo con todos los datos (incluye color, preRequisitos, coRequisitos, etc.)
    nodes.push({
      id: String(materia.id),
      type: 'subject',
      position: { x: posX, y: posY },
      data: { ...materia },
    });

    // PRE-REQUISITOS (línea sólida)
    if (Array.isArray(materia.preRequisitos)) {
      materia.preRequisitos.forEach((preId) => {
        if (!preId) return;
        edges.push({
          id: `e-pre-${preId}-${materia.id}`,
          source: String(preId),
          target: String(materia.id),
          type: 'smoothstep',
          style: { stroke: '#cbd5e1', strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#cbd5e1' },
        });
      });
    }

    // CO-REQUISITOS (línea punteada)
    if (Array.isArray(materia.coRequisitos)) {
      materia.coRequisitos.forEach((coId) => {
        if (!coId) return;
        edges.push({
          id: `e-co-${coId}-${materia.id}`,
          source: String(coId),
          target: String(materia.id),
          type: 'smoothstep',
          style: { stroke: '#a5b4fc', strokeWidth: 1.5, strokeDasharray: '4 2' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#a5b4fc' },
        });
      });
    }
  });

  return { nodes, edges };
};

export default function MallaCurricular({ subjects = materiasFromBackend }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => transformDataToFlow(subjects),
    [subjects]
  );

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

      {/* ReactFlow */}
      <div className="relative h-full w-full bg-zinc-50 dark:bg-zinc-950 py-4 overflow-auto">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          nodesDraggable={false}
          panOnDrag
          zoomOnScroll
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          proOptions={{ hideAttribution: true }}
        />

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
