/**
 * Configuration et identité Kafé Stockholm — café suédois à Lyon
 * Utilisé partout (header, footer, métadonnées, etc.)
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kafestockholm.fr';

export const SITE = {
  name: 'Kafé Stockholm',
  baseUrl: BASE_URL,
  tagline: 'Un petit morceau de Suède à Lyon',
  description: 'Premier café suédois authentique de Lyon. Smörgås sur pain de seigle fait maison, kanelbullar, fika.',
  address: '10 rue Saint-Polycarpe, 69001 Lyon',
  phone: '04 78 30 97 06',
  phoneTel: 'tel:+33478309706',
  contactEmail: 'contact@kafestockholm.fr',
  googleMapsUrl: 'https://maps.google.com/?q=Kafé+Stockholm+Lyon',
  /** Place ID Google (pour ouvrir la page des avis). Priorité à NEXT_PUBLIC_GOOGLE_PLACE_ID, sinon fallback Kafé Stockholm Lyon. */
  googlePlaceId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || 'ChIJW6MEvfPr9EcRmKXeJHsStRg',
  instagramUrl: 'https://instagram.com/kafestockholm',
  youtubeIntroUrl: 'https://youtu.be/2cEtc7P9RyU',
  googleRating: '4.8',
  googleReviewsCount: '213',
  founders: 'Anna Notini-Williatte & Katarina Ronteix',
  foundedYear: '2022',
  openingGeneral: 'Lun 10h–18h / Mar–Ven 8h–18h / Sam 9h–18h / Dim fermé',
  lunchService: 'Mar–Sam 11h–18h uniquement',
  eventCapacity: '60',
  eventRooms: '2',
  wifi: 'Gratuit',
  clickCollect: 'Commande en ligne, retrait au café',
  legalPages: [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Accessibilité', href: '/accessibilite' },
    { label: 'LGBTQ+ Friendly', href: '/accessibilite#lgbtq' },
    { label: 'Women-owned', href: '/notre-histoire' },
  ] as const,
  navCarte: [
    { label: 'Boissons chaudes', href: '/carte?category=boissons-chaudes' },
    { label: 'Pains garnis', href: '/carte?category=pains-garnis' },
    { label: 'Pâtisseries', href: '/carte?category=patisseries' },
    { label: 'Épicerie suédoise', href: '/epicerie' },
  ] as const,
  navNous: [
    { label: 'Notre histoire', href: '/notre-histoire' },
    { label: 'Privatisation', href: '/privatisation' },
    { label: 'Contact', href: '/contact' },
  ] as const,
} as const;
