/**
 * Page d'inscription EcamSap - Authentification JWT simple
 * Design épuré Kafé Stockholm : fond accueil, image, avis, confiance.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, ArrowRight } from 'lucide-react';
import { register } from '../utils/api';
import { toast } from 'react-toastify';
import { ECAMSAP } from '../lib/ecamsap';
import { AuthPageLayout } from '../components/auth/AuthPageLayout';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    calculatePasswordStrength(formData.password);
  }, [formData.password]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    if (passwordStrength < 80) return 'bg-blue-500';
    return 'bg-kafe-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Faible';
    if (passwordStrength < 60) return 'Moyen';
    if (passwordStrength < 80) return 'Bon';
    return 'Excellent';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (!acceptTerms) {
      toast.error('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    setLoading(true);

    try {
      await register({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password
      });

      toast.success('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
      await router.push('/login');

    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de la création du compte';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Créer un compte | {ECAMSAP.name}</title>
        <meta name="description" content={`Créez votre compte ${ECAMSAP.name}`} />
      </Head>

      <AuthPageLayout
        title="Créer un compte"
        subtitle="Rejoignez la communauté"
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
              <UserPlus className="w-7 h-7 text-kafe-accent" />
            </div>
            <h2 className="font-heading text-xl text-kafe-primary-dark mb-1">Créer un compte</h2>
            <p className="text-sm text-kafe-muted">Rejoignez la communauté Kafé Stockholm</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-kafe-text mb-2">
                  <User className="w-4 h-4 inline mr-2 text-kafe-muted" />
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Prénom"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-kafe-bg border border-kafe-border rounded-refined text-kafe-text placeholder-kafe-muted focus:outline-none focus:ring-2 focus:ring-kafe-accent/50 focus:border-kafe-accent transition-all disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-kafe-text mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Nom"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-kafe-bg border border-kafe-border rounded-refined text-kafe-text placeholder-kafe-muted focus:outline-none focus:ring-2 focus:ring-kafe-accent/50 focus:border-kafe-accent transition-all disabled:opacity-50"
                />
              </div>
            </div>

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
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-kafe-border rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <span className="text-xs text-kafe-muted font-medium">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-kafe-text mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-kafe-bg border border-kafe-border rounded-refined text-kafe-text placeholder-kafe-muted focus:outline-none focus:ring-2 focus:ring-kafe-accent/50 focus:border-kafe-accent transition-all disabled:opacity-50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-kafe-muted hover:text-kafe-text transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-kafe-border text-kafe-accent focus:ring-kafe-accent focus:ring-offset-0"
                />
                <span className="text-sm text-kafe-text-secondary">
                  J'accepte les{' '}
                  <Link href="/conditions-service" className="text-kafe-primary hover:text-kafe-primary-dark font-medium">
                    conditions d'utilisation
                  </Link>
                  {' '}et la{' '}
                  <Link href="/confidentialite" className="text-kafe-primary hover:text-kafe-primary-dark font-medium">
                    politique de confidentialité
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full py-3.5 bg-kafe-accent text-kafe-primary-dark rounded-refined font-medium hover:bg-kafe-accent-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-kafe-primary-dark/20 border-t-kafe-primary-dark rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-kafe-border text-center">
            <p className="text-sm text-kafe-muted">
              Vous avez déjà un compte?{' '}
              <Link href="/login" className="text-kafe-primary hover:text-kafe-primary-dark font-medium inline-flex items-center gap-1 transition-colors">
                Se connecter
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </motion.div>
      </AuthPageLayout>
    </>
  );
}
