/**
 * Conditions de service — Kafé Stockholm
 * Adaptation des conditions d'utilisation du site pour le café suédois à Lyon.
 */

import Head from 'next/head';
import Link from 'next/link';
import EcommerceLayout from '@/components/ecommerce/EcommerceLayout';
import NordicDivider from '@/components/cafe/NordicDivider';
import { SITE } from '@/lib/site-config';

export default function ConditionsServicePage() {
  return (
    <>
      <Head>
        <title>Conditions de service | {SITE.name}</title>
        <meta name="description" content={`Conditions d'utilisation du site ${SITE.name}, café suédois à Lyon. Commande en ligne, compte client, réservations.`} />
      </Head>
      <EcommerceLayout>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h1 className="font-display text-h1 text-kafe-primary-dark mb-2">Conditions de service</h1>
          <NordicDivider className="!mx-0 !my-6" />
          <p className="text-kafe-text-secondary mb-8">
            L’utilisation du site {SITE.name} ({SITE.baseUrl}) implique l’acceptation des présentes conditions de service. Nous vous invitons à les lire attentivement.
          </p>

          <h2 className="font-heading text-xl text-kafe-primary-dark mt-10 mb-4">Objet du site</h2>
          <p className="text-kafe-text-secondary mb-4">
            Le site {SITE.name} présente le premier café suédois authentique de Lyon, situé au {SITE.address}. Il permet de découvrir notre carte (smörgåsar, kanelbullar, boissons), nos horaires, notre histoire et nos services (déjeuner, {SITE.clickCollect.toLowerCase()}, privatisation, épicerie suédoise).
          </p>
          <p className="text-kafe-text-secondary mb-6">
            Si vous créez un compte, vous pouvez utiliser les fonctionnalités associées (commandes, préférences, historique) dans le respect des présentes conditions.
          </p>

          <h2 className="font-heading text-xl text-kafe-primary-dark mt-10 mb-4">Utilisation du site</h2>
          <p className="text-kafe-text-secondary mb-4">
            Vous vous engagez à fournir des informations exactes et à utiliser le site de bonne foi. Toute utilisation frauduleuse, abusive ou contraire à l’esprit d’un lieu convivial et respectueux peut entraîner la suspension de l’accès à votre compte ou au service.
          </p>
          <p className="text-kafe-text-secondary mb-6">
            Nous nous réservons le droit d’adapter nos services et horaires (voir <Link href="/contact" className="text-kafe-primary hover:underline">Contact</Link> et nos réseaux) sans que cela ne remette en cause l’ensemble des présentes conditions.
          </p>

          <h2 className="font-heading text-xl text-kafe-primary-dark mt-10 mb-4">Propriété intellectuelle</h2>
          <p className="text-kafe-text-secondary mb-6">
            Le contenu du site (textes, images, visuels, marque {SITE.name}, recettes et identité graphique) est protégé par le droit d’auteur et le droit des marques. Toute reproduction, représentation ou exploitation non autorisée est interdite.
          </p>

          <h2 className="font-heading text-xl text-kafe-primary-dark mt-10 mb-4">Données personnelles</h2>
          <p className="text-kafe-text-secondary mb-6">
            Le traitement de vos données personnelles est décrit dans notre <Link href="/confidentialite" className="text-kafe-primary hover:underline">Politique de confidentialité</Link>. En utilisant le site et en créant un compte, vous acceptez cette politique.
          </p>

          <h2 className="font-heading text-xl text-kafe-primary-dark mt-10 mb-4">Mentions légales</h2>
          <p className="text-kafe-text-secondary mb-6">
            Pour l’éditeur du site, l’hébergement et les informations légales, consultez nos <Link href="/mentions-legales" className="text-kafe-primary hover:underline">Mentions légales</Link>.
          </p>

          <p className="text-kafe-muted text-sm mt-10">
            Dernière mise à jour : 2025. Pour toute question : <a href={`mailto:${SITE.contactEmail}`} className="text-kafe-primary hover:underline">{SITE.contactEmail}</a>.
          </p>
        </article>
      </EcommerceLayout>
    </>
  );
}
