import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Eye, Edit, Send, CheckCircle, XCircle, Clock, BarChart3, AlertCircle, Building } from 'lucide-react';
import performanceService from '../../services/api/performanceService';
import PerformanceTargetModal from '../../components/performance/PerformanceTargetModal';
import PerformanceTargetProgressModal from '../../components/performance/PerformanceTargetProgressModal';
import PerformanceContributionTable from '../../components/performance/PerformanceContributionTable';
import { useAuth } from '../../context/AuthContext';
import { 
  getTargetStatusText, 
  getTargetStatusBadgeClass, 
  formatCompletionRate, 
  formatScore,
  getTargetDirectionText,
  getTargetDirectionBadgeClass
} from '../../services/utils/performanceConstants';

const MyTargetsPage = () => {
  const { user } = useAuth();
  const [targets, setTargets] = useState([]);
  const [userTargets, setUserTargets] = useState([]);
  const [departmentTargets, setDepartmentTargets] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [authorizedDepartments, setAuthorizedDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [targetModalMode, setTargetModalMode] = useState('user'); // 'user' or 'department'
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [periodFilter, setPeriodFilter] = useState('all'); // all, periodId

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user && periods.length > 0) {
      loadAuthorizedDepartments();
    }
  }, [user, periods]);

  const loadData = async () => {
    await Promise.all([
      loadTargets(),
      loadPeriods()
    ]);
    // Periods yüklendikten sonra authorized departments'ı yükle
    await loadAuthorizedDepartments();
  };

  const loadTargets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentUserId = user?.id; // Auth context'ten al
      if (!currentUserId) {
        setError('Kullanıcı bilgisi bulunamadı');
        return;
      }
      
      // Kullanıcı hedefleri ve departman hedefleri için ayrı çağrılar
      const [userTargetsResponse, departmentTargetsResponse] = await Promise.all([
        performanceService.getPerformanceTargets({ userId: currentUserId }),
        performanceService.getPerformanceTargets({ departmentId: user?.departmentId })
      ]);
      
      const userTargets = userTargetsResponse.data.filter(target => target.assignedToUserId !== null);
      const departmentTargets = departmentTargetsResponse.data.filter(target => target.assignedToDepartmentId !== null);
      
      // Tüm hedefleri birleştir
      const allTargets = [...userTargets, ...departmentTargets];
      
      setTargets(allTargets);
      setUserTargets(userTargets);
      setDepartmentTargets(departmentTargets);
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

  const loadAuthorizedDepartments = async () => {
    try {
      const currentUserId = user?.id; // Auth context'ten al
      if (!currentUserId) {
        setAuthorizedDepartments([]);
        return;
      }
      
      const currentPeriodId = periods.length > 0 ? periods[0].periodId : null;
      if (!currentPeriodId) {
        setAuthorizedDepartments([]);
        return;
      }
      
      const response = await performanceService.getUserAuthorizedDepartments(currentUserId, currentPeriodId);
      setAuthorizedDepartments(response.data);
      console.log('Yetkili departmanlar:', response.data);
    } catch (error) {
      console.error('Yetkili departmanlar yüklenirken hata:', error);
    }
  };

  const handleCreateTarget = () => {
    setEditingTarget(null);
    setTargetModalMode('user');
    setSelectedDepartment(null);
    setShowTargetModal(true);
  };

  const handleCreateDepartmentTarget = (department) => {
    setEditingTarget(null);
    setTargetModalMode('department');
    setSelectedDepartment(department);
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
    setTargetModalMode('user');
    setSelectedDepartment(null);
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

  const getFilteredTargets = (targetList) => {
    return targetList.filter(target => {
      // Durum filtresi
      let statusMatch = true;
      if (filter === 'completed') {
        statusMatch = target.status === 7; // ProgressApproved
      } else if (filter === 'pending') {
        statusMatch = target.status !== 7; // Not completed
      }

      // Performans dönemi filtresi
      let periodMatch = true;
      if (periodFilter !== 'all') {
        periodMatch = target.periodId === parseInt(periodFilter);
      }

      return statusMatch && periodMatch;
    });
  };

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
            Kendim İçin Hedef Oluştur
          </button>
          {authorizedDepartments.length > 0 && (
            <div className="department-target-actions">
              <span className="action-label">Departman için:</span>
              {authorizedDepartments.map(dept => (
                <button
                  key={dept.departmentId}
                  onClick={() => handleCreateDepartmentTarget(dept)}
                  className="btn btn-secondary btn-sm"
                  title={`${dept.departmentName} için hedef oluştur`}
                >
                  <Plus size={16} />
                  {dept.departmentName}
                </button>
              ))}
            </div>
          )}
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
        {/* Kullanıcı Hedefleri */}
        {userTargets.length > 0 && (
          <div className="targets-section">
            <h2 className="section-title">
              <Target size={20} />
              Kişisel Hedeflerim
            </h2>
            <div className="targets-grid">
              {getFilteredTargets(userTargets).map((target) => (
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

                  {(target.status === 3 || target.status === 5) && ( // Approved veya ProgressDraft
                    <div className="target-actions-section">
                      <button
                        onClick={() => handleAddProgress(target)}
                        className="btn btn-primary"
                      >
                        <TrendingUp size={16} />
                        {target.status === 3 ? 'İlerleme Ekle' : 'Gerçekleşme Girişi'}
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
          </div>
        )}

        {/* Departman Hedefleri */}
        {departmentTargets.length > 0 && (
          <div className="targets-section">
            <h2 className="section-title">
              <Target size={20} />
              Departman Hedefleri
            </h2>
            <div className="targets-grid">
              {getFilteredTargets(departmentTargets).map((target) => (
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
                          className="btn btn-primary btn-sm"
                        >
                          <Send size={16} />
                          Onaya Gönder
                        </button>
                      )}
                      {target.status === 3 && ( // Approved
                        <button
                          onClick={() => handleAddProgress(target)}
                          className="btn btn-primary btn-sm"
                        >
                          <TrendingUp size={16} />
                          İlerleme Ekle
                        </button>
                      )}
                      {target.status === 7 && ( // ProgressApproved
                        <button
                          onClick={() => handleViewContributions(target.targetId)}
                          className="btn btn-secondary btn-sm"
                        >
                          <BarChart3 size={16} />
                          Katkı Tablosu
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="target-content">
                    <div className="target-info">
                      <div className="info-row">
                        <span className="info-label">Hedef Değeri:</span>
                        <span className="info-value">{target.targetValue} {target.unit}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Gerçekleşme:</span>
                        <span className="info-value">{target.actualValue || 0} {target.unit}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Tamamlanma Oranı:</span>
                        <span className="info-value">{formatCompletionRate(target.completionRate)}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Ağırlık:</span>
                        <span className="info-value">{target.weight}%</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Yön:</span>
                        <span className={`direction-badge ${getTargetDirectionBadgeClass(target.direction)}`}>
                          {getTargetDirectionText(target.direction)}
                        </span>
                      </div>
                      {target.score && (
                        <div className="info-row">
                          <span className="info-label">Puan:</span>
                          <span className="info-value">{formatScore(target.score)}</span>
                        </div>
                      )}
                    </div>

                    {target.description && (
                      <div className="target-description">
                        <p>{target.description}</p>
                      </div>
                    )}

                    {(target.status === 3 || target.status === 5) && ( // Approved veya ProgressDraft
                      <div className="progress-section">
                        <div className="progress-header">
                          <h4>İlerleme Bilgileri</h4>
                        </div>
                        <div className="progress-content">
                          <div className="progress-stats">
                            <div className="progress-stat">
                              <span className="stat-label">Mevcut Değer:</span>
                              <span className="stat-value">{target.actualValue || 0} {target.unit}</span>
                            </div>
                            <div className="progress-stat">
                              <span className="stat-label">Tamamlanma:</span>
                              <span className="stat-value">{formatCompletionRate(target.completionRate)}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddProgress(target)}
                            className="btn btn-primary"
                          >
                            <TrendingUp size={16} />
                            {target.status === 3 ? 'İlerleme Ekle' : 'Gerçekleşme Girişi'}
                          </button>
                        </div>
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
          </div>
          )}

          {/* Departman Hedefleri */}
          {departmentTargets.length > 0 && (
            <div className="targets-section">
              <h2 className="section-title">
                <Building size={20} />
                Departman Hedefleri
              </h2>
              <div className="targets-grid">
                {getFilteredTargets(departmentTargets).map((target) => (
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
                        <div className="info-row">
                          <span className="info-label">Dönem:</span>
                          <span className="info-value">{target.periodName}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Hedef Değeri:</span>
                          <span className="info-value">{target.targetValue} {target.unit}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Ağırlık:</span>
                          <span className="info-value">%{target.weight}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Yön:</span>
                          <span className={`direction-badge ${getTargetDirectionBadgeClass(target.direction)}`}>
                            {getTargetDirectionText(target.direction)}
                          </span>
                        </div>
                        {target.actualValue !== null && (
                          <div className="info-row">
                            <span className="info-label">Gerçekleşen:</span>
                            <span className="info-value">{target.actualValue} {target.unit}</span>
                          </div>
                        )}
                        {target.completionRate !== null && (
                          <div className="info-row">
                            <span className="info-label">Gerçekleşme Oranı:</span>
                            <span className="info-value">{formatCompletionRate(target.completionRate)}</span>
                          </div>
                        )}
                        {target.score && (
                          <div className="info-row">
                            <span className="info-label">Puan:</span>
                            <span className="info-value">{formatScore(target.score)}</span>
                          </div>
                        )}
                      </div>

                      {(target.status === 3 || target.status === 5) && ( // Approved veya ProgressDraft
                        <div className="target-actions-section">
                          <button
                            onClick={() => handleAddProgress(target)}
                            className="btn btn-primary"
                          >
                            <TrendingUp size={16} />
                            {target.status === 3 ? 'İlerleme Ekle' : 'Gerçekleşme Girişi'}
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
            </div>
          )}

          {/* Hedef Bulunamadı */}
        {userTargets.length === 0 && departmentTargets.length === 0 && (
          <div className="empty-state">
            <Target size={48} />
            <h3>Hedef Bulunamadı</h3>
            <p>Size atanan herhangi bir hedef bulunmuyor.</p>
            <button
              onClick={handleCreateTarget}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Yeni Hedef Oluştur
            </button>
          </div>
        )}
      </div>

      <PerformanceTargetModal
        isOpen={showTargetModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        target={editingTarget}
        isEdit={!!editingTarget}
        periodId={periodFilter !== 'all' ? parseInt(periodFilter) : null}
        targetModalMode={targetModalMode}
        selectedDepartment={selectedDepartment}
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