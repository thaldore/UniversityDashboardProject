import React, { useState, useEffect } from 'react';
import { Target, Plus, Users, Building, Eye, Edit, Trash2, CheckCircle, XCircle, Send, BarChart3, AlertCircle } from 'lucide-react';
import performanceService from '../../services/api/performanceService';
import PerformanceTargetModal from '../../components/performance/PerformanceTargetModal';
import PerformanceTargetAssignModal from '../../components/performance/PerformanceTargetAssignModal';
import PerformanceContributionTable from '../../components/performance/PerformanceContributionTable';
import { 
  getTargetStatusText, 
  getTargetStatusBadgeClass, 
  formatCompletionRate, 
  formatScore,
  getTargetDirectionText,
  getTargetDirectionBadgeClass
} from '../../services/utils/performanceConstants';

const TargetManagementPage = () => {
  const [targets, setTargets] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, completed
  const [periodFilter, setPeriodFilter] = useState('all'); // all, periodId
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadTargets(),
      loadPeriods()
    ]);
  };

  const loadTargets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await performanceService.getPerformanceTargets();
      setTargets(response.data);
    } catch (err) {
      console.error('Hedefler yüklenirken hata:', err);
      setError('Hedefler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const loadPeriods = async () => {
    try {
      const response = await performanceService.getPerformancePeriods();
      setPeriods(response.data);
    } catch (err) {
      console.error('Performans dönemleri yüklenirken hata:', err);
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

  const handleAssignTarget = (target) => {
    setSelectedTarget(target);
    setShowAssignModal(true);
  };

  const handleViewContributions = (target) => {
    setSelectedTarget(target);
    setShowContributionModal(true);
  };

  const handleModalClose = () => {
    setShowTargetModal(false);
    setShowAssignModal(false);
    setShowContributionModal(false);
    setEditingTarget(null);
    setSelectedTarget(null);
  };

  const handleModalSuccess = () => {
    loadTargets();
  };

  const handleApproveReject = async (targetId, isApproved, reason = '') => {
    try {
      await performanceService.approveRejectPerformanceTarget(targetId, {
        isApproved,
        reason
      });
      loadTargets();
    } catch (err) {
      console.error('Hedef onay/red işlemi sırasında hata:', err);
      setError('Hedef onay/red işlemi sırasında bir hata oluştu.');
    }
  };

  const handleDeleteTarget = async (targetId) => {
    if (window.confirm('Bu hedefi silmek istediğinizden emin misiniz?')) {
      try {
        await performanceService.deletePerformanceTarget(targetId);
        loadTargets();
      } catch (err) {
        console.error('Hedef silinirken hata:', err);
        setError('Hedef silinirken bir hata oluştu.');
      }
    }
  };

  const filteredTargets = targets.filter(target => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && target.status === 2) || // Submitted
      (filter === 'approved' && target.status === 3) || // Approved
      (filter === 'completed' && target.status === 7); // ProgressApproved
    
    const matchesSearch = searchTerm === '' || 
      target.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.periodName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPeriod = periodFilter === 'all' || target.periodId === parseInt(periodFilter);
    
    return matchesFilter && matchesSearch && matchesPeriod;
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
    <div className="target-management-page">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <Target className="icon" />
            Hedef Yönetimi
          </h1>
          <p>Performans hedeflerini yönetin, atayın ve onaylayın</p>
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
        <div className="search-section">
          <input
            type="text"
            placeholder="Hedef ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
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
            Bekleyen Onaylar
          </button>
          <button
            className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Onaylanan Hedefler
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Tamamlanan Hedefler
          </button>
        </div>
        
        <div className="period-filter">
          <label className="filter-label">Performans Dönemi:</label>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tüm Performans Dönemleri</option>
            {periods.map(period => (
              <option key={period.periodId} value={period.periodId}>
                {period.periodName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="targets-container">
        {filteredTargets.length > 0 ? (
          <div className="targets-table">
            <table className="targets-table-content">
              <thead>
                <tr>
                  <th>Hedef Adı</th>
                  <th>Dönem</th>
                  <th>Atanan</th>
                  <th>Hedef Değeri</th>
                  <th>Gerçekleşme</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredTargets.map((target) => (
                  <tr key={target.targetId}>
                    <td className="target-name">
                      <div className="target-info">
                        <h4>{target.targetName}</h4>
                        {target.description && (
                          <p className="target-description">{target.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="period-name">
                      {target.periodName}
                    </td>
                    <td className="assigned-to">
                      {target.departmentName && (
                        <div className="assigned-item">
                          <Building size={14} />
                          <span>{target.departmentName}</span>
                        </div>
                      )}
                      {target.userName && (
                        <div className="assigned-item">
                          <Users size={14} />
                          <span>{target.userName}</span>
                        </div>
                      )}
                    </td>
                    <td className="target-value">
                      <div className="value-info">
                        <span className="value">{target.targetValue}</span>
                        <span className="unit">{target.unit}</span>
                      </div>
                      <div className="weight-info">
                        Ağırlık: {target.weight}%
                      </div>
                    </td>
                    <td className="progress-info">
                      {target.actualValue !== null ? (
                        <div className="progress-details">
                          <div className="actual-value">
                            {target.actualValue} {target.unit}
                          </div>
                          <div className={`completion-rate ${target.completionRate >= 100 ? 'success' : target.completionRate >= 80 ? 'warning' : 'danger'}`}>
                            {formatCompletionRate(target.completionRate)}
                          </div>
                          {target.score && (
                            <div className="score-info">
                              Puan: {formatScore(target.score)}
                              {target.letterGrade && ` (${target.letterGrade})`}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="no-progress">Henüz girilmedi</span>
                      )}
                    </td>
                    <td className="status">
                      <span className={`status-badge ${getTargetStatusBadgeClass(target.status)}`}>
                        {getTargetStatusText(target.status)}
                      </span>
                    </td>
                    <td className="actions">
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEditTarget(target)}
                          className="btn btn-sm btn-secondary"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </button>
                        
                        {target.status === 2 && ( // Submitted
                          <>
                            <button
                              onClick={() => handleApproveReject(target.targetId, true)}
                              className="btn btn-sm btn-success"
                              title="Onayla"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Red sebebi:');
                                if (reason) {
                                  handleApproveReject(target.targetId, false, reason);
                                }
                              }}
                              className="btn btn-sm btn-danger"
                              title="Reddet"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => handleAssignTarget(target)}
                          className="btn btn-sm btn-info"
                          title="Ata"
                        >
                          <Users size={16} />
                        </button>
                        
                        {target.status === 7 && ( // ProgressApproved
                          <button
                            onClick={() => handleViewContributions(target)}
                            className="btn btn-sm btn-primary"
                            title="Katkı Analizi"
                          >
                            <BarChart3 size={16} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteTarget(target.targetId)}
                          className="btn btn-sm btn-danger"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      <PerformanceTargetAssignModal
        isOpen={showAssignModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        target={selectedTarget}
      />

      <PerformanceContributionTable
        targetId={selectedTarget?.targetId}
        isOpen={showContributionModal}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default TargetManagementPage;