/**
 * Page La Carte — Menu élégant (lecture seule).
 * Accessible via "La carte" dans le header.
 * Pour commander : bouton "Commander" → /carte
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import EcommerceLayout from '@/components/ecommerce/EcommerceLayout';
import { designTokens } from '@/lib/design-tokens';
import { SITE } from '@/lib/site-config';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const { colors, fonts, fontSizes, lineHeights, layout } = designTokens;

interface Category {
  id: string;
  name: string;
  slug: string;
  display_order?: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description?: string | null;
  swedish_name?: string | null;
  price: number;
  is_vegan?: boolean;
  is_vegetarian?: boolean;
}

const CATEGORIES_FALLBACK: Category[] = [
  { id: '1', name: 'Boissons chaudes', slug: 'boissons-chaudes', display_order: 1 },
  { id: '2', name: 'Boissons froides', slug: 'boissons-froides', display_order: 2 },
  { id: '3', name: 'Pains garnis', slug: 'pains-garnis', display_order: 3 },
  { id: '4', name: 'Soupe du jour', slug: 'soupe-du-jour', display_order: 4 },
  { id: '5', name: 'Pâtisseries', slug: 'patisseries', display_order: 5 },
  { id: '6', name: 'Alcools', slug: 'alcools', display_order: 6 },
  { id: '7', name: 'Épicerie suédoise', slug: 'epicerie-suedoise', display_order: 7 },
];

// Images de section : public/Elements/ (ordre des rubriques)
const SECTION_IMAGES: Record<string, string> = {
  'boissons-chaudes': '/Elements/realproduct14.png',
  'boissons-froides': '/Elements/boisson%20froide.jpg',
  'pains-garnis': '/Elements/realproduct10.png',
  'soupe-du-jour': '/Elements/product5-brunch.png',
  'patisseries': '/Elements/photo-54-800x800.webp',
  'alcools': '/Elements/product2-bierre.png',
  'epicerie-suedoise': '/Elements/product1.png',
};
const DEFAULT_SECTION_IMAGE = '/Elements/realproduct14.png';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES_FALLBACK);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [sectionImageErrors, setSectionImageErrors] = useState<Set<string>>(new Set());
  const [showPlats, setShowPlats] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/ecommerce/categories`)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.categories) && res.data.categories.length > 0) {
          setCategories(
            res.data.categories.sort((a: Category, b: Category) => (a.display_order ?? 0) - (b.display_order ?? 0))
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/products?limit=200`)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.products)) {
          const byCat: Record<string, Product[]> = {};
          const idToSlug = (id: string) => categories.find((c) => c.id === id)?.slug ?? null;
          res.data.products.forEach((p: Record<string, unknown>) => {
            // API renvoie category_slug et category_id en plat (pas d'objet category)
            const catSlug = typeof p.category_slug === 'string' && p.category_slug ? p.category_slug : idToSlug(String(p.category_id ?? ''));
            const slug = catSlug ?? 'autres';
            if (!byCat[slug]) byCat[slug] = [];
            byCat[slug].push({
              id: String(p.id),
              name: String(p.name ?? ''),
              slug: String(p.slug ?? ''),
              short_description: p.short_description != null ? String(p.short_description) : null,
              swedish_name: p.swedish_name != null ? String(p.swedish_name) : null,
              price: Number(p.price ?? 0),
              is_vegan: Boolean(p.is_vegan),
              is_vegetarian: Boolean(p.is_vegetarian),
            });
          });
          setProductsByCategory(byCat);
        } else {
          setProductsByCategory({});
        }
      })
      .catch(() => setProductsByCategory({}))
      .finally(() => setLoading(false));
  }, [categories.length]);

  const formatPrice = (price: number) => (price > 0 ? `${price.toFixed(2).replace('.', ',')} €` : '—');

  return (
    <>
      <Head>
        <title>La Carte — {SITE.name}, Lyon</title>
        <meta name="description" content="Découvrez la carte du Kafé Stockholm : boissons, smörgås, pâtisseries suédoises. Café authentique à Lyon 1er." />
      </Head>

      <EcommerceLayout>
        <div className="w-full pt-[112px]" style={{ background: colors.bgPage }}>
          {/* Hero titre simple */}
          <section className="relative w-full overflow-hidden pt-10 pb-16 md:pt-12 md:pb-20">
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
              <h1
                className="font-display font-bold"
                style={{
                  fontFamily: fonts.display,
                  fontSize: `clamp(36px, 5vw, ${fontSizes.sectionH2}px)`,
                  lineHeight: lineHeights.snug,
                  color: colors.primaryDark,
                }}
              >
                La Carte
              </h1>
              <p
                className="mt-4"
                style={{
                  fontFamily: fonts.body,
                  fontSize: fontSizes.body,
                  lineHeight: lineHeights.body,
                  color: colors.textGray,
                }}
              >
                Smörgås, kanelbullar, café suédois — un peu de Suède à Lyon.
              </p>
            </div>
          </section>

          {/* Barre de navigation par catégories — même style que /carte (boutons kafe, pas rose) */}
          <nav
            className="sticky z-30 top-[72px] sm:top-[86px] lg:top-[96px] w-full bg-white border-b border-kafe-border"
            style={{ boxShadow: '0 2px 12px rgba(13, 42, 92, 0.06)' }}
            aria-label="Navigation rapide dans la carte"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center gap-2 py-3 justify-center sm:justify-between">
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`#${cat.slug}`}
                      className="shrink-0 px-4 py-2 rounded-refined text-small font-heading whitespace-nowrap text-kafe-text hover:bg-kafe-surface transition-colors"
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
                <label className="shrink-0 flex items-center gap-2 cursor-pointer px-3 py-2 rounded-refined text-kafe-text hover:bg-kafe-surface transition-colors" style={{ fontFamily: fonts.body, fontSize: fontSizes.bodySmall }}>
                  <input
                    type="checkbox"
                    checked={showPlats}
                    onChange={(e) => setShowPlats(e.target.checked)}
                    className="w-4 h-4 rounded border-kafe-border text-kafe-primary focus:ring-kafe-primary"
                  />
                  <span>Afficher les plats</span>
                </label>
              </div>
            </div>
          </nav>

          {/* Sections par catégorie */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {loading ? (
              <div className="space-y-16">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-kafe-surface animate-pulse" />
                ))}
              </div>
            ) : (
              categories.map((cat) => {
                const products = productsByCategory[cat.slug] ?? [];
                const sectionImage =
                  sectionImageErrors.has(cat.slug)
                    ? DEFAULT_SECTION_IMAGE
                    : (SECTION_IMAGES[cat.slug] ?? DEFAULT_SECTION_IMAGE);
                return (
                  <section
                    key={cat.id}
                    id={cat.slug}
                    className="scroll-mt-[9rem] py-12 md:py-16 first:pt-8"
                  >
                    <div
                      className="rounded-2xl overflow-hidden border shadow-sm"
                      style={{
                        background: colors.white,
                        borderColor: colors.bgSurface,
                        boxShadow: layout.cardShadow,
                      }}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                        <div className="lg:col-span-2 relative h-56 lg:h-auto min-h-[220px]">
                          <img
                            src={sectionImage}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={() =>
                              setSectionImageErrors((prev) => new Set(prev).add(cat.slug))
                            }
                          />
                          <div
                            className="absolute inset-0 flex items-end p-6"
                            style={{ background: 'linear-gradient(to top, rgba(13,42,92,0.6) 0%, transparent 50%)' }}
                          >
                            <h2
                              className="font-display font-semibold text-white"
                              style={{
                                fontFamily: fonts.display,
                                fontSize: `clamp(24px, 2.5vw, ${fontSizes.fikaH3}px)`,
                                lineHeight: lineHeights.snug,
                                textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                              }}
                            >
                              {cat.name}
                            </h2>
                          </div>
                        </div>
                        <div className="lg:col-span-3 p-6 md:p-8">
                          {!showPlats ? (
                            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.bodySmall, color: colors.textMuted }}>
                              Détails des plats sur place ou en click & collect.
                            </p>
                          ) : products.length === 0 ? (
                            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.bodySmall, color: colors.textMuted }}>
                              Bientôt au menu.
                            </p>
                          ) : (
                            <ul className="space-y-5">
                              {products.map((p) => (
                                <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-kafe-border/60 pb-4 last:border-0 last:pb-0">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span
                                        className="font-semibold"
                                        style={{
                                          fontFamily: fonts.body,
                                          fontSize: fontSizes.cardTitle,
                                          color: colors.textDark,
                                        }}
                                      >
                                        {p.name}
                                      </span>
                                      {p.swedish_name && (
                                        <span
                                          className="italic"
                                          style={{
                                            fontFamily: fonts.body,
                                            fontSize: fontSizes.bodySmall,
                                            color: colors.textGray,
                                          }}
                                        >
                                          {p.swedish_name}
                                        </span>
                                      )}
                                      {(p.is_vegan || p.is_vegetarian) && (
                                        <span
                                          className="text-xs font-medium px-2 py-0.5 rounded"
                                          style={{
                                            fontFamily: fonts.body,
                                            background: colors.bgSurface,
                                            color: colors.textGray,
                                          }}
                                        >
                                          {p.is_vegan ? 'Vegan' : 'Végé'}
                                        </span>
                                      )}
                                    </div>
                                    {p.short_description && (
                                      <p
                                        className="mt-1"
                                        style={{
                                          fontFamily: fonts.body,
                                          fontSize: fontSizes.cardDesc,
                                          lineHeight: lineHeights.relaxed,
                                          color: colors.textGray,
                                        }}
                                      >
                                        {p.short_description}
                                      </p>
                                    )}
                                  </div>
                                  <span
                                    className="font-semibold shrink-0"
                                    style={{
                                      fontFamily: fonts.body,
                                      fontSize: fontSizes.cardPrice,
                                      color: colors.primaryDark,
                                    }}
                                  >
                                    {formatPrice(p.price)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })
            )}

            {/* CTA Commander */}
            <section className="mt-16 text-center">
              <p
                className="mb-6"
                style={{
                  fontFamily: fonts.body,
                  fontSize: fontSizes.body,
                  color: colors.textGray,
                }}
              >
                Envie de commander ? Passez en click & collect.
              </p>
              <Link
                href="/carte"
                className="inline-flex items-center justify-center px-10 py-4 font-bold rounded-xl transition-opacity hover:opacity-90"
                style={{
                  fontFamily: fonts.body,
                  fontSize: fontSizes.heroBtn,
                  letterSpacing: '0.02em',
                  background: colors.accent,
                  color: colors.primaryDark,
                }}
              >
                Commander
              </Link>
            </section>
          </div>
        </div>
      </EcommerceLayout>
    </>
  );
}
