/**
 * Séparateur décoratif nordique (jaune → rouge) — Kafé Stockholm
 */

import React from 'react';

interface NordicDividerProps {
  className?: string;
}

export default function NordicDivider({ className = '' }: NordicDividerProps) {
  return (
    <div
      className={`w-[60px] h-0.5 rounded-sm my-4 mx-auto bg-gradient-to-r from-kafe-accent to-kafe-accent2 ${className}`}
      role="presentation"
      aria-hidden
    />
  );
}
