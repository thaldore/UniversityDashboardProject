import React, { useState, useEffect } from 'react';
import { X, Target, Save, AlertCircle, Users, Building } from 'lucide-react';
import performanceService from '../../services/api/performanceService';
import { validatePerformanceTarget } from '../../services/utils/performanceConstants';
import { useAuth } from '../../context/AuthContext';

const PerformanceTargetModal = ({ isOpen, onClose, onSuccess, target = null, isEdit = false, periodId = null, targetModalMode = 'user', selectedDepartment = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    targetName: '',
    description: '',
    periodId: periodId || null,
    departmentId: targetModalMode === 'department' ? (selectedDepartment?.departmentId || null) : null,
    userId: targetModalMode === 'user' ? (user?.id || null) : null,
    targetValue: 0,
    unit: '',
    weight: 0,
    direction: 1, // Positive
    assignedToUserId: targetModalMode === 'user' ? (user?.id || null) : null,
    assignedToDepartmentId: targetModalMode === 'department' ? (selectedDepartment?.departmentId || null) : null
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
      } else {
        // Yeni hedef oluştururken modal mode'a göre ayarla
        setFormData({
          targetName: '',
          description: '',
          periodId: periodId || null,
          departmentId: targetModalMode === 'department' ? (selectedDepartment?.departmentId || null) : null,
          userId: targetModalMode === 'user' ? (user?.id || null) : null,
          targetValue: 0,
          unit: '',
          weight: 0,
          direction: 1, // Positive
          assignedToUserId: targetModalMode === 'user' ? (user?.id || null) : null,
          assignedToDepartmentId: targetModalMode === 'department' ? (selectedDepartment?.departmentId || null) : null
        });
      }
    }
  }, [isOpen, isEdit, target, periodId, targetModalMode, selectedDepartment, user]);

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
      [name]: type === 'checkbox' ? checked : 
              (type === 'number' ? parseFloat(value) || 0 : 
               (name === 'direction' ? parseInt(value) : value))
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

      console.log('Hedef oluşturma formData:', formData);
      console.log('TargetModalMode:', targetModalMode);
      console.log('SelectedDepartment:', selectedDepartment);

      if (isEdit) {
        await performanceService.updatePerformanceTarget(target.targetId, formData);
      } else {
        await performanceService.createPerformanceTarget(formData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Performans hedefi kaydedilirken hata:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessages = ['Bir hata oluştu.'];
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.message) {
          errorMessages = [errorData.message];
        } else if (errorData.errors) {
          // Validation errors
          errorMessages = [];
          Object.keys(errorData.errors).forEach(key => {
            if (Array.isArray(errorData.errors[key])) {
              errorData.errors[key].forEach(err => {
                errorMessages.push(`${key}: ${err}`);
              });
            } else {
              errorMessages.push(`${key}: ${errorData.errors[key]}`);
            }
          });
        } else if (typeof errorData === 'string') {
          errorMessages = [errorData];
        }
      }
      
      setErrors(errorMessages);
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
            {isEdit ? 'Performans Hedefi Düzenle' : 
             targetModalMode === 'department' ? `Yeni Departman Hedefi - ${selectedDepartment?.departmentName}` : 'Yeni Performans Hedefi'}
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