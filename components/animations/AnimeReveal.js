'use client';

import { useRef, useEffect } from 'react';
import { animate, stagger } from 'animejs';

const defaultOptions = {
  opacityFrom: 0,
  opacityTo: 1,
  translateYFrom: '24px',
  translateYTo: '0px',
  duration: 600,
  ease: 'outCubic',
  delay: 0,
};

/**
 * Anime un élément au scroll (IntersectionObserver + anime.js v4).
 * @param {Object} options - Options (opacityFrom/To, translateYFrom/To, duration, ease, delay)
 * @param {boolean} once - Ne jouer qu'une fois (défaut: true)
 * @param {boolean} stagger - Animer les enfants en décalé (défaut: false)
 * @param {number} staggerDelay - Délai entre chaque enfant si stagger (ms)
 */
export default function AnimeReveal({
  children,
  className = '',
  options = {},
  once = true,
  stagger: useStagger = false,
  staggerDelay = 80,
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (once && played.current) return;
          played.current = true;

          const opts = { ...defaultOptions, ...options };
          const duration = opts.duration ?? 600;
          const ease = opts.ease ?? 'outCubic';

          if (useStagger) {
            const targets = el.querySelectorAll('[data-anime-child]');
            const nodeList = targets.length ? targets : el.children;
            animate(nodeList, {
              opacity: { from: opts.opacityFrom ?? 0, to: opts.opacityTo ?? 1 },
              translateY: { from: opts.translateYFrom ?? '24px', to: opts.translateYTo ?? '0px' },
              duration,
              ease,
              delay: stagger(staggerDelay),
            });
          } else {
            animate(el, {
              opacity: { from: opts.opacityFrom ?? 0, to: opts.opacityTo ?? 1 },
              translateY: { from: opts.translateYFrom ?? '24px', to: opts.translateYTo ?? '0px' },
              duration,
              ease,
              delay: opts.delay ?? 0,
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options, once, useStagger, staggerDelay]);

  return (
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}

/**
 * Marque un enfant pour le stagger (à utiliser avec AnimeReveal stagger).
 */
export function AnimeChild({ children, className = '', as: Tag = 'div' }) {
  return (
    <Tag data-anime-child className={className}>
      {children}
    </Tag>
  );
}
