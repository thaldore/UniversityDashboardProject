import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/api/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getInitials, formatDate } from '../../services/utils/helpers';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Profil yüklenemedi:', error);
        setError('Profil bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  if (loading) {
    return <LoadingSpinner message="Profil bilgileri yükleniyor..." />;
  }

  const profileData = profile || user;

  return (
    <div className="dashboard-container">
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Profil Bilgileri</h1>
        <p className="page-subtitle">
          Hesap bilgilerinizi görüntüleyin
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {getInitials(profileData?.firstName, profileData?.lastName)}
              </div>
              <h2 className="profile-name">
                {profileData?.firstName} {profileData?.lastName}
              </h2>
              <p className="profile-role">
                {profileData?.roles?.join(', ') || 'Kullanıcı'}
              </p>
            </div>
            
            <div className="profile-content">
              <div className="profile-details">
                <div className="profile-detail">
                  <span className="profile-detail-label">Ad</span>
                  <span className="profile-detail-value">{profileData?.firstName}</span>
                </div>
                
                <div className="profile-detail">
                  <span className="profile-detail-label">Soyad</span>
                  <span className="profile-detail-value">{profileData?.lastName}</span>
                </div>
                
                <div className="profile-detail">
                  <span className="profile-detail-label">Kullanıcı Adı</span>
                  <span className="profile-detail-value">{profileData?.username}</span>
                </div>
                
                <div className="profile-detail">
                  <span className="profile-detail-label">E-posta</span>
                  <span className="profile-detail-value">{profileData?.email}</span>
                </div>
                
                <div className="profile-detail">
                  <span className="profile-detail-label">Departman</span>
                  <span className="profile-detail-value">
                    {profileData?.departmentName || 'Belirtilmemiş'}
                  </span>
                </div>
                
                <div className="profile-detail">
                  <span className="profile-detail-label">Roller</span>
                  <span className="profile-detail-value">
                    {profileData?.roles?.join(', ') || 'Kullanıcı'}
                  </span>
                </div>
                
                <div className="profile-detail">
                  <span className="profile-detail-label">Kayıt Tarihi</span>
                  <span className="profile-detail-value">
                    {formatDate(profileData?.createdAt)}
                  </span>
                </div>
                
                <div className="profile-detail">
                  <span className="profile-detail-label">Hesap Durumu</span>
                  <span className={`profile-status ${profileData?.isActive ? 'active' : 'inactive'}`}>
                    <span className="profile-status-dot"></span>
                    {profileData?.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
