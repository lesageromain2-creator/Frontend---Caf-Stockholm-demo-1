/**
 * Page Admin - Gestion de l'inventaire
 * /admin/inventory
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  Package, AlertTriangle, TrendingDown, DollarSign,
  Search, Filter, Download, Upload, Plus, Minus, Edit2
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getProductImageUrl } from '@/utils/productImageUrl';
import { getMenuImageForProduct } from '@/lib/menu-images';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface InventoryStats {
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalProducts: number;
}

interface Product {
  id: string;
  name: string;
  slug?: string;
  sku: string;
  stock_quantity: number;
  low_stock_threshold: number;
  price: number;
  category_name?: string;
  brand_name?: string;
  featured_image: string | null;
  images?: string[];
}

interface InventoryMovement {
  id: string;
  product_name: string;
  variant_name?: string;
  type: string;
  quantity: number;
  reference?: string;
  note?: string;
  admin_name?: string;
  created_at: string;
}

export default function InventoryPage() {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentMovements, setRecentMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'movements' | 'adjust'>('overview');
  
  // Pour l'ajustement de stock
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState(0);
  const [adjustType, setAdjustType] = useState('adjustment');
  const [adjustNote, setAdjustNote] = useState('');
  const [adjustReference, setAdjustReference] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [statsRes, lowStockRes, movementsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/inventory/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/inventory/low-stock?limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/inventory/movements?limit=20`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (lowStockRes.data.success) setLowStockProducts(lowStockRes.data.products);
      if (movementsRes.data.success) setRecentMovements(movementsRes.data.movements);
    } catch (error) {
      console.error('Erreur chargement inventaire:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async () => {
    if (!adjustProduct || adjustQuantity === 0) {
      toast.error('Veuillez sélectionner un produit et entrer une quantité');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/admin/inventory/adjust`,
        {
          productId: adjustProduct.id,
          quantity: adjustQuantity,
          type: adjustType,
          note: adjustNote,
          reference: adjustReference,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Stock ajusté avec succès');
      setAdjustProduct(null);
      setAdjustQuantity(0);
      setAdjustNote('');
      setAdjustReference('');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajustement');
    }
  };

  const getMovementBadge = (type: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      sale: { label: 'Vente', className: 'bg-blue-100 text-blue-800' },
      restock: { label: 'Réappro', className: 'bg-green-100 text-green-800' },
      adjustment: { label: 'Ajustement', className: 'bg-purple-100 text-purple-800' },
      return: { label: 'Retour', className: 'bg-yellow-100 text-yellow-800' },
      damaged: { label: 'Endommagé', className: 'bg-red-100 text-red-800' },
      lost: { label: 'Perdu', className: 'bg-gray-100 text-gray-800' },
    };
    const badge = badges[type] || { label: type, className: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  /** URL d'image : image menu locale (comme /carte) puis API, sinon placeholder */
  const getProductImageSrc = (p: Product) => {
    const menuImg = getMenuImageForProduct(p.slug ?? p.sku, p.name);
    const apiImg = getProductImageUrl(p.featured_image || p.images?.[0]);
    return menuImg || apiImg || 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect fill="#e5e7eb" width="48" height="48"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="18" font-family="sans-serif">?</text></svg>');
  };

  const statCards = [
    {
      title: 'Valeur totale',
      value: `${(stats?.totalValue || 0).toFixed(2)} €`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Produits',
      value: stats?.totalProducts || 0,
      subtitle: 'Total en stock',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Stock faible',
      value: stats?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Rupture',
      value: stats?.outOfStockCount || 0,
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Inventaire | Admin</title>
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-2xl text-gray-900">Gestion de l'inventaire</h1>
                <p className="text-small text-gray-900/60 mt-1">Suivi du stock et mouvements</p>
              </div>
              <div className="flex gap-3">
                <button className="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
                <button className="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Importer
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Stats */}
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
                  </div>
                  <p className="text-small text-gray-900/60 mb-1">{card.title}</p>
                  <p className="font-heading text-2xl font-semibold text-gray-900">{card.value}</p>
                  {card.subtitle && <p className="text-xs text-gray-900/50 mt-1">{card.subtitle}</p>}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-kafe-primary text-kafe-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab('movements')}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === 'movements'
                    ? 'border-kafe-primary text-kafe-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Mouvements
              </button>
              <button
                onClick={() => setActiveTab('adjust')}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === 'adjust'
                    ? 'border-kafe-primary text-kafe-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Ajuster le stock
              </button>
            </div>
          </div>

          {/* Contenu selon tab */}
          {activeTab === 'overview' && (
            <section>
              <h2 className="font-heading text-xl text-gray-900 mb-4">Produits à faible stock</h2>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">Produit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">Seuil</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">Valeur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            Chargement...
                          </td>
                        </tr>
                      ) : lowStockProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            Aucun produit en stock faible
                          </td>
                        </tr>
                      ) : (
                        lowStockProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={getProductImageSrc(product)}
                                alt={product.name}
                                className="w-12 h-12 rounded-md object-cover bg-gray-100 border border-gray-200 flex-shrink-0"
                                onError={(e) => {
                                  const el = e.target as HTMLImageElement;
                                  if (!el.dataset.fallback) {
                                    el.dataset.fallback = '1';
                                    el.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect fill="#e5e7eb" width="48" height="48"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="18" font-family="sans-serif">' + (product.name.charAt(0) || '?') + '</text></svg>');
                                  }
                                }}
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.category_name || 'Sans catégorie'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{product.sku}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              product.stock_quantity === 0
                                ? 'bg-red-100 text-red-800'
                                : product.stock_quantity <= product.low_stock_threshold
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {product.stock_quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{product.low_stock_threshold}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {(product.price * product.stock_quantity).toFixed(2)} €
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setAdjustProduct(product);
                                setActiveTab('adjust');
                              }}
                              className="text-kafe-primary hover:text-kafe-primary/80 text-xs flex items-center gap-1 font-medium"
                            >
                              <Edit2 className="w-3 h-3" />
                              Ajuster
                            </button>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'movements' && (
            <section>
              <h2 className="font-heading text-xl text-gray-900 mb-4">Mouvements récents</h2>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">Produit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">Quantité</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">Référence</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-900/70 uppercase tracking-wider">Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            Chargement...
                          </td>
                        </tr>
                      ) : recentMovements.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            Aucun mouvement récent
                          </td>
                        </tr>
                      ) : (
                        recentMovements.map((movement) => (
                        <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(movement.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {movement.product_name}
                            {movement.variant_name && (
                              <span className="text-gray-500"> - {movement.variant_name}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">{getMovementBadge(movement.type)}</td>
                          <td className="px-6 py-4">
                            <span className={`font-medium ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{movement.reference || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{movement.admin_name || 'Système'}</td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'adjust' && (
            <section>
              <h2 className="font-heading text-xl text-gray-900 mb-4">Ajuster le stock</h2>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-2xl">
                <div className="space-y-4">
                  {adjustProduct ? (
                    <div className="bg-gray-50 rounded-md p-4 flex items-center justify-between border border-gray-200">
                      <div className="flex items-center gap-3">
                        <img
                          src={adjustProduct ? getProductImageSrc(adjustProduct) : ''}
                          alt={adjustProduct?.name ?? ''}
                          className="w-14 h-14 rounded-md object-cover bg-gray-100 border border-gray-200 flex-shrink-0"
                          onError={(e) => {
                            const el = e.target as HTMLImageElement;
                            if (!el.dataset.fallback && adjustProduct) {
                              el.dataset.fallback = '1';
                              el.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><rect fill="#e5e7eb" width="56" height="56"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="20" font-family="sans-serif">' + (adjustProduct.name.charAt(0) || '?') + '</text></svg>');
                            }
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{adjustProduct.name}</p>
                          <p className="text-xs text-gray-500">Stock actuel: {adjustProduct.stock_quantity}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setAdjustProduct(null)}
                        className="text-gray-500 hover:text-gray-900 text-xs font-medium"
                      >
                        Changer
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Rechercher un produit</label>
                      <input
                        type="text"
                        placeholder="Rechercher par nom ou SKU..."
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kafe-primary focus:border-transparent"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Type d'ajustement</label>
                    <select
                      value={adjustType}
                      onChange={(e) => setAdjustType(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-kafe-primary focus:border-transparent"
                    >
                      <option value="adjustment">Ajustement</option>
                      <option value="restock">Réapprovisionnement</option>
                      <option value="damaged">Produit endommagé</option>
                      <option value="lost">Produit perdu</option>
                      <option value="return">Retour client</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Quantité</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setAdjustQuantity(Math.max(adjustQuantity - 1, -999))}
                        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition border border-gray-200"
                      >
                        <Minus className="w-5 h-5 text-gray-700" />
                      </button>
                      <input
                        type="number"
                        value={adjustQuantity}
                        onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 0)}
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-kafe-primary focus:border-transparent"
                      />
                      <button
                        onClick={() => setAdjustQuantity(adjustQuantity + 1)}
                        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition border border-gray-200"
                      >
                        <Plus className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Utilisez des nombres négatifs pour réduire le stock
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Référence (optionnel)</label>
                    <input
                      type="text"
                      value={adjustReference}
                      onChange={(e) => setAdjustReference(e.target.value)}
                      placeholder="N° bon de livraison, facture..."
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kafe-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Note (optionnel)</label>
                    <textarea
                      value={adjustNote}
                      onChange={(e) => setAdjustNote(e.target.value)}
                      placeholder="Raison de l'ajustement..."
                      rows={3}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kafe-primary focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleAdjustStock}
                    disabled={!adjustProduct || adjustQuantity === 0}
                    className="w-full py-3 bg-kafe-primary text-white rounded-md font-medium hover:bg-kafe-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmer l'ajustement
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </AdminLayout>
  );
}
