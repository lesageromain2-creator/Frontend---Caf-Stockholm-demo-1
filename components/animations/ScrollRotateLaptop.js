'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * PC fixe (écran + tour) : reste en place pendant que le contenu défile.
 * Nom du site uniquement sur l'écran. Rotation plus rapide et smooth (useSpring).
 * Éléments dynamiques : pulsation écran, curseur clignotant, float léger.
 */
export default function ScrollRotateLaptop({ className = '' }) {
  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end start'],
  });

  // Rotation plus rapide : plus de degrés pour moins de scroll
  const rotateYRaw = useTransform(
    scrollYProgress,
    [0, 0.12, 0.3, 0.5, 0.7, 0.88],
    [0, 45, 95, 145, 195, 240]
  );
  const rotateY = useSpring(rotateYRaw, {
    stiffness: 60,
    damping: 24,
    restDelta: 0.001,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.4, 0.75], [1, 0.98, 0.5, 0.1]);
  const scale = useTransform(scrollYProgress, [0, 0.12], [1, 0.97]);

  return (
    <motion.div
      className={`fixed inset-0 flex items-center justify-center pointer-events-none z-0 ${className}`}
      style={{ perspective: '1600px', transformStyle: 'preserve-3d' }}
      aria-hidden
    >
      <motion.div
        className="origin-center w-[min(320px,80vw)] md:w-[360px] lg:w-[420px]"
        style={{
          rotateY,
          opacity,
          scale,
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <svg
          viewBox="0 0 340 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-2xl"
          aria-hidden
        >
          <defs>
            <linearGradient id="pc-screen-bg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="pc-bezel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="50%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
            <linearGradient id="pc-tower" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4b5563" />
              <stop offset="40%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>
            <linearGradient id="pc-stand" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6b7280" />
              <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>
            <linearGradient id="screen-glow-brand" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.45" />
            </linearGradient>
            <filter id="pc-shadow" x="-15%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="6" stdDeviation="10" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Pied du moniteur */}
          <path
            d="M115 198 L225 198 L235 218 L105 218 Z"
            fill="url(#pc-stand)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            filter="url(#pc-shadow)"
          />
          <rect x="155" y="188" width="30" height="12" rx="2" fill="#374151" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />

          {/* Écran – cadre */}
          <path
            d="M50 25 L290 25 L298 185 L42 185 Z"
            fill="url(#pc-bezel)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.2"
          />
          {/* Face écran */}
          <rect x="62" y="38" width="216" height="138" rx="3" fill="url(#pc-screen-bg)" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
          {/* Zone écran – fond avec glow animé (pulsation) */}
          <rect x="65" y="41" width="210" height="132" rx="2" fill="url(#screen-glow-brand)" opacity="0.55">
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="67" y="43" width="206" height="128" rx="1" fill="#0f172a" />
          {/* Nom du site uniquement sur l'écran – centré */}
          <text
            x="170"
            y="105"
            textAnchor="middle"
            fill="#e2e8f0"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="18"
            fontWeight="700"
            letterSpacing="0.05em"
          >
            Le Sage Dev
          </text>
          {/* Curseur clignotant (élément dynamique) */}
          <rect x="258" y="108" width="3" height="14" rx="1" fill="#3B82F6">
            <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
          </rect>
          {/* Webcam */}
          <circle cx="170" cy="48" r="3" fill="#0f172a" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />

          {/* Tour */}
          <path
            d="M302 55 L330 55 L338 195 L294 195 Z"
            fill="url(#pc-tower)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            filter="url(#pc-shadow)"
          />
          <rect x="306" y="75" width="20" height="45" rx="1" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
          <line x1="310" y1="82" x2="322" y2="82" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
          <line x1="310" y1="92" x2="322" y2="92" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
          <line x1="310" y1="102" x2="322" y2="102" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
          <line x1="310" y1="112" x2="322" y2="112" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
          <circle cx="316" cy="62" r="2" fill="#22c55e" opacity="0.9" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
