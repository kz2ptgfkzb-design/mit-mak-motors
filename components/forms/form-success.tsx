'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/** Shared inline success panel for the single-step forms. */
export function FormSuccess({ title, message }: { title: string; message: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
      <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-red shadow-glow">
        <Check className="h-8 w-8 text-white" />
      </span>
      <h3 className="mt-6 font-anton text-3xl uppercase tracking-tight text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-graphite-300">{message}</p>
    </motion.div>
  );
}
