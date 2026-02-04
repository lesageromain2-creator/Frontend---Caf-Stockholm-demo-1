# 🏨 GUIDE D'INTÉGRATION - IDENTITÉ VISUELLE HÔTEL DE LUXE

## 📦 Fichiers Fournis

Vous avez reçu 4 fichiers essentiels :

1. **guide-identite-visuelle-hotel-luxe.md** - Documentation complète
2. **luxury-hotel-styles.css** - Tous les styles CSS
3. **luxury-animations.js** - Animations Anime.js
4. **luxury-components.jsx** - Composants React + Shadcn

---

## 🚀 INTÉGRATION RAPIDE (5 ÉTAPES)

### ÉTAPE 1 : Installation des dépendances

```bash
# Anime.js pour les animations
npm install animejs

# Shadcn UI (si vous utilisez React)
npx shadcn-ui@latest init

# Composants Shadcn nécessaires
npx shadcn-ui@latest add card button
```

### ÉTAPE 2 : Ajout du CSS dans votre projet

**Option A - Fichier CSS direct :**
```html
<link rel="stylesheet" href="luxury-hotel-styles.css">
```

**Option B - Import dans votre CSS principal :**
```css
@import 'luxury-hotel-styles.css';
```

**Option C - Tailwind (recommandé) :**
Ajoutez dans votre `tailwind.config.js` :
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C9A96E',
          dark: '#A68A5C',
          light: '#D4BC8E',
        },
        // ... voir le guide complet
      }
    }
  }
}
```

### ÉTAPE 3 : Import des polices Google Fonts

Ajoutez dans votre `<head>` :
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### ÉTAPE 4 : Initialisation des animations

```javascript
// Dans votre fichier principal JavaScript
import { initLuxuryAnimations } from './luxury-animations.js';

// Au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  initLuxuryAnimations({
    hero: true,          // Animations hero
    scroll: true,        // Animations au scroll
    parallax: true,      // Effet parallaxe
    cardHover: true,     // Hover sur cartes
    ripple: true         // Effet ripple sur boutons
  });
});
```

### ÉTAPE 5 : Utilisation des composants

**HTML pur :**
```html
<!-- Bouton Premium -->
<button class="btn-primary">
  <span class="circle">
    <span class="icon arrow"></span>
  </span>
  <span class="button-text">Découvrir</span>
</button>

<!-- Carte de chambre -->
<div class="card-luxury">
  <img src="room.jpg" alt="Suite" class="card-image">
  <div class="card-content">
    <h3 class="card-title">Suite Royale</h3>
    <p class="card-text">Une expérience inoubliable...</p>
  </div>
</div>
```

**React + Shadcn :**
```jsx
import { RoomCard } from './luxury-components';

<RoomCard 
  image="/suite.jpg"
  title="Suite Royale"
  description="Une expérience inoubliable avec vue panoramique"
  price={450}
  amenities={["King Bed", "Ocean View", "Balcon"]}
  onBook={() => console.log('Réservation')}
/>
```

---

## 🎨 PALETTE DE COULEURS À UTILISER

### Principales
```
Or Champagne    #C9A96E  → Éléments premium, accents
Noir Profond    #1A1A1A  → Textes, fonds élégants
Blanc Crème     #FAFAF8  → Fonds, espaces respirants
```

### Secondaires
```
Gris Taupe      #8B8680  → Textes secondaires
Beige Pierre    #E8E4DC  → Fonds alternatifs
Bordeaux        #6B2C3E  → Accents CTA
```

### Utilisation recommandée
- **Boutons principaux** : Fond or (#C9A96E), texte noir
- **Boutons secondaires** : Fond noir, texte or au hover
- **Titres** : Noir profond (#1A1A1A)
- **Corps de texte** : Gris taupe (#5D5A56)
- **Fond général** : Blanc crème (#FAFAF8)

---

## 📝 TYPOGRAPHIE

### Hiérarchie
```
Hero / H1     → Cormorant Garamond, 48-96px, light (300)
H2            → Cormorant Garamond, 32-56px, normal (400)
H3            → Montserrat, 28-40px, medium (500), UPPERCASE
H4-H6         → Montserrat, 20-32px, semibold (600)
Corps         → Inter, 16px, normal (400)
Petits textes → Inter, 14px, normal (400)
Labels        → Montserrat, 12-14px, UPPERCASE, espacement large
```

### Règles
1. Toujours Cormorant Garamond pour les grands titres
2. Montserrat pour les sous-titres et labels (uppercase)
3. Inter pour tout le corps de texte
4. Espacement des lettres large pour les uppercase (0.1em-0.15em)

---

## 🔘 BOUTONS - QUAND UTILISER CHAQUE STYLE

### 1. Bouton Primary (Learn More)
**Quand :** CTA principaux, actions importantes
```html
<button class="btn-primary">
  <span class="circle">
    <span class="icon arrow"></span>
  </span>
  <span class="button-text">Réserver</span>
</button>
```
**Utilisation :** Pages d'accueil, fins de sections, conversions

### 2. Bouton Secondary (Flying Arrow)
**Quand :** Actions secondaires, navigation
```html
<button class="btn-secondary">
  <span>Voir plus</span>
  <svg>...</svg>
</button>
```
**Utilisation :** Navigation interne, découvrir plus

### 3. Bouton Tertiary (Elegant Border)
**Quand :** Actions tertiaires, alternatives
```html
<button class="btn-tertiary">En savoir plus</button>
```
**Utilisation :** Liens alternatifs, actions optionnelles

### 4. Bouton Action (Expandable)
**Quand :** Actions rapides, icônes
```html
<button class="btn-action">
  <span class="sign">
    <svg>...</svg>
  </span>
  <span class="text">Ajouter</span>
</button>
```
**Utilisation :** Favoris, partage, actions latérales

---

## ✨ ANIMATIONS - MODE D'EMPLOI

### Animations au chargement
```javascript
import { fadeInUp, heroTitleAnimation } from './luxury-animations';

// Animation de sections
fadeInUp('.section-content');

// Animation du titre hero
heroTitleAnimation('.hero-title');
```

### Animations au scroll
```javascript
import { animateOnScroll } from './luxury-animations';

// Éléments qui apparaissent au scroll
animateOnScroll('.card-luxury', 'fadeInScale');
animateOnScroll('.testimonial', 'fadeInUp');
```

### Effet parallaxe
```html
<!-- Ajoutez data-parallax sur n'importe quel élément -->
<div class="hero-bg" data-parallax="0.5">
  <img src="background.jpg" alt="Background">
</div>
```

### Compteurs animés
```javascript
import { animateCounter } from './luxury-animations';

// Anime un compteur de 0 à 500
animateCounter('.stat-rooms', 500, { suffix: '+' });
```

### Révélation d'images
```html
<div class="image-wrapper">
  <div class="image-overlay"></div>
  <img src="room.jpg" alt="Room">
</div>
```

```javascript
import { imageRevealAnimation } from './luxury-animations';
imageRevealAnimation('.image-wrapper');
```

---

## 📐 LAYOUT ET ESPACEMENTS

### Container
```html
<div class="container-luxury">
  <!-- Votre contenu -->
</div>
```
**Largeur max :** 1440px avec padding responsive

### Sections
```html
<section class="section-luxury">
  <div class="container-luxury">
    <!-- Contenu -->
  </div>
</section>
```
**Padding vertical :** 64px (mobile) → 128px (desktop)

### Grilles
```html
<!-- 2 colonnes -->
<div class="grid-luxury grid-2">
  <div>Colonne 1</div>
  <div>Colonne 2</div>
</div>

<!-- 3 colonnes -->
<div class="grid-luxury grid-3">
  <!-- Items -->
</div>
```

### Espacements
```html
<div class="mt-xl mb-2xl">Contenu</div>
```

**Échelle disponible :**
- `xs` : 8px
- `sm` : 16px
- `md` : 24px
- `lg` : 32px
- `xl` : 48px
- `2xl` : 64px
- `3xl` : 96px
- `4xl` : 128px

---

## 🎯 EXEMPLES DE PAGES TYPES

### Page d'accueil
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hôtel Luxe</title>
  <link rel="stylesheet" href="luxury-hotel-styles.css">
</head>
<body>
  <!-- Hero Section -->
  <section class="hero-section" style="background-image: url('hero.jpg')">
    <div class="container-luxury text-center">
      <div class="subtitle">Bienvenue</div>
      <h1 class="heading-hero text-white">L'Excellence à son Apogée</h1>
      <div class="divider-luxury"></div>
      <button class="btn-primary">
        <span class="circle">
          <span class="icon arrow"></span>
        </span>
        <span class="button-text">Découvrir</span>
      </button>
    </div>
  </section>

  <!-- Chambres -->
  <section class="section-luxury bg-light">
    <div class="container-luxury">
      <h2 class="heading-2 text-center mb-xl">Nos Suites</h2>
      
      <div class="grid-luxury grid-3">
        <div class="card-luxury">
          <img src="room1.jpg" class="card-image">
          <div class="card-content">
            <h3 class="card-title">Suite Royale</h3>
            <p class="card-text">Une expérience unique...</p>
            <button class="btn-tertiary">Réserver</button>
          </div>
        </div>
        <!-- Répéter pour autres chambres -->
      </div>
    </div>
  </section>

  <script type="module">
    import { initLuxuryAnimations } from './luxury-animations.js';
    initLuxuryAnimations();
  </script>
</body>
</html>
```

---

## 🔧 CONFIGURATION MCP SERVERS

Si vous utilisez des MCP servers, voici comment les intégrer :

### 1. Structure des fichiers
```
/votre-projet
  /src
    /components
      /ui              # Composants Shadcn
      /luxury          # Vos composants custom
    /lib
      /animations.js   # luxury-animations.js
      /utils.js
  /public
    /styles
      luxury-hotel-styles.css
```

### 2. Variables d'environnement
Créez un fichier `.env` :
```env
VITE_BRAND_COLOR=#C9A96E
VITE_BRAND_FONT_HEADING=Cormorant Garamond
VITE_BRAND_FONT_BODY=Inter
```

### 3. Configuration Tailwind avec MCP
```javascript
// tailwind.config.js
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: process.env.VITE_BRAND_COLOR || '#C9A96E',
        // ...
      }
    }
  }
}
```

---

## ✅ CHECKLIST D'INTÉGRATION

### Avant de commencer
- [ ] Installer Anime.js (`npm install animejs`)
- [ ] Installer Shadcn UI si React (`npx shadcn-ui@latest init`)
- [ ] Ajouter les polices Google Fonts dans `<head>`
- [ ] Copier `luxury-hotel-styles.css` dans votre projet

### Intégration de base
- [ ] Importer le CSS dans votre HTML/app
- [ ] Importer et initialiser les animations
- [ ] Tester le bouton primary sur une page
- [ ] Vérifier que les polices s'affichent correctement

### Intégration avancée
- [ ] Configurer Tailwind avec les couleurs personnalisées
- [ ] Importer les composants React si applicable
- [ ] Ajouter les data-parallax sur les images de fond
- [ ] Configurer les animations au scroll
- [ ] Tester sur mobile et desktop

### Finalisation
- [ ] Optimiser les images (WebP, lazy loading)
- [ ] Minifier le CSS pour production
- [ ] Tester les performances (Lighthouse)
- [ ] Vérifier l'accessibilité (contraste, navigation clavier)

---

## 🎨 RÈGLES D'OR À RESPECTER

### DO ✅
1. **Espacements généreux** - Laissez respirer le contenu
2. **Hiérarchie claire** - Utilisez la bonne police pour chaque élément
3. **Animations subtiles** - Durée 0.3s-0.5s maximum
4. **Images haute qualité** - Minimum 1920px de large
5. **Cohérence** - Un seul style de bouton par type d'action
6. **Or avec parcimonie** - Utilisez #C9A96E pour les accents seulement
7. **Mobile-first** - Testez toujours sur mobile d'abord

### DON'T ❌
1. ❌ Mélanger plus de 3 couleurs par section
2. ❌ Utiliser des animations trop rapides (<0.2s)
3. ❌ Surcharger l'interface avec trop de boutons or
4. ❌ Utiliser des images de faible qualité
5. ❌ Ignorer les espacements définis (utilisez les classes)
6. ❌ Créer de nouveaux styles de boutons (utilisez ceux fournis)
7. ❌ Oublier le responsive design

---

## 📱 RESPONSIVE DESIGN

### Points de rupture
```css
Mobile:   < 640px
Tablet:   640px - 1024px
Desktop:  > 1024px
Large:    > 1280px
```

### Comportements responsive
- **Grilles:** 1 col (mobile) → 2 cols (tablet) → 3-4 cols (desktop)
- **Typographie:** Tailles fluides avec clamp()
- **Espacements:** Padding réduit sur mobile
- **Navigation:** Hamburger menu sur mobile
- **Boutons:** Pleine largeur sur mobile si nécessaire

---

## 🚀 OPTIMISATIONS RECOMMANDÉES

### Performance
```html
<!-- Lazy loading des images -->
<img src="room.jpg" loading="lazy" alt="Suite">

<!-- Preload des polices critiques -->
<link rel="preload" href="fonts/cormorant.woff2" as="font" crossorigin>

<!-- Defer des scripts non critiques -->
<script src="animations.js" defer></script>
```

### SEO
```html
<!-- Balises meta essentielles -->
<meta name="description" content="Hôtel de luxe...">
<meta property="og:image" content="hero.jpg">
<meta name="theme-color" content="#C9A96E">
```

---

## 📞 SUPPORT ET RESSOURCES

### Documentation
- Guide complet : `guide-identite-visuelle-hotel-luxe.md`
- Anime.js docs : https://animejs.com/documentation/
- Shadcn UI : https://ui.shadcn.com/

### Questions fréquentes
**Q: Puis-je changer les couleurs ?**
R: Oui, mais gardez la hiérarchie : 1 or, 1 foncé, 1 clair minimum.

**Q: Comment ajouter une nouvelle animation ?**
R: Utilisez les fonctions dans `luxury-animations.js` ou créez-en avec la même structure.

**Q: Puis-je utiliser sans React ?**
R: Absolument ! Tout fonctionne en HTML/CSS pur.

---

**Version:** 1.0.0  
**Dernière mise à jour:** Février 2026  
**Licence:** Votre projet

Bonne intégration ! 🎨✨
