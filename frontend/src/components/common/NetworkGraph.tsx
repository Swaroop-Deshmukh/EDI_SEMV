'use client';

import React, { useState } from 'react';
import { MOCK_NETWORK_GRAPH, GraphNode, GraphEdge } from '@/mock/network';
import { ZoomIn, ZoomOut, RotateCcw, ShieldAlert, ArrowRight, Building2, FileText, UserCheck, MapPin, Landmark } from 'lucide-react';
import Link from 'next/link';

interface NetworkGraphProps {
  initialFocusNodeId?: string;
  onSelectNode?: (node: GraphNode) => void;
  height?: number;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  initialFocusNodeId,
  onSelectNode,
  height = 520,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(
    initialFocusNodeId
      ? MOCK_NETWORK_GRAPH.nodes.find(n => n.id === initialFocusNodeId || n.entityId === initialFocusNodeId) || null
      : MOCK_NETWORK_GRAPH.nodes[0]
  );
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  const getNodeColor = (node: GraphNode) => {
    switch (node.type) {
      case 'VENDOR':
        return node.riskScore && node.riskScore >= 75
          ? { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: '#dc2626' }
          : { bg: '#e0e7ff', border: '#6366f1', text: '#3730a3', icon: '#4f46e5' };
      case 'CONTRACT':
        return node.riskScore && node.riskScore >= 75
          ? { bg: '#fef2f2', border: '#dc2626', text: '#7f1d1d', icon: '#b91c1c' }
          : { bg: '#ecfdf5', border: '#10b981', text: '#065f46', icon: '#059669' };
      case 'DIRECTOR':
        return { bg: '#f5f3ff', border: '#8b5cf6', text: '#5b21b6', icon: '#7c3aed' };
      case 'ADDRESS':
        return { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', icon: '#d97706' };
      case 'BUYER':
        return { bg: '#f0fdfa', border: '#14b8a6', text: '#115e59', icon: '#0d9488' };
      default:
        return { bg: '#f8fafc', border: '#94a3b8', text: '#334155', icon: '#64748b' };
    }
  };

  const getNodeIcon = (type: GraphNode['type']) => {
    switch (type) {
      case 'VENDOR':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'CONTRACT':
        return <FileText className="w-3.5 h-3.5" />;
      case 'DIRECTOR':
        return <UserCheck className="w-3.5 h-3.5" />;
      case 'ADDRESS':
        return <MapPin className="w-3.5 h-3.5" />;
      case 'BUYER':
        return <Landmark className="w-3.5 h-3.5" />;
    }
  };

  const getEntityUrl = (node: GraphNode) => {
    if (node.type === 'VENDOR') return `/entities/vendors/${node.entityId}`;
    if (node.type === 'CONTRACT') return `/procurement/contracts/${node.entityId}`;
    return `/network`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
      {/* Controls Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <span>Entity Relationship & Syndicate Explorer</span>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-2xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Vendor
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> High-Risk Contract
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Director DIN
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Shared Address
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5">
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.6))}
            className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.7))}
            className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 relative">
        {/* Canvas Area */}
        <div className="lg:col-span-8 bg-slate-900 overflow-hidden relative" style={{ height: `${height}px` }}>
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <svg
            className="w-full h-full cursor-grab active:cursor-grabbing select-none"
            viewBox="0 0 700 460"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}
          >
            {/* Edge Definitions (Arrows) */}
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
              </marker>
            </defs>

            {/* Edges */}
            {MOCK_NETWORK_GRAPH.edges.map(edge => {
              const sourceNode = MOCK_NETWORK_GRAPH.nodes.find(n => n.id === edge.source);
              const targetNode = MOCK_NETWORK_GRAPH.nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isConnectedToSelected =
                selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

              return (
                <g key={edge.id}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isConnectedToSelected ? '#f87171' : '#475569'}
                    strokeWidth={isConnectedToSelected ? 2.5 : 1.2}
                    strokeDasharray={edge.type.includes('COVER') ? '4 3' : undefined}
                    markerEnd={isConnectedToSelected ? 'url(#arrow-active)' : 'url(#arrow)'}
                    className="transition-colors duration-150"
                  />
                  {/* Edge Label */}
                  <text
                    x={((sourceNode.x || 0) + (targetNode.x || 0)) / 2}
                    y={((sourceNode.y || 0) + (targetNode.y || 0)) / 2 - 5}
                    fill={isConnectedToSelected ? '#fca5a5' : '#94a3b8'}
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {MOCK_NETWORK_GRAPH.nodes.map(node => {
              const style = getNodeColor(node);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNodeId === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x || 0}, ${node.y || 0})`}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer group"
                >
                  {/* Outer Ring on Selection */}
                  {isSelected && (
                    <circle
                      r="26"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r="20"
                    fill={style.bg}
                    stroke={isSelected ? '#38bdf8' : style.border}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-transform duration-150 group-hover:scale-110"
                  />

                  {/* Risk Indicator Dot if high risk */}
                  {node.riskScore && node.riskScore >= 70 && (
                    <circle
                      cx="14"
                      cy="-14"
                      r="5"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Node Label Text */}
                  <text
                    y="32"
                    fill="#f8fafc"
                    fontSize="9"
                    fontWeight={isSelected ? '700' : '500'}
                    textAnchor="middle"
                    className="select-none pointer-events-none drop-shadow-md"
                  >
                    {node.label.length > 24 ? `${node.label.slice(0, 22)}...` : node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Entity Inspector Panel */}
        <div className="lg:col-span-4 bg-slate-50 p-5 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between overflow-y-auto" style={{ height: `${height}px` }}>
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {selectedNode.type} ENTITY
                  </span>
                  {selectedNode.riskScore && (
                    <span className="text-2xs font-bold font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                      RISK {selectedNode.riskScore}/100
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{selectedNode.label}</h4>
                <p className="text-2xs font-mono text-slate-500 mt-0.5">Entity Ref: {selectedNode.entityId}</p>
              </div>

              {/* Entity Properties */}
              <div className="bg-white border border-slate-200 rounded-md p-3 space-y-2 text-xs">
                <h5 className="text-2xs font-semibold uppercase tracking-wider text-slate-400">Node Properties</h5>
                {Object.entries(selectedNode.properties).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center text-2xs py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-500">{key}:</span>
                    <span className="font-semibold text-slate-800">{val}</span>
                  </div>
                ))}
              </div>

              {/* Connected Relationships */}
              <div className="space-y-1.5">
                <h5 className="text-2xs font-semibold uppercase tracking-wider text-slate-400">Direct Network Links</h5>
                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {MOCK_NETWORK_GRAPH.edges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map(e => {
                      const otherId = e.source === selectedNode.id ? e.target : e.source;
                      const otherNode = MOCK_NETWORK_GRAPH.nodes.find(n => n.id === otherId);
                      return (
                        <div
                          key={e.id}
                          onClick={() => otherNode && handleNodeClick(otherNode)}
                          className="p-2 bg-white border border-slate-200 rounded text-2xs flex items-center justify-between hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                        >
                          <div>
                            <span className="font-medium text-slate-800">{otherNode?.label}</span>
                            <span className="block text-slate-400 text-2xs font-mono">{e.label}</span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select any node in the graph to inspect relationships.
            </div>
          )}

          {selectedNode && (
            <div className="pt-3 border-t border-slate-200">
              <Link
                href={getEntityUrl(selectedNode)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors shadow-xs"
              >
                <span>Open {selectedNode.type} Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
