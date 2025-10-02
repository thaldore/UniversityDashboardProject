import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Target, Settings, Eye, Edit, Trash2, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import performanceService from '../../services/api/performanceService';
import PerformancePeriodModal from '../../components/performance/PerformancePeriodModal';
import { formatDate, getPerformancePeriodStatus, getPerformancePeriodStatusText, getPerformancePeriodStatusBadgeClass } from '../../services/utils/performanceConstants';

const PerformanceListPage = () => {
  const { user } = useAuth();
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Rol kontrolü
  const isAdmin = user?.roles?.includes('Admin');
  const canCreatePeriod = isAdmin;

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await performanceService.getPerformancePeriods();
      setPeriods(response.data);
    } catch (err) {
      console.error('Performans dönemleri yüklenirken hata:', err);
      setError('Performans dönemleri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePeriod = () => {
    setEditingPeriod(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEditPeriod = (period) => {
    setEditingPeriod(period);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingPeriod(null);
    setIsEdit(false);
  };

  const handleModalSuccess = () => {
    loadPeriods();
  };

  const handleToggleStatus = async (periodId, currentStatus) => {
    try {
      await performanceService.togglePerformancePeriodStatus(periodId, !currentStatus);
      loadPeriods();
    } catch (err) {
      console.error('Durum değiştirilirken hata:', err);
      setError('Durum değiştirilirken bir hata oluştu.');
    }
  };

  const handleDeletePeriod = async (periodId) => {
    if (window.confirm('Bu performans dönemini silmek istediğinizden emin misiniz?')) {
      try {
        await performanceService.deletePerformancePeriod(periodId);
        loadPeriods();
      } catch (err) {
        console.error('Performans dönemi silinirken hata:', err);
        setError('Performans dönemi silinirken bir hata oluştu.');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Performans dönemleri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="performance-list-page">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <Calendar className="icon" />
            Performans Dönemleri
          </h1>
          <p>Performans dönemlerini yönetin ve yeni dönemler oluşturun</p>
        </div>
        <div className="header-actions">
          {canCreatePeriod && (
            <button
              onClick={handleCreatePeriod}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Yeni Performans Dönemi
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="periods-container">
        {periods.length > 0 ? (
          <div className="periods-grid">
            {periods.map((period) => {
              const status = getPerformancePeriodStatus(period, new Date());
              const statusText = getPerformancePeriodStatusText(status);
              const statusClass = getPerformancePeriodStatusBadgeClass(status);
              
              return (
                <div key={period.periodId} className="period-card">
                  <div className="period-header">
                    <div className="period-title">
                      <h3>{period.periodName}</h3>
                      <span className={`status-badge ${statusClass}`}>
                        {statusText}
                      </span>
                    </div>
                    <div className="period-actions">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(period.periodId, period.isActive)}
                            className={`btn btn-sm ${period.isActive ? 'btn-success' : 'btn-secondary'}`}
                            title={period.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                          >
                            {period.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                          </button>
                          <button
                            onClick={() => handleEditPeriod(period)}
                            className="btn btn-sm btn-primary"
                            title="Düzenle"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePeriod(period.periodId)}
                            className="btn btn-sm btn-danger"
                            title="Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="period-content">
                    <div className="period-dates">
                      <div className="date-group">
                        <label>Performans Dönemi:</label>
                        <span>{formatDate(period.periodStartDate)} - {formatDate(period.periodEndDate)}</span>
                      </div>
                      <div className="date-group">
                        <label>Hedef Giriş:</label>
                        <span>{formatDate(period.targetEntryStartDate)} - {formatDate(period.targetEntryEndDate)}</span>
                      </div>
          <div className="date-group">
            <label>Hedef Revize:</label>
            <span>{period.targetReviseStartDate ? `${formatDate(period.targetReviseStartDate)} - ${formatDate(period.targetReviseEndDate)}` : '-'}</span>
          </div>
          <div className="date-group">
            <label>Sonuç Giriş:</label>
            <span>{period.resultEntryStartDate ? `${formatDate(period.resultEntryStartDate)} - ${formatDate(period.resultEntryEndDate)}` : '-'}</span>
          </div>
                    </div>

                    <div className="period-stats">
                      <div className="stat-item">
                        <Users size={16} />
                        <span>{period.assignmentCount || 0} Atama</span>
                      </div>
                      <div className="stat-item">
                        <Target size={16} />
                        <span>{period.targetCount || 0} Hedef</span>
                      </div>
                    </div>

                    <div className="period-settings">
                      {period.sendNotification && (
                        <span className="setting-badge">Bildirim</span>
                      )}
                      {period.sendEmail && (
                        <span className="setting-badge">E-posta</span>
                      )}
                    </div>
                  </div>

                  <div className="period-footer">
                    <div className="period-meta">
                      <span>Oluşturan: {period.createdByUserName}</span>
                      <span>Oluşturulma: {formatDate(period.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>Performans Dönemi Bulunamadı</h3>
            <p>Henüz hiç performans dönemi oluşturulmamış.</p>
            {canCreatePeriod && (
              <button
                onClick={handleCreatePeriod}
                className="btn btn-primary"
              >
                <Plus size={20} />
                İlk Performans Dönemini Oluştur
              </button>
            )}
          </div>
        )}
      </div>

      <PerformancePeriodModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        period={editingPeriod}
        isEdit={isEdit}
      />
    </div>
  );
};

export default PerformanceListPage;