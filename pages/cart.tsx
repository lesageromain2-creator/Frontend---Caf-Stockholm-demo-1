/**
 * Panier — Kafé Stockholm
 * Ma commande · Click & collect
 */

import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/cart-store';
import { toast } from 'react-toastify';
import { EcommerceLayout } from '@/components/ecommerce';
import { SITE } from '@/lib/site-config';

const isDemoPayments = process.env.NEXT_PUBLIC_DEMO_PAYMENTS === 'true' || process.env.NEXT_PUBLIC_DEMO_PAYMENTS === '1';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getSubtotal, getItemCount, isLoading, syncWithBackend } = useCartStore();

  useEffect(() => {
    syncWithBackend();
  }, []);

  const subtotal = Number(getSubtotal()) || 0;
  const shipping = 0; // Click & collect : pas de livraison
  const tax = (subtotal + shipping) * 0.1; // TVA 10% restauration
  const total = subtotal + shipping + tax;

  const handleUpdate = async (itemId: string, qty: number) => {
    try {
      await updateQuantity(itemId, qty);
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };
  const handleRemove = async (itemId: string) => {
    try {
      await removeItem(itemId);
      toast.success('Article retiré');
    } catch {
      toast.error('Erreur');
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Head>
          <title>Ma commande — {SITE.name}</title>
        </Head>
        <EcommerceLayout>
          <div className="max-w-grid mx-auto px-6 lg:px-20 py-24 text-center">
            <h1 className="font-heading text-h1 text-kafe-charcoal mb-4">Votre panier est vide</h1>
            <p className="text-kafe-charcoal/70 mb-8">Ajoutez des gourmandises pour votre click & collect.</p>
            <Link href="/carte" className="btn-primary bg-kafe-primary hover:bg-kafe-primary/90 text-white">
              Voir la carte
            </Link>
          </div>
        </EcommerceLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Ma commande ({getItemCount()}) — {SITE.name}</title>
      </Head>
      <EcommerceLayout>
        <div className="max-w-grid mx-auto px-6 lg:px-20 py-12 lg:py-16">
          <h1 className="font-heading text-h1 text-kafe-charcoal mb-2">Ma commande</h1>
          <p className="text-kafe-charcoal/70 mb-10">
            {getItemCount()} article{getItemCount() > 1 ? 's' : ''} · Retrait au café
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <div className="border border-kafe-pearl rounded-refined divide-y divide-kafe-pearl bg-kafe-bg overflow-hidden">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 flex flex-col sm:flex-row gap-4"
                  >
                    <Link
                      href={`/carte/${item.slug}`}
                      className="flex-shrink-0 w-full sm:w-28 h-36 sm:h-28 rounded-refined overflow-hidden bg-kafe-pearl/30"
                    >
                      <img src={item.image || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/carte/${item.slug}`}
                        className="font-heading text-lg text-kafe-charcoal hover:text-kafe-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      {item.variantName && (
                        <p className="text-small text-kafe-charcoal/60 mt-1">{item.variantName}</p>
                      )}
                      <p className="text-caption text-kafe-charcoal/50 mt-1">SKU : {item.sku}</p>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="text-caption text-kafe-charcoal/60 hover:text-kafe-charcoal mt-2"
                      >
                        Retirer
                      </button>
                    </div>
                    <div className="flex sm:flex-col sm:items-end justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdate(item.id, Math.max(1, item.quantity - 1))}
                          disabled={isLoading}
                          className="w-9 h-9 border border-kafe-pearl rounded-refined hover:border-kafe-primary text-kafe-charcoal disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-small font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdate(item.id, Math.min(item.maxStock, item.quantity + 1))}
                          disabled={isLoading || item.quantity >= item.maxStock}
                          className="w-9 h-9 border border-kafe-pearl rounded-refined hover:border-kafe-primary text-kafe-charcoal disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-medium text-kafe-charcoal">{Number(item.price).toFixed(2)} €</p>
                      <p className="text-small text-kafe-charcoal/70">
                        Total : {(Number(item.price) * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link
                href="/carte"
                className="inline-flex items-center gap-2 mt-6 text-small text-kafe-primary hover:underline"
              >
                ← Continuer ma commande
              </Link>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24 border border-kafe-pearl rounded-refined bg-kafe-pearl/20 p-6">
                <h2 className="font-heading text-h2 text-kafe-charcoal mb-6">Résumé</h2>
                <div className="space-y-3 text-small">
                  <div className="flex justify-between">
                    <span className="text-kafe-charcoal/70">Sous-total</span>
                    <span>{Number(subtotal).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-kafe-charcoal/70">Livraison</span>
                    <span className="text-kafe-sage">Retrait au café — 0 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-kafe-charcoal/70">TVA 10%</span>
                    <span>{Number(tax).toFixed(2)} €</span>
                  </div>
                </div>
                <div className="border-t border-kafe-pearl mt-4 pt-4 flex justify-between font-body font-semibold text-lg">
                  <span>Total</span>
                  <span>{Number(total).toFixed(2)} €</span>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/checkout')}
                  className="btn-primary w-full mt-6 bg-kafe-primary hover:bg-kafe-primary/90 text-white"
                >
                  Choisir mon créneau de retrait
                </button>
                <p className="text-caption text-kafe-charcoal/50 text-center mt-4">
                  Paiement sécurisé · Stripe
                </p>
                {isDemoPayments && (
                  <p className="text-caption text-amber-600 text-center mt-2">
                    Site en démo — aucun paiement réel
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </EcommerceLayout>
    </>
  );
}
