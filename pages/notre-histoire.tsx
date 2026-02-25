/**
 * Notre Histoire — Kafé Stockholm : fondatrices, ouverture, Prince Carl Philip
 * Texte agencé avec images (insta10, acceuil-3, acceuil-4, insta1, prince-image)
 */

import Head from 'next/head';
import EcommerceLayout from '@/components/ecommerce/EcommerceLayout';
import NordicDivider from '@/components/cafe/NordicDivider';
import { SITE } from '@/lib/site-config';
import { designTokens } from '@/lib/design-tokens';

const { colors, fonts, fontSizes, lineHeights } = designTokens;

export default function NotreHistoirePage() {
  return (
    <>
      <Head>
        <title>{`Notre Histoire — ${SITE.name}, Lyon`}</title>
        <meta name="description" content={`L'histoire de ${SITE.name}, premier café suédois de Lyon, fondé par ${SITE.founders}.`} />
      </Head>
      <EcommerceLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20" style={{ color: colors.textGray }}>
          <h1
            className="font-display font-semibold mb-2"
            style={{ fontFamily: fonts.display, fontSize: 'clamp(32px, 4vw, 48px)', color: colors.primaryDark }}
          >
            Notre Histoire
          </h1>
          <NordicDivider className="!mx-0 !my-6" />

          {/* Intro */}
          <section className="mb-14 lg:mb-20">
            <p
              className="text-center text-lg md:text-xl max-w-2xl mx-auto"
              style={{ fontFamily: fonts.body, lineHeight: lineHeights.normal, color: colors.primaryHeader }}
            >
              Välkommen à Kafé Stockholm — un petit bout de Suède au cœur de Lyon.
            </p>
          </section>

          {/* Au commencement */}
          <section className="mb-14 lg:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="order-2 lg:order-1">
                <h2
                  className="font-display font-semibold mb-4"
                  style={{ fontFamily: fonts.display, fontSize: fontSizes.sectionH2Alt, color: colors.primaryDark }}
                >
                  Au commencement, il y a une amitié
                </h2>
                <p className="mb-4" style={{ fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: lineHeights.normal }}>
                  Deux jeunes Suédoises, Anna et Katarina, débarquent à Paris à 19 ans et tombent immédiatement amoureuses de la France. C&apos;est à Lyon qu&apos;elles se retrouvent quelques années plus tard — et c&apos;est à Lyon qu&apos;elles décident de rester, de construire, de rêver.
                </p>
                <p style={{ fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: lineHeights.normal }}>
                  Leur rêve ? Offrir à leur ville d&apos;adoption un morceau authentique de leur pays natal. Un lieu où l&apos;on se sentirait instantanément ailleurs, sans quitter les pentes de la Croix-Rousse.
                </p>
              </div>
              <div className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-md max-w-sm mx-auto lg:mx-0 lg:max-w-md">
                <img src="/images/insta1.png" alt="Anna et Katarina" className="w-full h-auto object-cover" />
              </div>
            </div>
          </section>

          {/* Un café, une cantine, une âme */}
          <section className="mb-14 lg:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="rounded-2xl overflow-hidden shadow-md max-w-sm mx-auto lg:max-w-none lg:mx-0">
                <img src="/images/acceuil-4.png" alt="Kafé Stockholm, rue Saint-Polycarpe" className="w-full h-auto object-cover" />
              </div>
              <div>
                <h2
                  className="font-display font-semibold mb-4"
                  style={{ fontFamily: fonts.display, fontSize: fontSizes.sectionH2Alt, color: colors.primaryDark }}
                >
                  Un café, une cantine, une âme
                </h2>
                <p className="mb-4" style={{ fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: lineHeights.normal }}>
                  En novembre 2022, Kafé Stockholm ouvre ses portes au 10 rue Saint-Polycarpe, dans le 1er arrondissement de Lyon — et devient aussitôt le <strong style={{ color: colors.textDark }}>premier café suédois de la ville</strong>.
                </p>
                <p style={{ fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: lineHeights.normal }}>
                  Dès l&apos;entrée, le ton est donné : une décoration lumineuse et épurée, des effluves de cannelle et de café fraîchement torréfié, et un chaleureux « Hej ! » lancé par une équipe accueillante et souriante. On franchit le seuil, et l&apos;on traverse quelque chose.
                </p>
              </div>
            </div>
          </section>

          {/* La cuisine comme héritage */}
          <section className="mb-14 lg:mb-20">
            <h2
              className="font-display font-semibold mb-6 text-center"
              style={{ fontFamily: fonts.display, fontSize: fontSizes.sectionH2Alt, color: colors.primaryDark }}
            >
              La cuisine comme héritage
            </h2>
            <p className="mb-4 max-w-3xl mx-auto text-center" style={{ fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: lineHeights.normal }}>
              Ici, rien n&apos;est laissé au hasard. Les recettes sont celles des grands-mères suédoises, les ingrédients sont soigneusement sourcés en local, et chaque assiette raconte une histoire.
            </p>
            <p className="mb-4 max-w-3xl mx-auto text-center" style={{ fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: lineHeights.normal }}>
              Les <strong style={{ color: colors.textDark }}>smörgåsar</strong> — ces généreuses tartines de pain de seigle — garnies de saumon fumé, de boulettes de bœuf maison ou de purée de petits pois bio, sont devenues la signature de la maison. À leurs côtés, les kanelbullar et kardemummabullar, ces brioches à la cannelle ou à la cardamome, fondantes et légèrement craquantes, sont l&apos;incarnation de la douceur scandinave.
            </p>
            <p className="max-w-2xl mx-auto text-center font-semibold" style={{ fontFamily: fonts.body, fontSize: fontSizes.body, color: colors.primaryLink }}>
              Une philosophie : local, fait main, éco-responsable.
            </p>
          </section>

          {/* Une adresse qui rassemble — visite du Prince */}
          <section className="mb-14 lg:mb-20">
            <h2
              className="font-display font-semibold mb-8 text-center"
              style={{ fontFamily: fonts.display, fontSize: fontSizes.sectionH2Alt, color: colors.primaryDark }}
            >
              Une adresse qui rassemble
            </h2>
            <p className="mb-10 max-w-3xl mx-auto text-center" style={{ fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: lineHeights.normal }}>
              Kafé Stockholm n&apos;a pas mis longtemps à trouver sa communauté. Suédois de passage, Lyonnais curieux, amoureux du Nord — tous s&apos;y retrouvent dans une atmosphère douillette et sans prétention.
            </p>
            <div className="max-w-2xl mx-auto mb-10">
              <div className="rounded-2xl overflow-hidden shadow-xl relative" style={{ aspectRatio: '4/3' }}>
                <img
                  src="/images/prince-image.png"
                  alt="Visite du Prince Carl Philip de Suède au Kafé Stockholm, Bocuse d'Or"
                  className="w-full h-full object-cover object-center"
                />
                <div
                  className="absolute inset-0 flex items-end p-6"
                  style={{ background: 'linear-gradient(to top, rgba(13,42,92,0.85) 0%, transparent 50%)' }}
                >
                  <p className="text-white font-semibold text-lg" style={{ fontFamily: fonts.body }}>
                    En janvier 2023, le Prince Carl Philip de Suède franchit la porte du Kafé Stockholm à l&apos;occasion du Bocuse d&apos;Or — consacrant l&apos;authenticité du lieu sur la scène internationale.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center" style={{ fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: lineHeights.normal }}>
              Noté 4,8/5 sur Google, Kafé Stockholm est aujourd&apos;hui bien plus qu&apos;une adresse : c&apos;est un rendez-vous.
            </p>
          </section>

          {/* Et l'aventure continue */}
          <section className="mb-14 lg:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="order-2 lg:order-1">
                <h2
                  className="font-display font-semibold mb-4"
                  style={{ fontFamily: fonts.display, fontSize: fontSizes.sectionH2Alt, color: colors.primaryDark }}
                >
                  Et l&apos;aventure continue…
                </h2>
                <p className="mb-4" style={{ fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: lineHeights.normal }}>
                  Anna et Katarina n&apos;ont pas fini de surprendre. Nouveaux plats au fil des saisons, espace privatisable pour vos événements jusqu&apos;à 60 personnes, épicerie fine avec des confiseries importées directement de Suède pour honorer le <em>lördagsgodis</em> — la délicieuse tradition des bonbons du samedi — et bien d&apos;autres projets en coulisses.
                </p>
                <p className="font-semibold" style={{ fontFamily: fonts.body, fontSize: fontSizes.body, color: colors.primaryDark }}>
                  L&apos;histoire de Kafé Stockholm s&apos;écrit encore, une tartine à la fois.
                </p>
              </div>
              <div className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-md">
                <img src="/images/insta10.png" alt="Ambiance et gourmandises Kafé Stockholm" className="w-full h-auto object-cover" />
              </div>
            </div>
          </section>

          {/* Clôture */}
          <section className="text-center pt-6 border-t" style={{ borderColor: colors.bgSurface }}>
            <p className="text-xl font-semibold mb-6" style={{ fontFamily: fonts.display, color: colors.primaryHeader }}>
              Smaklig måltid — Bon appétit.
            </p>
            <p className="italic mb-2" style={{ fontFamily: fonts.body, fontSize: fontSizes.body, color: colors.textGray }}>
              « Välkommen ! » — Bienvenue dans notre petit morceau de Suède, au cœur de Lyon.
            </p>
            <p className="text-sm" style={{ fontFamily: fonts.body, color: colors.textMuted }}>
              Fondé par {SITE.founders} · {SITE.foundedYear}
            </p>
          </section>

          {/* Image de fin */}
          <section className="pt-10 lg:pt-14 pb-4">
            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/images/acceuil-2.png"
                  alt="Kafé Stockholm — ambiance et accueil"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </section>
        </div>
      </EcommerceLayout>
    </>
  );
}
