// Page d'erreur Better Auth (OAuth, linking, etc.)
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { fetchSettings } from '../../utils/api';
import { useState, useEffect } from 'react';

const ERROR_MESSAGES = {
  unable_to_link_account: "Impossible de lier ce compte. Vérifiez que l'email Google correspond à votre compte, ou connectez-vous d'abord avec email/mot de passe puis liez Google depuis les paramètres.",
  unable_to_create_user: "Impossible de créer le compte. Réessayez ou utilisez une autre méthode d'inscription.",
  access_denied: "Connexion refusée.",
  callback: "Erreur lors du retour de connexion.",
  default: "Une erreur d'authentification s'est produite.",
};

export default function AuthErrorPage() {
  const router = useRouter();
  const { error } = router.query;
  const [settings, setSettings] = useState({ site_name: 'LE SAGE' });

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {});
  }, []);

  const message = ERROR_MESSAGES[error] || ERROR_MESSAGES.default;

  return (
    <>
      <Head>
        <title>{`Erreur de connexion - ${settings.site_name || 'LE SAGE'}`}</title>
      </Head>
      <Header settings={settings} />
      <div className="auth-error-page">
        <div className="auth-error-card">
          <div className="auth-error-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1>Erreur de connexion</h1>
          <p className="auth-error-message">{message}</p>
          <Link href="/login" className="auth-error-link">
            Retour à la connexion
          </Link>
        </div>
      </div>
      <Footer settings={settings} />
      <style jsx>{`
        .auth-error-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: #0a0a1e;
        }
        .auth-error-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 48px;
          max-width: 480px;
          text-align: center;
        }
        .auth-error-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          color: #f87171;
        }
        .auth-error-icon svg {
          width: 100%;
          height: 100%;
        }
        .auth-error-card h1 {
          color: white;
          font-size: 1.75rem;
          margin-bottom: 16px;
        }
        .auth-error-message {
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 28px;
          line-height: 1.5;
        }
        .auth-error-link {
          display: inline-block;
          padding: 14px 28px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .auth-error-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
      `}</style>
    </>
  );
}
