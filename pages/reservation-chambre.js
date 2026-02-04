// frontend/pages/reservation-chambre.js - Réservation de chambre (types, dates, options, dashboard)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { hotelApi } from '../utils/hotelApi';
import { checkAuth } from '../utils/api';
import { DEFAULT_HOTEL, ROOM_FEATURES } from '../lib/hotelConstants';
import { HOTEL_IMAGES as IMAGES } from '../lib/hotelImages';
import { Calendar, User, Mail, Phone, Coffee, Bed, Maximize2, Users, ArrowRight, LogIn, UserPlus } from 'lucide-react';

const defaultSettings = { site_name: DEFAULT_HOTEL.name };
const ROOM_IMAGES = IMAGES?.rooms || [];

export default function ReservationChambre() {
  const router = useRouter();
  const { room_type_id } = router.query;
  const [roomTypes, setRoomTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(room_type_id || '');
  const [addOns, setAddOns] = useState([]);
  const [guest, setGuest] = useState({
    guest_email: '',
    guest_firstname: '',
    guest_lastname: '',
    guest_phone: '',
    special_requests: '',
  });

  useEffect(() => {
    checkAuth().then((r) => {
      if (r?.user) {
        setUser(r.user);
        setGuest((g) => ({
          ...g,
          guest_email: r.user.email || g.guest_email,
          guest_firstname: r.user.firstname || g.guest_firstname,
          guest_lastname: r.user.lastname || g.guest_lastname,
        }));
      }
      setAuthChecked(true);
    }).catch(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    hotelApi.getRooms().then(setRoomTypes).catch(() => setRoomTypes([]));
    Promise.all([
      hotelApi.getAmenities('breakfast').catch(() => []),
      hotelApi.getAmenities('service').catch(() => []),
    ]).then(([a, b]) => {
      const byId = {};
      [...(a || []), ...(b || [])].forEach((x) => { byId[x.id] = x; });
      setAmenities(Object.values(byId));
    });
  }, []);

  useEffect(() => {
    if (room_type_id) setSelectedRoomTypeId(room_type_id);
  }, [room_type_id]);

  const fetchAvailability = () => {
    if (!checkIn || !checkOut) return;
    setError(null);
    hotelApi.getAvailability(checkIn, checkOut, selectedRoomTypeId || undefined)
      .then(setAvailability)
      .catch((e) => {
        setAvailability(null);
        setError(e.message);
      });
  };

  useEffect(() => {
    if (checkIn && checkOut) fetchAvailability();
    else setAvailability(null);
  }, [checkIn, checkOut, selectedRoomTypeId]);

  const selectedRoom = availability?.room_types?.find((r) => r.room_type_id === selectedRoomTypeId) || availability?.room_types?.[0];
  const nights = availability?.nights ?? 0;
  const roomTotal = selectedRoom ? Number(selectedRoom.total_price) : 0;
  const addOnsTotal = addOns.reduce((sum, ao) => {
    const amenity = amenities.find((a) => a.id === ao.amenity_id);
    if (!amenity) return sum;
    const isPerNight = amenity.price_type === 'per_night';
    return sum + (isPerNight ? Number(amenity.price) * nights * ao.quantity : Number(amenity.price) * ao.quantity);
  }, 0);
  const totalAmount = roomTotal + addOnsTotal;

  const toggleAddOn = (amenity, quantity = 1) => {
    setAddOns((prev) => {
      const rest = prev.filter((a) => a.amenity_id !== amenity.id);
      if (quantity > 0) return [...rest, { amenity_id: amenity.id, quantity }];
      return rest;
    });
  };

  const getRoomImage = (rt, idx) => {
    if (rt?.image_url) return rt.image_url;
    const src = ROOM_IMAGES[idx % ROOM_IMAGES.length]?.src;
    return src ? (src.startsWith('http') ? src : src) : '/image-website/room2.jpg';
  };

  const getRoomFeatures = (slug) => (ROOM_FEATURES && ROOM_FEATURES[slug]) || ['Wi-Fi', 'Climatisation', 'TV', 'Salle de bain'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!selectedRoomTypeId || !checkIn || !checkOut || !guest.guest_email || !guest.guest_firstname || !guest.guest_lastname) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    try {
      const res = await hotelApi.createReservation({
        room_type_id: selectedRoomTypeId,
        check_in_date: checkIn,
        check_out_date: checkOut,
        adults,
        children,
        special_requests: guest.special_requests || undefined,
        add_ons: addOns.map((a) => ({ amenity_id: a.amenity_id, quantity: a.quantity })),
        ...guest,
      });
      setReservationId(res?.reservation?.id);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Erreur lors de la réservation.');
    } finally {
      setLoading(false);
    }
  };

  // Non connecté : affichage épuré
  if (authChecked && !user) {
    return (
      <>
        <Head>
          <title>Réservation | {defaultSettings.site_name}</title>
          <meta name="description" content="Créez un compte pour réserver une chambre." />
        </Head>
        <Header settings={defaultSettings} />
        <main className="min-h-screen bg-[#1A1A1A] text-[#FAFAF8] pt-36 pb-20 flex items-center justify-center">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="rounded-2xl border border-[#C9A96E]/20 bg-[#1A1A1A]/80 p-10 md:p-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A96E]/30 bg-[#C9A96E]/10">
                <User className="h-8 w-8 text-[#C9A96E]" />
              </div>
              <h1 className="font-heading text-2xl font-light text-[#FAFAF8]">
                Réservation réservée aux clients
              </h1>
              <p className="mt-4 text-[#8B8680] leading-relaxed">
                Pour réserver une chambre, vous devez posséder un compte. Créez-en un gratuitement ou connectez-vous pour continuer.
              </p>
              <div className="mt-10 flex flex-col gap-4">
                <Link
                  href="/register?redirect=/reservation-chambre"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A96E] px-6 py-4 font-medium text-[#1A1A1A] transition-colors hover:bg-[#A68A5C]"
                >
                  <UserPlus className="h-5 w-5" />
                  Créer un compte
                </Link>
                <Link
                  href="/login?redirect=/reservation-chambre"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9A96E]/50 px-6 py-4 font-medium text-[#C9A96E] transition-colors hover:bg-[#C9A96E]/10"
                >
                  <LogIn className="h-5 w-5" />
                  J&apos;ai déjà un compte
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer settings={defaultSettings} />
      </>
    );
  }

  // Chargement de l&apos;état de connexion
  if (!authChecked) {
    return (
      <>
        <Head><title>Réservation | {defaultSettings.site_name}</title></Head>
        <Header settings={defaultSettings} />
        <main className="min-h-screen bg-[#1A1A1A] text-[#FAFAF8] pt-36 pb-20 flex items-center justify-center">
          <div className="text-center text-[#8B8680]">Vérification en cours…</div>
        </main>
        <Footer settings={defaultSettings} />
      </>
    );
  }

  if (success) {
    return (
      <>
        <Head><title>Réservation envoyée | {defaultSettings.site_name}</title></Head>
        <Header settings={defaultSettings} />
        <main className="min-h-screen bg-[#1A1A1A] text-white pt-40 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-emerald-400 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-heading">Réservation enregistrée</h1>
            <p className="mt-2 text-slate-400">Nous vous recontacterons pour confirmer votre séjour.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-[#C9A96E] hover:bg-[#C9A96E] text-white rounded-lg font-medium"
              >
                Retour à l&apos;accueil
              </button>
              {user && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E]/10 rounded-lg font-medium"
                >
                  Voir mes réservations <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </main>
        <Footer settings={defaultSettings} />
      </>
    );
  }

  const displayRoomTypes = availability?.room_types?.length > 0 ? availability.room_types : roomTypes;
  const roomTypesToShow = displayRoomTypes.length > 0 ? displayRoomTypes : [
    { id: '1', name: 'Suite Prestige', slug: 'suite-prestige', base_price_per_night: 280, max_guests: 4, size_sqm: 45, bed_type: 'Lit king-size' },
    { id: '2', name: 'Chambre Familiale', slug: 'chambre-familiale', base_price_per_night: 180, max_guests: 5, size_sqm: 30, bed_type: 'Lit double + lits superposés' },
    { id: '3', name: 'Chambre Double Confort', slug: 'chambre-double-confort', base_price_per_night: 145, max_guests: 2, size_sqm: 22, bed_type: 'Lit double 160cm' },
    { id: '4', name: 'Chambre Standard', slug: 'chambre-standard', base_price_per_night: 115, max_guests: 2, size_sqm: 18, bed_type: 'Lit double 140cm' },
  ];

  return (
    <>
      <Head>
        <title>Réserver un séjour | {defaultSettings.site_name}</title>
        <meta name="description" content="Réservez votre chambre ou suite. Choisissez vos dates, options petit-déjeuner et tarifs." />
      </Head>
      <Header settings={defaultSettings} />
      <main className="min-h-screen bg-[#1A1A1A] text-white pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-[#1A1A1A]/80 ring-1 ring-white/5 mb-12">
            <Image src={IMAGES?.contact?.[0]?.src || '/image-website/hand-logs-in-to-laptop.jpg'} alt="Réserver en ligne" fill className="object-cover" sizes="100vw" priority />
            <div className="absolute inset-0 bg-[#1A1A1A]/50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-heading font-light">Réserver un séjour</h1>
                <p className="mt-2 text-[#B5B1AC] text-sm md:text-base">Réservez directement sur notre site pour le meilleur tarif garanti.</p>
              </div>
            </div>
          </div>

          {/* Section 1: Types de chambres (toujours visible) */}
          <section className="mb-16">
            <h2 className="text-2xl font-heading font-light mb-6">Nos chambres</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {roomTypesToShow.map((rt, idx) => {
                const isSelected = selectedRoomTypeId === (rt.id || rt.room_type_id);
                const slug = rt.slug || 'chambre-standard';
                const features = getRoomFeatures(slug);
                const imgSrc = getRoomImage(rt, idx);
                const price = rt.total_price ?? rt.base_price_per_night;
                const avail = availability ? (rt.available !== false) : true;
                return (
                  <div
                    key={rt.id || rt.room_type_id || idx}
                    onClick={() => setSelectedRoomTypeId(rt.id || rt.room_type_id)}
                    className={`group cursor-pointer rounded-2xl overflow-hidden bg-slate-900/50 border transition-all ${
                      isSelected ? 'border-[#C9A96E] ring-2 ring-[#C9A96E]/30' : 'border-white/10 hover:border-[#C9A96E]/40'
                    } ${!avail ? 'opacity-60' : ''}`}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image src={imgSrc} alt={rt.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="50vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <h3 className="text-xl font-heading font-light text-white">{rt.name}</h3>
                        <span className="text-[#C9A96E] font-medium">
                          {avail ? `${Number(price).toFixed(0)} €` : 'Indisponible'}
                          {nights > 0 && avail && ` / ${nights} nuit${nights > 1 ? 's' : ''}`}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-3">
                        {rt.max_guests && <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {rt.max_guests} pers.</span>}
                        {rt.size_sqm && <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4" /> {rt.size_sqm} m²</span>}
                        {rt.bed_type && <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {rt.bed_type}</span>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {features.slice(0, 5).map((f, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 text-xs">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dates */}
            <section>
              <h2 className="text-lg font-medium text-[#B5B1AC] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Dates
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Arrivée</label>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Départ</label>
                  <input
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white"
                  />
                </div>
              </div>
              {checkIn && checkOut && (!availability?.room_types?.length) && !error && roomTypes.length > 0 && (
                <p className="text-slate-500 mt-2">Aucune chambre disponible pour ces dates.</p>
              )}
            </section>

            {/* Options (petit-déjeuner, parking) */}
            {nights > 0 && amenities.length > 0 && (
              <section>
                <h2 className="text-lg font-medium text-[#B5B1AC] mb-4 flex items-center gap-2">
                  <Coffee className="w-5 h-5" /> Options
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {amenities.map((a) => {
                    const selected = addOns.find((x) => x.amenity_id === a.id);
                    const qty = selected?.quantity || 0;
                    const isPerNight = a.price_type === 'per_night';
                    return (
                      <label
                        key={a.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#1A1A1A]/80/50 hover:border-white/20 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={qty > 0} onChange={(e) => toggleAddOn(a, e.target.checked ? 1 : 0)} />
                          <span>{a.name}</span>
                          <span className="text-slate-500 text-sm">{Number(a.price).toFixed(0)} € {isPerNight ? '/ nuit' : ''}</span>
                        </div>
                        {qty > 0 && (
                          <span className="text-[#C9A96E]">{(isPerNight ? Number(a.price) * nights * qty : Number(a.price) * qty).toFixed(0)} €</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Voyageurs */}
            <section>
              <h2 className="text-lg font-medium text-[#B5B1AC] mb-4">Voyageurs</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Adultes</label>
                  <input type="number" min={1} value={adults} onChange={(e) => setAdults(parseInt(e.target.value, 10) || 1)} className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Enfants</label>
                  <input type="number" min={0} value={children} onChange={(e) => setChildren(parseInt(e.target.value, 10) || 0)} className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white" />
                </div>
              </div>
            </section>

            {/* Coordonnées */}
            <section>
              <h2 className="text-lg font-medium text-[#B5B1AC] mb-4 flex items-center gap-2"><User className="w-5 h-5" /> Vos coordonnées</h2>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Prénom *</label>
                    <input required value={guest.guest_firstname} onChange={(e) => setGuest((g) => ({ ...g, guest_firstname: e.target.value }))} placeholder="Prénom" className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Nom *</label>
                    <input required value={guest.guest_lastname} onChange={(e) => setGuest((g) => ({ ...g, guest_lastname: e.target.value }))} placeholder="Nom" className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1 flex items-center gap-1"><Mail className="w-4 h-4" /> Email *</label>
                  <input type="email" required value={guest.guest_email} onChange={(e) => setGuest((g) => ({ ...g, guest_email: e.target.value }))} placeholder="votre@email.com" className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1 flex items-center gap-1"><Phone className="w-4 h-4" /> Téléphone</label>
                  <input type="tel" value={guest.guest_phone} onChange={(e) => setGuest((g) => ({ ...g, guest_phone: e.target.value }))} className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Demandes particulières</label>
                  <textarea value={guest.special_requests} onChange={(e) => setGuest((g) => ({ ...g, special_requests: e.target.value }))} rows={3} className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white resize-none" />
                </div>
              </div>
            </section>

            {(roomTotal > 0 || addOnsTotal > 0) && (
              <div className="p-6 rounded-xl bg-[#1A1A1A]/80/50 border border-white/10">
                <div className="flex justify-between text-slate-400"><span>Séjour ({nights} nuit{nights > 1 ? 's' : ''})</span><span>{roomTotal.toFixed(0)} €</span></div>
                {addOnsTotal > 0 && <div className="flex justify-between text-slate-400 mt-2"><span>Options</span><span>{addOnsTotal.toFixed(0)} €</span></div>}
                <div className="flex justify-between text-xl font-medium mt-4 pt-4 border-t border-white/10"><span>Total</span><span className="text-[#C9A96E]">{totalAmount.toFixed(0)} €</span></div>
              </div>
            )}

            {error && <p className="text-[#C9A96E]">{error}</p>}

            <button type="submit" disabled={loading || !selectedRoomTypeId || !checkIn || !checkOut} className="w-full py-4 bg-[#C9A96E] hover:bg-[#C9A96E] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium text-lg">
              {loading ? 'Envoi en cours…' : 'Envoyer ma demande de réservation'}
            </button>
          </form>
        </div>
      </main>
      <Footer settings={defaultSettings} />
    </>
  );
}
