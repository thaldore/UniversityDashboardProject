import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  // Rol kontrolü için yardımcı fonksiyon
  const hasRole = (requiredRoles) => {
    if (!user?.roles) return false;
    return requiredRoles.some(role => user.roles.includes(role));
  };

  // Rol bazlı menü öğeleri
  const getMenuItems = () => {
    const allMenuItems = [
      { 
        path: '/', 
        label: 'Ana Sayfa', 
        icon: '🏠',
        description: 'Ana sayfa',
        roles: ['Admin', 'Manager', 'User'] // Tüm roller
      },
      { 
        path: '/charts', 
        label: 'Grafikler', 
        icon: '📈',
        description: 'Grafik yönetimi ve görüntüleme',
        roles: ['Admin', 'Manager', 'User'] // Tüm roller
      },
      { 
        path: '/indicators', 
        label: 'Gösterge Listesi', 
        icon: '📊',
        description: 'Gösterge yönetimi',
        roles: ['Admin'] // Sadece Admin
      },
      { 
        path: '/indicators/new', 
        label: 'Yeni Gösterge', 
        icon: '➕',
        description: 'Yeni gösterge oluştur',
        roles: ['Admin'] // Sadece Admin
      },
      { 
        path: '/indicators/data-entry', 
        label: 'Veri Girişi', 
        icon: '📝',
        description: 'Gösterge verilerini gir',
        roles: ['Admin', 'Manager', 'User'] // Tüm roller
      },
      { 
        path: '/performance', 
        label: 'Performans Dönemleri', 
        icon: '📅',
        description: 'Performans dönemlerini yönet',
        roles: ['Admin', 'Manager', 'User'] // Tüm roller
      },
      { 
        path: '/performance/my-targets', 
        label: 'Hedeflerim', 
        icon: '🎯',
        description: 'Size atanan hedefler',
        roles: ['Admin', 'Manager', 'User'] // Tüm roller
      },
      { 
        path: '/performance/target-management', 
        label: 'Hedef Yönetimi', 
        icon: '⚙️',
        description: 'Hedefleri yönet ve onayla',
        roles: ['Admin'] // Sadece Admin
      },
      { 
        path: '/auth/profile', 
        label: 'Profil', 
        icon: '👤',
        description: 'Profil bilgileri',
        roles: ['Admin', 'Manager', 'User'] // Tüm roller
      }
    ];

    // Kullanıcının rolüne göre menü öğelerini filtrele
    return allMenuItems.filter(item => hasRole(item.roles));
  };

  const menuItems = getMenuItems();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-toggle"
            title={collapsed ? 'Menüyü Genişlet' : 'Menüyü Daralt'}
          >
            <span className="sidebar-toggle-content">
              {!collapsed && <span className="sidebar-toggle-text">Menü</span>}
              <div className={`sidebar-toggle-hamburger ${collapsed ? 'collapsed' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </span>
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <ul className="sidebar-menu">
              {menuItems.map((item, index) => (
                <li key={index} className="sidebar-menu-item">
                  <Link
                    to={item.path}
                    className={`sidebar-menu-link ${isActive(item.path) ? 'active' : ''}`}
                    title={collapsed ? item.description : ''}
                  >
                    <span className="sidebar-menu-icon">{item.icon}</span>
                    {!collapsed && (
                      <span className="sidebar-menu-text">{item.label}</span>
                    )}
                    {isActive(item.path) && (
                      <span className="sidebar-menu-indicator"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <button 
        className="mobile-sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Menüyü aç/kapat"
      >
        <span className="mobile-toggle-icon">☰</span>
      </button>

      <div 
        className={`sidebar-overlay ${!collapsed ? 'show' : ''}`}
        onClick={() => setCollapsed(true)}
      />
    </>
  );
};

export default Sidebar;
