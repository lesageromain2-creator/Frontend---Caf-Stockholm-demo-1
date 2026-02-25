/**
 * Page Admin - Gestion des commandes
 * /admin/ecommerce/orders
 * - Paniers en cours (temps réel) vs Commandes payées
 */

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ArrowLeft, ShoppingCart, Package, RefreshCw } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Order {
  id: string;
  order_number: string;
  guest_email: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at?: string;
  items_count: number;
}

interface ActiveCart {
  id: string;
  user_id: string | null;
  session_id: string | null;
  user_email: string | null;
  user_name: string | null;
  items_count: number;
  subtotal: string;
  created_at: string;
  updated_at: string;
}

function getAuthHeaders() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeCarts, setActiveCarts] = useState<ActiveCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartsLoading, setCartsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(pagination.page));
      params.set('limit', String(pagination.limit));
      if (statusFilter) params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      const res = await axios.get(
        `${API_URL}/ecommerce/orders/admin/list?${params.toString()}`,
        { headers: getAuthHeaders() }
      );
      if (res.data.success && res.data.orders) {
        setOrders(res.data.orders);
        setPagination((prev) => ({
          ...prev,
          total: res.data.pagination?.total ?? 0,
          pages: res.data.pagination?.pages ?? 1,
        }));
      } else {
        setOrders([]);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        toast.error('Accès non autorisé');
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors du chargement des commandes');
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, search]);

  const fetchActiveCarts = useCallback(async () => {
    setCartsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/cart/admin/active-carts`, {
        headers: getAuthHeaders(),
      });
      if (res.data.success && res.data.carts) {
        setActiveCarts(res.data.carts);
      } else {
        setActiveCarts([]);
      }
    } catch (error: any) {
      if (error.response?.status !== 403 && error.response?.status !== 401) {
        console.error('Error fetching active carts:', error);
      }
      setActiveCarts([]);
    } finally {
      setCartsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchActiveCarts();
    const interval = setInterval(fetchActiveCarts, 12000);
    return () => clearInterval(interval);
  }, [fetchActiveCarts]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.patch(
        `${API_URL}/ecommerce/orders/${orderId}/status`,
        { status: newStatus },
        { headers: getAuthHeaders() }
      );
      toast.success('Statut mis à jour');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-600',
      paid: 'text-green-600',
      failed: 'text-red-600',
      refunded: 'text-gray-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'processing', label: 'En traitement' },
    { value: 'shipped', label: 'Expédiée' },
    { value: 'delivered', label: 'Livrée' },
    { value: 'cancelled', label: 'Annulée' },
  ];

  return (
    <>
      <Head>
        <title>Gestion des commandes | Admin</title>
      </Head>

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href="/admin/ecommerce/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
            <p className="text-gray-600 mt-1">
              {activeCarts.length} panier(s) en cours · {pagination.total} commande(s) payée(s)
            </p>
          </div>

          {/* Paniers en cours (non payés) */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Paniers en cours</h2>
              <span className="text-sm text-gray-500">(clients en train de remplir leur panier)</span>
              <button
                type="button"
                onClick={() => { setCartsLoading(true); fetchActiveCarts(); }}
                className="ml-2 p-1.5 rounded-md hover:bg-gray-100"
                title="Rafraîchir"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${cartsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="bg-amber-50/50 border border-amber-200 rounded-lg overflow-hidden">
              {cartsLoading && activeCarts.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600 mx-auto" />
                </div>
              ) : activeCarts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aucun panier en cours pour le moment.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-amber-100/70 border-b border-amber-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase">Client / Session</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase">Articles</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase">Sous-total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase">Dernière MAJ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {activeCarts.map((cart) => (
                        <tr key={cart.id} className="hover:bg-amber-50/50">
                          <td className="px-4 py-3 text-sm">
                            {cart.user_email ? (
                              <span className="font-medium text-gray-900">{cart.user_email}</span>
                            ) : (
                              <span className="text-gray-500">Visiteur (session)</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{cart.items_count} article(s)</td>
                          <td className="px-4 py-3 text-sm font-medium">{Number(cart.subtotal).toFixed(2)} €</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(cart.updated_at).toLocaleString('fr-FR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* Commandes payées */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-6 h-6 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Commandes payées</h2>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Numéro de commande ou email..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous les statuts</option>
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500">Aucune commande trouvée</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <Link
                              href={`/admin/ecommerce/orders/${order.id}`}
                              className="font-medium text-blue-600 hover:text-blue-800"
                            >
                              {order.order_number}
                            </Link>
                            <p className="text-xs text-gray-500">{order.items_count} article(s)</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {order.guest_email || '—'}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {Number(order.total_amount).toFixed(2)} €
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} border-0 cursor-pointer`}
                            >
                              {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                              {order.payment_status === 'paid' ? 'Payé' : order.payment_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                            <br />
                            <span className="text-xs text-gray-400">
                              {new Date(order.created_at).toLocaleTimeString('fr-FR')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/admin/ecommerce/orders/${order.id}`}>
                              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                Détails →
                              </button>
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {pagination.pages > 1 && (
                <div className="px-6 py-3 border-t flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Page {pagination.page} / {pagination.pages} ({pagination.total} commandes)
                  </p>
                  <div className="flex gap-2">
                    <button
                      disabled={pagination.page <= 1}
                      onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <button
                      disabled={pagination.page >= pagination.pages}
                      onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
