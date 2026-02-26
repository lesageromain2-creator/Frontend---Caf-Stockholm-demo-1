/**
 * Dashboard Client — Kafé Stockholm
 * Identité visuelle : fond blanc, logo, couleurs café.
 */

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package,
  MapPin,
  Heart,
  User,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { SITE } from '../lib/site-config';
import { designTokens } from '@/lib/design-tokens';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

const { colors, fonts, fontSizes, lineHeights, layout } = designTokens;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface DashboardUser {
  firstname?: string;
  first_name?: string;
  lastname?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string | null;
}

interface DashboardOrder {
  id: string;
  status: string;
  order_number: string;
  created_at: string;
  total_amount: number;
}

// ——— Formulaire profil (éditable + photo) ———
function ProfileForm({
  user,
  setUser,
  updateUser,
  profileSaving,
  setProfileSaving,
  profilePhotoFile,
  setProfilePhotoFile,
  profilePhotoPreview,
  setProfilePhotoPreview,
  apiUrl,
}: {
  user: DashboardUser | null;
  setUser: (u: DashboardUser | null | ((prev: DashboardUser | null) => DashboardUser | null)) => void;
  updateUser: (u: Record<string, unknown>) => void;
  profileSaving: boolean;
  setProfileSaving: (v: boolean) => void;
  profilePhotoFile: File | null;
  setProfilePhotoFile: (f: File | null) => void;
  profilePhotoPreview: string | null;
  setProfilePhotoPreview: (s: string | null) => void;
  apiUrl: string;
}) {
  const [firstname, setFirstname] = useState(user?.firstname || user?.first_name || '');
  const [lastname, setLastname] = useState(user?.lastname || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFirstname(user?.firstname || user?.first_name || '');
    setLastname(user?.lastname || '');
    setPhone(user?.phone || '');
  }, [user?.firstname, user?.first_name, user?.lastname, user?.phone, user?.phone]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Choisissez une image (JPG, PNG, WebP ou GIF)');
      return;
    }
    setProfilePhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfilePhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('auth_token')) : null;
    if (!token) return;
    setProfileSaving(true);
    try {
      let avatarUrl: string | null = user?.avatar_url ?? null;
      if (profilePhotoFile) {
        const formData = new FormData();
        formData.append('image', profilePhotoFile);
        const uploadRes = await axios.post(`${apiUrl}/upload/profile-image`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (uploadRes.data?.url) avatarUrl = uploadRes.data.url;
      }
      const res = await axios.put(
        `${apiUrl}/users/me`,
        { firstname, lastname, phone, avatar_url: avatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = res.data?.user;
      if (updatedUser) {
        setUser(updatedUser);
        updateUser(updatedUser);
        setProfilePhotoFile(null);
        setProfilePhotoPreview(null);
        toast.success('Profil enregistré');
      }
    } catch (err: unknown) {
      console.error('Erreur enregistrement profil:', err);
      toast.error((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Erreur lors de l\'enregistrement');
    } finally {
      setProfileSaving(false);
    }
  };

  const avatarDisplayUrl = profilePhotoPreview || user?.avatar_url || null;

  return (
    <div
      className="rounded-2xl border p-6 sm:p-8"
      style={{ backgroundColor: colors.white, borderColor: colors.bgSurface, boxShadow: layout.cardShadow }}
    >
      <h2 className="font-display text-xl font-semibold mb-6" style={{ fontFamily: fonts.display, color: colors.primaryDark }}>
        Mon profil
      </h2>
      <div className="space-y-6 max-w-md">
        <div className="flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden bg-cover bg-center shrink-0"
            style={{
              backgroundColor: colors.primaryDark,
              backgroundImage: avatarDisplayUrl ? `url(${avatarDisplayUrl})` : undefined,
            }}
          >
            {!avatarDisplayUrl && (user?.firstname?.charAt(0) || user?.first_name?.charAt(0) || 'U')}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl font-medium text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: colors.primaryLink, color: colors.white, fontFamily: fonts.body }}
            >
              {user?.avatar_url || profilePhotoPreview ? 'Changer la photo' : 'Ajouter une photo'}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: fonts.body, color: colors.textGray }}>
            Prénom
          </label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border"
            style={{ fontFamily: fonts.body, borderColor: colors.bgSurface, color: colors.textDark }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: fonts.body, color: colors.textGray }}>
            Nom
          </label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border"
            style={{ fontFamily: fonts.body, borderColor: colors.bgSurface, color: colors.textDark }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: fonts.body, color: colors.textGray }}>
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-3 rounded-xl border opacity-80"
            style={{ fontFamily: fonts.body, backgroundColor: colors.bgCream, borderColor: colors.bgSurface, color: colors.textDark }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: fonts.body, color: colors.textGray }}>
            Téléphone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border"
            style={{ fontFamily: fonts.body, borderColor: colors.bgSurface, color: colors.textDark }}
          />
        </div>
        <button
          type="button"
          disabled={profileSaving}
          onClick={handleSave}
          className="px-6 py-3 rounded-xl font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: colors.primaryDark, fontFamily: fonts.body }}
        >
          {profileSaving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { logout, updateUser } = useAuth();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [mounted, setMounted] = useState(false);

  // Données
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [addresses, setAddresses] = useState<unknown[]>([]);
  const [wishlist, setWishlist] = useState<unknown[]>([]);

  useEffect(() => {
    setMounted(true);
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');
      
      if (!token) {
        router.push('/login?redirect=/dashboard');
        return;
      }

      // Données locales d'abord pour affichage immédiat
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (e) {
          console.error('Erreur parsing user:', e);
        }
      }

      // Charger le profil à jour depuis l'API (firstname, lastname, phone, avatar_url)
      try {
        const profileRes = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.data?.user) {
          const apiUser = profileRes.data.user;
          setUser((prev) => ({ ...prev, ...apiUser }));
          localStorage.setItem('user', JSON.stringify({ ...JSON.parse(userStr || '{}'), ...apiUser }));
        }
      } catch (err) {
        console.error('Erreur chargement profil:', err);
      }

      loadOrders().catch((err) => {
        console.error('Erreur chargement commandes:', err);
      });
      
      setLoading(false);
    } catch (err: unknown) {
      console.error('Erreur chargement:', err);
      toast.error('Erreur de chargement');
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 401) {
        router.push('/login');
      }
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('auth_token')) : null;
      if (!token) return;
      
      const response = await axios.get(`${API_URL}/ecommerce/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.success) {
        setOrders((response.data.orders || []) as DashboardOrder[]);
      }
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      // Ne pas afficher d'erreur à l'utilisateur si c'est juste les commandes qui ne chargent pas
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'text-green-500';
      case 'pending':
      case 'processing':
        return 'text-yellow-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      processing: 'En préparation',
      ready: 'Prêt à retirer',
      shipped: 'Prêt à retirer',
      delivered: 'Récupérée',
      completed: 'Récupérée',
      cancelled: 'Annulée',
    };
    return labels[status] ?? status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bgPage }}>
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: colors.primaryLink, borderTopColor: 'transparent' }}
          />
          <p style={{ fontFamily: fonts.body, color: colors.textGray }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Mon compte — {SITE.name}</title>
        <meta name="description" content={`Gérez vos commandes click & collect — ${SITE.name}`} />
      </Head>

      <div className="min-h-screen" style={{ backgroundColor: colors.white }}>
        {/* Header — identité Kafé Stockholm */}
        <header
          className="border-b sticky top-0 z-30"
          style={{
            backgroundColor: colors.white,
            borderColor: colors.bgSurface,
            boxShadow: '0 1px 0 rgba(13, 42, 92, 0.06)',
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3 shrink-0">
                <div className="relative h-10 w-[44px] sm:h-12 sm:w-[52px]">
                  <Image
                    src="/images/logo.png"
                    alt={SITE.name}
                    fill
                    className="object-contain object-left"
                    sizes="52px"
                    priority
                  />
                </div>
                <span
                  className="font-display font-semibold text-lg sm:text-xl hidden xs:block"
                  style={{ fontFamily: fonts.display, color: colors.primaryDark }}
                >
                  {SITE.name}
                </span>
              </Link>
              <nav className="flex items-center gap-3 sm:gap-6">
                <Link
                  href="/carte"
                  className="text-sm sm:text-base transition-colors hover:opacity-80"
                  style={{ fontFamily: fonts.body, color: colors.textGray }}
                >
                  La carte
                </Link>
                <Link
                  href="/cart"
                  className="text-sm sm:text-base transition-colors"
                  style={{ fontFamily: fonts.body, color: colors.textGray }}
                >
                  Ma commande
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm sm:text-base transition-colors hover:opacity-80"
                  style={{ fontFamily: fonts.body, color: colors.primaryLink }}
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" style={{ backgroundColor: colors.bgPage }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.6 }}
          >
            {/* Welcome Section */}
            <div className="mb-6 sm:mb-8">
              <h1
                className="font-display font-semibold text-2xl sm:text-3xl mb-2"
                style={{ fontFamily: fonts.display, color: colors.primaryDark }}
              >
                Hej, {user?.firstname || user?.first_name || (user?.name?.split(' ')[0]) || 'vous'} !
              </h1>
              <p style={{ fontFamily: fonts.body, fontSize: fontSizes.bodySmall, color: colors.textGray, lineHeight: lineHeights.normal }}>
                Votre espace commandes click & collect
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div
                  className="rounded-2xl overflow-hidden p-6 sticky top-24 lg:top-28 border shadow-sm"
                  style={{
                    backgroundColor: colors.white,
                    borderColor: colors.bgSurface,
                    boxShadow: layout.cardShadow,
                  }}
                >
                  <div className="mb-6 text-center">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl sm:text-2xl overflow-hidden bg-cover bg-center"
                      style={{
                        backgroundColor: colors.primaryDark,
                        backgroundImage: (user as { avatar_url?: string })?.avatar_url ? `url(${(user as { avatar_url: string }).avatar_url})` : undefined,
                      }}
                    >
                      {!(user as { avatar_url?: string })?.avatar_url && (
                        <span>{user?.firstname?.charAt(0) || user?.first_name?.charAt(0) || user?.name?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <h3 className="font-display font-semibold truncate px-2" style={{ fontFamily: fonts.display, fontSize: fontSizes.body, color: colors.textDark }}>
                      {user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : user?.name || user?.email}
                    </h3>
                    <p className="text-sm truncate px-2 mt-1" style={{ fontFamily: fonts.body, color: colors.textMuted }}>
                      {user?.email}
                    </p>
                  </div>

                  <nav className="space-y-1">
                    {[
                      { id: 'overview', label: "Vue d'ensemble", icon: ShoppingBag },
                      { id: 'orders', label: 'Mes commandes click & collect', icon: Package },
                      { id: 'addresses', label: 'Adresses', icon: MapPin },
                      { id: 'wishlist', label: 'Mes favoris', icon: Heart },
                      { id: 'profile', label: 'Mon profil', icon: User },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                          activeTab === id ? 'text-white font-medium' : 'hover:bg-kafe-bg-surface'
                        }`}
                        style={{
                          fontFamily: fonts.body,
                          fontSize: fontSizes.bodySmall,
                          backgroundColor: activeTab === id ? colors.primaryDark : 'transparent',
                          color: activeTab === id ? colors.white : colors.textGray,
                        }}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Vue d'ensemble */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div
                        className="rounded-2xl border p-5 sm:p-6"
                        style={{ backgroundColor: colors.white, borderColor: colors.bgSurface, boxShadow: layout.cardShadow }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Package className="w-8 h-8" style={{ color: colors.primaryDark }} />
                        </div>
                        <h3 className="text-2xl font-bold" style={{ fontFamily: fonts.display, color: colors.primaryDark }}>
                          {orders.length}
                        </h3>
                        <p style={{ fontFamily: fonts.body, fontSize: fontSizes.bodySmall, color: colors.textGray }}>
                          Commandes click & collect
                        </p>
                      </div>
                      <div
                        className="rounded-2xl border p-5 sm:p-6"
                        style={{ backgroundColor: colors.white, borderColor: colors.bgSurface, boxShadow: layout.cardShadow }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Clock className="w-8 h-8" style={{ color: colors.primaryLink }} />
                        </div>
                        <h3 className="text-2xl font-bold" style={{ fontFamily: fonts.display, color: colors.primaryDark }}>
                          {orders.filter((o) => o.status === 'pending' || o.status === 'processing').length}
                        </h3>
                        <p style={{ fontFamily: fonts.body, fontSize: fontSizes.bodySmall, color: colors.textGray }}>
                          À venir / Prêt
                        </p>
                      </div>
                      <div
                        className="rounded-2xl border p-5 sm:p-6"
                        style={{ backgroundColor: colors.white, borderColor: colors.bgSurface, boxShadow: layout.cardShadow }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Heart className="w-8 h-8" style={{ color: colors.accent }} />
                        </div>
                        <h3 className="text-2xl font-bold" style={{ fontFamily: fonts.display, color: colors.primaryDark }}>
                          {wishlist.length}
                        </h3>
                        <p style={{ fontFamily: fonts.body, fontSize: fontSizes.bodySmall, color: colors.textGray }}>
                          Favoris
                        </p>
                      </div>
                    </div>

                    {/* Dernières commandes */}
                    <div
                      className="rounded-2xl border p-6 sm:p-8"
                      style={{ backgroundColor: colors.white, borderColor: colors.bgSurface, boxShadow: layout.cardShadow }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <h2 className="font-display text-xl font-semibold" style={{ fontFamily: fonts.display, color: colors.primaryDark }}>
                          Dernières commandes
                        </h2>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-sm flex items-center gap-1 font-medium transition-opacity hover:opacity-80"
                          style={{ fontFamily: fonts.body, color: colors.primaryLink }}
                        >
                          Voir tout
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      {orders.length === 0 ? (
                        <div className="text-center py-10 sm:py-12">
                          <Package className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 opacity-40" style={{ color: colors.primaryDark }} />
                          <p className="mb-4" style={{ fontFamily: fonts.body, color: colors.textGray }}>Aucune commande pour le moment</p>
                          <Link
                            href="/carte"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: colors.primaryDark, fontFamily: fonts.body }}
                          >
                            <ShoppingBag className="w-5 h-5" />
                            Voir la carte
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.slice(0, 3).map((order) => (
                            <div
                              key={order.id}
                              className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border transition-colors hover:bg-opacity-80"
                              style={{ backgroundColor: colors.bgCream, borderColor: colors.bgSurface }}
                            >
                              <div className="flex items-center gap-4">
                                <div className={getStatusColor(order.status)}>
                                  {getStatusIcon(order.status)}
                                </div>
                                <div>
                                  <p className="font-medium" style={{ fontFamily: fonts.body, color: colors.textDark }}>
                                    Commande #{order.order_number}
                                  </p>
                                  <p style={{ fontFamily: fonts.body, fontSize: fontSizes.bodySmall, color: colors.textGray }}>
                                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold" style={{ fontFamily: fonts.body, color: colors.primaryDark }}>
                                  {order.total_amount}€
                                </p>
                                <p className={`text-sm ${getStatusColor(order.status)}`} style={{ fontFamily: fonts.body }}>
                                  {getStatusLabel(order.status)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mes commandes */}
                {activeTab === 'orders' && (
                  <div
                    className="rounded-2xl border p-6 sm:p-8"
                    style={{ backgroundColor: colors.white, borderColor: colors.bgSurface, boxShadow: layout.cardShadow }}
                  >
                    <h2 className="font-display text-xl font-semibold mb-6" style={{ fontFamily: fonts.display, color: colors.primaryDark }}>
                      Mes commandes click & collect
                    </h2>
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-40" style={{ color: colors.primaryDark }} />
                        <p style={{ fontFamily: fonts.body, color: colors.textGray }}>Aucune commande</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="p-5 sm:p-6 rounded-xl border transition-colors"
                            style={{ backgroundColor: colors.bgCream, borderColor: colors.bgSurface }}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                              <div>
                                <h3 className="font-bold text-lg" style={{ fontFamily: fonts.body, color: colors.primaryDark }}>
                                  #{order.order_number}
                                </h3>
                                <p style={{ fontFamily: fonts.body, fontSize: fontSizes.bodySmall, color: colors.textGray }}>
                                  {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                              <span
                                className="px-4 py-2 rounded-full text-sm font-medium shrink-0"
                                style={{
                                  fontFamily: fonts.body,
                                  ...(order.status === 'completed' || order.status === 'delivered'
                                    ? { backgroundColor: colors.successBg, color: colors.success }
                                    : order.status === 'cancelled'
                                    ? { backgroundColor: '#FFEBEE', color: '#C62828' }
                                    : { backgroundColor: '#FFF8E1', color: '#F9A825' }),
                                }}
                              >
                                {getStatusLabel(order.status)}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div>
                                <p className="text-sm" style={{ fontFamily: fonts.body, color: colors.textGray }}>Montant total</p>
                                <p className="text-2xl font-bold" style={{ fontFamily: fonts.display, color: colors.primaryDark }}>
                                  {order.total_amount}€
                                </p>
                              </div>
                              <Link
                                href={`/orders/${order.id}`}
                                className="px-5 py-2.5 rounded-xl font-medium transition-opacity hover:opacity-90"
                                style={{ backgroundColor: colors.primaryLink, color: colors.white, fontFamily: fonts.body }}
                              >
                                Détails
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Autres tabs */}
                {activeTab === 'addresses' && (
                  <div
                    className="rounded-2xl border p-6 sm:p-8"
                    style={{ backgroundColor: colors.white, borderColor: colors.bgSurface, boxShadow: layout.cardShadow }}
                  >
                    <h2 className="font-display text-xl font-semibold mb-6" style={{ fontFamily: fonts.display, color: colors.primaryDark }}>
                      Mes adresses
                    </h2>
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 mx-auto mb-4 opacity-40" style={{ color: colors.primaryDark }} />
                      <p style={{ fontFamily: fonts.body, color: colors.textGray }}>Fonctionnalité en cours de développement</p>
                    </div>
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div
                    className="rounded-2xl border p-6 sm:p-8"
                    style={{ backgroundColor: colors.white, borderColor: colors.bgSurface, boxShadow: layout.cardShadow }}
                  >
                    <h2 className="font-display text-xl font-semibold mb-6" style={{ fontFamily: fonts.display, color: colors.primaryDark }}>
                      Mes favoris
                    </h2>
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 mx-auto mb-4 opacity-40" style={{ color: colors.accent }} />
                      <p style={{ fontFamily: fonts.body, color: colors.textGray }}>Aucun favori pour le moment</p>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <ProfileForm
                    user={user}
                    setUser={setUser}
                    updateUser={updateUser}
                    profileSaving={profileSaving}
                    setProfileSaving={setProfileSaving}
                    profilePhotoFile={profilePhotoFile}
                    setProfilePhotoFile={setProfilePhotoFile}
                    profilePhotoPreview={profilePhotoPreview}
                    setProfilePhotoPreview={setProfilePhotoPreview}
                    apiUrl={API_URL}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
