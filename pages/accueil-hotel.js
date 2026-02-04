// frontend/pages/accueil-hotel.js - Accueil style Mandarin Oriental (Séjour, Restauration, Bien-être, Réserver)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { hotelApi } from '../utils/hotelApi';
import { HOTEL_IMAGES, HERO_FALLBACK } from '../lib/hotelImages';
import { Bed, UtensilsCrossed, Sparkles, Tag, ArrowRight } from 'lucide-react';

const defaultSettings = { site_name: 'Hôtel' };

const sections = [
  { title: 'Séjour', subtitle: 'Chambres & Suites', href: '/sejour', icon: Bed },
  { title: 'Restauration', subtitle: 'Restaurants & Bars', href: '/restauration', icon: UtensilsCrossed },
  { title: 'Bien-être', subtitle: 'Spa, Fitness, Salon', href: '/bien-etre', icon: Sparkles },
  { title: 'Offres', subtitle: 'Promotions', href: '/offres-hotel', icon: Tag },
];

export default function AccueilHotel() {
  const [hotel, setHotel] = useState(null);
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    hotelApi.getHotel().then(setHotel).catch(() => setHotel(null));
  }, []);

  useEffect(() => {
    setHeroImage(hotel?.hero_image_url || HERO_FALLBACK.src);
  }, [hotel]);

  return (
    <>
      <Head>
        <title>{hotel?.name || defaultSettings.site_name} – Séjour, Restauration, Bien-être</title>
        <meta name="description" content={hotel?.tagline || "Une rencontre entre tradition et excellence. Réservez votre séjour."} />
      </Head>
      <Header settings={{ site_name: hotel?.name || defaultSettings.site_name }} />

      <div className="min-h-screen bg-[#1A1A1A] text-white">
        {/* Hero */}
        <section className="relative min-h-[85vh] flex flex-col justify-end pb-20 md:pb-28">
          <div className="absolute inset-0 bg-[#1A1A1A]">
            {heroImage ? (
              <Image src={heroImage} alt="" fill className="object-cover opacity-70" priority sizes="100vw" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/80 to-[#1A1A1A]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/40 to-transparent" />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-light tracking-wide">
              {hotel?.name || 'Bienvenue'}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-[#B5B1AC] max-w-2xl mx-auto">
              {hotel?.tagline || 'Une rencontre entre tradition et excellence.'}
            </p>
            <Link
              href="/reservation-chambre"
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-[#C9A96E] hover:bg-[#C9A96E] text-[#1A1A1A] font-medium rounded-lg transition-colors"
            >
              Réserver un séjour <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Sections avec images */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/sejour" className="group block rounded-2xl overflow-hidden bg-[#1A1A1A]/50 border border-white/10 hover:border-[#C9A96E]/40 transition-all">
                <div className="relative aspect-[4/3]">
                  <Image src={HOTEL_IMAGES.rooms[0].src} alt={HOTEL_IMAGES.rooms[0].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Bed className="w-10 h-10 text-[#C9A96E] mb-2" />
                    <h2 className="text-2xl font-heading font-light text-white">Séjour</h2>
                    <p className="text-slate-400 text-sm">Chambres & Suites</p>
                  </div>
                </div>
                <div className="p-4">
                  <span className="inline-flex items-center gap-1 text-[#C9A96E] text-sm font-medium group-hover:gap-2 transition-all">En savoir plus <ArrowRight className="w-4 h-4" /></span>
                </div>
              </Link>
              <Link href="/restauration" className="group block rounded-2xl overflow-hidden bg-[#1A1A1A]/50 border border-white/10 hover:border-[#C9A96E]/40 transition-all">
                <div className="relative aspect-[4/3]">
                  <Image src={HOTEL_IMAGES.breakfast[0].src} alt={HOTEL_IMAGES.breakfast[0].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <UtensilsCrossed className="w-10 h-10 text-[#C9A96E] mb-2" />
                    <h2 className="text-2xl font-heading font-light text-white">Restauration</h2>
                    <p className="text-slate-400 text-sm">Restaurants & Bars</p>
                  </div>
                </div>
                <div className="p-4">
                  <span className="inline-flex items-center gap-1 text-[#C9A96E] text-sm font-medium group-hover:gap-2 transition-all">En savoir plus <ArrowRight className="w-4 h-4" /></span>
                </div>
              </Link>
              <Link href="/bien-etre" className="group block rounded-2xl overflow-hidden bg-[#1A1A1A]/50 border border-white/10 hover:border-[#C9A96E]/40 transition-all">
                <div className="relative aspect-[4/3]">
                  <Image src={HOTEL_IMAGES.spa[0].src} alt={HOTEL_IMAGES.spa[0].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Sparkles className="w-10 h-10 text-[#C9A96E] mb-2" />
                    <h2 className="text-2xl font-heading font-light text-white">Bien-être</h2>
                    <p className="text-slate-400 text-sm">Spa, Fitness, Salon</p>
                  </div>
                </div>
                <div className="p-4">
                  <span className="inline-flex items-center gap-1 text-[#C9A96E] text-sm font-medium group-hover:gap-2 transition-all">En savoir plus <ArrowRight className="w-4 h-4" /></span>
                </div>
              </Link>
              <Link href="/offres-hotel" className="group block rounded-2xl overflow-hidden bg-[#1A1A1A]/50 border border-white/10 hover:border-[#C9A96E]/40 transition-all">
                <div className="relative aspect-[4/3]">
                  <Image src={HOTEL_IMAGES.hotel[2].src} alt={HOTEL_IMAGES.hotel[2].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Tag className="w-10 h-10 text-[#C9A96E] mb-2" />
                    <h2 className="text-2xl font-heading font-light text-white">Offres</h2>
                    <p className="text-slate-400 text-sm">Promotions</p>
                  </div>
                </div>
                <div className="p-4">
                  <span className="inline-flex items-center gap-1 text-[#C9A96E] text-sm font-medium group-hover:gap-2 transition-all">En savoir plus <ArrowRight className="w-4 h-4" /></span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Réserver */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-heading font-light">Réserver un séjour</h2>
            <p className="mt-2 text-slate-400">Choisissez vos dates, votre chambre et vos options.</p>
            <Link
              href="/reservation-chambre"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E]/10 rounded-lg font-medium transition-colors"
            >
              Réserver <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>

      <Footer settings={{ site_name: hotel?.name || defaultSettings.site_name }} />
    </>
  );
}
