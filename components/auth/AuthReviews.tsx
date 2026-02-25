/**
 * Avis positifs pour les pages Connexion / Inscription (Kafé Stockholm)
 * Extraits de la page d'accueil — affichage épuré en cartes.
 */

export interface AuthReview {
  authorName: string;
  text: string;
  relativePublishTimeDescription: string;
  rating: number;
}

export const AUTH_PAGE_REVIEWS: AuthReview[] = [
  {
    authorName: 'Mathilde Cornec',
    rating: 5,
    text: "Un café où l'accueil chaleureux vous plonge immédiatement dans l'ambiance suédoise. Tout est excellent, servi avec le sourire et la bonne humeur. Un coup de cœur à Lyon !",
    relativePublishTimeDescription: 'Visité en septembre 2025',
  },
  {
    authorName: 'Tiffany Tsr',
    rating: 5,
    text: "Excellente adresse de coffee-shop. L'endroit est agencé et décoré avec goût. On a craqué pour des kanelbulle excellentes. À tester sans hésiter.",
    relativePublishTimeDescription: 'Visité en septembre 2025',
  },
  {
    authorName: 'Amélie Touron',
    rating: 5,
    text: "Quel plaisir de trouver une brioche à la cannelle comme en Suède. Merci au Kafe Stockholm pour cette belle ambiance et ce voyage culinaire. Le personnel est réellement agréable.",
    relativePublishTimeDescription: 'septembre 2025',
  },
  {
    authorName: 'Romane',
    rating: 5,
    text: "Une belle découverte à Lyon. Le personnel très gentil, kanel bulle et crumble délicieux, allongé de très bonne qualité. Je recommande vivement ce café !",
    relativePublishTimeDescription: 'Visité en mars 2025',
  },
];

function getAvatarColor(name: string): string {
  const hues = [210, 180, 150, 280, 340];
  let n = 0;
  for (let i = 0; i < name.length; i++) n += name.charCodeAt(i);
  return `hsl(${hues[n % hues.length]}, 45%, 45%)`;
}

export function AuthReviewCard({ review, compact = false }: { review: AuthReview; compact?: boolean }) {
  const displayText = compact && review.text.length > 100 ? review.text.slice(0, 100).trim() + '…' : review.text;
  return (
    <article
      className="rounded-xl bg-white/95 backdrop-blur p-4 flex flex-col shadow-card border border-kafe-border/50"
      style={{ boxShadow: '0 2px 12px rgba(13,42,92,0.06)' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
          style={{ background: getAvatarColor(review.authorName), fontFamily: 'var(--font-body)' }}
        >
          {(review.authorName || 'A').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-kafe-text truncate">{review.authorName}</p>
          <p className="text-xs text-kafe-muted">{review.relativePublishTimeDescription}</p>
        </div>
        <div className="flex gap-0.5 flex-shrink-0" aria-label={`${review.rating} étoiles`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={i <= review.rating ? 'text-kafe-accent' : 'text-kafe-border'} aria-hidden>★</span>
          ))}
        </div>
      </div>
      <p className="text-sm text-kafe-text-secondary leading-relaxed line-clamp-3">{displayText}</p>
    </article>
  );
}
