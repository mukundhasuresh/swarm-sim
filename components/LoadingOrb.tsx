"use client"

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingOrbProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
};

export default function LoadingOrb({ size = 'md', message }: LoadingOrbProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className={cn('relative', sizeClasses[size])}>
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00f5d4] to-cyan-400 opacity-75"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-r from-[#00f5d4] to-cyan-400"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
          }}
        />
        <motion.div
          className={cn('absolute inset-0 m-1 rounded-full border-2 border-white/20 bg-black/50')}
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      {message && (
        <motion.p 
          className="text-white/80 font-mono tracking-wider"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

