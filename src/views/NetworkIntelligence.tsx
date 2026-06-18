import React, { useState, useEffect, useMemo } from 'react';
import { NETWORK_NODES, NETWORK_EDGES, KSP_SUSPECTS } from '../mockData/intelligenceDb';
import { useIntelligence } from '../context/IntelligenceContext';
import { Search, Info, ZoomIn, ZoomOut, Zap } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export const NetworkIntelligence: React.FC = () => {
  const { setSelectedSuspect, setCurrentModule } = useIntelligence();

  // Search, Filters & Analysis States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node_murali');
  const [filterTypes, setFilterTypes] = useState<Record<string, boolean>>({
    suspect: true,
    phone: true,
    vehicle: true,
    bank: true,
    location: true,
    case: true,
    weapon: true
  });
  const [algoMode, setAlgoMode] = useState<'none' | 'pagerank' | 'centrality'>('none');
  const [shortestPathSource, setShortestPathSource] = useState<string>('');
  const [shortestPathTarget, setShortestPathTarget] = useState<string>('');
  const [shortestPathResult, setShortestPathResult] = useState<string[]>([]);

  // Pan / Zoom State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });

  // Node Positions (Force-directed / Layout on Mount)
  const [nodePositions, setNodePositions] = useState<Record<string, Point>>({});
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  // Initialize node positions (clustered layout)
  useEffect(() => {
    const positions: Record<string, Point> = {};
    const width = 700;
    const height = 450;

    // Cluster types in different regions or distribute evenly
    NETWORK_NODES.forEach((node, idx) => {
      let angle = (idx / NETWORK_NODES.length) * 2 * Math.PI;
      let radius = 180;

      // Group similar node types closer together
      if (node.type === 'suspect') {
        radius = 80;
      } else if (node.type === 'case') {
        radius = 140;
      } else if (node.type === 'phone') {
        radius = 240;
        angle += 0.2;
      } else if (node.type === 'bank') {
        radius = 220;
        angle -= 0.2;
      }

      positions[node.id] = {
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle)
      };
    });

    setNodePositions(positions);
  }, []);

  // Compute PageRank scores locally
  const pageRankScores = useMemo(() => {
    const scores: Record<string, number> = {};
    const d = 0.85; // Damping factor
    const iterations = 20;

    // Initialize scores
    NETWORK_NODES.forEach(n => {
      scores[n.id] = 1.0 / NETWORK_NODES.length;
    });

    // Build outbound connections mapping
    const outbound: Record<string, string[]> = {};
    NETWORK_NODES.forEach(n => {
      outbound[n.id] = [];
    });

    NETWORK_EDGES.forEach(e => {
      if (outbound[e.source]) outbound[e.source].push(e.target);
      if (outbound[e.target]) outbound[e.target].push(e.source); // Treat undirected
    });

    // Run power iteration
    for (let iter = 0; iter < iterations; iter++) {
      const nextScores: Record<string, number> = {};
      NETWORK_NODES.forEach(n => {
        nextScores[n.id] = (1 - d) / NETWORK_NODES.length;
      });

      NETWORK_NODES.forEach(n => {
        const links = outbound[n.id];
        if (links.length > 0) {
          const share = (d * scores[n.id]) / links.length;
          links.forEach(dest => {
            if (nextScores[dest] !== undefined) {
              nextScores[dest] += share;
            }
          });
        } else {
          // Sink node redistributes equally
          NETWORK_NODES.forEach(dest => {
            nextScores[dest.id] += (d * scores[n.id]) / NETWORK_NODES.length;
          });
        }
      });

      // Update scores
      Object.assign(scores, nextScores);
    }

    // Normalize between 0 and 1
    const maxVal = Math.max(...Object.values(scores));
    NETWORK_NODES.forEach(n => {
      scores[n.id] = scores[n.id] / maxVal;
    });

    return scores;
  }, []);

  // Compute Degree Centrality locally
  const degreeCentralityScores = useMemo(() => {
    const scores: Record<string, number> = {};
    NETWORK_NODES.forEach(n => {
      scores[n.id] = 0;
    });
    NETWORK_EDGES.forEach(e => {
      if (scores[e.source] !== undefined) scores[e.source]++;
      if (scores[e.target] !== undefined) scores[e.target]++;
    });
    const maxVal = Math.max(...Object.values(scores), 1);
    NETWORK_NODES.forEach(n => {
      scores[n.id] = scores[n.id] / maxVal;
    });
    return scores;
  }, []);

  // Dijkstra Shortest Path Finder
  const findShortestPath = () => {
    if (!shortestPathSource || !shortestPathTarget) return;

    // Build graph adjacency list
    const adj: Record<string, string[]> = {};
    NETWORK_NODES.forEach(n => {
      adj[n.id] = [];
    });
    NETWORK_EDGES.forEach(e => {
      adj[e.source].push(e.target);
      adj[e.target].push(e.source);
    });

    // BFS for shortest path (unweighted paths)
    const queue: string[] = [shortestPathSource];
    const visited = new Set<string>([shortestPathSource]);
    const parent: Record<string, string | null> = { [shortestPathSource]: null };

    let found = false;
    while (queue.length > 0) {
      const u = queue.shift()!;
      if (u === shortestPathTarget) {
        found = true;
        break;
      }

      for (const v of adj[u]) {
        if (!visited.has(v)) {
          visited.add(v);
          parent[v] = u;
          queue.push(v);
        }
      }
    }

    if (found) {
      const path: string[] = [];
      let curr: string | null = shortestPathTarget;
      while (curr !== null) {
        path.push(curr);
        curr = parent[curr];
      }
      setShortestPathResult(path.reverse());
    } else {
      setShortestPathResult([]);
      alert('No path exists between the selected nodes.');
    }
  };

  const clearShortestPath = () => {
    setShortestPathSource('');
    setShortestPathTarget('');
    setShortestPathResult([]);
  };

  // Drag and drop event handlers inside SVG
  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    } else if (draggedNodeId && nodePositions[draggedNodeId]) {
      // Offset SVG coordinates
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setNodePositions(prev => ({
        ...prev,
        [draggedNodeId]: { x, y }
      }));
    }
  };

  const handleSvgMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  // Node selection handler
  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const activeNode = useMemo(() => {
    return NETWORK_NODES.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId]);

  // Map active node to actual suspect if it is a suspect type
  const activeSuspect = useMemo(() => {
    if (activeNode && activeNode.type === 'suspect') {
      return KSP_SUSPECTS.find(s => s.name.includes(activeNode.label)) || null;
    }
    return null;
  }, [activeNode]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return NETWORK_NODES.filter(node => {
      if (!filterTypes[node.type]) return false;
      if (searchQuery) {
        return (
          node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (node.subtitle && node.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      return true;
    });
  }, [filterTypes, searchQuery]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // Filtered edges
  const filteredEdges = useMemo(() => {
    return NETWORK_EDGES.filter(edge => {
      return filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target);
    });
  }, [filteredNodeIds]);

  // Highlight classes
  const isNodeInShortestPath = (nodeId: string) => shortestPathResult.includes(nodeId);
  const isEdgeInShortestPath = (source: string, target: string) => {
    const idxS = shortestPathResult.indexOf(source);
    const idxT = shortestPathResult.indexOf(target);
    return idxS !== -1 && idxT !== -1 && Math.abs(idxS - idxT) === 1;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
      {/* Filters & Controls Sidebar */}
      <div className="glass-panel p-5 rounded-xl flex flex-col gap-4 overflow-y-auto">
        <div className="pb-3 border-b border-gray-800">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Graph Controllers</h3>
          <p className="text-[10px] text-ksp-muted font-mono">Filter and analyze node relations</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-ksp-muted" />
          <input
            type="text"
            placeholder="Search entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-950 text-xs text-gray-200 border border-gray-850 rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-ksp-primary"
          />
        </div>

        {/* Node Filters */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-ksp-muted uppercase">Entity Filters</span>
          <div className="grid grid-cols-2 gap-1">
            {Object.keys(filterTypes).map((type) => (
              <label key={type} className="flex items-center gap-2 text-xs text-gray-300 select-none cursor-pointer hover:text-white transition">
                <input
                  type="checkbox"
                  checked={filterTypes[type]}
                  onChange={() => setFilterTypes(prev => ({ ...prev, [type]: !prev[type] }))}
                  className="rounded border-gray-800 text-ksp-primary focus:ring-ksp-primary/20 bg-gray-950"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Algorithms */}
        <div className="space-y-2 pt-2 border-t border-gray-800">
          <span className="text-xs font-mono font-semibold text-ksp-muted uppercase">Graph Calculations</span>
          <div className="flex gap-2">
            <button
              onClick={() => setAlgoMode(algoMode === 'pagerank' ? 'none' : 'pagerank')}
              className={`flex-1 text-xs font-mono py-1.5 px-2.5 border rounded transition ${
                algoMode === 'pagerank'
                  ? 'bg-ksp-primary/20 border-ksp-primary text-white font-bold'
                  : 'bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              PageRank
            </button>
            <button
              onClick={() => setAlgoMode(algoMode === 'centrality' ? 'none' : 'centrality')}
              className={`flex-1 text-xs font-mono py-1.5 px-2.5 border rounded transition ${
                algoMode === 'centrality'
                  ? 'bg-ksp-accent/20 border-ksp-accent text-white font-bold'
                  : 'bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              Centrality
            </button>
          </div>
        </div>

        {/* Shortest Path Finder */}
        <div className="space-y-2 pt-2 border-t border-gray-800">
          <span className="text-xs font-mono font-semibold text-ksp-muted uppercase">Shortest Path Vector</span>
          <div className="space-y-2">
            <select
              value={shortestPathSource}
              onChange={(e) => setShortestPathSource(e.target.value)}
              className="w-full bg-gray-950 text-xs text-gray-300 border border-gray-800 rounded px-2.5 py-1.5 outline-none focus:border-ksp-primary"
            >
              <option value="">-- Select Source --</option>
              {NETWORK_NODES.map(n => (
                <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
              ))}
            </select>

            <select
              value={shortestPathTarget}
              onChange={(e) => setShortestPathTarget(e.target.value)}
              className="w-full bg-gray-950 text-xs text-gray-300 border border-gray-800 rounded px-2.5 py-1.5 outline-none focus:border-ksp-primary"
            >
              <option value="">-- Select Target --</option>
              {NETWORK_NODES.map(n => (
                <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={findShortestPath}
                className="flex-1 bg-ksp-primary hover:bg-ksp-primary/80 text-white font-bold font-mono text-xs py-1.5 rounded transition"
              >
                Trace Path
              </button>
              {shortestPathResult.length > 0 && (
                <button
                  onClick={clearShortestPath}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-xs py-1.5 px-3 rounded transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Canvas Visualizer */}
      <div className="lg:col-span-2 glass-panel rounded-xl overflow-hidden relative flex flex-col bg-gray-950/20 border border-gray-800">
        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => setZoom(z => Math.min(3, z + 0.1))}
            className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 text-gray-200 transition"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 text-gray-200 transition"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="px-2.5 py-1 bg-gray-900 border border-gray-800 text-[10px] font-mono rounded-lg hover:border-gray-700 text-gray-200 transition"
          >
            Reset Camera
          </button>
        </div>

        {/* Info Ticker */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="text-[10px] font-mono bg-ksp-primary/10 border border-ksp-primary/30 text-ksp-accent px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="h-3 w-3 animate-pulse" /> Interactive SVG Matrix Engine
          </span>
        </div>

        {/* The Graph Canvas */}
        <div className="flex-1 w-full relative cursor-grab active:cursor-grabbing">
          <svg
            className="w-full h-full"
            onMouseDown={handleSvgMouseDown}
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleSvgMouseUp}
            onMouseLeave={handleSvgMouseUp}
          >
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Draw Edges */}
              {filteredEdges.map((edge) => {
                const start = nodePositions[edge.source];
                const end = nodePositions[edge.target];
                if (!start || !end) return null;

                const isSP = isEdgeInShortestPath(edge.source, edge.target);

                return (
                  <g key={edge.id}>
                    <line
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke={isSP ? '#06B6D4' : '#374151'}
                      strokeWidth={isSP ? 3.5 : 1.5}
                      strokeDasharray={isSP ? '5,5' : '0'}
                      opacity={isSP ? 1 : 0.65}
                    />
                    {/* Optional label on mid-point */}
                    {edge.label && !isPanning && zoom > 0.8 && (
                      <text
                        x={(start.x + end.x) / 2}
                        y={(start.y + end.y) / 2 - 4}
                        fill={isSP ? '#06B6D4' : '#6B7280'}
                        fontSize={8}
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {filteredNodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const isSelected = node.id === selectedNodeId;
                const isSP = isNodeInShortestPath(node.id);

                // Dynamically scale node radius based on PageRank or Centrality
                let baseRadius = 15;
                if (algoMode === 'pagerank') {
                  baseRadius = 10 + pageRankScores[node.id] * 20;
                } else if (algoMode === 'centrality') {
                  baseRadius = 10 + degreeCentralityScores[node.id] * 20;
                }

                // Determine node color
                let fill = '#3B82F6'; // Default blue
                if (node.type === 'suspect') fill = '#EF4444'; // Red
                else if (node.type === 'case') fill = '#F59E0B'; // Orange
                else if (node.type === 'phone') fill = '#10B981'; // Green
                else if (node.type === 'bank') fill = '#06B6D4'; // Cyan

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggedNodeId(node.id);
                    }}
                    onClick={() => handleNodeClick(node.id)}
                  >
                    {/* Ring highlight if selected or in Shortest Path */}
                    {(isSelected || isSP) && (
                      <circle
                        r={baseRadius + 6}
                        fill="none"
                        stroke={isSP ? '#06B6D4' : '#3B82F6'}
                        strokeWidth={2}
                        className={isSP ? 'animate-pulse' : ''}
                      />
                    )}

                    {/* Node Core */}
                    <circle
                      r={baseRadius}
                      fill={fill}
                      stroke="#0F172A"
                      strokeWidth={2}
                    />

                    {/* Node Label Text */}
                    <text
                      y={baseRadius + 14}
                      fill="#FFFFFF"
                      fontSize={10}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="sans-serif"
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>

                    {/* Node Subtitle (e.g. Aliases/Number) */}
                    {node.subtitle && (
                      <text
                        y={baseRadius + 24}
                        fill="#9CA3AF"
                        fontSize={8}
                        fontFamily="sans-serif"
                        textAnchor="middle"
                        opacity={zoom > 0.85 ? 1 : 0}
                      >
                        {node.subtitle}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div className="p-3 border-t border-gray-800/80 bg-gray-900/30 flex gap-4 flex-wrap text-[9px] font-mono justify-center">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span> Suspect</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span> Case</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span> Phone SIM</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-cyan-500 rounded-full"></span> Bank Account</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Other Assets</div>
        </div>
      </div>

      {/* Selected Node Details Inspector */}
      <div className="glass-panel p-5 rounded-xl flex flex-col overflow-y-auto">
        <div className="pb-3 border-b border-gray-800 mb-4">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Node Inspector</h3>
          <p className="text-[10px] text-ksp-muted font-mono">Real-time intelligence node audit</p>
        </div>

        {activeNode ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">{activeNode.label}</h4>
                <span className="text-[10px] font-mono uppercase text-ksp-accent tracking-wider">{activeNode.type}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                activeNode.riskScore > 80 ? 'bg-ksp-danger/20 text-ksp-danger' : 'bg-ksp-warning/20 text-ksp-warning'
              }`}>
                Score: {activeNode.riskScore}
              </span>
            </div>

            {/* Suspect Specific details */}
            {activeSuspect ? (
              <div className="space-y-3 pt-3 border-t border-gray-800 text-xs">
                <div className="space-y-1">
                  <span className="text-ksp-muted font-mono font-semibold">Aliases:</span>
                  <p className="text-gray-200">{activeSuspect.aliases}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-ksp-muted font-mono font-semibold">Primary Modus Operandi:</span>
                  <p className="text-gray-300 leading-relaxed">{activeSuspect.modusOperandi}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-ksp-muted font-mono font-semibold">Psychological Profiling:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeSuspect.psychologicalIndicators.map((ind, i) => (
                      <span key={i} className="text-[9px] bg-gray-900 border border-gray-800 px-2 py-0.5 rounded text-gray-300">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-850 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedSuspect(activeSuspect);
                      setCurrentModule('behavioral-profiling');
                    }}
                    className="flex-1 bg-ksp-primary hover:bg-ksp-primary/80 text-white font-mono text-[10px] py-1.5 rounded text-center transition"
                  >
                    View Offender Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-3 border-t border-gray-800 text-xs">
                <div className="p-3 bg-gray-950 border border-gray-900 rounded-lg">
                  <p className="text-gray-300 font-mono text-[10px] leading-relaxed">
                    This node is categorized as a digital proxy asset ({activeNode.type}). It possesses {
                      NETWORK_EDGES.filter(e => e.source === activeNode.id || e.target === activeNode.id).length
                    } direct transaction/communication links.
                  </p>
                </div>
              </div>
            )}

            {/* General Network Connections checklist */}
            <div className="space-y-2 pt-3 border-t border-gray-800 text-xs">
              <span className="text-ksp-muted font-mono font-semibold uppercase tracking-wider text-[10px]">Connected Edges</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {NETWORK_EDGES.filter(e => e.source === activeNode.id || e.target === activeNode.id).map((edge) => {
                  const targetNode = NETWORK_NODES.find(n => n.id === (edge.source === activeNode.id ? edge.target : edge.source));
                  if (!targetNode) return null;

                  return (
                    <div key={edge.id} className="flex justify-between items-center bg-gray-900/40 p-2 border border-gray-900 rounded">
                      <span className="font-semibold text-gray-200">{targetNode.label}</span>
                      <span className="text-[9px] font-mono text-ksp-accent capitalize bg-gray-950 px-1.5 py-0.5 rounded">
                        {edge.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-ksp-muted">
            <Info className="h-8 w-8 text-gray-800 mb-2" />
            <p className="text-[10px]">Click any entity node inside the graph map to inspect telemetry data.</p>
          </div>
        )}
      </div>
    </div>
  );
};
