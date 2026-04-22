"use client"

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  title: string;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose: () => void;
}

const variantStyles = {
  default: 'bg-white/10 border-white/20 text-white',
  success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
  warning: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
  error: 'bg-red-500/20 border-red-500/30 text-red-300',
};

export default function Toast({ id, title, description, variant = 'default', duration = 4000, onClose }: ToastProps) {
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timer.current = setTimeout(onClose, duration);
    return () => clearTimeout(timer.current!);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.95 }}
      className={cn(
        "fixed bottom-6 right-6 max-w-sm w-80 p-6 rounded-2xl backdrop-blur-xl shadow-2xl border glass z-50 cursor-pointer hover:shadow-white/20",
        variantStyles[variant]
      )}
      onClick={onClose}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-3 h-3 bg-white/30 rounded-full mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg leading-tight truncate">{title}</h3>
          <p className="text-sm opacity-90 leading-relaxed mt-0.5">{description}</p>
        </div>
        <motion.button
          whileHover={{ scale: 0.9 }}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition p-1 -m-1"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 h-1 rounded-b-2xl bg-gradient-to-r from-transparent via-white/50 to-transparent"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration }}
      />
    </motion.div>
  );
}

