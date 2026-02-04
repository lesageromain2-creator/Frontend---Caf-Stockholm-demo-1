// frontend/pages/restauration.js - Petit-déjeuner & Restauration (style Glasgow)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { hotelApi } from '../utils/hotelApi';
import { DEFAULT_HOTEL, BREAKFAST_ITEMS } from '../lib/hotelConstants';
import { HOTEL_IMAGES } from '../lib/hotelImages';
import { UtensilsCrossed, Wine, Coffee, ArrowRight, CheckCircle2 } from 'lucide-react';

const defaultSettings = { site_name: DEFAULT_HOTEL.name };

export default function Restauration() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelApi.getDining().then(setVenues).catch(() => setVenues([])).finally(() => setLoading(false));
  }, []);

  const siteName = defaultSettings.site_name;

  return (
    <>
      <Head>
        <title>Petit-déjeuner & Restauration | {siteName}</title>
        <meta name="description" content="Petit-déjeuner buffet, jus fraîchement pressés, viennoiseries artisanales. Options sans gluten. Service en chambre sans supplément." />
      </Head>
      <Header settings={defaultSettings} />
      <main className="min-h-screen bg-slate-950 text-white pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-light tracking-wide">Petit-déjeuner</h1>
            <p className="mt-4 text-[#8B8680] text-lg max-w-2xl mx-auto">
              Régalez vos papilles dès le réveil !
            </p>
          </header>

          {/* Section Glasgow-style petit-déjeuner */}
          <section className="mb-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-2xl font-heading font-light mb-6">
                  Jus d&apos;orange fraîchement pressés, fruits frais, viennoiseries artisanales
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Parmi notre variété de douceurs maison et de boissons chaudes mais aussi notre sélection de fromages et charcuteries, vous trouverez ce qui vous fait plaisir !
                </p>
                <p className="text-[#C9A96E]/90 mb-4">
                  <strong>Besoin d&apos;options sans gluten ?</strong> Nous avons ce qu&apos;il vous faut, sur demande.
                </p>
                <p className="text-[#8B8680]">
                  Dégustez votre petit-déjeuner en chambre, sans supplément. Un vrai régal pour bien commencer la journée !
                </p>
                <div className="mt-8 grid gap-2">
                  {BREAKFAST_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A96E] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1A1A1A]/80 ring-1 ring-white/5">
                <Image src={HOTEL_IMAGES.breakfast[0].src} alt={HOTEL_IMAGES.breakfast[0].alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                <p className="absolute bottom-4 left-4 right-4 text-slate-200 text-sm bg-slate-950/60 backdrop-blur-sm p-3 rounded-lg">{HOTEL_IMAGES.breakfast[0].text}</p>
              </div>
            </div>
          </section>

          {/* Galerie petit-déjeuner */}
          <section className="mb-20">
            <h2 className="text-2xl font-heading font-light mb-8">En images</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {HOTEL_IMAGES.breakfast.map((img, i) => (
                <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1A1A1A]/80 ring-1 ring-white/5">
                  <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="absolute bottom-0 left-0 right-0 p-4 text-slate-200 text-sm translate-y-full group-hover:translate-y-0 transition-transform bg-slate-950/90">{img.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Restaurants / Bars si API */}
          {loading && <p className="text-center text-slate-500">Chargement…</p>}
          {!loading && venues.length > 0 && (
            <section>
              <h2 className="text-2xl font-heading font-light mb-8">Restaurants & Bars</h2>
              <div className="grid gap-12 md:grid-cols-2">
                {venues.map((v) => (
                  <article key={v.id} className="rounded-2xl overflow-hidden bg-[#1A1A1A]/50 border border-white/10">
                    <div className="aspect-[16/10] relative bg-[#1A1A1A]/80">
                      {v.image_url ? (
                        <Image src={v.image_url} alt={v.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                          {v.type === 'bar' ? <Wine className="w-16 h-16" /> : <UtensilsCrossed className="w-16 h-16" />}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-xs uppercase tracking-wider text-[#C9A96E]">{v.type}</span>
                      <h3 className="text-2xl font-heading font-light mt-1">{v.name}</h3>
                      {(v.short_description || v.description) && (
                        <p className="mt-2 text-[#8B8680] line-clamp-3">{v.short_description || v.description}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <div className="mt-16 text-center">
            <Link
              href="/reservation-chambre"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A96E] hover:bg-[#C9A96E] text-[#1A1A1A] font-medium rounded-lg transition-colors"
            >
              Réserver un séjour <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
      <Footer settings={defaultSettings} />
    </>
  );
}
