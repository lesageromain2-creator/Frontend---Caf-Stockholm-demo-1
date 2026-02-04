// frontend/pages/admin/menus.js - Menus gastronomiques hebdomadaires
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { UtensilsCrossed, Coffee, Sun, Moon, Loader2 } from 'lucide-react';
import { checkAuth, getAdminWeeklyMenus, createAdminWeeklyMenu, updateAdminWeeklyMenu } from '../../utils/api';
import { toast } from 'react-toastify';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const MEAL_TYPES = [
  { id: 'breakfast', label: 'Petit-déjeuner', icon: Coffee },
  { id: 'lunch', label: 'Déjeuner', icon: Sun },
  { id: 'dinner', label: 'Dîner', icon: Moon },
];

function getWeekStart(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff)).toISOString().slice(0, 10);
}

export default function AdminMenus() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [editing, setEditing] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadMenus();
  }, [weekStart]);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin/menus');
        return;
      }
      setUser(authData.user);
      const data = await getAdminWeeklyMenus({ week_start: weekStart });
      setMenus(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error('Erreur chargement menus');
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const getMenuFor = (dayIndex, mealType) => {
    return menus.find(m => m.day_of_week === dayIndex && m.meal_type === mealType);
  };

  const handleSave = async (dayIndex, mealType) => {
    const existing = getMenuFor(dayIndex, mealType);
    try {
      if (existing) {
        await updateAdminWeeklyMenu(existing.id, { composition: editContent });
        setMenus(prev => prev.map(m => m.id === existing.id ? { ...m, composition: editContent } : m));
      } else {
        const created = await createAdminWeeklyMenu({
          week_start_date: weekStart,
          meal_type: mealType,
          day_of_week: dayIndex,
          composition: editContent,
        });
        setMenus(prev => [...prev, created]);
      }
      setEditing(null);
      setEditContent('');
      toast.success('Menu enregistré');
    } catch (e) {
      toast.error(e?.message || 'Erreur');
    }
  };

  if (loading && menus.length === 0) {
    return (
      <div className="admin-layout">
        <AdminSidebar activeSection="menus" />
        <div className="admin-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <Loader2 size={48} className="animate-spin" style={{ color: '#C9A96E' }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Head><title>Menus - Admin</title></Head>
      <div className="admin-layout">
        <AdminSidebar activeSection="menus" />
        <div className="admin-main">
          <AdminHeader user={user} />
          <main className="admin-content">
            <div className="content-header">
              <h1>Menus gastronomiques</h1>
              <p>Composez les menus petit-déjeuner, déjeuner et dîner pour chaque jour de la semaine</p>
            </div>

            <div className="week-selector">
              <label>Semaine du</label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
              />
            </div>

            <div className="menus-grid">
              {DAYS.map((dayName, dayIndex) => (
                <div key={dayIndex} className="day-column">
                  <h3 className="day-title">{dayName}</h3>
                  {MEAL_TYPES.map(({ id, label, icon: Icon }) => {
                    const menu = getMenuFor(dayIndex, id);
                    const isEditing = editing === `${dayIndex}-${id}`;
                    return (
                      <div key={id} className="meal-card">
                        <div className="meal-header">
                          <Icon size={16} />
                          <span>{label}</span>
                        </div>
                        {isEditing ? (
                          <div className="meal-edit">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              placeholder="Composition du menu..."
                              rows={4}
                            />
                            <div className="meal-actions">
                              <button onClick={() => handleSave(dayIndex, id)}>Enregistrer</button>
                              <button onClick={() => { setEditing(null); setEditContent(''); }}>Annuler</button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="meal-content"
                            onClick={() => {
                              setEditing(`${dayIndex}-${id}`);
                              setEditContent(menu?.composition || '');
                            }}
                          >
                            {menu?.composition ? (
                              <p className="meal-preview">{menu.composition}</p>
                            ) : (
                              <p className="meal-empty">Cliquez pour ajouter</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      <style jsx>{`
        .admin-layout { display: flex; min-height: 100vh; background: #1A1A1A; }
        .admin-main { flex: 1; margin-left: 280px; padding-top: 80px; }
        .admin-content { padding: 2rem; overflow-x: auto; }
        .content-header h1 { color: #FAFAF8; font-size: 1.75rem; margin-bottom: 0.5rem; }
        .content-header p { color: #8B8680; font-size: 0.95rem; }
        .week-selector { margin: 1.5rem 0; display: flex; align-items: center; gap: 0.75rem; }
        .week-selector label { color: #8B8680; font-size: 0.9rem; }
        .week-selector input { padding: 0.5rem 1rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #FAFAF8; }
        .menus-grid { display: grid; grid-template-columns: repeat(7, minmax(200px, 1fr)); gap: 1rem; }
        .day-column { display: flex; flex-direction: column; gap: 1rem; }
        .day-title { color: #C9A96E; font-size: 1rem; margin: 0 0 0.5rem 0; }
        .meal-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(201,169,110,0.15);
          border-radius: 10px; padding: 1rem; min-height: 140px;
        }
        .meal-header { display: flex; align-items: center; gap: 0.5rem; color: #8B8680; font-size: 0.8rem; margin-bottom: 0.5rem; }
        .meal-content { cursor: pointer; min-height: 80px; }
        .meal-preview { font-size: 0.85rem; color: #B5B1AC; line-height: 1.4; margin: 0; white-space: pre-wrap; }
        .meal-empty { font-size: 0.85rem; color: #5D5A56; font-style: italic; margin: 0; }
        .meal-edit textarea { width: 100%; padding: 0.5rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #FAFAF8; font-size: 0.85rem; resize: vertical; }
        .meal-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
        .meal-actions button { padding: 0.4rem 0.75rem; font-size: 0.8rem; border-radius: 6px; cursor: pointer; }
        .meal-actions button:first-child { background: #C9A96E; color: #1A1A1A; border: none; }
        .meal-actions button:last-child { background: transparent; color: #8B8680; border: 1px solid rgba(255,255,255,0.2); }
        @media (max-width: 1200px) {
          .menus-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 768px) {
          .menus-grid { grid-template-columns: 1fr; }
          .admin-main { margin-left: 0; }
        }
      `}</style>
    </>
  );
}
