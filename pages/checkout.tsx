/**
 * Checkout Click & Collect — Kafé Stockholm
 * Contact + créneau de retrait, puis paiement Stripe
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCartStore } from '@/lib/cart-store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { EcommerceLayout } from '@/components/ecommerce';
import { SITE } from '@/lib/site-config';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const isDemoPayments = process.env.NEXT_PUBLIC_DEMO_PAYMENTS === 'true' || process.env.NEXT_PUBLIC_DEMO_PAYMENTS === '1';

// Adresse du café pour facturation / retrait
const CAFE_ADDRESS = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  addressLine1: '10 rue Saint-Polycarpe',
  addressLine2: '',
  city: 'Lyon',
  postalCode: '69001',
  country: 'FR',
};

const contactSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(1, 'Téléphone requis'),
});

// Créneaux de retrait (exemples)
const PICKUP_SLOTS = (() => {
  const out: { value: string; label: string }[] = [];
  for (let h = 8; h <= 17; h++) {
    for (const m of [0, 30]) {
      if (h === 17 && m === 30) break;
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      out.push({ value: `${hh}:${mm}`, label: `${hh}h${mm}` });
    }
  }
  return out;
})();

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [pickupDate, setPickupDate] = useState(todayISO());
  const [pickupSlot, setPickupSlot] = useState('12:00');
  const [specialNotes, setSpecialNotes] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items]);

  const validate = () => {
    try {
      contactSchema.parse(contact);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  const handleCreateOrder = async () => {
    if (!validate()) return;

    setLoading(true);
    const billingAddress = {
      ...CAFE_ADDRESS,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
    };
    const pickupTimeISO = `${pickupDate}T${pickupSlot}:00.000Z`;

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        billingAddress,
        shippingAddress: { ...billingAddress },
        orderType: 'click_collect',
        pickupTime: pickupTimeISO,
        specialNotes: specialNotes.trim() || undefined,
      };

      const orderResponse = await axios.post(`${API_URL}/ecommerce/orders`, orderData);
      if (!orderResponse.data.success) throw new Error('Erreur lors de la création de la commande');

      const order = orderResponse.data.order;
      setRedirecting(true);

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const stripeResponse = await axios.post(`${API_URL}/stripe/create-checkout-from-order`, {
        orderId: order.id,
        successUrl: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/checkout`,
      });

      if (stripeResponse.data.success && stripeResponse.data.url) {
        window.location.href = stripeResponse.data.url;
        return;
      }
      throw new Error("Impossible d'ouvrir la page de paiement");
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la commande');
      setRedirecting(false);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = Number(getSubtotal()) || 0;
  const shipping = 0;
  const tax = (subtotal + shipping) * 0.1;
  const total = subtotal + shipping + tax;

  if (items.length === 0) return null;

  const minDate = todayISO();

  return (
    <>
      <Head>
        <title>Click & collect — {SITE.name}</title>
      </Head>
      <EcommerceLayout>
        <div className="max-w-grid mx-auto px-6 lg:px-20 py-12">
          {isDemoPayments && (
            <div className="mb-6 p-4 rounded-refined bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <strong>Site en démo</strong> — Vous serez redirigé vers la page de paiement Stripe ; aucun prélèvement réel ne sera effectué. Les commandes restent en attente de paiement.
            </div>
          )}
          <h1 className="font-heading text-h1 text-kafe-charcoal mb-2">Click & collect</h1>
          <p className="text-kafe-charcoal/70 mb-10">
            Retrait au café · {SITE.address}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="border border-kafe-pearl rounded-refined bg-kafe-bg p-6 lg:p-8">
                <h2 className="font-heading text-h2 text-kafe-charcoal mb-6">Vos coordonnées</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-kafe-charcoal">Prénom *</label>
                      <input
                        type="text"
                        value={contact.firstName}
                        onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-kafe-pearl rounded-refined bg-white focus:outline-none focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary text-kafe-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-kafe-charcoal">Nom *</label>
                      <input
                        type="text"
                        value={contact.lastName}
                        onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-kafe-pearl rounded-refined bg-white focus:outline-none focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary text-kafe-charcoal"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-kafe-charcoal">Email *</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-kafe-pearl rounded-refined bg-white focus:outline-none focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary text-kafe-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-kafe-charcoal">Téléphone *</label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-kafe-pearl rounded-refined bg-white focus:outline-none focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary text-kafe-charcoal"
                      />
                    </div>
                  </div>

                  <h3 className="font-heading text-h3 text-kafe-charcoal mt-8 mb-4">Créneau de retrait</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-kafe-charcoal">Date *</label>
                      <input
                        type="date"
                        value={pickupDate}
                        min={minDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full px-4 py-2.5 border border-kafe-pearl rounded-refined bg-white focus:outline-none focus:ring-1 focus:ring-kafe-primary text-kafe-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-kafe-charcoal">Heure *</label>
                      <select
                        value={pickupSlot}
                        onChange={(e) => setPickupSlot(e.target.value)}
                        className="w-full px-4 py-2.5 border border-kafe-pearl rounded-refined bg-white focus:outline-none focus:ring-1 focus:ring-kafe-primary text-kafe-charcoal"
                      >
                        {PICKUP_SLOTS.map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-kafe-charcoal">Instructions (optionnel)</label>
                    <textarea
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="Allergies, demande spéciale..."
                      rows={2}
                      className="w-full px-4 py-2.5 border border-kafe-pearl rounded-refined bg-white focus:outline-none focus:ring-1 focus:ring-kafe-primary text-kafe-charcoal"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateOrder}
                  disabled={loading || redirecting}
                  className="w-full mt-6 btn-primary bg-kafe-primary hover:bg-kafe-primary/90 text-white disabled:opacity-50"
                >
                  {redirecting
                    ? 'Redirection vers le paiement...'
                    : loading
                      ? 'Création de la commande...'
                      : 'Payer et confirmer (Stripe)'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="border border-kafe-pearl rounded-refined bg-kafe-pearl/20 p-6 sticky top-24">
                <h2 className="font-heading text-h2 text-kafe-charcoal mb-4">Récapitulatif</h2>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-refined"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-small text-kafe-charcoal">{item.name}</h4>
                        {item.variantName && (
                          <p className="text-caption text-kafe-charcoal/60">{item.variantName}</p>
                        )}
                        <p className="text-small">
                          {item.quantity} × {Number(item.price).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-kafe-pearl pt-4 space-y-2 text-small">
                  <div className="flex justify-between">
                    <span className="text-kafe-charcoal/70">Sous-total</span>
                    <span>{Number(subtotal).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-kafe-charcoal/70">Retrait</span>
                    <span className="text-kafe-sage">0 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-kafe-charcoal/70">TVA 10%</span>
                    <span>{Number(tax).toFixed(2)} €</span>
                  </div>
                </div>
                <div className="border-t border-kafe-pearl pt-4 mt-4 flex justify-between font-semibold text-lg text-kafe-charcoal">
                  <span>Total</span>
                  <span>{Number(total).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EcommerceLayout>
    </>
  );
}
