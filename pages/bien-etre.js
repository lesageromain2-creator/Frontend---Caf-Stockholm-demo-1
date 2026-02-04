// frontend/pages/bien-etre.js - Bien-être : Spa, Fitness, Salon (style Mandarin Oriental)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { hotelApi } from '../utils/hotelApi';
import { HOTEL_IMAGES } from '../lib/hotelImages';
import { Sparkles, Dumbbell, Scissors } from 'lucide-react';

const defaultSettings = { site_name: 'Hôtel' };
const typeIcons = { spa: Sparkles, fitness: Dumbbell, salon: Scissors };

export default function BienEtre() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelApi.getWellness().then(setServices).catch(() => setServices([])).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Bien-être | Spa, Fitness, Salon | {defaultSettings.site_name}</title>
        <meta name="description" content="Spa, remise en forme et salon. Découvrez nos espaces bien-être." />
      </Head>
      <Header settings={defaultSettings} />
      <main className="min-h-screen bg-slate-950 text-white pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-light tracking-wide">Bien-être</h1>
            <p className="mt-4 text-[#8B8680] text-lg max-w-2xl mx-auto">
              Spa, remise en forme et salon pour une parenthèse de sérénité.
            </p>
          </header>
          {loading && <p className="text-center text-slate-500">Chargement…</p>}
          {!loading && (
            <>
              {/* Spa - API ou images locales */}
              <section className="mb-16">
                <h2 className="text-2xl font-heading font-light mb-8">Spa</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services.filter((s) => s.type === 'spa').length > 0
                    ? services.filter((s) => s.type === 'spa').map((s) => (
                        <article key={s.id} className="rounded-2xl overflow-hidden bg-[#1A1A1A]/50 border border-white/10">
                          <div className="aspect-[4/3] relative bg-slate-800">
                            <Image src={s.image_url || HOTEL_IMAGES.spa[0].src} alt={s.name} fill className="object-cover" sizes="33vw" />
                          </div>
                          <div className="p-6">
                            <span className="text-xs uppercase tracking-wider text-[#C9A96E]">Spa</span>
                            <h2 className="text-xl font-heading font-light mt-1">{s.name}</h2>
                            <p className="mt-2 text-[#8B8680] text-sm">{(s.short_description || s.description) || HOTEL_IMAGES.spa[0].text}</p>
                          </div>
                        </article>
                      ))
                    : HOTEL_IMAGES.spa.slice(0, 6).map((img, i) => (
                        <article key={`spa-${i}`} className="rounded-2xl overflow-hidden bg-[#1A1A1A]/50 border border-white/10 group">
                          <div className="aspect-[4/3] relative bg-slate-800">
                            <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                          </div>
                          <div className="p-6">
                            <span className="text-xs uppercase tracking-wider text-[#C9A96E]">Spa</span>
                            <p className="mt-2 text-[#8B8680] text-sm">{img.text}</p>
                          </div>
                        </article>
                      ))}
                </div>
              </section>
              {/* Piscine */}
              <section>
                <h2 className="text-2xl font-heading font-light mb-8">Piscine</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {HOTEL_IMAGES.piscine.map((img, i) => (
                    <article key={i} className="rounded-2xl overflow-hidden bg-[#1A1A1A]/50 border border-white/10 group">
                      <div className="aspect-[4/3] relative bg-slate-800">
                        <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                      </div>
                      <div className="p-4">
                        <p className="text-[#8B8680] text-sm">{img.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer settings={defaultSettings} />
    </>
  );
}
