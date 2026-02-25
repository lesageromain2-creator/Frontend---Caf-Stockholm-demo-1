/** @type {import('next').NextConfig} */

// Hostname de l'API pour autoriser les images uploadées (next/image)
function getApiImageRemotePatterns() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const u = new URL(apiUrl);
    const protocol = u.protocol.replace(':', '');
    const patterns = [
      { protocol, hostname: u.hostname, pathname: '/**' },
    ];
    if (u.port) patterns[0].port = u.port;
    return patterns;
  } catch {
    return [];
  }
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      ...getApiImageRemotePatterns(),
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Turbopack désactivé en dev (--no-turbo) pour éviter l'erreur "junction point" sur Windows
  // Support pour TypeScript et JavaScript coexistant
  typescript: {
    // Permet la build même avec des erreurs TS (utile pendant la migration)
    ignoreBuildErrors: false,
  },
  // Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_HOTEL_ID: process.env.NEXT_PUBLIC_HOTEL_ID,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  // En-têtes de sécurité (production)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  // Redirections pour la migration dashboard -> admin
  async redirects() {
    return [
      // Redirection permanente de /dashboard/* vers /admin/*
      // Note: Les pages de redirection en JavaScript sont déjà créées
      // Ces redirections server-side sont une couche de sécurité supplémentaire
      {
        source: '/dashboard/projects',
        destination: '/admin/projects',
        permanent: false, // 307 redirect (temporaire pour pouvoir changer)
      },
      {
        source: '/dashboard/reservations',
        destination: '/admin/reservations',
        permanent: false,
      },
      {
        source: '/dashboard/clients',
        destination: '/admin/clients',
        permanent: false,
      },
      {
        source: '/dashboard/messages',
        destination: '/admin/messages',
        permanent: false,
      },
      {
        source: '/dashboard/blog',
        destination: '/admin/blog',
        permanent: false,
      },
      { source: '/accueil-hotel', destination: '/', permanent: true },
      // Kafé Stockholm : anciennes routes e-commerce → café
      { source: '/products', destination: '/carte', permanent: false },
      { source: '/products/:path*', destination: '/carte/:path*', permanent: false },
    ];
  },
}

module.exports = nextConfig
