// frontend/pages/offres-hotel.js - Offres & Promos (style Glasgow)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { hotelApi } from '../utils/hotelApi';
import { DEFAULT_HOTEL } from '../lib/hotelConstants';
import { HOTEL_IMAGES } from '../lib/hotelImages';
import { Tag, ArrowRight } from 'lucide-react';

const defaultSettings = { site_name: DEFAULT_HOTEL.name };

export default function OffresHotel() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelApi.getOffers().then(setOffers).catch(() => setOffers([])).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Offres & Promotions | {defaultSettings.site_name}</title>
        <meta name="description" content="Offres et promotions pour votre séjour. Tarifs à partir de." />
      </Head>
      <Header settings={defaultSettings} />
      <main className="min-h-screen bg-[#1A1A1A] text-white pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-light tracking-wide">Offres</h1>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              Découvrez nos offres et promotions pour votre prochain séjour.
            </p>
          </header>
          {loading && <p className="text-center text-slate-500">Chargement…</p>}
          <div className="grid gap-8 md:grid-cols-2">
            {offers.map((o, idx) => (
              <article key={o.id} className="rounded-2xl overflow-hidden bg-[#1A1A1A]/50 border border-white/10 hover:border-[#C9A96E]/30 transition-colors group">
                <div className="aspect-[2/1] relative bg-[#1A1A1A]/80">
                  <Image
                    src={o.image_url || HOTEL_IMAGES.hotel[idx % HOTEL_IMAGES.hotel.length].src}
                    alt={o.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {o.price_from != null && (
                    <div className="absolute bottom-4 left-4 bg-[#C9A96E]/90 text-[#1A1A1A] px-3 py-1 rounded text-sm font-medium">
                      À partir de {Number(o.price_from).toFixed(0)} €
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-heading font-light">{o.name}</h2>
                  {(o.short_description || o.description) && (
                    <p className="mt-2 text-slate-400 line-clamp-2">{o.short_description || o.description}</p>
                  )}
                  <Link
                    href="/reservation-chambre"
                    className="mt-4 inline-flex items-center gap-2 text-[#C9A96E] hover:text-amber-300 font-medium"
                  >
                    Réserver <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {!loading && offers.length === 0 && (
            <section>
              <p className="text-center text-slate-500 mb-12">Aucune offre pour le moment. Découvrez notre établissement.</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {HOTEL_IMAGES.hotel.slice(0, 4).map((img, i) => (
                  <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1A1A1A]/80 ring-1 ring-white/5">
                    <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent" />
                    <p className="absolute bottom-4 left-4 right-4 text-slate-200 text-sm">{img.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link href="/reservation-chambre" className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A96E] hover:bg-[#C9A96E] text-[#1A1A1A] font-medium rounded-lg transition-colors">
                  Réserver <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer settings={defaultSettings} />
    </>
  );
}
