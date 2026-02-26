/**
 * Page Admin - Gestion des produits
 * /admin/ecommerce/products
 * Affichage des images : même logique que la page /carte (image menu locale puis API).
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { getProductImageUrl } from '@/utils/productImageUrl';
import { getMenuImageForProduct } from '@/lib/menu-images';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  stock_quantity: number;
  status: string;
  category_name?: string;
  brand_name?: string;
  featured_image: string | null;
  images?: string[];
  sales_count: number;
  created_at: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchProducts();
  }, [search, statusFilter, pagination.page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: 'created_at',
        order: 'desc',
      });

      // Note: Cette route devra être créée en tant que route admin
      const response = await axios.get(`${API_URL}/products?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer "${name}" ?`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Produit supprimé');
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  return (
    <>
      <Head>
        <title>Gestion des produits | Admin</title>
      </Head>

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Header — mobile: colonne + bouton pleine largeur */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
            <div className="min-w-0">
              <Link
                href="/admin/ecommerce/dashboard"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium mb-2 sm:mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                Retour au dashboard
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Produits</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">{pagination.total} produit(s) au total</p>
            </div>
            <Link href="/admin/ecommerce/products/create" className="w-full md:w-auto">
              <button className="w-full md:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouveau produit
              </button>
            </Link>
          </div>

          {/* Filtres — mobile: pile verticale */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="draft">Brouillon</option>
                <option value="archived">Archivé</option>
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

          {/* Table des produits — scroll horizontal sur mobile */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <p className="text-gray-500 mb-4 text-sm sm:text-base">Aucun produit trouvé</p>
                <Link href="/admin/ecommerce/products/create">
                  <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                    Créer le premier produit
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <table className="w-full min-w-[720px]">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produit
                        </th>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ventes
                        </th>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <img
                                src={
                                  getProductImageUrl(product.featured_image || product.images?.[0]) ||
                                  getMenuImageForProduct(product.slug, product.name) ||
                                  'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect fill="#e5e7eb" width="48" height="48"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="18" font-family="sans-serif">' + (product.name.charAt(0) || '?') + '</text></svg>')
                                }
                                alt={product.name}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded border border-gray-200 bg-gray-100 flex-shrink-0"
                                onError={(e) => {
                                  const el = e.target as HTMLImageElement;
                                  if (!el.dataset.fallback) {
                                    el.dataset.fallback = '1';
                                    el.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect fill="#e5e7eb" width="48" height="48"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="18" font-family="sans-serif">' + (product.name.charAt(0) || '?') + '</text></svg>');
                                  }
                                }}
                              />
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{product.name}</p>
                                {product.category_name && (
                                  <p className="text-xs sm:text-sm text-gray-500 truncate">{product.category_name}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
                            {product.sku}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                            {product.price}€
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm">
                            <span className={`font-medium ${
                              product.stock_quantity === 0
                                ? 'text-red-600'
                                : product.stock_quantity < 10
                                ? 'text-orange-600'
                                : 'text-green-600'
                            }`}>
                              {product.stock_quantity}
                            </span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
                            {product.sales_count}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-right">
                            <div className="flex justify-end gap-1 sm:gap-2">
                              <Link href={`/carte/${product.slug}`} target="_blank" title="Voir sur la carte">
                                <button className="text-gray-600 hover:text-blue-600 transition-colors p-1 sm:p-0">
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                              </Link>
                              <button
                                onClick={() => router.push(`/admin/ecommerce/products/${product.id}/edit`)}
                                className="text-gray-600 hover:text-blue-600 transition-colors p-1 sm:p-0"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="text-gray-600 hover:text-red-600 transition-colors p-1 sm:p-0"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination — mobile: empilée */}
                {pagination.pages > 1 && (
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                      Page {pagination.page} sur {pagination.pages}
                    </div>
                    <div className="flex gap-2 justify-center sm:justify-end">
                      <button
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Précédent
                      </button>
                      <button
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.pages}
                        className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
