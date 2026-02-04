'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function AnimatedGradientText({
  children,
  className = '',
  animate = true,
}) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animate && !reducedMotion;

  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(90deg, #3B82F6, #06B6D4, #8B5CF6, #3B82F6)',
        backgroundSize: '200% auto',
        backgroundPosition: shouldAnimate ? undefined : '0% center',
      }}
      animate={
        shouldAnimate
          ? {
              backgroundPosition: ['0% center', '200% center'],
            }
          : {}
      }
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
}
