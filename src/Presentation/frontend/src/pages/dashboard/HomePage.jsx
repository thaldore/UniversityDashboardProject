import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../services/utils/helpers';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1 className="dashboard-title">
            Hoş geldiniz, {user?.firstName}! 👋
          </h1>
          <p className="dashboard-subtitle">
            Bugün harika bir gün! Üniversite yönetim sisteminizde neler olup bittiğine göz atın.
          </p>
          <nav className="dashboard-breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span>Ana Sayfa</span>
          </nav>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <div className="welcome-message">
            <h2>Ana Sayfa İçeriği</h2>
            <p>Üniversite yönetim sisteminize hoş geldiniz. Sistem başarıyla çalışıyor.</p>
          </div>
        </div>

        <div className="dashboard-sidebar">
          {/* User Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <h3 className="profile-name">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="profile-role">
                {user?.roles?.join(', ') || 'Kullanıcı'}
              </p>
            </div>
            <div className="profile-content">
              <div className="profile-details">
                <div className="profile-detail">
                  <span className="profile-detail-label">E-posta</span>
                  <span className="profile-detail-value">{user?.email}</span>
                </div>
                <div className="profile-detail">
                  <span className="profile-detail-label">Kullanıcı Adı</span>
                  <span className="profile-detail-value">{user?.username}</span>
                </div>
                <div className="profile-detail">
                  <span className="profile-detail-label">Durum</span>
                  <span className="profile-status active">
                    <span className="profile-status-dot"></span>
                    Aktif
                  </span>
                </div>
                <div className="profile-detail">
                  <span className="profile-detail-label">Son Giriş</span>
                  <span className="profile-detail-value">Bugün</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
