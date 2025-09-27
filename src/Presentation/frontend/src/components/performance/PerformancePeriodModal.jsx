import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Settings, Save, AlertCircle } from 'lucide-react';
import performanceService from '../../services/api/performanceService';
import { validatePerformancePeriod } from '../../services/utils/performanceConstants';

const PerformancePeriodModal = ({ isOpen, onClose, onSuccess, period = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    periodName: '',
    periodStartDate: '',
    periodEndDate: '',
    targetEntryStartDate: '',
    targetEntryEndDate: '',
    targetReviseStartDate: '',
    targetReviseEndDate: '',
    resultEntryStartDate: '',
    resultEntryEndDate: '',
    isActive: true,
    sendNotification: true,
    sendEmail: true,
    scorings: [],
    assignments: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (isEdit && period) {
        setFormData({
          periodName: period.periodName || '',
          periodStartDate: period.periodStartDate ? new Date(period.periodStartDate).toISOString().split('T')[0] : '',
          periodEndDate: period.periodEndDate ? new Date(period.periodEndDate).toISOString().split('T')[0] : '',
          targetEntryStartDate: period.targetEntryStartDate ? new Date(period.targetEntryStartDate).toISOString().split('T')[0] : '',
          targetEntryEndDate: period.targetEntryEndDate ? new Date(period.targetEntryEndDate).toISOString().split('T')[0] : '',
          targetReviseStartDate: period.targetReviseStartDate ? new Date(period.targetReviseStartDate).toISOString().split('T')[0] : '',
          targetReviseEndDate: period.targetReviseEndDate ? new Date(period.targetReviseEndDate).toISOString().split('T')[0] : '',
          resultEntryStartDate: period.resultEntryStartDate ? new Date(period.resultEntryStartDate).toISOString().split('T')[0] : '',
          resultEntryEndDate: period.resultEntryEndDate ? new Date(period.resultEntryEndDate).toISOString().split('T')[0] : '',
          isActive: period.isActive ?? true,
          sendNotification: period.sendNotification ?? true,
          sendEmail: period.sendEmail ?? true,
          scorings: period.scorings || [],
          assignments: period.assignments || []
        });
      }
    }
  }, [isOpen, isEdit, period]);

  const loadData = async () => {
    try {
      const [deptResponse, userResponse] = await Promise.all([
        performanceService.getAvailableDepartments(),
        performanceService.getAvailableUsers()
      ]);
      setDepartments(deptResponse.data);
      setUsers(userResponse.data);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addScoring = () => {
    setFormData(prev => ({
      ...prev,
      scorings: [...prev.scorings, {
        minValue: 0,
        maxValue: null,
        score: 0,
        letterGrade: '',
        isForNegativeTarget: false,
        displayOrder: prev.scorings.length + 1
      }]
    }));
  };

  const updateScoring = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      scorings: prev.scorings.map((scoring, i) => 
        i === index ? { ...scoring, [field]: value } : scoring
      )
    }));
  };

  const removeScoring = (index) => {
    setFormData(prev => ({
      ...prev,
      scorings: prev.scorings.filter((_, i) => i !== index)
    }));
  };

  const addAssignment = () => {
    setFormData(prev => ({
      ...prev,
      assignments: [...prev.assignments, {
        assignmentType: 1, // Department
        departmentId: null,
        userId: null,
        targetEntryUserId: null
      }]
    }));
  };

  const updateAssignment = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.map((assignment, i) => 
        i === index ? { ...assignment, [field]: value } : assignment
      )
    }));
  };

  const removeAssignment = (index) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const validationErrors = validatePerformancePeriod(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      if (isEdit) {
        await performanceService.updatePerformancePeriod(period.periodId, formData);
      } else {
        await performanceService.createPerformancePeriod(formData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Performans dönemi kaydedilirken hata:', error);
      setErrors([error.response?.data?.message || 'Bir hata oluştu.']);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2>
            <Calendar className="icon" />
            {isEdit ? 'Performans Dönemi Düzenle' : 'Yeni Performans Dönemi'}
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

          <form onSubmit={handleSubmit} className="performance-period-form">
            {/* Temel Bilgiler */}
            <div className="form-section">
              <h3>Temel Bilgiler</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label required">Performans Dönemi Adı</label>
                  <input
                    type="text"
                    name="periodName"
                    value={formData.periodName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Örn: 2024 Yılı Performans Dönemi"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Durum</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />
                      Aktif
                    </label>
                  </div>
                </div>
              </div>
            </div>

             {/* Performans Dönemi Tarihleri */}
             <div className="form-section">
               <h3>Performans Dönemi Tarihleri</h3>
               <div className="form-grid">
                 <div className="form-group">
                   <label className="form-label required">Performans Dönemi Başlangıç</label>
                   <input
                     type="date"
                     name="periodStartDate"
                     value={formData.periodStartDate}
                     onChange={handleInputChange}
                     className="form-input"
                     required
                   />
                 </div>

                 <div className="form-group">
                   <label className="form-label required">Performans Dönemi Bitiş</label>
                   <input
                     type="date"
                     name="periodEndDate"
                     value={formData.periodEndDate}
                     onChange={handleInputChange}
                     className="form-input"
                     required
                   />
                 </div>
               </div>
             </div>

             {/* Tarih Aralıkları */}
             <div className="form-section">
               <h3>Tarih Aralıkları</h3>
               <div className="date-range-grid">
                 <div className="date-range-section">
                   <h4>Hedef Giriş Dönemi</h4>
                   <div className="form-grid">
                     <div className="form-group">
                       <label className="form-label required">Başlangıç</label>
                       <input
                         type="date"
                         name="targetEntryStartDate"
                         value={formData.targetEntryStartDate}
                         onChange={handleInputChange}
                         className="form-input"
                         required
                       />
                     </div>
                     <div className="form-group">
                       <label className="form-label required">Bitiş</label>
                       <input
                         type="date"
                         name="targetEntryEndDate"
                         value={formData.targetEntryEndDate}
                         onChange={handleInputChange}
                         className="form-input"
                         required
                       />
                     </div>
                   </div>
                 </div>

                 <div className="date-range-section">
                   <h4>Hedef Revize Dönemi</h4>
                   <div className="form-grid">
                     <div className="form-group">
                       <label className="form-label required">Başlangıç</label>
                       <input
                         type="date"
                         name="targetReviseStartDate"
                         value={formData.targetReviseStartDate}
                         onChange={handleInputChange}
                         className="form-input"
                         required
                       />
                     </div>
                     <div className="form-group">
                       <label className="form-label required">Bitiş</label>
                       <input
                         type="date"
                         name="targetReviseEndDate"
                         value={formData.targetReviseEndDate}
                         onChange={handleInputChange}
                         className="form-input"
                         required
                       />
                     </div>
                   </div>
                 </div>

                 <div className="date-range-section">
                   <h4>Sonuç Giriş Dönemi</h4>
                   <div className="form-grid">
                     <div className="form-group">
                       <label className="form-label required">Başlangıç</label>
                       <input
                         type="date"
                         name="resultEntryStartDate"
                         value={formData.resultEntryStartDate}
                         onChange={handleInputChange}
                         className="form-input"
                         required
                       />
                     </div>
                     <div className="form-group">
                       <label className="form-label required">Bitiş</label>
                       <input
                         type="date"
                         name="resultEntryEndDate"
                         value={formData.resultEntryEndDate}
                         onChange={handleInputChange}
                         className="form-input"
                         required
                       />
                     </div>
                   </div>
                 </div>
               </div>
             </div>

            {/* Bildirim Ayarları */}
            <div className="form-section">
              <h3>Bildirim Ayarları</h3>
              <div className="form-grid">
                <div className="form-group">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="sendNotification"
                        checked={formData.sendNotification}
                        onChange={handleInputChange}
                      />
                      Bildirim Gönder
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="sendEmail"
                        checked={formData.sendEmail}
                        onChange={handleInputChange}
                      />
                      E-posta Gönder
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Puanlama Sistemi */}
            <div className="form-section">
              <h3>Puanlama Sistemi</h3>
              <div className="scoring-section">
                {formData.scorings.map((scoring, index) => (
                  <div key={index} className="scoring-item">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Minimum Değer</label>
                        <input
                          type="number"
                          value={scoring.minValue}
                          onChange={(e) => updateScoring(index, 'minValue', parseFloat(e.target.value) || 0)}
                          className="form-input"
                          step="0.01"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Maksimum Değer</label>
                        <input
                          type="number"
                          value={scoring.maxValue || ''}
                          onChange={(e) => updateScoring(index, 'maxValue', e.target.value ? parseFloat(e.target.value) : null)}
                          className="form-input"
                          step="0.01"
                          placeholder="Boş bırakılabilir"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Puan</label>
                        <input
                          type="number"
                          value={scoring.score}
                          onChange={(e) => updateScoring(index, 'score', parseFloat(e.target.value) || 0)}
                          className="form-input"
                          step="0.01"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Harf Notu</label>
                        <input
                          type="text"
                          value={scoring.letterGrade}
                          onChange={(e) => updateScoring(index, 'letterGrade', e.target.value)}
                          className="form-input"
                          placeholder="Örn: A, B, C"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Negatif Hedef İçin</label>
                        <div className="checkbox-group">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={scoring.isForNegativeTarget}
                              onChange={(e) => updateScoring(index, 'isForNegativeTarget', e.target.checked)}
                            />
                            Negatif hedef için kullan
                            </label>
                        </div>
                      </div>

                      <div className="form-group">
                        <button
                          type="button"
                          onClick={() => removeScoring(index)}
                          className="btn btn-danger btn-sm"
                        >
                          <X size={16} />
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addScoring}
                  className="btn btn-secondary"
                >
                  <Settings size={16} />
                  Puanlama Ekle
                </button>
              </div>
            </div>

            {/* Atamalar */}
            <div className="form-section">
              <h3>Atamalar</h3>
              <div className="assignment-section">
                {formData.assignments.map((assignment, index) => (
                  <div key={index} className="assignment-item">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Atama Tipi</label>
                        <select
                          value={assignment.assignmentType}
                          onChange={(e) => updateAssignment(index, 'assignmentType', parseInt(e.target.value))}
                          className="form-input"
                        >
                          <option value={1}>Departman</option>
                          <option value={2}>Kullanıcı</option>
                        </select>
                      </div>

                      {assignment.assignmentType === 1 && (
                        <div className="form-group">
                          <label className="form-label">Departman</label>
                          <select
                            value={assignment.departmentId || ''}
                            onChange={(e) => updateAssignment(index, 'departmentId', e.target.value ? parseInt(e.target.value) : null)}
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
                      )}

                      {assignment.assignmentType === 2 && (
                        <div className="form-group">
                          <label className="form-label">Kullanıcı</label>
                          <select
                            value={assignment.userId || ''}
                            onChange={(e) => updateAssignment(index, 'userId', e.target.value ? parseInt(e.target.value) : null)}
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
                      )}

                      <div className="form-group">
                        <button
                          type="button"
                          onClick={() => removeAssignment(index)}
                          className="btn btn-danger btn-sm"
                        >
                          <X size={16} />
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAssignment}
                  className="btn btn-secondary"
                >
                  <Users size={16} />
                  Atama Ekle
                </button>
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

export default PerformancePeriodModal;