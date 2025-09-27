import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Eye, Edit, Send, CheckCircle, XCircle, Clock, BarChart3, AlertCircle } from 'lucide-react';
import performanceService from '../../services/api/performanceService';
import PerformanceTargetModal from '../../components/performance/PerformanceTargetModal';
import PerformanceTargetProgressModal from '../../components/performance/PerformanceTargetProgressModal';
import PerformanceContributionTable from '../../components/performance/PerformanceContributionTable';
import { 
  getTargetStatusText, 
  getTargetStatusBadgeClass, 
  formatCompletionRate, 
  formatScore,
  getTargetDirectionText,
  getTargetDirectionBadgeClass
} from '../../services/utils/performanceConstants';

const MyTargetsPage = () => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, pending

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await performanceService.getPerformanceTargets({ userId: null }); // Current user's targets
      setTargets(response.data);
    } catch (err) {
      console.error('Hedefler yüklenirken hata:', err);
      setError('Hedefler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTarget = () => {
    setEditingTarget(null);
    setShowTargetModal(true);
  };

  const handleEditTarget = (target) => {
    setEditingTarget(target);
    setShowTargetModal(true);
  };

  const handleAddProgress = (target) => {
    setSelectedTarget(target);
    setShowProgressModal(true);
  };

  const handleViewContributions = (target) => {
    setSelectedTarget(target);
    setShowContributionModal(true);
  };

  const handleModalClose = () => {
    setShowTargetModal(false);
    setShowProgressModal(false);
    setShowContributionModal(false);
    setEditingTarget(null);
    setSelectedTarget(null);
  };

  const handleModalSuccess = () => {
    loadTargets();
  };

  const handleSubmitTarget = async (targetId) => {
    try {
      await performanceService.submitPerformanceTarget(targetId);
      loadTargets();
    } catch (err) {
      console.error('Hedef gönderilirken hata:', err);
      setError('Hedef gönderilirken bir hata oluştu.');
    }
  };

  const filteredTargets = targets.filter(target => {
    if (filter === 'completed') {
      return target.status === 7; // ProgressApproved
    } else if (filter === 'pending') {
      return target.status !== 7; // Not completed
    }
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Hedefler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="my-targets-page">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <Target className="icon" />
            Hedeflerim
          </h1>
          <p>Size atanan performans hedeflerini görüntüleyin ve yönetin</p>
        </div>
        <div className="header-actions">
          <button
            onClick={handleCreateTarget}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Yeni Hedef Oluştur
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="targets-filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tüm Hedefler
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Bekleyen Hedefler
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Tamamlanan Hedefler
          </button>
        </div>
      </div>

      <div className="targets-container">
        {filteredTargets.length > 0 ? (
          <div className="targets-grid">
            {filteredTargets.map((target) => (
              <div key={target.targetId} className="target-card">
                <div className="target-header">
                  <div className="target-title">
                    <h3>{target.targetName}</h3>
                    <span className={`status-badge ${getTargetStatusBadgeClass(target.status)}`}>
                      {getTargetStatusText(target.status)}
                    </span>
                  </div>
                  <div className="target-actions">
                    {target.status === 1 && ( // Draft
                      <button
                        onClick={() => handleSubmitTarget(target.targetId)}
                        className="btn btn-sm btn-primary"
                        title="Onaya Gönder"
                      >
                        <Send size={16} />
                      </button>
                    )}
                    {target.status === 1 && ( // Draft
                      <button
                        onClick={() => handleEditTarget(target)}
                        className="btn btn-sm btn-secondary"
                        title="Düzenle"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {target.status === 7 && ( // ProgressApproved
                      <button
                        onClick={() => handleViewContributions(target)}
                        className="btn btn-sm btn-info"
                        title="Katkı Analizi"
                      >
                        <BarChart3 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="target-content">
                  <div className="target-info">
                    <div className="info-item">
                      <label>Dönem:</label>
                      <span>{target.periodName}</span>
                    </div>
                    <div className="info-item">
                      <label>Hedef Değeri:</label>
                      <span>{target.targetValue} {target.unit}</span>
                    </div>
                    <div className="info-item">
                      <label>Ağırlık:</label>
                      <span>{target.weight}%</span>
                    </div>
                    <div className="info-item">
                      <label>Yön:</label>
                      <span className={`direction-badge ${getTargetDirectionBadgeClass(target.direction)}`}>
                        {getTargetDirectionText(target.direction)}
                      </span>
                    </div>
                  </div>

                  {target.actualValue !== null && (
                    <div className="target-progress">
                      <div className="progress-info">
                        <div className="progress-item">
                          <label>Gerçekleşen:</label>
                          <span>{target.actualValue} {target.unit}</span>
                        </div>
                        <div className="progress-item">
                          <label>Gerçekleşme Oranı:</label>
                          <span className={`completion-rate ${target.completionRate >= 100 ? 'success' : target.completionRate >= 80 ? 'warning' : 'danger'}`}>
                            {formatCompletionRate(target.completionRate)}
                          </span>
                        </div>
                        {target.score && (
                          <div className="progress-item">
                            <label>Puan:</label>
                            <span className="score">{formatScore(target.score)}</span>
                          </div>
                        )}
                        {target.letterGrade && (
                          <div className="progress-item">
                            <label>Harf Notu:</label>
                            <span className="letter-grade">{target.letterGrade}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {target.status === 3 && ( // Approved
                    <div className="target-actions-section">
                      <button
                        onClick={() => handleAddProgress(target)}
                        className="btn btn-primary"
                      >
                        <TrendingUp size={16} />
                        İlerleme Ekle
                      </button>
                    </div>
                  )}
                </div>

                <div className="target-footer">
                  <div className="target-meta">
                    <span>Oluşturulma: {new Date(target.createdAt).toLocaleDateString('tr-TR')}</span>
                    {target.updatedAt && (
                      <span>Güncellenme: {new Date(target.updatedAt).toLocaleDateString('tr-TR')}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Target size={48} />
            <h3>Hedef Bulunamadı</h3>
            <p>Seçilen filtreye göre hedef bulunamadı.</p>
            {filter === 'all' && (
              <button
                onClick={handleCreateTarget}
                className="btn btn-primary"
              >
                <Plus size={20} />
                İlk Hedefinizi Oluşturun
              </button>
            )}
          </div>
        )}
      </div>

      <PerformanceTargetModal
        isOpen={showTargetModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        target={editingTarget}
        isEdit={!!editingTarget}
      />

      <PerformanceTargetProgressModal
        isOpen={showProgressModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        targetId={selectedTarget?.targetId}
      />

      <PerformanceContributionTable
        targetId={selectedTarget?.targetId}
        isOpen={showContributionModal}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default MyTargetsPage;