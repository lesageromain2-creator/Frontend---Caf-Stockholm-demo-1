/**
 * Carte d'un article du menu — Kafé Stockholm (remplace ProductCard)
 * Affiche : photo, nom, nom suédois, description courte, badges, prix, + Ajouter
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DietaryBadge from './DietaryBadge';
import PriceDisplay from './PriceDisplay';

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  short_description?: string | null;
  swedish_name?: string | null;
  price: number;
  compare_at_price?: number | null;
  featured_image?: string | null;
  images?: string[] | null;
  is_vegan?: boolean;
  is_vegetarian?: boolean;
  is_signature?: boolean;
  service_period?: string | null;
  category_id?: string;
  category_slug?: string;
}

interface MenuCardProps {
  item: MenuItem;
  onAdd?: (item: MenuItem) => void;
  showAddButton?: boolean;
}

export default function MenuCard({ item, onAdd, showAddButton = true }: MenuCardProps) {
  const [imgError, setImgError] = React.useState(false);
  const imageUrl = item.featured_image || (item.images && item.images[0]) || null;
  const showImage = imageUrl && !imgError;
  const isLunchOnly = item.service_period === 'lunch';

  return (
    <article className="menu-card bg-white border border-kafe-border rounded-menu overflow-hidden transition-all duration-300 shadow-refined hover:shadow-refined-hover hover:-translate-y-1 hover:border-kafe-accent">
      <Link href={`/carte/${item.slug}`} className="block">
        <div className="aspect-[4/3] relative bg-kafe-surface">
          {showImage ? (
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-kafe-muted text-4xl" aria-hidden>
              ☕
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {item.is_vegan && <DietaryBadge type="vegan" />}
            {item.is_vegetarian && !item.is_vegan && <DietaryBadge type="vegetarian" />}
            {item.is_signature && <DietaryBadge type="signature" />}
            {isLunchOnly && (
              <span className="bg-kafe-primary/90 text-white text-[0.65rem] px-2 py-0.5 rounded-capsule">
                🕐 11h–18h
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/carte/${item.slug}`}>
          <h3 className="font-heading font-semibold text-kafe-text text-h3 mb-0.5">{item.name}</h3>
          {item.swedish_name && (
            <p className="text-kafe-muted text-small italic mb-2">{item.swedish_name}</p>
          )}
        </Link>
        {item.short_description && (
          <p className="text-kafe-text-secondary text-small mb-3 line-clamp-2">{item.short_description}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          <PriceDisplay price={item.price} compareAtPrice={item.compare_at_price} />
          {showAddButton && onAdd && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onAdd(item);
              }}
              className="btn-primary !py-2 !px-4 text-small rounded-lg transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ boxShadow: '0 4px 14px rgba(26,74,138,0.25)' }}
              aria-label={`Ajouter ${item.name} au panier`}
            >
              + Ajouter
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
