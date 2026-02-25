/**
 * Télécharge les images du menu Kafé Stockholm dans public/images/menu/
 * Usage: node scripts/download-menu-images.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const MENU_DIR = path.join(__dirname, '..', 'public', 'images', 'menu');

const IMAGES = [
  // Boissons chaudes
  { file: 'menu_boissons_chaudes_cafe_suedois_filtre.jpg', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_boissons_chaudes_expresso.jpg', url: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_boissons_chaudes_latte.jpg', url: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_boissons_chaudes_cappuccino.jpg', url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_boissons_chaudes_chai_latte.jpg', url: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_boissons_chaudes_chocolat_chaud_bio.jpg', url: 'https://images.unsplash.com/photo-1542990253-a781e04c0082?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_boissons_chaudes_matcha_bio.jpg', url: 'https://images.unsplash.com/photo-1582394929218-0bf6fa8a2fb0?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_boissons_chaudes_the_infusion.jpg', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&q=85&auto=format&fit=crop' },
  // Boissons froides
  { file: 'menu_boissons_froides_sirop_fleur_sureau.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elderflower_drink.jpg/900px-Elderflower_drink.jpg' },
  { file: 'menu_boissons_froides_the_glace_bio.jpg', url: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_boissons_froides_soda_suedois.jpg', url: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_boissons_froides_kombucha_citron.jpg', url: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_boissons_froides_jus_de_fruit_bio.jpg', url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_boissons_froides_limonade_artisanale.jpg', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=85&auto=format&fit=crop' },
  // Soupe
  { file: 'menu_soupe_du_jour_maison.jpg', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=85&auto=format&fit=crop' },
  // Pains garnis
  { file: 'menu_pain_garni_garbo_saumon_fume.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Smorgas.jpg/900px-Smorgas.jpg' },
  { file: 'menu_pain_garni_andersson_petits_pois_oeuf.jpg', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_pain_garni_tappan_vegan_legumes.jpg', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_pain_garni_bernadotte_crevettes_nordiques.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/R%C3%A4ksm%C3%B6rg%C3%A5s.jpg/900px-R%C3%A4ksm%C3%B6rg%C3%A5s.jpg' },
  { file: 'menu_pain_garni_nilsson_saucisse_suedoise.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Korv_med_mos.jpg/900px-Korv_med_mos.jpg' },
  { file: 'menu_pain_garni_sill_hareng_suedois.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Inlagd_sill.jpg/900px-Inlagd_sill.jpg' },
  { file: 'menu_pain_garni_lindgren_brie_poire_noix.jpg', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=900&q=85&auto=format&fit=crop' },
  { file: 'menu_pain_garni_pernilla_feta_jambon_fume.jpg', url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=900&q=85&auto=format&fit=crop' },
  // Alcools
  { file: 'menu_alcool_biere_norrlands_guld.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Norrlands_Guld_Export.jpg/800px-Norrlands_Guld_Export.jpg' },
  { file: 'menu_alcool_biere_mariestads.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Mariestads_Beer.jpg/800px-Mariestads_Beer.jpg' },
  { file: 'menu_alcool_vin_cote_du_rhone.jpg', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=85&auto=format&fit=crop' },
];

function download(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const redirect = res.statusCode >= 300 && res.statusCode < 400 && res.headers.location;
      if (redirect) return download(redirect).then(resolve).catch(reject);
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(MENU_DIR)) fs.mkdirSync(MENU_DIR, { recursive: true });
  console.log('Téléchargement des images menu vers', MENU_DIR);
  for (const { file, url } of IMAGES) {
    try {
      const buf = await download(url);
      fs.writeFileSync(path.join(MENU_DIR, file), buf);
      console.log('OK', file);
    } catch (e) {
      console.error('Erreur', file, e.message);
    }
  }
  console.log('Terminé.');
}

main();
