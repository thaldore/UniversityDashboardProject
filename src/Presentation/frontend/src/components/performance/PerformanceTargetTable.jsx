import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Users, BarChart3, Eye, Building, User } from 'lucide-react';
import { 
  getTargetStatusText, 
  getTargetStatusBadgeClass, 
  formatCompletionRate, 
  formatScore,
  formatWeight
} from '../../services/utils/performanceConstants';

const PerformanceTargetTable = ({ 
  targets, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject, 
  onAssign, 
  onViewContributions,
  onApproveProgress,
  onRejectProgress
}) => {
  
  const getAssignedInfo = (target) => {
    if (target.departmentName) {
      return {
        name: target.departmentName,
        type: 'department',
        icon: Building
      };
    }
    if (target.userName) {
      return {
        name: target.userName,
        type: 'user',
        icon: User
      };
    }
    return {
      name: 'Atanmamış',
      type: 'none',
      icon: null
    };
  };

  const getTargetValueInfo = (target) => {
    return {
      value: target.targetValue,
      unit: target.unit,
      weight: target.weight
    };
  };

  const getProgressInfo = (target) => {
    if (target.actualValue === null || target.actualValue === undefined) {
      return {
        actual: null,
        rate: null,
        score: null,
        unit: target.unit
      };
    }

    return {
      actual: target.actualValue,
      rate: target.completionRate,
      score: target.score,
      unit: target.unit
    };
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

  const canShowProgressActions = (target) => {
    return target.status === 5; // ProgressDraft
  };

  const canShowTargetActions = (target) => {
    return target.status === 2; // Submitted
  };

  const canShowContributionButton = (target) => {
    return target.status === 7; // ProgressApproved
  };

  if (!targets || targets.length === 0) {
    return (
      <div className="empty-table-state">
        <div className="empty-content">
          <p>Gösterilecek hedef bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-target-table-container">
      <div className="table-wrapper">
        <table className="performance-target-table">
          <thead>
            <tr>
              <th>Hedef Adı</th>
              <th>Dönem</th>
              <th>Atanan</th>
              <th>Hedef Değeri</th>
              <th>Gerçekleşme</th>
              <th>Durum</th>
              <th className="actions-header">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {targets.map((target) => (
              <tr key={target.targetId} className="target-row">
                <td className="target-name-cell">
                  <div className="target-name-info">
                    <h4 className="target-name">{target.targetName}</h4>
                    {target.description && (
                      <p className="target-description">{target.description}</p>
                    )}
                  </div>
                </td>
                
                <td className="period-cell">
                  <span className="period-name">{target.periodName}</span>
                </td>
                
                <td className="assigned-cell">
                  <div className="assigned-info">
                    {(() => {
                      const assignedInfo = getAssignedInfo(target);
                      const IconComponent = assignedInfo.icon;
                      return (
                        <div className="assigned-content">
                          {IconComponent && <IconComponent size={16} className="assigned-icon" />}
                          <span className="assigned-name">{assignedInfo.name}</span>
                        </div>
                      );
                    })()}
                  </div>
                </td>
                
                <td className="target-value-cell">
                  <div className="target-value-info">
                    {(() => {
                      const valueInfo = getTargetValueInfo(target);
                      return (
                        <div className="target-value-content">
                          <div className="target-value-number">{valueInfo.value}</div>
                          <div className="target-value-unit">{valueInfo.unit}</div>
                          <div className="target-value-weight">Ağırlık: {formatWeight(valueInfo.weight)}</div>
                        </div>
                      );
                    })()}
                  </div>
                </td>
                
                <td className="progress-cell">
                  <div className="progress-info">
                    {(() => {
                      const progressInfo = getProgressInfo(target);
                      if (!progressInfo.actual) {
                        return <span className="progress-text">Gerçekleşen: Girilmedi</span>;
                      }
                      return (
                         <div className="progress-content">
                           <div className="progress-item">Gerçekleşen: {progressInfo.actual} {progressInfo.unit}</div>
                           {progressInfo.rate !== null && (
                             <div className={`progress-item completion-rate ${getCompletionRateClass(progressInfo.rate)}`}>
                               Gerçekleşme Oranı: {formatCompletionRate(progressInfo.rate)}
                             </div>
                           )}
                           {progressInfo.score !== null && (
                             <div className="progress-item">Puan: {formatScore(progressInfo.score)}</div>
                           )}
                         </div>
                      );
                    })()}
                  </div>
                </td>
                
                <td className="status-cell">
                  <span className={`status-badge ${getTargetStatusBadgeClass(target.status)}`}>
                    {getTargetStatusText(target.status)}
                  </span>
                </td>
                
                <td className="actions-cell sticky-actions">
                  <div className="action-buttons-vertical">
                    <button
                      onClick={() => onEdit(target)}
                      className="btn btn-sm btn-secondary action-btn"
                      title="Düzenle"
                    >
                      <Edit size={14} />
                    </button>
                    
                    {canShowTargetActions(target) && (
                      <>
                        <button
                          onClick={() => onApprove(target.targetId)}
                          className="btn btn-sm btn-success action-btn"
                          title="Onayla"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          onClick={() => onReject(target.targetId)}
                          className="btn btn-sm btn-danger action-btn"
                          title="Reddet"
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                    
                    {canShowProgressActions(target) && (
                      <>
                        <button
                          onClick={() => onApproveProgress(target.progressId)}
                          className="btn btn-sm btn-success action-btn"
                          title="Gerçekleşmeyi Onayla"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          onClick={() => onRejectProgress(target.progressId)}
                          className="btn btn-sm btn-danger action-btn"
                          title="Gerçekleşmeyi Reddet"
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => onAssign(target)}
                      className="btn btn-sm btn-info action-btn"
                      title="Atama"
                    >
                      <Users size={14} />
                    </button>
                    
                    {canShowContributionButton(target) && (
                      <button
                        onClick={() => onViewContributions(target)}
                        className="btn btn-sm btn-primary action-btn"
                        title="Katkı Analizi"
                      >
                        <BarChart3 size={14} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onDelete(target.targetId)}
                      className="btn btn-sm btn-danger action-btn"
                      title="Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceTargetTable;
