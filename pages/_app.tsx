/**
 * _app.tsx - Application wrapper unique
 * Fournit : AuthProvider (JWT), ToastContainer, métadonnées et Schema.org par défaut
 */
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/components/providers/AuthProvider';
import DefaultMeta from '@/components/seo/DefaultMeta';
import SchemaCafe from '@/components/seo/SchemaCafe';
import { SITE } from '@/lib/site-config';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>{SITE.name} — {SITE.tagline}</title>
      </Head>
      <Head>
        <title key="title">{`${SITE.name} — ${SITE.tagline}`}</title>
      </Head>
      <DefaultMeta />
      <SchemaCafe />
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        theme="dark"
      />
    </AuthProvider>
  );
}
