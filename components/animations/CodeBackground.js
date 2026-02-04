'use client';

import { motion } from 'framer-motion';

const LINES = [
  'const project = await createSite()',
  'import { design, code } from "@/stack"',
  '// UX · Performance · SEO',
  'database.connect()',
  '<Layout><Component /></Layout>',
  'export default function App() {}',
  'interface Project { name: string }',
  'tailwind.config.js',
];

function CodeLine({ text, delay = 0 }) {
  return (
    <motion.div
      className="whitespace-nowrap font-mono text-xs text-white/10 md:text-sm"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 0.15, x: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      {text}
    </motion.div>
  );
}

/**
 * Fond hero avec lignes de "code" animées (effet décoratif).
 */
export default function CodeBackground({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-dark" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.2), transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139, 92, 246, 0.15), transparent 40%)',
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-around gap-4 px-6 py-12 md:gap-6 md:px-12">
        {LINES.map((line, i) => (
          <CodeLine key={i} text={line} delay={i * 0.12} />
        ))}
      </div>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
