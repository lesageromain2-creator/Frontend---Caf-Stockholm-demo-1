/**
 * Badges alimentaires (Vegan, Végétarien, Signature) — Kafé Stockholm
 */

import React from 'react';

type BadgeType = 'vegan' | 'vegetarian' | 'signature' | 'new';

const styles: Record<BadgeType, string> = {
  vegan: 'bg-[#2E7D32] text-white text-[0.7rem] px-2.5 py-0.5 rounded-capsule font-medium',
  vegetarian: 'bg-[#558B2F] text-white text-[0.7rem] px-2.5 py-0.5 rounded-capsule font-medium',
  signature: 'bg-kafe-accent text-kafe-primary-dark text-[0.7rem] px-2.5 py-0.5 rounded-capsule font-bold',
  new: 'bg-kafe-accent2 text-white text-[0.7rem] px-2.5 py-0.5 rounded-capsule font-medium',
};

const labels: Record<BadgeType, string> = {
  vegan: 'Vegan',
  vegetarian: 'Végétarien',
  signature: 'Signature',
  new: 'Nouveau',
};

interface DietaryBadgeProps {
  type: BadgeType;
  className?: string;
}

export default function DietaryBadge({ type, className = '' }: DietaryBadgeProps) {
  return (
    <span className={`inline-flex ${styles[type]} ${className}`}>
      {labels[type]}
    </span>
  );
}
