// frontend/pages/admin/users.js - Gestion des utilisateurs et rôle admin
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { Users, Search, Shield, User, Loader2 } from 'lucide-react';
import { checkAuth, getAdminHotelUsers, updateAdminUserRole } from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin/users');
        return;
      }
      setUser(authData.user);
      const data = await getAdminHotelUsers({ limit: 200 });
      setUsers(data.users || []);
    } catch (e) {
      toast.error('Erreur chargement utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      await updateAdminUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success('Rôle mis à jour');
    } catch (e) {
      toast.error(e?.message || 'Erreur');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter(u => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (u.email || '').toLowerCase().includes(q) ||
      (u.firstname || '').toLowerCase().includes(q) ||
      (u.lastname || '').toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar activeSection="users" />
        <div className="admin-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <Loader2 size={48} className="animate-spin" style={{ color: '#C9A96E' }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Head><title>Utilisateurs - Admin</title></Head>
      <div className="admin-layout">
        <AdminSidebar activeSection="users" />
        <div className="admin-main">
          <AdminHeader user={user} />
          <main className="admin-content">
            <div className="content-header">
              <h1>Utilisateurs</h1>
              <p>Gérez les rôles et désignez les administrateurs</p>
            </div>

            <div className="search-row">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {u.firstname?.[0]}{u.lastname?.[0]}
                          </div>
                          <span>{u.firstname} {u.lastname}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role === 'admin' && <Shield size={14} />}
                          {u.role === 'staff' && <User size={14} />}
                          {u.role || 'client'}
                        </span>
                      </td>
                      <td>
                        <div className="role-actions">
                          <select
                            value={u.role || 'client'}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={updatingId === u.id || u.id === user?.id}
                          >
                            <option value="client">Client</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                          </select>
                          {updatingId === u.id && <Loader2 size={16} className="animate-spin" />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="empty-state">
                <Users size={48} />
                <p>Aucun utilisateur trouvé</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <style jsx>{`
        .admin-layout { display: flex; min-height: 100vh; background: #1A1A1A; }
        .admin-main { flex: 1; margin-left: 280px; padding-top: 80px; }
        .admin-content { padding: 2rem; max-width: 1200px; }
        .content-header h1 { color: #FAFAF8; font-size: 1.75rem; margin-bottom: 0.5rem; }
        .content-header p { color: #8B8680; font-size: 0.95rem; }
        .search-row { margin: 1.5rem 0; }
        .search-box {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 1rem; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          max-width: 400px;
        }
        .search-box input { flex: 1; background: none; border: none; color: #FAFAF8; font-size: 0.95rem; }
        .search-box input::placeholder { color: #8B8680; }
        .users-table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); }
        .users-table { width: 100%; border-collapse: collapse; }
        .users-table th, .users-table td { padding: 1rem; text-align: left; }
        .users-table th { background: rgba(255,255,255,0.05); color: #8B8680; font-size: 0.8rem; text-transform: uppercase; }
        .users-table td { color: #FAFAF8; border-top: 1px solid rgba(255,255,255,0.05); }
        .user-cell { display: flex; align-items: center; gap: 0.75rem; }
        .user-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #C9A96E, #A68A5C);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 600; color: #1A1A1A;
        }
        .role-badge {
          display: inline-flex; align-items: center; gap: 0.35rem;
          padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600;
        }
        .role-badge.admin { background: rgba(201,169,110,0.2); color: #C9A96E; }
        .role-badge.staff { background: rgba(59,130,246,0.2); color: #60a5fa; }
        .role-badge.client { background: rgba(255,255,255,0.08); color: #B5B1AC; }
        .role-actions { display: flex; align-items: center; gap: 0.5rem; }
        .role-actions select {
          padding: 0.4rem 0.75rem; background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15); border-radius: 6px;
          color: #FAFAF8; font-size: 0.85rem; cursor: pointer;
        }
        .empty-state { text-align: center; padding: 4rem; color: #8B8680; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) { .admin-main { margin-left: 0; } }
      `}</style>
    </>
  );
}
