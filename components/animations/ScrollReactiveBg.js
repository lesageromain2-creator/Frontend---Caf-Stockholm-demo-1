'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Fond dont l’opacité ou la position réagit au scroll (parallax doux).
 */
export default function ScrollReactiveBg({ className = '' }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [0.5, 0.1]);
  const y = useTransform(scrollY, [0, 600], [0, 80]);

  return (
    <motion.div
      className={`pointer-events-none fixed inset-0 -z-10 ${className}`}
      style={{ y }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-dark" />
      <motion.div
        className="absolute inset-0"
        style={{
          opacity,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(59, 130, 246, 0.25), transparent 50%), radial-gradient(ellipse 50% 40% at 80% 60%, rgba(139, 92, 246, 0.2), transparent 45%)',
        }}
      />
    </motion.div>
  );
}
