/**
 * Contact — Kafé Stockholm : adresse, téléphone, horaires, plan
 */

import Head from 'next/head';
import Link from 'next/link';
import EcommerceLayout from '@/components/ecommerce/EcommerceLayout';
import NordicDivider from '@/components/cafe/NordicDivider';
import { SITE } from '@/lib/site-config';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>{`Contact — ${SITE.name}, Lyon`}</title>
        <meta name="description" content={`Contactez ${SITE.name} : ${SITE.address}, ${SITE.phone}. Horaires et plan.`} />
      </Head>
      <EcommerceLayout>
        <div className="max-w-grid mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h1 className="font-display text-h1 text-kafe-primary-dark mb-2">Contact</h1>
          <p className="text-kafe-text-secondary mb-8 max-w-xl">
            Une question, une réservation ou une demande de privatisation ? Écrivez-nous ou appelez-nous.
          </p>
          <NordicDivider className="!mx-0 !my-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="font-heading font-semibold text-kafe-text mb-2">Adresse</p>
              <p className="text-kafe-text-secondary">{SITE.address}</p>
              <p className="font-heading font-semibold text-kafe-text mt-6 mb-2">Téléphone</p>
              <a href={SITE.phoneTel} className="text-kafe-primary hover:underline">{SITE.phone}</a>
              <p className="font-heading font-semibold text-kafe-text mt-6 mb-2">Email</p>
              <a href={`mailto:${SITE.contactEmail}`} className="text-kafe-primary hover:underline">{SITE.contactEmail}</a>
              <p className="font-heading font-semibold text-kafe-text mt-6 mb-2">Horaires</p>
              <p className="text-kafe-text-secondary text-small">{SITE.openingGeneral}</p>
              <p className="text-kafe-text-secondary text-small mt-1">Service déjeuner : {SITE.lunchService}</p>
            </div>
            <div className="relative rounded-menu overflow-hidden h-[280px] md:h-[320px]">
              <iframe
                title="Carte — Kafé Stockholm, 10 Rue Saint-Polycarpe, 69001 Lyon"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2783.110286366467!2d4.831651976917796!3d45.768979971080505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4ebf3bd04a35b%3A0x18b5127b24dea598!2sKaf%C3%A9%20Stockholm!5e0!3m2!1sfr!2sfr!4v1771545094510!5m2!1sfr!2sfr"
                className="w-full h-full border-0 block"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={SITE.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=10+rue+Saint-Polycarpe,+69001+Lyon,+France'}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center justify-center px-4 py-2 font-medium text-sm shadow-md rounded-lg bg-white hover:bg-gray-50 text-kafe-primary-dark"
              >
                Voir sur Google Maps
              </a>
            </div>
          </div>
          <p className="mt-8 text-kafe-muted text-small">
            Réponse sous 24–48 h. Pour une demande de privatisation, utilisez la page{' '}
            <Link href="/privatisation" className="text-kafe-primary hover:underline">Privatisation</Link>.
          </p>
        </div>
      </EcommerceLayout>
    </>
  );
}
