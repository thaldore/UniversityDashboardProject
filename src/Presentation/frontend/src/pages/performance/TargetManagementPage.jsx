import React, { useState, useEffect } from 'react';
import { Target, Plus, Users, Building, Edit, Trash2, CheckCircle, XCircle, BarChart3, AlertCircle, Grid, List } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import performanceService from '../../services/api/performanceService';
import PerformanceTargetModal from '../../components/performance/PerformanceTargetModal';
import PerformanceTargetAssignModal from '../../components/performance/PerformanceTargetAssignModal';
import PerformanceContributionTable from '../../components/performance/PerformanceContributionTable';
import PerformanceTargetTable from '../../components/performance/PerformanceTargetTable';
import { 
  getTargetStatusText, 
  getTargetStatusBadgeClass, 
  formatCompletionRate, 
  formatScore
} from '../../services/utils/performanceConstants';

const TargetManagementPage = () => {
  const { user } = useAuth();
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
  const [departmentFilter, setDepartmentFilter] = useState('all'); // all, departmentId
  const [userFilter, setUserFilter] = useState('all'); // all, userId
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Rol kontrolü - sadece Admin erişebilir
  const isAdmin = user?.roles?.includes('Admin');

  useEffect(() => {
    // Sadece Admin ise veri yükle
    if (isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [targetsResponse, periodsResponse, departmentsResponse, usersResponse] = await Promise.all([
        performanceService.getPerformanceTargets(),
        performanceService.getPerformancePeriods(),
        performanceService.getAvailableDepartments(),
        performanceService.getAvailableUsers()
      ]);
      
      setTargets(targetsResponse.data);
      setPeriods(periodsResponse.data);
      setDepartments(departmentsResponse.data);
      setUsers(usersResponse.data);
    } catch (err) {
      console.error('Veriler yüklenirken hata:', err);
      setError('Veriler yüklenirken bir hata oluştu.');
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
    loadData();
  };

  const handleApproveReject = async (targetId, isApproved, reason = '') => {
    try {
      await performanceService.approveRejectPerformanceTarget(targetId, {
        isApproved,
        reason
      });
      await loadData();
    } catch (err) {
      console.error('Hedef onay/red işlemi sırasında hata:', err);
      setError('Hedef onay/red işlemi sırasında bir hata oluştu.');
    }
  };

  const handleApproveRejectProgress = async (progressId, isApproved, reason = '') => {
    try {
      await performanceService.approveRejectPerformanceTargetProgress(progressId, {
        isApproved,
        reason
      });
      await loadData();
    } catch (err) {
      console.error('Gerçekleşme onay/red işlemi sırasında hata:', err);
      setError('Gerçekleşme onay/red işlemi sırasında bir hata oluştu.');
    }
  };

  // Tablo için event handler'lar
  const handleTableApprove = (targetId) => {
    handleApproveReject(targetId, true);
  };

  const handleTableReject = (targetId) => {
    const reason = prompt('Red sebebi:');
    if (reason) {
      handleApproveReject(targetId, false, reason);
    }
  };

  const handleTableApproveProgress = (progressId) => {
    handleApproveRejectProgress(progressId, true);
  };

  const handleTableRejectProgress = (progressId) => {
    const reason = prompt('Gerçekleşme red sebebi:');
    if (reason) {
      handleApproveRejectProgress(progressId, false, reason);
    }
  };

  // 6 renk skalası için gerçekleşme oranı sınıfını belirle
  const getCompletionRateClass = (rate) => {
    if (rate >= 101) return 'excellent';      // 101+ - Mükemmel yeşil
    if (rate >= 81) return 'very-good';       // 81-100 - Çok iyi yeşil
    if (rate >= 61) return 'good';            // 61-80 - İyi sarı-yeşil
    if (rate >= 41) return 'fair';            // 41-60 - Orta sarı
    if (rate >= 21) return 'poor';            // 21-40 - Kötü turuncu
    return 'very-poor';                       // 0-20 - Çok kötü kırmızı
  };

  const handleDeleteTarget = async (targetId) => {
    if (window.confirm('Bu hedefi silmek istediğinizden emin misiniz?')) {
      try {
        await performanceService.deletePerformanceTarget(targetId);
        await loadData();
      } catch (err) {
        console.error('Hedef silinirken hata:', err);
        setError('Hedef silinirken bir hata oluştu.');
      }
    }
  };

  const filteredTargets = targets.filter(target => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && target.status === 2) || // Submitted
      (filter === 'approved' && (target.status === 3 || target.status === 5)) || // Approved veya ProgressDraft
      (filter === 'completed' && target.status === 7); // ProgressApproved
    
    const matchesSearch = searchTerm === '' || 
      target.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.periodName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPeriod = periodFilter === 'all' || target.periodId === parseInt(periodFilter);
    const matchesDepartment = departmentFilter === 'all' || target.departmentId === parseInt(departmentFilter);
    const matchesUser = userFilter === 'all' || target.userId === parseInt(userFilter);
    
    return matchesFilter && matchesSearch && matchesPeriod && matchesDepartment && matchesUser;
  });

  // Admin değilse erişim reddedildi mesajı göster
  if (!isAdmin) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <AlertCircle size={48} />
          <h2>Erişim Reddedildi</h2>
          <p>Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <p>Sadece Admin kullanıcıları hedef yönetimi sayfasına erişebilir.</p>
        </div>
      </div>
    );
  }

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
          <div className="view-mode-toggle">
            <button
              onClick={() => setViewMode('table')}
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              title="Tablo Görünümü"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              title="Kart Görünümü"
            >
              <Grid size={18} />
            </button>
          </div>
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
        
         <div className="advanced-filters">
           <div className="filter-group">
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

           <div className="filter-group">
             <label className="filter-label">Departman:</label>
             <select
               value={departmentFilter}
               onChange={(e) => setDepartmentFilter(e.target.value)}
               className="filter-select"
             >
               <option value="all">Tüm Departmanlar</option>
               {departments.map(dept => (
                 <option key={dept.departmentId} value={dept.departmentId}>
                   {dept.departmentName}
                 </option>
               ))}
             </select>
           </div>

           <div className="filter-group">
             <label className="filter-label">Kullanıcı:</label>
             <select
               value={userFilter}
               onChange={(e) => setUserFilter(e.target.value)}
               className="filter-select"
             >
               <option value="all">Tüm Kullanıcılar</option>
               {users.map(user => (
                 <option key={user.id} value={user.id}>
                   {user.firstName} {user.lastName} ({user.email})
                 </option>
               ))}
             </select>
           </div>
         </div>
      </div>

      <div className="targets-container">
        {filteredTargets.length > 0 ? (
          viewMode === 'table' ? (
            <PerformanceTargetTable
              targets={filteredTargets}
              onEdit={handleEditTarget}
              onDelete={handleDeleteTarget}
              onApprove={handleTableApprove}
              onReject={handleTableReject}
              onAssign={handleAssignTarget}
              onViewContributions={handleViewContributions}
              onApproveProgress={handleTableApproveProgress}
              onRejectProgress={handleTableRejectProgress}
            />
          ) : (
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
                    
                    {target.status === 5 && ( // ProgressDraft - Gerçekleşme onay/red butonları
                      <>
                        <button
                          onClick={() => handleApproveRejectProgress(target.progressId, true)}
                          className="btn btn-sm btn-success"
                          title="Gerçekleşmeyi Onayla"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Gerçekleşme red sebebi:');
                            if (reason) {
                              handleApproveRejectProgress(target.progressId, false, reason);
                            }
                          }}
                          className="btn btn-sm btn-danger"
                          title="Gerçekleşmeyi Reddet"
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
                </div>
                
                <div className="target-content">
                  <div className="target-info">
                    {target.description && (
                      <div className="info-item">
                        <label>Açıklama:</label>
                        <span>{target.description}</span>
                      </div>
                    )}
                    
                    <div className="info-item">
                      <label>Dönem:</label>
                      <span>{target.periodName}</span>
                    </div>
                    
                    <div className="info-item">
                      <label>Atanan:</label>
                      <div className="assigned-to">
                        {target.departmentName && (
                          <div className="assigned-item">
                            <Building size={16} />
                            <span>{target.departmentName}</span>
                          </div>
                        )}
                        {target.userName && (
                          <div className="assigned-item">
                            <Users size={16} />
                            <span>{target.userName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <label>Hedef Değeri:</label>
                      <span>{target.targetValue} {target.unit}</span>
                    </div>
                    
                    <div className="info-item">
                      <label>Ağırlık:</label>
                      <span>{target.weight}%</span>
                    </div>
                  </div>
                  
                  <div className="target-progress">
                    <div className="progress-info">
                      {target.actualValue !== null ? (
                        <div className="progress-details">
                          <div className="progress-item">
                            <label>Gerçekleşen:</label>
                            <span>{target.actualValue} {target.unit}</span>
                          </div>
                          <div className="progress-item">
                            <label>Gerçekleşme Oranı:</label>
                            <span className={`completion-rate ${getCompletionRateClass(target.completionRate)}`}>
                              {formatCompletionRate(target.completionRate)}
                            </span>
                          </div>
                          {target.status === 7 && target.score && (
                            <div className="progress-item">
                              <label>Puan:</label>
                              <span className="score">{formatScore(target.score)}</span>
                            </div>
                          )}
                          {target.status === 7 && target.letterGrade && (
                            <div className="progress-item">
                              <label>Harf Notu:</label>
                              <span className="letter-grade">{target.letterGrade}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="no-progress">Henüz girilmedi</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )
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