/**
 * Accessibilité & Valeurs — Kafé Stockholm (LGBTQ+ friendly, safe space, women-owned)
 * Contenu enrichi avec images et sections détaillées.
 */

import Head from 'next/head';
import Link from 'next/link';
import EcommerceLayout from '@/components/ecommerce/EcommerceLayout';
import NordicDivider from '@/components/cafe/NordicDivider';
import { SITE } from '@/lib/site-config';

export default function AccessibilitePage() {
  return (
    <>
      <Head>
        <title>Accessibilité & Valeurs — {SITE.name}, Lyon</title>
        <meta name="description" content="Kafé Stockholm : accessible PMR, LGBTQ+ friendly, safe space, géré par des femmes. Toilettes non-genrées, chiens et familles bienvenus. Lyon 1er." />
      </Head>
      <EcommerceLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <h1 className="font-display text-h1 text-kafe-primary-dark mb-2">Accessibilité & Valeurs</h1>
          <NordicDivider className="!mx-0 !my-6" />

          {/* Intro + image */}
          <section className="mb-14 lg:mb-20">
            <p className="text-lg md:text-xl text-kafe-text-secondary max-w-2xl mb-10">
              Chez {SITE.name}, nous voulons que chacune et chacun se sente bienvenu·e. Accessibilité, respect et bienveillance font partie de notre quotidien.
            </p>
            <div className="rounded-2xl overflow-hidden shadow-lg max-w-2xl">
              <img
                src="/images/equipe.png"
                alt="L'équipe du Kafé Stockholm accueille tout le monde dans un cadre chaleureux"
                className="w-full h-auto object-cover"
              />
            </div>
          </section>

          {/* Accessibilité physique */}
          <section className="mb-14 lg:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="rounded-2xl overflow-hidden shadow-md order-2 lg:order-1">
                <img
                  src="/images/acceuil-4.png"
                  alt="Façade du Kafé Stockholm, rue Saint-Polycarpe, Lyon"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="font-display text-2xl text-kafe-primary-dark mb-4">Un lieu accessible à toutes et tous</h2>
                <p className="text-kafe-text-secondary mb-4">
                  Notre café est conçu pour être accueillant : <strong className="text-kafe-text">toilettes accessibles PMR</strong> et <strong className="text-kafe-text">toilettes non-genrées</strong> pour que chacun·e puisse se sentir à l&apos;aise. L&apos;entrée et la circulation en salle sont pensées pour faciliter les déplacements.
                </p>
                <p className="text-kafe-text-secondary">
                  Vous avez une question sur l&apos;accès ou un besoin particulier ? N&apos;hésitez pas à nous contacter en amont : nous ferons notre possible pour vous réserver le meilleur accueil.
                </p>
              </div>
            </div>
          </section>

          {/* LGBTQ+ & safe space */}
          <section id="lgbtq" className="mb-14 lg:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div>
                <h2 className="font-display text-2xl text-kafe-primary-dark mb-4">LGBTQ+ friendly & safe space</h2>
                <p className="text-kafe-text-secondary mb-4">
                  Nous nous engageons à ce que chaque personne, quelle que soit son orientation ou son identité de genre, se sente en sécurité et bienvenue. Le Kafé Stockholm est un <strong className="text-kafe-text">safe space</strong> : pas de discrimination, pas de jugement, seulement un café chaleureux et une équipe à l&apos;écoute.
                </p>
                <p className="text-kafe-text-secondary">
                  <em>Välkommen !</em> — Bienvenue, tout simplement.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img
                  src="/images/insta10.png"
                  alt="Ambiance conviviale et inclusive au Kafé Stockholm"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </section>

          {/* Familles & chiens */}
          <section className="mb-14 lg:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img
                  src="/images/insta1.png"
                  alt="Anna et Katarina, fondatrices du Kafé Stockholm"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div>
                <h2 className="font-display text-2xl text-kafe-primary-dark mb-4">Familles et compagnons à quatre pattes</h2>
                <p className="text-kafe-text-secondary mb-4">
                  Les familles sont les bienvenues : nous avons de quoi régaler les petits (et les grands) avec des assiettes adaptées et une ambiance détendue. Les <strong className="text-kafe-text">chiens</strong> sont acceptés en salle — nous demandons simplement qu&apos;ils restent calmes et tenus en laisse.
                </p>
                <p className="text-kafe-text-secondary">
                  Un espace convivial pour déjeuner, prendre un fika ou faire une pause en toute sérénité.
                </p>
              </div>
            </div>
          </section>

          {/* Women-owned */}
          <section className="mb-14 lg:mb-20">
            <div className="bg-kafe-bg-secondary rounded-2xl p-8 lg:p-10 text-center">
              <h2 className="font-display text-2xl text-kafe-primary-dark mb-4">Un café fondé et géré par des femmes</h2>
              <p className="text-kafe-text-secondary max-w-2xl mx-auto mb-6">
                {SITE.name} a été créé par <strong className="text-kafe-text">{SITE.founders}</strong>. Aujourd&apos;hui encore, l&apos;équipe et les valeurs du lieu portent cette énergie : bienveillance, qualité et accueil pour toutes et tous.
              </p>
              <Link
                href="/notre-histoire"
                className="inline-flex items-center gap-2 text-kafe-primary font-medium hover:text-kafe-primary-dark transition-colors"
              >
                Découvrir notre histoire
                <span aria-hidden>→</span>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section>
            <NordicDivider className="!mx-0 !my-8" />
            <p className="text-kafe-text-secondary text-center">
              Une question sur l&apos;accessibilité ou nos valeurs ? Écrivez-nous à{' '}
              <a href={`mailto:${SITE.contactEmail}`} className="text-kafe-primary hover:underline">{SITE.contactEmail}</a>
              {' '}ou consultez notre page <Link href="/contact" className="text-kafe-primary hover:underline">Contact</Link>.
            </p>
          </section>
        </div>
      </EcommerceLayout>
    </>
  );
}
