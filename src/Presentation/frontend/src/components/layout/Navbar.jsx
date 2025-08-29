import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../services/utils/helpers';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

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
                  <span className="user-dropdown-icon">👤</span>
                  Profil
                </a>
                <hr className="user-dropdown-divider" />
                <button 
                  onClick={handleLogout}
                  className="user-dropdown-item user-dropdown-logout"
                >
                  <span className="user-dropdown-icon">�</span>
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
