/**
 * Page de connexion EcamSap - Authentification JWT simple
 * Design épuré Kafé Stockholm : fond accueil, image, avis, confiance.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { login } from '../utils/api';
import { toast } from 'react-toastify';
import { ECAMSAP } from '../lib/ecamsap';
import { AuthPageLayout } from '../components/auth/AuthPageLayout';

export default function LoginPage() {
  const router = useRouter();
  const { redirect } = router.query;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      router.push((redirect as string) || '/dashboard');
    }
  }, [redirect, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      });

      let destination: string;
      if (redirect && typeof redirect === 'string') {
        destination = redirect;
      } else {
        const role = response.user?.role;
        if (role === 'admin') {
          destination = '/admin/ecommerce/dashboard';
        } else if (role === 'dropshipper') {
          destination = '/dropshipper/dashboard';
        } else {
          destination = '/dashboard';
        }
      }

      toast.success('Connexion réussie!');
      await router.push(destination);

    } catch (error: any) {
      const errorMessage = error.message || 'Email ou mot de passe incorrect';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Connexion | {ECAMSAP.name}</title>
        <meta name="description" content={`Connectez-vous à votre compte ${ECAMSAP.name}`} />
      </Head>

      <AuthPageLayout
        title="Bon retour"
        subtitle="Connectez-vous à votre compte"
        backHref="/"
        backLabel="Retour à l'accueil"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-white/95 backdrop-blur border border-kafe-border/60 shadow-card p-8"
          style={{ boxShadow: '0 2px 20px rgba(13,42,92,0.08)' }}
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-kafe-accent/15 rounded-xl mb-3">
              <LogIn className="w-7 h-7 text-kafe-accent" />
            </div>
            <h2 className="font-heading text-xl text-kafe-primary-dark mb-1">Bon retour</h2>
            <p className="text-sm text-kafe-muted">Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-kafe-text mb-2">
                <Mail className="w-4 h-4 inline mr-2 text-kafe-muted" />
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-kafe-bg border border-kafe-border rounded-refined text-kafe-text placeholder-kafe-muted focus:outline-none focus:ring-2 focus:ring-kafe-accent/50 focus:border-kafe-accent transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-kafe-text mb-2">
                <Lock className="w-4 h-4 inline mr-2 text-kafe-muted" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-kafe-bg border border-kafe-border rounded-refined text-kafe-text placeholder-kafe-muted focus:outline-none focus:ring-2 focus:ring-kafe-accent/50 focus:border-kafe-accent transition-all disabled:opacity-50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-kafe-muted hover:text-kafe-text transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-kafe-border text-kafe-accent focus:ring-kafe-accent focus:ring-offset-0"
                />
                <span className="text-kafe-text-secondary">Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password" className="text-kafe-primary hover:text-kafe-primary-dark font-medium transition-colors">
                Mot de passe oublié?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-kafe-accent text-kafe-primary-dark rounded-refined font-medium hover:bg-kafe-accent-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-kafe-primary-dark/20 border-t-kafe-primary-dark rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-kafe-border text-center">
            <p className="text-sm text-kafe-muted">
              Pas encore de compte?{' '}
              <Link href="/register" className="text-kafe-primary hover:text-kafe-primary-dark font-medium inline-flex items-center gap-1 transition-colors">
                Créer un compte
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </motion.div>
      </AuthPageLayout>
    </>
  );
}
