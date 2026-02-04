# Guide d'Identité Visuelle - Hôtellerie de Luxe Premium

## 🎨 Palette de Couleurs

### Couleurs Principales
```css
:root {
  /* Or Champagne - Couleur signature du luxe */
  --primary-gold: #C9A96E;
  --primary-gold-light: #D4BC8E;
  --primary-gold-dark: #A68A5C;
  
  /* Noir Profond - Élégance */
  --primary-dark: #1A1A1A;
  --primary-dark-rgb: 26, 26, 26;
  
  /* Blanc Crème - Pureté raffinée */
  --primary-light: #FAFAF8;
  --pure-white: #FFFFFF;
}
```

### Couleurs Secondaires
```css
:root {
  /* Gris Taupe - Sophistication */
  --secondary-taupe: #8B8680;
  --secondary-taupe-light: #B5B1AC;
  --secondary-taupe-dark: #5D5A56;
  
  /* Beige Pierre - Naturel luxueux */
  --secondary-stone: #E8E4DC;
  --secondary-stone-light: #F2F0EB;
  
  /* Accent Bordeaux - Touche premium */
  --accent-burgundy: #6B2C3E;
  --accent-burgundy-hover: #8A3850;
}
```

### Couleurs d'État
```css
:root {
  /* Succès */
  --success: #2D5C3F;
  --success-light: #E8F3EC;
  
  /* Attention */
  --warning: #9B7145;
  --warning-light: #F9F3EB;
  
  /* Erreur */
  --error: #8B4049;
  --error-light: #F9EBEC;
  
  /* Information */
  --info: #4A5E6D;
  --info-light: #EEF2F5;
}
```

## 📝 Typographie

### Familles de Polices
```css
:root {
  /* Titres - Élégance classique */
  --font-heading: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
  
  /* Corps de texte - Lisibilité moderne */
  --font-body: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  
  /* Accent - Sophistication */
  --font-accent: 'Montserrat', 'Futura', sans-serif;
}

/* Import des polices */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
```

### Échelle Typographique
```css
:root {
  /* Titres */
  --text-hero: clamp(3rem, 8vw, 6rem);        /* 48-96px */
  --text-h1: clamp(2.5rem, 6vw, 4.5rem);      /* 40-72px */
  --text-h2: clamp(2rem, 5vw, 3.5rem);        /* 32-56px */
  --text-h3: clamp(1.75rem, 4vw, 2.5rem);     /* 28-40px */
  --text-h4: clamp(1.5rem, 3vw, 2rem);        /* 24-32px */
  --text-h5: clamp(1.25rem, 2.5vw, 1.5rem);   /* 20-24px */
  
  /* Corps */
  --text-large: 1.25rem;    /* 20px */
  --text-body: 1rem;        /* 16px */
  --text-small: 0.875rem;   /* 14px */
  --text-tiny: 0.75rem;     /* 12px */
  
  /* Hauteur de ligne */
  --line-height-tight: 1.2;
  --line-height-normal: 1.6;
  --line-height-relaxed: 1.8;
  
  /* Espacement des lettres */
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.05em;
  --letter-spacing-wider: 0.1em;
}

/* Classes typographiques */
.heading-hero {
  font-family: var(--font-heading);
  font-size: var(--text-hero);
  font-weight: 300;
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--primary-dark);
}

.heading-1 {
  font-family: var(--font-heading);
  font-size: var(--text-h1);
  font-weight: 400;
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

.heading-2 {
  font-family: var(--font-heading);
  font-size: var(--text-h2);
  font-weight: 500;
  line-height: 1.3;
}

.heading-3 {
  font-family: var(--font-accent);
  font-size: var(--text-h3);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}

.body-text {
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 400;
  line-height: var(--line-height-normal);
  color: var(--secondary-taupe-dark);
}

.subtitle {
  font-family: var(--font-accent);
  font-size: var(--text-small);
  font-weight: 500;
  letter-spacing: var(--letter-spacing-wider);
  text-transform: uppercase;
  color: var(--primary-gold);
}
```

## 🎭 Système de Boutons Premium

### Bouton Principal (Learn More Style)
```css
/* Bouton Premium avec animation de cercle */
.btn-primary {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  background: transparent;
  padding: 0;
  font-family: var(--font-accent);
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
}

.btn-primary-wrapper {
  width: 14rem;
  height: auto;
}

.btn-primary .circle {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: relative;
  display: block;
  margin: 0;
  width: 3.5rem;
  height: 3.5rem;
  background: var(--primary-dark);
  border-radius: 2rem;
}

.btn-primary .circle .icon {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  background: var(--primary-gold);
}

.btn-primary .circle .icon.arrow {
  left: 0.75rem;
  width: 1.25rem;
  height: 0.125rem;
  background: none;
}

.btn-primary .circle .icon.arrow::before {
  position: absolute;
  content: "";
  top: -0.29rem;
  right: 0.0625rem;
  width: 0.625rem;
  height: 0.625rem;
  border-top: 0.125rem solid var(--primary-gold);
  border-right: 0.125rem solid var(--primary-gold);
  transform: rotate(45deg);
}

.btn-primary .button-text {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.85rem 0;
  margin: 0 0 0 2rem;
  color: var(--primary-dark);
  font-weight: 600;
  line-height: 1.6;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.875rem;
}

.btn-primary:hover .circle {
  width: 100%;
  background: var(--primary-gold-dark);
}

.btn-primary:hover .circle .icon.arrow {
  background: var(--primary-dark);
  transform: translate(1rem, 0);
}

.btn-primary:hover .button-text {
  color: var(--pure-white);
}
```

### Bouton Secondaire (Flying Arrow)
```css
.btn-secondary {
  font-family: var(--font-accent);
  font-size: 1rem;
  background: var(--primary-gold);
  color: var(--primary-dark);
  padding: 0.9em 1.4em;
  padding-left: 1.2em;
  display: inline-flex;
  align-items: center;
  border: none;
  border-radius: 50px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 15px rgba(201, 169, 110, 0.2);
}

.btn-secondary span {
  display: block;
  margin-left: 0.5em;
  transition: all 0.3s ease-in-out;
}

.btn-secondary svg {
  display: block;
  transform-origin: center center;
  transition: transform 0.3s ease-in-out;
  width: 20px;
  height: 20px;
}

.btn-secondary:hover {
  background: var(--primary-gold-dark);
  box-shadow: 0 6px 25px rgba(201, 169, 110, 0.35);
  transform: translateY(-2px);
}

.btn-secondary:hover .svg-wrapper {
  animation: fly-luxury 0.6s ease-in-out infinite alternate;
}

.btn-secondary:hover svg {
  transform: translateX(1.2em) rotate(45deg) scale(1.1);
}

.btn-secondary:hover span {
  transform: translateX(5em);
}

.btn-secondary:active {
  transform: translateY(0) scale(0.98);
}

@keyframes fly-luxury {
  from {
    transform: translateY(0.1em);
  }
  to {
    transform: translateY(-0.1em);
  }
}
```

### Bouton Tertiary (Elegant Minimal)
```css
.btn-tertiary {
  font-family: var(--font-accent);
  padding: 1.1rem 2.5rem;
  border-radius: 50px;
  cursor: pointer;
  border: 2px solid var(--primary-dark);
  background-color: transparent;
  color: var(--primary-dark);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-tertiary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--primary-dark);
  transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.btn-tertiary:hover {
  color: var(--primary-gold);
  border-color: var(--primary-dark);
}

.btn-tertiary:hover::before {
  left: 0;
}

.btn-tertiary:active {
  transform: scale(0.98);
}
```

### Bouton Action (Expandable)
```css
.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(26, 26, 26, 0.15);
  background: var(--primary-gold);
}

.btn-action .sign {
  width: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action .sign svg {
  width: 20px;
  height: 20px;
}

.btn-action .sign svg path {
  fill: var(--primary-dark);
}

.btn-action .text {
  position: absolute;
  right: 0%;
  width: 0%;
  opacity: 0;
  color: var(--primary-dark);
  font-size: 0.95em;
  font-weight: 600;
  font-family: var(--font-accent);
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-action:hover {
  width: 160px;
  border-radius: 50px;
  box-shadow: 0 6px 25px rgba(201, 169, 110, 0.3);
}

.btn-action:hover .sign {
  width: 30%;
  padding-left: 20px;
}

.btn-action:hover .text {
  opacity: 1;
  width: 70%;
  padding-right: 15px;
}

.btn-action:active {
  transform: scale(0.96);
}
```

## ✨ Animations Anime.js

### Configuration Anime.js
```javascript
// Import Anime.js
import anime from 'animejs';

// 1. Animation d'entrée des éléments au scroll
export const fadeInUp = (selector, options = {}) => {
  return anime({
    targets: selector,
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 1200,
    easing: 'cubicBezier(0.4, 0, 0.2, 1)',
    delay: anime.stagger(150),
    ...options
  });
};

// 2. Animation titre Hero
export const heroTitleAnimation = () => {
  anime.timeline({loop: false})
    .add({
      targets: '.hero-title .letter',
      translateY: [100, 0],
      translateZ: 0,
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1400,
      delay: (el, i) => 50 * i
    })
    .add({
      targets: '.hero-subtitle',
      translateY: [30, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1000,
      offset: '-=800'
    });
};

// 3. Animation parallaxe douce
export const parallaxEffect = () => {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.parallax || 0.5;
      const yPos = -(scrolled * speed);
      anime({
        targets: element,
        translateY: yPos,
        duration: 0,
        easing: 'linear'
      });
    });
  });
};

// 4. Animation hover sur cartes
export const cardHoverAnimation = (card) => {
  const tl = anime.timeline({
    autoplay: false,
    easing: 'easeOutQuad'
  });
  
  tl.add({
    targets: card,
    translateY: -10,
    boxShadow: '0 20px 40px rgba(201, 169, 110, 0.2)',
    duration: 400
  })
  .add({
    targets: card.querySelector('.card-overlay'),
    opacity: 1,
    duration: 300,
    offset: '-=400'
  });
  
  return tl;
};

// 5. Animation compteur statistiques
export const counterAnimation = (selector, targetValue) => {
  const obj = { value: 0 };
  
  anime({
    targets: obj,
    value: targetValue,
    round: 1,
    easing: 'easeOutExpo',
    duration: 2000,
    update: function() {
      document.querySelector(selector).textContent = obj.value;
    }
  });
};

// 6. Animation révélation d'image
export const imageReveal = (selector) => {
  anime.timeline({loop: false})
    .add({
      targets: `${selector} .image-overlay`,
      scaleX: [0, 1],
      transformOrigin: 'left center',
      easing: 'easeInOutQuart',
      duration: 1000
    })
    .add({
      targets: `${selector} img`,
      scale: [1.2, 1],
      opacity: [0, 1],
      easing: 'easeOutQuart',
      duration: 1200,
      offset: '-=600'
    })
    .add({
      targets: `${selector} .image-overlay`,
      scaleX: [1, 0],
      transformOrigin: 'right center',
      easing: 'easeInOutQuart',
      duration: 1000,
      offset: '-=800'
    });
};

// 7. Animation menu navigation
export const menuAnimation = () => {
  const tl = anime.timeline({
    autoplay: false,
    easing: 'easeOutExpo'
  });
  
  tl.add({
    targets: '.mobile-menu',
    translateX: ['100%', '0%'],
    duration: 600
  })
  .add({
    targets: '.mobile-menu-item',
    translateX: [50, 0],
    opacity: [0, 1],
    delay: anime.stagger(80),
    duration: 500,
    offset: '-=400'
  });
  
  return tl;
};

// 8. Animation ligne décorative
export const decorativeLineAnimation = (selector) => {
  anime({
    targets: selector,
    scaleX: [0, 1],
    transformOrigin: 'left center',
    easing: 'easeInOutQuart',
    duration: 1500,
    delay: 300
  });
};
```

## 🎨 Intégration Shadcn/UI

### Configuration Tailwind pour Shadcn
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: '#C9A96E',
          foreground: '#1A1A1A',
          50: '#F9F6F1',
          100: '#F2EDE3',
          200: '#E5DBC7',
          300: '#D4BC8E',
          400: '#C9A96E',
          500: '#A68A5C',
          600: '#8B7249',
          700: '#6B5838',
          800: '#4D3F28',
          900: '#2E261A',
        },
        secondary: {
          DEFAULT: '#8B8680',
          foreground: '#FAFAF8',
        },
        accent: {
          DEFAULT: '#6B2C3E',
          foreground: '#FAFAF8',
        },
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        accent: ['Montserrat', 'Futura', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### Composants Shadcn Personnalisés

```typescript
// components/ui/luxury-card.tsx
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface LuxuryCardProps {
  className?: string
  children: React.ReactNode
  hoverable?: boolean
}

export function LuxuryCard({ className, children, hoverable = true }: LuxuryCardProps) {
  return (
    <Card 
      className={cn(
        "bg-primary-light border-0 shadow-lg overflow-hidden",
        "transition-all duration-500 ease-out",
        hoverable && "hover:shadow-2xl hover:-translate-y-2",
        "before:absolute before:inset-0 before:bg-gradient-to-br",
        "before:from-primary/5 before:to-transparent before:opacity-0",
        "hover:before:opacity-100 before:transition-opacity before:duration-500",
        className
      )}
    >
      {children}
    </Card>
  )
}
```

## 📐 Système de Grille et Espacements

### Espacements
```css
:root {
  --spacing-xs: 0.5rem;      /* 8px */
  --spacing-sm: 1rem;        /* 16px */
  --spacing-md: 1.5rem;      /* 24px */
  --spacing-lg: 2rem;        /* 32px */
  --spacing-xl: 3rem;        /* 48px */
  --spacing-2xl: 4rem;       /* 64px */
  --spacing-3xl: 6rem;       /* 96px */
  --spacing-4xl: 8rem;       /* 128px */
  
  /* Sections */
  --section-padding-mobile: 4rem 1.5rem;
  --section-padding-tablet: 6rem 2rem;
  --section-padding-desktop: 8rem 4rem;
}
```

### Container
```css
.container-luxury {
  width: 100%;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-lg);
  padding-right: var(--spacing-lg);
}

@media (min-width: 768px) {
  .container-luxury {
    padding-left: var(--spacing-xl);
    padding-right: var(--spacing-xl);
  }
}

@media (min-width: 1024px) {
  .container-luxury {
    padding-left: var(--spacing-2xl);
    padding-right: var(--spacing-2xl);
  }
}
```

## 🌊 Effets et Décors

### Overlay Gradients
```css
.overlay-dark {
  background: linear-gradient(
    180deg,
    rgba(26, 26, 26, 0) 0%,
    rgba(26, 26, 26, 0.4) 50%,
    rgba(26, 26, 26, 0.8) 100%
  );
}

.overlay-gold {
  background: linear-gradient(
    135deg,
    rgba(201, 169, 110, 0.9) 0%,
    rgba(166, 138, 92, 0.7) 100%
  );
}

.overlay-subtle {
  background: linear-gradient(
    180deg,
    rgba(250, 250, 248, 0.95) 0%,
    rgba(250, 250, 248, 0.85) 100%
  );
}
```

### Box Shadows
```css
:root {
  --shadow-sm: 0 2px 8px rgba(26, 26, 26, 0.08);
  --shadow-md: 0 4px 16px rgba(26, 26, 26, 0.12);
  --shadow-lg: 0 8px 24px rgba(26, 26, 26, 0.15);
  --shadow-xl: 0 16px 48px rgba(26, 26, 26, 0.2);
  
  --shadow-gold-sm: 0 2px 8px rgba(201, 169, 110, 0.15);
  --shadow-gold-md: 0 4px 16px rgba(201, 169, 110, 0.2);
  --shadow-gold-lg: 0 8px 32px rgba(201, 169, 110, 0.25);
}
```

### Borders et Séparateurs
```css
.border-luxury {
  border: 1px solid var(--primary-gold);
  position: relative;
}

.border-luxury::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 1px;
  background: var(--primary-gold);
}

.divider-luxury {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--primary-gold) 50%,
    transparent 100%
  );
  margin: var(--spacing-xl) 0;
}
```

## 📱 Responsive Design

### Breakpoints
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Media Queries
```css
/* Mobile First */
@media (min-width: 640px) {
  /* Tablette */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1280px) {
  /* Large Desktop */
}
```

## 🎯 Guidelines d'Utilisation

### DO's ✅
1. Utiliser l'or champagne (#C9A96E) comme couleur d'accent principal
2. Privilégier les animations subtiles et élégantes
3. Maintenir beaucoup d'espaces blancs (breathing room)
4. Utiliser Cormorant Garamond pour tous les titres importants
5. Appliquer des transitions douces (0.3s - 0.5s)
6. Garder des bordures arrondies (border-radius: 8-16px)
7. Utiliser des images en haute qualité uniquement

### DON'Ts ❌
1. Ne pas utiliser plus de 3 couleurs par section
2. Éviter les animations trop rapides ou agressives
3. Ne pas surcharger l'interface avec trop d'éléments
4. Éviter les polices trop fantaisistes
5. Ne pas utiliser de couleurs criardes
6. Éviter les ombres trop prononcées
7. Ne pas mélanger trop de styles de boutons

## 🔧 Intégration MCP Servers

### Structure des fichiers
```
/src
  /components
    /ui              # Composants Shadcn
    /luxury          # Composants personnalisés
  /lib
    /animations      # Anime.js utilities
    /utils           # Helpers
  /styles
    /tokens.css      # Variables CSS
    /components.css  # Styles composants
    /animations.css  # Keyframes
```

### Configuration MCP
Utilisez vos MCP servers pour:
- Génération automatique de composants avec le style défini
- Validation de la cohérence des couleurs
- Optimisation des animations
- Tests d'accessibilité

---

**Version:** 1.0.0  
**Dernière mise à jour:** Février 2026  
**Contact:** Votre équipe design
