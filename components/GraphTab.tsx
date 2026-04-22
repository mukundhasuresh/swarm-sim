"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, Users, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Entity {
  id: string;
  name: string;
  type: 'person' | 'org' | 'event' | 'concept';
  description: string;
}

interface Relationship {
  from: string;
  to: string;
  label: string;
  strength: 'strong' | 'medium' | 'weak';
}

interface GraphData {
  entities: Entity[];
  relationships: Relationship[];
}

interface GraphTabProps {
  seedContent: string;
  onProceed: () => void;
}

export default function GraphTab({ seedContent, onProceed }: GraphTabProps) {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/extract-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: seedContent }),
      });
      if (!response.ok) throw new Error('Failed to extract graph');
      const data = await response.json() as GraphData;
      setGraphData(data);
    } catch (err) {
      setError('Failed to extract knowledge graph. Using mock data.');
      // Fallback mock data
      setGraphData({
        entities: [
          { id: '1', name: 'Sample Entity', type: 'concept' as const, description: 'Extracted from content' },
        ],
        relationships: [],
      });
    } finally {
      setLoading(false);
    }
  }, [seedContent]);

  useEffect(() => {
    if (seedContent) {
      fetchGraph();
    }
  }, [fetchGraph]);

  // Simple force-directed graph simulation
  useEffect(() => {
    if (!graphData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const entities = graphData.entities;
    const relationships = graphData.relationships;

    // Node positions, velocities
    const nodes = entities.map((entity, i) => ({
      ...entity,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
    }));

    let iteration = 0;
    const maxIterations = 300;

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 6, 15, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw relationships
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      relationships.forEach(rel => {
        const fromNode = nodes.find(n => n.id === rel.from);
        const toNode = nodes.find(n => n.id === rel.to);
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.stroke();
        }
      });

      // Update physics
      const repulsion = 1000;
      const spring = 0.01;
      const damping = 0.85;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (dist * dist);
          nodes[i].vx += (dx / dist) * force;
          nodes[i].vy += (dy / dist) * force;
          nodes[j].vx -= (dx / dist) * force;
          nodes[j].vy -= (dy / dist) * force;
        }
      }

      relationships.forEach(rel => {
        const fromNode = nodes.find(n => n.id === rel.from);
        const toNode = nodes.find(n => n.id === rel.to);
        if (fromNode && toNode) {
          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          nodes[fromNode].vx += (dx / dist) * spring * dist;
          nodes[fromNode].vy += (dy / dist) * spring * dist;
          nodes[toNode].vx -= (dx / dist) * spring * dist;
          nodes[toNode].vy -= (dy / dist) * spring * dist;
        }
      });

      // Apply damping and update positions
      nodes.forEach(node => {
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;

        // Boundaries
        node.x = Math.max(50, Math.min(canvas.width - 50, node.x));
        node.y = Math.max(50, Math.min(canvas.height - 50, node.y));
      });

      // Draw nodes
      entities.forEach(entity => {
        const node = nodes.find(n => n.id === entity.id)!;
        const colors = {
          person: '#00f5d4',
          org: '#a855f7',
          event: '#f59e0b',
          concept: '#10b981',
        };
        const color = colors[entity.type] || '#6b7280';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = '12px --font-mono';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(entity.name, node.x, node.y);
      });

      iteration++;
      if (iteration < maxIterations) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [graphData]);

  const typeColor = (type: Entity['type']) => {
    const colors = {
      person: 'text-cyan-400',
      org: 'text-purple-400',
      event: 'text-amber-400',
      concept: 'text-emerald-400',
    };
    return colors[type];
  };

  return (
    <div className="flex flex-col h-full gap-8 p-8">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-96 text-center"
          >
            <Loader2 className="w-16 h-16 text-[#00f5d4] animate-spin mb-8" />
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-white">Extracting entities and relationships</h3>
              <div className="text-white/60">Analyzing your document with Claude Sonnet...</div>
              <div className="flex gap-1 text-lg text-[#00f5d4]">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          </motion.div>
        ) : graphData ? (
          <>
            <motion.div
              key="graph"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/50 backdrop-blur-xl rounded-2xl border border-white/20 p-4 flex-1 max-h-[500px] overflow-hidden"
            >
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full h-auto mx-auto block rounded-xl shadow-2xl"
              />
            </motion.div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-[#00f5d4]" />
                  {graphData.entities.length} Entities • {graphData.relationships.length} Relationships
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 text-white/70 font-mono">Name</th>
                        <th className="text-left py-3 px-4 text-white/70 font-mono">Type</th>
                        <th className="text-left py-3 text-white/70 font-mono">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {graphData.entities.map((entity) => (
                        <tr key={entity.id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 font-bold text-white">{entity.name}</td>
                          <td><span className={cn('px-2 py-1 rounded-full text-xs font-mono', typeColor(entity.type))}>{entity.type}</span></td>
                          <td className="py-3 text-white/80 max-w-md">{entity.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <motion.button
                onClick={onProceed}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-[#00f5d4] to-cyan-400 text-black font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-cyan-500/50 text-lg flex items-center justify-center gap-3 mx-auto max-w-sm"
              >
                <Users className="w-5 h-5" />
                Proceed to Simulation →
              </motion.button>
            </div>
          </>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-96 text-white/50"
          >
            <Activity className="w-24 h-24 mb-8 opacity-50" />
            <h3 className="text-3xl font-bold mb-4">Knowledge Graph</h3>
            <p>Upload content first to extract entities and relationships</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

