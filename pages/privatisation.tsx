/**
 * Privatisation & Événements — Kafé Stockholm (cursorrules 5.6)
 * Description + formulaire de demande (support_tickets)
 */

import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import EcommerceLayout from '@/components/ecommerce/EcommerceLayout';
import NordicDivider from '@/components/cafe/NordicDivider';
import { SITE } from '@/lib/site-config';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PrivatisationPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    eventType: '',
    date: '',
    guestCount: '',
    slot: '',
    equipment: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/support/tickets`, {
        subject: 'Demande de privatisation',
        message: `Privatisation — ${form.firstName} ${form.lastName}\nEmail: ${form.email}\nTél: ${form.phone}\nEntreprise: ${form.company}\nType: ${form.eventType}\nDate: ${form.date}\nPersonnes: ${form.guestCount}\nCréneau: ${form.slot}\nMatériel: ${form.equipment}\n\n${form.message}`,
        customer_name: `${form.firstName} ${form.lastName}`,
        customer_email: form.email,
        priority: 'high',
      });
      setSent(true);
      setForm({ firstName: '', lastName: '', email: '', phone: '', company: '', eventType: '', date: '', guestCount: '', slot: '', equipment: '', message: '' });
    } catch (err) {
      setError('Oups ! L’envoi n’a pas abouti. Vous pouvez nous contacter par email ou téléphone.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Head>
        <title>{`Privatisation & Événements — ${SITE.name}, Lyon`}</title>
        <meta name="description" content={`Privatisez ${SITE.name} : ${SITE.eventRooms} salles, ${SITE.eventCapacity} personnes. Séminaires, cocktails, Lyon.`} />
      </Head>
      <EcommerceLayout>
        <div className="max-w-grid mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Colonne gauche : texte + formulaire compacts, même hauteur que les images */}
            <div className="lg:col-span-5 max-w-md flex flex-col">
              <h1 className="font-display text-xl sm:text-2xl text-kafe-primary-dark mb-0.5">Privatisation & Événements</h1>
              <p className="text-kafe-text-secondary text-xs mb-2 max-w-md">
                Deux salles jusqu&apos;à {SITE.eventCapacity} personnes · Journée ou soirée · Matériel conférence · Wi-Fi gratuit.
              </p>
              <NordicDivider className="!mx-0 !my-2" />

              <h2 className="font-heading text-base text-kafe-primary-dark mb-1 mt-2">Types d&apos;événements</h2>
              <ul className="text-kafe-text-secondary text-xs space-y-0.5 mb-4">
                <li>Séminaire · Conférence · Cocktail · Afterwork · Association · Atelier</li>
              </ul>

              <h2 className="font-heading text-base text-kafe-primary-dark mb-2">Demande de privatisation</h2>
              {sent ? (
                <div className="bg-kafe-primary-xlight border border-kafe-primary/20 rounded-refined p-3">
                  <p className="text-kafe-primary-dark font-medium text-xs">Merci ! Votre demande a bien été envoyée. Nous vous recontacterons rapidement.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-1.5 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-medium text-kafe-text mb-0.5">Prénom</label>
                  <input id="firstName" name="firstName" type="text" required value={form.firstName} onChange={handleChange} className="w-full px-2 py-1 text-sm border border-kafe-border rounded bg-white text-kafe-text focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-medium text-kafe-text mb-0.5">Nom</label>
                  <input id="lastName" name="lastName" type="text" required value={form.lastName} onChange={handleChange} className="w-full px-2 py-1 text-sm border border-kafe-border rounded bg-white text-kafe-text focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-kafe-text mb-0.5">Email</label>
                  <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="w-full px-2 py-1 text-sm border border-kafe-border rounded bg-white text-kafe-text focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-kafe-text mb-0.5">Tél.</label>
                  <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full px-2 py-1 text-sm border border-kafe-border rounded bg-white text-kafe-text focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary" />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="block text-xs font-medium text-kafe-text mb-0.5">Entreprise (opt.)</label>
                <input id="company" name="company" type="text" value={form.company} onChange={handleChange} className="w-full px-2 py-1 text-sm border border-kafe-border rounded bg-white text-kafe-text focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="eventType" className="block text-xs font-medium text-kafe-text mb-0.5">Type</label>
                  <select id="eventType" name="eventType" value={form.eventType} onChange={handleChange} className="w-full px-2 py-1 text-sm border border-kafe-border rounded bg-white text-kafe-text focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary">
                    <option value="">— Choisir —</option>
                    <option value="seminaire">Séminaire</option>
                    <option value="conference">Conférence</option>
                    <option value="cocktail">Cocktail</option>
                    <option value="association">Association / Atelier</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="slot" className="block text-xs font-medium text-kafe-text mb-0.5">Créneau</label>
                  <select id="slot" name="slot" value={form.slot} onChange={handleChange} className="w-full px-2 py-1 text-sm border border-kafe-border rounded bg-white text-kafe-text focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary">
                    <option value="">— Choisir —</option>
                    <option value="matin">Matin</option>
                    <option value="apres-midi">Après-midi</option>
                    <option value="journee">Journée</option>
                    <option value="soiree">Soirée</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="date" className="block text-xs font-medium text-kafe-text mb-0.5">Date</label>
                  <input id="date" name="date" type="date" value={form.date} onChange={handleChange} className="w-full px-2 py-1 text-sm border border-kafe-border rounded bg-white text-kafe-text focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary" />
                </div>
                <div>
                  <label htmlFor="guestCount" className="block text-xs font-medium text-kafe-text mb-0.5">Personnes</label>
                  <input id="guestCount" name="guestCount" type="number" min="1" max="60" value={form.guestCount} onChange={handleChange} placeholder="max 60" className="w-full px-2 py-1 text-sm border border-kafe-border rounded bg-white text-kafe-text focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary" />
                </div>
              </div>
              <div>
                <label htmlFor="equipment" className="block text-xs font-medium text-kafe-text mb-0.5">Matériel (vidéo, micro…)</label>
                <input id="equipment" name="equipment" type="text" value={form.equipment} onChange={handleChange} className="w-full px-2 py-1 text-sm border border-kafe-border rounded bg-white text-kafe-text focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary" />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-kafe-text mb-0.5">Message</label>
                <textarea id="message" name="message" rows={2} value={form.message} onChange={handleChange} className="w-full px-2 py-1 text-sm border border-kafe-border rounded bg-white text-kafe-text focus:ring-1 focus:ring-kafe-primary focus:border-kafe-primary resize-none" />
              </div>
              {error && <p className="text-kafe-accent2 text-xs">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary text-sm py-1.5 px-3 mt-1">
                {loading ? 'Envoi…' : 'Envoyer la demande'}
              </button>
            </form>
              )}
            </div>

            {/* Colonne droite : galerie 3 images (même hauteur que la colonne gauche) */}
            <div className="lg:col-span-7 relative grid grid-cols-1 sm:grid-cols-5 grid-rows-2 gap-2 sm:gap-3 min-h-[280px] sm:min-h-0 lg:min-h-[320px]">
              <div className="sm:col-span-3 sm:row-span-2 relative overflow-hidden rounded-xl shadow-md min-h-[120px] sm:min-h-[180px] lg:min-h-full">
                <img
                  src="/images/privatisation-2.jpg"
                  alt="Espace privatisation — Kafé Stockholm"
                  className="w-full h-full object-cover object-center scale-x-[-1]"
                />
              </div>
              <div className="sm:col-span-2 relative overflow-hidden rounded-xl shadow min-h-[80px] sm:min-h-[90px] lg:min-h-0 h-full">
                <img
                  src="/images/privatisation-1.png"
                  alt="Salle privatisation"
                  className="w-full h-full min-h-[80px] sm:min-h-[90px] object-cover"
                />
              </div>
              <div className="sm:col-span-2 relative overflow-hidden rounded-xl shadow min-h-[80px] sm:min-h-[90px] lg:min-h-0 h-full">
                <img
                  src="/images/privatisation-3.jpg"
                  alt="Événement au Kafé"
                  className="w-full h-full min-h-[80px] sm:min-h-[90px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </EcommerceLayout>
    </>
  );
}
