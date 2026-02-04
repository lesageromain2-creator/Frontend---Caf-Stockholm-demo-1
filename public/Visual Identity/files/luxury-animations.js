/**
 * LUXURY HOTEL - ANIMATIONS ANIME.JS
 * Version: 1.0.0
 * 
 * Installation: npm install animejs
 * Import: import anime from 'animejs';
 */

import anime from 'animejs';

// ==================== CONFIGURATION GLOBALE ====================
const EASING = {
  smooth: 'cubicBezier(0.65, 0, 0.076, 1)',
  bounce: 'cubicBezier(0.4, 0, 0.2, 1)',
  expo: 'easeOutExpo',
  elastic: 'easeOutElastic(1, .8)',
  quart: 'easeInOutQuart'
};

const DURATION = {
  fast: 400,
  base: 800,
  slow: 1200,
  verySlow: 1600
};

// ==================== 1. ANIMATIONS D'ENTRÉE ====================

/**
 * Fade In Up - Apparition depuis le bas
 * Idéal pour: sections, cartes, contenus
 */
export const fadeInUp = (selector, options = {}) => {
  return anime({
    targets: selector,
    translateY: [40, 0],
    opacity: [0, 1],
    duration: options.duration || DURATION.slow,
    easing: options.easing || EASING.bounce,
    delay: anime.stagger(150, { start: options.startDelay || 0 }),
    ...options
  });
};

/**
 * Fade In Scale - Apparition avec zoom
 * Idéal pour: images, icônes, éléments d'accent
 */
export const fadeInScale = (selector, options = {}) => {
  return anime({
    targets: selector,
    scale: [0.9, 1],
    opacity: [0, 1],
    duration: options.duration || DURATION.base,
    easing: options.easing || EASING.expo,
    delay: anime.stagger(100),
    ...options
  });
};

/**
 * Slide In From Sides
 * Idéal pour: navigation, menus, sidebars
 */
export const slideInFromLeft = (selector, options = {}) => {
  return anime({
    targets: selector,
    translateX: [-50, 0],
    opacity: [0, 1],
    duration: options.duration || DURATION.base,
    easing: EASING.expo,
    ...options
  });
};

export const slideInFromRight = (selector, options = {}) => {
  return anime({
    targets: selector,
    translateX: [50, 0],
    opacity: [0, 1],
    duration: options.duration || DURATION.base,
    easing: EASING.expo,
    ...options
  });
};

// ==================== 2. ANIMATION HERO SECTION ====================

/**
 * Animation du titre principal avec effet de lettre par lettre
 */
export const heroTitleAnimation = (titleSelector = '.hero-title') => {
  // Diviser le texte en lettres
  const title = document.querySelector(titleSelector);
  if (!title) return;
  
  const text = title.textContent;
  title.innerHTML = text
    .split('')
    .map(char => `<span class="letter">${char === ' ' ? '&nbsp;' : char}</span>`)
    .join('');

  // Animation timeline
  const tl = anime.timeline({ loop: false });
  
  tl.add({
    targets: `${titleSelector} .letter`,
    translateY: [100, 0],
    translateZ: 0,
    opacity: [0, 1],
    easing: EASING.expo,
    duration: DURATION.slow,
    delay: (el, i) => 50 * i
  })
  .add({
    targets: '.hero-subtitle',
    translateY: [30, 0],
    opacity: [0, 1],
    easing: EASING.expo,
    duration: DURATION.base,
    offset: '-=800'
  })
  .add({
    targets: '.hero-cta',
    scale: [0.8, 1],
    opacity: [0, 1],
    easing: EASING.elastic,
    duration: DURATION.slow,
    offset: '-=600'
  });
  
  return tl;
};

/**
 * Animation Hero avec overlay et image
 */
export const heroImageReveal = (imageSelector = '.hero-image') => {
  const tl = anime.timeline({ loop: false });
  
  tl.add({
    targets: `${imageSelector} .image-overlay`,
    scaleX: [0, 1],
    transformOrigin: 'left center',
    easing: EASING.quart,
    duration: 1000
  })
  .add({
    targets: `${imageSelector} img`,
    scale: [1.3, 1],
    opacity: [0, 1],
    easing: EASING.expo,
    duration: DURATION.slow,
    offset: '-=600'
  })
  .add({
    targets: `${imageSelector} .image-overlay`,
    scaleX: [1, 0],
    transformOrigin: 'right center',
    easing: EASING.quart,
    duration: 1000,
    offset: '-=800'
  });
  
  return tl;
};

// ==================== 3. PARALLAX ET SCROLL ====================

/**
 * Effet parallaxe doux pour éléments de fond
 * Usage: Ajouter data-parallax="0.5" aux éléments
 */
export const initParallax = () => {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrolled * speed);
      
      anime({
        targets: element,
        translateY: yPos,
        duration: 0,
        easing: 'linear'
      });
    });
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
};

/**
 * Animation au scroll (Intersection Observer)
 */
export const animateOnScroll = (selector, animationType = 'fadeInUp') => {
  const elements = document.querySelectorAll(selector);
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          switch(animationType) {
            case 'fadeInUp':
              fadeInUp(entry.target);
              break;
            case 'fadeInScale':
              fadeInScale(entry.target);
              break;
            case 'slideInFromLeft':
              slideInFromLeft(entry.target);
              break;
            default:
              fadeInUp(entry.target);
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
  );
  
  elements.forEach(el => observer.observe(el));
  
  return observer;
};

// ==================== 4. ANIMATIONS DE CARTES ====================

/**
 * Animation hover complexe pour cartes
 */
export const createCardHoverAnimation = (cardSelector) => {
  const cards = document.querySelectorAll(cardSelector);
  
  cards.forEach(card => {
    const image = card.querySelector('img');
    const overlay = card.querySelector('.card-overlay');
    const content = card.querySelector('.card-content');
    
    let hoverTl = null;
    
    card.addEventListener('mouseenter', () => {
      hoverTl = anime.timeline({
        easing: EASING.expo,
        autoplay: true
      });
      
      hoverTl
        .add({
          targets: card,
          translateY: -12,
          boxShadow: '0 25px 50px rgba(201, 169, 110, 0.25)',
          duration: DURATION.fast
        })
        .add({
          targets: image,
          scale: 1.08,
          duration: DURATION.slow,
          offset: '-=400'
        })
        .add({
          targets: overlay,
          opacity: 1,
          duration: DURATION.fast,
          offset: '-=400'
        })
        .add({
          targets: content,
          translateY: -5,
          duration: DURATION.fast,
          offset: '-=300'
        });
    });
    
    card.addEventListener('mouseleave', () => {
      if (hoverTl) hoverTl.pause();
      
      anime({
        targets: card,
        translateY: 0,
        boxShadow: '0 4px 16px rgba(26, 26, 26, 0.12)',
        duration: DURATION.fast,
        easing: EASING.expo
      });
      
      anime({
        targets: image,
        scale: 1,
        duration: DURATION.base,
        easing: EASING.expo
      });
      
      anime({
        targets: overlay,
        opacity: 0,
        duration: DURATION.fast,
        easing: EASING.expo
      });
      
      anime({
        targets: content,
        translateY: 0,
        duration: DURATION.fast,
        easing: EASING.expo
      });
    });
  });
};

/**
 * Animation de grille de cartes en cascade
 */
export const staggeredCardsAnimation = (cardsSelector) => {
  return anime({
    targets: cardsSelector,
    translateY: [60, 0],
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: DURATION.slow,
    easing: EASING.expo,
    delay: anime.stagger(120, { from: 'center' })
  });
};

// ==================== 5. COMPTEURS ET STATISTIQUES ====================

/**
 * Animation de compteur numérique
 */
export const animateCounter = (selector, targetValue, options = {}) => {
  const element = document.querySelector(selector);
  if (!element) return;
  
  const obj = { value: 0 };
  
  return anime({
    targets: obj,
    value: targetValue,
    round: 1,
    easing: EASING.expo,
    duration: options.duration || 2000,
    delay: options.delay || 0,
    update: function() {
      const suffix = options.suffix || '';
      const prefix = options.prefix || '';
      element.textContent = prefix + obj.value.toLocaleString() + suffix;
    }
  });
};

/**
 * Animation de plusieurs compteurs simultanément
 */
export const animateMultipleCounters = (counters) => {
  // counters = [{ selector: '.counter-1', value: 1500, suffix: '+' }, ...]
  const tl = anime.timeline({ easing: EASING.expo });
  
  counters.forEach((counter, index) => {
    tl.add({
      targets: { value: 0 },
      value: counter.value,
      round: 1,
      duration: 2000,
      delay: index * 200,
      update: function(anim) {
        const element = document.querySelector(counter.selector);
        if (element) {
          const value = Math.round(anim.animations[0].currentValue);
          element.textContent = (counter.prefix || '') + value.toLocaleString() + (counter.suffix || '');
        }
      }
    }, index === 0 ? 0 : '-=1800');
  });
  
  return tl;
};

// ==================== 6. NAVIGATION ET MENUS ====================

/**
 * Animation menu mobile
 */
export const mobileMenuAnimation = (menuSelector = '.mobile-menu', itemsSelector = '.mobile-menu-item') => {
  const tl = anime.timeline({
    autoplay: false,
    easing: EASING.expo
  });
  
  tl.add({
    targets: menuSelector,
    translateX: ['100%', '0%'],
    duration: 600
  })
  .add({
    targets: itemsSelector,
    translateX: [50, 0],
    opacity: [0, 1],
    delay: anime.stagger(80),
    duration: 500,
    offset: '-=400'
  });
  
  return tl;
};

/**
 * Animation sous-menu dropdown
 */
export const dropdownAnimation = (dropdownSelector) => {
  const dropdown = document.querySelector(dropdownSelector);
  if (!dropdown) return;
  
  const items = dropdown.querySelectorAll('.dropdown-item');
  
  const show = () => {
    const tl = anime.timeline({ easing: EASING.expo });
    
    tl.add({
      targets: dropdown,
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: DURATION.fast
    })
    .add({
      targets: items,
      opacity: [0, 1],
      translateY: [-10, 0],
      delay: anime.stagger(50),
      duration: DURATION.fast,
      offset: '-=300'
    });
    
    return tl;
  };
  
  const hide = () => {
    return anime({
      targets: dropdown,
      opacity: 0,
      translateY: -10,
      duration: DURATION.fast / 2,
      easing: EASING.expo
    });
  };
  
  return { show, hide };
};

// ==================== 7. RÉVÉLATIONS D'IMAGES ====================

/**
 * Révélation d'image avec overlay qui se déplace
 */
export const imageRevealAnimation = (imageWrapperSelector) => {
  const wrappers = document.querySelectorAll(imageWrapperSelector);
  
  wrappers.forEach(wrapper => {
    const overlay = wrapper.querySelector('.image-overlay');
    const img = wrapper.querySelector('img');
    
    if (!overlay || !img) return;
    
    const tl = anime.timeline({
      loop: false,
      easing: EASING.quart
    });
    
    tl.add({
      targets: overlay,
      scaleX: [0, 1],
      transformOrigin: 'left center',
      duration: 1000
    })
    .add({
      targets: img,
      scale: [1.2, 1],
      opacity: [0, 1],
      duration: DURATION.slow,
      offset: '-=600'
    })
    .add({
      targets: overlay,
      scaleX: [1, 0],
      transformOrigin: 'right center',
      duration: 1000,
      offset: '-=800'
    });
  });
};

/**
 * Effet Ken Burns sur image (zoom lent)
 */
export const kenBurnsEffect = (imageSelector, options = {}) => {
  return anime({
    targets: imageSelector,
    scale: [1, 1.1],
    duration: options.duration || 20000,
    easing: 'linear',
    loop: true,
    direction: 'alternate'
  });
};

// ==================== 8. LIGNES DÉCORATIVES ====================

/**
 * Animation de ligne décorative
 */
export const decorativeLineAnimation = (lineSelector, options = {}) => {
  return anime({
    targets: lineSelector,
    scaleX: [0, 1],
    transformOrigin: options.origin || 'left center',
    easing: EASING.quart,
    duration: options.duration || 1500,
    delay: options.delay || 300
  });
};

/**
 * Animation de bordure progressive
 */
export const borderDrawAnimation = (elementSelector) => {
  const element = document.querySelector(elementSelector);
  if (!element) return;
  
  // Créer 4 lignes pour les 4 côtés
  const borders = ['top', 'right', 'bottom', 'left'];
  borders.forEach(side => {
    const line = document.createElement('div');
    line.className = `border-draw-${side}`;
    element.appendChild(line);
  });
  
  const tl = anime.timeline({ loop: false });
  
  tl.add({
    targets: `${elementSelector} .border-draw-top`,
    scaleX: [0, 1],
    transformOrigin: 'left center',
    duration: 600
  })
  .add({
    targets: `${elementSelector} .border-draw-right`,
    scaleY: [0, 1],
    transformOrigin: 'top center',
    duration: 600,
    offset: '-=300'
  })
  .add({
    targets: `${elementSelector} .border-draw-bottom`,
    scaleX: [0, 1],
    transformOrigin: 'right center',
    duration: 600,
    offset: '-=300'
  })
  .add({
    targets: `${elementSelector} .border-draw-left`,
    scaleY: [0, 1],
    transformOrigin: 'bottom center',
    duration: 600,
    offset: '-=300'
  });
  
  return tl;
};

// ==================== 9. EFFETS DE TEXTE ====================

/**
 * Effet de typing/machine à écrire
 */
export const typingEffect = (selector, text, options = {}) => {
  const element = document.querySelector(selector);
  if (!element) return;
  
  element.textContent = '';
  const chars = text.split('');
  
  chars.forEach(char => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.opacity = '0';
    element.appendChild(span);
  });
  
  return anime({
    targets: `${selector} span`,
    opacity: [0, 1],
    duration: 50,
    delay: anime.stagger(options.speed || 50),
    easing: 'linear'
  });
};

/**
 * Animation de texte avec effet de glitch
 */
export const glitchTextEffect = (selector) => {
  const element = document.querySelector(selector);
  if (!element) return;
  
  const originalText = element.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  let iteration = 0;
  
  const interval = setInterval(() => {
    element.textContent = element.textContent
      .split('')
      .map((char, index) => {
        if (index < iteration) {
          return originalText[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
    
    if (iteration >= originalText.length) {
      clearInterval(interval);
    }
    
    iteration += 1 / 3;
  }, 30);
};

// ==================== 10. BOUTONS INTERACTIFS ====================

/**
 * Animation de ripple au clic
 */
export const addRippleEffect = (buttonSelector) => {
  const buttons = document.querySelectorAll(buttonSelector);
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
      circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
      circle.classList.add('ripple');
      
      const ripple = button.getElementsByClassName('ripple')[0];
      if (ripple) {
        ripple.remove();
      }
      
      button.appendChild(circle);
      
      anime({
        targets: circle,
        scale: [0, 2],
        opacity: [0.5, 0],
        duration: 600,
        easing: 'easeOutQuad',
        complete: () => circle.remove()
      });
    });
  });
};

// ==================== EXPORT PRINCIPAL ====================

/**
 * Initialisation de toutes les animations au chargement
 */
export const initLuxuryAnimations = (config = {}) => {
  console.log('🎨 Initialisation des animations luxury...');
  
  // Animations au chargement de la page
  if (config.hero !== false) {
    heroTitleAnimation();
  }
  
  // Animations au scroll
  if (config.scroll !== false) {
    animateOnScroll('.animate-on-scroll', 'fadeInUp');
    animateOnScroll('.card-luxury', 'fadeInScale');
  }
  
  // Parallax
  if (config.parallax !== false) {
    initParallax();
  }
  
  // Hover sur cartes
  if (config.cardHover !== false) {
    createCardHoverAnimation('.card-luxury');
  }
  
  // Ripple sur boutons
  if (config.ripple !== false) {
    addRippleEffect('button, .btn-primary, .btn-secondary, .btn-tertiary');
  }
  
  console.log('✨ Animations initialisées avec succès!');
};

export default {
  // Entrées
  fadeInUp,
  fadeInScale,
  slideInFromLeft,
  slideInFromRight,
  
  // Hero
  heroTitleAnimation,
  heroImageReveal,
  
  // Scroll
  initParallax,
  animateOnScroll,
  
  // Cartes
  createCardHoverAnimation,
  staggeredCardsAnimation,
  
  // Compteurs
  animateCounter,
  animateMultipleCounters,
  
  // Navigation
  mobileMenuAnimation,
  dropdownAnimation,
  
  // Images
  imageRevealAnimation,
  kenBurnsEffect,
  
  // Décorations
  decorativeLineAnimation,
  borderDrawAnimation,
  
  // Texte
  typingEffect,
  glitchTextEffect,
  
  // Interactions
  addRippleEffect,
  
  // Init
  initLuxuryAnimations,
  
  // Constants
  EASING,
  DURATION
};
