// frontend/pages/sejour.js - Chambres (style Glasgow : types, équipements inclus/supplément)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { hotelApi } from '../utils/hotelApi';
import { DEFAULT_HOTEL } from '../lib/hotelConstants';
import { HOTEL_IMAGES } from '../lib/hotelImages';
import { Bed, Users, Maximize2, ArrowRight, CheckCircle2 } from 'lucide-react';

const ROOM_AMENITIES_INCLUDED = [
  'Chromecast en chambre',
  'Climatisation',
  'Literie extra confort et hypoallergénique',
  'Couvertures et oreillers supplémentaires',
  'Wi-Fi haut débit',
  'Sèche-cheveux',
  'Produits d\'accueil',
  'Salle de bain avec baignoire ou douche',
  'Bureau de travail',
  'Téléphone',
  'Coffre-fort sécurisé',
  'Armoire / penderie',
];

const ROOM_AMENITIES_REQUEST = [
  'Fer et planche à repasser (sur demande, sans supplément)',
  'Lit bébé (sur demande, sans supplément)',
];

const ROOM_AMENITIES_EXTRA = [
  'Corbeille de fruits (en supplément)',
  'Sélection de macarons (en supplément)',
  'Bouteille de Champagne (en supplément)',
];

const defaultSettings = { site_name: DEFAULT_HOTEL.name };

export default function Sejour() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    hotelApi.getRooms()
      .then(setRooms)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const siteName = defaultSettings.site_name;

  return (
    <>
      <Head>
        <title>Chambres – Séjour | {siteName}</title>
        <meta name="description" content="Découvrez nos chambres design et climatisées. Literie haut de gamme, Wi-Fi gratuit. Tarifs et réservation en ligne." />
      </Head>
      <Header settings={defaultSettings} />
      <main className="min-h-screen bg-slate-950 text-white pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-light tracking-wide">Chambres</h1>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              Des chambres tout confort, conçues comme de véritables cocons. Toutes non-fumeurs.
            </p>
          </header>

          {/* Équipements par catégorie */}
          <section className="mb-16 grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-2xl bg-[#1A1A1A]/50 border border-emerald-500/20">
              <h3 className="font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Service inclus
              </h3>
              <ul className="space-y-2 text-sm text-[#B5B1AC]">
                {ROOM_AMENITIES_INCLUDED.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-[#1A1A1A]/50 border border-[#C9A96E]/20">
              <h3 className="font-semibold text-[#C9A96E] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Sur demande, sans supplément
              </h3>
              <ul className="space-y-2 text-sm text-[#B5B1AC]">
                {ROOM_AMENITIES_REQUEST.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-[#1A1A1A]/50 border border-white/10">
              <h3 className="font-semibold text-slate-400 mb-4">Services en supplément</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                {ROOM_AMENITIES_EXTRA.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </section>

          {loading && <p className="text-center text-slate-500">Chargement…</p>}
          {error && <p className="text-center text-[#C9A96E]">Erreur : {error}</p>}
          {!loading && !error && rooms.length === 0 && (
            <p className="text-center text-slate-500">Aucune chambre disponible pour le moment.</p>
          )}

          <div className="grid gap-10 md:grid-cols-2">
            {rooms.map((room, idx) => (
              <article
                key={room.id}
                className="group rounded-2xl overflow-hidden bg-[#1A1A1A]/50 border border-white/10 hover:border-[#C9A96E]/30 transition-all"
              >
                <div className="aspect-[4/3] relative bg-[#1A1A1A]/80">
                  <Image
                    src={room.image_url || HOTEL_IMAGES.rooms[idx % HOTEL_IMAGES.rooms.length].src}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="text-sm font-medium text-white/90 bg-black/40 px-3 py-1 rounded">
                      À partir de {Number(room.base_price_per_night).toFixed(0)} € / nuit
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-heading font-light">{room.name}</h2>
                  {(room.short_description || room.description) && (
                    <p className="mt-2 text-slate-400 line-clamp-2">{room.short_description || room.description}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    {room.max_guests && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {room.max_guests} pers.
                      </span>
                    )}
                    {room.size_sqm && (
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-4 h-4" /> {room.size_sqm} m²
                      </span>
                    )}
                    {room.bed_type && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" /> {room.bed_type}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/reservation-chambre?room_type_id=${room.id}`}
                    className="mt-6 inline-flex items-center gap-2 text-[#C9A96E] hover:text-amber-300 font-medium"
                  >
                    Réserver <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Galerie chambres */}
          <section className="mt-16">
            <h2 className="text-2xl font-heading font-light mb-8">Découvrez nos chambres en images</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {HOTEL_IMAGES.rooms.map((img, i) => (
                <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1A1A1A]/80 ring-1 ring-white/5">
                  <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 right-4 text-slate-200 text-sm">{img.text}</p>
                </div>
              ))}
            </div>
          </section>

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
