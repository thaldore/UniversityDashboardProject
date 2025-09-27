import React, { useState, useEffect, useCallback } from 'react';
import { X, AlertCircle, BarChart3 } from 'lucide-react';
import performanceService from '../../services/api/performanceService';
import { formatContributionPercentage } from '../../services/utils/performanceConstants';

const PerformanceContributionTable = ({ targetId, isOpen, onClose }) => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadContributions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await performanceService.getPerformanceContributions(targetId);
      setContributions(response.data);
    } catch (err) {
      console.error('Katkılar yüklenirken hata:', err);
      setError('Katkılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    if (isOpen && targetId) {
      loadContributions();
    }
  }, [isOpen, targetId, loadContributions]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2>
            <BarChart3 className="icon" />
            Katkı Merkezi Analizi
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Katkılar yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          ) : (
            <div className="contribution-table-container">
              <div className="table-header">
                <h3>Katkı Merkezi Detayları</h3>
                <p>Bu hedefe katkıda bulunan birimlerin detaylı analizi</p>
              </div>

              {contributions.length > 0 ? (
                <div className="table-wrapper">
                  <table className="contribution-table">
                    <thead>
                      <tr>
                        <th>Hedef</th>
                        <th>Hedef Değeri</th>
                        <th>Birim</th>
                        <th>Katkı Merkezi</th>
                        <th>Katkı Miktarı</th>
                        <th>Toplam Miktar</th>
                        <th>Katkı Yüzdesi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributions.map((contribution, index) => (
                        <tr key={index}>
                          <td className="target-name">
                            {contribution.targetName}
                          </td>
                          <td className="target-value">
                            {contribution.targetValue.toLocaleString('tr-TR')}
                          </td>
                          <td className="unit">
                            {contribution.unit}
                          </td>
                          <td className="contribution-center">
                            <div className="center-info">
                              <span className="center-name">
                                {contribution.contributionCenter}
                              </span>
                            </div>
                          </td>
                          <td className="contribution-amount">
                            <div className="amount-info">
                              <span className="amount-value">
                                {contribution.contributionAmount.toLocaleString('tr-TR')}
                              </span>
                              <span className="amount-unit">
                                {contribution.unit}
                              </span>
                            </div>
                          </td>
                          <td className="total-amount">
                            <div className="total-info">
                              <span className="total-value">
                                {contribution.totalAmount.toLocaleString('tr-TR')}
                              </span>
                              <span className="total-unit">
                                {contribution.unit}
                              </span>
                            </div>
                          </td>
                          <td className="contribution-percentage">
                            <div className="percentage-info">
                              <span className={`percentage-badge ${getPercentageClass(contribution.contributionPercentage)}`}>
                                {formatContributionPercentage(contribution.contributionPercentage)}
                              </span>
                              <div className="percentage-bar">
                                <div 
                                  className="percentage-fill"
                                  style={{ width: `${Math.min(contribution.contributionPercentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <BarChart3 size={48} />
                  <h3>Katkı Verisi Bulunamadı</h3>
                  <p>Bu hedef için henüz katkı verisi bulunmuyor.</p>
                </div>
              )}

              {contributions.length > 0 && (
                <div className="contribution-summary">
                  <h4>Özet Bilgiler</h4>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <div className="summary-label">Toplam Katkı Merkezi</div>
                      <div className="summary-value">{contributions.length}</div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">Toplam Katkı Miktarı</div>
                      <div className="summary-value">
                        {contributions[0]?.totalAmount.toLocaleString('tr-TR')} {contributions[0]?.unit}
                      </div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">En Yüksek Katkı</div>
                      <div className="summary-value">
                        {Math.max(...contributions.map(c => c.contributionPercentage)).toFixed(2)}%
                      </div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">En Düşük Katkı</div>
                      <div className="summary-value">
                        {Math.min(...contributions.map(c => c.contributionPercentage)).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="modal-actions">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getPercentageClass = (percentage) => {
  if (percentage >= 50) return 'high';
  if (percentage >= 25) return 'medium';
  return 'low';
};

export default PerformanceContributionTable;