/**
 * Retourne l'URL de base de l'API backend.
 * - En production (Vercel) sans NEXT_PUBLIC_API_URL : utilise le proxy /api/backend (évite exposition de l'URL backend)
 * - Sinon : utilise NEXT_PUBLIC_API_URL (ou localhost en dev)
 */
export function getApiBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const isProduction = origin.includes('vercel.app') || origin.startsWith('https://');
    if (isProduction && (!envUrl || envUrl.replace(/\/$/, '') === origin.replace(/\/$/, ''))) {
      return ''; // Relative URL = même origine → /api/backend
    }
  }
  let url = envUrl || 'http://localhost:5000';
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://') && !url.includes('localhost')) {
    url = url.replace('http://', 'https://');
  }
  return url.replace(/\/$/, '');
}

/**
 * Préfixe pour les appels API. En mode proxy (production sans URL backend exposée) = /api/backend
 */
export function getApiPrefix() {
  const base = getApiBaseUrl();
  return base === '' ? '/api/backend' : base;
}
