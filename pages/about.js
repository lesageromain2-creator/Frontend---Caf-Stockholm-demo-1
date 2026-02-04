import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle2, Sparkles, Target, Users } from 'lucide-react';

const demoSettings = {
  site_name: 'LE SAGE',
  site_description:
    'Création de sites web professionnels sur-mesure — design moderne, performance et maintenance continue.',
  email: 'lesage.pro.dev@gmail.com',
  phone_number: '+33 07 86 18 18 40',
  city: 'Lyon',
  website: 'www.LeSageDev.com',
};

const values = [
  {
    title: 'Clarté & pédagogie',
    description:
      'Un projet web ne devrait pas être opaque. On explique, on documente, on avance avec vous.',
    icon: Sparkles,
  },
  {
    title: 'Performance & SEO',
    description:
      'Vitesse, accessibilité, structure SEO : on vise des bases solides et mesurables (Lighthouse).',
    icon: Target,
  },
  {
    title: 'Fiabilité',
    description:
      'Architecture clean, sécurité, bonnes pratiques. Un site doit tenir sur la durée.',
    icon: CheckCircle2,
  },
  {
    title: 'Partenariat',
    description:
      'On travaille en transparence, avec des jalons clairs et une communication simple.',
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Présentation – LE SAGE | Studio & agence web</title>
        <meta
          name="description"
          content="Découvrez LE SAGE : une agence web moderne qui conçoit des sites vitrines, e-commerce et applications web performantes."
        />
      </Head>

      <div className="min-h-screen bg-dark text-light">
        <Header settings={demoSettings} />

        <main className="px-6 py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <section className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Présentation
              </p>
              <h1 className="mt-2 font-heading text-3xl font-black text-white md:text-4xl">
                LE SAGE
                <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Studio & agence web moderne
                </span>
              </h1>
              <p className="mt-4 text-sm text-slate-300 md:text-base">
                Nous créons des sites web professionnels sur-mesure, pensés
                pour être beaux, rapides, sécurisés et orientés résultats.
                Notre approche : design moderne, base technique solide, et un
                accompagnement clair.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl backdrop-blur-xl">
                <h2 className="font-heading text-lg font-semibold text-white md:text-xl">
                  Notre mission
                </h2>
                <p className="mt-3 text-sm text-slate-200 md:text-base">
                  Aider les professionnels (restaurant, commerce, service) à
                  obtenir une présence en ligne crédible, moderne et efficace —
                  avec une base technique qui évolue dans le temps.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-slate-200">
                  {[
                    'Design UI/UX sur-mesure',
                    'Performance & SEO',
                    'Sécurité & base de données',
                    'Hébergement & domaine',
                    'Maintenance continue',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-secondary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-slate-950/60 to-secondary/10 p-6 shadow-xl">
                <h2 className="font-heading text-lg font-semibold text-white md:text-xl">
                  Notre promesse
                </h2>
                <p className="mt-3 text-sm text-slate-200 md:text-base">
                  Un site livré proprement, documenté, et prêt à performer :
                  vitesse, accessibilité, SEO, sécurité. Et surtout : une
                  expérience fluide pour vous.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-200">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                      Délais
                    </p>
                    <p className="mt-2 text-lg font-black text-white">
                      3–8 semaines
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      selon le type de projet
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                      Objectif
                    </p>
                    <p className="mt-2 text-lg font-black text-white">
                      Lighthouse 90+
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      perfs & accessibilité
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section className="mt-12">
              <h2 className="text-center font-heading text-2xl font-bold text-white md:text-3xl">
                Nos valeurs
              </h2>
              <div className="mt-6 grid gap-5 md:grid-cols-4">
                {values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.title}
                      className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-lg transition hover:-translate-y-1 hover:border-secondary/70 hover:shadow-2xl"
                    >
                      <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-heading text-base font-semibold text-white">
                        {v.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-300">
                        {v.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </section>
        </main>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}

