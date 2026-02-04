import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Check,
  ArrowRight,
  Headphones,
  Code2,
  Palette,
  Shield,
  Zap,
  Star,
  Package,
  ChevronDown,
  Mail,
  Phone,
  Globe,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnimeReveal, { AnimeChild } from '../components/animations/AnimeReveal';
import { BlurFade } from '../components/animations';
import { ShimmerButton } from '../components/animations';
import { fetchSettings } from '../utils/api';

const VALIDITE = "Valables jusqu'au 31/12/2026";

const APPROCHE = [
  {
    icon: Headphones,
    title: 'Écoute Active',
    text: "Compréhension de vos enjeux business, audience cible et objectifs de croissance avant toute proposition.",
  },
  {
    icon: Code2,
    title: 'Excellence Technique',
    text: "Formation d'ingénieur appliquée au web, technologies performantes (Next.js, React, Node.js).",
  },
  {
    icon: Palette,
    title: 'Design Centré Utilisateur',
    text: "Interfaces pensées pour une expérience optimale, intuitive et engageante.",
  },
  {
    icon: Shield,
    title: 'Transparence Totale',
    text: "Communication claire sur les choix techniques, documentation exhaustive et formation à l'utilisation.",
  },
];

const OFFRE_ESSENTIEL = {
  name: 'ESSENTIEL',
  price: '1 500 - 3 000 €',
  from: '1 500',
  forWho: 'Associations, micro-entrepreneurs, artisans, professions libérales, TPE en démarrage.',
  included: [
    'Design sur-mesure responsive (mobile, tablette, desktop)',
    '3 à 5 pages stratégiques (Accueil, À propos, Services, Galerie, Contact)',
    'Formulaire de contact intelligent (anti-spam, notifications, BDD)',
    'SEO de base (title, meta, sitemap, Search Console)',
    'Performance < 2s, images optimisées, hébergement Vercel/Netlify',
    'Hébergement premium 1 an inclus (SSL, sauvegardes, 99,9%)',
    'Formation personnalisée 1h30',
    'Support technique 1 mois',
  ],
  tech: 'Next.js 15, React 19, TailwindCSS 4 • Vercel/Netlify • GA4 ou Plausible',
  delay: '2 à 3 semaines',
  pricing: [
    { config: 'Starter', pages: '3 pages', price: '1 500 €' },
    { config: 'Standard', pages: '4 pages', price: '1 900 €' },
    { config: 'Complet', pages: '5 pages', price: '2 400 €' },
    { config: '+ Page additionnelle', pages: '1 page', price: '+ 400 €' },
  ],
};

const OFFRE_PRO = {
  name: 'PROFESSIONNEL',
  price: '3 000 - 6 000 €',
  from: '3 000',
  forWho: 'PME, startups, cabinets de conseil, agences : site complet avec fonctionnalités avancées.',
  included: [
    'Tout ESSENTIEL',
    '6 à 10 pages optimisées (FAQ, mentions légales, etc.)',
    'Blog / actualités dynamique (CMS headless : Sanity ou Strapi)',
    'Intégrations : Calendly, CRM, newsletter (Mailchimp, Brevo)',
    'Lighthouse > 90, Core Web Vitals, lazy loading',
    'SEO avancé (mots-clés, Schema.org, plan de contenu)',
    'Espace client/membre optionnel (auth, profils, permissions)',
    'Tableau de bord analytique (métriques, exports CSV/Excel)',
    'Support 3 mois (prioritaire 24h)',
    'Formation 2h + documentation technique',
  ],
  tech: 'Next.js 15, React 19, TypeScript, Tailwind • Sanity/Strapi • Supabase/Firebase • Vercel Pro',
  delay: '4 à 6 semaines',
  pricing: [
    { config: 'Standard', desc: '6-7 pages + Blog', price: '3 500 €' },
    { config: 'Avancé', desc: '8-9 pages + Blog + Espace membre', price: '4 500 €' },
    { config: 'Complet', desc: '10 pages + Blog + Espace membre + Dashboard', price: '5 800 €' },
    { config: '+ Page additionnelle', desc: 'Page complexe', price: '+ 500 €' },
    { config: '+ Intégration API custom', desc: 'Par API', price: '+ 800 €' },
  ],
};

const OFFRE_PREMIUM = {
  name: 'PREMIUM',
  price: '6 000 - 12 000 €',
  from: '6 000',
  forWho: 'E-commerce, SaaS, marketplaces, applications métier avec automatisations et architecture évolutive.',
  included: [
    'Tout PROFESSIONNEL',
    'E-commerce complet (catalogue, panier, Stripe/PayPal, stocks, promos, emails transactionnels)',
    'Tableau de bord admin sur-mesure',
    'Automatisations (n8n, webhooks, CRM/ERP, sync bidirectionnelle)',
    'Architecture microservices, API REST/GraphQL, Redis, files asynchrones',
    'Tests automatisés et CI/CD (staging, production, rollback)',
    'Stratégie de contenu et copywriting',
    'SEO technique avancé (audit, netlinking, suivi mensuel)',
    'Support premium 6 mois (12h, hot-line, 7j/7)',
    'Accompagnement stratégique (revue mensuelle, roadmap trimestrielle)',
  ],
  tech: 'Next.js 15, React 19, TypeScript • Node/Express • PostgreSQL, Redis • Stripe/PayPal • n8n • Docker, CI/CD',
  delay: '8 à 12 semaines',
  pricing: [
    { config: 'E-commerce Standard', desc: '< 100 produits + paiement', price: '7 500 €' },
    { config: 'E-commerce Avancé', desc: '100-500 produits + multi-devises', price: '10 000 €' },
    { config: 'Plateforme SaaS MVP', desc: 'Fonctionnalités de base + abonnements', price: '9 000 €' },
    { config: 'Marketplace Simple', desc: 'Vendeurs + acheteurs + commission', price: '11 500 €' },
    { config: 'Application Métier', desc: 'Workflow sur-mesure + intégrations', price: '8 500 - 12 000 €' },
  ],
};

const SERVICES_CARTE = {
  design: [
    { service: 'Maquettes UI/UX Figma', desc: 'Wireframes + maquettes haute-fidélité + prototype', tarif: '800 - 2 000 €' },
    { service: 'Identité visuelle complète', desc: 'Logo + charte + déclinaisons', tarif: '1 200 - 2 500 €' },
    { service: 'Design system', desc: 'Bibliothèque composants, guidelines', tarif: '1 500 - 3 000 €' },
    { service: 'Iconographie sur-mesure', desc: '10-30 icônes', tarif: '400 - 800 €' },
    { service: 'Illustrations originales', desc: 'Par unité', tarif: '150 - 500 €/unité' },
  ],
  contenu: [
    { service: 'Rédaction web (copywriting)', desc: 'Textes SEO et conversion', tarif: '100 - 300 €/page' },
    { service: 'Articles de blog', desc: '800-1500 mots', tarif: '200 - 400 €/article' },
    { service: 'Audit SEO complet', desc: 'Analyse + recommandations', tarif: '800 - 1 500 €' },
    { service: 'Stratégie SEO mensuelle', desc: 'Optimisation continue, netlinking', tarif: '600 - 1 500 €/mois' },
  ],
  maintenance: [
    { name: 'Maintenance Essentielle', inclut: 'Sécurité, backup hebdo, monitoring, support email', tarif: '150 €/mois' },
    { name: 'Maintenance Professionnelle', inclut: 'Tout Essentielle + optimisations, support 24h', tarif: '250 €/mois' },
    { name: 'Maintenance Premium', inclut: 'Tout Pro + 2h contenus/mois, hotline', tarif: '400 €/mois' },
    { name: 'Intervention ponctuelle', inclut: 'Bug, modification mineure', tarif: '80 €/h' },
    { name: 'Package 10h prépayé', inclut: 'Validité 6 mois', tarif: '700 €' },
  ],
  technique: [
    { service: 'Migration de site', desc: 'WordPress → Next.js, etc.', tarif: '1 200 - 3 500 €' },
    { service: 'Refonte graphique', desc: 'Sans refonte technique', tarif: '1 500 - 4 000 €' },
    { service: 'Intégration API tierce', desc: 'Paiement, CRM, etc.', tarif: '500 - 2 000 €/API' },
    { service: 'Module custom', desc: 'Fonctionnalité sur-mesure', tarif: '800 - 3 000 €' },
    { service: 'Audit de performance', desc: 'Analyse + plan d\'optimisation', tarif: '600 - 1 200 €' },
    { service: 'Formation avancée', desc: 'Par jour', tarif: '400 €/jour' },
  ],
};

const PROCESSUS_DEVIS = [
  'Réunion de cadrage (2-3h) : contexte, enjeux, objectifs',
  'Audit technique (si existant) : infrastructure, contraintes',
  'Proposition d\'architecture (1 semaine) : options et variantes',
  'Chiffrage détaillé (3-5 jours) : estimation par phase, planning',
  'Présentation et négociation : ajustements budget, livrables',
  'Signature et kick-off : contrat, acompte, lancement',
];

const PROCESSUS_TRAVAIL = [
  { step: 1, title: 'Premier contact et découverte', text: 'Réponse sous 24h, appel 30-45 min pour comprendre besoins et objectifs.' },
  { step: 2, title: 'Proposition commerciale', text: 'Devis sous 48-72h : description fonctionnelle, planning, technologies, moodboard.' },
  { step: 3, title: 'Validation et signature', text: 'Présentation, signature, acompte 40%, accès espace client.' },
  { step: 4, title: 'Kick-off et cadrage', text: 'Atelier 2-4h, cahier des charges, roadmap, collecte assets.' },
  { step: 5, title: 'Conception et design', text: 'Wireframes, maquettes, 2 rounds d\'ajustements, validation.' },
  { step: 6, title: 'Développement et itérations', text: 'Sprints 1-2 semaines, démos régulières, staging.' },
  { step: 7, title: 'Livraison et formation', text: 'Tests, formation 1h30-2h, mise en production, documentation, solde 20%.' },
  { step: 8, title: 'Support post-livraison', text: 'Support inclus 1 à 6 mois selon offre, corrections, accompagnement.' },
];

const FAQ = [
  { q: 'Combien de temps pour créer un site ?', a: '2-3 semaines (ESSENTIEL), 4-6 semaines (PRO), 2-3 mois (e-commerce/complexe). Délais variables selon réactivité et fourniture des contenus.' },
  { q: 'Puis-je modifier mon site moi-même après livraison ?', a: 'Oui. Formation personnalisée incluse pour gérer contenus (textes, images, blog). Modifications techniques : forfaits maintenance ou interventions ponctuelles.' },
  { q: 'Que se passe-t-il après la fin du projet ?', a: 'Support technique inclus 1 à 6 mois selon offre. Ensuite : contrat de maintenance mensuel ou interventions ponctuelles. Vous restez propriétaire à 100%.' },
  { q: 'Les tarifs incluent-ils hébergement et domaine ?', a: 'ESSENTIEL : 1 an d\'hébergement inclus. Autres offres : hébergement initial inclus. Domaine à votre charge (~10-15 €/an), vous en restez propriétaire.' },
  { q: 'Facilités de paiement ?', a: 'Échelonnement personnalisé possible pour projets > 5 000 €. À demander lors du devis.' },
  { q: 'Communication pendant le projet ?', a: 'Email pour la trace écrite, visioconférences (kick-off, validation design, démos). Accès espace projet en ligne pour suivi en temps réel.' },
  { q: 'Et si je ne suis pas satisfait ?', a: '2 rounds de révisions à chaque phase (design, dev). Nous étudions ensemble les ajustements pour viser votre entière satisfaction.' },
  { q: 'Exemples de réalisations ?', a: 'Portfolio en ligne sur le site avec études de cas. Mise en relation avec clients référents sur demande.' },
  { q: 'Accompagnement après mise en ligne ?', a: 'Oui. Support post-livraison inclus + contrats de maintenance mensuels pour pérennité et évolutions.' },
  { q: 'Clients hors France ?', a: 'Oui. Collaboration à distance (visio) avec clients francophones partout dans le monde.' },
];

const PAYMENT_SPLIT = '40% à la signature • 40% à mi-projet • 20% à la livraison';

const demoSettings = {
  site_name: 'Le Sage Dev',
  email: 'lesage.pro.dev@gmail.com',
  phone_number: '+33 7 86 18 18 40',
  city: 'Lyon',
  website: 'www.LeSageDev.com',
};

function OfferCard({ offer, index }) {
  const [open, setOpen] = useState(false);
  const Icon = index === 0 ? Package : index === 1 ? Zap : Star;
  return (
    <AnimeReveal options={{ delay: index * 100 }} as="article">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-[12px] transition hover:border-primary/30 hover:bg-white/8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white">{offer.name}</h2>
              <p className="mt-1 text-lg font-semibold text-primary">À partir de {offer.from} € TTC</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-lg border border-white/15 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-expanded={open}
          >
            <ChevronDown className={`h-5 w-5 transition ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-400">{offer.forWho}</p>
        {open && (
          <div className="mt-6 space-y-6 border-t border-white/10 pt-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">Ce qui est inclus</h3>
              <ul className="space-y-2">
                {offer.included.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">Technologies</h3>
              <p className="text-sm text-slate-300">{offer.tech}</p>
            </div>
            <p className="text-sm text-slate-400">
              <strong>Délai :</strong> {offer.delay}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="pb-2 pr-4 font-medium">Configuration</th>
                    <th className="pb-2 pr-4 font-medium">{offer.pricing[0].pages ? 'Pages' : 'Caractéristiques'}</th>
                    <th className="pb-2 font-medium">Prix TTC</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {offer.pricing.map((row, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 pr-4">{row.config}</td>
                      <td className="py-2 pr-4">{row.pages || row.desc || '—'}</td>
                      <td className="py-2 font-medium text-white">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ShimmerButton href="/contact?subject=Devis">
              Demander un devis
              <ArrowRight className="h-4 w-4" />
            </ShimmerButton>
          </div>
        )}
      </div>
    </AnimeReveal>
  );
}

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <AnimeReveal key={index} options={{ delay: index * 40 }} as="div">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:bg-white/8"
        aria-expanded={open}
      >
        <span className="font-medium text-white">{item.q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-1 rounded-b-xl border border-t-0 border-white/10 bg-white/5 px-5 py-4 text-slate-300">
          {item.a}
        </div>
      )}
    </AnimeReveal>
  );
}

export default function OffresPage() {
  const [settings, setSettings] = useState(demoSettings);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <>
      <Head>
        <title>Catalogue des offres – {settings.site_name || 'Le Sage Dev'}</title>
        <meta
          name="description"
          content="Solutions digitales sur-mesure : Essentiel 1 500-3 000 €, Professionnel 3 000-6 000 €, Premium 6 000-12 000 €. Devis gratuit."
        />
      </Head>

      <div className="min-h-screen bg-dark text-light">
        <Header settings={settings} />

        {/* Hero */}
        <section className="relative border-b border-white/5 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <BlurFade delay={0} duration={0.5} className="mb-8 flex justify-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-[12px] max-w-[200px]">
                <img
                  src="/image-website/undraw_next-js_hy59.svg"
                  alt="Solutions web modernes"
                  className="h-auto w-full object-contain opacity-90"
                />
              </div>
            </BlurFade>
            <div className="text-center">
              <BlurFade delay={0.05} duration={0.5}>
                <p className="text-sm font-medium uppercase tracking-wider text-primary">{VALIDITE}</p>
                <h1 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                  Catalogue des offres
                </h1>
                <p className="mt-4 text-xl font-medium text-slate-300">
                  Solutions digitales sur-mesure
                </p>
                <p className="mt-2 text-slate-400">
                  Votre vision, notre expertise technique
                </p>
                <p className="mt-6 text-slate-400">
                  De la conception au déploiement — des solutions performantes qui font la différence.
                </p>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Notre approche */}
        <section className="relative border-b border-white/5 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 md:grid-cols-[1fr,auto] md:items-start">
              <AnimeReveal>
                <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">Notre approche</h2>
                <p className="mt-4 max-w-3xl text-slate-300">
                  Chaque projet digital est unique. Notre catalogue répond à tous les besoins, du site vitrine à la plateforme e-commerce, avec une méthodologie en quatre piliers.
                </p>
              </AnimeReveal>
              <AnimeReveal className="hidden md:block">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-[12px] w-[140px]">
                  <img
                    src="/image-website/group.svg"
                    alt="Méthodologie et équipe"
                    className="h-auto w-full object-contain opacity-90"
                  />
                </div>
              </AnimeReveal>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {APPROCHE.map((item, i) => (
                <AnimeReveal key={i} options={{ delay: i * 80 }} as="div">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-[12px]">
                    <item.icon className="h-8 w-8 text-primary" />
                    <h3 className="mt-4 font-heading text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{item.text}</p>
                  </div>
                </AnimeReveal>
              ))}
            </div>
            <AnimeReveal className="mt-8">
              <p className="text-slate-400">
                <strong className="text-slate-300">Comment choisir ?</strong> ESSENTIEL (1 500-3 000 €) pour une présence pro rapide — PROFESSIONNEL (3 000-6 000 €) pour un site complet — PREMIUM (6 000-12 000 €) pour e-commerce et plateformes métier. Services complémentaires à la carte (design, SEO, maintenance).
              </p>
            </AnimeReveal>
          </div>
        </section>

        {/* Les 3 offres */}
        <section id="offres" className="relative border-b border-white/5 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <AnimeReveal>
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">Tarifs 2026</h2>
              <p className="mt-2 text-slate-400">{VALIDITE}</p>
            </AnimeReveal>
            <div className="mt-10 space-y-6">
              <OfferCard offer={OFFRE_ESSENTIEL} index={0} />
              <OfferCard offer={OFFRE_PRO} index={1} />
              <OfferCard offer={OFFRE_PREMIUM} index={2} />
            </div>
          </div>
        </section>

        {/* Services à la carte */}
        <section id="services-complementaires" className="relative border-b border-white/5 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <AnimeReveal>
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">Services complémentaires à la carte</h2>
              <p className="mt-2 text-slate-400">Enrichissez votre projet avec nos services additionnels.</p>
            </AnimeReveal>

            <AnimeReveal className="mt-10">
              <h3 className="mb-4 font-heading text-lg font-semibold text-white">Design et création visuelle</h3>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                      <th className="px-4 py-3 font-medium">Service</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Tarif</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {SERVICES_CARTE.design.map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="px-4 py-3">{row.service}</td>
                        <td className="px-4 py-3">{row.desc}</td>
                        <td className="px-4 py-3 font-medium text-white">{row.tarif}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimeReveal>

            <AnimeReveal className="mt-10">
              <h3 className="mb-4 font-heading text-lg font-semibold text-white">Contenu et marketing</h3>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                      <th className="px-4 py-3 font-medium">Service</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Tarif</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {SERVICES_CARTE.contenu.map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="px-4 py-3">{row.service}</td>
                        <td className="px-4 py-3">{row.desc}</td>
                        <td className="px-4 py-3 font-medium text-white">{row.tarif}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimeReveal>

            <AnimeReveal className="mt-10">
              <h3 className="mb-4 font-heading text-lg font-semibold text-white">Maintenance et support</h3>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                      <th className="px-4 py-3 font-medium">Formule</th>
                      <th className="px-4 py-3 font-medium">Inclus</th>
                      <th className="px-4 py-3 font-medium">Tarif</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {SERVICES_CARTE.maintenance.map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="px-4 py-3">{row.name}</td>
                        <td className="px-4 py-3">{row.inclut}</td>
                        <td className="px-4 py-3 font-medium text-white">{row.tarif}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimeReveal>

            <AnimeReveal className="mt-10">
              <h3 className="mb-4 font-heading text-lg font-semibold text-white">Services techniques spécialisés</h3>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                      <th className="px-4 py-3 font-medium">Service</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Tarif</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {SERVICES_CARTE.technique.map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="px-4 py-3">{row.service}</td>
                        <td className="px-4 py-3">{row.desc}</td>
                        <td className="px-4 py-3 font-medium text-white">{row.tarif}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimeReveal>
          </div>
        </section>

        {/* Processus devis */}
        <section className="relative border-b border-white/5 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <AnimeReveal>
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">Processus de devis</h2>
            </AnimeReveal>
            <ul className="mt-8 space-y-4">
              {PROCESSUS_DEVIS.map((item, i) => (
                <AnimeReveal key={i} options={{ delay: i * 60 }} as="li">
                  <div className="flex gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-slate-300">{item}</span>
                  </div>
                </AnimeReveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Notre processus de travail */}
        <section className="relative border-b border-white/5 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <AnimeReveal>
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">Notre processus de travail</h2>
              <p className="mt-2 text-slate-400">Méthodologie en 8 étapes pour garantir votre satisfaction.</p>
            </AnimeReveal>
            <div className="mt-10 space-y-4">
              {PROCESSUS_TRAVAIL.map((item, i) => (
                <AnimeReveal key={i} options={{ delay: i * 50 }} as="div">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <span className="text-sm font-bold text-primary">Étape {item.step}</span>
                    <h3 className="mt-1 font-heading text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{item.text}</p>
                  </div>
                </AnimeReveal>
              ))}
            </div>
            <AnimeReveal className="mt-8">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                <p className="font-medium text-white">Modalités de paiement</p>
                <p className="mt-2 text-slate-300">{PAYMENT_SPLIT}</p>
                <p className="mt-2 text-sm text-slate-400">Virement, chèque, carte (Stripe). Garanties : délais respectés, 2 rounds de révisions, code documenté, RGPD, propriété intellectuelle transférée à la livraison.</p>
              </div>
            </AnimeReveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative border-b border-white/5 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <AnimeReveal>
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">Questions fréquentes</h2>
            </AnimeReveal>
            <div className="mt-10 space-y-3">
              {FAQ.map((item, i) => (
                <FaqItem key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative px-6 py-20 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <AnimeReveal>
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                Prêt à démarrer votre projet ?
              </h2>
              <p className="mt-4 text-slate-300">
                Contactez-nous pour un devis gratuit et personnalisé.
              </p>
              <p className="mt-6 text-slate-400">
                Transformons ensemble votre vision en réalité digitale.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <ShimmerButton href="/contact">
                  Demander un devis
                  <ArrowRight className="h-4 w-4" />
                </ShimmerButton>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  {settings.email}
                </a>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-slate-300">
                  <Mail className="h-4 w-4" /> Email
                </a>
                <a href={`tel:${settings.phone_number?.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-slate-300">
                  <Phone className="h-4 w-4" /> Téléphone
                </a>
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> {settings.website}
                </span>
              </div>
            </AnimeReveal>
          </div>
        </section>

        <Footer settings={settings} />
      </div>
    </>
  );
}
