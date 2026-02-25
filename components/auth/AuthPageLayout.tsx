/**
 * Layout partagé pour les pages Connexion / Inscription (Kafé Stockholm)
 * Fond épuré, couleurs de l'accueil, image et avis pour la confiance.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Shield, Lock } from 'lucide-react';
import { SITE } from '../../lib/site-config';
import { AuthReviewCard, AUTH_PAGE_REVIEWS, type AuthReview } from './AuthReviews';

const AUTH_HERO_IMAGE = '/images/hero-product.png';

// Médias qui parlent du Kafé Stockholm (mêmes images que la page d'accueil — tous)
const AUTH_MEDIA_ARTICLES = [
  { name: 'Restaurant Guru', url: 'https://fr.restaurantguru.com/Kafe-Stockholm-Lyon', src: '/images/Media articles stockholm/restaurant-guru.png' },
  { name: 'CityCrunch', url: 'https://lyon.citycrunch.fr/on-a-teste-kafe-stockholm-le-petit-bout-de-suede-de-lyon/2023/03/23/', src: '/images/Media articles stockholm/CityCrunch.png' },
  { name: 'TripAdvisor', url: 'https://www.tripadvisor.fr/Restaurant_Review-g187265-d25210557-Reviews-Kafe_Stockholm-Lyon_Rhone_Auvergne_Rhone_Alpes.html', src: '/images/Media articles stockholm/tripadvisor.png' },
  { name: 'Lyon Éco & Culture', url: 'https://www.lyonecoetculture.fr/kafe-stockholm-le-seul-cafe-scandinave-de-lyon-portrait/', src: '/images/Media articles stockholm/le bonbon.png' },
  { name: 'Foodetoi Lyon', url: 'https://foodetoilyon.com/kafe-stockholm-cafe-suedois-lyon1/', src: '/images/Media articles stockholm/foodetoi-lyon.png' },
  { name: 'À la lyonnaise', url: 'https://www.alalyonnaise.fr/food/anna-et-katarina-du-kafe-stockholm', src: '/images/Media articles stockholm/a-la-lyonnaise.png' },
  { name: 'Girls Take Lyon', url: 'https://girlstakelyon.com/kafe-stockholm-cafe-suedois-a-lyon/', src: '/images/Media articles stockholm/girls-take.png' },
  { name: 'Restaurants de France', url: 'https://cafe.restaurants-de-france.fr/kafe-stockholm-2205901.html', src: '/images/Media articles stockholm/Annuaire-des-restaurants-de-france.png' },
  { name: 'Tribune de Lyon', url: 'https://tribunedelyon.fr/restaurants-gastronomie/lyon-1er-kafe-stockholm-le-premier-cafe-suedois-de-lyon/', src: '/images/Media articles stockholm/tribune de lyon.png' },
  { name: 'Actu.fr', url: 'https://actu.fr/auvergne-rhone-alpes/lyon_69123/lyon-ce-cafe-suedois-unique-a-ouvert-en-ville-de-vraies-recettes-de-grands-meres_55636609.html', src: '/images/Media articles stockholm/actu.fr.png' },
];

export interface AuthPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export function AuthPageLayout({ children, title, subtitle, backHref = '/', backLabel = "Retour à l'accueil" }: AuthPageLayoutProps) {
  const displayReviews = AUTH_PAGE_REVIEWS.slice(0, 3);

  return (
    <div className="min-h-screen bg-kafe-bg flex flex-col lg:flex-row">
      {/* Panneau gauche : image + avis + confiance (caché sur mobile) */}
      <aside className="relative hidden lg:flex lg:w-[48%] min-h-screen flex-col">
        <div className="absolute inset-0">
          <Image
            src={AUTH_HERO_IMAGE}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="48vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-kafe-primary-dark/85 via-kafe-primary-dark/50 to-kafe-primary-dark/30"
            aria-hidden
          />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-10 text-white">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-refined border-2 border-white/50 bg-white/10 hover:bg-white/20 hover:border-white/70 text-white font-medium text-sm transition-all shadow-sm w-fit"
          >
            <Home className="w-4 h-4" />
            {backLabel}
          </Link>
          <div className="space-y-10">
            <div className="pt-6">
              <p className="text-white/90 text-sm font-medium mb-3">Ils nous font confiance</p>
              <div className="flex items-center gap-2 flex-wrap">
                <img
                  src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_48dp.png"
                  alt=""
                  className="h-5 w-auto opacity-95"
                />
                <span className="font-semibold text-lg">{SITE.googleRating}</span>
                <span className="text-white/80 text-sm">· {SITE.googleReviewsCount} avis Google</span>
              </div>
            </div>
            <div className="space-y-4">
              {displayReviews.map((review: AuthReview) => (
                <AuthReviewCard key={review.authorName + review.relativePublishTimeDescription} review={review} compact />
              ))}
            </div>
            {/* Médias qui parlent de nous */}
            <div className="mb-6">
              <p className="text-white/90 text-sm font-medium mb-4">Ils parlent de nous</p>
              <div className="grid grid-cols-5 gap-5">
                {AUTH_MEDIA_ARTICLES.map((media) => (
                  <a
                    key={media.name}
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-16 opacity-90 hover:opacity-100 transition-opacity"
                    title={media.name}
                  >
                    <img
                      src={media.src}
                      alt={media.name}
                      className="max-h-16 w-full max-w-[140px] object-contain object-center"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/80 pt-8 pb-2 mt-4 border-t border-white/20">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              Connexion sécurisée
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Données protégées
            </span>
          </div>
        </div>
      </aside>

      {/* Panneau droit : formulaire */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 bg-kafe-bg">
        <div className="w-full max-w-md">
          {/* Mobile : lien retour */}
          <div className="lg:hidden mb-6">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-refined border-2 border-kafe-primary bg-white text-kafe-primary hover:bg-kafe-primary hover:text-white font-medium text-sm transition-all shadow-sm"
            >
              <Home className="w-4 h-4" />
              {backLabel}
            </Link>
          </div>

          {/* Logo / titre */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="font-heading text-2xl lg:text-3xl text-kafe-primary-dark tracking-tight">
                {SITE.name}
              </h1>
              <p className="text-small text-kafe-muted mt-1">{SITE.tagline}</p>
            </Link>
          </div>

          {children}

          {/* Confiance (mobile) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-kafe-muted lg:hidden">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-kafe-accent">★</span> Google {SITE.googleRating} · {SITE.googleReviewsCount} avis
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              Sécurisé
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
