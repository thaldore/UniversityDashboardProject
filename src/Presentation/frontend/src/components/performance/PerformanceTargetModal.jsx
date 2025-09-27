import React, { useState, useEffect } from 'react';
import { X, Target, Save, AlertCircle, Users, Building } from 'lucide-react';
import performanceService from '../../services/api/performanceService';
import { validatePerformanceTarget } from '../../services/utils/performanceConstants';

const PerformanceTargetModal = ({ isOpen, onClose, onSuccess, target = null, isEdit = false, periodId = null }) => {
  const [formData, setFormData] = useState({
    targetName: '',
    description: '',
    periodId: periodId || null,
    departmentId: null,
    userId: null,
    targetValue: 0,
    unit: '',
    weight: 0,
    direction: 1, // Positive
    assignedToUserId: null,
    assignedToDepartmentId: null
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (isEdit && target) {
        setFormData({
          targetName: target.targetName || '',
          description: target.description || '',
          periodId: target.periodId || periodId,
          departmentId: target.departmentId || null,
          userId: target.userId || null,
          targetValue: target.targetValue || 0,
          unit: target.unit || '',
          weight: target.weight || 0,
          direction: target.direction || 1,
          assignedToUserId: target.assignedToUserId || null,
          assignedToDepartmentId: target.assignedToDepartmentId || null
        });
      }
    }
  }, [isOpen, isEdit, target, periodId]);

  const loadData = async () => {
    try {
      const [deptResponse, userResponse, periodResponse] = await Promise.all([
        performanceService.getAvailableDepartments(),
        performanceService.getAvailableUsers(),
        performanceService.getPerformancePeriods()
      ]);
      setDepartments(deptResponse.data);
      setUsers(userResponse.data);
      setPeriods(periodResponse.data);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const validationErrors = validatePerformanceTarget(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      if (isEdit) {
        await performanceService.updatePerformanceTarget(target.targetId, formData);
      } else {
        await performanceService.createPerformanceTarget(formData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Performans hedefi kaydedilirken hata:', error);
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
            <Target className="icon" />
            {isEdit ? 'Performans Hedefi Düzenle' : 'Yeni Performans Hedefi'}
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

          <form onSubmit={handleSubmit} className="performance-target-form">
            {/* Temel Bilgiler */}
            <div className="form-section">
              <h3>Temel Bilgiler</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label required">Hedef Adı</label>
                  <input
                    type="text"
                    name="targetName"
                    value={formData.targetName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Örn: Akademik Yayın Sayısı"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Açıklama</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Hedef hakkında detaylı açıklama..."
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Performans Dönemi</label>
                  <select
                    name="periodId"
                    value={formData.periodId || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    disabled={!!periodId}
                  >
                    <option value="">Dönem Seçin</option>
                    {periods.map(period => (
                      <option key={period.periodId} value={period.periodId}>
                        {period.periodName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Hedef Yönü</label>
                  <select
                    name="direction"
                    value={formData.direction}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value={1}>Pozitif (Artırım)</option>
                    <option value={2}>Negatif (Azaltım)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hedef Değerleri */}
            <div className="form-section">
              <h3>Hedef Değerleri</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label required">Hedef Değeri</label>
                  <input
                    type="number"
                    name="targetValue"
                    value={formData.targetValue}
                    onChange={handleInputChange}
                    className="form-input"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Birim</label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Örn: adet, TL, %"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Ağırlık (%)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="form-input"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Atama Bilgileri */}
            <div className="form-section">
              <h3>Atama Bilgileri</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Departman</label>
                  <select
                    name="departmentId"
                    value={formData.departmentId || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Departman Seçin</option>
                    {departments.map(dept => (
                      <option key={dept.departmentId} value={dept.departmentId}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Kullanıcı</label>
                  <select
                    name="userId"
                    value={formData.userId || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Kullanıcı Seçin</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Atanan Departman</label>
                  <select
                    name="assignedToDepartmentId"
                    value={formData.assignedToDepartmentId || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Departman Seçin</option>
                    {departments.map(dept => (
                      <option key={dept.departmentId} value={dept.departmentId}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Atanan Kullanıcı</label>
                  <select
                    name="assignedToUserId"
                    value={formData.assignedToUserId || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Kullanıcı Seçin</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
                    {isEdit ? 'Güncelle' : 'Oluştur'}
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

export default PerformanceTargetModal;