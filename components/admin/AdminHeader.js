// frontend/components/admin/AdminHeader.js - Kafé Stockholm Admin
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, User, ChevronDown, Settings, LogOut, Menu } from 'lucide-react';
import { useRouter } from 'next/router';
import { logout } from '../../utils/api';
import { toast } from 'react-toastify';
import { SITE } from '../../lib/site-config';

const CLIENT_NAV = [
  { label: 'Accueil', href: '/' },
  ...SITE.navNous,
  { label: 'La carte', href: '/carte' },
];

export default function AdminHeader({ user, onMenuClick }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Polling pour notifications (toutes les 30s)
    const interval = setInterval(async () => {
      // TODO: Implémenter récupération notifications
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  };

  const handleLogout = async () => {
    try {
      toast.info('Déconnexion...');
      await logout();
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <header className="admin-header">
      <div className="header-content">
        {onMenuClick && (
          <button
            type="button"
            className="menu-toggle"
            onClick={onMenuClick}
            aria-label="Ouvrir le menu"
          >
            <Menu size={24} />
          </button>
        )}
        <nav className="client-nav" aria-label="Pages côté client">
          <span className="client-nav-label">Voir le site :</span>
          {CLIENT_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="client-nav-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="notifications-container">
            <Link
              href="/admin/demo-info"
              className="icon-button"
              aria-label="Notifications et informations"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </Link>
          </div>

          <div className="profile-container">
            <button
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-avatar">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" />
                ) : (
                  <span>{getInitials(user?.firstname, user?.lastname)}</span>
                )}
              </div>
              <div className="profile-info">
                <span className="profile-name">{user?.firstname} {user?.lastname}</span>
                <span className="profile-role">Administrateur</span>
              </div>
              <ChevronDown size={16} />
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={() => { setShowProfileMenu(false); router.push('/admin/ecommerce/dashboard'); }}>
                  <User size={16} />
                  <span>Mon profil</span>
                </div>
                <div className="dropdown-item" onClick={() => { setShowProfileMenu(false); router.push('/admin/demo-info'); }}>
                  <Settings size={16} />
                  <span>Paramètres</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-header {
          position: fixed;
          top: 0;
          left: 280px;
          right: 0;
          height: 80px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          z-index: 90;
          padding: 0 32px;
        }

        .header-content {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .menu-toggle {
          display: none;
        }

        .quick-access,
        .client-nav {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .client-nav-label {
          font-size: 12px;
          color: #64748b;
          margin-right: 6px;
          white-space: nowrap;
          font-weight: 500;
        }

        .client-nav-link {
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          text-decoration: none;
          border-radius: 8px;
          white-space: nowrap;
          transition: all 0.3s ease-out;
          letter-spacing: 0.02em;
        }

        .client-nav-link:hover {
          color: #1A4A8A;
          opacity: 1;
          transform: scale(1.05) translateY(-2px);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-button {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .icon-button:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #DC2626;
          color: white;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 10px;
          font-weight: 700;
          min-width: 18px;
          text-align: center;
        }

        .notifications-container {
          position: relative;
        }

        .notifications-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 360px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          overflow: hidden;
        }

        .dropdown-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .dropdown-header h3 {
          color: #1f2937;
          font-size: 16px;
          font-weight: 700;
        }

        .empty-notifications {
          padding: 40px 20px;
          text-align: center;
          color: #6b7280;
        }

        .notification-item {
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.2s;
        }

        .notification-item:hover {
          background: #f9fafb;
        }

        .notification-text {
          color: #1f2937;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .notification-time {
          color: #6b7280;
          font-size: 12px;
        }

        .notifications-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .profile-container {
          position: relative;
        }

        .profile-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .profile-button:hover {
          background: #f3f4f6;
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1A4A8A, #2E6DB4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: #fff;
          flex-shrink: 0;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          object-fit: cover;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .profile-name {
          color: #1f2937;
          font-size: 14px;
          font-weight: 600;
        }

        .profile-role {
          color: #6b7280;
          font-size: 12px;
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 200px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          overflow: hidden;
        }

        .dropdown-item {
          padding: 12px 16px;
          color: #1f2937;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dropdown-item:hover {
          background: #f9fafb;
        }

        .dropdown-item.danger {
          color: #B45309;
        }

        .dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 4px 0;
        }

        @media (max-width: 1024px) {
          .admin-header {
            left: 0;
            padding: 0 16px;
          }

          .menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            margin-right: 8px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            color: #334155;
            cursor: pointer;
            flex-shrink: 0;
          }

          .menu-toggle:hover {
            background: #e2e8f0;
          }

          .client-nav {
            display: none;
          }

          .header-actions {
            gap: 8px;
          }

          .profile-info {
            display: none;
          }

          .profile-button {
            padding: 6px 10px;
          }
        }

        @media (max-width: 640px) {
          .admin-header {
            height: 64px;
            padding: 0 12px;
          }

          .header-content {
            gap: 12px;
          }

          .icon-button {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </header>
  );
}
