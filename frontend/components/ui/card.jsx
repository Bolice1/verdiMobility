'use client';

import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';

export function Card({ className, children }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={cn(
        'glass rounded-[28px] border p-6 transition-all duration-300 ease-in-out',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
