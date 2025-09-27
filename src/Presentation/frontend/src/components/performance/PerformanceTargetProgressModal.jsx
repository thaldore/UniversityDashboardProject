import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Save, AlertCircle, Calendar } from 'lucide-react';
import performanceService from '../../services/api/performanceService';

const PerformanceTargetProgressModal = ({ isOpen, onClose, onSuccess, progress = null, isEdit = false, targetId = null }) => {
  const [formData, setFormData] = useState({
    targetId: targetId || null,
    progressValue: 0,
    progressDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (isEdit && progress) {
        setFormData({
          targetId: progress.targetId || targetId,
          progressValue: progress.progressValue || 0,
          progressDate: progress.progressDate ? new Date(progress.progressDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          notes: progress.notes || ''
        });
      } else {
        setFormData({
          targetId: targetId || null,
          progressValue: 0,
          progressDate: new Date().toISOString().split('T')[0],
          notes: ''
        });
      }

      if (targetId) {
        loadTarget();
      }
    }
  }, [isOpen, isEdit, progress, targetId]);

  const loadTarget = async () => {
    try {
      const response = await performanceService.getPerformanceTarget(targetId);
      setTarget(response.data);
    } catch (error) {
      console.error('Hedef yüklenirken hata:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      // FormData'yı hazırla
      const submitData = {
        ...formData,
        targetId: targetId || formData.targetId
      };

      console.log('Gönderilen veri:', submitData);

      if (isEdit) {
        await performanceService.updatePerformanceTargetProgress(progress.progressId, submitData);
      } else {
        await performanceService.createPerformanceTargetProgress(submitData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Performans hedef ilerlemesi kaydedilirken hata:', error);
      console.error('Hata detayı:', error.response?.data);
      setErrors([error.response?.data?.message || 'Bir hata oluştu.']);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            <TrendingUp className="icon" />
            {isEdit ? 'Hedef İlerlemesi Düzenle' : 'Yeni Hedef İlerlemesi'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {errors.length > 0 && (
            <div className="error-message">
              <AlertCircle size={20} />
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {target && (
            <div className="target-info">
              <h4>Hedef Bilgileri</h4>
              <div className="target-details">
                <div className="target-detail">
                  <strong>Hedef:</strong> {target.targetName}
                </div>
                <div className="target-detail">
                  <strong>Hedef Değeri:</strong> {target.targetValue} {target.unit}
                </div>
                <div className="target-detail">
                  <strong>Mevcut Değer:</strong> {target.actualValue || 0} {target.unit}
                </div>
                {target.actualValue && target.targetValue > 0 && (
                  <div className="target-detail">
                    <strong>Gerçekleşme Oranı:</strong> 
                    <span className={`completion-rate ${target.completionRate >= 100 ? 'success' : target.completionRate >= 80 ? 'warning' : 'danger'}`}>
                      {((target.actualValue / target.targetValue) * 100).toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="performance-progress-form">
            <div className="form-section">
              <h3>İlerleme Bilgileri</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label required">İlerleme Değeri</label>
                  <input
                    type="number"
                    name="progressValue"
                    value={formData.progressValue}
                    onChange={handleInputChange}
                    className="form-input"
                    step="0.01"
                    min="0"
                    required
                    placeholder="Gerçekleşen değeri girin"
                  />
                  {target && (
                    <small className="form-help">
                      Hedef: {target.targetValue} {target.unit}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">İlerleme Tarihi</label>
                  <input
                    type="date"
                    name="progressDate"
                    value={formData.progressDate}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notlar</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="İlerleme hakkında notlar..."
                  rows="4"
                />
              </div>

              {formData.progressValue > 0 && target && (
                <div className="progress-preview">
                  <h4>Önizleme</h4>
                  <div className="preview-details">
                    <div className="preview-detail">
                      <strong>Yeni Toplam Değer:</strong> 
                      {(target.actualValue || 0) + formData.progressValue} {target.unit}
                    </div>
                    <div className="preview-detail">
                      <strong>Yeni Gerçekleşme Oranı:</strong>
                      <span className={`completion-rate ${((target.actualValue || 0) + formData.progressValue) / target.targetValue * 100 >= 100 ? 'success' : ((target.actualValue || 0) + formData.progressValue) / target.targetValue * 100 >= 80 ? 'warning' : 'danger'}`}>
                        {(((target.actualValue || 0) + formData.progressValue) / target.targetValue * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={loading}
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner small" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {isEdit ? 'Güncelle' : 'Kaydet'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTargetProgressModal;