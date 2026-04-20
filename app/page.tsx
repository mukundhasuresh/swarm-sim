"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Upload, Brain, Users, FileText, Zap, Award, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

const stats = [
  { value: 1000000, suffix: 'K+', label: 'Agents' },
  { value: 10000, suffix: '+', label: 'Simulations' },
  { value: 94, suffix: '%', label: 'Accuracy' },
];

const howItWorksSteps = [
  { icon: Upload, title: 'Upload Seed', desc: 'News, reports, PDFs, fiction' },
  { icon: Brain, title: 'Graph Extraction', desc: 'GraphRAG builds knowledge graph' },
  { icon: Users, title: 'Spawn Agents', desc: 'Thousands of AI personas with memory' },
  { icon: Zap, title: 'Social Evolution', desc: 'Agents interact over Twitter/Reddit-style channels' },
  { icon: Award, title: 'Prediction Report', desc: 'Executive summary + turning points + risks' },
];

const useCases = [
  { title: 'Public Opinion', desc: 'Predict social sentiment from news/articles', icon: BarChart3 },
  { title: 'Finance', desc: 'Model market reactions to earnings/reports', icon: Award },
  { title: 'Policy', desc: 'Simulate stakeholder reactions to legislation', icon: FileText },
  { title: 'Literary Continuation', desc: 'Evolve stories with character agents', icon: Brain },
];

function NumberCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(0);

  useEffect(() => {
    const duration = 2000;
    const start = ref.current;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      ref.current += increment;
      setCount(Math.min(Math.floor(ref.current), value));
      if (ref.current >= value) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Particle Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background-main/50 via-transparent to-[#00f5d4]/5" />
        <div id="particles" className="animate-pulse opacity-20" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20 text-center text-white">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-white to-[#00f5d4]/70 bg-clip-text text-transparent mb-8 leading-tight"
          >
            Simulate the Future
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl text-cyan-200/80 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Upload any document — MiroFish spawns thousands of AI agents that debate, evolve, and predict what happens next.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/console">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-[#00f5d4] hover:bg-[#00d4b4] text-black font-bold py-4 px-8 rounded-full text-lg flex items-center gap-2 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 glass backdrop-blur-sm"
              >
                Launch Console →
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="border-2 border-white/30 text-white/80 hover:text-white hover:border-white/50 py-4 px-8 rounded-full text-lg font-medium backdrop-blur-sm glass hover:bg-white/10 transition-all duration-300"
            >
              Watch Demo
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + idx * 0.1 }}
                className="text-center p-6 glass rounded-2xl backdrop-blur-md border border-white/20"
              >
                <div className="text-4xl md:text-5xl font-mono font-bold text-[#00f5d4] mb-2">
                  {animateStats ? (
                    <NumberCounter value={stat.value} suffix={stat.suffix} />
                  ) : (
                    '0'
                  )}
                </div>
                <div className="text-sm md:text-base text-white/70 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-32 px-4 max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-center text-white mb-24 bg-gradient-to-r from-white to-[#00f5d4]/50 bg-clip-text text-transparent"
        >
          How It Works
        </motion.h2>
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {howItWorksSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group flex-1 max-w-md p-8 glass rounded-3xl backdrop-blur-xl border border-white/10 hover:border-[#00f5d4]/30 hover:shadow-2xl hover:shadow-[#00f5d4]/20 transition-all duration-500 cursor-pointer relative"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#00f5d4] to-cyan-400 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform">
                <step.icon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-white/70 leading-relaxed">{step.desc}</p>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-background-main rounded-full border-4 border-white/20" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative z-10 py-32 px-4 max-w-7xl mx-auto bg-black/20">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-center text-white mb-24 bg-gradient-to-r from-white to-[#00f5d4]/50 bg-clip-text text-transparent"
        >
          Use Cases
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((usecase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group p-8 glass rounded-3xl backdrop-blur-xl border border-white/10 hover:border-[#00f5d4]/40 hover:bg-white/5 hover:shadow-2xl hover:shadow-[#00f5d4]/25 transition-all duration-500 h-full"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-[#00f5d4]/20 to-cyan-400/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm group-hover:bg-[#00f5d4]/30 transition-all">
                <usecase.icon className="w-10 h-10 text-[#00f5d4] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{usecase.title}</h3>
              <p className="text-white/70 leading-relaxed">{usecase.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-4 text-center border-t border-white/10 bg-black/50">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-xl text-white/60"
        >
          Powered by <span className="font-bold bg-gradient-to-r from-[#00f5d4] to-cyan-400 bg-clip-text text-transparent">Multi-Agent AI</span>
        </motion.p>
        <p className="text-sm text-white/30 mt-4">© 2024 MiroFish. All rights reserved.</p>
      </footer>
    </main>
  );
}
