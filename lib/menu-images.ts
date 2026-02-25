/**
 * Association des images du dossier public/images/menu aux produits de la carte.
 * Fichiers réels dans le dossier (noms avec espaces/accents possibles).
 */

const MENU_IMAGE_MAP: { keys: string[]; file: string }[] = [
  { keys: ['andersson', 'anderson'], file: 'anderson.png' },
  { keys: ['garbo'], file: 'garbo.png' },
  { keys: ['helena'], file: 'helena.png' },
  { keys: ['nilsson', 'nilson'], file: 'nilson.png' },
  { keys: ['bernadotte', 'sill', 'lindgren', 'pernilla', 'täppan', 'tappan'], file: '/images/hero-product.png' },
  { keys: ['recharge', 'cafe-suedois', 'svenskt', 'kaffe'], file: 'Recharge Café suédois.jpg' },
  { keys: ['expresso', 'espresso'], file: 'expresso.jpg' },
  { keys: ['allonge'], file: 'Café Allongé.jpg' },
  { keys: ['latte-macchiato', 'macchiato'], file: 'latte machiato.png' },
  { keys: ['latte'], file: 'latte.jpg' },
  { keys: ['cappuccino'], file: 'cappucinno.jpg' },
  { keys: ['flat-white', 'flat white'], file: 'flat white.png' },
  { keys: ['chai-latte', 'chai latte'], file: 'Chai Latte.jpg' },
  { keys: ['dirty-chai', 'dirty chai'], file: 'dirty chai.png' },
  { keys: ['chocolat-chaud', 'chocolat chaud'], file: 'Chocolat chaud bio.jpg' },
  { keys: ['mocaccino'], file: 'mocaccino.png' },
  { keys: ['matcha'], file: 'matcha bio.png' },
  { keys: ['the-infusion', 'the infusion', 'george cannon', 'infusion'], file: 'Thé ou infusion George Cannon.png' },
  { keys: ['sirop', 'sureau', 'airelles', 'cassis'], file: 'sirop.png' },
  { keys: ['the-glace', 'thé glacé', 'the glacé', 'the glace', 'thé glace'], file: 'Thé glacé bio.jpg' },
  { keys: ['soda-suedois', 'soda suédois'], file: 'Soda suédois.png' },
  { keys: ['kombucha'], file: 'kombucha citron.jpg' },
  { keys: ['jus-de-fruit', 'jus fruit'], file: 'Jus de fruit bio.jpg' },
  { keys: ['limonade'], file: 'Limonade artisanale.jpg' },
  { keys: ['schorle', 'shorle'], file: 'shorle.png' },
  { keys: ['eau', 'minérale', 'minerale', 'petillant'], file: 'Eau minérale.jpg' },
  { keys: ['soupe-du-jour', 'soupe du jour', 'soupe jour'], file: 'soupe du jour.png' },
  { keys: ['biere', 'norrlands', 'mariestads', 'beer fabrique'], file: 'Bière.jpg' },
  { keys: ['verre de vin', 'verre vin'], file: 'Verre de vin.jpg' },
  { keys: ['bouteille de vin', 'bouteille vin', 'cote du rhone', 'côte du rhône'], file: 'Bouteille de vin.jpg' },
  { keys: ['äppelkaka', 'appelkaka', 'applekaka'], file: 'Äppelkaka.png' },
  { keys: ['kanelbul', 'kanelbullar', 'kanelbulle'], file: 'kanelbul.png' },
  { keys: ['kardemummabullar', 'kardemummabulla', 'cardamome'], file: 'Kardemummabullar.png' },
  { keys: ['bowl suédois', 'bowl suedois'], file: 'Bowl suédois.png' },
];

export function getMenuImageForProduct(productSlug: string, productName: string): string {
  const slugNorm = (productSlug || '').toLowerCase().replace(/\s/g, '-');
  const nameNorm = (productName || '').toLowerCase();
  const combined = `${slugNorm} ${nameNorm}`;
  for (const { keys, file } of MENU_IMAGE_MAP) {
    if (keys.some((k) => combined.includes(k.toLowerCase().replace(/\s/g, '-')) || nameNorm.includes(k.toLowerCase()))) {
      return file.startsWith('/') ? file : `/images/menu/${encodeURI(file)}`;
    }
  }
  return '';
}
