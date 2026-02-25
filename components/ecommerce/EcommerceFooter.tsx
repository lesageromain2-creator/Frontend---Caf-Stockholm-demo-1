/**
 * Footer Kafé Stockholm — La Carte, Nous, Légal, adresse, téléphone, Google, Instagram, YouTube
 * Fond charcoal (bleu marine), texte clair. Fondatrices en bas.
 */

import React from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site-config';

export default function EcommerceFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-kafe-primary-dark text-white mt-24">
      <div className="max-w-grid mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Marque */}
          <div className="md:col-span-4">
            <Link href="/" className="font-display text-2xl font-semibold text-white tracking-tight">
              {SITE.name}
            </Link>
            <p className="mt-4 text-small text-kafe-wood-light max-w-xs">
              {SITE.tagline}. {SITE.clickCollect}.
            </p>
          </div>

          {/* La Carte */}
          <div className="md:col-span-2">
            <h4 className="text-small font-heading font-semibold uppercase tracking-wider text-kafe-accent mb-4">La Carte</h4>
            <ul className="space-y-2">
              <li><Link href="/carte?category=boissons-chaudes" className="text-small text-kafe-wood-light hover:text-white transition-colors">Boissons chaudes</Link></li>
              <li><Link href="/carte?category=pains-garnis" className="text-small text-kafe-wood-light hover:text-white transition-colors">Pains garnis</Link></li>
              <li><Link href="/carte?category=patisseries" className="text-small text-kafe-wood-light hover:text-white transition-colors">Pâtisseries</Link></li>
              <li><Link href="/epicerie" className="text-small text-kafe-wood-light hover:text-white transition-colors">Épicerie suédoise</Link></li>
            </ul>
          </div>

          {/* Nous */}
          <div className="md:col-span-2">
            <h4 className="text-small font-heading font-semibold uppercase tracking-wider text-kafe-accent mb-4">Nous</h4>
            <ul className="space-y-2">
              <li><Link href="/notre-histoire" className="text-small text-kafe-wood-light hover:text-white transition-colors">Notre histoire</Link></li>
              <li><Link href="/privatisation" className="text-small text-kafe-wood-light hover:text-white transition-colors">Privatisation</Link></li>
              <li><Link href="/contact" className="text-small text-kafe-wood-light hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div className="md:col-span-2">
            <h4 className="text-small font-heading font-semibold uppercase tracking-wider text-kafe-accent mb-4">Légal</h4>
            <ul className="space-y-2">
              <li><Link href="/mentions-legales" className="text-small text-kafe-wood-light hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link href="/accessibilite" className="text-small text-kafe-wood-light hover:text-white transition-colors">Accessibilité</Link></li>
              <li><span className="text-small text-kafe-wood-light">LGBTQ+ Friendly ❤</span></li>
              <li><span className="text-small text-kafe-wood-light">Women-owned ♀</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-caption text-kafe-wood-light text-center sm:text-left">
            {SITE.address} · <a href={SITE.phoneTel} className="hover:text-white">{SITE.phone}</a> · ⭐ {SITE.googleRating}/5 Google
          </p>
          <div className="flex items-center gap-4">
            <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-kafe-wood-light hover:text-white transition-colors" aria-label="Instagram">
              Instagram
            </a>
            <a href={SITE.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-kafe-wood-light hover:text-white transition-colors" aria-label="Google Maps">
              Google Maps
            </a>
            <a href={SITE.youtubeIntroUrl} target="_blank" rel="noopener noreferrer" className="text-kafe-wood-light hover:text-white transition-colors" aria-label="YouTube">
              YouTube
            </a>
          </div>
        </div>
        <p className="mt-4 text-caption text-kafe-wood-light/80 text-center">
          © {currentYear} {SITE.name} — Fondé par {SITE.founders}
        </p>
      </div>
    </footer>
  );
}
