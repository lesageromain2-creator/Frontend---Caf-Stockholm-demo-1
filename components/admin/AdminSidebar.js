// frontend/components/admin/AdminSidebar.js
import { useRouter } from 'next/router';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Warehouse, 
  DollarSign, 
  BarChart3,
  Users, 
  Calendar,
  MessageSquare,
  Tag,
  Star,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';

export default function AdminSidebar({ activeSection, onNavigate, notifications = {}, isOpen = false }) {
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/ecommerce/dashboard' },
    { id: 'products', label: 'Produits', icon: Package, path: '/admin/ecommerce/products' },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart, path: '/admin/ecommerce/orders', badge: notifications.orders },
    { id: 'inventory', label: 'Inventaire', icon: Warehouse, path: '/admin/inventory' },
    { id: 'finances', label: 'Finances', icon: DollarSign, path: '/admin/finances' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'customers', label: 'Clients', icon: Users, path: '/admin/customers' },
    { id: 'appointments', label: 'Rendez-vous', icon: Calendar, path: '/admin/demo-info', badge: notifications.appointments },
    { id: 'support', label: 'Support', icon: MessageSquare, path: '/admin/demo-info', badge: notifications.support },
    { id: 'marketing', label: 'Marketing', icon: Tag, path: '/admin/demo-info' },
    { id: 'reviews', label: 'Avis', icon: Star, path: '/admin/demo-info', badge: notifications.reviews },
    { id: 'content', label: 'Contenu', icon: FileText, path: '/admin/demo-info' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/admin/demo-info' },
  ];

  const handleLogout = async () => {
    try {
      const { logout } = await import('../../utils/api');
      await logout();
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <Image src="/images/logo.png" alt="Kafé Stockholm" width={40} height={40} className="logo-img" />
          </div>
          <span className="logo-text">Kafé Stockholm</span>
        </div>
        <span className="admin-badge">Admin</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id || router.pathname === item.path;
          
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                router.push(item.path);
                if (onNavigate) onNavigate(item.id);
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}

        <div className="nav-divider"></div>

        <button className="nav-item logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </nav>

      <style jsx>{`
        .admin-sidebar {
          width: 280px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          z-index: 100;
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #fff;
          border: 1px solid #e5e7eb;
        }

        .logo-icon :global(.logo-img) {
          object-fit: contain;
          width: 100%;
          height: 100%;
        }

        .logo-text {
          color: #1f2937;
          font-weight: 700;
          font-size: 16px;
        }

        .admin-badge {
          padding: 4px 12px;
          background: #FEF3C7;
          color: #B45309;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
          position: relative;
          color: #4b5563;
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 60%;
          border-radius: 0 4px 4px 0;
        }

        .nav-badge {
          margin-left: auto;
          background: #DC2626;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
          min-width: 20px;
          text-align: center;
        }

        .nav-divider {
          height: 1px;
          margin: 12px 0;
          background: #e5e7eb;
        }

        .nav-item:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .nav-item.active {
          background: #EFF6FF;
          color: #1A4A8A;
        }

        .nav-item.active::before {
          background: #1A4A8A;
        }

        .nav-item.logout {
          color: #B45309;
          margin-top: auto;
        }

        .nav-item.logout:hover {
          background: #FEF3C7;
        }

        .nav-divider {
          background: #e5e7eb;
        }

        @media (max-width: 1024px) {
          .admin-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
}
