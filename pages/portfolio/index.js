import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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
    short_description:
      'Site moderne de restaurant : carte des plats avec recherche et filtres par catégorie, favoris, réservation, paiement. Dashboard et authentification.',
    thumbnail_url: '/portfolio/restaurant.png',
    technologies: ['Next.js', 'React', 'JavaScript', 'Tailwind', 'Supabase', 'Stripe', 'Resend', 'Better Auth', 'Drizzle ORM', 'Shadcn UI'],
    featured: true,
    live_url: 'https://restaurant-frontend-eta-two.vercel.app',
  },
  {
    id: 'collection-aurart',
    title: "Collection Aur'art",
    slug: 'collection-aurart',
    category: 'vitrine',
    client_name: "Association Collection Aur'art",
    short_description:
      "Site de l'association de passionnés qui valorise le patrimoine artistique sous toutes ses formes. Esquisses de l'Art & son marché.",
    thumbnail_url: '/portfolio/collection-aurart.png',
    technologies: ['Next.js', 'React', 'JavaScript', 'Vercel', 'Figma'],
    featured: true,
    live_url: 'https://collectionaurart.vercel.app',
  },
];

export async function getStaticProps() {
  return {
    props: {
      projects: portfolioProjects,
    },
  };
}

const categoryLabels = {
  vitrine: 'Site vitrine',
  ecommerce: 'E-commerce',
  webapp: 'Application web',
  branding: 'Branding',
  refonte: 'Refonte',
};

export default function PortfolioPage({ projects }) {
  return (
    <>
      <Head>
        <title>
          Portfolio – Le Sage Dev | Sites vitrines, e-commerce & applications web
        </title>
        <meta
          name="description"
          content="Découvrez mes réalisations : site restaurant gastronomique, site de l'association Collection Aur'art. Next.js, React, Supabase, Stripe, Vercel."
        />
      </Head>
      <div className="min-h-screen bg-dark text-light">
        <Header settings={demoSettings} />

        <main className="px-6 py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <section className="mx-auto max-w-5xl text-center">
            <h1 className="font-heading text-3xl font-black text-white md:text-4xl">
              Des projets concrets,
              <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                des résultats mesurables.
              </span>
            </h1>
            <p className="mt-4 text-sm text-slate-300 md:text-base">
              Une sélection de sites que j'ai conçus et développés, du brief au lancement.
            </p>
          </section>

          <section className="mx-auto mt-10 max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-lg transition-all hover:-translate-y-1 hover:border-secondary/70 hover:shadow-2xl"
                >
                  <Link href={`/portfolio/${project.slug}`} className="flex h-full flex-col">
                    <div className="relative overflow-hidden bg-slate-900">
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="block max-h-[320px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02] sm:max-h-[360px] md:max-h-[400px]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                      <div className="absolute left-3 top-3 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-100 backdrop-blur">
                        {categoryLabels[project.category] || project.category}
                      </div>
                      {project.featured && (
                        <div className="absolute right-3 top-3 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-lg">
                          Projet réalisé
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="font-heading text-base font-semibold text-white md:text-lg">
                        {project.title}
                      </h2>
                      {project.client_name && (
                        <p className="mt-1 text-xs text-slate-400">
                          {project.client_name}
                        </p>
                      )}
                      <p className="mt-3 flex-1 text-xs text-slate-300 md:text-sm">
                        {project.short_description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-200">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </main>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}
