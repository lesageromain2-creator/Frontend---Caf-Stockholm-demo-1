import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { BlurFade } from '../../components/animations';

const demoSettings = {
  site_name: 'Le Sage Dev',
  site_description:
    'Création de sites web professionnels sur-mesure — design moderne, performance et maintenance continue.',
  email: 'lesage.pro.dev@gmail.com',
  phone_number: '+33 07 86 18 18 40',
  city: 'Lyon',
  website: 'www.LeSageDev.com',
};

const portfolioProjects = [
  {
    id: 'restaurant-gastronomique',
    title: 'Site web restaurant gastronomique',
    slug: 'restaurant-gastronomique',
    category: 'vitrine',
    client_name: 'Restaurant Gastronomique',
    description:
      'Site web moderne de restaurant avec carte des plats, recherche et filtres par catégorie (entrées, plats, desserts, etc.), système de favoris, réservation et paiement en ligne. Dashboard utilisateur et authentification (Better Auth). Déploiement sur Vercel, base de données Supabase, paiements Stripe, emails transactionnels avec Resend. Design UI/UX réalisé sous Figma.',
    thumbnail_url: '/portfolio/restaurant.png',
    technologies: ['Next.js', 'React', 'JavaScript', 'Tailwind', 'Supabase', 'Stripe', 'Resend', 'Better Auth', 'Drizzle ORM', 'Shadcn UI', 'Vercel', 'Render'],
    live_url: 'https://restaurant-frontend-eta-two.vercel.app',
  },
  {
    id: 'collection-aurart',
    title: "Collection Aur'art",
    slug: 'collection-aurart',
    category: 'vitrine',
    client_name: "Association Collection Aur'art",
    description:
      "Site de l'association Collection Aur'art, projet fondateur : association de passionnés qui s'engage à valoriser le patrimoine artistique sous toutes ses formes. « Esquisses de l'Art & son marché » : rubriques, articles, présentation de l'équipe, contact. Design soigné (fond clair, dégradé violet/rose), typographie élégante. Conçu avec Next.js, React, JavaScript, déployé sur Vercel. Design UI/UX sous Figma.",
    thumbnail_url: '/portfolio/collection-aurart.png',
    technologies: ['Next.js', 'React', 'JavaScript', 'Vercel', 'Figma'],
    live_url: 'https://collectionaurart.vercel.app',
  },
];

const categoryLabels = {
  vitrine: 'Site vitrine',
  ecommerce: 'E-commerce',
  webapp: 'Application web',
  branding: 'Branding',
  refonte: 'Refonte',
};

const projectGalleryImages = {
  'collection-aurart': [
    '/portfolio/collection-aurart1.png',
    '/portfolio/collection-aurart2.png',
    '/portfolio/collection-aurart3.png',
    '/portfolio/collection-aurart4.png',
  ],
  'restaurant-gastronomique': [
    '/portfolio/restaurant1.png',
    '/portfolio/restaurant2.png',
    '/portfolio/restaurant3.png',
    '/portfolio/restaurant4.png',
  ],
};

export async function getStaticPaths() {
  const paths = portfolioProjects.map((project) => ({
    params: { slug: project.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const project = portfolioProjects.find((p) => p.slug === params.slug) || null;

  return {
    props: {
      project,
      moreProjects: portfolioProjects
        .filter((p) => p.slug !== params.slug),
    },
  };
}

export default function ProjectDetailPage({ project, moreProjects }) {
  if (!project) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {project.title} – Projet | Le Sage Dev
        </title>
        <meta
          name="description"
          content={project.description.slice(0, 155)}
        />
      </Head>
      <div className="min-h-screen bg-dark text-light">
        <Header settings={demoSettings} />

        <main className="px-6 py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <article className="mx-auto flex max-w-5xl flex-col gap-10">
            <header>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Projet réalisé
              </p>
              <h1 className="mt-2 font-heading text-3xl font-black text-white md:text-4xl">
                {project.title}
              </h1>
              {project.client_name && (
                <p className="mt-1 text-sm text-slate-300">
                  pour {project.client_name}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-200">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                  {categoryLabels[project.category] || project.category}
                </span>
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </header>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl [&_img]:block [&_img]:w-full [&_img]:h-auto [&_img]:max-h-[70vh] [&_img]:object-contain">
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            {projectGalleryImages[project.slug] && (
              <section className="space-y-5">
                <h2 className="font-heading text-lg font-semibold text-white md:text-xl">
                  Galerie projet
                </h2>
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {projectGalleryImages[project.slug].map((src, i) => (
                    <BlurFade key={src} delay={i * 0.06} duration={0.4}>
                      <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-lg transition-all hover:border-primary/30 hover:shadow-xl">
                        <img
                          src={src}
                          alt={`${project.title} – vue ${i + 1}`}
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </BlurFade>
                  ))}
                </div>
              </section>
            )}

            <section className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] md:items-start">
              <div className="space-y-6 text-sm text-slate-200 md:text-base">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-white md:text-xl">
                    Contexte & objectifs
                  </h2>
                  <p className="mt-2">{project.description}</p>
                </div>
                <div>
                  <h2 className="font-heading text-lg font-semibold text-white md:text-xl">
                    Technologies
                  </h2>
                  <p className="mt-2 text-sm text-slate-200 md:text-base">
                    {project.technologies.join(', ')}.
                  </p>
                </div>
              </div>

              <aside className="space-y-5">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-3xl bg-gradient-to-r from-primary to-secondary px-5 py-4 text-center text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
                  >
                    Voir le site en ligne →
                  </a>
                )}

                <Link
                  href="/reservation"
                  className="block rounded-3xl border border-white/20 bg-white/5 px-5 py-4 text-center text-sm font-semibold text-slate-100 backdrop-blur transition hover:bg-white/10"
                >
                  Discuter d'un projet similaire
                </Link>
              </aside>
            </section>

            {moreProjects && moreProjects.length > 0 && (
              <section className="mt-8 border-t border-white/10 pt-8">
                <h2 className="font-heading text-lg font-semibold text-white md:text-xl">
                  Voir aussi
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {moreProjects.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/portfolio/${p.slug}`}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-md transition hover:-translate-y-1 hover:border-secondary/70 hover:shadow-xl"
                    >
                      <img
                        src={p.thumbnail_url}
                        alt={p.title}
                        className="block h-auto max-h-40 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="p-3">
                        <p className="text-xs font-semibold text-white md:text-sm">
                          {p.title}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {categoryLabels[p.category] || p.category}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        </main>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}
