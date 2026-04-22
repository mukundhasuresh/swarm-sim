"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, FastForward, Users, ArrowRight, Activity, PieChart, Hash, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Entity { id: string; name: string; type: string; description: string; }
interface Post {
  agentId: string;
  agentName: string;
  agentType: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  round: number;
  replyTo?: string;
}

interface SimulationTabProps {
  entities: Entity[];
  agentCount: number;
  rounds: number;
  platforms: string[];
  onGenerateReport: () => void;
}

const agentColors: Record<string, string> = {
  optimist: 'bg-emerald-400',
  skeptic: 'bg-red-400',
  analyst: 'bg-blue-400',
  activist: 'bg-amber-400',
  neutral: 'bg-gray-400',
};

const sentimentColors: Record<'positive' | 'negative' | 'neutral', string> = {
  positive: 'bg-emerald-400',
  negative: 'bg-red-400',
  neutral: 'bg-gray-400',
};

export default function SimulationTab({ 
  entities, 
  agentCount, 
  rounds, 
  platforms, 
  onGenerateReport 
}: SimulationTabProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState({
    sentimentDist: { positive: 0, negative: 0, neutral: 0 },
    keywords: ['AI', 'ethics', 'market', 'policy'],
    opinionShift: 12.5,
  });
  const wsRef = useRef<WebSocket | null>(null);

  const simulate = useCallback(async () => {
    setIsRunning(true);
    setPosts([]);
    setCurrentRound(1);

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entities, agentCount, rounds, platforms }),
      });
      const data = await response.json();
      let index = 0;

      const addPosts = () => {
        if (index < data.posts.length) {
          const newPosts = data.posts.slice(0, index + 3); // Batch 3
          setPosts(newPosts);
          
          // Update stats
          const sentiments = newPosts.map((p: Post) => p.sentiment);
          setStats({
            sentimentDist: sentiments.reduce((acc: any, s: string) => ({ ...acc, [s]: (acc[s] || 0) + 1 }), {}),
            keywords: ['AI', 'ethics', 'market', 'policy', 'future'],
            opinionShift: Math.random() * 20 + 5,
          });

          const round = newPosts[newPosts.length - 1]?.round || 1;
          setCurrentRound(round);
          index += 3;
          setTimeout(addPosts, 800);
        } else {
          setIsRunning(false);
        }
      };
      addPosts();
    } catch (error) {
      console.error('Simulation error:', error);
      setIsRunning(false);
    }
  }, [entities, agentCount, rounds, platforms]);

  const togglePause = () => setIsPaused(!isPaused);
  const skipToEnd = () => {
    setIsRunning(false);
    // Simulate complete posts
    setPosts(Array.from({ length: rounds * 5 }, (_, i) => ({
      agentId: `agent-${i % 5 + 1}`,
      agentName: `Agent ${i % 5 + 1}`,
      agentType: ['optimist', 'skeptic', 'analyst', 'activist', 'neutral'][i % 5],
      content: `Full simulation complete! Round ${Math.floor(i / 5) + 1} post.`,
      sentiment: ['positive', 'negative', 'neutral'][i % 3] as const,
      round: Math.floor(i / 5) + 1,
    })));
    setCurrentRound(rounds);
  };

  const getAgentInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="grid grid-cols-[1fr_300px] h-full gap-8">
      {/* Main Feed */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-2xl font-bold text-white">
              <Activity className="w-8 h-8 text-[#00f5d4]" />
              Live Agent Simulation
            </div>
            <div className="ml-auto flex gap-2">
              <motion.button
                onClick={simulate}
                disabled={isRunning}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-2 bg-[#00f5d4]/20 border border-[#00f5d4]/50 text-[#00f5d4] rounded-xl font-bold hover:bg-[#00f5d4]/40 transition-all"
              >
                <Play className="w-4 h-4 inline mr-1" />
                Start
              </motion.button>
              {isRunning && (
                <>
                  <motion.button onClick={togglePause} whileHover={{ scale: 1.05 }}>
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </motion.button>
                  <motion.button onClick={skipToEnd} whileHover={{ scale: 1.05 }}>
                    <FastForward className="w-5 h-5" />
                  </motion.button>
                </>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/60">
              <span>Round {currentRound} / {rounds}</span>
              <span>{agentCount.toLocaleString()} agents active</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <motion.div 
                className="bg-gradient-to-r from-[#00f5d4] to-cyan-400 h-3 rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${(currentRound / rounds) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-4">
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={`${post.agentId}-${post.round}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${agentColors[post.agentType as keyof typeof agentColors] || 'bg-gray-500'}`}>
                    {getAgentInitials(post.agentName)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-white truncate">{post.agentName}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-mono ${agentColors[post.agentType as keyof typeof agentColors] || ''}`}>
                        {post.agentType.charAt(0).toUpperCase() + post.agentType.slice(1)}
                      </span>
                      <span className="text-white/50 font-mono text-xs">· Round {post.round}</span>
                    </div>
                    <p className="text-white leading-relaxed mb-3">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-white/50">
                      <span className={`w-2 h-2 rounded-full ${sentimentColors[post.sentiment]}`} />
                      {post.replyTo && <span>↳ Replying to {post.replyTo}</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {posts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-white/50">
              <Users className="w-24 h-24 mb-4 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">Simulation Ready</h3>
              <p>Click Start to spawn agents and begin debate</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Sidebar */}
      <div className="space-y-6">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 sticky top-6 h-fit">
          <h4 className="font-bold text-white mb-6 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-[#00f5d4]" />
            Sentiment
          </h4>
          <div className="space-y-2 mb-6">
            {Object.entries(stats.sentimentDist).map(([sentiment, count]) => (
              <div key={sentiment} className="flex justify-between text-sm">
                <span className="capitalize text-white/80">{sentiment}</span>
                <span className="font-mono text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 sticky top-6 h-fit">
          <h4 className="font-bold text-white mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-[#00f5d4]" />
            Top Keywords
          </h4>
          <div className="space-y-1">
            {stats.keywords.slice(0, 6).map((kw, i) => (
              <div key={kw} className="flex justify-between text-sm">
                <span className="text-white/80">{kw}</span>
                <span className="text-[#00f5d4] font-mono">{(Math.random() * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 sticky top-6 h-fit">
          <h4 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00f5d4]" />
            Opinion Shift
          </h4>
          <div className="text-3xl font-bold text-[#00f5d4]">
            +{stats.opinionShift.toFixed(1)}%
          </div>
          <p className="text-white/60 text-sm mt-1">From simulation start</p>
        </div>

        {!isRunning && posts.length > 0 && (
          <motion.button
            onClick={onGenerateReport}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="w-full bg-gradient-to-r from-[#00f5d4] to-cyan-400 text-black font-bold py-4 px-6 rounded-2xl shadow-2xl hover:shadow-cyan-500/50 flex items-center justify-center gap-2 text-lg"
          >
            <ArrowRight className="w-5 h-5" />
            Generate Report →
          </motion.button>
        )}
      </div>
    </div>
  );
}

