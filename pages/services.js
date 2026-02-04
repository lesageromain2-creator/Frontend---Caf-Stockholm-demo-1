// frontend/pages/services.js - Services hôtel (style Glasgow)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { hotelApi } from '../utils/hotelApi';
import { DEFAULT_HOTEL, SERVICES_LIST } from '../lib/hotelConstants';
import { HOTEL_IMAGES } from '../lib/hotelImages';
import {
  CreditCard,
  Car,
  Coffee,
  Tv,
  Wind,
  Wifi,
  Key,
  Clock,
  Baby,
  ConciergeBell,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const HOTEL_SERVICES = [
  { name: 'Cartes acceptées : CB, Visa, Mastercard, American Express, Maestro', icon: CreditCard },
  { name: 'Parking privé avec tarif préférentiel', icon: Car },
  { name: 'Transfert gare / aéroport (en supplément)', icon: Car },
  { name: 'Conciergerie et bagagerie', icon: ConciergeBell },
  { name: 'Ascenseur', icon: ArrowRight },
  { name: 'Revues et journaux à disposition', icon: ArrowRight },
  { name: 'Lit bébé sur demande', icon: Baby },
  { name: 'Café et thé à toute heure dans le salon', icon: Coffee },
  { name: 'Personnel multilingue', icon: ArrowRight },
  { name: 'Départ tardif jusqu\'à 15h (sur demande, en supplément)', icon: Clock },
  { name: 'Arrivée à partir de 15h • Départ jusqu\'à 11h', icon: Clock },
  { name: 'Chromecast en chambre', icon: Tv },
  { name: 'Climatisation', icon: Wind },
  { name: 'Wi-Fi haut débit gratuit', icon: Wifi },
  { name: 'Réception ouverte 24h/24', icon: Key },
];

const BREAKFAST_CONTENT = [
  'Oeufs brouillés et pommes de terre',
  'Jambon et oeufs durs',
  'Sélection de 3 fromages',
  'Sélection de 3 céréales',
  'Yaourts nature et aux fruits',
  'Compote de pommes',
  'Fruits frais',
  'Confitures, beurre, pâtes à tartiner, miel',
  'Pains de mie, biscottes',
  'Pains et viennoiseries artisanales',
  'Jus de fruits',
  'Café, thé, lait, chocolat chaud',
  'Gâteaux faits maison et pain perdu',
  'Galettes de riz et lait de soja (sur demande, intolérances)',
];

const defaultSettings = { site_name: DEFAULT_HOTEL.name };

export default function ServicesPage() {
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    hotelApi.getHotel().then(setHotel).catch(() => setHotel(null));
  }, []);

  const siteName = hotel?.name || defaultSettings.site_name;

  return (
    <>
      <Head>
        <title>Services & Équipements | {siteName}</title>
        <meta name="description" content="Découvrez les services et équipements de l'hôtel : réception 24h/24, Wi-Fi, petit-déjeuner buffet, climatisation, parking." />
      </Head>
      <Header settings={{ site_name: siteName }} />

      <main className="min-h-screen bg-slate-950 text-white pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-light tracking-wide">Services</h1>
            <p className="mt-4 text-[#8B8680] text-lg max-w-2xl mx-auto">
              Des services adaptés et flexibles pour un séjour confortable.
            </p>
          </header>

          {/* Pourquoi venir */}
          <section className="mb-20">
            <h2 className="text-2xl font-heading font-light mb-8">Pourquoi venir chez nous ?</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {SERVICES_LIST.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#1A1A1A]/50 border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A96E] shrink-0" />
                  <span className="text-slate-200">{s}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/reservation-chambre" className="inline-flex items-center gap-2 text-[#C9A96E] hover:text-amber-300 font-medium">
                Réserver <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Services de l'hôtel */}
          <section className="mb-20">
            <h2 className="text-2xl font-heading font-light mb-8">Services de l&apos;hôtel</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {HOTEL_SERVICES.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#1A1A1A]/50 border border-white/5">
                    <Icon className="w-5 h-5 text-[#C9A96E] shrink-0 mt-0.5" />
                    <span className="text-slate-200">{s.name}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-slate-500 text-sm">
              Les animaux de compagnie ne sont pas admis au sein de l&apos;établissement.
            </p>
          </section>

          {/* Réserver en ligne - visuel */}
          <section className="mb-20">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#1A1A1A]/80 ring-1 ring-white/5">
                <Image src={HOTEL_IMAGES.contact[0].src} alt={HOTEL_IMAGES.contact[0].alt} fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-slate-950/40 flex items-end p-6">
                  <p className="text-slate-200 text-lg">{HOTEL_IMAGES.contact[0].text}</p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-heading font-light mb-4">Réservez directement</h2>
                <p className="text-[#8B8680] mb-6">Notre site vous garantit le meilleur tarif. Choisissez vos dates, votre chambre et validez en quelques clics.</p>
                <Link href="/reservation-chambre" className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A96E] hover:bg-[#C9A96E] text-[#1A1A1A] font-medium rounded-lg transition-colors">
                  Réserver maintenant <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Petit-déjeuner */}
          <section className="mb-20">
            <h2 className="text-2xl font-heading font-light mb-4">Petit-déjeuner</h2>
            <p className="text-[#8B8680] mb-8">
              Servi de 7h00 à 10h00. Buffet composé de :
            </p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {BREAKFAST_CONTENT.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-[#1A1A1A]/50 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96E] shrink-0" />
                  <span className="text-slate-200 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[#C9A96E]/90 text-sm">
              Petit-déjeuner servi en chambre sans supplément, sur demande.
            </p>
          </section>

          {/* CTA */}
          <section className="text-center py-12 rounded-2xl bg-[#1A1A1A]/30 border border-white/5">
            <h2 className="text-xl font-heading font-light mb-4">Prêt à réserver ?</h2>
            <Link
              href="/reservation-chambre"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A96E] hover:bg-[#C9A96E] text-[#1A1A1A] font-medium rounded-lg transition-colors"
            >
              Réserver un séjour <ArrowRight className="w-5 h-5" />
            </Link>
          </section>
        </div>
      </main>

      <Footer settings={{ site_name: siteName }} />
    </>
  );
}
