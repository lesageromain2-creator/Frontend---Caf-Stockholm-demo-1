// frontend/pages/galerie.js - Galerie (style Glasgow)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { hotelApi } from '../utils/hotelApi';
import { DEFAULT_HOTEL } from '../lib/hotelConstants';
import { GALLERY_IMAGES } from '../lib/hotelImages';

const defaultSettings = { site_name: DEFAULT_HOTEL.name };

export default function Galerie() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    hotelApi.getGallery(category || undefined).then(setMedia).catch(() => setMedia([])).finally(() => setLoading(false));
  }, [category]);

  const allCategories = [...new Set([...media.map((m) => m.category), ...GALLERY_IMAGES.map((m) => m.category)].filter(Boolean))];
  const localItems = GALLERY_IMAGES.filter((m) => !category || m.category === category).map((m, i) => ({ id: `local-${i}`, url: m.src, title: m.alt, category: m.category, type: 'image', text: m.text }));
  const apiItems = media.filter((m) => !category || m.category === category);
  const displayItems = loading ? [] : (apiItems.length > 0 ? apiItems : localItems);

  return (
    <>
      <Head>
        <title>Galerie | {defaultSettings.site_name}</title>
        <meta name="description" content="Galerie photos et vidéos. Chambres, restauration, spa et événements." />
      </Head>
      <Header settings={defaultSettings} />
      <main className="min-h-screen bg-[#1A1A1A] text-white pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-light tracking-wide">Galerie</h1>
            <p className="mt-4 text-slate-400 text-lg">Découvrez notre univers en images.</p>
          </header>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button type="button" onClick={() => setCategory('')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-[#C9A96E] text-slate-900' : 'bg-[#1A1A1A]/80 text-slate-400 hover:bg-slate-700'}`}>Toutes</button>
            {allCategories.map((c) => (
              <button
                key={c || 'all'}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${category === c ? 'bg-[#C9A96E] text-slate-900' : 'bg-[#1A1A1A]/80 text-slate-400 hover:bg-slate-700'}`}
              >
                {c || 'Toutes'}
              </button>
            ))}
          </div>
          {loading && <p className="text-center text-slate-500">Chargement…</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayItems.map((m) => (
              <div key={m.id} className="group relative rounded-xl overflow-hidden bg-[#1A1A1A]/80 ring-1 ring-white/5">
                <div className="aspect-square relative">
                  {m.type === 'video' ? (
                    <video src={m.url} className="w-full h-full object-cover" muted loop playsInline />
                  ) : (
                    <Image src={m.url || m.src} alt={m.title || m.alt || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                  )}
                </div>
                {m.text && (
                  <p className="absolute bottom-0 left-0 right-0 p-3 text-slate-200 text-xs bg-[#1A1A1A]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">{m.text}</p>
                )}
              </div>
            ))}
          </div>
          {!loading && displayItems.length === 0 && (
            <p className="text-center text-slate-500">Aucune image ou vidéo pour le moment.</p>
          )}
        </div>
      </main>
      <Footer settings={defaultSettings} />
    </>
  );
}
