// frontend/components/Footer.js - Pied de page luxe Hôtel La Grande Croix
import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';
import { DEFAULT_HOTEL } from '../lib/hotelConstants';

export default function Footer({ settings = {} }) {
  const currentYear = new Date().getFullYear();
  const siteName = settings.site_name || DEFAULT_HOTEL.name;
  const address = settings.address || DEFAULT_HOTEL.address;
  const city = settings.city || DEFAULT_HOTEL.city;
  const postalCode = settings.postalCode || DEFAULT_HOTEL.postalCode;
  const email = settings.email || DEFAULT_HOTEL.email;
  const phone = settings.phone || DEFAULT_HOTEL.phone;

  return (
    <footer className="border-t border-[#C9A96E]/20 bg-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A96E] font-heading text-xl font-bold text-[#1A1A1A]">
                {siteName.charAt(0)}
              </div>
              <div>
                <p className="font-heading text-xl font-semibold text-[#FAFAF8]">{siteName}</p>
                <p className="font-accent text-xs font-medium uppercase tracking-[0.15em] text-[#C9A96E]">
                  Hôtel de Luxe
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-md font-body text-sm leading-relaxed text-[#8B8680]">
              Chambres raffinées et climatisées, literie premium, petit-déjeuner savoureux. Réservez directement sur notre site pour le meilleur tarif garanti.
            </p>
          </div>

          <div>
            <p className="font-accent text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A96E]">
              Navigation
            </p>
            <ul className="mt-5 space-y-2 font-body text-sm text-[#B5B1AC]">
              <li><Link href="/" className="transition-colors hover:text-[#C9A96E]">Accueil</Link></li>
              <li><Link href="/sejour" className="transition-colors hover:text-[#C9A96E]">Chambres</Link></li>
              <li><Link href="/services" className="transition-colors hover:text-[#C9A96E]">Services</Link></li>
              <li><Link href="/restauration" className="transition-colors hover:text-[#C9A96E]">Petit-déjeuner</Link></li>
              <li><Link href="/offres-hotel" className="transition-colors hover:text-[#C9A96E]">Offres</Link></li>
              <li><Link href="/galerie" className="transition-colors hover:text-[#C9A96E]">Galerie</Link></li>
              <li><Link href="/temoignages" className="transition-colors hover:text-[#C9A96E]">Témoignages</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-[#C9A96E]">Contact</Link></li>
              <li><Link href="/reservation-chambre" className="font-medium text-[#C9A96E] hover:text-[#D4BC8E]">Réserver</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-accent text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A96E]">
              Contact
            </p>
            <ul className="mt-5 space-y-4 font-body text-sm text-[#B5B1AC]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A96E]" />
                <span>{address}<br />{postalCode} {city}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#C9A96E]" />
                <a href={`tel:${phone}`} className="transition-colors hover:text-[#C9A96E]">{phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#C9A96E]" />
                <a href={`mailto:${email}`} className="break-all transition-colors hover:text-[#C9A96E]">{email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#C9A96E]/20 pt-8 font-body text-xs text-[#8B8680] md:flex-row">
          <p>© {currentYear} {siteName}. Tous droits réservés.</p>
          <p className="font-accent uppercase tracking-wider">Meilleur prix garanti • Réservation directe • Transaction sécurisée</p>
        </div>
      </div>
    </footer>
  );
}
