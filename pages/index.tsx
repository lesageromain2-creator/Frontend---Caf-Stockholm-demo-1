/**
 * Page d'accueil — Stockholm Kafé V3
 * Source: Figma node 2048:2 (Page acceuil). Do not improvise; values from get_figma_data.
 * Stack: React / Next.js / Tailwind
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import EcommerceLayout from '@/components/ecommerce/EcommerceLayout';
import { designTokens } from '@/lib/design-tokens';
import { SITE } from '@/lib/site-config';
import { useCartStore } from '@/lib/cart-store';
import { getMenuImageForProduct } from '@/lib/menu-images';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const { colors, fonts, fontSizes, lineHeights, layout, strokes } = designTokens;

// ─── Types Google Reviews ─────────────────────────────────────────────────────

interface GoogleReview {
  authorName: string;
  authorUri: string | null;
  authorPhotoUri: string | null;
  rating: number | null;
  text: string;
  relativePublishTimeDescription: string;
  googleMapsUri: string | null;
}

// ─── Types Instagram ──────────────────────────────────────────────────────────

interface InstagramPost {
  id: string;
  permalink: string;
  mediaUrl: string;
  caption: string;
  likeCount?: number;
  timestamp: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

// ─── Hero2 carousel (Figma Group-hero-2) ───────────────────────────────────────
// 5 images de gauche à droite ; ajouter carroussel-6.png … plus tard pour le défilement.
const HERO2_CAROUSEL_IMAGES = [
  '/images/carroussel-1.png',
  '/images/carroussel-2.png',
  '/images/carroussel-3.png',
  '/images/carroussel-4.png',
  '/images/carroussel-5.png',
];

// Images des colonnes gauche et droite du Hero 1 — carrousel mobile uniquement (affichées 1 par 1)
const HERO1_MOBILE_CAROUSEL_IMAGES = [
  '/images/product5-brunch.png',
  '/images/equipe.png',
  '/images/kanelbul.png',
  '/images/insta2.png',
  '/images/realproduct1.png',
  '/images/caption (5).jpg',
  '/images/realproduct10.png',
  '/images/acceuil-2.png',
];

// ─── Médias / articles qui parlent du Kafé Stockholm (carrousel « Ils parlent de nous ») ───
const MEDIA_ARTICLES_STOCKHOLM = [
  { name: 'Restaurant Guru', url: 'https://fr.restaurantguru.com/Kafe-Stockholm-Lyon', src: '/images/Media articles stockholm/restaurant-guru.png' },
  { name: 'CityCrunch', url: 'https://lyon.citycrunch.fr/on-a-teste-kafe-stockholm-le-petit-bout-de-suede-de-lyon/2023/03/23/', src: '/images/Media articles stockholm/CityCrunch.png' },
  { name: 'TripAdvisor', url: 'https://www.tripadvisor.fr/Restaurant_Review-g187265-d25210557-Reviews-Kafe_Stockholm-Lyon_Rhone_Auvergne_Rhone_Alpes.html', src: '/images/Media articles stockholm/tripadvisor.png' },
  { name: 'Lyon Éco & Culture', url: 'https://www.lyonecoetculture.fr/kafe-stockholm-le-seul-cafe-scandinave-de-lyon-portrait/', src: '/images/Media articles stockholm/le bonbon.png' },
  { name: 'Foodetoi Lyon', url: 'https://foodetoilyon.com/kafe-stockholm-cafe-suedois-lyon1/', src: '/images/Media articles stockholm/foodetoi-lyon.png' },
  { name: 'À la lyonnaise', url: 'https://www.alalyonnaise.fr/food/anna-et-katarina-du-kafe-stockholm', src: '/images/Media articles stockholm/a-la-lyonnaise.png' },
  { name: 'Girls Take Lyon', url: 'https://girlstakelyon.com/kafe-stockholm-cafe-suedois-a-lyon/', src: '/images/Media articles stockholm/girls-take.png' },
  { name: 'Restaurants de France', url: 'https://cafe.restaurants-de-france.fr/kafe-stockholm-2205901.html', src: '/images/Media articles stockholm/Annuaire-des-restaurants-de-france.png' },
  { name: 'Tribune de Lyon', url: 'https://tribunedelyon.fr/restaurants-gastronomie/lyon-1er-kafe-stockholm-le-premier-cafe-suedois-de-lyon/', src: '/images/Media articles stockholm/tribune de lyon.png' },
  { name: 'Lyon Éco & Culture', url: 'https://www.lyonecoetculture.fr/kafe-stockholm-le-seul-cafe-scandinave-de-lyon-portrait/', src: '/images/Media articles stockholm/Lyon éco et culture.png' },
  { name: 'Actu.fr', url: 'https://actu.fr/auvergne-rhone-alpes/lyon_69123/lyon-ce-cafe-suedois-unique-a-ouvert-en-ville-de-vraies-recettes-de-grands-meres_55636609.html', src: '/images/Media articles stockholm/actu.fr.png' },
];

// ─── Données de démo Instagram ────────────────────────────────────────────────
// Images : insta1 à insta10 dans /public/images/ (insta1.jpg, insta2.jpg, … ou .png)

const INSTAGRAM_LINKS = [
  'https://www.instagram.com/reel/DDchZx0iM6P/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  'https://www.instagram.com/p/DU0H4HeiHk6/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  'https://www.instagram.com/reel/DUqj0dDiKuF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  'https://www.instagram.com/p/DUBY3wjCEtX/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  'https://www.instagram.com/p/DTkVXsZiD0v/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  'https://www.instagram.com/p/DTZwhIVCBfj/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  'https://www.instagram.com/p/DRo-PYWCF9c/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  'https://www.instagram.com/p/DQrjTw1iD_r/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  'https://www.instagram.com/p/DQpDLq4CIu3/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  'https://www.instagram.com/p/DQeJuMRiBig/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
];

const INSTAGRAM_CAPTIONS = [
  "Quand deux amies suédoises, expatriées en France avec enfants et maris, laissent libre cours à leurs envies créatives, cela donne Kafé Stockholm, la plus hygge des cantines.",
  "☕ Une déco scandinave haute en couleurs, une ambiance chaleureuse, des tartines salées généreuses, des brioches addictives et toutes sortes de gourmandises et cafés, la recette séduit les Lyonnais.",
  "Demain c'est Mardi Gras et la grande journée du Semla - pour ceux qui veulent en commander, merci de nous appeler aujourd'hui 😉 / Tomorrow it's finally \"Fettisdagen\"/Mardi Gras\", and the day to feast on a Semla - call us for your orders today!",
  "All jokes aside, all love is welcomed here ♥️ Join us on Saturday for the day of love and a warm cup of coffee here at @kafestockholm 🫶 — video by @alyssa.naing",
  "Atelier « café-aquarelle » 🎨☕️ — Vous êtes nombreux à ne pas les connaître. Moi c'est Alizée, je suis aquarelliste & illustratrice et j'ai créé les ateliers « café-aquarelle » à Lyon y a 1 an. Ce sont des rendez-vous mensuel qui ont lieu au @kafestockholm. Des moments de partage où se mêle créativité et convivialité! 🌸 📆 Pour t'inscrire toutes les infos sont en story à la une \"Atelier Lyon\". Alors tu nous rejoins ?",
  "Merci \"Grains de sel\" pour le joli article publié dans votre édition de janvier 🙏.",
  "Vous l'attendiez avec l'impatience, la fameuse brioche traditionnelle « Semla » est de retour ! Vendredi 16 janvier, nos deux pâtissiers Claire et Victor seront tôt aux fourneaux pour vous régaler!",
  "🕯️ Le vendredi 13 décembre, nous célébrons Lucia en Suède. Pour la quatrième année consécutive nous organisons également cette fête traditionnelle au kafé. Trois concerts auront lieu: le 11 décembre à 19h, le 12 déc. à 19h, et le 13 décembre à 8h le matin. 🎟️ Concert + café ou vin chaud & brioche - 14 € ⚠️ Billets en vente uniquement au Kafé (aucune réservation prise via Instagram, email ou téléphone : premier arrivé, premier servi).",
  "Nous avons 3 ans!!!! Merci à tous nos clients, et à la meilleure équipe du monde! Venez nombreux jeudi 6 novembre et tentez votre chance pour gagner une corbeille pleine de classiques gastronomiques du nord 😄🥂",
  "VI SÖKER NY MEDARBETARE 💙! Är du utbildad KONDITOR eller BAGARE och intresserad av att jobba i Frankrikes matmecka? Vi letar efter dig som vill backa upp Claire, vår franska, glada konditor, och som dessutom gillar varierande arbetsuppgifter. Vi behöver nämligen också någon som kan göra våra goda mackor! Kafé Stockholm i centrala Lyon växer i rask takt och vi söker dig som vill hjälpa oss att utvecklas och utöka vårt svenskinfluerade sortiment. Du kommer att arbeta tillsammans med vår bagare i ett öppet kök och i ständig kontakt med både kunder och all annan personal, så lagarbete är något du gillar. Är du nyfiken på Frankrike, kompetent, organiserad och tycker om att ta egna initiativ är det här jobbet för dig. Franska är inget krav eftersom ägarna och flera i personalen är svenska. Det här är vad vi erbjuder: En heltidstjänst i en varm och trevlig atmosfär; med start den 2 januari 2026. En chans att vara med och skapa en unik mötesplats med svensk kultur i blickfånget. En tjänstebostad i samma arrondissement, på fem minuters gångavstånd från kaféet. Lägenheten är en fräsch, välplanerad och fullt möblerad etta med ett ordentligt kök. Låter detta attraktivt? Vi hinner bara med att läsa ansökningar skickade till vår mail! Skicka din ansökan och CV till: kafestockholm.lyon@gmail.com eller ring oss på +33 4 78 30 97 06 om du har frågor.",
];

// Dates de publication (ordre des posts 1 à 10)
const INSTAGRAM_PUBLISH_DATES = [
  new Date(2024, 11, 11).toISOString(),  // 11 décembre 2024
  new Date(2026, 1, 16).toISOString(),   // 16 février 2026
  new Date(2026, 1, 12).toISOString(),   // 12 février 2026
  new Date(2026, 0, 27).toISOString(),  // 27 janvier 2026
  new Date(2026, 0, 16).toISOString(),  // 16 janvier 2026
  new Date(2026, 0, 12).toISOString(),  // 12 janvier 2026
  new Date(2025, 10, 29).toISOString(), // 29 novembre 2025
  new Date(2025, 10, 5).toISOString(),  // 5 novembre 2025
  new Date(2025, 10, 4).toISOString(),  // 4 novembre 2025
  new Date(2025, 9, 31).toISOString(),  // 31 octobre 2025
];

function buildInstagramPosts(): InstagramPost[] {
  return Array.from({ length: 10 }, (_, i) => {
    const idx = i + 1;
    const permalink = INSTAGRAM_LINKS[i];
    const isReel = permalink.includes('/reel/');
  return {
      id: String(idx),
      permalink,
      mediaUrl: `/images/insta${idx}.png`,
      caption: INSTAGRAM_CAPTIONS[i],
      likeCount: [142, 98, 211, 187, 324, 156, 89, 203, 178, 95][i],
      timestamp: INSTAGRAM_PUBLISH_DATES[i],
      mediaType: isReel ? 'VIDEO' : 'IMAGE',
    };
  });
}

const DEMO_INSTAGRAM_POSTS: InstagramPost[] = buildInstagramPosts();

// ─── Avis Google affichés dans le carrousel (page d'accueil) ───────────────────

const FALLBACK_REVIEWS: GoogleReview[] = [
  {
    authorName: 'Tiffany Tsr',
    authorUri: null,
    authorPhotoUri: null,
    rating: 5,
    text: "Excellente adresse de coffee-shop. L'endroit est agencé et décoré avec goût. Les propositions donnent toutes envie ! On a craqué pour des « kanelbulle » qui étaient excellentes. À tester sans hésiter 🥐",
    relativePublishTimeDescription: 'Visité en septembre 2025',
    googleMapsUri: 'https://maps.app.goo.gl/gd7XK3SkTEt6ubKx8',
  },
  {
    authorName: 'Sassada Virasih',
    authorUri: null,
    authorPhotoUri: null,
    rating: 5,
    text: "Quand l'heure du goûter se transforme en un moment hors du temps… l'instant reste réellement figé le temps d'une pause lors d'une balade au cœur de la ville lyonnaise ! Je passe régulièrement à côté de ce lieu et je ne regrette pas une seule minute mon passage car l'accueil est fort sympathique grâce au staff. De plus, le cadre est apaisant et convivial, une mention spéciale pour la Kanelbulle et le Matcha… je comprends désormais mieux pourquoi une célèbre artiste internationale s'y est arrêtée récemment avant son concert le soir 🙏 Je recommande vivement ☀️",
    relativePublishTimeDescription: 'Local Guide · 89 avis',
    googleMapsUri: 'https://maps.app.goo.gl/GPz4L1zg1LeGWEPm7',
  },
  {
    authorName: 'Amélie Touron',
    authorUri: null,
    authorPhotoUri: null,
    rating: 5,
    text: "Quel plaisir de trouver une brioche à la cannelle comme nous la trouvons en Suède. Merci au Kafe Stockholm pour cette belle ambiance et ce voyage culinaire en Scandinavie. Et merci au personnel qui est réellement agréable, un vrai plaisir de prendre son petit déjeuner ici. Le petit plus, avoir l'option vegan même pour les boissons chaudes avec du lait de coco et avoine.",
    relativePublishTimeDescription: 'septembre 2025',
    googleMapsUri: 'https://maps.app.goo.gl/7gDyV9ac4vi6VTU57',
  },
  {
    authorName: 'Romane',
    authorUri: null,
    authorPhotoUri: null,
    rating: 5,
    text: "Une belle découverte à Lyon, café et pâtisserie suédoise ! Le personnel était très gentil malgré la grosse quantité de clients. Pour ce qui est de la nourriture, nous avons goûté un kanel bulle très bien fait avec un bon goût de cannelle pas du tout écœurant mais avec du caractère, un crumble aux fruits rouges succulent avec une délicieuse crème fouettée maison, ainsi qu'un slyvia bien moelleux et gourmand bien qu'assez sucré. Nous avons également bu un allongé de très bonne qualité ! Les prix sont tout à fait honnêtes pour la qualité de la nourriture et des boissons faites maison, je recommande vivement ce café !",
    relativePublishTimeDescription: 'Visité en mars 2025',
    googleMapsUri: 'https://maps.app.goo.gl/ScEvfis2yVwPkVUy6',
  },
  {
    authorName: 'Mathilde Cornec',
    authorUri: null,
    authorPhotoUri: null,
    rating: 5,
    text: "Un café où l'accueil chaleureux vous plonge immédiatement dans l'ambiance suédoise. Tout est excellent, servi avec le sourire et la bonne humeur. Un coup de cœur à Lyon !",
    relativePublishTimeDescription: 'Visité en septembre 2025',
    googleMapsUri: 'https://maps.app.goo.gl/TkJNzfD856kLr9ND7',
  },
  {
    authorName: 'Florence Brodu',
    authorUri: null,
    authorPhotoUri: null,
    rating: 5,
    text: "Nous avons passé un très bon moment au café. J'ai trouvé la nourriture délicieuse et le service chaleureux. Je suis rentrée avec ma poussette et j'ai pu allaiter mon bébé tranquillement. Bonne adresse pour jeune maman !",
    relativePublishTimeDescription: 'Visité en janvier 2026',
    googleMapsUri: 'https://maps.app.goo.gl/abaMVwjfjJMvxhuk8',
  },
  {
    authorName: 'Kassem Makki',
    authorUri: null,
    authorPhotoUri: null,
    rating: 5,
    text: "Ce café est devenu mon café préféré à Lyon. Leurs roulés à la cannelle, cardamome et même les originaux (noisettes) sont tops ! Je vous recommande leur Gröt, un plat idéal pour un petit déjeuner savoureux et healthy. Leurs sandwichs sont authentiques et ressemblent énormément à ceux qu'on trouve en Suède ! Les hôtesses sont hyper agréables et prennent vraiment le temps d'expliquer leurs produits. Vraiment à découvrir ce p'tit coin cosy.",
    relativePublishTimeDescription: 'Visité en février 2025',
    googleMapsUri: 'https://maps.app.goo.gl/wKoVzo4B5xKwpbLU7',
  },
  {
    authorName: 'Klara DEBADE',
    authorUri: null,
    authorPhotoUri: null,
    rating: 5,
    text: "Ambiance agréable, personnels au top, service rapide. Il y a même un espace dédié à ceux qui souhaitent travailler en mangeant. Moi et mon amie avons bien été accueillies, ce que je trouve rare aujourd'hui ! J'y retournerai !",
    relativePublishTimeDescription: 'Visité en octobre 2025',
    googleMapsUri: 'https://maps.app.goo.gl/fuKxKMQ7MR28tky88',
  },
  {
    authorName: 'Gérard Bourgès',
    authorUri: null,
    authorPhotoUri: null,
    rating: 5,
    text: "Voici au cœur de Lyon un écrin de Suède très agréable. La nourriture de qualité est proposée avec beaucoup de goût, la décoration est énergisante et l'accueil de Katarina est sympathique et chaleureux. Un petit coin de Suède où il fait bon faire une pause.",
    relativePublishTimeDescription: 'Visité en janvier 2024',
    googleMapsUri: 'https://maps.app.goo.gl/2PmSeP9ZTXNpUKMg6',
  },
  {
    authorName: 'Cleophee Colas',
    authorUri: null,
    authorPhotoUri: null,
    rating: 5,
    text: "Super adresse pour un déjeuner suédois, accueil et service impeccable dans un décor magnifique. Je vous recommande le chai thé latte et la tartine suédoise. Tout est fait maison avec des produits frais.",
    relativePublishTimeDescription: 'Visité en mai 2025',
    googleMapsUri: 'https://maps.app.goo.gl/oziRMCiHysfxpqgr6',
  },
  {
    authorName: 'Blue Lyre',
    authorUri: null,
    authorPhotoUri: null,
    rating: 5,
    text: "Café restaurant très chaleureux, avec une cuisine authentique et très bonne ! La déco des toilettes est incroyable.",
    relativePublishTimeDescription: 'Septembre 2025',
    googleMapsUri: 'https://maps.app.goo.gl/BLCUiUci3VyTMP217',
  },
  {
    authorName: 'Bruno LEROY - Epicuris event',
    authorUri: null,
    authorPhotoUri: null,
    rating: 5,
    text: "Dans les petites rues menant à La Croix Rousse, proche de l'Hôtel de Ville, ce petit café restaurant offre une expérience de la cuisine scandinave, à la réputation reconnue comme excellente pour la santé. On y découvre des sandwiches au saumon, aux petits pois, des gâteaux délicieux à la cardamome, cannelle, caramel et un café suédois qui n'a rien à envier à ceux de l'Italie. On ne sera donc pas étonné de savoir que la patronne des lieux est une Suédoise attentive à la bonne tenue de son établissement et dont la bonne humeur incite à un retour prochain au Kafe Stockholm.",
    relativePublishTimeDescription: 'Visité en février 2025',
    googleMapsUri: 'https://maps.app.goo.gl/sypNnzkBqsA6Fj8g7',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGoogleReviewsUrl() {
  if (!SITE.googlePlaceId) return SITE.googleMapsUrl;
  return `https://search.google.com/local/reviews?placeid=${encodeURIComponent(SITE.googlePlaceId)}`;
}

function formatInstagramDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function truncateCaption(text: string, max = 120): { short: string; full: string; truncated: boolean } {
  const withoutHashtags = text.replace(/#\w+/g, '').trim();
  if (withoutHashtags.length <= max) return { short: withoutHashtags, full: text, truncated: false };
  return { short: withoutHashtags.slice(0, max).trim() + '…', full: text, truncated: true };
}

function getAvatarColor(name: string): string {
  const palette = ['#4A90D9', '#E67E22', '#27AE60', '#8E44AD', '#E74C3C', '#16A085', '#2C3E50', '#D35400'];
  return palette[name.charCodeAt(0) % palette.length];
}

function buildReviewLink(review: GoogleReview, googleReviewsUrl: string): string {
  if (review.googleMapsUri) return review.googleMapsUri;
  if (review.authorUri) return review.authorUri;
  return googleReviewsUrl;
}

// ─── Sous-composant : étoiles ─────────────────────────────────────────────────

function StarRating({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} étoiles sur 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= rating ? '#F6B93B' : 'none'}
          stroke={star <= rating ? '#F6B93B' : '#D1D5DB'}
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

// ─── Sous-composant : PostCard Instagram ──────────────────────────────────────

function InstagramPostCard({ post }: { post: InstagramPost }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const caption = truncateCaption(post.caption);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setLikeCount((n) => Math.max(0, n - 1));
    } else {
      setLiked(true);
      setLikeCount((n) => n + 1);
    }
  };

  return (
    <article
      className="flex-shrink-0 w-[300px] sm:w-[320px] snap-start rounded-2xl overflow-hidden bg-white transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(13,42,92,0.15),0_4px_12px_rgba(0,0,0,0.08)]"
      style={{
        boxShadow: '0 4px 24px rgba(13,42,92,0.10), 0 1px 4px rgba(13,42,92,0.07)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
          <img src="/images/logo.png" alt="Kafé Stockholm" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight truncate" style={{ fontFamily: fonts.body, color: colors.textDark }}>
            kafestockholm
          </p>
          <p className="text-xs" style={{ fontFamily: fonts.body, color: colors.textMuted }}>
            {formatInstagramDate(post.timestamp)}
          </p>
        </div>
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Voir sur Instagram"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="ig-grad-card" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f09433" />
                <stop offset="50%" stopColor="#dc2743" />
                <stop offset="100%" stopColor="#bc1888" />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-grad-card)" />
            <circle cx="12" cy="12" r="4" stroke="url(#ig-grad-card)" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="url(#ig-grad-card)" />
          </svg>
        </a>
      </div>

      {/* Image cliquable */}
      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden"
        style={{ aspectRatio: '1/1' }}
        aria-label={`Voir le post : ${post.caption.slice(0, 60)}…`}
      >
        {!imgError ? (
          <img
            src={post.mediaUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #f09433 0%, #bc1888 100%)' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="white" />
            </svg>
            <span className="text-white text-xs font-medium">@kafestockholm</span>
          </div>
        )}
        {post.mediaType === 'VIDEO' && (
          <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-medium">▶ Vidéo</span>
        )}
        {post.mediaType === 'CAROUSEL_ALBUM' && (
          <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-medium">⊞ Album</span>
        )}
      </a>

      {/* Actions */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-1">
        <button onClick={handleLike} className="flex items-center gap-1.5 group" aria-label={liked ? 'Retirer le like' : 'Liker ce post'}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={liked ? '#E53E3E' : 'none'}
            stroke={liked ? '#E53E3E' : colors.textGray}
            strokeWidth="2"
            className="transition-all duration-200 group-hover:scale-110"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="text-sm font-semibold tabular-nums" style={{ fontFamily: fonts.body, color: liked ? '#E53E3E' : colors.textGray }}>
            {likeCount > 0 ? likeCount.toLocaleString('fr-FR') : ''}
          </span>
        </button>
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 group"
          aria-label="Commenter"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.textGray} strokeWidth="2" className="group-hover:stroke-blue-500 transition-colors">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </a>
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs font-medium hover:underline"
          style={{ fontFamily: fonts.body, color: colors.primaryLink }}
        >
          Voir →
        </a>
      </div>

      {/* Caption */}
      <div className="px-4 pb-4 pt-1">
        <p className="text-sm leading-relaxed" style={{ fontFamily: fonts.body, color: colors.textGray }}>
          {expanded ? post.caption : caption.short}
          {caption.truncated && !expanded && (
            <button onClick={() => setExpanded(true)} className="ml-1 font-semibold hover:underline" style={{ color: colors.textDark, fontFamily: fonts.body }}>
              plus
            </button>
          )}
          {expanded && caption.truncated && (
            <button onClick={() => setExpanded(false)} className="ml-1 font-semibold hover:underline" style={{ color: colors.textMuted, fontFamily: fonts.body }}>
              {' '}moins
            </button>
          )}
        </p>
      </div>
    </article>
  );
}

// ─── Sous-composant : ReviewCard Google ───────────────────────────────────────

function GoogleReviewCard({
  review,
  googleReviewsUrl,
  onReadMore,
  forceExpanded,
}: {
  review: GoogleReview;
  googleReviewsUrl: string;
  onReadMore?: (review: GoogleReview) => void;
  forceExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const link = buildReviewLink(review, googleReviewsUrl);
  const shouldTruncate = review.text.length > 160;
  const showFullText = forceExpanded || expanded || !shouldTruncate;
  const displayText = showFullText ? review.text : review.text.slice(0, 160).trim() + '…';

  const handleReadMore = () => {
    if (onReadMore) onReadMore(review);
    else setExpanded(!expanded);
  };

  return (
    <article
      className={`rounded-2xl bg-white flex flex-col ${forceExpanded ? 'w-full max-w-4xl shadow-2xl' : 'flex-shrink-0 w-[320px] sm:w-[400px] snap-start'}`}
      style={{
        boxShadow: '0 2px 16px rgba(13,42,92,0.08), 0 1px 4px rgba(13,42,92,0.05)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      {/* Header auteur */}
      <div className="flex items-center gap-3 p-4 pb-3">
        {review.authorPhotoUri ? (
          <img
            src={review.authorPhotoUri}
            alt={review.authorName}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-white"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: getAvatarColor(review.authorName), fontFamily: fonts.body }}
          >
            {(review.authorName || 'A').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight truncate" style={{ fontFamily: fonts.body, color: colors.textDark }}>
            {review.authorName}
          </p>
          <p className="text-xs mt-0.5" style={{ fontFamily: fonts.body, color: colors.textMuted }}>
            {review.relativePublishTimeDescription}
            {' · '}
            <span style={{ color: '#4285F4' }}>Google</span>
          </p>
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 p-1" aria-label="Voir sur Google">
          <img
            src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_48dp.png"
            alt="Google"
            className="h-5 w-auto opacity-90 hover:opacity-100 transition-opacity"
          />
        </a>
      </div>

      {/* Étoiles */}
      {review.rating != null && (
        <div className="px-4 pb-2">
          <StarRating rating={review.rating} size={15} />
        </div>
      )}

      {/* Texte */}
      <div className="px-4 pb-3 flex-1">
        <p className="text-sm leading-relaxed" style={{ fontFamily: fonts.body, color: colors.textGray, lineHeight: 1.65 }}>
          {displayText}
        </p>
        {shouldTruncate && !forceExpanded && (
          <button
            onClick={handleReadMore}
            className="text-xs font-semibold mt-1 hover:underline"
            style={{ fontFamily: fonts.body, color: colors.primaryLink }}
          >
            {expanded ? 'Réduire' : 'Lire la suite'}
          </button>
        )}
      </div>

      {/* Footer CTA */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-4 mb-4 mt-auto py-2.5 rounded-xl text-center text-xs font-semibold transition-colors hover:opacity-90"
        style={{
          background: 'rgba(66,133,244,0.08)',
          color: '#4285F4',
          fontFamily: fonts.body,
          border: '1px solid rgba(66,133,244,0.15)',
        }}
      >
        Voir l&apos;avis sur Google Maps →
      </a>
    </article>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function HomePage() {
  const [googleReviewsUri, setGoogleReviewsUri] = useState<string | null>(null);
  const googleReviewsUrl = googleReviewsUri ?? getGoogleReviewsUrl();
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [rating, setRating] = useState<string | null>(SITE.googleRating);
  const [userRatingCount, setUserRatingCount] = useState<string | null>(SITE.googleReviewsCount);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<GoogleReview | null>(null);
  const scrollYRef = useRef(0);
  const [signatureProducts, setSignatureProducts] = useState<Array<{ id: string; name: string; slug: string; short_description?: string | null; swedish_name?: string | null; price: number; featured_image?: string | null; is_vegan?: boolean }>>([]);
  const addItem = useCartStore((s) => s.addItem);

  // Refs et états scroll — Instagram
  const igScrollRef = useRef<HTMLDivElement>(null);
  const [igCanLeft, setIgCanLeft] = useState(false);
  const [igCanRight, setIgCanRight] = useState(true);

  // Refs et états scroll — Google
  const gScrollRef = useRef<HTMLDivElement>(null);
  const [gCanLeft, setGCanLeft] = useState(false);
  const [gCanRight, setGCanRight] = useState(true);

  // Popin avis : bloquer le scroll (position:fixed sur body) + fermer avec Escape
  useEffect(() => {
    if (!reviewModal) return;
    scrollYRef.current = window.scrollY;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setReviewModal(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.scrollTo({ top: scrollYRef.current, left: 0, behavior: 'instant' });
    };
  }, [reviewModal]);

  // Chargement des avis Google
  useEffect(() => {
    if (!SITE.googlePlaceId) {
      setReviewsLoading(false);
      return;
    }
    fetch(`${API_URL}/google-place-reviews?placeId=${encodeURIComponent(SITE.googlePlaceId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.reviewsUri) setGoogleReviewsUri(data.reviewsUri);
          if (Array.isArray(data.reviews) && data.reviews.length > 0) {
            setReviews(data.reviews);
            if (data.rating != null) setRating(String(data.rating));
            if (data.userRatingCount != null) setUserRatingCount(String(data.userRatingCount));
          }
        }
      })
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, []);

  // 4 produits signature pour "Nos incontournables"
  useEffect(() => {
    axios
      .get(`${API_URL}/products?limit=100`)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.products)) {
          const signatures = res.data.products
            .filter((p: { is_signature?: boolean }) => p.is_signature)
            .slice(0, 4)
            .map((p: Record<string, unknown>) => ({
              id: String(p.id),
              name: String(p.name ?? ''),
              slug: String(p.slug ?? ''),
              short_description: p.short_description != null ? String(p.short_description) : null,
              swedish_name: p.swedish_name != null ? String(p.swedish_name) : null,
              price: Number(p.price ?? 0),
              featured_image: p.featured_image != null ? String(p.featured_image) : null,
              is_vegan: Boolean(p.is_vegan),
            }));
          setSignatureProducts(signatures);
        }
      })
      .catch(() => {});
  }, []);

  // Helpers scroll Instagram
  const updateIgScroll = useCallback(() => {
    const el = igScrollRef.current;
    if (!el) return;
    setIgCanLeft(el.scrollLeft > 10);
    setIgCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = igScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateIgScroll, { passive: true });
    updateIgScroll();
    return () => el.removeEventListener('scroll', updateIgScroll);
  }, [updateIgScroll]);

  const scrollIg = (dir: 'left' | 'right') => {
    igScrollRef.current?.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  // Helpers scroll Google
  const updateGScroll = useCallback(() => {
    const el = gScrollRef.current;
    if (!el) return;
    setGCanLeft(el.scrollLeft > 10);
    setGCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = gScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateGScroll, { passive: true });
    updateGScroll();
    return () => el.removeEventListener('scroll', updateGScroll);
  }, [updateGScroll]);

  const scrollG = (dir: 'left' | 'right') => {
    gScrollRef.current?.scrollBy({ left: dir === 'left' ? -420 : 420, behavior: 'smooth' });
  };

  // Carrousel : toujours afficher les 3 avis choisis (Tiffany Tsr, Sassada Virasih, Amélie Touron)
  const displayReviews: GoogleReview[] = FALLBACK_REVIEWS;

  const writeReviewUrl = SITE.googlePlaceId
    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(SITE.googlePlaceId)}`
    : googleReviewsUrl;

  return (
    <>
      <Head>
        <title key="title">Kafé Stockholm — Café suédois authentique à Lyon</title>
      </Head>
      <EcommerceLayout noPadding>
        <div
          className="w-full min-w-full overflow-x-hidden pt-[72px] sm:pt-[86px] lg:pt-[96px]"
          style={{
            background: 'linear-gradient(to bottom, #F3D6D6 100px, #fff 100px)',
          }}
        >

          {/* Hero 1 — Quand menu déroulant (< lg) : image centrale seule, min 50vh. Desktop (lg) : 3 colonnes. */}
          <section
            className="relative w-full overflow-hidden bg-[#F3D6D6] mt-0 lg:mt-0 flex items-center justify-center min-h-[50vh] lg:min-h-[min(90vh,1080px)] py-6 lg:py-8"
            aria-label="Kafé Stockholm — Accueil"
          >
            {/* Image centrale seule : tout < lg (menu déroulant) — pas de barres latérales, occupe au moins 50vh */}
            <div
              className="flex lg:hidden justify-center items-center flex-1 min-h-[50vh] overflow-hidden"
              style={{ width: 'min(500px, 90vw)', isolation: 'isolate' }}
            >
              <img
                src="/images/titre page acceuil.png"
                alt="Kafé Stockholm — Fika"
                className="w-full h-auto max-h-[60vh] object-contain scale-105 sm:scale-100"
              />
            </div>

            {/* Desktop (lg) uniquement : disposition 3 colonnes avec barres latérales */}
            <div
              className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-row justify-center items-center flex-none w-[91.8%] max-w-[1762px]"
              style={{
                height: 'min(688px, 72vh)',
                gap: 'clamp(60px, 6vw, 110px)',
              }}
            >
              <div className="flex flex-col items-start flex-none h-full" style={{ width: '26%', maxWidth: 457, gap: 10 }}>
                <img src="/images/product5-brunch.png" alt="" aria-hidden className="w-full flex-1 min-h-0 object-cover rounded" style={{ aspectRatio: '457/286' }} />
                <img src="/images/equipe.png" alt="" aria-hidden className="w-full flex-shrink-0 object-cover rounded" style={{ aspectRatio: '457/256', maxHeight: '37%' }} />
                <div className="flex flex-row justify-center items-end w-full flex-shrink-0" style={{ height: 'clamp(52px, 15%, 104px)' }}>
                  <img src="/images/kanelbul.png" alt="" aria-hidden className="object-cover object-bottom h-full w-auto" style={{ aspectRatio: '89.19/100.29' }} />
                  <img src="/images/insta2.png" alt="" aria-hidden className="object-cover object-bottom h-full w-auto" style={{ aspectRatio: '75.4/100.53' }} />
                  <img src="/images/realproduct1.png" alt="" aria-hidden className="object-cover object-bottom h-full w-auto" style={{ aspectRatio: '97.36/99.8' }} />
                  <img src="/images/caption (5).jpg" alt="" aria-hidden className="object-cover object-bottom h-full w-auto hidden min-[1441px]:block" style={{ aspectRatio: '179.29/99.61' }} />
                </div>
              </div>
              <div className="relative flex flex-col justify-center items-center flex-none h-full" style={{ width: '40.5%', maxWidth: 714.6, isolation: 'isolate' }}>
                <img src="/images/titre page acceuil.png" alt="Kafé Stockholm — Fika" className="w-full h-full object-contain" style={{ zIndex: 0 }} />
                <img
                  src="/images/arriere-plan-pour-concepteurs-modele-3d-fete-nationale-drapeaux-nationaux-republique-populaire-france-suede_659987-17565 (3).png"
                  alt=""
                  aria-hidden
                  className="absolute object-contain object-center h-auto left-[52%] -translate-x-1/2 bottom-0 w-[clamp(66px,6.6vw,120px)]"
                  style={{ mixBlendMode: 'darken', zIndex: 1 }}
                />
              </div>
              <div className="flex flex-col items-end flex-none h-full" style={{ width: '21%', maxWidth: 371, gap: 10 }}>
                <img src="/images/realproduct10.png" alt="" aria-hidden className="w-full flex-1 min-h-0 object-cover rounded" style={{ aspectRatio: '371/451' }} />
                <img src="/images/acceuil-2.png" alt="" aria-hidden className="w-full flex-shrink-0 object-cover rounded" style={{ aspectRatio: '371/227.32', maxHeight: '33%' }} />
              </div>
            </div>
          </section>

          {/* Carrousel Hero 1 — images qui ne sont pas dans le hero (visible pour tous les formats avec menu déroulant, < lg) */}
          <section
            className="lg:hidden w-full overflow-hidden bg-[#F3D6D6] py-4"
            aria-label="Galerie Kafé Stockholm"
          >
            <div
              className="flex overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory gap-4 px-4 pb-2"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {HERO1_MOBILE_CAROUSEL_IMAGES.filter((_, i) => i !== 1).map((src, i) => (
                <div
                  key={src}
                  className="flex-shrink-0 snap-center overflow-hidden rounded-lg w-[42vw] max-w-[160px]"
                  style={{ aspectRatio: '4/5' }}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-product.png'; }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Identité Stockholm — bande bleue, responsive */}
          <section
            className="relative w-full overflow-hidden py-8 md:py-10"
            style={{ background: '#1A4A8A', minHeight: 'auto' }}
            aria-label="Pourquoi le Stockholm ?"
          >
            <div className="relative mx-auto w-full max-w-[1348px] px-4 sm:px-6 py-6 md:py-8">
              <div className="flex flex-col items-center w-full gap-8 md:gap-[67px]">
                <h2
                  className="text-center w-full"
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 600,
                    fontSize: 'clamp(22px, 4vw, 37.98px)',
                    lineHeight: 1.2,
                    color: '#FFFFFF',
                  }}
                >
                  Pourquoi le Stockholm ?
                </h2>
                <div className="flex flex-row items-center flex-none gap-2" style={{ gap: 35 }}>
                  <span className="w-8 md:w-[47.48px] h-px bg-[#F5C842] flex-none" />
                  <span className="w-8 md:w-[47.48px] h-px bg-[#F5C842] flex-none" />
                </div>
                <div className="flex flex-row items-start justify-center w-full flex-wrap gap-10 md:gap-12 min-[1348px]:flex-nowrap min-[1348px]:gap-[84px]">
                  <div className="flex flex-col items-center text-center w-full max-w-[386px] min-[1348px]:max-w-none min-[1348px]:w-[386px] flex-none gap-4 md:gap-[37px]">
                    <h3
                      className="text-center w-full"
                      style={{
                        fontFamily: fonts.display,
                        fontWeight: 600,
                        fontSize: 'clamp(20px, 3vw, 42.96px)',
                        lineHeight: 1.2,
                        color: '#FFFFFF',
                      }}
                    >
                      Fait maison
                    </h3>
                    <p
                      className="text-center w-full"
                      style={{
                        fontFamily: fonts.body,
                        fontWeight: 400,
                        fontSize: 'clamp(14px, 2.2vw, 24.55px)',
                        lineHeight: 1.35,
                        color: '#FFFFFF',
                      }}
                    >
                      Chaque plat préparé le matin par notre équipe avec des ingrédients frais sélectionnés.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center w-full max-w-[387px] min-[1348px]:max-w-none min-[1348px]:w-[387px] flex-none gap-4 md:gap-[42px]">
                    <h3
                      className="text-center w-full"
                      style={{
                        fontFamily: fonts.display,
                        fontWeight: 600,
                        fontSize: 'clamp(20px, 3vw, 42.96px)',
                        lineHeight: 1.2,
                        color: '#FFFFFF',
                      }}
                    >
                      100% suédois
                    </h3>
                    <p
                      className="text-center w-full"
                      style={{
                        fontFamily: fonts.body,
                        fontWeight: 400,
                        fontSize: 'clamp(14px, 2.2vw, 24.55px)',
                        lineHeight: 1.35,
                        color: '#FFFFFF',
                      }}
                    >
                      Recettes authentiques transmises de génération en génération, ingrédients éco-responsables.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center w-full max-w-[407px] min-[1348px]:max-w-none min-[1348px]:w-[407px] flex-none gap-4 md:gap-[46px]">
                    <h3
                      className="text-center w-full"
                      style={{
                        fontFamily: fonts.display,
                        fontWeight: 600,
                        fontSize: 'clamp(18px, 2.8vw, 39.89px)',
                        lineHeight: 1.2,
                        color: '#FFFFFF',
                      }}
                    >
                      Espace de vie
                    </h3>
                    <p
                      className="text-center w-full"
                      style={{
                        fontFamily: fonts.body,
                        fontWeight: 400,
                        fontSize: 'clamp(14px, 2.2vw, 24.55px)',
                        lineHeight: 1.35,
                        color: '#FFFFFF',
                      }}
                    >
                      Étudiants, télétravailleurs, familles — tout le monde est le bienvenu dans notre kafé.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hero2 — carousel 5 images + texte Välkommen (bande rose agrandie, bloc texte baissé) */}
          <section
            className="relative w-full overflow-hidden bg-[#F3D6D6] min-h-[min(92vh,680px)] pb-8 md:min-h-[min(100vh,760px)] md:pb-10 lg:min-h-[1150px]"
            aria-label="Välkommen — Kafé suédois à Lyon"
          >
            <div className="absolute inset-0 max-w-[1920px] mx-auto w-full h-full">
              <div
                className="absolute left-0 right-0 flex overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-2 px-2 sm:px-[2.45%]"
                style={{
                  top: 'clamp(12px, 3.61%, 39px)',
                  height: 'clamp(140px, 31.34vw, 338px)',
                  minHeight: 140,
                  gap: 'clamp(8px, 1.21vw, 23px)',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {HERO2_CAROUSEL_IMAGES.map((src, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 snap-start overflow-hidden rounded-sm"
                    style={{
                      aspectRatio: '330/338',
                      width: 'min(calc((100% - 4 * clamp(8px, 1.21vw, 23px)) / 5), 50vw)',
                      minWidth: 'min(140px, 38vw)',
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-product.png'; }}
                    />
                  </div>
                ))}
              </div>
              <div
                className="absolute left-0 right-0 top-[44%] md:top-[42%] lg:top-[40%] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-10 xl:gap-16 px-4 lg:px-8 xl:px-12 w-full max-w-[1920px] mx-auto"
                style={{
                  minHeight: 'min(280px, 449px)',
                }}
              >
                {/* Logo Stockholm — PC uniquement, à gauche */}
                <div className="hidden lg:block flex-shrink-0 w-[min(160px,10vw)] xl:w-[min(200px,12vw)]">
                  <img src="/images/logo.png" alt="" aria-hidden className="w-full h-auto object-contain drop-shadow-sm" />
                </div>
                {/* Bloc texte + CTAs — centre */}
                <div className="w-[90%] sm:w-[85%] md:w-[44.22%] lg:flex-1 lg:max-w-[720px] text-center">
                  <h2
                    className="font-semibold"
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 'clamp(32px, 4.06vw, 77.86px)',
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                      color: '#233C9D',
                      marginBottom: 0,
                    }}
                  >
                    Välkommen !<br />Un peu de Suède à Lyon.
                  </h2>
                  <p
                    className="font-extrabold"
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 'clamp(18px, 1.85vw, 35.42px)',
                      lineHeight: 1.099,
                      letterSpacing: '0.0275em',
                      color: '#233C9D',
                      marginTop: 'clamp(12px, 2.1vw, 26px)',
                    }}
                  >
                    Kafé suédois authentique — Fait maison, chaque jour
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-5 mt-6 sm:mt-8">
                    <Link
                      href="/carte"
                      className="group inline-flex items-center justify-center font-semibold text-white border-2 transition-all duration-300 ease-out py-3 px-5 sm:py-4 sm:px-7 min-h-[48px] sm:min-h-[56px] rounded-lg hover:scale-[1.04] hover:shadow-xl hover:shadow-[#1A4A8A]/35 hover:-translate-y-0.5 hover:brightness-110 hover:border-amber-300 active:scale-[0.98] active:translate-y-0"
                      style={{
                        fontFamily: fonts.body,
                        lineHeight: 1.5,
                        letterSpacing: '0.02em',
                        background: '#1A4A8A',
                        borderColor: '#F5C842',
                        borderRadius: 8,
                        boxShadow: '0 4px 14px rgba(26, 74, 138, 0.25)',
                      }}
                    >
                      <span className="relative">Voir la carte</span>
                    </Link>
                    <Link
                      href="/privatisation"
                      className="group inline-flex items-center justify-center font-semibold text-white border-2 transition-all duration-300 ease-out py-3 px-5 sm:py-4 sm:px-6 min-h-[48px] sm:min-h-[56px] rounded-lg hover:scale-[1.04] hover:shadow-xl hover:shadow-[#1A4A8A]/35 hover:-translate-y-0.5 hover:brightness-110 hover:border-amber-300 active:scale-[0.98] active:translate-y-0"
                      style={{
                        fontFamily: fonts.body,
                        lineHeight: 1.5,
                        letterSpacing: '0.02em',
                        background: '#1A4A8A',
                        borderColor: '#F5C842',
                        borderRadius: 8,
                        boxShadow: '0 4px 14px rgba(26, 74, 138, 0.25)',
                      }}
                    >
                      <span className="relative">Réserver votre espace</span>
                    </Link>
                  </div>
                </div>
                {/* Drapeaux (Hero 1) — PC uniquement, à droite */}
                <div className="hidden lg:flex flex-shrink-0 items-center justify-center gap-4">
                  <img
                    src="/images/arriere-plan-pour-concepteurs-modele-3d-fete-nationale-drapeaux-nationaux-republique-populaire-france-suede_659987-17565 (3).png"
                    alt=""
                    aria-hidden
                    className="object-contain drop-shadow-sm"
                    style={{ height: 'clamp(72px, 5.5vw, 100px)', width: 'auto' }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Carrousel « Ils parlent de nous » — sous section Välkommen */}
          <section className="w-full py-6 md:py-8 overflow-hidden" style={{ background: colors.bgPage ?? '#FAF9F6' }}>
            <h2
              className="font-display font-semibold text-center"
              style={{ fontFamily: fonts.display, fontSize: `clamp(28px, 3vw, ${fontSizes.sectionH2Alt}px)`, lineHeight: 1.6, color: colors.primaryDark, marginBottom: 'clamp(20px, 2.8vw, 40px)' }}
            >
              Ils parlent de nous
            </h2>
            <div className="relative w-full overflow-hidden" aria-hidden>
              <div
                className="flex items-center gap-10 md:gap-14"
                style={{
                  width: 'max-content',
                  animation: 'mediaCarousel 45s linear infinite',
                }}
              >
                {[...MEDIA_ARTICLES_STOCKHOLM, ...MEDIA_ARTICLES_STOCKHOLM].map((item, i) => (
                  <a
                    key={`hero1-${i}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center justify-center rounded-lg transition-opacity hover:opacity-90 focus:opacity-90 focus:outline-none"
                    style={{ width: 140, height: 56 }}
                    title={item.name}
                  >
                    <img
                      src={item.src}
                      alt=""
                      className="max-w-full max-h-full w-auto h-full object-contain object-center"
                    />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Produits incontournables */}
          <section className="w-full py-10 md:py-14 lg:py-20 overflow-x-hidden" style={{ background: colors.bgPage }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2
                className="font-display font-semibold text-center"
                style={{ fontFamily: fonts.display, fontSize: `clamp(28px, 3vw, ${fontSizes.sectionH2Alt}px)`, lineHeight: 1.6, color: colors.primaryDark }}
              >
                Nos incontournables
              </h2>
              <div className="flex justify-center items-center gap-2 my-6" aria-hidden>
                <span style={{ width: 51.4, height: 1.07, background: colors.accent }} />
                <span style={{ fontFamily: fonts.body, fontSize: 15, color: colors.accent }}>✦</span>
                <span style={{ width: 51.4, height: 1.07, background: colors.accent }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {signatureProducts.map((item) => {
                  const imgUrl = getMenuImageForProduct(item.slug, item.name) || item.featured_image || null;
                  const priceFormatted = (item.price >= 100 ? item.price / 100 : item.price).toFixed(2).replace('.', ',') + ' €';
                  return (
                    <article
                      key={item.id}
                      className="rounded-xl overflow-hidden bg-white"
                      style={{ boxShadow: layout.cardShadow, borderRadius: layout.cardBorderRadius }}
                    >
                      <Link href={`/carte/${item.slug}`} className="block">
                        <div
                          className="h-52 w-full bg-cover bg-center"
                          style={{
                            backgroundImage: imgUrl ? `url(${imgUrl})` : 'none',
                            backgroundColor: colors.bgSurface,
                          }}
                        >
                          {item.is_vegan && (
                            <span className="inline-block mt-2 ml-3 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: colors.successBg, color: colors.success }}>🌱 Vegan</span>
                          )}
                          {!imgUrl && <span className="flex items-center justify-center h-full text-4xl text-kafe-muted">☕</span>}
                        </div>
                        <div className="p-4">
                          <p className="uppercase text-sm" style={{ fontFamily: fonts.body, fontSize: fontSizes.label, letterSpacing: '10%', color: colors.textMuted }}>{item.swedish_name || item.name}</p>
                          <h3 className="font-display font-semibold mt-1" style={{ fontFamily: fonts.display, fontSize: fontSizes.cardTitle, color: colors.primaryDark }}>{item.name}</h3>
                          <p className="mt-1 text-sm" style={{ fontFamily: fonts.body, fontSize: fontSizes.cardDesc, lineHeight: 1.6, color: colors.textGray }}>{item.short_description || ''}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-bold" style={{ fontFamily: fonts.body, fontSize: fontSizes.cardPrice, color: colors.primaryLink }}>{priceFormatted}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addItem({ productId: item.id, name: item.name, sku: item.slug, price: item.price >= 100 ? item.price / 100 : item.price, quantity: 1, image: imgUrl || '', slug: item.slug, maxStock: 99 });
                              }}
                              className="px-4 py-2 rounded-lg text-white text-sm font-bold transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-lg hover:shadow-[#1A4A8A]/30 hover:-translate-y-0.5 active:scale-[0.98]"
                              style={{ fontFamily: fonts.button, background: colors.primaryLink, borderRadius: layout.buttonBorderRadius, boxShadow: '0 4px 14px rgba(26,74,138,0.25)' }}
                            >
                              + Ajouter
                            </button>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
              <div className="text-center mt-10">
                <Link
                  href="/carte"
                  className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-xl hover:shadow-[#1A4A8A]/35 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
                  style={{
                    fontFamily: fonts.body,
                    fontSize: fontSizes.bodyTiny + 4,
                    color: colors.white,
                    background: colors.primaryLink,
                    border: strokes.cardBtn,
                    borderRadius: 8,
                    boxShadow: '0 4px 14px rgba(26,74,138,0.25)',
                  }}
                >
                  Voir toute la carte
                </Link>
              </div>
            </div>
          </section>

          {/* Equipe — texte au-dessus des deux images, sur une ligne, responsive tous formats */}
          <section className="w-full py-8 sm:py-10 md:py-14 lg:py-20 overflow-hidden" style={{ background: colors.primaryLink }}>
            <div className="max-w-6xl md:max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col items-center gap-6 sm:gap-8 md:gap-10">
              <h2
                className="font-display font-semibold text-center text-white w-full max-w-full min-w-0 break-words"
                style={{
                  fontFamily: fonts.display,
                  fontSize: 'clamp(20px, 4.5vw, 48px)',
                  lineHeight: 1.35,
                }}
              >
                Une équipe souriante et à l'écoute !
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 w-full max-w-full">
                <img
                  src="/images/equipe-1.png"
                  alt="Équipe"
                  className="w-full max-w-full h-48 sm:h-64 md:h-72 object-cover object-center rounded-lg flex-shrink-0 md:max-w-[min(42vw,480px)] md:max-h-[min(42vw,480px)]"
                />
                <img
                  src="/images/equipe-2-2ad45c.png"
                  alt="Équipe"
                  className="w-full max-w-full h-48 sm:h-64 md:h-72 object-cover object-center rounded-lg flex-shrink-0 md:max-w-[min(42vw,480px)] md:max-h-[min(42vw,480px)]"
                />
              </div>
            </div>
          </section>

          {/* Privatisation */}
          <section className="w-full py-10 md:py-14 lg:py-20 overflow-x-hidden" style={{ background: colors.bgCream }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                  <h2
                    className="font-display font-semibold"
                    style={{ fontFamily: fonts.display, fontSize: `clamp(28px, 3vw, ${fontSizes.sectionH2}px)`, lineHeight: 1.6, color: colors.primaryDark }}
                  >
                    Privatisez notre espace
                  </h2>
                  <div className="w-16 h-0.5 my-4" style={{ background: colors.accent }} />
                  <p className="mb-8" style={{ fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: 1.8, color: colors.textGray }}>
                    Deux salles jusqu'à 80 personnes · Journée ou soirée · Matériel conférence disponible · Wi-Fi gratuit. Idéal pour séminaires, anniversaires et événements d'entreprise.
                  </p>
                  <Link
                    href="/privatisation"
                    className="inline-flex items-center justify-center px-5 py-2.5 md:px-8 md:py-4 font-semibold text-white text-sm md:text-[25.22px] rounded-lg transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-xl hover:shadow-[#1A4A8A]/35 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
                    style={{ fontFamily: fonts.body, letterSpacing: '0.02em', background: colors.primaryLink, border: strokes.btnCta, borderRadius: 8, boxShadow: '0 4px 14px rgba(26,74,138,0.25)' }}
                  >
                    Nous contacter
                  </Link>
                </div>
                <div className="relative grid grid-cols-2 grid-rows-auto gap-2 md:grid-cols-5 md:grid-rows-2 md:gap-5">
                  {/* Grande image — sur mobile pleine largeur, hauteur réduite */}
                  <div className="col-span-2 relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg min-h-[100px] md:min-h-[420px] md:col-span-3 md:row-span-2" style={{ boxShadow: '0 20px 40px rgba(13,42,92,0.12)' }}>
                    <img src="/images/privatisation-2.jpg" alt="Espace privatisation" className="w-full h-full min-h-[100px] md:min-h-[420px] object-cover object-center -scale-x-100" />
                  </div>
                  {/* Deux petites images — sur mobile côte à côte, hauteur réduite */}
                  <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-md min-h-[100px] md:min-h-[200px] md:col-span-2">
                    <img src="/images/privatisation-1.png" alt="Salle privatisation" className="w-full h-full min-h-[100px] md:min-h-[200px] object-cover" />
                  </div>
                  <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-md min-h-[100px] md:min-h-[200px] md:col-span-2">
                    <img src="/images/privatisation-3.jpg" alt="Événement au Kafé" className="w-full h-full min-h-[100px] md:min-h-[200px] object-cover" />
                  </div>
                  <img src="/images/logo-section.png" alt="" className="absolute bottom-2 right-2 w-16 md:w-24 h-auto opacity-90 z-10" />
                </div>
            </div>
          </div>
        </section>

          {/* Visite Prince — Mobile : 1 image, texte adapté. Desktop : structure Figma (positions, polices, couleurs). */}
          <section className="relative w-full py-12 md:py-0 overflow-hidden min-h-[300px] md:min-h-0" style={{ background: '#fff' }}>
            {/* ——— Mobile (< md) ——— */}
            <div className="md:hidden relative flex min-h-[320px]">
              {/* Image du prince à gauche — visible en entier */}
              <div className="flex-shrink-0 w-[42%] min-w-[140px] self-stretch relative">
                <img
                  src="/images/prince-image.png"
                  alt="Prince Carl Philip"
                  className="absolute inset-0 w-full h-full object-cover object-bottom"
                />
              </div>
              {/* Drapeau + texte à droite */}
              <div className="flex-1 relative min-w-0">
                <img
                  src="/images/prince-visit.png"
                  alt=""
                  className="absolute right-0 top-0 h-full w-full min-w-[58vw] max-w-none object-cover object-left opacity-90"
                  style={{ width: '58vw' }}
                />
                <div className="relative z-10 flex flex-col items-center justify-center min-h-[280px] px-3 py-6 text-center min-w-0 max-w-full">
                  <h2
                    className="font-display font-extrabold text-white break-words"
                    style={{
                      fontFamily: fonts.display,
                      lineHeight: 1.25,
                      fontSize: 'clamp(18px, 5.5vw, 26px)',
                    }}
                  >
                    Le Prince est venu<br />nous rendre visite
                  </h2>
                  <p
                    className="mt-3 sm:mt-4 font-normal italic text-white break-words max-w-full"
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 'clamp(12px, 3.2vw, 16px)',
                      lineHeight: 1.35,
                    }}
                  >
                    En janvier 2023, Kafé Stockholm a eu l'honneur d'accueillir le Prince Carl Philip de Suède à l'occasion du Bocuse d'Or. Une fierté pour toute notre équipe.
                  </p>
                  <Link
                    href="/notre-histoire"
                    className="inline-block mt-4 sm:mt-5 px-3 py-2 sm:px-4 sm:py-2 rounded-full font-bold text-center transition-all duration-300 ease-out hover:scale-[1.05] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] max-w-full"
                    style={{
                      fontFamily: fonts.body,
                      letterSpacing: '0.04em',
                      fontSize: 'clamp(11px, 2.8vw, 14px)',
                      color: colors.primaryDark,
                      background: colors.accent,
                      borderRadius: layout.princeBadgeRadius,
                    }}
                  >
                    <span className="break-words">⭐ Certifié authentiquement suédois</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ——— Desktop (md+) : structure Figma scalable pour Mac / petits PC — deux images + texte en % */}
            <div
              className="hidden md:block relative w-full max-w-[1915px] mx-auto overflow-hidden"
              style={{
                background: '#fff',
                aspectRatio: '1915/803',
              }}
            >
              <div className="absolute inset-0 flex flex-row items-stretch">
                <img
                  src="/images/prince-image.png"
                  alt="Prince Carl Philip"
                  className="flex-none object-cover object-bottom w-[37.5%]"
                  style={{ maxWidth: 720 }}
                />
                <img
                  src="/images/prince-visit.png"
                  alt=""
                  className="flex-1 object-cover object-left min-w-0"
                />
              </div>

              {/* Bloc texte + badge — responsive : pas de débordement ni texte écrasé */}
              <div
                className="absolute z-10 flex flex-col items-end justify-center pr-[3%] sm:pr-[4%] xl:pr-[6%] pl-[2%] min-w-0 max-w-[62%]"
                style={{
                  left: '38%',
                  right: 0,
                  top: '6%',
                  bottom: '8%',
                  gap: 'clamp(6px, 1vw, 18px)',
                }}
              >
                <div className="flex flex-col justify-center items-end flex-1 min-h-0 w-full max-w-full overflow-hidden" style={{ gap: 'clamp(8px, 1.2vw, 25px)' }}>
                  <h2
                    className="font-display font-extrabold text-right break-words w-full"
                    style={{
                      fontFamily: 'Playfair Display',
                      fontWeight: 800,
                      fontSize: 'clamp(22px, 3.2vw, 85px)',
                      lineHeight: 1.2,
                      color: '#0D2A5C',
                    }}
                  >
                    Le Prince est venu<br />nous rendre visite
                  </h2>
                  <p
                    className="font-normal italic text-right w-full overflow-hidden break-words"
                    style={{
                      fontFamily: 'DM Sans',
                      fontSize: 'clamp(13px, 1.8vw, 52px)',
                      lineHeight: 1.25,
                      color: '#0D2A5C',
                    }}
                  >
                    En janvier 2023, Kafé Stockholm a eu l'honneur d'accueillir le Prince Carl Philip de Suède à l'occasion du Bocuse d'Or. Une fierté pour toute notre équipe.
                  </p>
                </div>

                <Link
                  href="/notre-histoire"
                  className="relative flex-none flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 xl:px-8 xl:py-3 rounded-[40px] transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] min-w-0 max-w-full"
                  style={{
                    minWidth: 'clamp(160px, 22vw, 488px)',
                    height: 'clamp(40px, 7vh, 69px)',
                    background: '#F5C842',
                    borderRadius: 40,
                    boxShadow: '0 4px 14px rgba(245,200,66,0.3)',
                  }}
                >
                  <span
                    className="font-bold text-center break-words px-1"
                    style={{
                      fontFamily: 'DM Sans',
                      fontWeight: 700,
                      fontSize: 'clamp(11px, 1vw, 22px)',
                      lineHeight: 1.25,
                      letterSpacing: '0.02em',
                      color: '#0D2A5C',
                    }}
                  >
                    ⭐ Certifié authentiquement suédois
                  </span>
                </Link>
              </div>
            </div>
          </section>

          {/* ─── Avis Google & Instagram ──────────────────────────────────────── */}
          <section className="w-full py-10 md:py-14 lg:py-20 overflow-x-hidden" style={{ background: colors.white }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2
                className="font-display font-semibold text-center"
                style={{ fontFamily: fonts.display, fontSize: `clamp(28px, 3vw, ${fontSizes.horaireH2}px)`, lineHeight: 1.6, color: colors.primaryDark }}
              >
                Les témoignages de nos clients
              </h2>
              <p className="text-center mt-3" style={{ fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: 1.6, color: colors.textGray }}>
                Découvrez ce que nos clients disent de nous !
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[8rem] mt-12">

                {/* ── Colonne gauche : Instagram ───────────────────────────── */}
                <div className="order-2 lg:order-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="font-display font-semibold"
                        style={{ fontFamily: fonts.display, fontSize: fontSizes.sectionH3, color: colors.primaryDark }}
                      >
                        Suivez-nous sur Instagram
                      </h3>
                      <p className="text-sm mt-0.5" style={{ fontFamily: fonts.body, lineHeight: 1.6, color: colors.textGray }}>
                        Découvrez nos créations, l&apos;ambiance et les nouveautés
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <button
                        onClick={() => scrollIg('left')}
                        disabled={!igCanLeft}
                        className="w-9 h-9 rounded-full border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                        style={{ borderColor: colors.bgSurface }}
                        aria-label="Post précédent"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <button
                        onClick={() => scrollIg('right')}
                        disabled={!igCanRight}
                        className="w-9 h-9 rounded-full border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                        style={{ borderColor: colors.bgSurface }}
                        aria-label="Post suivant"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* Profil cliquable */}
                  <a
                    href={SITE.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3.5 rounded-2xl border mb-5 hover:shadow-md transition-all duration-200 group"
                    style={{ borderColor: 'rgba(224,224,224,0.7)', background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)' }}
                  >
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <img src="/images/logo.png" alt="Kafé Stockholm" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base" style={{ fontFamily: fonts.body, color: colors.textDark }}>Kafé Stockholm</p>
                      <p className="text-sm" style={{ fontFamily: fonts.body, color: colors.textMuted }}>@kafestockholm · Lyon, France 🇸🇪</p>
                    </div>
                    <span
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white flex-shrink-0 transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{ background: 'linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)', fontFamily: fonts.body, boxShadow: '0 4px 14px rgba(220,39,67,0.3)' }}
                    >
                      S&apos;abonner
                    </span>
                  </a>

                  {/* Carrousel posts */}
                  <div className="relative">
                    <div
                      ref={igScrollRef}
                      className="flex gap-4 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {DEMO_INSTAGRAM_POSTS.map((post) => (
                        <InstagramPostCard key={post.id} post={post} />
                      ))}
                    </div>
                    {igCanRight && (
                      <div
                        className="absolute right-0 top-0 bottom-3 w-12 pointer-events-none"
                        style={{ background: `linear-gradient(to left, ${colors.white ?? '#ffffff'} 0%, transparent 100%)` }}
                      />
                    )}
                  </div>

                  {/* Lien bas */}
                  <div className="text-center mt-4">
                    <a
                      href={SITE.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                      style={{ fontFamily: fonts.body, color: colors.primaryLink }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                      </svg>
                      Voir tous nos posts sur Instagram
                    </a>
                  </div>
                </div>

                {/* ── Colonne droite : Google Reviews ──────────────────────── */}
                <div className="order-1 lg:order-2">
                  {/* Header note */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div>
                      <h3
                        className="font-display font-semibold"
                        style={{ fontFamily: fonts.display, fontSize: fontSizes.sectionH3, color: colors.primaryDark }}
                      >
                        Avis Google
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-3xl font-black tabular-nums" style={{ fontFamily: fonts.body, color: colors.primaryDark, lineHeight: 1 }}>
                          {rating ?? '4.8'}
                        </span>
                <div>
                          <StarRating rating={Math.round(parseFloat(rating ?? '4.8'))} size={18} />
                          <p className="text-xs mt-0.5" style={{ fontFamily: fonts.body, color: colors.textMuted }}>
                            {userRatingCount ?? '320'}+ avis
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end">
                      <button
                        onClick={() => scrollG('left')}
                        disabled={!gCanLeft}
                        className="w-9 h-9 rounded-full border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                        style={{ borderColor: colors.bgSurface }}
                        aria-label="Avis précédent"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <button
                        onClick={() => scrollG('right')}
                        disabled={!gCanRight}
                        className="w-9 h-9 rounded-full border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                        style={{ borderColor: colors.bgSurface }}
                        aria-label="Avis suivant"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* Bandeau "laisser un avis" */}
                  <a
                    href={writeReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 border hover:shadow-sm transition-all duration-200 group"
                    style={{ borderColor: 'rgba(66,133,244,0.25)', background: 'rgba(66,133,244,0.04)' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2">
                      <path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5" />
                      <path d="M17.5 2.5a2.121 2.121 0 0 1 3 3L12 14l-4 1 1-4 8.5-8.5z" />
                    </svg>
                    <span className="text-sm font-medium" style={{ fontFamily: fonts.body, color: '#4285F4' }}>
                      Partagez votre expérience sur Google
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2.5" className="ml-auto opacity-60 group-hover:opacity-100 transition-opacity">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </a>

                  {/* Carrousel avis */}
                  <div className="relative">
                    <div
                      ref={gScrollRef}
                      className="flex gap-4 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {reviewsLoading ? (
                        [1, 2, 3].map((i) => (
                          <div key={i} className="flex-shrink-0 w-[320px] sm:w-[400px] h-60 rounded-2xl bg-gray-100 animate-pulse snap-start" />
                        ))
                      ) : (
                        displayReviews.map((review, i) => (
                          <GoogleReviewCard
                            key={i}
                            review={review}
                            googleReviewsUrl={googleReviewsUrl}
                            onReadMore={(r) => setReviewModal(r)}
                          />
                        ))
                      )}
                    </div>
                    {gCanRight && (
                      <div
                        className="absolute right-0 top-0 bottom-3 w-12 pointer-events-none"
                        style={{ background: 'linear-gradient(to left, white 0%, transparent 100%)' }}
                      />
                    )}
                  </div>

                  {/* Lien bas */}
                  <div className="text-center mt-4">
                    <a
                      href={googleReviewsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                      style={{ fontFamily: fonts.body, color: colors.primaryLink }}
                    >
                      <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_48dp.png" alt="" className="h-4 w-auto" />
                      Voir tous les avis sur Google
                    </a>
                  </div>

                  {/* Photo sous avis — uniquement sur PC, image rétrécie (fond rose Café Stockholm) */}
                  <div className="hidden md:block mt-6 w-full flex justify-center">
                    <img
                      src="/images/photo sous avis (2).png"
                      alt=""
                      aria-hidden
                      className="max-w-[75%] w-full h-auto object-cover rounded-xl"
                    />
                  </div>
                </div>

              </div>

              {/* Ils parlent de nous — carrousel défilant en boucle (gauche → droite) */}
              <div className="mt-16 pt-10 border-t border-gray-200">
                <h2
                  className="font-display font-semibold text-center"
                  style={{ fontFamily: fonts.display, fontSize: `clamp(28px, 3vw, ${fontSizes.sectionH2Alt}px)`, lineHeight: 1.6, color: colors.primaryDark, marginBottom: 'clamp(20px, 2.8vw, 40px)' }}
                >
                  Ils parlent de nous
                </h2>
                <div className="relative w-full overflow-hidden" aria-hidden>
                  <div
                    className="flex items-center gap-10 md:gap-14"
                    style={{
                      width: 'max-content',
                      animation: 'mediaCarousel 45s linear infinite',
                    }}
                  >
                    {[...MEDIA_ARTICLES_STOCKHOLM, ...MEDIA_ARTICLES_STOCKHOLM].map((item, i) => (
                      <a
                        key={i}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center justify-center rounded-lg transition-opacity hover:opacity-90 focus:opacity-90 focus:outline-none"
                        style={{ width: 140, height: 56 }}
                        title={item.name}
                      >
                        <img
                          src={item.src}
                          alt=""
                          className="max-w-full max-h-full w-auto h-full object-contain object-center"
                        />
                      </a>
                    ))}
                  </div>
                </div>
                <style jsx global>{`
                  @keyframes mediaCarousel {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                `}</style>
              </div>
            </div>
          </section>

          {/* Horaires & Plan */}
          <section className="w-full py-10 md:py-14 lg:py-20 overflow-x-hidden" style={{ background: colors.bgPage, width: '100%' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2
                className="font-display font-semibold text-center"
                style={{ fontFamily: fonts.display, fontSize: `clamp(28px, 3vw, ${fontSizes.horaireH2}px)`, lineHeight: 1.6, color: colors.primaryDark }}
              >
                Horaires & Plan
              </h2>
              <div className="flex justify-center items-center gap-2 my-6" aria-hidden>
                <span style={{ width: 56, height: 1.17, background: colors.accent }} />
                <span style={{ fontFamily: fonts.body, fontSize: 16.33, color: colors.accent }}>✦</span>
                <span style={{ width: 56, height: 1.17, background: colors.accent }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="font-display font-semibold" style={{ fontFamily: fonts.display, fontSize: fontSizes.horaireLabel, color: colors.textDark }}>Ouverture</h3>
                  <p className="mt-2" style={{ fontFamily: fonts.body, fontSize: fontSizes.horaireBody, lineHeight: 1.7, color: colors.textGray }}>
                    Lundi – Vendredi : 8h – 18h<br />Samedi : 9h – 17h<br />Dimanche : Fermé
                  </p>
                  <h3 className="font-display font-semibold mt-6" style={{ fontFamily: fonts.display, fontSize: fontSizes.horaireLabel, color: colors.textDark }}>Service déjeuner</h3>
                  <p className="mt-2" style={{ fontFamily: fonts.body, fontSize: fontSizes.horaireBody, lineHeight: 1.7, color: colors.textGray }}>
                    Lundi – Vendredi : 12h – 14h30
                  </p>
                  <a href="tel:0400000000" className="block mt-4 font-medium" style={{ fontFamily: fonts.body, fontSize: fontSizes.horaireLink, color: colors.primaryLink }}>
                  10 rue Saint-Polycarpe, 69001 Lyon
                  </a>
                </div>
                <div className="relative rounded-xl overflow-hidden h-[280px] md:h-[320px]" style={{ borderRadius: layout.mapRadius }}>
                  <iframe
                    title="Carte — Kafé Stockholm, 10 Rue Saint-Polycarpe, 69001 Lyon"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2783.110286366467!2d4.831651976917796!3d45.768979971080505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4ebf3bd04a35b%3A0x18b5127b24dea598!2sKaf%C3%A9%20Stockholm!5e0!3m2!1sfr!2sfr!4v1771545094510!5m2!1sfr!2sfr"
                    className="w-full h-full border-0 block"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=10+rue+Saint-Polycarpe,+69001+Lyon,+France"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 inline-flex items-center justify-center px-4 py-2 font-medium text-sm shadow-md rounded-lg bg-white hover:bg-gray-50"
                    style={{ fontFamily: fonts.body, color: colors.primaryDark }}
                  >
                    Voir sur Google Maps
                  </a>
                </div>
            </div>
          </div>
        </section>

          </div>
      </EcommerceLayout>

      {/* Popin avis Google — fond assombri, scroll bloqué */}
      {reviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setReviewModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Avis en entier"
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <GoogleReviewCard
              review={reviewModal}
              googleReviewsUrl={googleReviewsUrl}
              forceExpanded
            />
          </div>
        </div>
      )}
    </>
  );
}