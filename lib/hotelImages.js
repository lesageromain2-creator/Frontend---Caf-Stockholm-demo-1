/**
 * Bibliothèque d'images hôtel - frontend/public/image-website
 * Chaque image est associée à un texte descriptif pour un affichage cohérent.
 * Les chemins sont relatifs à / (public).
 */

const IMG = (path) => `/image-website/${path}`;

// Préfixe pour images avec espaces/paranthèses (encodage URL)
const enc = (p) => encodeURI(p);

export const HOTEL_IMAGES = {
  /** Hébergement / bâtiment / extérieur */
  hotel: [
    { src: IMG(enc('hotel1.jpg')), alt: 'Façade de l\'hôtel', text: 'Notre établissement vous accueille dans un cadre élégant et chaleureux au cœur de la ville.' },
    { src: IMG(enc('hotel2.jpg')), alt: 'Hall d\'entrée', text: 'Un hall raffiné où le personnel vous accueille avec le sourire.' },
    { src: IMG(enc('hotel4.jpg')), alt: 'Ambiance de l\'hôtel', text: 'Découvrez une atmosphère unique mêlant confort et élégance.' },
    { src: IMG(enc('hotel5.jpg')), alt: 'Espaces communs', text: 'Des espaces pensés pour votre bien-être et votre détente.' },
    { src: IMG(enc('hotel6.jpg')), alt: 'Architecture', text: 'Une architecture soignée qui reflète notre attention aux détails.' },
    { src: IMG(enc('hotel8.jpg')), alt: 'Décoration intérieure', text: 'Un design contemporain au service de votre confort.' },
    { src: IMG(enc('hotel 7.jpg')), alt: 'Vue sur l\'hôtel', text: 'Un havre de paix en plein cœur de la ville.' },
    { src: IMG(enc('hotel10.jpg')), alt: 'Patio et jardin', text: 'Notre patio arboré, véritable havre de paix après une journée de visite.' },
  ],

  /** Chambres */
  rooms: [
    { src: IMG(enc('room2.jpg')), alt: 'Chambre double', text: 'Chambres climatisées avec literie haut de gamme et Wi-Fi gratuit.' },
    { src: IMG(enc('room3.jpg')), alt: 'Chambre confort', text: 'Des cocons de repos conçus pour vous ressourcer.' },
    { src: IMG(enc('room4.jpg')), alt: 'Chambre design', text: 'Salle de bain moderne, bureau de travail et tout le confort attendu.' },
  ],

  /** Petit-déjeuner / Restauration */
  breakfast: [
    { src: IMG(enc('breakfast1.jpg')), alt: 'Buffet petit-déjeuner', text: 'Jus d\'orange fraîchement pressés, fruits frais et viennoiseries artisanales.' },
    { src: IMG(enc('breakfast2.jpg')), alt: 'Petit-déjeuner varié', text: 'Fromages, charcuteries, œufs et douceurs maison pour bien commencer la journée.' },
    { src: IMG(enc('breakfast3.jpg')), alt: 'Service petit-déjeuner', text: 'Dégustez en chambre sans supplément, ou au salon cosy.' },
  ],

  /** Spa */
  spa: [
    { src: IMG(enc('spa.jpg')), alt: 'Espace spa', text: 'Un espace dédié à la relaxation et au bien-être.' },
    { src: IMG(enc('spa1 (1).jpg')), alt: 'Soins spa', text: 'Des soins prodigués par des professionnels passionnés.' },
    { src: IMG(enc('spa1 (2).jpg')), alt: 'Ambiance spa', text: 'Une parenthèse de sérénité dans votre séjour.' },
    { src: IMG(enc('spa1 (3).jpg')), alt: 'Cabine spa', text: 'Cabines privées pour vos moments de détente.' },
    { src: IMG(enc('spa1 (4).jpg')), alt: 'Massage', text: 'Massages et traitements pour vous ressourcer.' },
    { src: IMG(enc('spa1 (5).jpg')), alt: 'Espace bien-être', text: 'Notre équipe bien-être à votre service.' },
    { src: IMG(enc('spa1 (6).jpg')), alt: 'Détente spa', text: 'Une atmosphère propice à l\'évasion.' },
    { src: IMG(enc('spa1 (7).jpg')), alt: 'Soins corporels', text: 'Des produits soigneusement sélectionnés pour votre peau.' },
    { src: IMG(enc('spa1 (8).jpg')), alt: 'Moment relaxation', text: 'Prenez le temps de vous chouchouter.' },
  ],

  /** Piscine */
  piscine: [
    { src: IMG(enc('piscine1.jpg')), alt: 'Piscine extérieure', text: 'Notre piscine pour des moments de fraîcheur et de détente.' },
    { src: IMG(enc('piscine2.jpg')), alt: 'Bord de piscine', text: 'Un espace aménagé pour profiter du soleil et de l\'eau.' },
    { src: IMG(enc('piscine3.jpg')), alt: 'Piscine et vue', text: 'Une vue apaisante pour vos pauses bien méritées.' },
    { src: IMG(enc('piscine 4.jpg')), alt: 'Zone piscine', text: 'Parfait pour se ressourcer après une journée de visite.' },
  ],

  /** Contact / Réservation en ligne */
  contact: [
    { src: IMG(enc('hand-logs-in-to-laptop.jpg')), alt: 'Réservation en ligne', text: 'Réservez directement sur notre site pour le meilleur tarif garanti.' },
  ],
};

/** Toutes les images pour la galerie (par catégorie) */
export const GALLERY_IMAGES = [
  ...HOTEL_IMAGES.hotel.map((i) => ({ ...i, category: 'hôtel' })),
  ...HOTEL_IMAGES.rooms.map((i) => ({ ...i, category: 'chambres' })),
  ...HOTEL_IMAGES.breakfast.map((i) => ({ ...i, category: 'restauration' })),
  ...HOTEL_IMAGES.spa.map((i) => ({ ...i, category: 'spa' })),
  ...HOTEL_IMAGES.piscine.map((i) => ({ ...i, category: 'piscine' })),
];

/** Image hero par défaut (si pas d'image API) */
export const HERO_FALLBACK = HOTEL_IMAGES.hotel[0];
