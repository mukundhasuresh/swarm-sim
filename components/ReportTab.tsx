"use client"

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, Play, ChevronDown, ChevronUp, AlertTriangle, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Post {
  agentId: string;
  agentName: string;
  agentType: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  round: number;
  replyTo?: string;
}

interface ReportData {
  executiveSummary: string;
  predictedOutcome: string;
  turningPoints: string[];
  riskFactors: string[];
  keyActors: string[];
  confidenceScore: number;
  alternativeScenarios: string[];
  narrative: string;
}

interface ReportTabProps {
  simulationData: Post[];
  onNewSimulation: () => void;
}

export default function ReportTab({ simulationData, onNewSimulation }: ReportTabProps) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedNarrative, setExpandedNarrative] = useState(false);

  const generateReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulationData }),
      });
      if (!response.ok) throw new Error('Failed to generate report');
      const data = await response.json() as ReportData;
      setReport(data);
    } catch (error) {
      console.error('Report error:', error);
      setReport({
        executiveSummary: 'Mock prediction report generated from simulation data.',
        predictedOutcome: 'Moderate success trajectory with identified risks.',
        turningPoints: ['Round 5: Consensus begins to form', 'Round 12: Key compromise reached'],
        riskFactors: ['Regulatory hurdles', 'Market volatility'],
        keyActors: ['Optimist Agent #2', 'Analyst Agent #4'],
        confidenceScore: 74,
        alternativeScenarios: ['Optimistic adoption', 'Pessimistic cancellation'],
        narrative: 'The simulation demonstrated typical debate dynamics with gradual convergence.',
      });
    } finally {
      setLoading(false);
    }
  }, [simulationData]);

  useEffect(() => {
    if (simulationData.length > 0) {
      generateReport();
    }
  }, [generateReport]);

  if (!report && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/50">
        <Award className="w-24 h-24 mb-8 opacity-50" />
        <h3 className="text-3xl font-bold mb-2">Prediction Report</h3>
        <p>Complete a simulation to generate your report</p>
      </div>
    );
  }

  const confidenceRingColor = report?.confidenceScore! > 80 ? 'ring-emerald-500/30' : 
                            report?.confidenceScore! > 60 ? 'ring-amber-500/30' : 'ring-red-500/30';

  return (
    <div className="flex flex-col h-full gap-8 p-8">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-96"
          >
            <div className="w-32 h-32 border-8 border-white/20 border-t-[#00f5d4] rounded-full animate-spin mb-8" />
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Generating Report</h3>
              <p className="text-white/60">Analyzing simulation data with prediction AI...</p>
            </div>
          </motion.div>
        ) : report ? (
          <>
            {/* Confidence Score */}
            <motion.div
              key="confidence"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-center max-w-md mx-auto mb-8"
            >
              <div className={cn(
                "w-48 h-48 rounded-full flex items-center justify-center mb-6 relative shadow-2xl",
                confidenceRingColor,
                'bg-gradient-to-r from-white/10 p-2'
              )}>
                <div className="w-full h-full bg-black/80 rounded-full flex items-center justify-center shadow-inner">
                  <div>
                    <div className="text-5xl font-bold text-white mb-2">{report.confidenceScore}%</div>
                    <div className="text-white/60 font-mono uppercase tracking-wider text-sm">
                      Confidence
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Executive Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white/10 via-black/50 to-[#00f5d4]/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-10 h-10 text-[#00f5d4]" />
                Executive Summary
              </h2>
              <p className="text-xl text-white/90 leading-relaxed max-w-4xl">{report.executiveSummary}</p>
            </motion.div>

            {/* Predicted Outcome */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Predicted Outcome</h2>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#00f5d4] to-white bg-clip-text text-transparent mb-4">
                {report.predictedOutcome}
              </div>
            </motion.div>

            {/* 3 Columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Turning Points
                </h3>
                <ul className="space-y-2 text-white/80">
                  {report.turningPoints.map((point, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-mono text-[#00f5d4] text-sm">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 lg:col-span-1">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Risk Factors
                </h3>
                <ul className="space-y-2 text-white/80">
                  {report.riskFactors.map((risk, i) => (
                    <li key={i} className="flex gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Key Actors
                </h3>
                <ul className="space-y-2 text-white/80">
                  {report.keyActors.map((actor, i) => (
                    <li key={i}>{actor}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Alternative Scenarios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/30">
                <h4 className="font-bold text-emerald-400 mb-4">Optimistic Scenario</h4>
                <p className="text-white/90">{report.alternativeScenarios[0]}</p>
              </div>
              <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30">
                <h4 className="font-bold text-red-400 mb-4">Pessimistic Scenario</h4>
                <p className="text-white/90">{report.alternativeScenarios[1]}</p>
              </div>
            </motion.div>

            {/* Narrative */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden"
            >
              <div 
                className="p-8 cursor-pointer select-none flex items-center justify-between"
                onClick={() => setExpandedNarrative(!expandedNarrative)}
              >
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  📖 Full Narrative Analysis
                </h2>
                {expandedNarrative ? <ChevronUp className="w-6 h-6 text-white/60" /> : <ChevronDown className="w-6 h-6 text-white/60" />}
              </div>
              <AnimatePresence>
                {expandedNarrative && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 pt-2">
                      <p className="text-lg text-white/90 leading-relaxed whitespace-pre-wrap max-w-4xl">
                        {report.narrative}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/20">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                className="flex-1 bg-gradient-to-r from-[#00f5d4] to-cyan-400 text-black font-bold py-4 px-6 rounded-xl shadow-2xl hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export PDF
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                className="flex-1 bg-white/10 border border-white/30 text-white font-bold py-4 px-6 rounded-xl hover:bg-white/20 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Report
              </motion.button>
              <motion.button 
                onClick={onNewSimulation}
                whileHover={{ scale: 1.02 }}
                className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold py-4 px-6 rounded-xl shadow-2xl hover:shadow-orange-500/50 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                New Simulation
              </motion.button>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

