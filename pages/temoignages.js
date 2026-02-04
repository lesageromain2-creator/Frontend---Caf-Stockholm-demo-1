// frontend/pages/temoignages.js - Témoignages / Avis clients (style hôtel)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Star, Quote, User as UserIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllTestimonials, fetchSettings } from '../utils/api';
import { hotelApi } from '../utils/hotelApi';
import { DEFAULT_HOTEL } from '../lib/hotelConstants';

const FALLBACK_TESTIMONIALS = [
  { content: 'Hôtel calme et chaleureux au personnel très agréable avec le sens du service.', rating: 5, client_name: 'Avis Google', created_at: new Date().toISOString() },
];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({});
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [testimonialsRes, settingsRes, hotelRes] = await Promise.all([
        getAllTestimonials().catch(() => ({ testimonials: [] })),
        fetchSettings().catch(() => ({})),
        hotelApi.getHotel().catch(() => null),
      ]);
      const list = testimonialsRes?.testimonials || testimonialsRes || [];
      setTestimonials(Array.isArray(list) && list.length > 0 ? list : FALLBACK_TESTIMONIALS);
      setSettings(settingsRes);
      setHotel(hotelRes);
    } catch (error) {
      console.error('Erreur chargement témoignages:', error);
      setTestimonials(FALLBACK_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  };

  const siteName = hotel?.name || settings.site_name || DEFAULT_HOTEL.name;

  const renderStars = (rating = 5) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={20}
        fill={i < rating ? '#f59e0b' : 'none'}
        color={i < rating ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)'}
      />
    ));
  };

  return (
    <>
      <Head>
        <title>Témoignages – Avis clients | {siteName}</title>
        <meta name="description" content="Découvrez les avis de nos clients. Ce qu'ils pensent de leur séjour." />
      </Head>

      <Header settings={{ site_name: siteName }} />

      <main className="min-h-screen bg-[#1A1A1A] text-white pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-light tracking-wide">Témoignages</h1>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              Ce que nos clients disent de leur séjour chez nous.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <article
                  key={t.id || i}
                  className="p-6 rounded-2xl bg-[#1A1A1A]/50 border border-white/10 hover:border-[#C9A96E]/20 transition-colors"
                >
                  <Quote className="w-10 h-10 text-amber-400/30 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {renderStars(t.rating)}
                  </div>
                  <p className="text-slate-300 italic leading-relaxed">
                    &ldquo;{t.content || t.message}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C9A96E]/20 text-amber-400">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{t.client_name || 'Client'}</p>
                      {t.company_name && <p className="text-sm text-slate-500">{t.company_name}</p>}
                    </div>
                  </div>
                  {t.created_at && (
                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(t.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}

          <section className="mt-16 text-center p-8 rounded-2xl bg-[#1A1A1A]/30 border border-white/5">
            <h2 className="text-xl font-heading font-light mb-4">Vous souhaitez partager votre expérience ?</h2>
            <p className="text-slate-400 mb-6">Votre avis compte pour nous.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A96E] hover:bg-amber-400 text-[#1A1A1A] font-medium rounded-lg transition-colors"
            >
              Nous contacter
            </Link>
          </section>
        </div>
      </main>

      <Footer settings={{ site_name: siteName }} />
    </>
  );
}
