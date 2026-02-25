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
  AlertCircle, CheckCircle, Clock, XCircle, Loader2 
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const res = await axios.get(`${API_URL}/admin/ecommerce/dashboard`, { headers, timeout: 10000 });
      if (res.data?.success) {
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders || []);
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      setStats(null);
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
    const badges: Record<string, { label: string; className: string }> = {
      pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'En préparation', className: 'bg-blue-100 text-blue-800' },
      ready: { label: 'Prêt à retirer', className: 'bg-purple-100 text-purple-800' },
      shipped: { label: 'Prêt à retirer', className: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Récupérée', className: 'bg-green-100 text-green-800' },
      completed: { label: 'Récupérée', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-800' },
    };
    const badge = badges[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 rounded-capsule text-xs font-medium ${badge.className}`}>{badge.label}</span>;
  };

  return (
    <AdminLayout>
      <Head>
        <title>Kafé Stockholm — Admin (Carte & commandes)</title>
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-2xl text-gray-900 flex items-center gap-2">
                  Kafé Stockholm — Admin
                  {loading && <Loader2 className="w-5 h-5 text-kafe-primary animate-spin" />}
                </h1>
                <p className="text-small text-gray-900/60 mt-1">Gestion de la carte & commandes click & collect</p>
              </div>
              <div className="flex gap-3">
                <Link href="/admin/ecommerce/products" className="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
                  La carte
                </Link>
                <Link href="/admin/ecommerce/orders" className="text-xs px-3 py-2 bg-kafe-primary text-white rounded-md hover:bg-gold/90 transition font-medium">
                  Commandes
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Stats principales */}
          <section>
            <h2 className="font-heading text-xl text-gray-900 mb-4">Vue d'ensemble</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 backdrop-blur-xl rounded-refined p-6 border border-gray-200 shadow-card hover:shadow-refined hover:bg-gray-100 transition-all"
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
                  <p className="font-heading text-2xl font-semibold text-gray-900">{card.value}</p>
                  {card.subtitle && <p className="text-xs text-gray-900/50 mt-1">{card.subtitle}</p>}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Stats statuts */}
          <section>
            <h2 className="font-heading text-xl text-gray-900 mb-4">Statuts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statusCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-gray-50 backdrop-blur-xl rounded-refined p-6 border border-gray-200 shadow-card hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-refined ${card.bg}`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-small text-gray-900/60">{card.title}</p>
                      <p className="font-heading text-2xl font-semibold text-gray-900">{card.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Commandes récentes */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl text-gray-900">Commandes récentes</h2>
              <Link href="/admin/ecommerce/orders" className="text-small text-kafe-primary hover:text-kafe-primary/80 font-medium">
                Voir tout →
              </Link>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        N° Commande
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        Paiement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-900/60">
                          <Loader2 className="w-6 h-6 animate-spin inline-block" /> Chargement...
                        </td>
                      </tr>
                    ) : recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-900/60">
                          Aucune commande récente
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <Link 
                              href={`/admin/ecommerce/orders/${order.id}`}
                              className="text-small font-medium text-kafe-primary hover:text-kafe-primary/80"
                            >
                              {order.order_number}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-small text-gray-900">
                            {order.user_email || order.guest_email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-small font-semibold text-gray-900">
                            {Number(order.total_amount).toFixed(2)} €
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-capsule text-xs font-medium ${
                              order.payment_status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-small text-gray-900/60">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4">
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
