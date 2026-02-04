/**
 * _app.tsx - Application wrapper unique
 * Fournit : AuthProvider (JWT), ToastContainer
 * Better Auth useSession n'a pas besoin de Provider (stores globaux nanostores)
 * NE PAS utiliser authClient.Provider - c'est un Proxy qui provoque des requêtes /provider/display-name/*
 */
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/components/providers/AuthProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
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
