/**
 * Dashboard Admin E-commerce - Vue d'ensemble
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Package, ShoppingCart, DollarSign, Users, TrendingUp, 
  AlertCircle, CheckCircle, Clock, Loader2, RefreshCw 
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  user_email?: string;
  guest_email?: string;
}

export default function EcommerceDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const headers = getAuthHeaders();
    if (!headers.Authorization) {
      setLoading(false);
      setError('Session expirée. Reconnectez-vous.');
      return;
    }
    try {
      const [ordersRes, productsRes, productsAllRes, customersRes, dashboardRes] = await Promise.allSettled([
        axios.get(`${API_URL}/ecommerce/orders/admin/list?page=1&limit=10`, { headers, timeout: 10000 }),
        axios.get(`${API_URL}/products?page=1&limit=1&status=active`, { timeout: 10000 }),
        axios.get(`${API_URL}/products?page=1&limit=1&status=`, { timeout: 10000 }),
        axios.get(`${API_URL}/admin/customers?page=1&limit=1`, { headers, timeout: 10000 }),
        axios.get(`${API_URL}/admin/ecommerce/dashboard`, { headers, timeout: 10000 }),
      ]);

      const safeNum = (v: unknown): number => {
        if (v == null || v === '') return 0;
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      };

      const totalOrders =
        ordersRes.status === 'fulfilled' && ordersRes.value?.data?.pagination?.total != null
          ? safeNum(ordersRes.value.data.pagination.total)
          : dashboardRes.status === 'fulfilled' && dashboardRes.value?.data?.stats?.totalOrders != null
            ? safeNum(dashboardRes.value.data.stats.totalOrders)
            : 0;

      const ordersList =
        ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value?.data?.orders)
          ? ordersRes.value.data.orders
          : [];

      const activeProducts =
        productsRes.status === 'fulfilled' && productsRes.value?.data?.pagination?.total != null
          ? safeNum(productsRes.value.data.pagination.total)
          : dashboardRes.status === 'fulfilled' && dashboardRes.value?.data?.stats?.activeProducts != null
            ? safeNum(dashboardRes.value.data.stats.activeProducts)
            : 0;

      const totalProducts =
        productsAllRes.status === 'fulfilled' && productsAllRes.value?.data?.pagination?.total != null
          ? safeNum(productsAllRes.value.data.pagination.total)
          : dashboardRes.status === 'fulfilled' && dashboardRes.value?.data?.stats?.totalProducts != null
            ? safeNum(dashboardRes.value.data.stats.totalProducts)
            : activeProducts;

      const totalCustomers =
        customersRes.status === 'fulfilled' && customersRes.value?.data?.pagination?.total != null
          ? safeNum(customersRes.value.data.pagination.total)
          : dashboardRes.status === 'fulfilled' && dashboardRes.value?.data?.stats?.totalCustomers != null
            ? safeNum(dashboardRes.value.data.stats.totalCustomers)
            : 0;

      const dash =
        dashboardRes.status === 'fulfilled' && dashboardRes.value?.data?.success
          ? dashboardRes.value.data
          : null;

      setStats({
        totalOrders,
        totalRevenue: safeNum(dash?.stats?.totalRevenue),
        pendingOrders: safeNum(dash?.stats?.pendingOrders),
        completedOrders: safeNum(dash?.stats?.completedOrders),
        totalProducts,
        activeProducts,
        lowStockProducts: safeNum(dash?.stats?.lowStockProducts),
        totalCustomers,
        revenueGrowth: safeNum(dash?.stats?.revenueGrowth),
        ordersGrowth: safeNum(dash?.stats?.ordersGrowth),
      });

      setRecentOrders(
        ordersList.length > 0 ? ordersList : Array.isArray(dash?.recentOrders) ? dash.recentOrders : []
      );

      if (
        ordersRes.status === 'rejected' &&
        customersRes.status === 'rejected' &&
        productsRes.status === 'rejected' &&
        dashboardRes.status === 'rejected'
      ) {
        const first = [ordersRes, customersRes, productsRes, dashboardRes].find((r) => r.status === 'rejected');
        const status =
          first?.status === 'rejected' && 'reason' in first
            ? (first.reason as { response?: { status?: number } })?.response?.status
            : undefined;
        setError(status === 401 ? 'Session expirée. Reconnectez-vous.' : 'Impossible de charger les données.');
      }
    } catch (err: unknown) {
      console.error('Erreur chargement dashboard:', err);
      const status = err && typeof err === 'object' && 'response' in err ? (err as { response?: { status?: number } }).response?.status : undefined;
      setError(status === 401 ? 'Session expirée. Reconnectez-vous.' : 'Impossible de charger les données.');
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalProducts: 0,
        activeProducts: 0,
        lowStockProducts: 0,
        totalCustomers: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
      });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Commandes click & collect',
      value: loading ? '—' : (stats?.totalOrders ?? 0),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      growth: stats?.ordersGrowth,
    },
    {
      title: 'Chiffre d\'affaires',
      value: loading ? '—' : `${(stats?.totalRevenue ?? 0).toFixed(2)} €`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
      growth: stats?.revenueGrowth,
    },
    {
      title: 'Produits actifs',
      value: loading ? '—' : (stats?.activeProducts ?? 0),
      subtitle: loading ? '' : `sur ${stats?.totalProducts ?? 0} total`,
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Clients',
      value: loading ? '—' : (stats?.totalCustomers ?? 0),
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  const statusCards = [
    {
      title: 'À préparer',
      value: loading ? '—' : (stats?.pendingOrders ?? 0),
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Complétées',
      value: loading ? '—' : (stats?.completedOrders ?? 0),
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Stock faible',
      value: loading ? '—' : (stats?.lowStockProducts ?? 0),
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    const badges: Record<string, { label: string; className: string }> = {
      pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'En préparation', className: 'bg-blue-100 text-blue-800' },
      ready: { label: 'Prêt à retirer', className: 'bg-purple-100 text-purple-800' },
      shipped: { label: 'Prêt à retirer', className: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Récupérée', className: 'bg-green-100 text-green-800' },
      completed: { label: 'Récupérée', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-800' },
    };
    const badge = badges[s] || { label: status || '—', className: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>{badge.label}</span>;
  };

  const getPaymentBadge = (paymentStatus: string | undefined) => {
    const paid = (paymentStatus || '').toLowerCase() === 'paid';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${paid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {paid ? 'Payé' : 'En attente'}
      </span>
    );
  };

  return (
    <AdminLayout>
      <Head>
        <title>Kafé Stockholm — Admin (Carte & commandes)</title>
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header — format PC inchangé, mobile: compact */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-heading text-xl sm:text-2xl text-gray-900 flex items-center gap-2 truncate">
                  Kafé Stockholm — Admin
                  {loading && <Loader2 className="w-5 h-5 text-kafe-primary animate-spin shrink-0" />}
                </h1>
                <p className="text-small text-gray-900/60 mt-1">Gestion de la carte & commandes click & collect</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => fetchData()}
                  disabled={loading}
                  className="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-1"
                >
                  <RefreshCw className={`w-4 h-4 shrink-0 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
                <Link href="/admin/ecommerce/products" className="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition whitespace-nowrap">
                  Produits
                </Link>
                <Link href="/admin/ecommerce/orders" className="text-xs px-3 py-2 bg-kafe-primary text-white rounded-md hover:bg-gold/90 transition font-medium whitespace-nowrap">
                  Commandes
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {error && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
              <Link href="/login" className="ml-2 font-medium underline">Se connecter</Link>
            </div>
          )}
          {/* Stats principales — grille inchangée sur PC */}
          <section>
            <h2 className="font-heading text-xl text-gray-900 mb-4">Vue d'ensemble</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {statCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 backdrop-blur-xl rounded-refined p-4 sm:p-6 border border-gray-200 shadow-card hover:shadow-refined hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-refined ${card.bg}`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    {card.growth !== undefined && card.growth !== 0 && (
                      <div className={`flex items-center gap-1 text-xs font-medium ${card.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp className="w-3 h-3" />
                        {card.growth > 0 ? '+' : ''}{card.growth}%
                      </div>
                    )}
                  </div>
                  <p className="text-small text-gray-900/60 mb-1">{card.title}</p>
                  <p className="font-heading text-xl sm:text-2xl font-semibold text-gray-900">{card.value}</p>
                  {card.subtitle && <p className="text-xs text-gray-900/50 mt-1">{card.subtitle}</p>}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Stats statuts — grille inchangée sur PC */}
          <section>
            <h2 className="font-heading text-xl text-gray-900 mb-4">Statuts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {statusCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-gray-50 backdrop-blur-xl rounded-refined p-4 sm:p-6 border border-gray-200 shadow-card hover:shadow-refined hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-refined ${card.bg}`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-small text-gray-900/60">{card.title}</p>
                      <p className="font-heading text-xl sm:text-2xl font-semibold text-gray-900">{card.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Commandes récentes — table scroll horizontal sur mobile, inchangée sur PC */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h2 className="font-heading text-xl text-gray-900">Commandes récentes</h2>
              <Link href="/admin/ecommerce/products" className="text-small text-kafe-primary hover:text-kafe-primary/80 font-medium">
                Produits →
              </Link>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        N° Commande
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        Paiement
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-6 sm:px-6 sm:py-8 text-center text-gray-900/60">
                          <Loader2 className="w-6 h-6 animate-spin inline-block" /> Chargement...
                        </td>
                      </tr>
                    ) : recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-6 sm:px-6 sm:py-8 text-center text-gray-900/60">
                          Aucune commande récente
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <Link
                              href={`/admin/ecommerce/orders/${order.id}`}
                              className="text-small font-medium text-kafe-primary hover:text-kafe-primary/80"
                            >
                              {order.order_number || `#${order.id?.slice(0, 8)}`}
                            </Link>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-small text-gray-900">
                            {order.user_email || order.guest_email || '—'}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-small font-semibold text-gray-900">
                            {Number(order.total_amount ?? 0).toFixed(2)} €
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            {getPaymentBadge(order.payment_status)}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-small text-gray-900/60">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '—'}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <Link
                              href={`/admin/ecommerce/orders/${order.id}`}
                              className="text-small text-gray-900 hover:text-kafe-primary transition-colors"
                            >
                              Voir
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Actions rapides */}
          <section>
            <h2 className="font-heading text-xl text-gray-900 mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin/ecommerce/products/create"
                className="bg-gray-50 backdrop-blur-xl rounded-refined p-6 border border-gray-200 hover:border-kafe-primary hover:bg-gray-100 transition-all group"
              >
                <Package className="w-8 h-8 text-kafe-primary mb-3" />
                <h3 className="font-heading text-lg text-gray-900 mb-1 group-hover:text-kafe-primary transition-colors">
                  Créer un produit
                </h3>
                <p className="text-small text-gray-900/60">Ajouter un nouveau produit au catalogue</p>
              </Link>

              <Link
                href="/admin/ecommerce/orders?status=pending"
                className="bg-gray-50 backdrop-blur-xl rounded-refined p-6 border border-gray-200 hover:border-kafe-primary hover:bg-gray-100 transition-all group"
              >
                <Clock className="w-8 h-8 text-yellow-400 mb-3" />
                <h3 className="font-heading text-lg text-gray-900 mb-1 group-hover:text-kafe-primary transition-colors">
                  Commandes en attente
                </h3>
                <p className="text-small text-gray-900/60">Traiter les nouvelles commandes</p>
              </Link>

              <Link
                href="/admin/ecommerce/products?stock=low"
                className="bg-gray-50 backdrop-blur-xl rounded-refined p-6 border border-gray-200 hover:border-kafe-primary hover:bg-gray-100 transition-all group"
              >
                <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
                <h3 className="font-heading text-lg text-gray-900 mb-1 group-hover:text-kafe-primary transition-colors">
                  Stock faible
                </h3>
                <p className="text-small text-gray-900/60">Réapprovisionner les produits</p>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </AdminLayout>
  );
}
