/**
 * Métadonnées par défaut — Kafé Stockholm
 * À utiliser dans _app ou en complément des Head de chaque page
 */

import Head from 'next/head';
import { SITE } from '@/lib/site-config';

const DEFAULT_TITLE = `${SITE.name} — ${SITE.tagline}`;
const DEFAULT_DESCRIPTION = SITE.description;
// Image affichée dans l'onglet du navigateur et en prévisualisation (partage, réseaux sociaux)
const DEFAULT_OG_IMAGE = `${SITE.baseUrl}/images/drapeau%20officiel%20suede.jpg`;

export default function DefaultMeta() {
  return (
    <Head>
      <title>{DEFAULT_TITLE}</title>
      <meta name="description" content={DEFAULT_DESCRIPTION} />
      <meta name="keywords" content="café suédois, Lyon, Fika, kanelbullar, smörgås, Kafé Stockholm, click and collect" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={DEFAULT_TITLE} />
      <meta property="og:description" content={DEFAULT_DESCRIPTION} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={DEFAULT_TITLE} />
      <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      {/* Icône de l'onglet (favicon) : drapeau suédois */}
      <link rel="icon" type="image/jpeg" href="/images/drapeau%20officiel%20suede.jpg" />
      <link rel="apple-touch-icon" href="/images/drapeau%20officiel%20suede.jpg" />
    </Head>
  );
}
