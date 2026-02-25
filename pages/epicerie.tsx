/**
 * Épicerie suédoise — produits à emporter (catégorie epicerie-suedoise)
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import EcommerceLayout from '@/components/ecommerce/EcommerceLayout';
import MenuCard, { type MenuItem } from '@/components/cafe/MenuCard';
import { SITE } from '@/lib/site-config';
import { useCartStore } from '@/lib/cart-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function mapProductToMenuItem(p: Record<string, unknown>): MenuItem {
  return {
    id: String(p.id),
    name: String(p.name ?? ''),
    slug: String(p.slug ?? ''),
    short_description: p.short_description != null ? String(p.short_description) : null,
    swedish_name: p.swedish_name != null ? String(p.swedish_name) : null,
    price: Number(p.price ?? 0),
    compare_at_price: p.compare_at_price != null ? Number(p.compare_at_price) : null,
    featured_image: p.featured_image != null ? String(p.featured_image) : null,
    images: Array.isArray(p.images) ? (p.images as string[]) : null,
    is_vegan: Boolean(p.is_vegan),
    is_vegetarian: Boolean(p.is_vegetarian),
    is_signature: Boolean(p.is_signature),
    service_period: p.service_period != null ? String(p.service_period) : null,
    category_id: p.category_id != null ? String(p.category_id) : undefined,
  };
}

export default function EpiceriePage() {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    axios
      .get(`${API_URL}/products?category=epicerie-suedoise&limit=50`)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.products)) {
          setProducts(res.data.products.map(mapProductToMenuItem));
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

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
        <title>{`Épicerie suédoise — ${SITE.name}, Lyon`}</title>
        <meta name="description" content="Produits suédois à emporter : confitures, Daim, Kalles Kaviar. Kafé Stockholm, Lyon." />
      </Head>
      <EcommerceLayout>
        <div className="max-w-grid mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h1 className="font-display text-h1 text-kafe-primary-dark mb-2">Épicerie suédoise</h1>
          <p className="text-kafe-text-secondary mb-8">Ramenez un peu de Suède : produits authentiques à emporter.</p>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 bg-kafe-surface rounded-menu animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-kafe-muted py-12">Aucun produit en épicerie pour le moment. Découvrez notre <a href="/carte" className="text-kafe-primary hover:underline">carte</a>.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((item) => (
                <MenuCard key={item.id} item={item} onAdd={handleAddToCart} showAddButton />
              ))}
            </div>
          )}
        </div>
      </EcommerceLayout>
    </>
  );
}
