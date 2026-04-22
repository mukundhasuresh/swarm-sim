"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Play, Clock, CheckCircle, XCircle, ChevronRight, Zap, Users, FileText, MessageCircle, Settings, UploadCloud, Activity, BarChart3, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';


  const [mockSimulations, setMockSimulations] = useState([
    { id: 1, title: 'US Election 2024', timestamp: '2h ago', agents: 5000, status: 'running' as const },
    { id: 2, title: 'Tesla Q3 Earnings', timestamp: '1d ago', agents: 2500, status: 'complete' as const },
    { id: 3, title: 'Crypto Regulation', timestamp: '3d ago', agents: 1000, status: 'failed' as const },
  ]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSimRunning, setIsSimRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSimId, setCurrentSimId] = useState(4);

import UploadTab from '@/components/UploadTab';
import GraphTab from '@/components/GraphTab';
import SimulationTab from '@/components/SimulationTab';
import ReportTab from '@/components/ReportTab';
import ChatTab from '@/components/ChatTab';
import LoadingOrb from '@/components/LoadingOrb';
import { useToast } from '@/components/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = ['Upload', 'Graph', 'Simulation', 'Report', 'Chat'] as const;
type Tab = typeof tabs[number];

const [activeTab, setActiveTab] = useState<Tab>('Upload');

const modes = ['Public Opinion', 'Finance', 'Policy', 'Literature', 'Custom'] as const;
const models = ['GPT-4o', 'Claude 3.5', 'Gemini 1.5'] as const;

function StatusBadge({ status }: { status: 'running' | 'complete' | 'failed' }) {
  const color = status === 'running' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 
                status === 'complete' ? 'bg-green-500/20 border-green-500/50 text-green-300' : 
                'bg-red-500/20 border-red-500/50 text-red-300';
  return (
    <span className={cn("px-2 py-1 rounded-full text-xs font-mono border capitalize", color)}>
      {status}
    </span>
  );
}

export default function Console() {
  const [config, setConfig] = useState({
    name: '',
    mode: 'Public Opinion' as typeof modes[number],
    agents: 1000,
    rounds: 10,
    platforms: { twitter: true, reddit: true },
    model: 'GPT-4o' as typeof models[number],
  });

  const handleSliderChange = (key: 'agents' | 'rounds') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, [key]: parseInt(e.target.value) }));
  };

  const tabContent = {
    Upload: <div className="flex flex-col items-center justify-center h-96 text-white/50">
      <UploadCloud className="w-24 h-24 mb-8 opacity-50" />
      <h3 className="text-3xl font-bold mb-4">Upload Document</h3>
      <p>Drag &amp; drop PDF, news article, or text file to start</p>
    </div>,
    Graph: <div className="flex flex-col items-center justify-center h-96 text-white/50">
      <Activity className="w-24 h-24 mb-8 opacity-50" />
      <h3 className="text-3xl font-bold mb-4">Knowledge Graph</h3>
      <p>GraphRAG processing your document...</p>
    </div>,
    Simulation: <div className="flex flex-col items-center justify-center h-96 text-white/50">
      <Zap className="w-24 h-24 mb-8 opacity-50" />
      <h3 className="text-3xl font-bold mb-4">Agents Active</h3>
      <p className="text-lg">No active simulation</p>
      <p>Create one using the config panel</p>
    </div>,
    Report: <div className="flex flex-col items-center justify-center h-96 text-white/50">
      <BarChart3 className="w-24 h-24 mb-8 opacity-50" />
      <h3 className="text-3xl font-bold mb-4">Prediction Report</h3>
      <p>Complete report will appear here</p>
    </div>,
    Chat: <div className="flex flex-col items-center justify-center h-96 text-white/50">
      <MessageCircle className="w-24 h-24 mb-8 opacity-50" />
      <h3 className="text-3xl font-bold mb-4">Agent Chat</h3>
      <p>Live conversation between agents</p>
    </div>,
  };

  return (
    <div className="min-h-screen bg-background-main grid grid-cols-[280px_1fr_320px] h-screen overflow-hidden glass border border-white/10">
      
      {/* Left Panel - Simulations */}
      <div className="border-r border-white/10 bg-black/30 backdrop-blur-xl p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
          <Brain className="w-10 h-10 text-[#00f5d4]" />
          <div>
            <h1 className="text-2xl font-bold text-white">MiroFish</h1>
            <p className="text-sm text-white/60">Swarm Console</p>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-[#00f5d4] to-cyan-400 text-black font-bold py-4 px-6 rounded-xl mb-6 shadow-2xl hover:shadow-cyan-500/50 transition-all glass"
        >
          <Play className="w-5 h-5 inline mr-2" />
          New Simulation
        </motion.button>
        
        <div className="flex-1 overflow-auto">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Past Simulations
          </h3>
          <div className="space-y-2">
            {mockSimulations.map((sim) => (
              <motion.div
                key={sim.id}
                whileHover={{ x: 4 }}
                className="group p-4 rounded-xl bg-black/50 border border-white/20 hover:border-[#00f5d4]/50 hover:bg-white/5 transition-all cursor-pointer flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-white text-sm group-hover:text-[#00f5d4]">{sim.title}</div>
                  <div className="text-xs text-white/60 flex gap-2 items-center">
                    {sim.timestamp} • {sim.agents.toLocaleString()} agents
                  </div>
                </div>
                <StatusBadge status={sim.status} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Panel - Tabs & Content */}
      <div className="flex flex-col border-r border-white/10">
        <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-4">
          <div className="flex gap-1 bg-black/20 rounded-2xl p-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all relative",
                  activeTab === tab 
                    ? "bg-gradient-to-r from-[#00f5d4] to-cyan-400 text-black shadow-2xl shadow-[#00f5d4]/25" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel - Config */}
      <div className="border-l border-white/10 bg-black/30 backdrop-blur-xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#00f5d4]" />
          Simulation Config
        </h2>
        
        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-white/80 font-mono text-sm mb-2">Simulation Name</label>
            <input 
              type="text" 
              placeholder="e.g. 2024 Election Impact"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-[#00f5d4] focus:outline-none focus:ring-2 focus:ring-[#00f5d4]/30 transition-all glass backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="block text-white/80 font-mono text-sm mb-2">Mode</label>
            <select 
              value={config.mode}
              onChange={(e) => setConfig(prev => ({ ...prev, mode: e.target.value as typeof modes[number] }))}
              className="w-full p-3 bg-black/50 border border-white/20 rounded-xl text-white focus:border-[#00f5d4] focus:outline-none glass backdrop-blur-sm"
            >
              {modes.map(mode => <option key={mode} value={mode}>{mode}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-white/80 font-mono text-sm mb-2">Agent Count</label>
            <div className="relative">
              <input 
                type="range" 
                min="100" max="10000" step="100"
                value={config.agents}
                onChange={handleSliderChange('agents')}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="absolute -top-8 right-0 text-[#00f5d4] font-mono font-bold text-lg">
                {config.agents.toLocaleString()}
              </div>
            </div>
            <div className="text-xs text-white/50">100 - 10,000 agents</div>
          </div>

          <div>
            <label className="block text-white/80 font-mono text-sm mb-2">Rounds</label>
            <div className="relative">
              <input 
                type="range" 
                min="5" max="50" step="1"
                value={config.rounds}
                onChange={handleSliderChange('rounds')}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="absolute -top-8 right-0 text-[#00f5d4] font-mono font-bold text-lg">
                {config.rounds}
              </div>
            </div>
            <div className="text-xs text-white/50">5 - 50 interaction rounds</div>
          </div>

          <div>
            <label className="block text-white/80 font-mono text-sm mb-2">Platforms</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.platforms.twitter}
                  onChange={(e) => setConfig(prev => ({ ...prev, platforms: { ...prev.platforms, twitter: e.target.checked } }))}
                  className="w-4 h-4 text-[#00f5d4] bg-white/20 border-white/30 rounded focus:ring-[#00f5d4] focus:ring-2 transition"
                />
                <span className="text-white/80 text-sm">Twitter-style</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.platforms.reddit}
                  onChange={(e) => setConfig(prev => ({ ...prev, platforms: { ...prev.platforms, reddit: e.target.checked } }))}
                  className="w-4 h-4 text-[#00f5d4] bg-white/20 border-white/30 rounded focus:ring-[#00f5d4] focus:ring-2 transition"
                />
                <span className="text-white/80 text-sm">Reddit-style</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-white/80 font-mono text-sm mb-2">LLM Model</label>
            <select 
              value={config.model}
              onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value as typeof models[number] }))}
              className="w-full p-3 bg-black/50 border border-white/20 rounded-xl text-white focus:border-[#00f5d4] glass backdrop-blur-sm"
            >
              {models.map(model => <option key={model} value={model}>{model}</option>)}
            </select>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 w-full bg-gradient-to-r from-[#00f5d4] to-cyan-400 text-black font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-cyan-500/50 text-lg flex items-center justify-center gap-3 transition-all glass"
        >
          <Zap className="w-5 h-5" />
          Run Simulation
        </motion.button>
      </div>

      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #00f5d4;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 245, 212, 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #00f5d4;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(0, 245, 212, 0.5);
        }
      `}</style>
    </div>
  );
}
