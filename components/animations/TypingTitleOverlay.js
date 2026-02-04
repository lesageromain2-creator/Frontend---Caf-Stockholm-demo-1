'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const TITLE = 'Le Sage Dev';
const CHAR_DELAY_MS = 100;
const START_DELAY_MS = 600;

/** Même mapping que le PC 3D pour rotation synchronisée. */
const ROTATE_MAP = {
  input: [0, 0.12, 0.3, 0.5, 0.7, 0.88],
  output: [0, 45, 95, 145, 195, 240],
};

/**
 * Titre "Le Sage Dev" par-dessus le PC, mode écriture de code.
 * Rotation synchronisée avec le PC ; opacité qui diminue au scroll pour se fondre dans le fond bleu.
 */
export default function TypingTitleOverlay() {
  const [visibleLength, setVisibleLength] = useState(0);
  const { scrollYProgress } = useScroll({ offset: ['start start', 'end start'] });

  const rotateYRaw = useTransform(scrollYProgress, ROTATE_MAP.input, ROTATE_MAP.output);
  const rotateY = useSpring(rotateYRaw, { stiffness: 60, damping: 24, restDelta: 0.001 });
  /* Opacité : titre visible de 0 à 15 % du scroll, invisible de 15 % à 100 % */
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15, 1], [1, 0.5, 0, 0]);

  useEffect(() => {
    let intervalId;
    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        setVisibleLength((n) => (n >= TITLE.length ? n : n + 1));
      }, CHAR_DELAY_MS);
    }, START_DELAY_MS);
    return () => {
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const text = TITLE.slice(0, visibleLength);
  const showCursor = visibleLength < TITLE.length;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        perspective: '1600px',
        transformStyle: 'preserve-3d',
        rotateY,
        y: 'calc(-10% - 1cm)',
        opacity: scrollOpacity,
      }}
      aria-hidden
    >
      <div
        className="flex items-center font-heading text-4xl font-extrabold leading-[1.25] overflow-visible sm:text-5xl md:text-6xl lg:text-7xl"
        style={{
          letterSpacing: '0.02em',
          textShadow: '0 0 60px rgba(0, 217, 255, 0.15)',
          paddingBottom: '0.12em',
        }}
      >
        <span
          className="inline-block overflow-visible"
          style={{
            background: 'linear-gradient(135deg, #0066FF 0%, #00D9FF 40%, #22d3ee 70%, #a78bfa 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            paddingBottom: '0.18em',
          }}
        >
          {text}
        </span>
        {showCursor && (
          <span
            className="ml-2 inline-block h-[0.85em] w-1 animate-pulse rounded-sm bg-[#00D9FF]"
            style={{ minWidth: 4, boxShadow: '0 0 12px rgba(0, 217, 255, 0.6)' }}
            aria-hidden
          />
        )}
      </div>
    </motion.div>
  );
}
