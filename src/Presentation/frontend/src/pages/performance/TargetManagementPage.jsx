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
  formatScore
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
  const [departmentFilter, setDepartmentFilter] = useState('all'); // all, departmentId
  const [userFilter, setUserFilter] = useState('all'); // all, userId
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

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
                        {/* Düzenleme butonu - Draft, Rejected ve ProgressRejected durumlarında göster */}
                        {(target.status === 1 || target.status === 4 || target.status === 8) && (
                          <button
                            onClick={() => handleEditTarget(target)}
                            className="btn btn-sm btn-secondary"
                            title="Düzenle"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        
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