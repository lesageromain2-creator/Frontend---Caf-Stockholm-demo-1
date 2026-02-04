// Hôtel La Grande Croix - Identité luxe (Lyon)
export const DEFAULT_HOTEL = {
  name: 'Hôtel La Grande Croix',
  tagline: "L'excellence à son apogée",
  address: '12 Place Bellecour',
  city: 'Lyon',
  postalCode: '69002',
  country: 'France',
  phone: '+33 (4) 78 62 91 00',
  email: 'contact@hotel-lagrandecroix.com',
};

export const HERO_SELLING_POINTS = [
  { title: 'Chambres climatisées et design', desc: 'Des cocons raffinés propices au repos.' },
  { title: 'Meilleur Prix Garanti', desc: 'Réservez directement pour nos tarifs exclusifs.' },
  { title: 'Emplacement d\'exception', desc: 'Cœur de Lyon, face à la Place Bellecour.' },
  { title: 'Service personnalisé', desc: 'Une équipe dédiée à votre séjour inoubliable.' },
];

export const SERVICES_LIST = [
  'Emplacement prestigieux',
  'Literie premium et hypoallergénique',
  'Réception 24h/24',
  'Établissement éco-responsable',
  'Wi-Fi haut débit gratuit',
  'Métro et tramway à proximité',
  'Patio arboré et terrasse',
  'Café & thé offerts de 11h à 22h',
];

export const REASONS_TO_BOOK = [
  { title: '100% de l\'offre disponible', desc: 'Toutes nos chambres et offres sur notre site.' },
  { title: 'Meilleur Tarif', desc: 'Tarifs exclusifs en réservation directe.' },
  { title: 'Transaction sécurisée', desc: 'Paiement en toute sécurité.' },
  { title: "Soutenez l'hôtelier", desc: 'En réservant direct, vous favorisez le local.' },
  { title: 'Contact humain', desc: 'Une équipe dédiée à votre service.' },
];

export const BREAKFAST_ITEMS = [
  'Jus d\'orange fraîchement pressés',
  'Fruits frais et viennoiseries artisanales',
  'Fromages et charcuteries',
  'Boissons chaudes variées',
  'Options sans gluten sur demande',
  'Petit-déjeuner en chambre sans supplément',
];

/** Équipements par type de chambre (affichage) */
export const ROOM_FEATURES = {
  'suite-prestige': ['Wi-Fi gratuit', 'Climatisation', 'TV écran plat', 'Minibar', 'Coffre-fort', 'Salle de bain complète', 'Bureau', 'Lit king-size'],
  'chambre-familiale': ['Wi-Fi gratuit', 'Climatisation', 'TV', 'Lits superposés', 'Salle de bain', 'Bureau', 'Penderie'],
  'chambre-double-confort': ['Wi-Fi gratuit', 'Climatisation', 'TV', 'Salle de bain', 'Bureau', 'Penderie', 'Literie premium'],
  'chambre-standard': ['Wi-Fi gratuit', 'Climatisation', 'TV', 'Salle de bain douche', 'Penderie'],
};
