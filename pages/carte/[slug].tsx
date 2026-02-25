/**
 * Fiche détaillée d'un article du menu — Kafé Stockholm (/carte/[slug])
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useCartStore } from '@/lib/cart-store';
import { toast } from 'react-toastify';
import EcommerceLayout from '@/components/ecommerce/EcommerceLayout';
import DietaryBadge from '@/components/cafe/DietaryBadge';
import PriceDisplay from '@/components/cafe/PriceDisplay';
import { SITE } from '@/lib/site-config';
import { getMenuImageForProduct } from '@/lib/menu-images';
import { getProductImageUrl } from '@/utils/productImageUrl';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  swedish_name?: string;
  price: number;
  compare_at_price?: number;
  featured_image?: string;
  images?: string[];
  is_vegan?: boolean;
  is_vegetarian?: boolean;
  is_signature?: boolean;
  service_period?: string;
  allergens?: string[];
}

export default function CarteSlugPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      axios
        .get(`${API_URL}/products/${slug}`)
        .then((res) => {
          if (res.data?.success && res.data.product) {
            setProduct(res.data.product);
          } else {
            router.replace('/carte');
          }
        })
        .catch(() => router.replace('/carte'))
        .finally(() => setLoading(false));
    }
  }, [slug, router]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.slug,
      price: product.price,
      quantity,
      image: imageUrl || '',
      slug: product.slug,
      maxStock: 99,
    });
    toast.success(`${product.name} ajouté au panier`);
  };

  if (loading || !product) {
    return (
      <EcommerceLayout>
        <div className="max-w-grid mx-auto px-4 py-16">
          <div className="h-96 bg-kafe-surface rounded-menu animate-pulse" />
        </div>
      </EcommerceLayout>
    );
  }

  const menuImage = getMenuImageForProduct(product.slug, product.name);
  const apiImageRaw = product.featured_image || (product.images && product.images[0]);
  const imageUrl = (apiImageRaw ? getProductImageUrl(apiImageRaw) : '') || menuImage;
  const isLunchOnly = product.service_period === 'lunch';

  return (
    <>
      <Head>
        <title>{`${product.name} — ${SITE.name}, Lyon`}</title>
        <meta name="description" content={product.short_description || product.description || `${product.name} au ${SITE.name}.`} />
      </Head>
      <EcommerceLayout>
        <div className="max-w-grid mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Link href="/carte" className="text-kafe-primary hover:underline text-small font-heading mb-6 inline-block">
            ← Retour à la carte
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="aspect-[4/3] lg:aspect-square relative bg-kafe-surface rounded-menu overflow-hidden">
              {imageUrl ? (
                <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-6xl text-kafe-muted">☕</div>
              )}
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.is_vegan && <DietaryBadge type="vegan" />}
                {product.is_vegetarian && !product.is_vegan && <DietaryBadge type="vegetarian" />}
                {product.is_signature && <DietaryBadge type="signature" />}
                {isLunchOnly && (
                  <span className="bg-kafe-primary/90 text-white text-xs px-2 py-0.5 rounded-capsule">🕐 11h–18h</span>
                )}
              </div>
              <h1 className="font-display text-h1 text-kafe-primary-dark">{product.name}</h1>
              {product.swedish_name && <p className="text-kafe-muted italic text-small mt-1">{product.swedish_name}</p>}
              <div className="mt-4">
                <PriceDisplay price={product.price} compareAtPrice={product.compare_at_price} size="lg" />
              </div>
              {product.description && (
                <div className="mt-6 text-kafe-text-secondary prose prose-kafe max-w-none">
                  <p>{product.description}</p>
                </div>
              )}
              {product.allergens && product.allergens.length > 0 && (
                <p className="mt-4 text-kafe-muted text-small">Allergènes : {product.allergens.join(', ')}</p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-20 px-3 py-2 border border-kafe-border rounded-refined bg-white text-kafe-text"
                />
                <button type="button" onClick={handleAddToCart} className="btn-primary">
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </EcommerceLayout>
    </>
  );
}
