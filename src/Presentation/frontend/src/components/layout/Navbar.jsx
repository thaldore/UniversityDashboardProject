import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../services/utils/helpers';
import NotificationBell from '../notifications/NotificationBell';
import NotificationDropdown from '../notifications/NotificationDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <div className="navbar-logo">
            Ü
          </div>
          <h1 className="navbar-title">Üniversite Ana Sayfa</h1>
        </div>

        <div className="navbar-menu">
          <NotificationBell onOpenNotifications={() => setShowNotifications(true)} />
          
          <div className="user-menu">
            <div className="user-info">
              <div className="user-name">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="user-role">
                {user?.roles?.join(', ') || 'Kullanıcı'}
              </div>
            </div>
            
            <div 
              className="user-avatar"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title="Kullanıcı Menüsü"
            >
              {getInitials(user?.firstName, user?.lastName)}
            </div>

            {showUserMenu && (
              <div className="user-dropdown">
                <a href="/auth/profile" className="user-dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Profil
                </a>
                <hr className="user-dropdown-divider" />
                <button 
                  onClick={handleLogout}
                  className="user-dropdown-item user-dropdown-logout"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <NotificationDropdown 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </nav>
  );
};

export default Navbar;
