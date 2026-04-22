"use client"

import { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, Link, FileText, Newspaper, TrendingUp, Building2, BookOpen, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadTabProps {
  onContentReady: (content: string, scenario: string) => void;
}

type Scenario = 'public-opinion' | 'finance' | 'policy' | 'literary' | 'custom';

const scenarios = [
  { id: 'public-opinion', title: '📰 Public Opinion Event', desc: 'News events, social movements, elections' },
  { id: 'finance' as Scenario, title: '📈 Financial Signal', desc: 'Earnings reports, market events, mergers' },
  { id: 'policy' as Scenario, title: '🏛️ Policy Draft', desc: 'Legislation, regulations, government actions' },
  { id: 'literary' as Scenario, title: '📚 Literary Continuation', desc: 'Stories, novels, character developments' },
  { id: 'custom' as Scenario, title: '⚡ Custom Scenario', desc: 'Your own unique simulation setup' },
];

export default function UploadTab({ onContentReady }: UploadTabProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [url, setUrl] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('public-opinion');
  const [isExtracting, setIsExtracting] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const processFile = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (file.type === 'application/pdf') {
        // Simple PDF text extraction (base64 -> text approximation)
        reader.readAsText(file);
        reader.onload = () => {
          const text = reader.result as string;
          resolve(text.slice(0, 50000)); // Limit size
        };
      } else {
        // TXT, MD
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result as string);
      }
      reader.onerror = reject;
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown'];
      if (allowedTypes.some(type => file.type === type || file.name.match(/\\.(pdf|txt|md)$/i))) {
        setUploadedFile(file);
        processFile(file).then(setFileContent).catch(console.error);
      }
    }
  }, [processFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      processFile(file).then(setFileContent).catch(console.error);
    }
  }, [processFile]);

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    setFileContent('');
  }, []);

  const handleExtract = useCallback(async () => {
    setIsExtracting(true);
    const content = fileContent || textContent;
    if (content.trim()) {
      onContentReady(content, selectedScenario);
    }
    setTimeout(() => setIsExtracting(false), 1000);
  }, [fileContent, textContent, selectedScenario, onContentReady]);

  useEffect(() => {
    const ref = dropRef.current;
    if (!ref) return;
    ref.addEventListener('dragenter', handleDrag);
    ref.addEventListener('dragover', handleDrag);
    ref.addEventListener('dragleave', handleDrag);
    ref.addEventListener('drop', handleDrop);
    return () => {
      ref.removeEventListener('dragenter', handleDrag);
      ref.removeEventListener('dragover', handleDrag);
      ref.removeEventListener('dragleave', handleDrag);
      ref.removeEventListener('drop', handleDrop);
    };
  }, [handleDrag, handleDrop]);

  return (
    <div className="flex flex-col h-full gap-8 p-4 md:p-8">
      {/* Drag Drop Zone */}
      <motion.div
        ref={dropRef}
        className={cn(
          "flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
          dragActive 
            ? "border-[#00f5d4] bg-[#00f5d4]/5 ring-4 ring-[#00f5d4]/30 shadow-2xl" 
            : "border-white/20 hover:border-white/40"
        )}
      >
        <input 
          type="file" 
          accept=".pdf,.txt,.md" 
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
          <UploadCloud className="w-20 h-20 text-white/50 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Drop seed material here</h3>
          <p className="text-white/60 mb-6 max-w-md">PDF, TXT, or MD files • Up to 50MB</p>
        </label>
        
        <AnimatePresence>
          {uploadedFile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 w-full max-w-md"
            >
              <FileText className="w-8 h-8 text-[#00f5d4]" />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-white truncate">{uploadedFile.name}</p>
                <p className="text-sm text-white/60">{(uploadedFile.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <motion.button onClick={removeFile} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <X className="w-5 h-5 text-white/70 hover:text-white" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Alternative Inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 font-mono text-sm mb-3">Or paste text directly</label>
          <textarea
            placeholder='Paste a news article, policy draft, financial report, or story excerpt...'
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full h-32 p-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-[#00f5d4] focus:outline-none focus:ring-2 focus:ring-[#00f5d4]/30 resize-vertical glass backdrop-blur-sm"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-white/80 font-mono text-sm mb-3">
            <Link className="w-4 h-4" />
            Or enter a URL to scrape
          </label>
          <input
            type="url"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-[#00f5d4] focus:outline-none focus:ring-2 focus:ring-[#00f5d4]/30 glass backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Scenario Selector */}
      <div>
        <label className="block text-white font-bold mb-6 text-xl flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#00f5d4]" />
          Simulation Scenario
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <motion.button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group p-6 rounded-2xl border border-white/20 hover:border-[#00f5d4]/50 hover:shadow-2xl hover:shadow-[#00f5d4]/25 transition-all h-full",
                selectedScenario === scenario.id
                  ? "bg-gradient-to-r from-[#00f5d4]/20 border-[#00f5d4]/50 bg-white/10 shadow-2xl shadow-[#00f5d4]/20"
                  : "hover:bg-white/5"
              )}
            >
              <div className="font-bold text-white text-lg mb-2 group-hover:text-[#00f5d4]">{scenario.title}</div>
              <p className="text-white/60 text-sm">{scenario.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Extract Button */}
      <motion.button
        onClick={handleExtract}
        disabled={isExtracting || (!fileContent && !textContent)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-[#00f5d4] to-cyan-400 text-black font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-cyan-500/50 text-lg flex items-center justify-center gap-3 transition-all glass disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {isExtracting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Extracting...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            Extract Knowledge Graph →
          </>
        )}
      </motion.button>
    </div>
  );
}

