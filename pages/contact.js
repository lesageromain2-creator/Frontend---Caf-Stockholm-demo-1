// frontend/pages/contact.js - Contact hôtel (adresse, carte, formulaire)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchSettings, sendContactMessage } from '../utils/api';
import { hotelApi } from '../utils/hotelApi';
import { DEFAULT_HOTEL } from '../lib/hotelConstants';
import { HOTEL_IMAGES } from '../lib/hotelImages';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, XCircle } from 'lucide-react';

const SUBJECT_OPTIONS = [
  { value: 'reservation', label: 'Demande de réservation' },
  { value: 'information', label: 'Information sur les chambres' },
  { value: 'groupe', label: 'Réservation groupe / événement' },
  { value: 'contact', label: 'Autre demande' },
];

export default function Contact() {
  const [settings, setSettings] = useState({});
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchSettings().catch(() => ({})),
      hotelApi.getHotel().catch(() => null),
    ]).then(([s, h]) => {
      setSettings(s);
      setHotel(h);
    }).finally(() => setLoading(false));
  }, []);

  const siteName = hotel?.name || settings.site_name || DEFAULT_HOTEL.name;
  const address = hotel?.address || DEFAULT_HOTEL.address;
  const postalCode = hotel?.postalCode || settings.postal_code || DEFAULT_HOTEL.postalCode;
  const city = hotel?.city || settings.city || DEFAULT_HOTEL.city;
  const phone = hotel?.phone || settings.contact_phone || DEFAULT_HOTEL.phone;
  const email = hotel?.email || settings.contact_email || DEFAULT_HOTEL.email;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message || !formData.subject) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
      return;
    }
    try {
      await sendContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        company: null,
        project_type: null,
        budget_range: null,
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const mapAddress = encodeURIComponent([address, postalCode, city].filter(Boolean).join(', '));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Contact & Accès | {siteName}</title>
        <meta name="description" content={`Contactez-nous. ${address}, ${postalCode} ${city}. Téléphone : ${phone}`} />
      </Head>
      <Header settings={{ site_name: siteName }} />

      <main className="min-h-screen bg-[#1A1A1A] text-white pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-light tracking-wide">Contact & Accès</h1>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour toute demande.
            </p>
          </header>

          <div className="grid gap-12 lg:grid-cols-5">
            {/* Informations + carte */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10">
                <h2 className="text-lg font-semibold text-white mb-6">Nous localiser</h2>
                <div className="space-y-4 text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C9A96E] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">{siteName}</p>
                      <p>{address}</p>
                      <p>{postalCode} {city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#C9A96E] shrink-0" />
                    <a href={`tel:${phone}`} className="hover:text-[#C9A96E] transition-colors">{phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#C9A96E] shrink-0" />
                    <a href={`mailto:${email}`} className="hover:text-[#C9A96E] transition-colors break-all">{email}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#C9A96E] shrink-0" />
                    <span>Réception 24h/24</span>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-[#C9A96E] hover:text-amber-300 font-medium"
                >
                  <MapPin className="w-4 h-4" /> Voir sur la carte
                </a>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex aspect-video rounded-2xl overflow-hidden bg-[#1A1A1A]/80 border border-white/10 hover:border-[#C9A96E]/30 transition-colors"
              >
                <Image src={HOTEL_IMAGES.contact[0].src} alt={HOTEL_IMAGES.contact[0].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 1024px) 100vw, 40vw" />
                <div className="absolute inset-0 bg-[#1A1A1A]/50 flex flex-col items-center justify-center gap-2 text-slate-300 group-hover:text-[#C9A96E] transition-colors">
                  <MapPin className="w-12 h-12" />
                  <span className="font-medium">Ouvrir la carte</span>
                  <p className="text-sm text-slate-400 px-4 text-center">{HOTEL_IMAGES.contact[0].text}</p>
                </div>
              </a>

              <p className="text-slate-500 text-sm">
                Dans notre quartier : un large choix de restaurants du bistrot au gastronomique.
              </p>
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-3">
              <div className="p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-white/10">
                <h2 className="text-lg font-semibold text-white mb-2">Envoyez-nous un message</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Remplissez le formulaire et nous vous répondrons dans les plus brefs délais.
                </p>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>Votre message a été envoyé avec succès.</span>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span>Une erreur s&apos;est produite. Veuillez réessayer.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Nom complet *</label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]"
                        placeholder="jean@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">Sujet *</label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                        className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]"
                      >
                        <option value="">Sélectionnez un sujet</option>
                        {SUBJECT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message *</label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      rows={5}
                      className="w-full rounded-lg bg-[#1A1A1A]/80 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E] resize-none"
                      placeholder="Votre message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#C9A96E] hover:bg-[#C9A96E] text-slate-900 font-medium rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" /> Envoyer
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={{ site_name: siteName, address, postalCode, city, phone, email }} />
    </>
  );
}
