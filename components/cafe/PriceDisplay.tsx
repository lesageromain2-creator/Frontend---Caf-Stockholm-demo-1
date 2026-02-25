/**
 * Affichage prix en rouge Falun — Kafé Stockholm (cursorrules : prix toujours --color-accent2)
 */

import React from 'react';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceDisplay({
  price,
  compareAtPrice,
  currency = '€',
  className = '',
  size = 'md',
}: PriceDisplayProps) {
  const sizeClass = size === 'sm' ? 'text-small' : size === 'lg' ? 'text-lg' : 'text-price';
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  return (
    <div className={`font-body font-bold text-kafe-accent2 ${sizeClass} ${className}`}>
      {compareAtPrice != null && compareAtPrice > price && (
        <span className="text-kafe-muted line-through font-normal mr-2">
          {formatted}
          {currency}
        </span>
      )}
      <span>
        {formatted}
        {currency}
      </span>
    </div>
  );
}
