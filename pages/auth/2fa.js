// Vérification 2FA (TOTP) après connexion email/password
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { authClient } from '../../lib/auth-client';
import { fetchSettings } from '../../utils/api';
import { useEffect } from 'react';

export default function TwoFactorPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({ site_name: 'LE SAGE' });

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {});
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    if (!code.trim()) {
      setError('Veuillez entrer le code à 6 chiffres.');
      return;
    }
    setLoading(true);
    try {
      const { data, error: err } = await authClient.twoFactor.verifyTotp({
        code: code.trim(),
        trustDevice: true,
      });
      if (err) {
        setError(err.message || 'Code invalide. Réessayez.');
        setLoading(false);
        return;
      }
      const redirect = router.query.redirect || '/dashboard';
      await router.replace(redirect);
    } catch (err) {
      setError(err?.message || 'Erreur de vérification.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Vérification en deux étapes - {settings.site_name}</title>
      </Head>
      <Header settings={settings} />
      <div className="auth-2fa-page">
        <div className="auth-2fa-card">
          <div className="auth-2fa-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1>Vérification en deux étapes</h1>
          <p>Entrez le code à 6 chiffres affiché dans votre application d&apos;authentification.</p>
          <form onSubmit={handleVerify}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="auth-2fa-input"
              disabled={loading}
              autoFocus
            />
            {error && <p className="auth-2fa-error">{error}</p>}
            <button type="submit" className="auth-2fa-submit" disabled={loading}>
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>
          </form>
          <Link href="/login" className="auth-2fa-back">Retour à la connexion</Link>
        </div>
      </div>
      <Footer settings={settings} />
      <style jsx>{`
        .auth-2fa-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: #0a0a1e;
        }
        .auth-2fa-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 48px;
          max-width: 420px;
          width: 100%;
          text-align: center;
        }
        .auth-2fa-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          color: #667eea;
        }
        .auth-2fa-icon svg {
          width: 100%;
          height: 100%;
        }
        .auth-2fa-card h1 {
          color: white;
          font-size: 1.5rem;
          margin-bottom: 12px;
        }
        .auth-2fa-card p {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 24px;
          font-size: 0.95rem;
        }
        .auth-2fa-input {
          width: 100%;
          padding: 16px 20px;
          font-size: 1.5rem;
          letter-spacing: 0.5em;
          text-align: center;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          margin-bottom: 16px;
        }
        .auth-2fa-input:focus {
          outline: none;
          border-color: #667eea;
        }
        .auth-2fa-error {
          color: #f87171;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }
        .auth-2fa-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 20px;
        }
        .auth-2fa-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .auth-2fa-back {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          text-decoration: none;
        }
        .auth-2fa-back:hover {
          color: #667eea;
        }
      `}</style>
    </>
  );
}
