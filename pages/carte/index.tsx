/**
 * Page La Carte — Kafé Stockholm (cursorrules 5.2)
 * Sidebar/tabs catégories, grille MenuCard, filtres vegan/végé
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import EcommerceLayout from '@/components/ecommerce/EcommerceLayout';
import MenuCard, { type MenuItem } from '@/components/cafe/MenuCard';
import { SITE } from '@/lib/site-config';
import { useCartStore } from '@/lib/cart-store';
import { getMenuImageForProduct } from '@/lib/menu-images';
import { getProductImageUrl } from '@/utils/productImageUrl';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Category {
  id: string;
  name: string;
  slug: string;
  display_order?: number;
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

function mapProductToMenuItem(p: Record<string, unknown>): MenuItem {
  const categorySlug = p.category_slug != null ? String(p.category_slug) : undefined;
  const slug = String(p.slug ?? '');
  const name = String(p.name ?? '');
  const apiImageRaw = p.featured_image != null ? String(p.featured_image) : (Array.isArray(p.images) && p.images[0]) ? String(p.images[0]) : null;
  const apiImage = apiImageRaw ? getProductImageUrl(apiImageRaw) : null;
  const localImage = getMenuImageForProduct(slug, name);
  // Priorité : image API (modifiable en admin) puis image menu par défaut
  return {
    id: String(p.id),
    name: String(p.name ?? ''),
    slug,
    short_description: p.short_description != null ? String(p.short_description) : null,
    swedish_name: p.swedish_name != null ? String(p.swedish_name) : null,
    price: Number(p.price ?? 0),
    compare_at_price: p.compare_at_price != null ? Number(p.compare_at_price) : null,
    featured_image: apiImage || localImage || null,
    images: Array.isArray(p.images) ? (p.images as string[]) : null,
    is_vegan: Boolean(p.is_vegan),
    is_vegetarian: Boolean(p.is_vegetarian),
    is_signature: Boolean(p.is_signature),
    service_period: p.service_period != null ? String(p.service_period) : null,
    category_id: p.category_id != null ? String(p.category_id) : undefined,
    category_slug: categorySlug,
  };
}

export default function CartePage() {
  const router = useRouter();
  const { category: categorySlug, search } = router.query;
  const [categories, setCategories] = useState<Category[]>(CATEGORIES_FALLBACK);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'vegetarian' | 'vegan' | 'signature'>('all');
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    axios
      .get(`${API_URL}/ecommerce/categories`)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.categories) && res.data.categories.length > 0) {
          setCategories(res.data.categories.sort((a: Category, b: Category) => (a.display_order ?? 0) - (b.display_order ?? 0)));
        }
      })
      .catch(() => {});
  }, []);

  // Attendre que le routeur ait les query params avant de fetcher (évite un premier appel sans category)
  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);
    const params = new URLSearchParams();
    const slug = typeof categorySlug === 'string' ? categorySlug : Array.isArray(categorySlug) ? categorySlug[0] : '';
    if (slug) {
      params.set('category', slug);
    }
    if (typeof search === 'string' && search) {
      params.set('search', search);
    }
    params.set('limit', '100');
    axios
      .get(`${API_URL}/products?${params.toString()}`)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.products)) {
          setProducts(res.data.products.map(mapProductToMenuItem));
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [router.isReady, categorySlug, search]);

  const filtered =
    filter === 'all'
      ? products
      : filter === 'vegan'
        ? products.filter((p) => p.is_vegan)
        : filter === 'vegetarian'
          ? products.filter((p) => p.is_vegetarian)
          : products.filter((p) => p.is_signature);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      productId: item.id,
      name: item.name,
      sku: item.slug,
      price: item.price,
      quantity: 1,
      image: item.featured_image || (item.images && item.images[0]) || '',
      slug: item.slug,
      maxStock: 99,
    });
  };

  return (
    <>
      <Head>
        <title>{`Click & Collect — ${SITE.name}, Lyon`}</title>
        <meta name="description" content="Commandez en ligne et retirez au café : boissons, smörgås, pâtisseries. Kafé Stockholm, Lyon 1er." />
      </Head>

      <EcommerceLayout>
        <div className="max-w-grid mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1 className="font-display text-h1 text-kafe-primary-dark mb-2">Click & Collect</h1>
          <p className="text-kafe-text-secondary text-small mb-6">Choisissez vos articles, commandez en ligne et retirez au café.</p>

          {/* Filtres : catégories + régime */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-6">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/carte"
                className={`shrink-0 px-4 py-2 rounded-refined text-small font-heading whitespace-nowrap block ${
                  !categorySlug ? 'bg-kafe-primary text-white' : 'text-kafe-text hover:bg-kafe-surface'
                }`}
              >
                Toutes catégories
              </Link>
              {categories.map((cat) => {
                const isActive = categorySlug === cat.slug || (Array.isArray(categorySlug) && categorySlug[0] === cat.slug);
                return (
                  <Link
                    key={cat.id}
                    href={`/carte?category=${encodeURIComponent(cat.slug)}`}
                    className={`shrink-0 px-4 py-2 rounded-refined text-small font-heading whitespace-nowrap block ${
                      isActive ? 'bg-kafe-primary text-white' : 'text-kafe-text hover:bg-kafe-surface'
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              {(['all', 'vegetarian', 'vegan', 'signature'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-capsule text-small font-heading font-medium transition-colors ${
                    filter === f
                      ? 'bg-kafe-primary text-white'
                      : 'bg-kafe-surface text-kafe-text hover:bg-kafe-border'
                  }`}
                >
                  {f === 'all' ? 'Tout' : f === 'vegetarian' ? 'Végétarien' : f === 'vegan' ? 'Vegan' : 'Signature'}
                </button>
              ))}
            </div>
          </div>

          {/* Grille produits — plus de sidebar */}
          <div className="w-full">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-72 bg-kafe-surface rounded-menu animate-pulse" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-kafe-muted py-12 text-center">Aucun article pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((item) => (
                    <MenuCard key={item.id} item={item} onAdd={handleAddToCart} showAddButton />
                  ))}
                </div>
              )}
            </div>
        </div>
      </EcommerceLayout>
    </>
  );
}
