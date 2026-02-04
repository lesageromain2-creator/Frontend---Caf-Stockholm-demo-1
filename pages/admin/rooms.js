// frontend/pages/admin/rooms.js - Gestion des chambres et disponibilité
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { Bed, Edit2, Plus, Trash2, Loader2 } from 'lucide-react';
import { checkAuth, getAdminRoomsAvailability, updateAdminRoomType, addAdminRoom } from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminRooms() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState([]);
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [addingRoom, setAddingRoom] = useState(null);
  const [newRoomNumber, setNewRoomNumber] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin/rooms');
        return;
      }
      setUser(authData.user);
      const data = await getAdminRoomsAvailability();
      setRoomTypes(data.room_types || []);
    } catch (e) {
      toast.error('Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrice = async (rt) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      toast.error('Prix invalide');
      return;
    }
    try {
      await updateAdminRoomType(rt.id, { base_price_per_night: price });
      setRoomTypes(prev => prev.map(r => r.id === rt.id ? { ...r, base_price_per_night: price } : r));
      setEditingPrice(null);
      setNewPrice('');
      toast.success('Prix mis à jour');
    } catch (e) {
      toast.error(e?.message || 'Erreur');
    }
  };

  const handleAddRoom = async (rt) => {
    const num = newRoomNumber.trim();
    if (!num) {
      toast.error('Numéro de chambre requis');
      return;
    }
    try {
      await addAdminRoom({ room_type_id: rt.id, room_number: num });
      setAddingRoom(null);
      setNewRoomNumber('');
      await loadData();
      toast.success('Chambre ajoutée');
    } catch (e) {
      toast.error(e?.message || 'Erreur');
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar activeSection="rooms" />
        <div className="admin-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <Loader2 size={48} className="animate-spin" style={{ color: '#C9A96E' }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Head><title>Chambres - Admin</title></Head>
      <div className="admin-layout">
        <AdminSidebar activeSection="rooms" />
        <div className="admin-main">
          <AdminHeader user={user} />
          <main className="admin-content">
            <div className="content-header">
              <h1>Gestion des chambres</h1>
              <p>Visualisez la disponibilité et modifiez les prix par type de chambre</p>
            </div>

            <div className="rooms-grid">
              {roomTypes.map((rt) => (
                <div key={rt.id} className="room-card">
                  <div className="room-card-header">
                    <h3>{rt.name}</h3>
                    <span className="room-price">
                      {editingPrice === rt.id ? (
                        <div className="price-edit">
                          <input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder={String(rt.base_price_per_night)}
                            min="0"
                            step="0.01"
                          />
                          <button onClick={() => handleUpdatePrice(rt)}>OK</button>
                          <button onClick={() => { setEditingPrice(null); setNewPrice(''); }}>Annuler</button>
                        </div>
                      ) : (
                        <>
                          {Number(rt.base_price_per_night).toFixed(2)} € / nuit
                          <button className="btn-edit" onClick={() => { setEditingPrice(rt.id); setNewPrice(rt.base_price_per_night); }}><Edit2 size={14} /></button>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="room-bar-wrap">
                    <div className="room-bar">
                      <div
                        className="room-bar-fill"
                        style={{ width: `${rt.total_rooms ? (rt.available / rt.total_rooms) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="room-meta">
                      <span>{rt.available} disponibles</span>
                      <span>{rt.reserved} réservées</span>
                      <span>{rt.total_rooms} total</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {roomTypes.length === 0 && (
              <div className="empty-state">
                <Bed size={48} />
                <p>Aucun type de chambre configuré</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <style jsx>{`
        .admin-layout { display: flex; min-height: 100vh; background: #1A1A1A; }
        .admin-main { flex: 1; margin-left: 280px; padding-top: 80px; }
        .admin-content { padding: 2rem; max-width: 1000px; }
        .content-header h1 { color: #FAFAF8; font-size: 1.75rem; margin-bottom: 0.5rem; }
        .content-header p { color: #8B8680; font-size: 0.95rem; }
        .rooms-grid { display: flex; flex-direction: column; gap: 1.5rem; }
        .room-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(201,169,110,0.2);
          border-radius: 12px; padding: 1.5rem;
        }
        .room-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .room-card-header h3 { color: #FAFAF8; font-size: 1.1rem; margin: 0; }
        .room-price { color: #C9A96E; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; }
        .btn-edit { background: none; border: none; color: #8B8680; cursor: pointer; padding: 0.25rem; }
        .btn-edit:hover { color: #C9A96E; }
        .price-edit { display: flex; gap: 0.5rem; align-items: center; }
        .price-edit input { width: 80px; padding: 0.35rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: #FAFAF8; }
        .price-edit button { padding: 0.35rem 0.6rem; background: #C9A96E; border: none; border-radius: 6px; color: #1A1A1A; font-size: 0.8rem; cursor: pointer; }
        .room-bar { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
        .room-bar-fill { height: 100%; background: linear-gradient(90deg, #C9A96E, #D4BC8E); transition: width 0.3s; }
        .room-meta { display: flex; gap: 1.5rem; margin-top: 0.5rem; font-size: 0.8rem; color: #8B8680; }
        .empty-state { text-align: center; padding: 4rem; color: #8B8680; }
        @media (max-width: 1024px) { .admin-main { margin-left: 0; } }
      `}</style>
    </>
  );
}
